//****************************************
// Tests for StringControlModel class
// National Instruments Copyright 2015
//****************************************
import { StringControlModel } from '../../Modeling/niStringControlModel.js';
describe('A StringControlModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const visible = true;
    const value = 'empty';
    const wordWrap = false;
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            top: top,
            left: left,
            width: width,
            height: height,
            visible: visible,
            text: value,
            wordWrap: wordWrap,
            textAlignment: 'center',
            escapedDisplayMode: 'default'
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            visible: !visible,
            text: value + '2',
            wordWrap: !wordWrap,
            textAlignment: 'right',
            escapedDisplayMode: 'escaped'
        };
        controlModel = new StringControlModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to set and get the text property', function () {
        controlModel.text = value;
        expect(controlModel.text).toEqual(value);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.width).toEqual(width);
        expect(controlModel.height).toEqual(height);
        expect(controlModel.text).toEqual(value);
        expect(controlModel.wordWrap).toEqual(wordWrap);
        expect(controlModel.textAlignment).toEqual(completeSettings.textAlignment);
        expect(controlModel.escapedDisplayMode).toEqual(completeSettings.escapedDisplayMode);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.top).toEqual(otherSettings.top);
        expect(controlModel.left).toEqual(otherSettings.left);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.height).toEqual(otherSettings.height);
        expect(controlModel.text).toEqual(otherSettings.text);
        expect(controlModel.wordWrap).toEqual(otherSettings.wordWrap);
        expect(controlModel.textAlignment).toEqual(otherSettings.textAlignment);
        expect(controlModel.escapedDisplayMode).toEqual(otherSettings.escapedDisplayMode);
    });
});
//# sourceMappingURL=niStringControlModel.Test.js.map