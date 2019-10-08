//****************************************
// Helpers for the setting up a niweb-application element and a ni-virtual-instrument element
// National Instruments Copyright 2016
//****************************************
import { NIModelProvider } from '../../Framework/niModelProvider.js';
import { NI_SUPPORT } from '../../Framework/niSupport.js';
import { TestUpdateService } from '../../Framework/niTestUpdateService.js';
import { VIReferenceService as viReferenceService } from '../../Framework/niVIReferenceService.js';
import { WebApplicationModelsService as webApplicationModelsService } from '../../Framework/niWebApplicationModelService.js';
window.testHelpers = window.testHelpers || {};
window.testHelpers.createWebAppTestHelper = function () {
    'use strict';
    const VI_REF = '', VI_NAME = 'test.gvi', PARENT_ID_FOR_VI = '';
    let webAppElement, viElement, updateService;
    const installWebAppFixture = function (done) {
        if (typeof done !== 'function') {
            throw new Error('Must provide a done function to invoke when finished attaching to DOM');
        }
        if (webAppElement !== undefined || viElement !== undefined) {
            throw new Error('installWebAppFixture has already been called for this webAppTestHelper');
        }
        const webAppElements = document.querySelectorAll('ni-web-application');
        if (webAppElements.length !== 0) {
            throw new Error('No other ni-web-application elements should be present when creating the fixture');
        }
        const viElements = document.querySelectorAll('ni-virtual-instrument');
        if (viElements.length !== 0) {
            throw new Error('No other ni-virtual-instrument elements should be present when creating the fixture');
        }
        webAppElement = document.createElement('ni-web-application');
        webAppElement.testMode = true;
        viElement = document.createElement('ni-virtual-instrument');
        viElement.viName = VI_NAME;
        viElement.viRef = VI_REF;
        webAppElement.appendChild(viElement);
        // Wait for service state to go to Running
        webAppElement.addEventListener('service-state-changed', function waitForRunningListener(evt) {
            let webAppModel;
            if (evt.detail.serviceState === TestUpdateService.StateEnum.RUNNING) {
                webAppElement.removeEventListener('service-state-changed', waitForRunningListener);
                webAppModel = webApplicationModelsService.getModel(webAppElement);
                updateService = webAppModel.updateService;
                testHelpers.runAsync(done, function () {
                    // Need to call done asynchronously so intentionally left blank.
                });
            }
        });
        document.head.appendChild(webAppElement);
    };
    const getUpdateService = function () {
        const webAppModel = webApplicationModelsService.getModel(webAppElement);
        return webAppModel.updateService;
    };
    const getVIModelForFixture = function () {
        return viReferenceService.getVIModelByVIRef(VI_REF);
    };
    const removeWebAppFixture = function (done) {
        if (typeof done !== 'function') {
            throw new Error('Must provide a done function to invoke when finished attaching to DOM');
        }
        // Wait for service state to go from Running to Ready
        webAppElement.addEventListener('service-state-changed', function waitForReadyListener(evt) {
            if (evt.detail.serviceState === TestUpdateService.StateEnum.READY) {
                webAppElement.removeEventListener('service-state-changed', waitForReadyListener);
                webAppElement.parentNode.removeChild(webAppElement);
                webAppElement = undefined;
                viElement = undefined;
                updateService = undefined;
                testHelpers.runAsync(done, function () {
                    // Intentionaly left blank. Want done to execute asynchronously and leverage the runasync command
                });
            }
        });
        webAppElement.stop();
    };
    const createNIElement = function (settings, parentId) {
        if (updateService === undefined) {
            throw new Error('The method installWebAppFixture must be completed before createNIElement can be called');
        }
        const tagName = NIModelProvider.modelKindToTagName(settings.kind);
        const validParentId = (typeof parentId === 'string') ? parentId : PARENT_ID_FOR_VI;
        // Should run and attach the element to the DOM synchronously (and the element attachedCallback will not have run yet)
        updateService.windowCallbacks.addElement.call(undefined, settings, tagName, settings.niControlId, VI_REF, validParentId);
        const controlElements = NI_SUPPORT.queryAllControlsByNIControlId(VI_REF, settings.niControlId);
        return controlElements[0];
    };
    /**
     * Creates a hierarchy of NI elements based on a hierarchy of settings.
     *
     * The hierarchy is represented by an array of objects where the order is the order they are added to the DOM.
     * Each object consists of the element settings to use, and the id of the parent element for that object.
     * An undefined id will use the root id as the parent
     *
     *
     * Example 1. In order to create a hierarchy of elements of this shape:
     *
     *      parent -> child_1
     *             -> child_2
     *             -> child_3
     *             -> child_4
     *
     * elementsSettings has to be
     * [{currentSettings: parentSettings}, // no parentId will have the element use PARENT_ID_FOR_VI as the parent
     * {currentSettings: child_1_settings, parentId: parentId},
     * {currentSettings: child_2_settings, parentId: parentId},
     * {currentSettings: child_3_settings, parentId: parentId},
     * {currentSettings: child_4_settings, parentId: parentId}]
     *
     * Example 2. In order to create a hierarchy of elements of this shape:
     *
     *      parent -> child_1 -> child_1_1 -> child_1_1_1
     *
     * elementsSettings has to be
     * [{currentSettings: parentSettings}, // no parentId will have the element use PARENT_ID_FOR_VI as the parent
     * {currentSettings: child_1_settings, parentId: parentId},
     * {currentSettings: child_1_1_settings, parentId: child_1_Id},
     * {currentSettings: child_1_1_1_settings, parentId: child_1_1_Id}]
     *
     * Example 3. In order to create a hierarchy of elements of this shape:
     *
     *      parent -> child_1
     *             -> child_2 -> child_2_1
     *                        -> child_2_2
     *             -> child_3
     *
     * elementSettings has to be
     * [{currentSettings: parentSettings}, // no parentId will have the element use PARENT_ID_FOR_VI as the parent
     * {currentSettings: child_1_settings, parentId: parentId},
     * {currentSettings: child_2_settings, parentId: parentId},
     * {currentSettings: child_2_1_settings, parentId: child_2_Id},
     * {currentSettings: child_2_2_settings, parentId: child_2_Id},
     * {currentSettings: child_3_settings, parentId: parentId}]
     *
     * @param {array} elementsSettings - The settings.
     */
    const createNIElementHierarchy = function (elementsSettings, done) {
        const addNextElement = function (done, elementsSettings, elementSettingsIndex) {
            createNIElement(elementsSettings[elementSettingsIndex].currentSettings, elementsSettings[elementSettingsIndex].parentId);
            if (elementSettingsIndex < elementsSettings.length - 1) {
                testHelpers.runAsyncScheduler(function () {
                    addNextElement(done, elementsSettings, elementSettingsIndex + 1);
                });
            }
            else if (elementSettingsIndex === elementsSettings.length - 1) {
                testHelpers.runAsyncScheduler(function () {
                    done();
                });
            }
            else {
                throw new Error('Problem creating hierarchy of elements');
            }
        };
        testHelpers.runAsyncScheduler(function () {
            addNextElement(done, elementsSettings, 0);
        });
    };
    const appendElement = function (tag, settings, parent) {
        const axisElementStr = '<' + tag + ' ' +
            Object.keys(settings).map(function (key) {
                if (typeof settings[key] === 'boolean') {
                    return settings[key] ? key : '';
                }
                else {
                    return key + '=' + settings[key];
                }
            }).join(' ') +
            '></' + tag + '>';
        NationalInstruments.Globals.jQuery(parent).append(axisElementStr);
    };
    const removeNIElement = function (niControlId) {
        if (updateService === undefined) {
            throw new Error('The method installWebAppFixture must be completed before createNIElement can be called');
        }
        if (typeof niControlId !== 'string') {
            throw new Error('Expected niControlId to be a string');
        }
        updateService.windowCallbacks.removeElement.call(undefined, niControlId, VI_REF);
    };
    const dispatchMessage = function (niControlId, updateSettings) {
        if (updateService === undefined) {
            throw new Error('The method installWebAppFixture must be completed before createNIElement can be called');
        }
        if (typeof niControlId !== 'string') {
            throw new Error('Expected niControlId to be a string');
        }
        if (typeof updateSettings !== 'object' || updateSettings === null) {
            throw new Error('Expected updateSettings to be an object with multiple properties to update on the target');
        }
        updateService.windowCallbacks.propertyChange.call(undefined, VI_NAME, niControlId, updateSettings);
    };
    return {
        installWebAppFixture: installWebAppFixture,
        createNIElement: createNIElement,
        removeNIElement: removeNIElement,
        createNIElementHierarchy: createNIElementHierarchy,
        dispatchMessage: dispatchMessage,
        removeWebAppFixture: removeWebAppFixture,
        getVIModelForFixture: getVIModelForFixture,
        appendElement: appendElement,
        getUpdateService: getUpdateService
    };
};
//# sourceMappingURL=webAppTestHelper.js.map