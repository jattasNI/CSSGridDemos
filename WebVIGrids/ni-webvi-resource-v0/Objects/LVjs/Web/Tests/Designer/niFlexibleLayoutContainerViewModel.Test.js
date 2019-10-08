//****************************************
// Tests for FlexibleLayoutContainerViewModel class
// National Instruments Copyright 2018
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
import { FlexibleLayoutContainerModel } from '../../Modeling/niFlexibleLayoutContainerModel.js';
describe('A FlexibleLayoutContainerViewModel', function () {
    'use strict';
    const controlId = 'Function1';
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
            background: 'rgba(0,0,0,0)',
            borderWidth: '0px',
            borderColor: 'rgba(0,0,0,0)',
            margin: '0px',
            padding: '0px',
            kind: FlexibleLayoutContainerModel.MODEL_KIND,
            direction: 'row',
            horizontalContentAlignment: 'flex-start',
            verticalContentAlignment: 'flex-start',
            height: '150px',
            width: '200px'
        };
        updateSettings = {
            background: 'rgba(100,150,200,0.5)',
            borderWidth: '5px',
            borderColor: 'rgba(25,50,75,0.25)',
            margin: '5px',
            padding: '5px',
            direction: 'column',
            horizontalContentAlignment: 'flex-end',
            verticalContentAlignment: 'space-between',
            height: '50px',
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
        $(document.body).append('<ni-flexible-layout-container ni-control-id="' + controlId + '"></ni-flexible-layout-container>');
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
            expect(controlModel.borderWidth).toEqual(settings.borderWidth);
            expect(controlModel.borderColor).toEqual(settings.borderColor);
            expect(controlModel.background).toEqual(settings.background);
            expect(controlModel.margin).toEqual(settings.margin);
            expect(controlModel.padding).toEqual(settings.padding);
            expect(controlModel.direction).toEqual(settings.direction);
            expect(controlModel.horizontalContentAlignment).toEqual(settings.horizontalContentAlignment);
            expect(controlModel.verticalContentAlignment).toEqual(settings.verticalContentAlignment);
            expect(controlModel.height).toEqual(settings.height);
            expect(controlModel.width).toEqual(settings.width);
        });
        it('and updates the Model and Element when properties change.', function (done) {
            webAppHelper.dispatchMessage(settings.niControlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel).toBeDefined();
                expect(viewModel).toBeDefined();
                expect(controlModel.direction).toEqual(updateSettings.direction);
                expect(controlModel.horizontalContentAlignment).toEqual(updateSettings.horizontalContentAlignment);
                expect(controlModel.verticalContentAlignment).toEqual(updateSettings.verticalContentAlignment);
                expect(controlModel.background).toEqual(updateSettings.background);
                expect(controlModel.borderColor).toEqual(updateSettings.borderColor);
                expect(controlElement.direction).toEqual(updateSettings.direction);
                expect(controlElement.horizontalContentAlignment).toEqual(updateSettings.horizontalContentAlignment);
                expect(controlElement.verticalContentAlignment).toEqual(updateSettings.verticalContentAlignment);
                expect(controlElement.height).not.toEqual(updateSettings.height);
                expect(controlElement.width).not.toEqual(updateSettings.width);
                expect(controlElement.background).not.toEqual(updateSettings.background);
                expect(controlElement.borderWidth).not.toEqual(updateSettings.borderWidth);
                expect(controlElement.borderColor).not.toEqual(updateSettings.borderColor);
                expect(controlElement.margin).not.toEqual(updateSettings.margin);
                expect(controlElement.padding).not.toEqual(updateSettings.padding);
                const style = window.getComputedStyle(controlElement);
                expect(style.getPropertyValue(CSS_PROPERTIES.BORDER_WIDTH)).toEqual(updateSettings.borderWidth);
                expect(style.getPropertyValue(CSS_PROPERTIES.BORDER_COLOR)).toEqual(updateSettings.borderColor);
                expect(style.getPropertyValue(CSS_PROPERTIES.BACKGROUND)).toEqual(updateSettings.background);
                expect(style.getPropertyValue(CSS_PROPERTIES.MARGIN)).toContain(updateSettings.margin);
                expect(style.getPropertyValue(CSS_PROPERTIES.PADDING)).toContain(updateSettings.padding);
            });
        });
        it('and updates the Model and Element when background set to gradient.', function (done) {
            const gradientSettings = {
                background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,245,103,1) 100%)'
            };
            webAppHelper.dispatchMessage(settings.niControlId, gradientSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.background).toEqual(gradientSettings.background);
                expect(controlElement.background).not.toEqual(gradientSettings.background);
                const style = window.getComputedStyle(controlElement);
                expect(style.getPropertyValue(CSS_PROPERTIES.BACKGROUND)).toEqual(gradientSettings.background);
            });
        });
    });
});
//# sourceMappingURL=niFlexibleLayoutContainerViewModel.Test.js.map