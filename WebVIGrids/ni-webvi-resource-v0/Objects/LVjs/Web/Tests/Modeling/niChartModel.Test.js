//****************************************
// Tests for ChartModel class
// National Instruments Copyright 2014
//****************************************
import { ChartModel } from '../../Modeling/niChartModel.js';
describe('A ChartModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const visible = true;
    let completeSettings = {};
    let otherSettings = {};
    const NITypes = window.NITypes;
    beforeEach(function () {
        completeSettings = {
            top: top,
            left: left,
            width: width,
            height: height,
            visible: visible
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            visible: !visible,
            bufferSize: 128
        };
        controlModel = new ChartModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.top).toEqual(otherSettings.top);
        expect(controlModel.left).toEqual(otherSettings.left);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.height).toEqual(otherSettings.height);
        expect(controlModel.historySize).toEqual(otherSettings.bufferSize);
    });
    it('should have default history size of 1024', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.historySize).toEqual(1024);
    });
    it('should be able to add numbers to a chart', function () {
        controlModel.setMultipleProperties({ niType: NITypes.DOUBLE.toJSON() });
        controlModel.setMultipleProperties({ value: 7 });
        expect(controlModel.historyBuffer.count).toBe(1);
        expect(controlModel.historyBuffer.toDataSeries()).toEqual([[0, 7]]);
    });
    it('should be able to add 1D arrays of numbers to a chart', function () {
        controlModel.setMultipleProperties({ value: [7, 8] });
        expect(controlModel.historyBuffer.count).toBe(2);
        expect(controlModel.historyBuffer.toDataSeries()).toEqual([[0, 7], [1, 8]]);
    });
    it('should be able to add serialized 1D arrays of numbers to a chart', function () {
        controlModel.setMultipleProperties({ value: '[7, 8]' });
        expect(controlModel.historyBuffer.count).toBe(2);
        expect(controlModel.historyBuffer.toDataSeries()).toEqual([[0, 7], [1, 8]]);
    });
    it('should be able to add serialized 1D arrays of numbers containing NaN and Inf values to a chart', function () {
        controlModel.setMultipleProperties({ value: '[7, "NaN", 8, "Infinity"]' });
        expect(controlModel.historyBuffer.count).toBe(4);
        expect(controlModel.historyBuffer.toDataSeries()).toEqual([[0, 7], [1, NaN], [2, 8], [3, Infinity]]);
    });
    it('should be able to add a history buffer to a chart', function () {
        controlModel.setMultipleProperties({
            niType: NITypes.DOUBLE.toJSON(),
            value: { valueType: 'HistoryBuffer', data: [[7, 8, 9], [17, 18, 19]] }
        });
        expect(controlModel.historyBuffer.count).toBe(3);
        expect(controlModel.historyBuffer.width).toBe(2);
        expect(controlModel.historyBuffer.toDataSeries(0)).toEqual([[0, 7], [1, 8], [2, 9]]);
        expect(controlModel.historyBuffer.toDataSeries(1)).toEqual([[0, 17], [1, 18], [2, 19]]);
    });
    it('should be able to add a history buffer containing NaN and Inf values to a chart', function () {
        controlModel.setMultipleProperties({
            niType: NITypes.DOUBLE.toJSON(),
            value: { valueType: 'HistoryBuffer', data: [[7, 'NaN', 8, 'Infinity']] }
        });
        expect(controlModel.historyBuffer.count).toBe(4);
        expect(controlModel.historyBuffer.width).toBe(1);
        expect(controlModel.historyBuffer.toDataSeries(0)).toEqual([[0, 7], [1, NaN], [2, 8], [3, Infinity]]);
    });
    it('should be able to add a history buffer with no plot to a chart', function () {
        controlModel.setMultipleProperties({
            niType: NITypes.DOUBLE.toJSON(),
            value: { valueType: 'HistoryBuffer', data: [] }
        });
        expect(controlModel.historyBuffer.count).toBe(0);
        expect(controlModel.historyBuffer.toDataSeries(0)).toEqual([]);
    });
    it('should be able to add 1D arrays of 1 element arrays of numbers to a chart', function () {
        controlModel.setMultipleProperties({ niType: NITypes.DOUBLE.makeArray(2).toJSON() });
        controlModel.setMultipleProperties({ value: '[[7], [8]]' });
        expect(controlModel.historyBuffer.width).toBe(1);
        expect(controlModel.historyBuffer.count).toBe(2);
        expect(controlModel.historyBuffer.toDataSeries(0)).toEqual([[0, 7], [1, 8]]);
    });
    it('should be able to add 1D arrays of multiple elements arrays of numbers to a chart', function () {
        controlModel.setMultipleProperties({ niType: NITypes.DOUBLE.makeArray(2).toJSON() });
        controlModel.setMultipleProperties({ value: '[[7, 8], [9, 10]]' });
        expect(controlModel.historyBuffer.width).toBe(2);
        expect(controlModel.historyBuffer.count).toBe(2);
        expect(controlModel.historyBuffer.toDataSeries(0)).toEqual([[0, 7], [1, 9]]);
        expect(controlModel.historyBuffer.toDataSeries(1)).toEqual([[0, 8], [1, 10]]);
    });
    it('should set the width of the history buffer to 1 when pushing numbers to the buffer', function () {
        controlModel.setMultipleProperties({ niType: NITypes.DOUBLE.makeArray(2).toJSON() });
        controlModel.setMultipleProperties({ value: '[[7, 8]]' });
        const beforeWidth = controlModel.historyBuffer.width;
        controlModel.setMultipleProperties({ niType: NITypes.DOUBLE.makeArray(1).toJSON() });
        controlModel.setMultipleProperties({ value: 7 });
        expect(beforeWidth).toBe(2);
        expect(controlModel.historyBuffer.width).toBe(1);
    });
    it('should set the width of the history buffer to 1 when pushing 1D arrays of numbers to the buffer', function () {
        controlModel.setMultipleProperties({ niType: NITypes.DOUBLE.makeArray(2).toJSON() });
        controlModel.setMultipleProperties({ value: '[[7, 8]]' });
        const beforeWidth = controlModel.historyBuffer.width;
        controlModel.setMultipleProperties({ niType: NITypes.DOUBLE.makeArray(1).toJSON() });
        controlModel.setMultipleProperties({ value: '[7, 8]' });
        expect(beforeWidth).toBe(2);
        expect(controlModel.historyBuffer.width).toBe(1);
    });
    it('should set the width of the history buffer to the lenght of the array rows when pushing 2D arrays of numbers to the buffer', function () {
        controlModel.setMultipleProperties({ value: 7 });
        const beforeWidth = controlModel.historyBuffer.width;
        controlModel.setMultipleProperties({ niType: NITypes.DOUBLE.makeArray(2).toJSON() });
        controlModel.setMultipleProperties({ value: '[[7, 8, 9]]' });
        expect(beforeWidth).toBe(1);
        expect(controlModel.historyBuffer.width).toBe(3);
    });
    it('should empty the history buffer on data type change', function () {
        controlModel.setMultipleProperties({ value: 7 });
        controlModel.setMultipleProperties({ niType: NITypes.DOUBLE.makeArray(1).toJSON() });
        expect(controlModel.historyBuffer.width).toBe(1);
        expect(controlModel.historyBuffer.count).toBe(0);
    });
    it('should adapt the width of the history buffer to the lenght of the array rows when pushing 2D arrays of numbers to the buffer', function () {
        controlModel.setMultipleProperties({ niType: NITypes.DOUBLE.makeArray(2).toJSON() });
        expect(controlModel.historyBuffer.width).toBe(1);
        expect(controlModel.historyBuffer.count).toBe(0);
        controlModel.setMultipleProperties({ value: '[[7]]' });
        expect(controlModel.historyBuffer.width).toBe(1);
        expect(controlModel.historyBuffer.count).toBe(1);
        controlModel.setMultipleProperties({ value: '[[8, 9]]' });
        expect(controlModel.historyBuffer.width).toBe(2);
        expect(controlModel.historyBuffer.count).toBe(1);
        controlModel.setMultipleProperties({ value: '[[10, 11, 12]]' });
        expect(controlModel.historyBuffer.width).toBe(3);
        expect(controlModel.historyBuffer.count).toBe(1);
    });
    it('should fail when receiving invalid JSON', function () {
        const run = function () {
            controlModel.setMultipleProperties({ value: 'invalidJsonString: [[7], [8], [9]]' });
        };
        expect(run).toThrow();
    });
    it('should do nothing when receiving unkown data types', function () {
        controlModel.setMultipleProperties({ niType: NITypes.DOUBLE.makeArray(3).toJSON() });
        controlModel.setMultipleProperties({ value: [7] });
        expect(controlModel.historyBuffer.count).toBe(0);
    });
    it('will clear when appended waveform starts before end of last waveform (1D)', function () {
        controlModel.setMultipleProperties({
            niType: JSON.parse((new window.NIType('{"name":"AnalogWaveform", "subtype": "Double"}')).toJSON()),
            value: { valueType: 'HistoryBuffer', size: 10, startIndex: 0, data: [{ "Y": [7, 8, 9], t0: "0:0", "dt": 1 }] }
        });
        // set the same data at the same time location
        controlModel.setMultipleProperties({
            value: { "Y": [7, 8, 9], t0: "0:0", "dt": 1 }
        });
        expect(controlModel.historyBuffer.count).toBe(1);
        expect(controlModel.historyBuffer.toDataSeries(0)).toEqual([[0, 7], [1, 8], [2, 9]]);
        // set the same data at the same time location as last sample
        controlModel.setMultipleProperties({
            value: { "Y": [7, 8, 9], t0: "2:0", "dt": 1 }
        });
        expect(controlModel.historyBuffer.toDataSeries(0)).toEqual([[2, 7], [3, 8], [4, 9]]);
    });
    it('will clear when appended waveform starts before end of last waveform (2D)', function () {
        controlModel.setMultipleProperties({
            niType: JSON.parse((new window.NIType('{"name":"Array", "rank": 1, "subtype": { "name": "AnalogWaveform", "subtype": "Double" } }')).toJSON()),
            value: { valueType: 'HistoryBuffer', size: 10, startIndex: 0, data: [[{ "Y": [7, 8, 9], t0: "0:0", "dt": 1 }], [{ "Y": [4, 5, 6], t0: "1:0", "dt": 1 }]] }
        });
        // set the second waveform (for second plot) to start at same location of first waveform (of second plot), which will clear both plots
        controlModel.setMultipleProperties({
            value: [{ "Y": [7, 8, 9], t0: "3:0", "dt": 1 }, { "Y": [7, 8, 9], t0: "0:0", "dt": 1 }]
        });
        expect(controlModel.historyBuffer.count).toBe(1);
        expect(controlModel.historyBuffer.toDataSeries(0)).toEqual([[3, 7], [4, 8], [5, 9]]);
        expect(controlModel.historyBuffer.toDataSeries(1)).toEqual([[0, 7], [1, 8], [2, 9]]);
    });
});
//# sourceMappingURL=niChartModel.Test.js.map