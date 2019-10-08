//****************************************
// Tests for FrontPanelViewModel class
// National Instruments Copyright 2018
//****************************************
import { ColorValueConverters as ColorHelpers } from '../../Framework/ValueConverters/niColorValueConverters.js';
import { FrontPanelModel } from '../../Modeling/niFrontPanelModel.js';
import { LayoutControl } from '../../Elements/ni-layout-control.js';
describe('A FrontPanelViewModel', function () {
    'use strict';
    const controlId = 'FrontPanelViewModelId';
    const layoutsEnum = LayoutControl.LayoutsEnum;
    let viModel, frontPanelControls, controlModel, controlElement, settings, viewModel;
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
            kind: FrontPanelModel.MODEL_KIND,
            layout: layoutsEnum.ABSOLUTE,
            background: 'rgba(238,28,37,0.57)'
        };
        Object.freeze(settings);
    });
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
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('property get for background color returns the current background color', function () {
        const currentColor = viewModel.getGPropertyValue(FrontPanelModel.BACKGROUND_COLOR_G_PROPERTY_NAME);
        expect(ColorHelpers.integerToRGBA(currentColor)).toEqual(settings.background);
    });
    it('property set for background color updates the model.', function () {
        const argbInt = 0x91EE1C25;
        const expectedColor = 'rgba(238,28,37,0.57)';
        viewModel.setGPropertyValue(FrontPanelModel.BACKGROUND_COLOR_G_PROPERTY_NAME, argbInt);
        expect(controlModel.background).toEqual(expectedColor);
    });
    it('property set for background color updates the element.', function (done) {
        const argbInt = 0xFFEE1C25;
        const expectedColor = 'rgba(238,28,37,1)';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(FrontPanelModel.BACKGROUND_COLOR_G_PROPERTY_NAME, argbInt);
        }, function () {
            expect(controlElement.style.getPropertyValue('--ni-background')).toEqual(expectedColor);
        });
    });
    it('property get for background color throws an exception when background is in gradient format.', function () {
        webAppHelper.dispatchMessage(controlId, {
            background: 'linear-gradient(190deg, #FFFFFF 0%, #AAAAAA 100%)'
        });
        expect(function () {
            viewModel.getGPropertyValue(FrontPanelModel.BACKGROUND_COLOR_G_PROPERTY_NAME);
        }).toThrow();
    });
});
//# sourceMappingURL=niFrontPanelProperties.Test.js.map