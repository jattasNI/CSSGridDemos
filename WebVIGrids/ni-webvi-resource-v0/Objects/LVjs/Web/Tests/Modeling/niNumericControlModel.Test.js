//****************************************
// Tests for NumericControlModel class
// National Instruments Copyright 2014
//****************************************
import { NumericControlModel } from '../../Modeling/niNumericControlModel.js';
describe('A NumericControlModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const minimum = 100;
    const maximum = 200;
    const interval = 1;
    const value = 300;
    const significantDigits = 400;
    const precisionDigits = 500;
    const format = 'floating point';
    let settings = {};
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            minimum: minimum,
            maximum: maximum,
            interval: interval,
            value: value,
            significantDigits: significantDigits,
            precisionDigits: precisionDigits,
            format: format
        };
        otherSettings = {
            minimum: minimum + 1,
            maximum: maximum + 1,
            interval: interval + 1,
            value: value + 1,
            significantDigits: significantDigits + 1,
            precisionDigits: precisionDigits + 1,
            format: 'engineering'
        };
        settings = {};
        controlModel = new NumericControlModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to set and get the maximum property', function () {
        controlModel.minimum = minimum;
        expect(controlModel.minimum).toEqual(minimum);
    });
    it('allows to set and get the minimum property', function () {
        controlModel.maximum = maximum;
        expect(controlModel.maximum).toEqual(maximum);
    });
    it('allows to set and get the interval property', function () {
        controlModel.interval = interval;
        expect(controlModel.interval).toEqual(interval);
    });
    it('allows to set and get the value property', function () {
        controlModel.value = value;
        expect(controlModel.value).toEqual(value);
    });
    it('allows to set and get the significantDigits property', function () {
        controlModel.significantDigits = significantDigits;
        expect(controlModel.significantDigits).toEqual(significantDigits);
    });
    it('allows to set and get the precisionDigits property', function () {
        controlModel.precisionDigits = precisionDigits;
        expect(controlModel.precisionDigits).toEqual(precisionDigits);
    });
    it('allows to set and get the format property', function () {
        controlModel.format = format;
        expect(controlModel.format).toEqual(format);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update all the properties at the same time', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.minimum).toEqual(minimum);
        expect(controlModel.maximum).toEqual(maximum);
        expect(controlModel.interval).toEqual(interval);
        expect(controlModel.value).toEqual(value);
        expect(controlModel.significantDigits).toEqual(significantDigits);
        expect(controlModel.precisionDigits).toEqual(precisionDigits);
        expect(controlModel.format).toEqual(format);
    });
    it('allows to call the setMultipleProperties method with an unknown property', function () {
        controlModel.setMultipleProperties(completeSettings);
        const sendUnknownProperties = function () {
            controlModel.setMultipleProperties({
                unknownProperty: 'someValue'
            });
        };
        expect(sendUnknownProperties).toThrow();
        expect(controlModel.minimum).toEqual(minimum);
        expect(controlModel.maximum).toEqual(maximum);
        expect(controlModel.interval).toEqual(interval);
        expect(controlModel.value).toEqual(value);
        expect(controlModel.significantDigits).toEqual(significantDigits);
        expect(controlModel.precisionDigits).toEqual(precisionDigits);
        expect(controlModel.format).toEqual(format);
    });
    it('allows to call the setMultipleProperties method to update just one property without updating others', function () {
        controlModel.setMultipleProperties(completeSettings);
        settings = {
            minimum: minimum * 2
        };
        controlModel.setMultipleProperties(settings);
        expect(controlModel.minimum).toEqual(settings.minimum);
        expect(controlModel.maximum).toEqual(maximum);
        expect(controlModel.interval).toEqual(interval);
        expect(controlModel.value).toEqual(value);
        expect(controlModel.significantDigits).toEqual(significantDigits);
        expect(controlModel.precisionDigits).toEqual(precisionDigits);
        expect(controlModel.format).toEqual(format);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.minimum).toEqual(otherSettings.minimum);
        expect(controlModel.maximum).toEqual(otherSettings.maximum);
        expect(controlModel.interval).toEqual(otherSettings.interval);
        expect(controlModel.value).toEqual(otherSettings.value);
        expect(controlModel.significantDigits).toEqual(otherSettings.significantDigits);
        expect(controlModel.precisionDigits).toEqual(otherSettings.precisionDigits);
        expect(controlModel.format).toEqual(otherSettings.format);
    });
});
//# sourceMappingURL=niNumericControlModel.Test.js.map