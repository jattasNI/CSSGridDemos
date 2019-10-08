"use strict";
//****************************************
// Tests for gauge control
// National Instruments Copyright 2018
//****************************************
describe('A Tank control', function () {
    'use strict';
    let controlElement, tankDoubleSettings;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            tankDoubleSettings = fixture.tankDoubleNITypeSettings;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeEach(function () {
        controlElement = webAppHelper.createNIElement(tankDoubleSettings);
    });
    afterEach(function () {
        webAppHelper.removeNIElement(tankDoubleSettings.niControlId);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
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
//# sourceMappingURL=jqx-tank.niTypeModule.Test.js.map