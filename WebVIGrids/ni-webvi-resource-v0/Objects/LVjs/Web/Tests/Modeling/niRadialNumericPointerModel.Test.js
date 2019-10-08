//****************************************
// Tests for RadialNumericPointerModel class
// National Instruments Copyright 2014
//****************************************
import { RadialNumericPointerModel } from '../../Modeling/niRadialNumericPointerModel.js';
describe('A RadialNumericPointerModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    beforeEach(function () {
        controlModel = new RadialNumericPointerModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
});
//# sourceMappingURL=niRadialNumericPointerModel.Test.js.map