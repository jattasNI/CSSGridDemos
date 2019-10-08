//****************************************
// Tests for Cartesian Axis class
// National Instruments Copyright 2014
//****************************************
import { CursorModel } from '../../Modeling/niCursorModel.js';
describe('A CursorModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const showLabel = false;
    const showValue = false;
    const targetShape = 'ellipse';
    const label = '';
    let snapToPlot;
    const xaxis = '1';
    const yaxis = '2';
    const crosshairStyle = 'both';
    const fontSize = '15px';
    const fontFamily = 'sans serif';
    const fontStyle = 'normal';
    const fontWeight = 'normal';
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            showLabel: showLabel,
            showValue: showValue,
            targetShape: targetShape,
            label: label,
            snapToPlot: snapToPlot,
            xaxis: xaxis,
            yaxis: yaxis,
            crosshairStyle: crosshairStyle,
            fontSize: fontSize,
            fontFamily: fontFamily,
            fontStyle: fontStyle,
            fontWeight: fontWeight
        };
        otherSettings = {
            showLabel: !showLabel,
            showValue: !showValue,
            targetShape: 'square',
            label: 'cursor',
            snapToPlot: snapToPlot !== undefined ? undefined : -1,
            xaxis: '11',
            yaxis: '22',
            crosshairStyle: 'none'
        };
        controlModel = new CursorModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to set and get the showLabel property', function () {
        controlModel.showLabel = showLabel;
        expect(controlModel.showLabel).toEqual(showLabel);
    });
    it('allows to set and get the showValue property', function () {
        controlModel.showValue = showValue;
        expect(controlModel.showValue).toEqual(showValue);
    });
    it('allows to set and get the targetShape property', function () {
        controlModel.targetShape = targetShape;
        expect(controlModel.targetShape).toEqual(targetShape);
    });
    it('allows to set and get the label property', function () {
        controlModel.label = label;
        expect(controlModel.label).toEqual(label);
    });
    it('allows to set and get the snapToPlot property', function () {
        controlModel.snapToPlot = snapToPlot;
        expect(controlModel.snapToPlot).toEqual(snapToPlot);
    });
    it('allows to set and get the xaxis property', function () {
        controlModel.xaxis = xaxis;
        expect(controlModel.xaxis).toEqual(xaxis);
    });
    it('allows to set and get the yaxis property', function () {
        controlModel.yaxis = yaxis;
        expect(controlModel.yaxis).toEqual(yaxis);
    });
    it('allows to set and get the crosshairStyle property', function () {
        controlModel.crosshairStyle = crosshairStyle;
        expect(controlModel.crosshairStyle).toEqual(crosshairStyle);
    });
    it('allows to set and get the fontSize property', function () {
        controlModel.fontSize = fontSize;
        expect(controlModel.fontSize).toEqual(fontSize);
    });
    it('allows to set and get the fontFamily property', function () {
        controlModel.fontFamily = fontFamily;
        expect(controlModel.fontFamily).toEqual(fontFamily);
    });
    it('allows to set and get the fontStyle property', function () {
        controlModel.fontStyle = fontStyle;
        expect(controlModel.fontStyle).toEqual(fontStyle);
    });
    it('allows to set and get the fontWeight property', function () {
        controlModel.fontWeight = fontWeight;
        expect(controlModel.fontWeight).toEqual(fontWeight);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.showLabel).toEqual(showLabel);
        expect(controlModel.showValue).toEqual(showValue);
        expect(controlModel.targetShape).toEqual(targetShape);
        expect(controlModel.label).toEqual(label);
        expect(controlModel.snapToPlot).toEqual(snapToPlot);
        expect(controlModel.xaxis).toEqual(xaxis);
        expect(controlModel.yaxis).toEqual(yaxis);
        expect(controlModel.crosshairStyle).toEqual(crosshairStyle);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.showLabel).toEqual(otherSettings.showLabel);
        expect(controlModel.showValue).toEqual(otherSettings.showValue);
        expect(controlModel.targetShape).toEqual(otherSettings.targetShape);
        expect(controlModel.label).toEqual(otherSettings.label);
        expect(controlModel.snapToPlot).toEqual(otherSettings.snapToPlot);
        expect(controlModel.xaxis).toEqual(otherSettings.xaxis);
        expect(controlModel.yaxis).toEqual(otherSettings.yaxis);
        expect(controlModel.crosshairStyle).toEqual(otherSettings.crosshairStyle);
    });
});
//# sourceMappingURL=niCursorModel.Test.js.map