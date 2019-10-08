//****************************************
// Tests for RingSelectorModel class
// National Instruments Copyright 2015
//****************************************
import { RingSelectorModel } from '../../Modeling/niRingSelectorModel.js';
describe('A RingSelectorModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const visible = true;
    const items = [{ value: 0, displayValue: 'first' }, { value: 2, displayValue: 'second' }, { value: 10, displayValue: 'third' }];
    const otherItems = [{ value: 0, displayValue: 'a' }, { value: 2, displayValue: 'b' }, { value: 10, displayValue: 'c' }];
    const allowUndefined = false;
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
            allowUndefined: allowUndefined,
            items: items,
            value: numericIndex,
            textAlignment: 'center'
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            visible: !visible,
            allowUndefined: !allowUndefined,
            items: otherItems,
            value: 2,
            textAlignment: 'right'
        };
        controlModel = new RingSelectorModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('can be constructed', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('can get and set the value property', function () {
        controlModel.value = numericIndex;
        expect(controlModel.value).toEqual(numericIndex);
    });
    it('can get and set the allowUndefined property', function () {
        controlModel.allowUndefined = allowUndefined;
        expect(controlModel.allowUndefined).toEqual(allowUndefined);
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
        expect(controlModel.allowUndefined).toEqual(allowUndefined);
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
        expect(controlModel.allowUndefined).toEqual(otherSettings.allowUndefined);
        expect(controlModel.items).toEqual(otherSettings.items);
        expect(controlModel.textAlignment).toEqual(otherSettings.textAlignment);
    });
});
//# sourceMappingURL=niRingSelectorModel.Test.js.map