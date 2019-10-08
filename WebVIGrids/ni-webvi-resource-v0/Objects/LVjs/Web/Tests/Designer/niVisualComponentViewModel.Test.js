//****************************************
// Tests for VisualComponentViewModel
// National Instruments Copyright 2014
//****************************************
import { BooleanLEDModel } from '../../Modeling/niBooleanLEDModel.js';
describe('A VisualComponentViewModel', function () {
    'use strict';
    const controlId = 'Function1';
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        webAppHelper.installWebAppFixture(done);
    });
    beforeAll(function () {
        webAppHelper.getVIModelForFixture();
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('warns about adding a control with the same id twice', function (done) {
        const toCall = function () {
            webAppHelper.createNIElement({
                niControlId: controlId,
                kind: BooleanLEDModel.MODEL_KIND,
                visible: true,
                value: true,
                foreground: '#4D5359',
                fontSize: '12px',
                left: '272px',
                top: '64px',
                width: '23px',
                height: '16px'
            });
        };
        // first call
        expect(toCall).not.toThrow();
        //second call
        expect(toCall).toThrow();
        testHelpers.runAsync(done, function () {
            webAppHelper.removeNIElement(controlId);
        });
    });
});
//# sourceMappingURL=niVisualComponentViewModel.Test.js.map