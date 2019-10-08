//**********************************************************
// Service that handles interaction with a Remote source
// National Instruments Copyright 2019
//**********************************************************
import { ControlDCOIndexCache } from './niControlDCOIndexCache.js';
import { LabVIEWPropertyError } from './LabVIEWPropertyError.js';
import { NationalInstruments as NIFlatBuffersInterop } from './Interop_generated.js';
import { NationalInstruments as NIFlatBuffersRemote } from './RemotePanelProtocol_generated.js';
import { NIPackedDataAdaptors } from './PackedData/niPackedDataAdaptors.js';
import { NI_SUPPORT } from './niSupport.js';
import { RenderEngine } from './niRenderEngine.js';
import { UpdateService } from './niUpdateService.js';
import { WebApplicationStates } from './niWebApplicationStates.js';
const messageTypeEnum = Object.freeze({
    PROPERTY_UPDATE: 'PROPERTY_UPDATE',
    VERSION_MESSAGE: 'VERSION_MESSAGE',
    VI_STATE_UPDATE: 'VI_STATE_UPDATE',
    BATCH_UPDATE: 'BATCH_UPDATE'
});
const stateEnum = Object.freeze(Object.assign({}, WebApplicationStates.ServiceStateEnum, {
    INITIALIZING: 'INITIALIZING',
    INITIALCONNECTION: 'INITIALCONNECTION',
    CONNECTING: 'CONNECTING',
    CONNECTED: 'CONNECTED',
    RECONNECTING: 'RECONNECTING'
}));
export class RemoteUpdateService extends UpdateService {
    /* global flatbuffers:false */
    constructor(config) {
        super(config);
        // Public Instance Properties
        this.remoteAddress = config.remoteAddress;
        this.dcoIndexCache = undefined;
        this.enableEvents = true;
        this.socket = undefined;
        this.pendingDataRequests = new Map();
        this.preferredVersion = {
            majorVersion: 0,
            minorVersion: 1,
            patchVersion: 0,
            preReleaseVersion: 'preAlpha',
            versionMetadata: 'testMetadata'
        };
        this.serverVersion = {
            majorVersion: undefined,
            minorVersion: undefined,
            patchVersion: undefined,
            preReleaseVersion: undefined,
            versionMetadata: undefined
        };
        this.socketCallbacks = {
            open: undefined,
            message: undefined,
            close: undefined,
            error: undefined
        };
    }
    static get MessageTypeEnum() {
        return messageTypeEnum;
    }
    static get StateEnum() {
        return stateEnum;
    }
    // static private
    static createPropertyUpdateMessage(viModel, controlModel, newValue, _oldValue) {
        const remoteBindingInfo = controlModel.getRemoteBindingInfo();
        const messageObject = {
            messageType: MESSAGE_TYPE_ENUM.PROPERTY_UPDATE,
            viName: viModel.viName,
            dcoIndex: remoteBindingInfo.dco,
            data: {
                value: newValue
            }
        };
        const messageString = JSON.stringify(messageObject);
        return messageString;
    }
    // static private
    static createVersionMessage(preferredVersion) {
        const messageObject = {
            messageType: MESSAGE_TYPE_ENUM.VERSION_MESSAGE,
            version: preferredVersion
        };
        const messageString = JSON.stringify(messageObject);
        return messageString;
    }
    // static private
    static parseWebSocketMessage(messageString) {
        let messageObject;
        try {
            messageObject = JSON.parse(messageString);
        }
        catch (err) {
            NI_SUPPORT.error('Error parsing message: ' + err.message);
            messageObject = {};
        }
        return messageObject;
    }
    isValidServiceState(state) {
        // Child states merged with parent states so only need to check child
        const isValidState = SERVICE_STATE_ENUM[state] !== undefined;
        return isValidState;
    }
    initialize() {
        const that = this;
        super.initialize(SERVICE_STATE_ENUM.UNINITIALIZED, undefined);
        // Save references to the callback functions so they can be added and removed
        that.socketCallbacks.open = function (evt) {
            that.socketOpen(evt);
        };
        that.socketCallbacks.message = function (evt) {
            that.socketMessage(evt);
        };
        that.socketCallbacks.close = function (evt) {
            that.socketClose(evt);
        };
        that.socketCallbacks.error = function (evt) {
            that.socketError(evt);
        };
        that.setServiceState(SERVICE_STATE_ENUM.INITIALIZING);
    }
    finishInitializing() {
        super.finishInitializing(SERVICE_STATE_ENUM.INITIALIZING);
        this.dcoIndexCache = new ControlDCOIndexCache(this.getVIModels());
        this.setServiceState(SERVICE_STATE_ENUM.READY);
    }
    start() {
        const that = this;
        super.start(SERVICE_STATE_ENUM.READY);
        setTimeout(function () {
            that.setupConnection();
        }, 0);
        that.setServiceState(SERVICE_STATE_ENUM.INITIALCONNECTION);
    }
    setupConnection() {
        this.verifyServiceStateIs([SERVICE_STATE_ENUM.INITIALCONNECTION, SERVICE_STATE_ENUM.RECONNECTING]);
        this.createSocket();
        this.setServiceState(SERVICE_STATE_ENUM.CONNECTING);
    }
    stop() {
        const that = this;
        super.stop([SERVICE_STATE_ENUM.CONNECTING, SERVICE_STATE_ENUM.CONNECTED]);
        this.removeSocket();
        that.setServiceState(SERVICE_STATE_ENUM.READY);
    }
    socketOpen() {
        this.verifyServiceStateIs(SERVICE_STATE_ENUM.CONNECTING);
        // Send handshake message
        const messageString = RemoteUpdateService.createVersionMessage(this.preferredVersion);
        this.socket.send(messageString);
    }
    socketMessage(evt) {
        if (evt.data instanceof ArrayBuffer) {
            this.handleRemotePanelUpdate(evt.data);
        }
        else {
            let remoteBindingInfo, data;
            const messageObject = RemoteUpdateService.parseWebSocketMessage(evt.data);
            switch (messageObject.messageType) {
                case MESSAGE_TYPE_ENUM.VERSION_MESSAGE:
                    this.verifyServiceStateIs(SERVICE_STATE_ENUM.CONNECTING);
                    this.serverVersion = messageObject.version;
                    if (this.preferredVersion.majorVersion !== this.serverVersion.majorVersion) {
                        NI_SUPPORT.error('HTML Panel cannot connect to server with incompatible version');
                        this.stop();
                    }
                    else {
                        this.setServiceState(SERVICE_STATE_ENUM.CONNECTED);
                    }
                    this.sendStartVI();
                    break;
                case MESSAGE_TYPE_ENUM.PROPERTY_UPDATE:
                    this.verifyServiceStateIs(SERVICE_STATE_ENUM.CONNECTED);
                    remoteBindingInfo = this.dcoIndexCache.getRemoteBindingInfo(messageObject.viName, messageObject.dcoIndex);
                    data = {};
                    data[remoteBindingInfo.prop] = messageObject.data.value;
                    this.dispatchMessageToHTMLPanel(messageObject.viName, remoteBindingInfo.controlId, data);
                    break;
                case MESSAGE_TYPE_ENUM.VI_STATE_UPDATE:
                    this.verifyServiceStateIs(SERVICE_STATE_ENUM.CONNECTED);
                    NI_SUPPORT.error('VI State update is not implemented');
                    break;
                default:
                    NI_SUPPORT.error('Unknown message format or type: ' + evt.data);
                    this.setServiceState(SERVICE_STATE_ENUM.ERROR);
                    break;
            }
        }
    }
    async handleRemotePanelUpdate(updateData) {
        const view = new Uint8Array(updateData);
        const buffer = new flatbuffers.ByteBuffer(view);
        const panelUpdate = NIFlatBuffersRemote.Web.RemotePanel.RemotePanelUpdate.getRootAsRemotePanelUpdate(buffer);
        const requestType = panelUpdate.requestType();
        let responseResult;
        if (requestType === NIFlatBuffersRemote.Web.RemotePanel.RemotePanelUpdateType.SetPropertyValue) {
            const setPropertyData = panelUpdate.request(new NIFlatBuffersRemote.Web.RemotePanel.SetPropertyValue());
            this.setGPropertyValue(setPropertyData.docName(), setPropertyData.runtimeId(), setPropertyData.propertyName(), setPropertyData.propertyJson());
        }
        else if (requestType === NIFlatBuffersRemote.Web.RemotePanel.RemotePanelUpdateType.RootedBatchUpdate) {
            const batchUpdate = panelUpdate.request(new NIFlatBuffersRemote.Web.RemotePanel.RootedBatchUpdate());
            const batchData = batchUpdate.batchBufferArray();
            await this.batchUpdate(batchData);
        }
        else if (requestType === NIFlatBuffersRemote.Web.RemotePanel.RemotePanelUpdateType.DataRequestReady) {
            const dataReady = panelUpdate.request(new NIFlatBuffersRemote.Web.RemotePanel.DataRequestReady());
            this.onBatchDataReady(dataReady.memoryId(), dataReady.bufferArray());
        }
        else if (requestType === NIFlatBuffersRemote.Web.RemotePanel.RemotePanelUpdateType.GetPropertyValue) {
            const getPropertyData = panelUpdate.request(new NIFlatBuffersRemote.Web.RemotePanel.GetPropertyValue());
            responseResult = await this.getGPropertyValue(getPropertyData.docName(), getPropertyData.runtimeId(), getPropertyData.propertyName());
        }
        const responseId = panelUpdate.responseId();
        if (responseId !== undefined && responseId !== null && responseId.length !== 0) {
            this.setUpdateResponse(responseId, responseResult);
        }
    }
    async getGPropertyValue(viName, controlId, gPropertyName) {
        await RenderEngine.waitForFrameUpdate();
        try {
            const viModel = this.getVIModelByName(viName);
            return await viModel.processControlUpdateToGetGPropertyValue(controlId, gPropertyName);
        }
        catch (error) {
            /*
                * Currently we are swallowing the errors(LabVIEWPropertyError) thrown by property get and set methods.
                * Work item #181019 is created to handle these errors and propagate them to the diagram.
                * Link - https://ni.visualstudio.com/DevCentral/_workitems/edit/181019
                */
            if (!(error instanceof LabVIEWPropertyError)) {
                throw error;
            }
        }
    }
    setGPropertyValue(viName, controlId, propertyName, propertyValue) {
        try {
            const viModel = this.getVIModelByName(viName);
            viModel.processControlUpdateToSetGPropertyValue(controlId, propertyName, JSON.parse(propertyValue));
        }
        catch (error) {
            /*
                * Currently we are swallowing the errors(LabVIEWPropertyError) thrown by property get and set methods.
                * Work item #181019 is created to handle these errors and propagate them to the diagram.
                * Link - https://ni.visualstudio.com/DevCentral/_workitems/edit/181019
                */
            if (!(error instanceof LabVIEWPropertyError)) {
                throw error;
            }
        }
    }
    setUpdateResponse(responseId, responseResult) {
        const builder = new flatbuffers.Builder(1024);
        const responseIdOffset = builder.createString(responseId);
        let responseResultOffset = 0;
        if (responseResult !== undefined) {
            responseResultOffset = builder.createString(responseResult.toString());
        }
        const offset = NIFlatBuffersRemote.Web.RemotePanel.RemotePanelUpdateResponse.createRemotePanelUpdateResponse(builder, responseIdOffset, responseResultOffset, 0);
        const requestOffset = NIFlatBuffersRemote.Web.RemotePanel.RemotePanelRequest.createRemotePanelRequest(builder, NIFlatBuffersRemote.Web.RemotePanel.RemotePanelRequestType.RemotePanelUpdateResponse, offset);
        builder.finish(requestOffset);
        const responseArray = builder.asUint8Array();
        this.socket.send(responseArray);
    }
    sendStartVI() {
        const builder = new flatbuffers.Builder(1024);
        const viModels = this.getVIModels();
        const viModelName = Object.keys(viModels)[0];
        const viNameOffset = builder.createString(viModelName);
        const offset = NIFlatBuffersRemote.Web.RemotePanel.RemotePanelConnect.createRemotePanelConnect(builder, viNameOffset);
        const requestOffset = NIFlatBuffersRemote.Web.RemotePanel.RemotePanelRequest.createRemotePanelRequest(builder, NIFlatBuffersRemote.Web.RemotePanel.RemotePanelRequestType.RemotePanelConnect, offset);
        builder.finish(requestOffset);
        const responseArray = builder.asUint8Array();
        this.socket.send(responseArray);
    }
    onBatchDataReady(memoryId, data) {
        const key = memoryId;
        const dataRequest = this.pendingDataRequests.get(key);
        this.pendingDataRequests.delete(key);
        dataRequest(data);
    }
    async makeDataRequest(memoryId, startPosition, bufferLength) {
        return new Promise((resolve, reject) => {
            const key = memoryId;
            this.pendingDataRequests.set(key, resolve);
            const builder = new flatbuffers.Builder(1024);
            const memoryIdOffset = builder.createString(memoryId);
            const offset = NIFlatBuffersRemote.Web.RemotePanel.RemotePanelRequestData.createRemotePanelRequestData(builder, memoryIdOffset, startPosition, bufferLength);
            const requestOffset = NIFlatBuffersRemote.Web.RemotePanel.RemotePanelRequest.createRemotePanelRequest(builder, NIFlatBuffersRemote.Web.RemotePanel.RemotePanelRequestType.RemotePanelRequestData, offset);
            builder.finish(requestOffset);
            const responseArray = builder.asUint8Array();
            this.socket.send(responseArray);
        });
    }
    async batchUpdate(batchData) {
        try {
            const buffer = new flatbuffers.ByteBuffer(batchData);
            const batch = NIFlatBuffersInterop.Web.Interop.Batch.getRootAsBatch(buffer);
            const numItems = batch.itemsLength();
            const viName = batch.docName();
            for (let x = 0; x < numItems; ++x) {
                const batchItem = batch.items(x);
                const updateType = batchItem.dataType();
                if (updateType === NIFlatBuffersInterop.Web.Interop.UpdateData.BatchUpdateFromBuffer) {
                    await this.batchUpdateFromBuffer(batchItem, viName);
                }
                else if (updateType === NIFlatBuffersInterop.Web.Interop.UpdateData.BatchUpdateFromOffset) {
                    this.batchUpdateFromOffset(batchItem, viName);
                }
                else if (updateType === NIFlatBuffersInterop.Web.Interop.UpdateData.BatchUpdateFromJson) {
                    this.batchUpdateFromJson(batchItem, viName);
                }
            }
        }
        catch (error) {
            NI_SUPPORT.error(error.toString());
        }
    }
    async batchUpdateFromBuffer(batchItem, viName) {
        const propertyName = batchItem.propertyName();
        const controlId = batchItem.runtimeId();
        const batchData = batchItem.data(new NIFlatBuffersInterop.Web.Interop.BatchUpdateFromBuffer());
        const memoryId = batchData.memoryId();
        const startPosition = batchData.position();
        const bufferLength = batchData.length();
        const response = await this.makeDataRequest(memoryId, startPosition, bufferLength);
        const view = response.slice(startPosition, bufferLength);
        const viModel = this.getVIModels()[viName];
        const controlModel = viModel.controlModels[controlId];
        controlModel.throwIfPropertyTypeIsUndefined(propertyName);
        const propertyType = controlModel.gPropertyNIType(propertyName);
        const gPropertyValue = NIPackedDataAdaptors.GetDataAdaptorFromPackedValue(view, propertyType).unpack();
        viModel.processControlUpdateToSetGPropertyValue(controlId, propertyName, gPropertyValue);
    }
    batchUpdateFromOffset(batchItem, viName) {
        const propertyName = batchItem.propertyName();
        const controlId = batchItem.runtimeId();
        const batchData = batchItem.data(new NIFlatBuffersInterop.Web.Interop.BatchUpdateFromOffset());
        const bufferValue = batchData.data(new NIFlatBuffersInterop.Web.Interop.UnknownTable());
        const viModel = this.getVIModels()[viName];
        const controlModel = viModel.controlModels[controlId];
        controlModel.throwIfPropertyTypeIsUndefined(propertyName);
        const propertyType = controlModel.gPropertyNIType(propertyName);
        const gPropertyValue = NIPackedDataAdaptors.GetDataAdaptorFromIndex(bufferValue, propertyType).unpack();
        viModel.processControlUpdateToSetGPropertyValue(controlId, propertyName, gPropertyValue);
    }
    batchUpdateFromJson(batchItem, viName) {
        const propertyName = batchItem.propertyName();
        const controlId = batchItem.runtimeId();
        const batchData = batchItem.data(new NIFlatBuffersInterop.Web.Interop.BatchUpdateFromJson());
        const json = batchData.propertyJson();
        const value = JSON.parse(json);
        const viModel = this.getVIModels()[viName];
        viModel.processControlUpdateToSetGPropertyValue(controlId, propertyName, value);
    }
    // Called by the WebAppModel
    controlChanged(viModel, controlModel, propertyName, newValue, _oldValue) {
        controlModel = controlModel.findTopLevelControl();
        if (controlModel.bindingInfo.prop === propertyName && controlModel.bindingInfo.dataItem !== '') {
            newValue = controlModel[propertyName];
        }
        const propertyType = controlModel.gPropertyNIType(propertyName);
        if (propertyType !== undefined) {
            const modelIdentifier = controlModel.niControlId;
            const sharedData = NIPackedDataAdaptors.PackData(newValue, propertyType);
            const builder = new flatbuffers.Builder(1024);
            const definitionNameOffset = builder.createString(viModel.viName);
            const propertyNameOffset = builder.createString(propertyName);
            const valueOffset = NIFlatBuffersRemote.Web.RemotePanel.RemotePanelControlChanged.createValueVector(builder, sharedData);
            const offset = NIFlatBuffersRemote.Web.RemotePanel.RemotePanelControlChanged.createRemotePanelControlChanged(builder, definitionNameOffset, modelIdentifier, propertyNameOffset, valueOffset);
            const requestOffset = NIFlatBuffersRemote.Web.RemotePanel.RemotePanelRequest.createRemotePanelRequest(builder, NIFlatBuffersRemote.Web.RemotePanel.RemotePanelRequestType.RemotePanelControlChanged, offset);
            builder.finish(requestOffset);
            const responseArray = builder.asUint8Array();
            this.socket.send(responseArray);
        }
    }
    controlEventOccurred(viModel, controlModel, eventName, eventData) {
        if (this.socket !== null) {
            controlModel = controlModel.findTopLevelControl();
            const modelIdentifier = controlModel.niControlId;
            const messageObject = {
                messageType: 'controlEventOccurred',
                viName: viModel.viName,
                controlId: modelIdentifier,
                eventType: eventName,
                eventData: eventData
            };
            const messageString = JSON.stringify(messageObject);
            this.socket.send(messageString);
        }
    }
    socketClose() {
        this.reconnect();
    }
    socketError(evt) {
        NI_SUPPORT.error('Socket Error', evt);
        this.reconnect();
    }
    reconnect() {
        const that = this;
        that.verifyServiceStateIs([SERVICE_STATE_ENUM.CONNECTING, SERVICE_STATE_ENUM.CONNECTED]);
        // Synchronously remove the socket when an error occurs to prevent further errors
        that.removeSocket();
        // Asynchronously setuoConnecton to allow state change propagation
        setTimeout(function () {
            that.setupConnection();
        }, 0);
        that.setServiceState(SERVICE_STATE_ENUM.RECONNECTING);
    }
    createSocket() {
        this.socket = new WebSocket('ws://' + window.location.hostname + this.remoteAddress);
        this.socket.binaryType = "arraybuffer";
        this.socket.addEventListener('open', this.socketCallbacks.open);
        this.socket.addEventListener('message', this.socketCallbacks.message);
        this.socket.addEventListener('close', this.socketCallbacks.close);
        this.socket.addEventListener('error', this.socketCallbacks.error);
    }
    removeSocket() {
        if (this.socket !== undefined) {
            this.socket.removeEventListener('open', this.socketCallbacks.open);
            this.socket.removeEventListener('message', this.socketCallbacks.message);
            this.socket.removeEventListener('close', this.socketCallbacks.close);
            this.socket.removeEventListener('error', this.socketCallbacks.error);
            this.socket.close();
            this.socket = undefined;
        }
    }
}
const SERVICE_STATE_ENUM = RemoteUpdateService.StateEnum;
const MESSAGE_TYPE_ENUM = RemoteUpdateService.MessageTypeEnum;
//# sourceMappingURL=niRemoteUpdateService.js.map