//****************************************
// Tests for LinearProgressBarModel class
// National Instruments Copyright 2014
//****************************************
import { LinearProgressBarModel } from '../../Modeling/niLinearProgressBarModel.js';
describe('A LinearProgressBar', function () {
    'use strict';
    const niControlId = 'TestId';
    let controlModel;
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const orientation = LinearProgressBarModel.OrientationEnum.HORIZONTAL;
    const minimum = 0;
    const maximum = 100;
    const value = 50;
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            top: top,
            left: left,
            width: width,
            height: height,
            orientation: orientation,
            minimum: minimum,
            maximum: maximum,
            value: value
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            orientation: LinearProgressBarModel.OrientationEnum.VERTICAL,
            minimum: minimum + 1,
            maximum: maximum + 1,
            value: value
        };
        controlModel = new LinearProgressBarModel(niControlId);
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
    it('allows to call the setMultipleProperties method to test setting properties all at once', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.top).toEqual(top);
        expect(controlModel.left).toEqual(left);
        expect(controlModel.width).toEqual(width);
        expect(controlModel.height).toEqual(height);
        expect(controlModel.orientation).toEqual(orientation);
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
        expect(controlModel.orientation).toEqual(otherSettings.orientation);
        expect(controlModel.maximum).toEqual(otherSettings.maximum);
        expect(controlModel.minimum).toEqual(otherSettings.minimum);
        expect(controlModel.value).toEqual(otherSettings.value);
    });
});
//# sourceMappingURL=niLinearProgressBarModel.Test.js.map