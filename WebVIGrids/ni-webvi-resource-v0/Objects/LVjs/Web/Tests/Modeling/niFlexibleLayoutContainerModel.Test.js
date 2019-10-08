//****************************************
// Tests for FlexibleLayoutContainerModel class
// National Instruments Copyright 2018
//****************************************
import { FlexibleLayoutContainerModel } from '../../Modeling/niFlexibleLayoutContainerModel.js';
describe('A FlexibleLayoutContainerModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const direction = 'row';
    const horizontalContentAlignment = 'flex-start';
    const verticalContentAlignment = 'flex-start';
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            direction: direction,
            horizontalContentAlignment: horizontalContentAlignment,
            verticalContentAlignment: verticalContentAlignment
        };
        otherSettings = {
            direction: 'column',
            horizontalContentAlignment: 'flex-end',
            verticalContentAlignment: 'space-between'
        };
        controlModel = new FlexibleLayoutContainerModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call the constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.direction).toEqual(completeSettings.direction);
        expect(controlModel.horizontalContentAlignment).toEqual(completeSettings.horizontalContentAlignment);
        expect(controlModel.verticalContentAlignment).toEqual(completeSettings.verticalContentAlignment);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.direction).toEqual(otherSettings.direction);
        expect(controlModel.horizontalContentAlignment).toEqual(otherSettings.horizontalContentAlignment);
        expect(controlModel.verticalContentAlignment).toEqual(otherSettings.verticalContentAlignment);
    });
});
//# sourceMappingURL=niFlexibleLayoutContainerModel.Test.js.map