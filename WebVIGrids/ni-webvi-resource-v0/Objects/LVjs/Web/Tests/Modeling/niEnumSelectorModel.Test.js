//****************************************
// Tests for EnumSelectorModel class
// National Instruments Copyright 2015
//****************************************
import { EnumSelectorModel } from '../../Modeling/niEnumSelectorModel.js';
describe('A EnumSelectorModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const visible = true;
    const items = [{ value: 0, displayValue: 'first' }, { value: 1, displayValue: 'second' }, { value: 2, displayValue: 'third' }];
    const otherItems = [{ value: 0, displayValue: 'a' }, { value: 1, displayValue: 'b' }, { value: 2, displayValue: 'c' }];
    const numericIndex = 0;
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            top: top,
            left: left,
            width: width,
            height: height,
            visible: visible,
            items: items,
            value: numericIndex,
            textAlignment: 'right'
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            visible: !visible,
            items: otherItems,
            value: 2,
            textAlignment: 'center'
        };
        controlModel = new EnumSelectorModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('can be constructed', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('can get and set the numeriIndex property', function () {
        controlModel.value = numericIndex;
        expect(controlModel.value).toEqual(numericIndex);
    });
    it('can get and set the source property', function () {
        controlModel.items = items;
        expect(controlModel.items).toEqual(items);
    });
    it('can get and set the disabledIndexes property', function () {
        const disabledIndexes = [0, 2];
        controlModel.items = items;
        controlModel.disabledIndexes = disabledIndexes;
        expect(controlModel.disabledIndexes).toEqual(disabledIndexes);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.width).toEqual(width);
        expect(controlModel.height).toEqual(height);
        expect(controlModel.value).toEqual(numericIndex);
        expect(controlModel.items).toEqual(items);
        expect(controlModel.textAlignment).toEqual(completeSettings.textAlignment);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.top).toEqual(otherSettings.top);
        expect(controlModel.left).toEqual(otherSettings.left);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.height).toEqual(otherSettings.height);
        expect(controlModel.value).toEqual(otherSettings.value);
        expect(controlModel.items).toEqual(otherSettings.items);
        expect(controlModel.textAlignment).toEqual(otherSettings.textAlignment);
    });
});
//# sourceMappingURL=niEnumSelectorModel.Test.js.map