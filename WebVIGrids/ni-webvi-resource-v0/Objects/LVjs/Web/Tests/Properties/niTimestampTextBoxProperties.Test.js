//****************************************
// G Property Tests for TimestampTextBoxModel class
// National Instruments Copyright 2018
//****************************************
import { JQXDateTimeValueConverter } from '../../Framework/ValueConverters/niJQXDateTimeValueConverter.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A TimestampTextBox control', function () {
    'use strict';
    let controlId;
    let updateService, viModel, frontPanelControls, controlModel, viewModel, controlElement, timeStampSettings;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.timeStampSettings.niControlId;
            timeStampSettings = fixture.timeStampSettings;
            Object.freeze(timeStampSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    beforeEach(function (done) {
        webAppHelper.createNIElement(timeStampSettings);
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
        expect(items).toEqual(timeStampSettings.value);
    });
    it('property set for Value updates model.', function (done) {
        const newValue = '2714018500:0';
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        });
    });
    it('property set for Value updates control element.', function (done) {
        const newDate = '2714018600:0';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newDate);
            expect(controlModel.value).toEqual(newDate);
        }, function () {
            const newDateTime = JQXDateTimeValueConverter.convertBack(controlElement.value);
            expect(newDateTime).toEqual(newDate);
        });
    });
    it('property set for Value does not call controlChanged function of updateService', function (done) {
        const newValue = '2714018500:0';
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).not.toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling calls controlChanged function of updateService with correct arguments', function (done) {
        const newValue = '2714018500:0';
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValue, timeStampSettings.value);
        });
    });
    it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
        const newValue = timeStampSettings.value;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling updates model.', function (done) {
        const newValue = '2714018500:0';
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        });
    });
    it('property set for valueSignaling updates control element.', function (done) {
        const newDate = '2714018600:0';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newDate);
            expect(controlModel.value).toEqual(newDate);
        }, function () {
            const newDateTime = JQXDateTimeValueConverter.convertBack(controlElement.value);
            expect(newDateTime).toEqual(newDate);
        });
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(timeStampSettings.left),
            "Top": parseInt(timeStampSettings.top)
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
//# sourceMappingURL=niTimestampTextBoxProperties.Test.js.map