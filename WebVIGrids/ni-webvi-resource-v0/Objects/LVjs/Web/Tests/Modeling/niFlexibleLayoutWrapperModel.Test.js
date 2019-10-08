//****************************************
// Tests for FlexibleLayoutWrapperModel class
// National Instruments Copyright 2018
//****************************************
import { FlexibleLayoutWrapperModel } from '../../Modeling/niFlexibleLayoutWrapperModel.js';
describe('A FlexibleLayoutWrapperModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const flexGrow = 1;
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            flexGrow: flexGrow
        };
        otherSettings = {
            flexGrow: 5
        };
        controlModel = new FlexibleLayoutWrapperModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allowed to call the constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.flexGrow).toEqual(completeSettings.flexGrow);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.flexGrow).toEqual(otherSettings.flexGrow);
    });
});
//# sourceMappingURL=niFlexibleLayoutWrapperModel.Test.js.map