//****************************************
// G Property Tests for StringControl class
// National Instruments Copyright 2018
//****************************************
import { StringDisplayModeConstants } from '../../Framework/Constants/niStringDisplayModeConstants.js';
describe('A String control', function () {
    'use strict';
    let controlId;
    let viewModel, controlElement, stringSettings, viModel;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    const textDisplayMode = StringDisplayModeConstants.TextDisplayMode;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.stringSettings.niControlId;
            stringSettings = fixture.stringSettings;
            Object.freeze(stringSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function (done) {
        webAppHelper.createNIElement(stringSettings);
        testHelpers.runAsync(done, function () {
            viewModel = viModel.getControlViewModel(controlId);
            controlElement = viewModel.element;
        });
    });
    afterEach(function () {
        webAppHelper.removeNIElement(controlId);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('When escapedDisplayMode set to escape mode from default mode value of text area should update.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            const inputString = 'aaa aaa\u000c';
            controlElement.text = inputString;
            controlElement.escapedDisplayMode = textDisplayMode.ESCAPED;
        }, function () {
            const expectedOutputString = 'aaa\\saaa\\f';
            expect(controlElement.firstElementChild.value).toEqual(expectedOutputString);
        });
    });
    it('When escape display mode is on, any value updated in text area should update string control text as in default mode', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            const inputString = 'aaa\\00aaa';
            controlElement.escapedDisplayMode = textDisplayMode.ESCAPED;
            controlElement.firstElementChild.value = inputString;
            controlElement.firstElementChild.dispatchEvent(new CustomEvent('change'));
        }, function () {
            const expectedOutputString = 'aaa\u0000aaa';
            expect(controlElement.text).toEqual(expectedOutputString);
        });
    });
});
//# sourceMappingURL=ni-string-control.Test.js.map