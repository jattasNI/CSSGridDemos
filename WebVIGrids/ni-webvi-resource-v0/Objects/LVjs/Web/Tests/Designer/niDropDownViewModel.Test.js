//****************************************
// Tests for DropDownViewModel class
// National Instruments Copyright 2015
//****************************************
import { DropDownModel } from '../../Modeling/niDropDownModel.js';
describe('A DropDownViewModel', function () {
    'use strict';
    const controlId = 'DropDownViewModelId';
    let viModel, frontPanelControls, controlModel, settings, updateSettings, updateSelectedIndexSettings;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        webAppHelper.installWebAppFixture(done);
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function () {
        settings = {
            niControlId: controlId,
            kind: DropDownModel.MODEL_KIND,
            visible: true,
            selectedIndex: 0,
            source: ['alpha', 'beta', 'charlie'],
            left: '100px',
            top: '200px',
            width: '300px',
            height: '400px',
            textAlignment: 'left'
        };
        updateSettings = {
            selectedIndex: 1,
            source: ['zero', 'one', 'two'],
            popupEnabled: true,
            textAlignment: 'center'
        };
        updateSelectedIndexSettings = {
            niControlId: controlId,
            kind: DropDownModel.MODEL_KIND,
            visible: true,
            source: ['abc', 'def', 'ghi'],
            selectedIndex: 2
        };
        Object.freeze(settings);
        Object.freeze(updateSettings);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        // TODO mraj DOM_POLLUTION
        //domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page', function (done) {
        $(document.body).append('<jqx-drop-down-list ni-control-id="' + controlId + '"></jqx-drop-down-list>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(settings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('and has the correct initial values.', function () {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlModel.selectedIndex).toEqual(settings.selectedIndex);
            expect(controlModel.source).toEqual(settings.source);
            expect(controlModel.popupEnabled).toEqual(false);
            expect(controlModel.textAlignment).toEqual(settings.textAlignment);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.selectedIndex).toEqual(updateSettings.selectedIndex);
                expect(controlModel.source).toEqual(updateSettings.source);
                expect(controlModel.popupEnabled).toEqual(updateSettings.popupEnabled);
                expect(controlModel.textAlignment).toEqual(updateSettings.textAlignment);
            });
        });
        it('and handles unknown property changes.', function (done) {
            const unknownSettings = {
                unknown: 'unknown'
            };
            const sendUnknownProperties = function () {
                webAppHelper.dispatchMessage(controlId, unknownSettings);
            };
            expect(sendUnknownProperties).toThrow();
            testHelpers.runAsync(done, function () {
                expect(controlModel.selectedIndex).toEqual(settings.selectedIndex);
                expect(controlModel.source).toEqual(settings.source);
            });
        });
        // CAR 702866 : MSEdge + text-align + CSS variables not working
        /*
        // CAR 705613
        it('and updates textAlignment property. #FailsEdge', function (done) {
            webAppHelper.dispatchMessage(controlId, {textAlignment: 'right'});

            testHelpers.runAsync(done, function () {
                var controlElement = viewModel.element;
                var style = window.getComputedStyle(controlElement);
                expect(style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN)).toEqual('right');
                expect(style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX)).toEqual('flex-end');

                var inputContainer = controlElement.querySelector("div > jqx-list-box > div.jqx-container > div.jqx-list-items-container > div.jqx-list-items-inner-container");
                expect(window.getComputedStyle(inputContainer).textAlign).toEqual('right');
                var container = controlElement.querySelector("div > span.jqx-action-button");
                expect(window.getComputedStyle(container).justifyContent).toEqual('flex-end');
            });
        });
        */
    });
    it('responds to the select event and sets the new selected index.', function (done) {
        let internalControl;
        const controlElement = webAppHelper.createNIElement(settings);
        testHelpers.runMultipleAsync(done, function () {
            internalControl = controlElement;
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
        }, function () {
            internalControl.selectedIndexes = [2];
        }, function () {
            expect(controlModel.selectedIndex).toEqual(2);
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('does not change selectedIndex if nothing is selected in element.', function (done) {
        let internalControl;
        const controlElement = webAppHelper.createNIElement(updateSelectedIndexSettings);
        testHelpers.runMultipleAsync(done, function () {
            internalControl = controlElement;
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
        }, function () {
            internalControl.selectedIndexes = [];
        }, function () {
            expect(controlModel.selectedIndex).toEqual(2);
            webAppHelper.removeNIElement(controlId);
        });
    });
});
//# sourceMappingURL=niDropDownViewModel.Test.js.map