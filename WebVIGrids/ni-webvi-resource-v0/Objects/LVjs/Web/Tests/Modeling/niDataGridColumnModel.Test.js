//****************************************
// Tests for DataGridColumnModel class
// National Instruments Copyright 2016
//****************************************
import { DataGridColumnModel } from '../../Modeling/niDataGridColumnModel.js';
describe('A DataGridColumnModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const width = 300;
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            width: width,
            index: 0,
            header: 'A',
            fieldName: 'A',
            pinned: true,
            aggregates: { horizontalAlignment: 'left', items: { min: { label: 'Min' } } }
        };
        otherSettings = {
            width: width + 1,
            index: 1,
            header: 'B',
            fieldName: 'B',
            pinned: false,
            aggregates: { horizontalAlignment: 'center', items: { max: { label: 'Max' } } }
        };
        controlModel = new DataGridColumnModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.width).toEqual(completeSettings.width);
        expect(controlModel.index).toEqual(completeSettings.index);
        expect(controlModel.header).toEqual(completeSettings.header);
        expect(controlModel.fieldName).toEqual(completeSettings.fieldName);
        expect(controlModel.pinned).toEqual(completeSettings.pinned);
        expect(controlModel.aggregates).toEqual(completeSettings.aggregates);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.index).toEqual(otherSettings.index);
        expect(controlModel.header).toEqual(otherSettings.header);
        expect(controlModel.fieldName).toEqual(otherSettings.fieldName);
        expect(controlModel.pinned).toEqual(otherSettings.pinned);
        expect(controlModel.aggregates).toEqual(otherSettings.aggregates);
    });
});
//# sourceMappingURL=niDataGridColumnModel.Test.js.map