"use strict";
//****************************************
// Tests for Numeric Text box control
// National Instruments Copyright 2018
//****************************************
describe('A Numeric Text Box control', function () {
    'use strict';
    let controlElement, numericDoubleSettings;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            numericDoubleSettings = fixture.numericTextBoxDoubleNITypeSettings;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeEach(function () {
        controlElement = webAppHelper.createNIElement(numericDoubleSettings);
    });
    afterEach(function () {
        webAppHelper.removeNIElement(numericDoubleSettings.niControlId);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('having double type, the input format is set accordingly.', function (done) {
        const expectedInputFormat = 'floatingPoint';
        testHelpers.runAsync(done, function () {
            expect(controlElement.inputFormat).toEqual(expectedInputFormat);
        });
    });
    it('having Int64 type, the input format is set accordingly.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            controlElement.niType = 'Int64';
        }, function () {
            const expectedInputFormat = 'integer';
            expect(controlElement.inputFormat).toEqual(expectedInputFormat);
        });
    });
    it('having ComplexDouble type, the input format is set accordingly.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            controlElement.niType = 'ComplexDouble';
        }, function () {
            const expectedInputFormat = 'complex';
            expect(controlElement.inputFormat).toEqual(expectedInputFormat);
        });
    });
});
//# sourceMappingURL=jqx-numeric-text-box.niTypeModule.Test.js.map