"use strict";
//**********************************************
// Helpers to simulate value-changed events
// National Instruments Copyright 2018
//**********************************************
window.testHelpers = window.testHelpers || {};
window.testHelpers.createValueChangedSimulator = function () {
    'use strict';
    const getControlModelFromDataItem = function (viModel, dataItem) {
        const controlModels = viModel.getAllControlModels();
        for (const controlId in controlModels) {
            const bindingInfo = controlModels[controlId].getEditorRuntimeBindingInfo();
            if (bindingInfo !== undefined && bindingInfo.dataItem === dataItem) {
                return controlModels[controlId];
            }
        }
        return undefined;
    };
    const simulateNewValueEventFromDataItem = function (viModel, dataItem, newValue) {
        const controlModel = getControlModelFromDataItem(viModel, dataItem);
        if (controlModel.controlChanged.length !== 1) {
            throw new Error('This function can only simulate for models that take a single newValue');
        }
        controlModel.controlChanged(newValue);
    };
    const simulateNewValueEvent = function (viModel, controlId, newValue) {
        const controlModel = viModel.getAllControlModels()[controlId];
        if (controlModel.controlChanged.length !== 1) {
            throw new Error('This function can only simulate for models that take a single newValue');
        }
        controlModel.controlChanged(newValue);
    };
    const simulateNewAndOldValueEventFromDataItem = function (viModel, dataItem, newValue, oldValue) {
        const controlModel = getControlModelFromDataItem(viModel, dataItem);
        if (controlModel.controlChanged.length !== 2) {
            throw new Error('This function can only simulate for models that take both a newValue and an oldValue');
        }
        controlModel.controlChanged(newValue, oldValue);
    };
    const simulateNewAndOldValueEventWithPropertyName = function (viModel, controlId, propertyName, newValue, oldValue) {
        const controlModel = viModel.getAllControlModels()[controlId];
        if (controlModel.controlChanged.length !== 3) {
            throw new Error('This function can only simulate for models that take a propertyName, a newValue, and an oldValue');
        }
        controlModel.controlChanged(propertyName, newValue, oldValue);
    };
    return {
        getControlModelFromDataItem: getControlModelFromDataItem,
        simulateNewValueEvent: simulateNewValueEvent,
        simulateNewValueEventFromDataItem: simulateNewValueEventFromDataItem,
        simulateNewAndOldValueEventFromDataItem: simulateNewAndOldValueEventFromDataItem,
        simulateNewAndOldValueEventWithPropertyName: simulateNewAndOldValueEventWithPropertyName
    };
};
//# sourceMappingURL=valueChangedSimulatorHelper.js.map