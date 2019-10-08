//****************************************
// Tests for LabelViewModel class
// National Instruments Copyright 2015
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
import { LabelModel } from '../../Modeling/niLabelModel.js';
describe('A LabelViewModel', function () {
    'use strict';
    const controlId = 'LabelViewModelId';
    let viModel, frontPanelControls, controlModel, controlElement, settings;
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
            kind: LabelModel.MODEL_KIND,
            visible: true,
            text: 'Text',
            foreground: '#4D5359',
            fontSize: '12px',
            fontFamily: 'sans-serif'
        };
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    describe('dynamically updates properties triggering ModelPropertyChanged', function () {
        let viewModel;
        beforeEach(function (done) {
            controlElement = webAppHelper.createNIElement(settings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('first verifies initial values', function () {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlElement.firstChild).toBeDefined();
            expect(controlElement.firstChild.innerHTML).toBeDefined();
            expect(controlElement.firstChild.innerHTML).toEqual(settings.text);
            const controlStyle = window.getComputedStyle(controlElement);
            expect(controlStyle.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR)).toEqual('#4D5359');
            const innerLabelStyle = window.getComputedStyle(controlElement.querySelector('label'));
            expect(innerLabelStyle.color).toEqual('rgb(77, 83, 89)');
        });
        it('updates text', function (done) {
            const updateSettings = {};
            updateSettings.text = 'OtherText';
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlElement.firstChild.innerHTML).toEqual('OtherText');
            });
        });
        it('updates font color', function (done) {
            const updateSettings = {};
            updateSettings.foreground = '#3AB878';
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                const controlStyle = window.getComputedStyle(controlElement);
                expect(controlStyle.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR)).toEqual('#3AB878');
                const innerLabelStyle = window.getComputedStyle(controlElement.querySelector('label'));
                expect(innerLabelStyle.color).toEqual('rgb(58, 184, 120)');
            });
        });
        it('ignores an unknown property update', function (done) {
            const updateSettings = {};
            updateSettings.anUnknownProperty = '{An unknown value}';
            const sendUnknownProperties = function () {
                webAppHelper.dispatchMessage(controlId, updateSettings);
            };
            expect(sendUnknownProperties).toThrow();
            testHelpers.runAsync(done, function () {
                expect(controlModel).toBeDefined();
                expect(viewModel).toBeDefined();
                expect(controlElement.firstChild).toBeDefined();
                expect(controlElement.firstChild.innerHTML).toBeDefined();
                expect(controlElement.firstChild.innerHTML).toEqual(settings.text);
                const controlStyle = window.getComputedStyle(controlElement);
                expect(controlStyle.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR)).toEqual('#4D5359');
            });
        });
    });
});
//# sourceMappingURL=niLabelViewModel.Test.js.map