//****************************************
// Tests for BooleanSwitchModel class
// National Instruments Copyright 2015
//****************************************
import { BooleanSwitchModel } from '../../Modeling/niBooleanSwitchModel.js';
describe('A BooleanSwitchModel', function () {
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
    const content = 'booleanSwitchButton';
    const trueContent = 'on';
    const falseContent = 'off';
    const orientation = 'vertical';
    const foreground = 'red';
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
            trueContent: trueContent,
            falseContent: falseContent,
            orientation: orientation,
            foreground: foreground,
            textAlignment: 'right'
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
            trueContent: trueContent + 'other',
            falseContent: falseContent + 'other',
            orientation: orientation + 'other',
            foreground: 'blue',
            textAlignment: 'center'
        };
        controlModel = new BooleanSwitchModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to set and get the orientation property', function () {
        controlModel.orientation = orientation;
        expect(controlModel.orientation).toEqual(orientation);
    });
    it('allows to set and get the foreground color property', function () {
        controlModel.foreground = foreground;
        expect(controlModel.foreground).toEqual(foreground);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to set properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.top).toEqual(completeSettings.top);
        expect(controlModel.left).toEqual(completeSettings.left);
        expect(controlModel.width).toEqual(completeSettings.width);
        expect(controlModel.height).toEqual(completeSettings.height);
        expect(controlModel.value).toEqual(completeSettings.value);
        expect(controlModel.contentVisible).toEqual(completeSettings.contentVisible);
        expect(controlModel.content).toEqual(completeSettings.content);
        expect(controlModel.trueContent).toEqual(completeSettings.trueContent);
        expect(controlModel.falseContent).toEqual(completeSettings.falseContent);
        expect(controlModel.orientation).toEqual(completeSettings.orientation);
        expect(controlModel.foreground).toEqual(completeSettings.foreground);
        expect(controlModel.textAlignment).toEqual(completeSettings.textAlignment);
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
        expect(controlModel.trueContent).toEqual(otherSettings.trueContent);
        expect(controlModel.falseContent).toEqual(otherSettings.falseContent);
        expect(controlModel.orientation).toEqual(otherSettings.orientation);
        expect(controlModel.foreground).toEqual(otherSettings.foreground);
        expect(controlModel.textAlignment).toEqual(otherSettings.textAlignment);
    });
});
//# sourceMappingURL=niBooleanSwitchModel.Test.js.map