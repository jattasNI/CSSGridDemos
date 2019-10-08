//****************************************
// G Property Tests for NumericScale class
// National Instruments Copyright 2018
//****************************************
import { NumericPointerModel } from '../../Modeling/niNumericPointerModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A NumericPointer control', function () {
    'use strict';
    let viModel, frontPanelControls, sliderControlModel, sliderViewModel, sliderControlElement;
    let gaugeControlId, gaugeSettings, sliderSettings, sliderControlId;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            sliderControlId = fixture.sliderSettings.niControlId;
            sliderSettings = fixture.sliderSettings;
            gaugeControlId = fixture.gaugeSettings.niControlId;
            gaugeSettings = fixture.gaugeSettings;
            Object.freeze(sliderSettings);
            Object.freeze(gaugeSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function (done) {
        webAppHelper.createNIElement(sliderSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            sliderControlModel = frontPanelControls[sliderControlId];
            sliderViewModel = viModel.getControlViewModel(sliderControlId);
            sliderControlElement = sliderViewModel.element;
        });
    });
    afterEach(function () {
        webAppHelper.removeNIElement(sliderControlId);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('property get for scale visible returns the current scale visibility', function () {
        const numericScaleViewModel = sliderViewModel.getGPropertyValue(NumericPointerModel.SCALE_G_PROPERTY_NAME);
        const currentScaleVisibility = numericScaleViewModel.getGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME);
        expect(currentScaleVisibility).toEqual(sliderSettings.scaleVisible);
    });
    it('property set for scale visible updates the model.', function () {
        const scaleVisibility = false;
        const numericScaleViewModel = sliderViewModel.getGPropertyValue(NumericPointerModel.SCALE_G_PROPERTY_NAME);
        expect(sliderControlModel.scaleVisible).toEqual(true);
        numericScaleViewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, scaleVisibility);
        expect(sliderControlModel.scaleVisible).toEqual(scaleVisibility);
    });
    it('property set for scale visible updates the element (slider).', function (done) {
        const scaleVisibility = false;
        testHelpers.runMultipleAsync(done, function () {
            const numericScaleViewModel = sliderViewModel.getGPropertyValue(NumericPointerModel.SCALE_G_PROPERTY_NAME);
            numericScaleViewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, scaleVisibility);
        }, function () {
            expect(sliderControlElement.scalePosition).toEqual('none');
        });
    });
    it('property set for scale visible updates the element (gauge).', function (done) {
        webAppHelper.createNIElement(gaugeSettings);
        const gaugeViewModel = viModel.getControlViewModel(gaugeControlId);
        const gaugeControl = gaugeViewModel.element;
        const scaleVisibility = true;
        testHelpers.runMultipleAsync(done, function () {
            const numericScaleViewModel = gaugeViewModel.getGPropertyValue(NumericPointerModel.SCALE_G_PROPERTY_NAME);
            numericScaleViewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, scaleVisibility);
        }, function () {
            expect(gaugeControl.scalePosition).toEqual('inside');
        });
        webAppHelper.removeNIElement(gaugeControlId);
    });
});
//# sourceMappingURL=NumericScaleProperties.Test.js.map