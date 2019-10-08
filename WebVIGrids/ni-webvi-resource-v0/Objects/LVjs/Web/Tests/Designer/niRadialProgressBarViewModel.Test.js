"use strict";
//****************************************
// Tests for RadialProgressBarViewModel class
// National Instruments Copyright 2014
//****************************************
describe('A RadialProgressBarViewModel', function () {
    'use strict';
    let controlId;
    let viModel, frontPanelControls, controlModel, radialProgressBarSettings, radialProgressBarUpdatedSettings;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.radialProgressBarSettings.niControlId;
            radialProgressBarSettings = fixture.radialProgressBarSettings;
            radialProgressBarUpdatedSettings = fixture.radialProgressBarUpdatedSettings;
            Object.freeze(radialProgressBarSettings);
            Object.freeze(radialProgressBarUpdatedSettings);
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
    it('allows elements to be added directly to the page.', function (done) {
        $(document.body).append('<jqx-circular-progress-bar ni-control-id="' + controlId + '"></jqx-circular-progress-bar>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(radialProgressBarSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('and has the correct initial values', function () {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlModel.minimum).toEqual(radialProgressBarSettings.minimum);
            expect(controlModel.maximum).toEqual(radialProgressBarSettings.maximum);
            expect(controlModel.value).toEqual(radialProgressBarSettings.value);
        });
        it('and updates the Model when properties change', function (done) {
            webAppHelper.dispatchMessage(controlId, radialProgressBarUpdatedSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.minimum).toEqual(radialProgressBarUpdatedSettings.minimum);
                expect(controlModel.maximum).toEqual(radialProgressBarUpdatedSettings.maximum);
                expect(controlModel.value).toEqual(radialProgressBarUpdatedSettings.value);
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
                expect(controlModel.minimum).toEqual(radialProgressBarSettings.minimum);
                expect(controlModel.maximum).toEqual(radialProgressBarSettings.maximum);
                expect(controlModel.value).toEqual(radialProgressBarSettings.value);
            });
        });
    });
});
//# sourceMappingURL=niRadialProgressBarViewModel.Test.js.map