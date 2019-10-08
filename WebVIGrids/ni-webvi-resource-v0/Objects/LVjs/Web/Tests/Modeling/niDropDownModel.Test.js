//****************************************
// Tests for DropDownModel class
// National Instruments Copyright 2015
//****************************************
import { DropDownModel } from '../../Modeling/niDropDownModel.js';
describe('A DropDownModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const visible = true;
    const source = ['one', 'two', 'three'];
    const otherSource = ['alpha', 'beta', 'charlie'];
    const selectedIndex = 0;
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            top: top,
            left: left,
            width: width,
            height: height,
            visible: visible,
            source: source,
            selectedIndex: selectedIndex,
            textAlignment: 'center'
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            visible: !visible,
            source: otherSource,
            selectedIndex: selectedIndex + 1,
            textAlignment: 'left'
        };
        controlModel = new DropDownModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('can be constructed', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('can get and set the selectedIndex property', function () {
        controlModel.selectedIndex = selectedIndex;
        expect(controlModel.selectedIndex).toEqual(selectedIndex);
    });
    it('can get and set the source property', function () {
        controlModel.source = source;
        expect(controlModel.source).toEqual(source);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.width).toEqual(width);
        expect(controlModel.height).toEqual(height);
        expect(controlModel.selectedIndex).toEqual(selectedIndex);
        expect(controlModel.source).toEqual(source);
        expect(controlModel.textAlignment).toEqual(completeSettings.textAlignment);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.top).toEqual(otherSettings.top);
        expect(controlModel.left).toEqual(otherSettings.left);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.height).toEqual(otherSettings.height);
        expect(controlModel.selectedIndex).toEqual(otherSettings.selectedIndex);
        expect(controlModel.source).toEqual(otherSettings.source);
        expect(controlModel.textAlignment).toEqual(otherSettings.textAlignment);
    });
});
//# sourceMappingURL=niDropDownModel.Test.js.map