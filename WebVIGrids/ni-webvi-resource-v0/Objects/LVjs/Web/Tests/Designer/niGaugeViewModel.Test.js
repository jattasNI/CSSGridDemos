"use strict";
//****************************************
// Tests for GaugeViewModel class
// National Instruments Copyright 2014
//****************************************
describe('A GaugeViewModel', function () {
    'use strict';
    let viModel, frontPanelControls, controlModel;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, gaugeSettings, gaugeUpdatedSettings, gaugeWithInt64TypeSettings, gaugeWithInt64TypeUpdatedSettings;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.gaugeSettings.niControlId;
            gaugeSettings = fixture.gaugeSettings;
            gaugeUpdatedSettings = fixture.gaugeUpdatedSettings;
            gaugeWithInt64TypeSettings = fixture.gaugeWithInt64TypeSettings;
            gaugeWithInt64TypeUpdatedSettings = fixture.gaugeWithInt64TypeUpdatedSettings;
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
        $(document.body).append('<jqx-gauge ni-control-id="' + controlId + '" style="height: 10px; width: 10px;"></jqx-gauge>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(gaugeSettings);
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
            expect(controlModel.minimum).toEqual(0.0);
            expect(controlModel.maximum).toEqual(10.0);
            expect(controlModel.interval).toEqual(2.0);
            expect(controlModel.majorTicksVisible).toEqual(true);
            expect(controlModel.minorTicksVisible).toEqual(true);
            expect(controlModel.labelsVisible).toEqual(true);
            expect(controlModel.precisionDigits).toEqual(4);
            expect(controlModel.value).toEqual(5.0);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, gaugeUpdatedSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.minimum).toEqual(1.0);
                expect(controlModel.maximum).toEqual(11.0);
                expect(controlModel.interval).toEqual(3.0);
                expect(controlModel.majorTicksVisible).toEqual(false);
                expect(controlModel.minorTicksVisible).toEqual(false);
                expect(controlModel.labelsVisible).toEqual(false);
                expect(controlModel.precisionDigits).toEqual(5);
                expect(controlModel.value).toEqual(6.0);
                expect(controlModel.fontSize).toEqual('20px');
                expect(controlModel.fontFamily).toEqual('sans-serif');
                expect(controlModel.fontWeight).toEqual('bold');
                expect(controlModel.fontStyle).toEqual('italic');
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
                expect(controlModel.minimum).toEqual(0.0);
                expect(controlModel.maximum).toEqual(10.0);
                expect(controlModel.interval).toEqual(2.0);
                expect(controlModel.majorTicksVisible).toEqual(true);
                expect(controlModel.minorTicksVisible).toEqual(true);
                expect(controlModel.labelsVisible).toEqual(true);
                expect(controlModel.precisionDigits).toEqual(4);
                expect(controlModel.value).toEqual(5.0);
            });
        });
    });
    describe('exists after the custom element is created using the int64 data type', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(gaugeWithInt64TypeSettings);
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
            expect(controlModel.minimum).toEqual('0.0');
            expect(controlModel.maximum).toEqual('10.0');
            expect(controlModel.interval).toEqual('2.0');
            expect(controlModel.majorTicksVisible).toEqual(true);
            expect(controlModel.minorTicksVisible).toEqual(true);
            expect(controlModel.labelsVisible).toEqual(true);
            expect(controlModel.significantDigits).toEqual(4);
            expect(controlModel.value).toEqual('5.0');
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, gaugeWithInt64TypeUpdatedSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.minimum).toEqual('1.0');
                expect(controlModel.maximum).toEqual('9223372036854775807');
                expect(controlModel.interval).toEqual('3.0');
                expect(controlModel.majorTicksVisible).toEqual(false);
                expect(controlModel.minorTicksVisible).toEqual(false);
                expect(controlModel.labelsVisible).toEqual(false);
                expect(controlModel.significantDigits).toEqual(21);
                expect(controlModel.value).toEqual('9223372036854775807');
            });
        });
    });
    describe('does not coerce programmatic value changes based on [min, max] -', function () {
        let controlElement;
        beforeEach(function (done) {
            webAppHelper.createNIElement(gaugeSettings);
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
        $(document.body).append('<jqx-gauge ni-control-id="' + controlId + '" style="width: 10px; height: 10px;" validation="interaction" min="5" max="10" value="2"></jqx-gauge>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel.element.value).toEqual('2');
            webAppHelper.removeNIElement(controlId);
        });
    });
});
//# sourceMappingURL=niGaugeViewModel.Test.js.map