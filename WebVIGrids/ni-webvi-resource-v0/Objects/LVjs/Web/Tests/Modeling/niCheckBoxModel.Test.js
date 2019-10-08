//****************************************
// Tests for CheckBoxModel class
// National Instruments Copyright 2015
//****************************************
import { CheckBoxModel } from '../../Modeling/niCheckBoxModel.js';
describe('A CheckBoxModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const visible = true;
    const value = true;
    const contentVisible = false;
    const content = 'checkBox';
    const textAlignment = 'center';
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            top: top,
            left: left,
            width: width,
            height: height,
            visible: visible,
            value: value,
            contentVisible: contentVisible,
            content: content,
            textAlignment: textAlignment,
            trueBackground: 'red',
            falseBackground: 'linear-gradient(123.5deg, #AA00CC 0%, #A6A6A6 100%) 1',
            textColor: 'blue',
            checkMarkColor: 'black'
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            visible: !visible,
            value: !value,
            contentVisible: !contentVisible,
            content: content + 'other',
            textAlignment: 'left',
            trueBackground: 'linear-gradient(123.5deg, #AABBCC 0%, #A6B6C6 100%) 1',
            falseBackground: 'blue',
            textColor: 'yellow',
            checkMarkColor: 'red'
        };
        controlModel = new CheckBoxModel(niControlId);
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
        expect(controlModel.top).toEqual(completeSettings.top);
        expect(controlModel.left).toEqual(completeSettings.left);
        expect(controlModel.width).toEqual(completeSettings.width);
        expect(controlModel.height).toEqual(completeSettings.height);
        expect(controlModel.value).toEqual(completeSettings.value);
        expect(controlModel.contentVisible).toEqual(completeSettings.contentVisible);
        expect(controlModel.content).toEqual(completeSettings.content);
        expect(controlModel.textAlignment).toEqual(completeSettings.textAlignment);
        expect(controlModel.trueBackground).toEqual(completeSettings.trueBackground);
        expect(controlModel.falseBackground).toEqual(completeSettings.falseBackground);
        expect(controlModel.textColor).toEqual(completeSettings.textColor);
        expect(controlModel.checkMarkColor).toEqual(completeSettings.checkMarkColor);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.top).toEqual(otherSettings.top);
        expect(controlModel.left).toEqual(otherSettings.left);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.height).toEqual(otherSettings.height);
        expect(controlModel.value).toEqual(otherSettings.value);
        expect(controlModel.contentVisible).toEqual(otherSettings.contentVisible);
        expect(controlModel.content).toEqual(otherSettings.content);
        expect(controlModel.textAlignment).toEqual(otherSettings.textAlignment);
        expect(controlModel.trueBackground).toEqual(otherSettings.trueBackground);
        expect(controlModel.falseBackground).toEqual(otherSettings.falseBackground);
        expect(controlModel.textColor).toEqual(otherSettings.textColor);
        expect(controlModel.checkMarkColor).toEqual(otherSettings.checkMarkColor);
    });
});
//# sourceMappingURL=niCheckBoxModel.Test.js.map