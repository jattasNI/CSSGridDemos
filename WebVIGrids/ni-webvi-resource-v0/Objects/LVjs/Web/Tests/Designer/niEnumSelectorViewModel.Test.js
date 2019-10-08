//****************************************
// Tests for EnumSelectorViewModel class
// National Instruments Copyright 2015
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
describe('A EnumSelectorViewModel', function () {
    'use strict';
    let viModel, frontPanelControls, controlModel, controlElement;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, enumSelectorSettings, enumSelectorUpdatedSettings;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.enumSelectorSettings.niControlId;
            enumSelectorSettings = fixture.enumSelectorSettings;
            enumSelectorUpdatedSettings = fixture.enumSelectorUpdatedSettings;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function () {
        Object.freeze(enumSelectorSettings);
        Object.freeze(enumSelectorUpdatedSettings);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        // TODO mraj DOM_POLLUTION
        //domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page', function (done) {
        $(document.body).append('<ni-enum-selector ni-control-id="' + controlId + '"></ni-enum-selector>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(enumSelectorSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
                controlElement = viewModel.element;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('and has the correct initial values.', function () {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlModel.value).toEqual(enumSelectorSettings.value);
            expect(controlModel.items).toEqual(enumSelectorSettings.items);
            expect(controlModel.popupEnabled).toEqual(false);
            expect(controlModel.textAlignment).toEqual(enumSelectorSettings.textAlignment);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, enumSelectorUpdatedSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.value).toEqual(enumSelectorUpdatedSettings.value);
                expect(controlModel.items).toEqual(enumSelectorUpdatedSettings.items);
                expect(controlModel.popupEnabled).toEqual(enumSelectorUpdatedSettings.popupEnabled);
                expect(controlModel.textAlignment).toEqual(enumSelectorUpdatedSettings.textAlignment);
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
                expect(controlModel.value).toEqual(enumSelectorSettings.value);
                expect(controlModel.items).toEqual(enumSelectorSettings.items);
            });
        });
        it('and updates disabledIndexes property.', function (done) {
            const setting = {
                disabledIndexes: [1, 2]
            };
            webAppHelper.dispatchMessage(controlId, setting);
            testHelpers.runAsync(done, function () {
                expect(JSON.parse(controlElement.disabledIndexes)).toEqual(setting.disabledIndexes);
            });
        });
        // CAR 702866 : MSEdge + text-align + CSS variables not working
        it('and updates textAlignment property. #FailsEdge', function (done) {
            webAppHelper.dispatchMessage(controlId, { textAlignment: 'center' });
            testHelpers.runAsync(done, function () {
                const enumStyle = window.getComputedStyle(controlElement);
                expect(enumStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN)).toEqual('center');
                expect(enumStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX)).toEqual('center');
                /*
                // CAR 705613
                let enumDropDownStyle = window.getComputedStyle(controlElement.querySelector('jqx-drop-down-list'));
                expect(enumDropDownStyle.textAlign).toEqual('center');
                */
                const enumDropDownButtonStyle = window.getComputedStyle(controlElement.querySelector('jqx-drop-down-list .jqx-action-button'));
                expect(enumDropDownButtonStyle.justifyContent).toEqual('center');
            });
        });
    });
    it('responds to the jqx selectIndex method and sets the new selected index.', function (done) {
        controlElement = webAppHelper.createNIElement(enumSelectorSettings);
        testHelpers.runAsync(done, function () {
            const internalControl = controlElement.firstElementChild;
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            internalControl.selectedIndexes = [2];
            expect(controlModel.value).toEqual(2);
            webAppHelper.removeNIElement(controlId);
        });
    });
});
//# sourceMappingURL=niEnumSelectorViewModel.Test.js.map