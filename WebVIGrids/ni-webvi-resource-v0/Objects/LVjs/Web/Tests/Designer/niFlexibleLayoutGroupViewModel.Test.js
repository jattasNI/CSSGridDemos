//****************************************
// Tests for FlexibleLayoutGroupViewModel class
// National Instruments Copyright 2018
//****************************************
import { FlexibleLayoutGroupModel } from '../../Modeling/niFlexibleLayoutGroupModel.js';
describe('A FlexibleLayoutGroupViewModel', function () {
    'use strict';
    const controlId = 'Function13';
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
            kind: FlexibleLayoutGroupModel.MODEL_KIND,
            height: '150px',
            width: '200px'
        };
        updateSettings = {
            height: '300px',
            width: '120px'
        };
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page.', function (done) {
        $(document.body).append('<ni-flexible-layout-group ni-control-id="' + controlId + '"></ni-flexible-layout-group>');
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
            expect(controlModel.height).toEqual(settings.height);
            expect(controlModel.width).toEqual(settings.width);
        });
        it('and updates the Model and Element when properties change.', function (done) {
            webAppHelper.dispatchMessage(settings.niControlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel).toBeDefined();
                expect(viewModel).toBeDefined();
                expect(controlElement.height).not.toEqual(updateSettings.height);
                expect(controlElement.width).not.toEqual(updateSettings.width);
            });
        });
    });
});
//# sourceMappingURL=niFlexibleLayoutGroupViewModel.Test.js.map