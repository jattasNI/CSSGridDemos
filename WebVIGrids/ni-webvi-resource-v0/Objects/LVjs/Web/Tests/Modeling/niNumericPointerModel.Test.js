//****************************************
// Tests for NumericPointerModel class
// National Instruments Copyright 2014
//****************************************
import { NumericPointerModel } from '../../Modeling/niNumericPointerModel.js';
describe('A NumericPointerModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const majorTicksVisible = true;
    const minorTicksVisible = true;
    const labelsVisible = true;
    let settings = {};
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            majorTicksVisible: majorTicksVisible,
            minorTicksVisible: minorTicksVisible,
            labelsVisible: labelsVisible
        };
        otherSettings = {
            majorTicksVisible: !majorTicksVisible,
            minorTicksVisible: !minorTicksVisible,
            labelsVisible: !labelsVisible
        };
        controlModel = new NumericPointerModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to set and get the majorTicksVisible property', function () {
        controlModel.majorTicksVisible = majorTicksVisible;
        expect(controlModel.majorTicksVisible).toEqual(majorTicksVisible);
    });
    it('allows to set and get the minorTicksVisible property', function () {
        controlModel.minorTicksVisible = minorTicksVisible;
        expect(controlModel.minorTicksVisible).toEqual(minorTicksVisible);
    });
    it('allows to set and get the labelsVisible property', function () {
        controlModel.labelsVisible = labelsVisible;
        expect(controlModel.labelsVisible).toEqual(labelsVisible);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update all the properties at the same time', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.majorTicksVisible).toEqual(majorTicksVisible);
        expect(controlModel.minorTicksVisible).toEqual(minorTicksVisible);
        expect(controlModel.labelsVisible).toEqual(labelsVisible);
    });
    it('allows to call the setMultipleProperties method with an unknown property', function () {
        controlModel.setMultipleProperties(completeSettings);
        const sendUnknownProperties = function () {
            controlModel.setMultipleProperties({
                unknownProperty: 'someValue'
            });
        };
        expect(sendUnknownProperties).toThrow();
        expect(controlModel.majorTicksVisible).toEqual(majorTicksVisible);
        expect(controlModel.minorTicksVisible).toEqual(minorTicksVisible);
        expect(controlModel.labelsVisible).toEqual(labelsVisible);
    });
    it('allows to call the setMultipleProperties method to update just one property without updating others', function () {
        controlModel.setMultipleProperties(completeSettings);
        settings = {
            majorTicksVisible: !majorTicksVisible
        };
        controlModel.setMultipleProperties(settings);
        expect(controlModel.majorTicksVisible).toEqual(settings.majorTicksVisible);
        expect(controlModel.minorTicksVisible).toEqual(minorTicksVisible);
        expect(controlModel.labelsVisible).toEqual(labelsVisible);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.majorTicksVisible).toEqual(otherSettings.majorTicksVisible);
        expect(controlModel.minorTicksVisible).toEqual(otherSettings.minorTicksVisible);
        expect(controlModel.labelsVisible).toEqual(otherSettings.labelsVisible);
    });
});
//# sourceMappingURL=niNumericPointerModel.Test.js.map