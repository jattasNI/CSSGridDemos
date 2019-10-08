//****************************************
// Tests for ProgressBarModel class
// National Instruments Copyright 2014
//****************************************
import { ProgressBarModel } from '../../Modeling/niProgressBarModel.js';
describe('A ProgressBar', function () {
    'use strict';
    const niControlId = 'TestId';
    let controlModel;
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const minimum = 0;
    const maximum = 100;
    const value = 50;
    const indeterminate = true;
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            top: top,
            left: left,
            width: width,
            height: height,
            minimum: minimum,
            maximum: maximum,
            value: value
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            minimum: minimum + 1,
            maximum: maximum + 1,
            value: value,
            indeterminate: indeterminate
        };
        controlModel = new ProgressBarModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to set and get the maximum property', function () {
        controlModel.maximum = maximum;
        expect(controlModel.maximum).toEqual(maximum);
    });
    it('allows to set and get the minimum property', function () {
        controlModel.minimum = minimum;
        expect(controlModel.minimum).toEqual(minimum);
    });
    it('allows to set and get the value property', function () {
        controlModel.value = value;
        expect(controlModel.value).toEqual(value);
    });
    it('allows to set and get the indeterminate property', function () {
        controlModel.indeterminate = indeterminate;
        expect(controlModel.indeterminate).toEqual(indeterminate);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to test setting properties all at once', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.top).toEqual(top);
        expect(controlModel.left).toEqual(left);
        expect(controlModel.width).toEqual(width);
        expect(controlModel.height).toEqual(height);
        expect(controlModel.minimum).toEqual(minimum);
        expect(controlModel.maximum).toEqual(maximum);
        expect(controlModel.value).toEqual(value);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.top).toEqual(otherSettings.top);
        expect(controlModel.left).toEqual(otherSettings.left);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.height).toEqual(otherSettings.height);
        expect(controlModel.maximum).toEqual(otherSettings.maximum);
        expect(controlModel.minimum).toEqual(otherSettings.minimum);
        expect(controlModel.value).toEqual(otherSettings.value);
        expect(controlModel.indeterminate).toEqual(otherSettings.indeterminate);
    });
});
//# sourceMappingURL=niProgressBarModel.Test.js.map