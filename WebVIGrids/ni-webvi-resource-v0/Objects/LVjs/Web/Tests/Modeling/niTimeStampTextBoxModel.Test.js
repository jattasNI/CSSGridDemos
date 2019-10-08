//****************************************
// Tests for TimeStampTextBoxModel class
// National Instruments Copyright 2015
//****************************************
import { TimeStampTextBoxModel } from '../../Modeling/niTimeStampTextBoxModel.js';
describe('A TimeStampTextBoxModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const visible = true;
    const value = 3376663199;
    const value2 = 2714018400;
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
            textAlignment: 'center'
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            visible: !visible,
            value: value2,
            textAlignment: 'right'
        };
        controlModel = new TimeStampTextBoxModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to set and get the value property', function () {
        controlModel.value = value;
        expect(controlModel.value).toEqual(value);
    });
    it('allows to set and get the readOnly property', function () {
        controlModel.readOnly = true;
        expect(controlModel.readOnly).toEqual(true);
        controlModel.readOnly = false;
        expect(controlModel.readOnly).toEqual(false);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.width).toEqual(width);
        expect(controlModel.height).toEqual(height);
        expect(controlModel.value).toEqual(value);
        expect(controlModel.textAlignment).toEqual(completeSettings.textAlignment);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.top).toEqual(otherSettings.top);
        expect(controlModel.left).toEqual(otherSettings.left);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.height).toEqual(otherSettings.height);
        expect(controlModel.value).toEqual(otherSettings.value);
        expect(controlModel.textAlignment).toEqual(otherSettings.textAlignment);
    });
});
//# sourceMappingURL=niTimeStampTextBoxModel.Test.js.map