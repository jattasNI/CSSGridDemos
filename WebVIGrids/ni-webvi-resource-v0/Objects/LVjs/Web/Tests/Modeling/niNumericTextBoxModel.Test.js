//****************************************
// Tests for NumericTextBoxModel class
// National Instruments Copyright 2014
//****************************************
import { NumericTextBoxModel } from '../../Modeling/niNumericTextBoxModel.js';
describe('A NumericTextBoxModel', function () {
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
    const interval = 700;
    const value = 800;
    const significantDigits = 900;
    const precisionDigits = 1000;
    const spinButtonsPosition = { right: 'right', left: 'left' };
    const spinButtons = { visible: true, collapsed: false };
    let otherSettings = {};
    beforeEach(function () {
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            visible: !visible,
            minimum: minimum + 1,
            maximum: maximum + 1,
            interval: interval + 1,
            value: value + 1,
            significantDigits: significantDigits + 1,
            precisionDigits: precisionDigits + 1,
            spinButtonsPosition: spinButtonsPosition.left,
            spinButtons: spinButtons.Collpased,
            textAlignment: 'left'
        };
        controlModel = new NumericTextBoxModel(niControlId);
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
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.top).toEqual(otherSettings.top);
        expect(controlModel.left).toEqual(otherSettings.left);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.height).toEqual(otherSettings.height);
        expect(controlModel.maximum).toEqual(otherSettings.maximum);
        expect(controlModel.minimum).toEqual(otherSettings.minimum);
        expect(controlModel.interval).toEqual(otherSettings.interval);
        expect(controlModel.value).toEqual(otherSettings.value);
        expect(controlModel.significantDigits).toEqual(otherSettings.significantDigits);
        expect(controlModel.precisionDigits).toEqual(otherSettings.precisionDigits);
        expect(controlModel.spinButtonsPosition).toEqual(otherSettings.spinButtonsPosition);
        expect(controlModel.spinButtons).toEqual(otherSettings.spinButtons);
        expect(controlModel.textAlignment).toEqual(otherSettings.textAlignment);
    });
});
//# sourceMappingURL=niNumericTextBoxModel.Test.js.map