//****************************************
// Tests for Cartesian Plot class
// National Instruments Copyright 2014
//****************************************
import { CartesianPlotModel } from '../../Modeling/niCartesianPlotModel.js';
describe('A CartesianPlotModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const xaxis = 'xaxis';
    const yaxis = 'yaxis';
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            xaxis: xaxis,
            yaxis: yaxis
        };
        otherSettings = {
            xaxis: xaxis + '1',
            yaxis: yaxis + '1'
        };
        controlModel = new CartesianPlotModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to set and get the xaxis property', function () {
        controlModel.xaxis = xaxis;
        expect(controlModel.xaxis).toEqual(xaxis);
    });
    it('allows to set and get the yaxis property', function () {
        controlModel.yaxis = yaxis;
        expect(controlModel.yaxis).toEqual(yaxis);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.xaxis).toEqual(xaxis);
        expect(controlModel.yaxis).toEqual(yaxis);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.xaxis).toEqual(otherSettings.xaxis);
        expect(controlModel.yaxis).toEqual(otherSettings.yaxis);
    });
});
//# sourceMappingURL=niCartesianPlotModel.Test.js.map