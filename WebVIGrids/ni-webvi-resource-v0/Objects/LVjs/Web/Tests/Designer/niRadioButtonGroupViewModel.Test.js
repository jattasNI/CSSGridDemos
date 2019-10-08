//****************************************
// Tests for RadioButtonGroupViewModel class
// National Instruments Copyright 2015
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
describe('A RadioButtonGroupViewModel', function () {
    'use strict';
    let controlId;
    let controlId2;
    let viModel, frontPanelControls, controlModel, controlElement, radioButtonSettings, radioButtonSettings2, radioButtonUpdateSettings;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.radioButtonSettings.niControlId;
            controlId2 = fixture.radioButtonSettings2.niControlId;
            radioButtonSettings = fixture.radioButtonSettings;
            radioButtonSettings2 = fixture.radioButtonSettings2;
            radioButtonUpdateSettings = fixture.radioButtonUpdateSettings;
            Object.freeze(radioButtonSettings);
            Object.freeze(radioButtonUpdateSettings);
            Object.freeze(radioButtonSettings2);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page', function (done) {
        $(document.body).append('<ni-radio-button-group ni-control-id="' + controlId + '"></ni-radio-button-group>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(radioButtonSettings);
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
        it('and has the correct initial values.', function (done) {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlModel.value).toEqual(radioButtonSettings.value);
            expect(controlModel.items).toEqual(radioButtonSettings.items);
            expect(controlModel.textAlignment).toEqual(radioButtonSettings.textAlignment);
            expect(controlModel.selectedButtonBackground).toEqual(radioButtonSettings.selectedButtonBackground);
            expect(controlModel.unselectedButtonBackground).toEqual(radioButtonSettings.unselectedButtonBackground);
            expect(controlModel.textColor).toEqual(radioButtonSettings.textColor);
            testHelpers.runAsync(done, function () {
                expect($(controlElement).children('jqx-radio-button').length).toEqual(3);
                const firstRadioButton = $(controlElement).children('jqx-radio-button')[0];
                expect(firstRadioButton.disabled).toEqual(false);
            });
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, radioButtonUpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.value).toEqual(radioButtonUpdateSettings.value);
                expect(controlModel.popupEnabled).toEqual(radioButtonUpdateSettings.popupEnabled);
                expect(controlModel.textAlignment).toEqual(radioButtonUpdateSettings.textAlignment);
                expect(controlModel.textAlignment).toEqual(radioButtonUpdateSettings.textAlignment);
                expect(controlModel.selectedButtonBackground).toEqual(radioButtonUpdateSettings.selectedButtonBackground);
                expect(controlModel.unselectedButtonBackground).toEqual(radioButtonUpdateSettings.unselectedButtonBackground);
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
                expect(controlModel.orientation).toEqual(radioButtonSettings.orientation);
                expect(controlModel.value).toEqual(radioButtonSettings.value);
                expect(controlModel.items).toEqual(radioButtonSettings.items);
            });
        });
        // CAR 702866 : MSEdge + text-align + CSS variables not working
        /*
        // CAR 705613
         it('and updates textAlignment property. #FailsEdge', function (done) {
            webAppHelper.dispatchMessage(controlId, { textAlignment: 'center' });

            testHelpers.runAsync(done, function () {
                var controlStyle = window.getComputedStyle(controlElement);
                expect(controlStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN)).toEqual('center');

                var containerStyle = window.getComputedStyle(controlElement.querySelector('div > span'));
                expect(containerStyle.textAlign).toEqual('center');
            });
        });*/
        it('and updates trueBackground, falseBackground and textColor properties on element.', function (done) {
            testHelpers.disablePointerEvents(controlElement);
            const values = {
                selectedButtonBackground: 'linear-gradient(145.5deg, rgb(170, 0, 204) 0%, rgb(166, 166, 166) 100%)',
                unselectedButtonBackground: 'black',
                textColor: 'yellow'
            };
            webAppHelper.dispatchMessage(controlId, values);
            testHelpers.runAsync(done, function () {
                const style = window.getComputedStyle(controlElement);
                expect(style.getPropertyValue(CSS_PROPERTIES.SELECTED_BACKGROUND)).toEqual(values.selectedButtonBackground);
                expect(style.getPropertyValue(CSS_PROPERTIES.UNSELECTED_BACKGROUND)).toEqual(values.unselectedButtonBackground);
                expect(style.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR)).toEqual(values.textColor);
                const radioItemLabelStyle = window.getComputedStyle(controlElement.querySelector('ni-radio-button-group jqx-radio-button .jqx-label'));
                expect(radioItemLabelStyle.color).toEqual('rgb(255, 255, 0)');
                const selectedItemCheckStyle = window.getComputedStyle(controlElement.querySelector('ni-radio-button-group jqx-radio-button[checked] .jqx-input'));
                expect(selectedItemCheckStyle.backgroundImage).toContain(values.selectedButtonBackground);
                const unselectedItemCheckStyle = window.getComputedStyle(controlElement.querySelector('ni-radio-button-group jqx-radio-button:not([checked]) .jqx-input'));
                expect(unselectedItemCheckStyle.backgroundColor).toContain('rgb(0, 0, 0)');
            });
        });
        it('updates disabled state on element', function (done) {
            const radioButtonUpdateSettings = {};
            radioButtonUpdateSettings.enabled = false;
            webAppHelper.dispatchMessage(controlId, radioButtonUpdateSettings);
            testHelpers.runAsync(done, function () {
                const firstRadioButton = $(controlElement).children('jqx-radio-button')[0];
                expect(firstRadioButton.disabled).toEqual(true);
            });
        });
    });
    it('select a different radio button item, and radio button groups are independent.', function (done) {
        controlElement = webAppHelper.createNIElement(radioButtonSettings);
        const controlElement2 = webAppHelper.createNIElement(radioButtonSettings2);
        let controlModel2;
        testHelpers.runMultipleAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            controlModel2 = frontPanelControls[controlId2];
            const group1RadioButton = $(controlElement).children('jqx-radio-button')[1];
            group1RadioButton.checked = true;
            // Change selection on a 2nd group too, so we can verify that only the other radio buttons in
            // that same group get deselected (e.g. the first group's selection is unaffected)
            const group2RadioButton = $(controlElement2).children('jqx-radio-button')[2];
            group2RadioButton.checked = true;
        }, function () {
            expect(controlModel.value).toEqual(1);
            expect(controlModel2.value).toEqual(2);
            webAppHelper.removeNIElement(controlId);
            webAppHelper.removeNIElement(controlId2);
        });
    });
});
//# sourceMappingURL=niRadioButtonGroupViewModel.Test.js.map