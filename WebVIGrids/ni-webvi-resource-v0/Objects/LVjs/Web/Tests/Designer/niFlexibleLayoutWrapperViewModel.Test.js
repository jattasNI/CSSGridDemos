//****************************************
// Tests for FlexibleLayoutWrapperViewModel class
// National Instruments Copyright 2018
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
import { FlexibleLayoutWrapperModel } from '../../Modeling/niFlexibleLayoutWrapperModel.js';
describe('A FlexibleLayoutWrapperViewModel', function () {
    'use strict';
    const controlId = 'wrapper';
    let viModel, frontPanelControls, controlModel, controlElement, settings, updateSettings, viewModel;
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
            niControlId: controlId,
            kind: FlexibleLayoutWrapperModel.MODEL_KIND,
            flexGrow: "1",
            height: '150px',
            left: '100px',
            top: '100px',
            width: '200px'
        };
        updateSettings = {
            flexGrow: "5",
            height: '50px',
            left: '300px',
            top: '300px',
            width: '50px'
        };
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page.', function (done) {
        $(document.body).append('<ni-flexible-layout-wrapper ni-control-id="' + controlId + '"></ni-flexible-layout-wrapper>');
        testHelpers.runAsync(done, function () {
            viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElement(settings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
                controlElement = viewModel.element;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('and has the correct initial values.', function () {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlModel.flexGrow).toEqual(settings.flexGrow);
            expect(controlModel.height).toEqual(settings.height);
            expect(controlModel.left).toEqual(settings.left);
            expect(controlModel.top).toEqual(settings.top);
            expect(controlModel.width).toEqual(settings.width);
            const style = window.getComputedStyle(controlElement);
            expect(style.getPropertyValue(CSS_PROPERTIES.FLEX_GROW)).toEqual(settings.flexGrow);
        });
        it('and updates the Model and Element when properties change.', function (done) {
            webAppHelper.dispatchMessage(settings.niControlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel).toBeDefined();
                expect(viewModel).toBeDefined();
                expect(controlModel.flexGrow).toEqual(updateSettings.flexGrow);
                const style = window.getComputedStyle(controlElement);
                expect(style.getPropertyValue(CSS_PROPERTIES.FLEX_GROW)).toEqual(updateSettings.flexGrow);
                expect(controlElement.height).not.toEqual(updateSettings.height);
                expect(controlElement.left).not.toEqual(updateSettings.left);
                expect(controlElement.top).not.toEqual(updateSettings.top);
                expect(controlElement.width).not.toEqual(updateSettings.width);
            });
        });
    });
});
//# sourceMappingURL=niFlexibleLayoutWrapperViewModel.Test.js.map