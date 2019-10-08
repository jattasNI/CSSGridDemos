//****************************************
// Tests for TreeModel class
// National Instruments Copyright 2014
//****************************************
import { TreeModel } from '../../Modeling/niTreeModel.js';
import { TreeStates } from '../../Framework/niTreeStates.js';
describe('A TreeModel', function () {
    'use strict';
    const TreeSelectionMode = TreeStates.SelectionModeEnum;
    let controlModel;
    const niControlId = 'testId';
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const visible = true;
    const dataSource = [{ "Path": "A", "Column0": "Grandparent" }];
    const allowSelection = true;
    const selectionMode = TreeSelectionMode.SINGLE;
    const selection = ["A"];
    const columnHeaders = ["Grandparent"];
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            top: top,
            left: left,
            width: width,
            height: height,
            visible: visible,
            dataSource: dataSource,
            allowSelection: allowSelection,
            selectionMode: selectionMode,
            selection: selection,
            columnHeaders: columnHeaders
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            visible: !visible,
            dataSource: [{ "Path": "A", "Column0": "Grandparent" }, { "Path": "A\\B", "Column0": "Parent" }],
            allowSelection: false,
            selectionMode: TreeSelectionMode.MULTIPLE,
            selection: ["A\\B"],
            columnHeaders: ["Grandparent", "Parent"]
        };
        controlModel = new TreeModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to set and get the columnHeaderVisible property', function () {
        const currentSetting = controlModel.columnHeaderVisible;
        controlModel.columnHeaderVisible = !currentSetting;
        expect(controlModel.columnHeaderVisible).toEqual(!currentSetting);
    });
    it('allows to set and get the allowSelection property', function () {
        const currentSetting = controlModel.allowSelection;
        controlModel.allowSelection = !currentSetting;
        expect(controlModel.allowSelection).toEqual(!currentSetting);
    });
    it('allows to set and get the selectionMode property', function () {
        const selectionMode = TreeSelectionMode.MULTIPLE;
        controlModel.selectionMode = selectionMode;
        expect(controlModel.selectionMode).toEqual(selectionMode);
    });
    it('allows to set and get the columnHeaders property', function () {
        const columnHeaders = ["Header1", "Header2"];
        controlModel.columnHeaders = columnHeaders;
        expect(controlModel.columnHeaders).toEqual(columnHeaders);
    });
    it('allows to set and get the selection property', function () {
        const selection = ["a"];
        controlModel.selection = selection;
        expect(controlModel.selection).toEqual(selection);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.width).toEqual(width);
        expect(controlModel.height).toEqual(height);
        expect(controlModel.dataSource).toEqual(dataSource);
        expect(controlModel.allowSelection).toEqual(allowSelection);
        expect(controlModel.selectionMode).toEqual(selectionMode);
        expect(controlModel.selection).toEqual(selection);
        expect(controlModel.columnHeaders).toEqual(columnHeaders);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.top).toEqual(otherSettings.top);
        expect(controlModel.left).toEqual(otherSettings.left);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.height).toEqual(otherSettings.height);
        expect(controlModel.dataSource).toEqual(otherSettings.dataSource);
        expect(controlModel.allowSelection).toEqual(otherSettings.allowSelection);
        expect(controlModel.selectionMode).toEqual(otherSettings.selectionMode);
        expect(controlModel.selection).toEqual(otherSettings.selection);
        expect(controlModel.columnHeaders).toEqual(otherSettings.columnHeaders);
    });
});
//# sourceMappingURL=niTreeModel.Test.js.map