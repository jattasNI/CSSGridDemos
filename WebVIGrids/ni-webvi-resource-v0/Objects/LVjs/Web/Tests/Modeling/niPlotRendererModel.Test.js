//****************************************
// Tests for Plot Renderer Model class
// National Instruments Copyright 2014
//****************************************
import { PlotRendererModel } from '../../Modeling/niPlotRendererModel.js';
describe('A PlotRendererModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const lineWidth = 100;
    const lineStyle = 'solid';
    const pointSize = 200;
    const pointColor = 'blue';
    const pointShape = 'circle';
    const lineStroke = 'black';
    const areaFill = '#001122';
    const barFill = '#aabbcc';
    const barWidth = 3;
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            lineWidth: lineWidth,
            lineStyle: lineStyle,
            pointSize: pointSize,
            pointColor: pointColor,
            pointShape: pointShape,
            lineStroke: lineStroke,
            areaFill: areaFill,
            barFill: barFill
        };
        otherSettings = {
            lineWidth: lineWidth + 1,
            lineStyle: 'dashdot',
            pointSize: pointSize + 1,
            pointColor: pointColor + '1',
            pointShape: pointShape + '1',
            lineStroke: lineStroke + '1',
            areaFill: 'white',
            barFill: 'pink',
            barWidth: 34
        };
        controlModel = new PlotRendererModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('has default value of barWidth as 0.75.', function () {
        const defaultValue = PlotRendererModel.DEFAULT_BAR_WIDTH;
        expect(controlModel.barWidth).toEqual(defaultValue);
    });
    it('allows to set and get the barWidth property.', function () {
        controlModel.barWidth = barWidth;
        expect(controlModel.barWidth).toEqual(barWidth);
    });
    it('allows to set and get the lineWidth property', function () {
        controlModel.lineWidth = lineWidth;
        expect(controlModel.lineWidth).toEqual(lineWidth);
    });
    it('allows to set and get the lineStyle property', function () {
        controlModel.lineStyle = lineStyle;
        expect(controlModel.lineStyle).toEqual(lineStyle);
    });
    it('allows to set and get the pointShape property', function () {
        controlModel.pointShape = pointShape;
        expect(controlModel.pointShape).toEqual(pointShape);
    });
    it('allows to set and get the pointSize property', function () {
        controlModel.pointSize = pointSize;
        expect(controlModel.pointSize).toEqual(pointSize);
    });
    it('allows to set and get the pointColor property', function () {
        controlModel.pointColor = pointColor;
        expect(controlModel.pointColor).toEqual(pointColor);
    });
    it('allows to set and get the lineStroke property', function () {
        controlModel.lineStroke = lineStroke;
        expect(controlModel.lineStroke).toEqual(lineStroke);
    });
    it('allows to set and get the areaFill property', function () {
        controlModel.areaFill = areaFill;
        expect(controlModel.areaFill).toEqual(areaFill);
    });
    it('allows to set and get the barFill property', function () {
        controlModel.barFill = barFill;
        expect(controlModel.barFill).toEqual(barFill);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.lineWidth).toEqual(lineWidth);
        expect(controlModel.pointShape).toEqual(pointShape);
        expect(controlModel.pointSize).toEqual(pointSize);
        expect(controlModel.pointColor).toEqual(pointColor);
        expect(controlModel.lineStroke).toEqual(lineStroke);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.lineWidth).toEqual(otherSettings.lineWidth);
        expect(controlModel.pointShape).toEqual(otherSettings.pointShape);
        expect(controlModel.pointSize).toEqual(otherSettings.pointSize);
        expect(controlModel.pointColor).toEqual(otherSettings.pointColor);
        expect(controlModel.lineStroke).toEqual(otherSettings.lineStroke);
        expect(controlModel.lineStroke).toEqual(otherSettings.lineStroke);
        expect(controlModel.barFill).toEqual(otherSettings.barFill);
        expect(controlModel.areaFill).toEqual(otherSettings.areaFill);
        expect(controlModel.barWidth).toEqual(otherSettings.barWidth);
    });
});
//# sourceMappingURL=niPlotRendererModel.Test.js.map