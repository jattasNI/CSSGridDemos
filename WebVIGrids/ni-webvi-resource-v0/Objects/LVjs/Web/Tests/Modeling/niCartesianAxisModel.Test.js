//****************************************
// Tests for Cartesian Axis class
// National Instruments Copyright 2014
//****************************************
import { CartesianAxisModel } from "../../Modeling/niCartesianAxisModel.js";
describe('A CartesianAxisModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const max = 100;
    const min = 200;
    const axisPosition = 'right';
    const showLabel = false;
    const label = 'none';
    const logScale = true;
    const autoScale = 'loose';
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            maximum: max,
            minimum: min,
            axisPosition: axisPosition,
            showLabel: showLabel,
            logScale: true,
            label: label,
            autoScale: autoScale
        };
        otherSettings = {
            maximum: max + 1,
            minimum: min + 1,
            axisPosition: axisPosition + '1',
            showLabel: !showLabel,
            logScale: false,
            label: label + '1',
            autoScale: 'auto'
        };
        controlModel = new CartesianAxisModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to set and get the autoScale property', function () {
        controlModel.autoScale = autoScale;
        expect(controlModel.autoScale).toEqual(autoScale);
    });
    it('allows to set and get the max property', function () {
        controlModel.maximum = max;
        expect(controlModel.maximum).toEqual(max);
    });
    it('allows to set and get the min property', function () {
        controlModel.minimum = min;
        expect(controlModel.minimum).toEqual(min);
    });
    it('allows to set and get the position property', function () {
        controlModel.axisPosition = axisPosition;
        expect(controlModel.axisPosition).toEqual(axisPosition);
    });
    it('allows to set and get the showLabel property', function () {
        controlModel.showLabel = showLabel;
        expect(controlModel.showLabel).toEqual(showLabel);
    });
    it('allows to set and get the label property', function () {
        controlModel.label = label;
        expect(controlModel.label).toEqual(label);
    });
    it('allows to set and get the logScale property', function () {
        controlModel.logScale = logScale;
        expect(controlModel.logScale).toEqual(logScale);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.autoScale).toEqual(autoScale);
        expect(controlModel.maximum).toEqual(max);
        expect(controlModel.minimum).toEqual(min);
        expect(controlModel.axisPosition).toEqual(axisPosition);
        expect(controlModel.showLabel).toEqual(showLabel);
        expect(controlModel.label).toEqual(label);
        expect(controlModel.logScale).toEqual(logScale);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.autoScale).toEqual(otherSettings.autoScale);
        expect(controlModel.maximum).toEqual(otherSettings.maximum);
        expect(controlModel.minimum).toEqual(otherSettings.minimum);
        expect(controlModel.axisPosition).toEqual(otherSettings.axisPosition);
        expect(controlModel.showLabel).toEqual(otherSettings.showLabel);
        expect(controlModel.label).toEqual(otherSettings.label);
        expect(controlModel.logScale).toEqual(otherSettings.logScale);
    });
});
//# sourceMappingURL=niCartesianAxisModel.Test.js.map