//****************************************
// Tests for TabControlModel class
// National Instruments Copyright 2014
//****************************************
import { TabControlModel } from '../../Modeling/niTabControlModel.js';
describe('A TabControlModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const selectedIndex = 0;
    const tabStripPlacement = 'top';
    const minHeight = '100px';
    let completeSettings;
    let otherSettings;
    beforeEach(function () {
        completeSettings = {
            tabStripPlacement: tabStripPlacement,
            selectedIndex: selectedIndex,
            minHeight: minHeight
        };
        otherSettings = {
            tabStripPlacement: 'left',
            selectedIndex: selectedIndex + 1,
            minHeight: '200px'
        };
        controlModel = new TabControlModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call the constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to set and get the selectedIndex property', function () {
        controlModel.selectedIndex = selectedIndex;
        expect(controlModel.selectedIndex).toEqual(selectedIndex);
    });
    it('allows to set and get the tab strip placement property', function () {
        controlModel.tabStripPlacement = tabStripPlacement;
        expect(controlModel.tabStripPlacement).toEqual(tabStripPlacement);
    });
    it('allows to set and get the min height property', function () {
        controlModel.minHeight = minHeight;
        expect(controlModel.minHeight).toEqual(minHeight);
    });
    it('can set and get the selectedIndex property through the selectedIndex accessors', function () {
        controlModel.selectedIndex = selectedIndex;
        expect(controlModel.selectedIndex).toEqual(selectedIndex);
        expect(controlModel.selectedIndex).toEqual(selectedIndex);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.selectedIndex).toEqual(completeSettings.selectedIndex);
        expect(controlModel.tabStripPlacement).toEqual(completeSettings.tabStripPlacement);
        expect(controlModel.minHeight).toEqual(completeSettings.minHeight);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.selectedIndex).toEqual(otherSettings.selectedIndex);
        expect(controlModel.tabStripPlacement).toEqual(otherSettings.tabStripPlacement);
        expect(controlModel.minHeight).toEqual(otherSettings.minHeight);
    });
});
//# sourceMappingURL=niTabControlModel.Test.js.map