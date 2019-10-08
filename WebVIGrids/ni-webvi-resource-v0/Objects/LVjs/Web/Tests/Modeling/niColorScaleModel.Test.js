//****************************************
// Tests for Cartesian Axis class
// National Instruments Copyright 2014
//****************************************
import { ColorScaleModel } from '../../Modeling/niColorScaleModel.js';
describe('A ColorScaleModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const label = 'Color scale';
    const axisPosition = 'right';
    const autoScale = 'none';
    const show = true;
    const highColor = '#ffffff';
    const lowColor = '#000000';
    const markers = [{ 0: '#00ff00' }, { 0.5: '#ff00ff' }, { 1.0: '#0000ff' }];
    const highColor2 = '#ffaaff';
    const lowColor2 = '#0aa000';
    const markers2 = [{ 0: '#00ffff' }, { 0.5: '#ffaaff' }, { 1.0: '#aa00ff' }];
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            show: show,
            axisPosition: axisPosition,
            highColor: highColor,
            lowColor: lowColor,
            markers: markers,
            label: label,
            autoScale: autoScale
        };
        otherSettings = {
            show: !show,
            axisPosition: 'right',
            label: label + '1',
            highColor: highColor2,
            lowColor: lowColor2,
            markers: markers2,
            autoScale: 'auto'
        };
        controlModel = new ColorScaleModel(niControlId);
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
    it('allows to set and get the label property', function () {
        controlModel.label = label;
        expect(controlModel.label).toEqual(label);
    });
    it('allows to set and get the lowColor property', function () {
        controlModel.lowColor = lowColor2;
        expect(controlModel.lowColor).toEqual(lowColor2);
    });
    it('allows to set and get the highColor property', function () {
        controlModel.highColor = highColor2;
        expect(controlModel.highColor).toEqual(highColor2);
    });
    it('allows to set and get the markers property', function () {
        controlModel.markers = markers2;
        expect(controlModel.markers).toEqual(markers2);
    });
    it('allows to set and get the axisPosition property', function () {
        controlModel.axisPosition = axisPosition;
        expect(controlModel.axisPosition).toEqual(axisPosition);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update the configuration property', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.autoScale).toEqual(autoScale);
        expect(controlModel.label).toEqual(label);
        expect(controlModel.lowColor).toEqual(lowColor);
        expect(controlModel.highColor).toEqual(highColor);
        expect(controlModel.markers).toEqual(markers);
        expect(controlModel.axisPosition).toEqual(axisPosition);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.autoScale).toEqual(otherSettings.autoScale);
        expect(controlModel.label).toEqual(otherSettings.label);
        expect(controlModel.lowColor).toEqual(otherSettings.lowColor);
        expect(controlModel.highColor).toEqual(otherSettings.highColor);
        expect(controlModel.markers).toEqual(otherSettings.markers);
        expect(controlModel.axisPosition).toEqual(otherSettings.axisPosition);
    });
});
//# sourceMappingURL=niColorScaleModel.Test.js.map