//****************************************
// Tests for LinearNumericPointerModel class
// National Instruments Copyright 2014
//****************************************
import { LinearNumericPointerModel } from '../../Modeling/niLinearNumericPointerModel.js';
describe('A LinearNumericPointerModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    beforeEach(function () {
        controlModel = new LinearNumericPointerModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
});
//# sourceMappingURL=niLinearNumericPointerModel.Test.js.map