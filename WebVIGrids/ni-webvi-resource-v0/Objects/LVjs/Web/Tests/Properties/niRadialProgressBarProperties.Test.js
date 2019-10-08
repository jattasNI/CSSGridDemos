//****************************************
// G Property Tests for RadialProgressBarModel class
// National Instruments Copyright 2018
//****************************************
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A RadialProgressBarModel control', function () {
    'use strict';
    let controlId;
    let updateService, viModel, frontPanelControls, controlModel, viewModel, controlElement, radialProgressBarSettings;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.radialProgressBarSettings2.niControlId;
            radialProgressBarSettings = fixture.radialProgressBarSettings2;
            Object.freeze(radialProgressBarSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    beforeEach(function (done) {
        webAppHelper.createNIElement(radialProgressBarSettings);
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
    it('property read for Value returns the current value.', function () {
        const items = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
        expect(items).toEqual(radialProgressBarSettings.value);
    });
    it('property set for Value updates model.', function (done) {
        const newValue = 3;
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        });
    });
    it('property set for Value updates control element.', function (done) {
        const newValue = 5;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        }, function () {
            expect(controlElement.value).toEqual(newValue);
        });
    });
    it('property set for Value sets back to minimum if value less than minimum.', function (done) {
        const newValue = 115;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(radialProgressBarSettings.maximum);
        }, function () {
            expect(controlElement.value).toEqual(radialProgressBarSettings.maximum);
        });
    });
    it('property set for Value sets back to maximum if value is greater then maximum.', function (done) {
        const newValue = 0;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(radialProgressBarSettings.minimum);
        }, function () {
            expect(controlElement.value).toEqual(radialProgressBarSettings.minimum);
        });
    });
    it('property set for Value does not call controlChanged function of updateService', function (done) {
        const newValue = 3;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).not.toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling calls controlChanged function of updateService with correct arguments', function (done) {
        const newValue = 3;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValue, radialProgressBarSettings.value);
        });
    });
    it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
        const newValue = radialProgressBarSettings.value;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling updates model.', function (done) {
        const newValue = 3;
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        });
    });
    it('property set for valueSignaling updates control element.', function (done) {
        const newValue = 5;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        }, function () {
            expect(controlElement.value).toEqual(newValue);
        });
    });
    it('property set for valueSignaling sets back to minimum if value less than minimum.', function (done) {
        const newValue = 115;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(radialProgressBarSettings.maximum);
        }, function () {
            expect(controlElement.value).toEqual(radialProgressBarSettings.maximum);
        });
    });
    it('property set for valueSignaling sets back to maximum if value is greater then maximum.', function (done) {
        const newValue = 0;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(radialProgressBarSettings.minimum);
        }, function () {
            expect(controlElement.value).toEqual(radialProgressBarSettings.minimum);
        });
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(radialProgressBarSettings.left),
            "Top": parseInt(radialProgressBarSettings.top)
        };
        expect(position).toEqual(expectedPosition);
    });
    it('property set for Position updates model.', function (done) {
        const newPosition = { Left: 100, Top: 200 };
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
            expect(parseInt(controlModel.left)).toEqual(newPosition.Left);
            expect(parseInt(controlModel.top)).toEqual(newPosition.Top);
        });
    });
    it('property set for Position updates control element.', function (done) {
        const newPosition = { Left: 150, Top: 250 };
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
        }, function () {
            const computedStyle = window.getComputedStyle(controlElement);
            expect(parseInt(computedStyle.left)).toEqual(newPosition.Left);
            expect(parseInt(computedStyle.top)).toEqual(newPosition.Top);
        });
    });
});
//# sourceMappingURL=niRadialProgressBarProperties.Test.js.map