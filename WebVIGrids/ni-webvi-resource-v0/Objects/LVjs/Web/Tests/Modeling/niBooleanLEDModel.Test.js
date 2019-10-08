//****************************************
// Tests for BooleanLEDModel class
// National Instruments Copyright 2014
//****************************************
import { BooleanLEDModel } from '../../Modeling/niBooleanLEDModel.js';
describe('A BooleanLEDModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const visible = true;
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            top: top,
            left: left,
            width: width,
            height: height,
            visible: visible,
            shape: 'round',
            trueBackground: 'red',
            falseBackground: 'green',
            trueForeground: 'black',
            falseForeground: 'white'
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            visible: !visible,
            shape: 'square',
            trueBackground: 'blue',
            trueForeground: 'red',
            falseBackground: 'yellow',
            falseForeground: 'white'
        };
        controlModel = new BooleanLEDModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to set and get the shape, trueBackground, falseBackground, trueForeground, falseForeground property', function () {
        controlModel.shape = completeSettings.shape;
        controlModel.trueBackground = completeSettings.trueBackground;
        controlModel.falseBackground = completeSettings.falseBackground;
        controlModel.trueForeground = completeSettings.trueForeground;
        controlModel.falseForeground = completeSettings.falseForeground;
        expect(controlModel.shape).toEqual(completeSettings.shape);
        expect(controlModel.trueBackground).toEqual(completeSettings.trueBackground);
        expect(controlModel.trueForeground).toEqual(completeSettings.trueForeground);
        expect(controlModel.falseBackground).toEqual(completeSettings.falseBackground);
        expect(controlModel.falseForeground).toEqual(completeSettings.falseForeground);
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
        expect(controlModel.shape).toEqual(otherSettings.shape);
        expect(controlModel.trueBackground).toEqual(otherSettings.trueBackground);
        expect(controlModel.trueForeground).toEqual(otherSettings.trueForeground);
        expect(controlModel.falseBackground).toEqual(otherSettings.falseBackground);
        expect(controlModel.falseForeground).toEqual(otherSettings.falseForeground);
    });
});
//# sourceMappingURL=niBooleanLEDModel.Test.js.map