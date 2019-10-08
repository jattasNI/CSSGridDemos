"use strict";
//****************************************
// Tests for LinearProgressBarViewModel class
// National Instruments Copyright 2014
//****************************************
describe('A LinearProgressBarViewModel', function () {
    'use strict';
    let viModel, frontPanelControls, controlModel;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, linearProgressBarSettings, linearProgressBarUpdatedSettings;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.linearProgressBarSettings.niControlId;
            linearProgressBarSettings = fixture.linearProgressBarSettings;
            linearProgressBarUpdatedSettings = fixture.linearProgressBarUpdatedSettings;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function () {
        Object.freeze(linearProgressBarSettings);
        Object.freeze(linearProgressBarUpdatedSettings);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page.', function (done) {
        $(document.body).append('<jqx-progress-bar ni-control-id="' + controlId + '"></jqx-progress-bar>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(linearProgressBarSettings);
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
            expect(controlModel.minimum).toEqual(linearProgressBarSettings.minimum);
            expect(controlModel.maximum).toEqual(linearProgressBarSettings.maximum);
            expect(controlModel.value).toEqual(linearProgressBarSettings.value);
            expect(controlModel.orientation).toEqual(linearProgressBarSettings.orientation);
            expect(controlModel.indeterminate).toEqual(linearProgressBarSettings.indeterminate);
        });
        it('and updates the Model when properties change', function (done) {
            webAppHelper.dispatchMessage(controlId, linearProgressBarUpdatedSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.minimum).toEqual(linearProgressBarUpdatedSettings.minimum);
                expect(controlModel.maximum).toEqual(linearProgressBarUpdatedSettings.maximum);
                expect(controlModel.value).toEqual(linearProgressBarUpdatedSettings.value);
                expect(controlModel.orientation).toEqual(linearProgressBarUpdatedSettings.orientation);
                expect(controlModel.indeterminate).toEqual(linearProgressBarUpdatedSettings.indeterminate);
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
                expect(controlModel.minimum).toEqual(linearProgressBarSettings.minimum);
                expect(controlModel.maximum).toEqual(linearProgressBarSettings.maximum);
                expect(controlModel.value).toEqual(linearProgressBarSettings.value);
                expect(controlModel.orientation).toEqual(linearProgressBarSettings.orientation);
                expect(controlModel.indeterminate).toEqual(linearProgressBarSettings.indeterminate);
            });
        });
    });
});
//# sourceMappingURL=niLinearProgressBarViewModel.Test.js.map