"use strict";
//****************************************
// Tests for gauge control
// National Instruments Copyright 2018
//****************************************
describe('A Gauge control', function () {
    'use strict';
    let controlElement, gaugeDoubleSettings, viModel;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            gaugeDoubleSettings = fixture.gaugeDoubleNITypeSettings;
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
    it('allows elements to be added directly to the page with niType as Int8.', function (done) {
        $(document.body).append('<jqx-gauge ni-type= Int8 ni-control-id="' + gaugeDoubleSettings.niControlId + '" style="height: 10px; width: 10px;"></jqx-gauge>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(gaugeDoubleSettings.niControlId);
            expect(viewModel).toBeDefined();
            expect(viewModel.element.getElementsByTagName('jqx-numeric-text-box')[0].inputFormat).toEqual('integer');
            expect(viewModel.element.getElementsByTagName('jqx-numeric-text-box')[0].wordLength).toEqual('int8');
            webAppHelper.removeNIElement(gaugeDoubleSettings.niControlId);
        });
    });
    describe('exists after custom element is created', function () {
        beforeEach(function () {
            controlElement = webAppHelper.createNIElement(gaugeDoubleSettings);
        });
        afterEach(function () {
            webAppHelper.removeNIElement(gaugeDoubleSettings.niControlId);
        });
        it('having Double type, the scale type is set accordingly.', function (done) {
            const expectedScaleType = 'floatingPoint';
            testHelpers.runAsync(done, function () {
                expect(controlElement.scaleType).toEqual(expectedScaleType);
            });
        });
        it('having Int64 type, the scale type is set accordingly.', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                controlElement.niType = 'Int64';
            }, function () {
                const expectedScaleType = 'integer';
                expect(controlElement.scaleType).toEqual(expectedScaleType);
            });
        });
    });
});
//# sourceMappingURL=jqx-gauge.niTypeModule.Test.js.map