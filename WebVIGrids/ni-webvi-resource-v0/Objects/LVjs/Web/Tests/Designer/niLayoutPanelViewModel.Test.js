//****************************************
// Tests for LayoutPanelViewModel class
// National Instruments Copyright 2014
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
import { LayoutPanelModel } from '../../Modeling/niLayoutPanelModel.js';
describe('A LayoutPanelViewModel', function () {
    'use strict';
    let viModel, settings, updateSettings, frontPanelControls, controlModel;
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
    beforeEach(function () {
        settings = {
            niControlId: 'Function12',
            kind: LayoutPanelModel.MODEL_KIND,
            minHeight: '100px'
        };
        updateSettings = {
            minHeight: '200px'
        };
    });
    describe('exists after creation', function () {
        let viewModel, layoutPanel;
        beforeEach(function (done) {
            layoutPanel = webAppHelper.createNIElement(settings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[settings.niControlId];
                viewModel = viModel.getControlViewModel(settings.niControlId);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(settings.niControlId);
        });
        it('and has the correct initial values.', function () {
            const style = window.getComputedStyle(layoutPanel);
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(style.getPropertyValue(CSS_PROPERTIES.MIN_HEIGHT)).toEqual(settings.minHeight);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(settings.niControlId, updateSettings);
            testHelpers.runAsync(done, function () {
                const style = window.getComputedStyle(layoutPanel);
                expect(style.getPropertyValue(CSS_PROPERTIES.MIN_HEIGHT)).toEqual(updateSettings.minHeight);
            });
        });
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
});
//# sourceMappingURL=niLayoutPanelViewModel.Test.js.map