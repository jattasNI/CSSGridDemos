//****************************************
// Tests for FlexibleLayoutComponentModel class
// National Instruments Copyright 2018
//****************************************
import { FlexibleLayoutComponentModel } from '../../Modeling/niFlexibleLayoutComponentModel.js';
describe('A FlexibleLayoutComponentModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    beforeEach(function () {
        controlModel = new FlexibleLayoutComponentModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allowed to call the constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
});
//# sourceMappingURL=niFlexibleLayoutComponentModel.Test.js.map