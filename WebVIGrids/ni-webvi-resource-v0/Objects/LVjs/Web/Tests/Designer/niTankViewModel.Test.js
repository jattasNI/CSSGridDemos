"use strict";
//****************************************
// Tests for TankViewModel class
// National Instruments Copyright 2014
//****************************************
describe('A TankViewModel', function () {
    'use strict';
    const NITypes = window.NITypes;
    let controlId;
    let viModel, frontPanelControls, controlModel, tankSettings, tankUpdateSettings, tankInt64Settings, tankInt64UpdateSettings, tankverticalOrientationSettings;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.tankSettings.niControlId;
            tankSettings = fixture.tankSettings;
            tankUpdateSettings = fixture.tankUpdateSettings;
            tankInt64Settings = fixture.tankInt64Settings;
            tankInt64UpdateSettings = fixture.tankInt64UpdateSettings;
            tankverticalOrientationSettings = fixture.tankverticalOrientationSettings;
            tankInt64Settings.niType = NITypes.INT64;
            Object.freeze(tankSettings);
            Object.freeze(tankUpdateSettings);
            Object.freeze(tankInt64Settings);
            Object.freeze(tankInt64UpdateSettings);
            Object.freeze(tankverticalOrientationSettings);
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
        // gleon DOM_POLLUTION chutzpah
        // domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page.', function (done) {
        $(document.body).append('<jqx-tank ni-control-id="' + controlId + '" style="width: 10px; height: 10px;"></ni-tank>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        let viewModel;
        let scalePosition;
        beforeEach(function (done) {
            webAppHelper.createNIElement(tankSettings);
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
            expect(controlModel.minimum).toEqual(tankSettings.minimum);
            expect(controlModel.maximum).toEqual(tankSettings.maximum);
            expect(controlModel.interval).toEqual(tankSettings.interval);
            expect(controlModel.majorTicksVisible).toEqual(tankSettings.majorTicksVisible);
            expect(controlModel.minorTicksVisible).toEqual(tankSettings.minorTicksVisible);
            expect(controlModel.labelsVisible).toEqual(tankSettings.labelsVisible);
            expect(controlModel.value).toEqual(tankSettings.value);
            expect(controlModel.orientation).toEqual(tankSettings.orientation);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, tankUpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.minimum).toEqual(tankUpdateSettings.minimum);
                expect(controlModel.maximum).toEqual(tankUpdateSettings.maximum);
                expect(controlModel.interval).toEqual(tankUpdateSettings.interval);
                expect(controlModel.fill).toEqual('rgba(255, 255, 0, 0)');
                expect(controlModel.majorTicksVisible).toEqual(tankUpdateSettings.majorTicksVisible);
                expect(controlModel.minorTicksVisible).toEqual(tankUpdateSettings.minorTicksVisible);
                expect(controlModel.labelsVisible).toEqual(tankUpdateSettings.labelsVisible);
                expect(controlModel.value).toEqual(tankUpdateSettings.value);
                expect(controlModel.orientation).toEqual(tankUpdateSettings.orientation);
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
                expect(controlModel.minimum).toEqual(tankSettings.minimum);
                expect(controlModel.maximum).toEqual(tankSettings.maximum);
                expect(controlModel.interval).toEqual(tankSettings.interval);
                expect(controlModel.majorTicksVisible).toEqual(tankSettings.majorTicksVisible);
                expect(controlModel.minorTicksVisible).toEqual(tankSettings.minorTicksVisible);
                expect(controlModel.labelsVisible).toEqual(tankSettings.labelsVisible);
                expect(controlModel.value).toEqual(tankSettings.value);
                expect(controlModel.orientation).toEqual(tankSettings.orientation);
            });
        });
        it('and has the correct scale position.', function () {
            scalePosition = viewModel.element.scalePosition;
            expect(scalePosition).toEqual("far");
        });
        it('and updates the scale position when orientation changes.', function (done) {
            webAppHelper.dispatchMessage(controlId, tankverticalOrientationSettings);
            testHelpers.runAsync(done, function () {
                scalePosition = viewModel.element.scalePosition;
                expect(scalePosition).toEqual("near");
            });
        });
    });
    describe('exists after the custom element is created using the int64 data type', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(tankInt64Settings);
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
            expect(controlModel.minimum).toEqual(tankInt64Settings.minimum);
            expect(controlModel.maximum).toEqual(tankInt64Settings.maximum);
            expect(controlModel.interval).toEqual(tankInt64Settings.interval);
            expect(controlModel.majorTicksVisible).toEqual(tankInt64Settings.majorTicksVisible);
            expect(controlModel.minorTicksVisible).toEqual(tankInt64Settings.minorTicksVisible);
            expect(controlModel.labelsVisible).toEqual(tankInt64Settings.labelsVisible);
            expect(controlModel.value).toEqual(tankInt64Settings.value);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, tankInt64UpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.minimum).toEqual(tankInt64UpdateSettings.minimum);
                expect(controlModel.maximum).toEqual(tankInt64UpdateSettings.maximum);
                expect(controlModel.interval).toEqual(tankInt64UpdateSettings.interval);
                expect(controlModel.majorTicksVisible).toEqual(tankInt64UpdateSettings.majorTicksVisible);
                expect(controlModel.minorTicksVisible).toEqual(tankInt64UpdateSettings.minorTicksVisible);
                expect(controlModel.labelsVisible).toEqual(tankInt64UpdateSettings.labelsVisible);
                expect(controlModel.value).toEqual(tankInt64UpdateSettings.value);
            });
        });
    });
    describe('does not coerce programmatic value changes based on [min, max] -', function () {
        let controlElement;
        beforeEach(function (done) {
            webAppHelper.createNIElement(tankSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                const viewModel = viModel.getControlViewModel(controlId);
                controlElement = viewModel.element;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('setting value < min', function (done) {
            controlModel.value = -1; // (Configured minimum is 0)
            testHelpers.runAsync(done, function () {
                expect(controlElement.value).toEqual('-1');
            });
        });
        it('setting value > max', function (done) {
            controlModel.value = 99; // (Configured maximum is 10)
            testHelpers.runAsync(done, function () {
                expect(controlElement.value).toEqual('99');
            });
        });
        it('no change event fired when current value is outside new [min, max] and value is not coerced', function (done) {
            controlElement.addEventListener('change', function () {
                fail('change event should not be fired');
            });
            controlModel.min = 8; // (Current value is 5, so current value now outside [min, max])
            testHelpers.runAsync(done, function () {
                expect(controlElement.value).toEqual('5');
            });
        });
    });
    it('\'s element does not coerce the initial value (when added to the page) based on min/max', function (done) {
        $(document.body).append('<jqx-tank ni-control-id="' + controlId + '" style="width: 10px; height: 10px;" validation="interaction" min="5" max="10" value="2"></jqx-tank>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel.element.value).toEqual('2');
            webAppHelper.removeNIElement(controlId);
        });
    });
});
//# sourceMappingURL=niTankViewModel.Test.js.map