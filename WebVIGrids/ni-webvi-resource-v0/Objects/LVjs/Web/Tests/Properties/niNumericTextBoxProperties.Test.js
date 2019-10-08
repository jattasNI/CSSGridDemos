//****************************************
// G Property Tests for NumericTextBoxModel class
// National Instruments Copyright 2018
//****************************************
import { NumericTextBoxModel } from '../../Modeling/niNumericTextBoxModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A NumericTextBox control', function () {
    'use strict';
    let controlId;
    let updateService, viModel, frontPanelControls, controlModel, viewModel, controlElement;
    let numericTextBoxSettings, numericTextBoxComplexSettings, numericTextBoxInt64Settings;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    const NITypes = window.NITypes;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.numericTextBoxSettings.niControlId;
            numericTextBoxSettings = fixture.numericTextBoxSettings;
            numericTextBoxInt64Settings = fixture.numericTextBoxInt64Settings;
            numericTextBoxComplexSettings = fixture.numericTextBoxComplexSettings;
            numericTextBoxSettings.niType = NITypes.DOUBLE;
            numericTextBoxInt64Settings.niType = NITypes.INT64;
            numericTextBoxComplexSettings.niType = NITypes.COMPLEXDOUBLE;
            Object.freeze(numericTextBoxSettings);
            Object.freeze(numericTextBoxInt64Settings);
            Object.freeze(numericTextBoxComplexSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    describe('of float data type ', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElement(numericTextBoxSettings);
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
        it('property read for Value returns the current value.', function () {
            const currentValue = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
            expect(currentValue).toEqual(numericTextBoxSettings.value);
        });
        it('property set for Value updates model.', function (done) {
            const newValue = 20;
            testHelpers.runAsync(done, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            });
        });
        it('property set for Value updates control element.', function (done) {
            const newValue = 399;
            testHelpers.runMultipleAsync(done, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            }, function () {
                expect(controlElement.value).toEqual(newValue.toString());
            });
        });
        it('property set for Value does not call controlChanged function of updateService', function (done) {
            const newValue = 20;
            testHelpers.runAsync(done, function () {
                spyOn(updateService, 'controlChanged');
                viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(updateService.controlChanged).not.toHaveBeenCalled();
            });
        });
        it('property set for valueSignaling calls controlChanged fuction of updateService with correct arguments', function (done) {
            const newValue = 20;
            testHelpers.runAsync(done, function () {
                spyOn(updateService, 'controlChanged');
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValue, numericTextBoxSettings.value);
            });
        });
        it('property set for valueSignaling updates model.', function (done) {
            const newValue = 20;
            testHelpers.runAsync(done, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            });
        });
        it('property set for valueSignaling updates control element.', function (done) {
            const newValue = 399;
            testHelpers.runMultipleAsync(done, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            }, function () {
                expect(controlElement.value).toEqual(newValue.toString());
            });
        });
        it('property get for minimum returns the current minimum value', function () {
            const currentMinValue = viewModel.getGPropertyValue(NumericTextBoxModel.MINIMUM_G_PROPERTY_NAME);
            expect(currentMinValue).toEqual(numericTextBoxSettings.minimum);
        });
        it('property set for minimum updates the model.', function () {
            const newMinValue = 6.6;
            viewModel.setGPropertyValue(NumericTextBoxModel.MINIMUM_G_PROPERTY_NAME, newMinValue);
            expect(controlModel.minimum).toEqual(newMinValue);
        });
        it('property set for minimum updates the element.', function (done) {
            const newMinValue = 8;
            testHelpers.runMultipleAsync(done, function () {
                viewModel.setGPropertyValue(NumericTextBoxModel.MINIMUM_G_PROPERTY_NAME, newMinValue);
            }, function () {
                expect(controlElement.min).toEqual(newMinValue.toString());
            });
        });
        it('property set for minimum with value greater than current max does not update the model.', function () {
            const newMinValue = 20.8;
            viewModel.setGPropertyValue(NumericTextBoxModel.MAXIMUM_G_PROPERTY_NAME, newMinValue);
            expect(controlModel.minimum).toEqual(numericTextBoxSettings.minimum);
        });
        it('property get for maximum returns the current maximum value', function () {
            const currentMaxValue = viewModel.getGPropertyValue(NumericTextBoxModel.MAXIMUM_G_PROPERTY_NAME);
            expect(currentMaxValue).toEqual(numericTextBoxSettings.maximum);
        });
        it('property set for maximum updates the model.', function () {
            const newMaxValue = 20.5;
            viewModel.setGPropertyValue(NumericTextBoxModel.MAXIMUM_G_PROPERTY_NAME, newMaxValue);
            expect(controlModel.maximum).toEqual(newMaxValue);
        });
        it('property set for maximum updates the element.', function (done) {
            const newMaxValue = 200;
            testHelpers.runMultipleAsync(done, function () {
                viewModel.setGPropertyValue(NumericTextBoxModel.MAXIMUM_G_PROPERTY_NAME, newMaxValue);
            }, function () {
                expect(controlElement.max).toEqual(newMaxValue.toString());
            });
        });
        it('property set for maximum with value less than current min does not update the model.', function () {
            const newMaxValue = -8.7;
            viewModel.setGPropertyValue(NumericTextBoxModel.MAXIMUM_G_PROPERTY_NAME, newMaxValue);
            expect(controlModel.maximum).toEqual(numericTextBoxSettings.maximum);
        });
        it('property get for interval returns the current interval value', function () {
            const currentIntervalValue = viewModel.getGPropertyValue(NumericTextBoxModel.INTERVAL_G_PROPERTY_NAME);
            expect(currentIntervalValue).toEqual(numericTextBoxSettings.interval);
        });
        it('property set for interval updates the model.', function () {
            const currentIntervalValue = 10;
            viewModel.setGPropertyValue(NumericTextBoxModel.INTERVAL_G_PROPERTY_NAME, currentIntervalValue);
            expect(controlModel.interval).toEqual(currentIntervalValue);
        });
        it('property set for interval updates the element.', function (done) {
            const currentIntervalValue = 20;
            testHelpers.runMultipleAsync(done, function () {
                viewModel.setGPropertyValue(NumericTextBoxModel.INTERVAL_G_PROPERTY_NAME, currentIntervalValue);
            }, function () {
                expect(controlElement.spinButtonsStep).toEqual(currentIntervalValue.toString());
            });
        });
        it('property set for interval with negative value does not update the model.', function () {
            const currentIntervalValue = -10;
            viewModel.setGPropertyValue(NumericTextBoxModel.INTERVAL_G_PROPERTY_NAME, currentIntervalValue);
            expect(controlModel.interval).toEqual(numericTextBoxSettings.interval);
        });
        it('property set for interval with Infinity updates the model with max value supported by float number.', function () {
            const currentIntervalValue = 'Infinity';
            viewModel.setGPropertyValue(NumericTextBoxModel.INTERVAL_G_PROPERTY_NAME, currentIntervalValue);
            expect(controlModel.interval).toEqual(1.7976931348623157E+308);
        });
        it('property set for interval with NaN does not update the model.', function () {
            const currentIntervalValue = NaN;
            viewModel.setGPropertyValue(NumericTextBoxModel.INTERVAL_G_PROPERTY_NAME, currentIntervalValue);
            expect(controlModel.interval).toEqual(numericTextBoxSettings.interval);
        });
    });
    describe('of int64 data type ', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(numericTextBoxInt64Settings);
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
        it('property read for Value returns the current value.', function () {
            const currentValue = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
            expect(currentValue).toEqual(numericTextBoxInt64Settings.value);
        });
        it('property set for Value updates model.', function (done) {
            const newValue = 20;
            testHelpers.runAsync(done, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            });
        });
        it('property set for Value updates control element.', function (done) {
            const newValue = 734343435807;
            testHelpers.runMultipleAsync(done, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            }, function () {
                expect(controlElement.value).toEqual(newValue.toString());
            });
        });
        it('property set for Value updates control element for large number in string form.', function (done) {
            const newValue = '77568534343435807';
            testHelpers.runMultipleAsync(done, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            }, function () {
                expect(controlElement.value).toEqual(newValue);
            });
        });
        it('property set for Value does not call controlChanged function of updateService', function (done) {
            const newValue = 734343435807;
            testHelpers.runAsync(done, function () {
                spyOn(updateService, 'controlChanged');
                viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(updateService.controlChanged).not.toHaveBeenCalled();
            });
        });
        it('property set for valueSignaling calls controlChanged fuction of updateService with correct arguments.', function (done) {
            const newValue = 734343435807;
            testHelpers.runAsync(done, function () {
                spyOn(updateService, 'controlChanged');
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValue, numericTextBoxInt64Settings.value);
            });
        });
        it('property set for valueSignaling updates model.', function (done) {
            const newValue = 20;
            testHelpers.runAsync(done, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            });
        });
        it('property set for valueSignaling updates control element.', function (done) {
            const newValue = 734343435807;
            testHelpers.runMultipleAsync(done, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            }, function () {
                expect(controlElement.value).toEqual(newValue.toString());
            });
        });
        it('property read for Position returns the current position.', function () {
            const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
            const expectedPosition = {
                "Left": parseInt(numericTextBoxSettings.left),
                "Top": parseInt(numericTextBoxSettings.top)
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
        it('property get for minimum returns the current minimum value', function () {
            const currentMinValue = viewModel.getGPropertyValue(NumericTextBoxModel.MINIMUM_G_PROPERTY_NAME);
            expect(currentMinValue).toEqual(numericTextBoxInt64Settings.minimum);
        });
        it('property set for minimum updates the model.', function () {
            const newMinValue = '6';
            viewModel.setGPropertyValue(NumericTextBoxModel.MINIMUM_G_PROPERTY_NAME, newMinValue);
            expect(controlModel.minimum).toEqual(newMinValue);
        });
        it('property set for minimum updates the element.', function (done) {
            const newMinValue = 8;
            testHelpers.runMultipleAsync(done, function () {
                viewModel.setGPropertyValue(NumericTextBoxModel.MINIMUM_G_PROPERTY_NAME, newMinValue);
            }, function () {
                expect(controlElement.min).toEqual(newMinValue.toString());
            });
        });
        it('property set for minimum with value greater than current max does not update the model.', function () {
            const newMinValue = 20;
            viewModel.setGPropertyValue(NumericTextBoxModel.MAXIMUM_G_PROPERTY_NAME, newMinValue);
            expect(controlModel.minimum).toEqual(numericTextBoxInt64Settings.minimum);
        });
        it('property get for maximum returns the current maximum value', function () {
            const currentMaxValue = viewModel.getGPropertyValue(NumericTextBoxModel.MAXIMUM_G_PROPERTY_NAME);
            expect(currentMaxValue).toEqual(numericTextBoxInt64Settings.maximum);
        });
        it('property set for maximum updates the model.', function () {
            const newMaxValue = 20;
            viewModel.setGPropertyValue(NumericTextBoxModel.MAXIMUM_G_PROPERTY_NAME, newMaxValue);
            expect(controlModel.maximum).toEqual(newMaxValue);
        });
        it('property set for maximum updates the element.', function (done) {
            const newMaxValue = 200;
            testHelpers.runMultipleAsync(done, function () {
                viewModel.setGPropertyValue(NumericTextBoxModel.MAXIMUM_G_PROPERTY_NAME, newMaxValue);
            }, function () {
                expect(controlElement.max).toEqual(newMaxValue.toString());
            });
        });
        it('property set for maximum with value less than current min does not update the model.', function () {
            const newMaxValue = -8;
            viewModel.setGPropertyValue(NumericTextBoxModel.MAXIMUM_G_PROPERTY_NAME, newMaxValue);
            expect(controlModel.maximum).not.toEqual(newMaxValue);
        });
        it('property get for interval returns the current interval value', function () {
            const currentIntervalValue = viewModel.getGPropertyValue(NumericTextBoxModel.INTERVAL_G_PROPERTY_NAME);
            expect(currentIntervalValue).toEqual(numericTextBoxInt64Settings.interval);
        });
        it('property set for interval updates the model.', function () {
            const currentIntervalValue = 10;
            viewModel.setGPropertyValue(NumericTextBoxModel.INTERVAL_G_PROPERTY_NAME, currentIntervalValue);
            expect(controlModel.interval).toEqual(currentIntervalValue);
        });
        it('property set for interval updates the element.', function (done) {
            const currentIntervalValue = '20';
            testHelpers.runMultipleAsync(done, function () {
                viewModel.setGPropertyValue(NumericTextBoxModel.INTERVAL_G_PROPERTY_NAME, currentIntervalValue);
            }, function () {
                expect(controlElement.spinButtonsStep).toEqual(currentIntervalValue.toString());
            });
        });
        it('property set for interval with negative value does not update the model.', function () {
            const currentIntervalValue = '-10';
            viewModel.setGPropertyValue(NumericTextBoxModel.INTERVAL_G_PROPERTY_NAME, currentIntervalValue);
            expect(controlModel.interval).toEqual(numericTextBoxInt64Settings.interval);
        });
    });
    describe('of complex data type', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(numericTextBoxComplexSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
                controlElement = viewModel.element;
            });
        });
        it('property read for Value returns the current value.', function () {
            const currentValue = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
            expect(currentValue).toEqual(numericTextBoxComplexSettings.value.toString());
        });
        it('property set for Value updates model.', function (done) {
            const newValue = '10+11i';
            testHelpers.runAsync(done, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            });
        });
        it('property set for Value updates control element.', function (done) {
            const newValue = '-10+119i';
            testHelpers.runMultipleAsync(done, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            }, function () {
                expect(controlElement.value).toEqual('-10 + 119i');
            });
        });
        it('property set for Value does not call controlChanged function of updateService', function (done) {
            const newValue = '-10+119i';
            testHelpers.runAsync(done, function () {
                spyOn(updateService, 'controlChanged');
                viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(updateService.controlChanged).not.toHaveBeenCalled();
            });
        });
        it('property set for valueSignaling calls controlChanged fuction of updateService with correct arguments.', function (done) {
            const newValue = '-10+119i';
            testHelpers.runAsync(done, function () {
                spyOn(updateService, 'controlChanged');
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValue, numericTextBoxComplexSettings.value);
            });
        });
        it('property set for valueSignaling updates model.', function (done) {
            const newValue = '10+11i';
            testHelpers.runAsync(done, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            });
        });
        it('property set for valueSignaling updates control element.', function (done) {
            const newValue = '-10+119i';
            testHelpers.runMultipleAsync(done, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            }, function () {
                expect(controlElement.value).toEqual('-10 + 119i');
            });
        });
        it('property get for interval returns the current interval value', function () {
            const currentIntervalValue = viewModel.getGPropertyValue(NumericTextBoxModel.INTERVAL_G_PROPERTY_NAME);
            expect(currentIntervalValue).toEqual(numericTextBoxComplexSettings.interval.toString());
        });
        it('property set for interval updates the model.', function () {
            const currentIntervalValue = '20+11i';
            viewModel.setGPropertyValue(NumericTextBoxModel.INTERVAL_G_PROPERTY_NAME, currentIntervalValue);
            expect(controlModel.interval).toEqual(currentIntervalValue);
        });
        it('property set for interval updates the element.', function (done) {
            const currentIntervalValue = '30+119i';
            testHelpers.runMultipleAsync(done, function () {
                viewModel.setGPropertyValue(NumericTextBoxModel.INTERVAL_G_PROPERTY_NAME, currentIntervalValue);
            }, function () {
                expect(controlElement.spinButtonsStep).toEqual(currentIntervalValue);
            });
        });
        it('property set for interval with negative value does not update the model.', function () {
            const currentIntervalValue = '-20+11i';
            viewModel.setGPropertyValue(NumericTextBoxModel.INTERVAL_G_PROPERTY_NAME, currentIntervalValue);
            expect(controlModel.interval).toEqual(numericTextBoxComplexSettings.interval.toString());
        });
        it('property set for interval with Infinity updates the model with max value supported by complex number.', function () {
            const currentIntervalValue = 'Infinity+11i';
            viewModel.setGPropertyValue(NumericTextBoxModel.INTERVAL_G_PROPERTY_NAME, currentIntervalValue);
            expect(controlModel.interval).toEqual('1.7976931348623157e+308 + 1.7976931348623157e+308i');
        });
        it('property set for interval with NaN does not update the model.', function () {
            const currentIntervalValue = 'NaN+11i';
            viewModel.setGPropertyValue(NumericTextBoxModel.INTERVAL_G_PROPERTY_NAME, currentIntervalValue);
            expect(controlModel.interval).toEqual(numericTextBoxComplexSettings.interval.toString());
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
    });
});
//# sourceMappingURL=niNumericTextBoxProperties.Test.js.map