//****************************************
// G Property Tests for SliderModel class
// National Instruments Copyright 2018
//****************************************
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A Slider control', function () {
    'use strict';
    let controlId = 'SliderViewModelId';
    let viModel, frontPanelControls, controlModel, viewModel, controlElement, sliderSettings;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.sliderSettings.niControlId;
            sliderSettings = fixture.sliderSettings;
            Object.freeze(sliderSettings);
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
        const currentValue = viewModel.getGPropertyValue('Value');
        expect(currentValue).toEqual(sliderSettings.value);
    });
    it('property set for Value updates model.', function (done) {
        const newValue = 3;
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue('Value', newValue);
            expect(controlModel.value).toEqual(newValue);
        });
    });
    it('property set for Value updates control element.', function (done) {
        const newValue = 5;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue('Value', newValue);
            expect(controlModel.value).toEqual(newValue);
        }, function () {
            expect(controlElement.value).toEqual(newValue.toString());
        });
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(sliderSettings.left),
            "Top": parseInt(sliderSettings.top)
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
//# sourceMappingURL=niSliderProperties.Test.js.map