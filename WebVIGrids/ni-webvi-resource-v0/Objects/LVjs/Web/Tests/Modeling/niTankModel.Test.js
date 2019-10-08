//****************************************
// Tests for TankModel class
// National Instruments Copyright 2014
//****************************************
import { TankModel } from '../../Modeling/niTankModel.js';
describe('A TankModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const visible = true;
    const minimum = 500;
    const maximum = 600;
    const value = 700;
    const interval = 800;
    const significantDigits = 900;
    const precisionDigits = 1000;
    const majorTicksVisible = true;
    const minorTicksVisible = true;
    const labelsVisible = true;
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            top: top,
            left: left,
            width: width,
            height: height,
            visible: visible,
            minimum: minimum,
            maximum: maximum,
            value: value,
            interval: interval,
            significantDigits: significantDigits,
            precisionDigits: precisionDigits,
            majorTicksVisible: majorTicksVisible,
            minorTicksVisible: minorTicksVisible,
            labelsVisible: labelsVisible
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            visible: !visible,
            minimum: minimum + 1,
            maximum: maximum + 1,
            value: value + 1,
            significantDigits: significantDigits + 1,
            precisionDigits: precisionDigits + 1,
            majorTicksVisible: !majorTicksVisible,
            minorTicksVisible: !minorTicksVisible,
            labelsVisible: !labelsVisible
        };
        controlModel = new TankModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.width).toEqual(width);
        expect(controlModel.height).toEqual(height);
        expect(controlModel.maximum).toEqual(maximum);
        expect(controlModel.minimum).toEqual(minimum);
        expect(controlModel.value).toEqual(value);
        expect(controlModel.significantDigits).toEqual(significantDigits);
        expect(controlModel.precisionDigits).toEqual(precisionDigits);
        expect(controlModel.majorTicksVisible).toEqual(majorTicksVisible);
        expect(controlModel.minorTicksVisible).toEqual(minorTicksVisible);
        expect(controlModel.labelsVisible).toEqual(labelsVisible);
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
        expect(controlModel.significantDigits).toEqual(otherSettings.significantDigits);
        expect(controlModel.precisionDigits).toEqual(otherSettings.precisionDigits);
        expect(controlModel.majorTicksVisible).toEqual(otherSettings.majorTicksVisible);
        expect(controlModel.minorTicksVisible).toEqual(otherSettings.minorTicksVisible);
        expect(controlModel.labelsVisible).toEqual(otherSettings.labelsVisible);
    });
});
//# sourceMappingURL=niTankModel.Test.js.map