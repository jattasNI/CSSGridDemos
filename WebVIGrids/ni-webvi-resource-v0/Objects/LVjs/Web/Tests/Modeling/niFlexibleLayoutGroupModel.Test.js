//****************************************
// Tests for FlexibleLayoutGroupModel class
// National Instruments Copyright 2018
//****************************************
import { FlexibleLayoutGroupModel } from '../../Modeling/niFlexibleLayoutGroupModel.js';
describe('A FlexibleLayoutGroupModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    beforeEach(function () {
        controlModel = new FlexibleLayoutGroupModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call the constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
});
//# sourceMappingURL=niFlexibleLayoutGroupModel.Test.js.map