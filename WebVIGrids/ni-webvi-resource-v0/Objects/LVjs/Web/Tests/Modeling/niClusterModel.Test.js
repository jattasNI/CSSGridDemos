//****************************************
// Tests for ClusterModel class
// National Instruments Copyright 2014
//****************************************
import { ClusterModel } from '../../Modeling/niClusterModel.js';
import { NumericTextBoxModel } from '../../Modeling/niNumericTextBoxModel.js';
describe('A ClusterModel', function () {
    'use strict';
    const niControlId = 'testId';
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        const controlModel = new ClusterModel(niControlId);
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the set the value of fields', function () {
        const clusterId = 'parent';
        const childId = 'numeric1';
        const numericSettings = {
            niControlId: childId,
            minimum: 0.0,
            maximum: 10.0,
            value: 5.0,
            left: '100px',
            top: '200px',
            width: '300px',
            height: '400px',
            bindingInfo: {
                'prop': 'value',
                'field': 'numericField',
                'sync': false
            }
        };
        const parentModel = new ClusterModel(clusterId);
        const childModel = new NumericTextBoxModel(childId);
        const messageData = { numericField: 6.66 };
        childModel.setMultipleProperties(numericSettings);
        parentModel.addChildModel(childModel);
        parentModel.value = messageData;
        expect(parentModel.value).toEqual(messageData);
    });
});
//# sourceMappingURL=niClusterModel.Test.js.map