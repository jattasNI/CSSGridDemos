"use strict";
//****************************************
// Tests for OpaqueRefnumViewModel class
// National Instruments Copyright 2015
//****************************************
describe('A OpaqueRefnumViewModel', function () {
    'use strict';
    const controlId = 'Refnum';
    let viModel;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        webAppHelper.installWebAppFixture(done);
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
        $(document.body).append('<ni-opaque-refnum ni-control-id="' + controlId + '"></ni-opaque-refnum>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
});
//# sourceMappingURL=niOpaqueRefnumViewModel.Test.js.map