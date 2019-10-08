//****************************************
// Tests for GraphBaseModel class
// National Instruments Copyright 2014
//****************************************
import { GraphBaseModel } from '../../Modeling/niGraphBaseModel.js';
describe('A GraphBaseModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    beforeEach(function () {
        controlModel = new GraphBaseModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
});
//# sourceMappingURL=niGraphBaseModel.Test.js.map