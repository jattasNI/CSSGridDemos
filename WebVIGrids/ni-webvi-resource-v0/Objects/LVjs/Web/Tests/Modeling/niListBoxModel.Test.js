//****************************************
// Tests for ListBoxModel class
// National Instruments Copyright 2015
//****************************************
import { ListBoxModel } from '../../Modeling/niListBoxModel.js';
describe('A ListBoxModel', function () {
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
    const selectionMode = 'ZeroOrOne';
    const selectedIndexes = 0;
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            top: top,
            left: left,
            width: width,
            height: height,
            visible: visible,
            selectionMode: selectionMode,
            source: source,
            selectedIndexes: selectedIndexes
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            visible: !visible,
            source: otherSource,
            selectionMode: 'ZeroOrMore',
            selectedIndexes: [selectedIndexes + 1]
        };
        controlModel = new ListBoxModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('can be constructed', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('can get and set the selectedIndexes property', function () {
        controlModel.selectedIndexes = selectedIndexes;
        expect(controlModel.selectedIndexes).toEqual(selectedIndexes);
    });
    it('can get and set the selectionMode property', function () {
        controlModel.selectionMode = selectionMode;
        expect(controlModel.selectionMode).toEqual(selectionMode);
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
        expect(controlModel.selectedIndexes).toEqual(selectedIndexes);
        expect(controlModel.selectionMode).toEqual(selectionMode);
        expect(controlModel.source).toEqual(source);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.top).toEqual(otherSettings.top);
        expect(controlModel.left).toEqual(otherSettings.left);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.height).toEqual(otherSettings.height);
        expect(controlModel.selectedIndexes).toEqual(otherSettings.selectedIndexes);
        expect(controlModel.selectionMode).toEqual(otherSettings.selectionMode);
        expect(controlModel.source).toEqual(otherSettings.source);
    });
});
//# sourceMappingURL=niListBoxModel.Test.js.map