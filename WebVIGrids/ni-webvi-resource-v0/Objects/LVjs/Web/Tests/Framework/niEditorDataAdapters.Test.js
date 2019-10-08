//******************************************
// Tests for niEditorDataAdapters
// National Instruments Copyright 2017
//******************************************
import { NIEditorDataAdapters as DATA_ADAPTERS } from '../../Framework/niEditorDataAdapters.js';
describe('The NIEditorDataAdapters', function () {
    'use strict';
    const NITypes = window.NITypes;
    const NIType = window.NIType;
    describe('can convert from JS control model to editor format', function () {
        it('when the input needs no conversions', function () {
            expect(DATA_ADAPTERS.jsModelToEditor(true, NITypes.BOOLEAN)).toEqual(true);
            expect(DATA_ADAPTERS.jsModelToEditor(false, NITypes.BOOLEAN)).toEqual(false);
            expect(DATA_ADAPTERS.jsModelToEditor('abc', NITypes.STRING)).toEqual('abc');
            expect(DATA_ADAPTERS.jsModelToEditor(123, NITypes.INT32)).toEqual(123);
            expect(DATA_ADAPTERS.jsModelToEditor(123.456, NITypes.DOUBLE)).toEqual(123.456);
            expect(DATA_ADAPTERS.jsModelToEditor([true], NITypes.BOOLEAN.makeArray(1))).toEqual([true]);
            expect(DATA_ADAPTERS.jsModelToEditor([false], NITypes.BOOLEAN.makeArray(1))).toEqual([false]);
            expect(DATA_ADAPTERS.jsModelToEditor(['abc'], NITypes.STRING.makeArray(1))).toEqual(['abc']);
            expect(DATA_ADAPTERS.jsModelToEditor([123], NITypes.INT32.makeArray(1))).toEqual([123]);
            expect(DATA_ADAPTERS.jsModelToEditor([123.456], NITypes.DOUBLE.makeArray(1))).toEqual([123.456]);
            expect(DATA_ADAPTERS.jsModelToEditor([[true]], NITypes.BOOLEAN.makeArray(2))).toEqual([[true]]);
            expect(DATA_ADAPTERS.jsModelToEditor([[false]], NITypes.BOOLEAN.makeArray(2))).toEqual([[false]]);
            expect(DATA_ADAPTERS.jsModelToEditor([['abc']], NITypes.STRING.makeArray(2))).toEqual([['abc']]);
            expect(DATA_ADAPTERS.jsModelToEditor([[123]], NITypes.INT32.makeArray(2))).toEqual([[123]]);
            expect(DATA_ADAPTERS.jsModelToEditor([[123.456]], NITypes.DOUBLE.makeArray(2))).toEqual([[123.456]]);
        });
        describe('when the input contains NaN/Infinity/-Infinity', function () {
            it('and the type is Double', function () {
                expect(DATA_ADAPTERS.jsModelToEditor(Number.POSITIVE_INFINITY, NITypes.DOUBLE)).toEqual('Infinity');
                expect(DATA_ADAPTERS.jsModelToEditor(Number.NEGATIVE_INFINITY, NITypes.DOUBLE)).toEqual('-Infinity');
                expect(DATA_ADAPTERS.jsModelToEditor(window.NaN, NITypes.DOUBLE)).toEqual('NaN');
            });
            it('and the type is Single', function () {
                expect(DATA_ADAPTERS.jsModelToEditor(Number.POSITIVE_INFINITY, NITypes.SINGLE)).toEqual('Infinity');
                expect(DATA_ADAPTERS.jsModelToEditor(Number.NEGATIVE_INFINITY, NITypes.SINGLE)).toEqual('-Infinity');
                expect(DATA_ADAPTERS.jsModelToEditor(window.NaN, NITypes.SINGLE)).toEqual('NaN');
            });
            it('and the type is Double[]', function () {
                const arrayType = new NIType('{"name":"Array","rank":1,"subtype":"Double"}');
                const jsModelVal = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, window.NaN, 123];
                const editorVal = DATA_ADAPTERS.jsModelToEditor(jsModelVal, arrayType);
                expect(editorVal).toEqual(['Infinity', '-Infinity', 'NaN', 123]);
                expect(jsModelVal[0]).toEqual(Number.POSITIVE_INFINITY); // Ensure we didn't mutate the input array
            });
            it('and the type is Double[,]', function () {
                const array2DType = new NIType('{"name":"Array","rank":2,"subtype":"Double"}');
                const jsModelVal = [[Number.POSITIVE_INFINITY, 1, 2], [Number.NEGATIVE_INFINITY, window.NaN, 123]];
                const editorVal = DATA_ADAPTERS.jsModelToEditor(jsModelVal, array2DType);
                expect(editorVal).toEqual([['Infinity', 1, 2], ['-Infinity', 'NaN', 123]]);
                expect(jsModelVal[0][0]).toEqual(Number.POSITIVE_INFINITY); // Ensure we didn't mutate the input array
            });
            it('and the type is Cluster (containing a Double)', function () {
                const clusterType = new NIType('{"name":"Cluster","subtype":["Double"],"fields":["Numeric1"]}');
                const jsModelVal = { 'Numeric1': Number.POSITIVE_INFINITY };
                const editorVal = DATA_ADAPTERS.jsModelToEditor(jsModelVal, clusterType);
                expect(editorVal).toEqual({ 'Numeric1': 'Infinity' });
                expect(jsModelVal.Numeric1).toEqual(Number.POSITIVE_INFINITY); // Ensure we didn't mutate the input cluster
            });
            it('and the type is Array of Cluster (containing a Double)', function () {
                const clusterType = { 'name': 'Cluster', 'subtype': ['Double'], 'fields': ['Numeric1'] };
                const arrayType = new NIType({ 'name': 'Array', 'rank': 1, 'subtype': clusterType });
                const jsModelVal = [{ 'Numeric1': Number.POSITIVE_INFINITY }, { 'Numeric1': 123 }];
                const editorVal = DATA_ADAPTERS.jsModelToEditor(jsModelVal, arrayType);
                expect(editorVal).toEqual([{ 'Numeric1': 'Infinity' }, { 'Numeric1': 123 }]);
                expect(jsModelVal[0].Numeric1).toEqual(Number.POSITIVE_INFINITY); // Ensure we didn't mutate the input cluster
            });
            it('and the type is AnalogWaveform', function () {
                const jsAW = {
                    't0': '0:0',
                    'channelName': 'Channel1',
                    'dt': 1,
                    'Y': [1, 2, 3, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, NaN]
                };
                const awtype = new NIType('{"name": "AnalogWaveform", "subtype": "Double"}');
                const editorVal = DATA_ADAPTERS.jsModelToEditor(jsAW, awtype);
                expect(editorVal.t0).toEqual('0:0');
                expect(editorVal.channelName).toEqual('Channel1');
                expect(editorVal.dt).toEqual(1);
                expect(editorVal.Y).toEqual([1, 2, 3, 'Infinity', '-Infinity', 'NaN']);
                const emptyAW = {
                    't0': '0:0',
                    'channelName': 'Channel1',
                    'dt': 1,
                    'Y': []
                };
                const emptyEditorVal = DATA_ADAPTERS.jsModelToEditor(emptyAW, awtype);
                expect(emptyEditorVal.t0).toEqual('0:0');
                expect(emptyEditorVal.channelName).toEqual('Channel1');
                expect(emptyEditorVal.dt).toEqual(1);
                expect(emptyEditorVal.Y).toEqual([]);
            });
            it('and the type is Array of AnalogWaveform', function () {
                const jsAW = {
                    't0': '0:0',
                    'channelName': 'Channel1',
                    'dt': 1,
                    'Y': [1, 2, 3, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, NaN]
                };
                const awtype = new NIType('{"name": "AnalogWaveform", "subtype": "Double"}');
                const arrayType = awtype.makeArray(2);
                const editorVal = DATA_ADAPTERS.jsModelToEditor([[jsAW], [null], [jsAW]], arrayType);
                expect(editorVal[0][0].t0).toEqual('0:0');
                expect(editorVal[0][0].channelName).toEqual('Channel1');
                expect(editorVal[0][0].dt).toEqual(1);
                expect(editorVal[0][0].Y).toEqual([1, 2, 3, 'Infinity', '-Infinity', 'NaN']);
                expect(editorVal[1][0].t0).toEqual('0:0');
                expect(editorVal[1][0].channelName).toEqual('');
                expect(editorVal[1][0].dt).toEqual(1);
                expect(editorVal[1][0].Y).toEqual([]);
                expect(editorVal[2][0].t0).toEqual('0:0');
                expect(editorVal[2][0].channelName).toEqual('Channel1');
                expect(editorVal[2][0].dt).toEqual(1);
                expect(editorVal[2][0].Y).toEqual([1, 2, 3, 'Infinity', '-Infinity', 'NaN']);
            });
        });
    });
    describe('can convert from editor to JS control model format', function () {
        it('when the input needs no conversions', function () {
            expect(DATA_ADAPTERS.editorToJsModel(true, NITypes.BOOLEAN)).toEqual(true);
            expect(DATA_ADAPTERS.editorToJsModel(false, NITypes.BOOLEAN)).toEqual(false);
            expect(DATA_ADAPTERS.editorToJsModel('abc', NITypes.STRING)).toEqual('abc');
            expect(DATA_ADAPTERS.editorToJsModel(123, NITypes.INT32)).toEqual(123);
            expect(DATA_ADAPTERS.editorToJsModel(123.456, NITypes.DOUBLE)).toEqual(123.456);
        });
        describe('when the input contains NaN/Infinity/-Infinity', function () {
            it('and the type is Double', function () {
                expect(DATA_ADAPTERS.editorToJsModel('Infinity', NITypes.DOUBLE)).toEqual(Number.POSITIVE_INFINITY);
                expect(DATA_ADAPTERS.editorToJsModel('-Infinity', NITypes.DOUBLE)).toEqual(Number.NEGATIVE_INFINITY);
                expect(DATA_ADAPTERS.editorToJsModel('NaN', NITypes.DOUBLE)).toEqual(window.NaN);
            });
            it('and the type is Single', function () {
                expect(DATA_ADAPTERS.editorToJsModel('Infinity', NITypes.SINGLE)).toEqual(Number.POSITIVE_INFINITY);
                expect(DATA_ADAPTERS.editorToJsModel('-Infinity', NITypes.SINGLE)).toEqual(Number.NEGATIVE_INFINITY);
                expect(DATA_ADAPTERS.editorToJsModel('NaN', NITypes.SINGLE)).toEqual(window.NaN);
            });
            it('and the type is Double[]', function () {
                const arrayType = new NIType('{"name":"Array","rank":1,"subtype":"Double"}');
                const jsModelVal = ['Infinity', '-Infinity', 'NaN', 123];
                const editorVal = DATA_ADAPTERS.editorToJsModel(jsModelVal, arrayType);
                expect(editorVal).toEqual([Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, window.NaN, 123]);
            });
            it('and the type is Double[,]', function () {
                const array2DType = new NIType('{"name":"Array","rank":2,"subtype":"Double"}');
                const jsModelVal = [['Infinity', 1, 2], ['-Infinity', 'NaN', 123]];
                const editorVal = DATA_ADAPTERS.editorToJsModel(jsModelVal, array2DType);
                expect(editorVal).toEqual([[Number.POSITIVE_INFINITY, 1, 2], [Number.NEGATIVE_INFINITY, window.NaN, 123]]);
            });
            it('and the type is Cluster (containing a Double)', function () {
                const clusterType = new NIType('{"name":"Cluster","subtype":["Double"],"fields":["Numeric1"]}');
                const jsModelVal = { 'Numeric1': 'Infinity' };
                const editorVal = DATA_ADAPTERS.editorToJsModel(jsModelVal, clusterType);
                expect(editorVal).toEqual({ 'Numeric1': Number.POSITIVE_INFINITY });
            });
            it('and the type is Array of Cluster (containing a Double)', function () {
                const clusterType = { 'name': 'Cluster', 'subtype': ['Double'], 'fields': ['Numeric1'] };
                const arrayType = new NIType({ 'name': 'Array', 'rank': 1, 'subtype': clusterType });
                const jsModelVal = [{ 'Numeric1': 'Infinity' }, { 'Numeric1': 123 }];
                const editorVal = DATA_ADAPTERS.editorToJsModel(jsModelVal, arrayType);
                expect(editorVal).toEqual([{ 'Numeric1': Number.POSITIVE_INFINITY }, { 'Numeric1': 123 }]);
            });
            it('and the type is AnalogWaveform', function () {
                const editorAW = {
                    't0': '0:0',
                    'channelName': 'Channel1',
                    'dt': 1,
                    'Y': [1, 2, 3, 'Infinity', '-Infinity', 'NaN']
                };
                const awtype = new NIType('{"name": "AnalogWaveform", "subtype": "Double"}');
                const jsVal = DATA_ADAPTERS.editorToJsModel(editorAW, awtype);
                expect(jsVal.t0).toEqual('0:0');
                expect(jsVal.channelName).toEqual('Channel1');
                expect(jsVal.dt).toEqual(1);
                expect(jsVal.Y).toEqual([1, 2, 3, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, NaN]);
                const emptyAW = {
                    't0': '0:0',
                    'channelName': 'Channel1',
                    'dt': 1,
                    'Y': []
                };
                const emptyJsVal = DATA_ADAPTERS.editorToJsModel(emptyAW, awtype);
                expect(emptyJsVal.t0).toEqual('0:0');
                expect(emptyJsVal.channelName).toEqual('Channel1');
                expect(emptyJsVal.dt).toEqual(1);
                expect(emptyJsVal.Y).toEqual([]);
            });
            it('and the type is Array of AnalogWaveform', function () {
                const editorAW = {
                    't0': '0:0',
                    'channelName': 'Channel1',
                    'dt': 1,
                    'Y': [1, 2, 3, 'Infinity', '-Infinity', 'NaN']
                };
                const awtype = new NIType('{"name": "AnalogWaveform", "subtype": "Double"}');
                const arrayType = awtype.makeArray(2);
                const jsVal = DATA_ADAPTERS.editorToJsModel([[editorAW], [null], [editorAW]], arrayType);
                expect(jsVal[0][0].t0).toEqual('0:0');
                expect(jsVal[0][0].channelName).toEqual('Channel1');
                expect(jsVal[0][0].dt).toEqual(1);
                expect(jsVal[0][0].Y).toEqual([1, 2, 3, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, NaN]);
                expect(jsVal[1][0].t0).toEqual('0:0');
                expect(jsVal[1][0].channelName).toEqual('');
                expect(jsVal[1][0].dt).toEqual(1);
                expect(jsVal[1][0].Y).toEqual([]);
                expect(jsVal[2][0].t0).toEqual('0:0');
                expect(jsVal[2][0].channelName).toEqual('Channel1');
                expect(jsVal[2][0].dt).toEqual(1);
                expect(jsVal[2][0].Y).toEqual([1, 2, 3, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, NaN]);
            });
        });
    });
});
//# sourceMappingURL=niEditorDataAdapters.Test.js.map