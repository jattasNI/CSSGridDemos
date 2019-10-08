//**********************************************************
// Test Helper JS for the DataPackingRoundTripTests to call into
// so that the JS controls can trigger a value update back into C#.
// To enable these hooks the C# test would have first call the enableTestHooks
// windowEngineCallback which would add the other callbacks to the window engine
// call back list so that the C# side can now call them. When its done the C# test
// will call disbaleTestHooks so that these test helpers are no longer available.
// National Instruments Copyright 2015
//**********************************************************
import { EditorRuntimeUpdateService } from './niEditorRuntimeUpdateService.js';
import { NIPackedDataAdaptors } from './PackedData/niPackedDataAdaptors.js';
import { WebApplicationModelsService as NIWebApplicationModelsService } from './niWebApplicationModelService.js';
const browserMessageEnum = Object.freeze({
    ENABLE_TEST_HOOKS: 'enableTestHooks',
    DISABLE_TEST_HOOKS: 'disableTestHooks',
    TRIGGER_CONTROL_CHANGED: 'triggerControlChanged',
    UNPACK_PACK_USING_STRING_CONTROL: 'unpackPackUsingStringControl'
});
class EditorRuntimeTestHooks {
    /* global browserMessaging:false */
    constructor() {
        this.windowEngineCallbacks = {
            triggerControlChanged: undefined,
            unpackPackUsingStringControl: undefined
        };
        this._slowTheScriptToEnableChromeDebuggerAttach = false;
        this._scriptDelayInMs = 0;
    }
    async checkAndDelayExecutionForDebugging() {
        if (this._slowTheScriptToEnableChromeDebuggerAttach) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, this._scriptDelayInMs);
            });
        }
    }
    start() {
        const that = this;
        this.windowEngineCallbacks.triggerControlChanged = async function (argsArr) {
            await that.checkAndDelayExecutionForDebugging();
            const cookie = argsArr[0], viName = argsArr[1], controlId = argsArr[2], valuePropertyName = argsArr[3];
            const webAppElement = document.querySelector('ni-web-application');
            const updateService = NIWebApplicationModelsService.getModel(webAppElement).updateService;
            const viModels = updateService.getVIModels();
            const viModel = viModels[viName];
            const controlModel = viModel.controlModels[controlId];
            if (cookie !== 0) {
                window.engine.trigger(EditorRuntimeUpdateService.BrowserMessagesEnum.SET_CALL_RESPONSE, cookie, 1);
            }
            updateService.controlChanged(viModel, controlModel, valuePropertyName, controlModel[valuePropertyName]);
        };
        this.windowEngineCallbacks.unpackPackUsingStringControl = async function (argsArr) {
            await that.checkAndDelayExecutionForDebugging();
            const cookie = argsArr[0], memoryId = argsArr[1], startPosition = argsArr[2], bufferLength = argsArr[3], niType = new window.NIType(argsArr[4]), viName = argsArr[5], controlId = argsArr[6];
            // Unpack data present in the FlatBuffer at memoryId
            const response = browserMessaging.getSharedData(memoryId);
            const view = new Uint8Array(response, startPosition, bufferLength);
            const newValue = NIPackedDataAdaptors.GetDataAdaptorFromPackedValue(view, niType).unpack();
            // Pack the value back into the same memoryId
            const packedData = NIPackedDataAdaptors.PackData(newValue, niType);
            const transferBuffer = browserMessaging.getSharedData(memoryId, packedData.length);
            new Uint8Array(transferBuffer).set(packedData);
            const sharedDataId = browserMessaging.getSharedDataId(transferBuffer);
            // Update the string control with the memoryId where the re-packed value has been placed.
            const updateService = NIWebApplicationModelsService.getModel(document.querySelector('ni-web-application')).updateService;
            const viModel = updateService.getVIModels()[viName];
            const controlModel = viModel.controlModels[controlId];
            controlModel['text'] = sharedDataId;
            if (cookie !== 0) {
                window.engine.trigger(EditorRuntimeUpdateService.BrowserMessagesEnum.SET_CALL_RESPONSE, cookie, 1);
            }
            updateService.controlChanged(viModel, controlModel, 'text', newValue);
        };
        window.engine.on(browserMessageEnum.TRIGGER_CONTROL_CHANGED, this.windowEngineCallbacks.triggerControlChanged);
        window.engine.on(browserMessageEnum.UNPACK_PACK_USING_STRING_CONTROL, this.windowEngineCallbacks.unpackPackUsingStringControl);
    }
    stop() {
        window.engine.off(browserMessageEnum.TRIGGER_CONTROL_CHANGED, this.windowEngineCallbacks.triggerControlChanged);
        window.engine.off(browserMessageEnum.UNPACK_PACK_USING_STRING_CONTROL, this.windowEngineCallbacks.unpackPackUsingStringControl);
        this.windowEngineCallbacks.triggerControlChanged = undefined;
        this.windowEngineCallbacks.unpackPackUsingStringControl = undefined;
    }
}
const editorRuntimeTestHooks = new EditorRuntimeTestHooks();
const enableTestHooks = (argsArr) => {
    editorRuntimeTestHooks.start();
    const cookie = argsArr[0];
    if (cookie !== 0) {
        window.engine.trigger(EditorRuntimeUpdateService.BrowserMessagesEnum.SET_CALL_RESPONSE, cookie, 1);
    }
};
const disableTestHooks = (argsArr) => {
    editorRuntimeTestHooks.stop();
    const cookie = argsArr[0];
    if (cookie !== 0) {
        window.engine.trigger(EditorRuntimeUpdateService.BrowserMessagesEnum.SET_CALL_RESPONSE, cookie, 1);
    }
};
if (window.engine !== undefined) {
    window.engine.on(browserMessageEnum.ENABLE_TEST_HOOKS, enableTestHooks);
    window.engine.on(browserMessageEnum.DISABLE_TEST_HOOKS, disableTestHooks);
}
//# sourceMappingURL=niEditorRuntimeTestHooks.js.map