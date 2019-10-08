//****************************************
// Tests for VisualComponentModel class
// National Instruments Copyright 2014
//****************************************
import { VisualComponentModel } from '../../Modeling/niVisualComponentModel.js';
describe('A VisualComponentModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    beforeEach(function () {
        controlModel = new VisualComponentModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('prevents changing niControlId after it is assigned', function () {
        const toCall = function () {
            controlModel.niControlId = niControlId + 'other';
        };
        expect(toCall).toThrow();
    });
});
//# sourceMappingURL=niVisualComponentModel.Test.js.map