//****************************************
// Tests for OpaqueRefnum class
// National Instruments Copyright 2015
//****************************************
import { OpaqueRefnumModel } from '../../Modeling/niOpaqueRefnumModel.js';
describe('A OpaqueRefnumModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'refnum';
    beforeEach(function () {
        controlModel = new OpaqueRefnumModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('can be constructed', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
});
//# sourceMappingURL=niOpaqueRefnumModel.Test.js.map