//****************************************
// Tests for FlexibleLayoutComponentViewModel class
// National Instruments Copyright 2018
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
import { FlexibleLayoutComponentModel } from '../../Modeling/niFlexibleLayoutComponentModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A FlexibleLayoutComponentViewModel', function () {
    'use strict';
    let viModel, settings, frontPanelControls, controlModel, controlElement, updateSettings, viewModel;
    const componentControlId = 'component';
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
            niControlId: componentControlId,
            kind: FlexibleLayoutComponentModel.MODEL_KIND,
            controlResizeMode: VisualModel.ControlResizeModeEnum.FIXED,
            margin: '0px'
        };
        updateSettings = {
            controlResizeMode: VisualModel.ControlResizeModeEnum.RESIZE_HORIZONTALY,
            margin: '5px'
        };
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page.', function (done) {
        $(document.body).append('<ni-flexible-layout-component ni-control-id="' + componentControlId + '"></ni-flexible-layout-component>');
        testHelpers.runAsync(done, function () {
            viewModel = viModel.getControlViewModel(componentControlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(componentControlId);
        });
    });
    describe('exists after the custom element is created', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElement(settings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[componentControlId];
                viewModel = viModel.getControlViewModel(componentControlId);
                controlElement = viewModel.element;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(componentControlId);
        });
        it('and has the correct initial values.', function () {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlModel.controlResizeMode).toEqual(settings.controlResizeMode);
            expect(controlModel.margin).toEqual(settings.margin);
        });
        it('and updates the Model and Element when properties change.', function (done) {
            webAppHelper.dispatchMessage(settings.niControlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel).toBeDefined();
                expect(viewModel).toBeDefined();
                expect(controlModel.controlResizeMode).toEqual(updateSettings.controlResizeMode);
                expect(controlModel.margin).toEqual(updateSettings.margin);
                const style = window.getComputedStyle(controlElement);
                expect(style.getPropertyValue(CSS_PROPERTIES.MARGIN)).toContain(updateSettings.margin);
            });
        });
    });
});
//# sourceMappingURL=niFlexibleLayoutComponentViewModel.Test.js.map