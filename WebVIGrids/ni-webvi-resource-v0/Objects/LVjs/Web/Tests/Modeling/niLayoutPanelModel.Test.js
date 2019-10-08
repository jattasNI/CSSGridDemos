//****************************************
// Tests for LayoutPanelModel class
// National Instruments Copyright 2014
//****************************************
import { LayoutPanelModel } from '../../Modeling/niLayoutPanelModel.js';
describe('A LayoutPanelModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const minHeight = '100px';
    let completeSettings;
    let otherSettings;
    beforeEach(function () {
        completeSettings = {
            minHeight: minHeight
        };
        otherSettings = {
            minHeight: '200px'
        };
        controlModel = new LayoutPanelModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call the constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to set and get the min height property', function () {
        controlModel.minHeight = minHeight;
        expect(controlModel.minHeight).toEqual(minHeight);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.minHeight).toEqual(completeSettings.minHeight);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.minHeight).toEqual(otherSettings.minHeight);
    });
});
//# sourceMappingURL=niLayoutPanelModel.Test.js.map