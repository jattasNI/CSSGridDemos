"use strict";
//****************************************
// Tests for SliderViewModel class
// National Instruments Copyright 2014
//****************************************
describe('A SliderViewModel', function () {
    'use strict';
    const NITypes = window.NITypes;
    let controlId;
    let viModel, frontPanelControls, controlModel, sliderSettings, sliderUpdateSettings, sliderInt64Settings, sliderInt64UpdateSettings, sliderHorizontalOrientationSettings;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.sliderSettings.niControlId;
            sliderSettings = fixture.sliderSettings;
            sliderUpdateSettings = fixture.sliderUpdateSettings;
            sliderInt64Settings = fixture.sliderInt64Settings;
            sliderInt64UpdateSettings = fixture.sliderInt64UpdateSettings;
            sliderHorizontalOrientationSettings = fixture.sliderHorizontalOrientationSettings;
            sliderInt64Settings.niType = NITypes.INT64;
            Object.freeze(sliderSettings);
            Object.freeze(sliderUpdateSettings);
            Object.freeze(sliderInt64Settings);
            Object.freeze(sliderInt64UpdateSettings);
            Object.freeze(sliderHorizontalOrientationSettings);
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
        $(document.body).append('<jqx-slider ni-control-id="' + controlId + '"></jqx-slider>');
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
            webAppHelper.createNIElement(sliderSettings);
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
            expect(controlModel.minimum).toEqual(sliderSettings.minimum);
            expect(controlModel.maximum).toEqual(sliderSettings.maximum);
            expect(controlModel.interval).toEqual(sliderSettings.interval);
            expect(controlModel.value).toEqual(sliderSettings.value);
            expect(controlModel.orientation).toEqual(sliderSettings.orientation);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, sliderUpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.minimum).toEqual(sliderUpdateSettings.minimum);
                expect(controlModel.maximum).toEqual(sliderUpdateSettings.maximum);
                expect(controlModel.interval).toEqual(sliderUpdateSettings.interval);
                expect(controlModel.value).toEqual(sliderUpdateSettings.value);
                expect(controlModel.fill).toEqual('rgba(255, 255, 0, 0)');
                expect(controlModel.fontSize).toEqual('20px');
                expect(controlModel.fontFamily).toEqual('sans-serif');
                expect(controlModel.fontWeight).toEqual('bold');
                expect(controlModel.fontStyle).toEqual('italic');
                expect(controlModel.scaleVisible).toEqual(false);
                expect(controlModel.majorTicksVisible).toEqual(false);
                expect(controlModel.minorTicksVisible).toEqual(false);
                expect(controlModel.labelsVisible).toEqual(false);
                expect(controlModel.coercionMode).toEqual(true);
                expect(controlModel.orientation).toEqual('horizontal');
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
                expect(controlModel.minimum).toEqual(sliderSettings.minimum);
                expect(controlModel.maximum).toEqual(sliderSettings.maximum);
                expect(controlModel.interval).toEqual(sliderSettings.interval);
                expect(controlModel.value).toEqual(sliderSettings.value);
            });
        });
        it('and has the correct scale position.', function () {
            scalePosition = viewModel.element.scalePosition;
            expect(scalePosition).toEqual("near");
        });
        it('and updates the scale position when orientation changes.', function (done) {
            webAppHelper.dispatchMessage(controlId, sliderHorizontalOrientationSettings);
            testHelpers.runAsync(done, function () {
                scalePosition = viewModel.element.scalePosition;
                expect(scalePosition).toEqual("far");
            });
        });
    });
    describe('exists after the custom element is created using the int64 data type', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(sliderInt64Settings);
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
            expect(controlModel.minimum).toEqual(sliderInt64Settings.minimum);
            expect(controlModel.maximum).toEqual(sliderInt64Settings.maximum);
            expect(controlModel.interval).toEqual(sliderInt64Settings.interval);
            expect(controlModel.value).toEqual(sliderInt64Settings.value);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, sliderInt64UpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.minimum).toEqual(sliderInt64UpdateSettings.minimum);
                expect(controlModel.maximum).toEqual(sliderInt64UpdateSettings.maximum);
                expect(controlModel.interval).toEqual(sliderInt64UpdateSettings.interval);
                expect(controlModel.value).toEqual(sliderInt64UpdateSettings.value);
            });
        });
    });
    describe('does not coerce programmatic value changes based on [min, max] -', function () {
        let controlElement;
        beforeEach(function (done) {
            webAppHelper.createNIElement(sliderSettings);
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
        $(document.body).append('<jqx-slider ni-control-id="' + controlId + '" validation="interaction"  min="5" max="10" value="2"></jqx-slider>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel.element.value).toEqual('2');
            webAppHelper.removeNIElement(controlId);
        });
    });
});
//# sourceMappingURL=niSliderViewModel.Test.js.map