//****************************************
// Tests for BooleanButtonModel class
// National Instruments Copyright 2014
//****************************************
import { BooleanButtonModel } from '../../Modeling/niBooleanButtonModel.js';
describe('A BooleanButtonModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const visible = true;
    let otherSettings = {};
    beforeEach(function () {
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            visible: !visible,
            trueForeground: 'red',
            trueBackground: 'white',
            falseForeground: 'black',
            falseBackground: '#00ACDA',
            borderColor: 'red'
        };
        controlModel = new BooleanButtonModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.top).toEqual(otherSettings.top);
        expect(controlModel.left).toEqual(otherSettings.left);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.height).toEqual(otherSettings.height);
        expect(controlModel.trueBackground).toEqual(otherSettings.trueBackground);
        expect(controlModel.trueForeground).toEqual(otherSettings.trueForeground);
        expect(controlModel.falseBackground).toEqual(otherSettings.falseBackground);
        expect(controlModel.falseForeground).toEqual(otherSettings.falseForeground);
        expect(controlModel.borderColor).toEqual(otherSettings.borderColor);
    });
    it('allows to set linear-gradient color to border', function () {
        const borderImage = 'linear-gradient(45deg, red 0%, blue 100%) 1';
        controlModel.setMultipleProperties({ borderColor: borderImage });
        expect(controlModel.borderColor).toEqual(borderImage);
    });
});
//# sourceMappingURL=niBooleanButtonModel.Test.js.map