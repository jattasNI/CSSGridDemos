//****************************************
// Tests for LabelModel class
// National Instruments Copyright 2014
//****************************************
import { LabelModel } from '../../Modeling/niLabelModel.js';
describe('A LabelModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const visible = true;
    const text = 'empty';
    const foreground = '#0000FF';
    const fontSize = '20px';
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            top: top,
            left: left,
            width: width,
            height: height,
            visible: visible,
            text: text,
            foreground: foreground,
            fontSize: fontSize
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            visible: !visible,
            text: text + '2',
            foreground: '#FF0000',
            fontSize: '30px'
        };
        controlModel = new LabelModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to set and get the text property', function () {
        controlModel.text = text;
        expect(controlModel.text).toEqual(text);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.width).toEqual(width);
        expect(controlModel.height).toEqual(height);
        expect(controlModel.text).toEqual(text);
        expect(controlModel.foreground).toEqual(foreground);
        expect(controlModel.fontSize).toEqual(fontSize);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.top).toEqual(otherSettings.top);
        expect(controlModel.left).toEqual(otherSettings.left);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.height).toEqual(otherSettings.height);
        expect(controlModel.text).toEqual(otherSettings.text);
        expect(controlModel.foreground).toEqual(otherSettings.foreground);
        expect(controlModel.fontSize).toEqual(otherSettings.fontSize);
    });
});
//# sourceMappingURL=niLabelModel.Test.js.map