//****************************************
// Tests for TextViewModel class
// National Instruments Copyright 2015
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
describe('A TextViewModel', function () {
    'use strict';
    let controlId = 'TextViewModelId';
    let viModel, frontPanelControls, controlModel, controlElement, textSettings;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.textSettings.niControlId;
            textSettings = fixture.textSettings;
            Object.freeze(textSettings);
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
    describe('dynamically updates properties triggering ModelPropertyChanged', function () {
        let viewModel;
        beforeEach(function (done) {
            controlElement = webAppHelper.createNIElement(textSettings);
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
            expect(controlElement.firstChild.innerHTML).toEqual(textSettings.text);
            const controlStyle = window.getComputedStyle(controlElement);
            expect(controlStyle.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR)).toEqual('#4D5359');
            const innerLabelStyle = window.getComputedStyle(controlElement.querySelector('div'));
            expect(innerLabelStyle.color).toEqual('rgb(77, 83, 89)');
        });
        it('updates text', function (done) {
            webAppHelper.dispatchMessage(controlId, { text: 'OtherText' });
            testHelpers.runAsync(done, function () {
                expect(controlElement.firstChild.innerHTML).toEqual('OtherText');
            });
        });
        it('updates font color', function (done) {
            webAppHelper.dispatchMessage(controlId, { foreground: '#3AB878' });
            testHelpers.runAsync(done, function () {
                const controlStyle = window.getComputedStyle(controlElement);
                expect(controlStyle.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR)).toEqual('#3AB878');
                const innerLabelStyle = window.getComputedStyle(controlElement.querySelector('div'));
                expect(innerLabelStyle.color).toEqual('rgb(58, 184, 120)');
            });
        });
        it('ignores an unknown property update', function (done) {
            const sendUnknownProperties = function () {
                webAppHelper.dispatchMessage(controlId, { anUnknownProperty: '{An unknown value}' });
            };
            expect(sendUnknownProperties).toThrow();
            testHelpers.runAsync(done, function () {
                expect(controlModel).toBeDefined();
                expect(viewModel).toBeDefined();
                expect(controlElement.firstChild).toBeDefined();
                expect(controlElement.firstChild.innerHTML).toBeDefined();
                expect(controlElement.firstChild.innerHTML).toEqual(textSettings.text);
                const controlStyle = window.getComputedStyle(controlElement);
                expect(controlStyle.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR)).toEqual('#4D5359');
            });
        });
    });
});
//# sourceMappingURL=niTextViewModel.Test.js.map