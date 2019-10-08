import { NIListBox } from '../../../Framework/niListBoxSelectionMode.js';
import { ListBoxValueConverter as listBoxValueConverter } from '../../../Framework/ValueConverters/niListBoxValueConverter.js';
describe('A ListBox value converter', function () {
    'use strict';
    const SELECTION_MODE = NIListBox.SelectionModeEnum;
    describe('converts from NI to JQX selection mode', function () {
        it('zero or one', function () {
            const jqxSelectionMode = listBoxValueConverter.convertNIToJQXSelectionMode(SELECTION_MODE.ZERO_OR_ONE);
            expect(jqxSelectionMode).toEqual('zeroOrOne');
        });
        it('one', function () {
            const jqxSelectionMode = listBoxValueConverter.convertNIToJQXSelectionMode(SELECTION_MODE.ONE);
            expect(jqxSelectionMode).toEqual('one');
        });
        it('zero or more', function () {
            const jqxSelectionMode = listBoxValueConverter.convertNIToJQXSelectionMode(SELECTION_MODE.ZERO_OR_MORE);
            expect(jqxSelectionMode).toEqual('zeroOrMany');
        });
        it('one or more', function () {
            const jqxSelectionMode = listBoxValueConverter.convertNIToJQXSelectionMode(SELECTION_MODE.ONE_OR_MORE);
            expect(jqxSelectionMode).toEqual('oneOrMany');
        });
    });
    describe('converts from JQX to NI selection mode', function () {
        it('zero or one', function () {
            const niSelectionMode = listBoxValueConverter.convertJQXToNISelectionMode('zeroOrOne');
            expect(niSelectionMode).toEqual(SELECTION_MODE.ZERO_OR_ONE);
        });
        it('one', function () {
            const niSelectionMode = listBoxValueConverter.convertJQXToNISelectionMode('one');
            expect(niSelectionMode).toEqual(SELECTION_MODE.ONE);
        });
        it('zero or more', function () {
            const niSelectionMode = listBoxValueConverter.convertJQXToNISelectionMode('zeroOrMany');
            expect(niSelectionMode).toEqual(SELECTION_MODE.ZERO_OR_MORE);
        });
        it('one or more', function () {
            const niSelectionMode = listBoxValueConverter.convertJQXToNISelectionMode('oneOrMany');
            expect(niSelectionMode).toEqual(SELECTION_MODE.ONE_OR_MORE);
        });
    });
    describe('converts a ListBox selectedIndex to array when selectedIndex is', function () {
        let obj, convertedVal, expectedVal;
        it('an empty JSON array', function () {
            obj = [];
            convertedVal = listBoxValueConverter.convert(obj, SELECTION_MODE.ZERO_OR_MORE);
            expectedVal = [];
            expect(expectedVal).toEqual(convertedVal);
        });
        it('a JSON array of indices - single value', function () {
            obj = [1];
            convertedVal = listBoxValueConverter.convert(obj, SELECTION_MODE.ZERO_OR_MORE);
            expectedVal = [1];
            expect(expectedVal).toEqual(convertedVal);
        });
        it('a JSON array of indices - multiple values', function () {
            obj = [1, 2, 3];
            convertedVal = listBoxValueConverter.convert(obj, SELECTION_MODE.ZERO_OR_MORE);
            expectedVal = [1, 2, 3];
            expect(expectedVal).toEqual(convertedVal);
        });
        it('-1 (no selection)', function () {
            obj = -1;
            convertedVal = listBoxValueConverter.convert(obj, SELECTION_MODE.ZERO_OR_ONE);
            expectedVal = [];
            expect(expectedVal).toEqual(convertedVal);
        });
        it('a number >= 0', function () {
            obj = 1;
            convertedVal = listBoxValueConverter.convert(obj, SELECTION_MODE.ZERO_OR_ONE);
            expectedVal = [1];
            expect(expectedVal).toEqual(convertedVal);
        });
    });
    describe('convertsBack a value to array of indices ', function () {
        let jsonString, convertedBackVal, expectedBackVal;
        it('empty array, ZeroOrMore selection mode (multi-selection) becomes empty array', function () {
            jsonString = [];
            convertedBackVal = listBoxValueConverter.convertBack(jsonString, SELECTION_MODE.ZERO_OR_MORE);
            expectedBackVal = [];
            expect(expectedBackVal).toEqual(convertedBackVal);
        });
        it('array of 1 index, ZeroOrMore selection mode (multi-selection) becomes array of 1 item', function () {
            jsonString = [1];
            convertedBackVal = listBoxValueConverter.convertBack(jsonString, SELECTION_MODE.ZERO_OR_MORE);
            expectedBackVal = [1];
            expect(expectedBackVal).toEqual(convertedBackVal);
        });
        it('array of >1 indices, ZeroOrMore selection mode (multi-selection) becomes array of >1 indices', function () {
            jsonString = [1, 2, 3];
            convertedBackVal = listBoxValueConverter.convertBack(jsonString, SELECTION_MODE.ZERO_OR_MORE);
            expectedBackVal = [1, 2, 3];
            expect(expectedBackVal).toEqual(convertedBackVal);
        });
        it('empty array, ZeroOrOne selection mode (single-selection) becomes -1', function () {
            jsonString = [];
            convertedBackVal = listBoxValueConverter.convertBack(jsonString, SELECTION_MODE.ZERO_OR_ONE);
            expectedBackVal = -1;
            expect(expectedBackVal).toEqual(convertedBackVal);
        });
        it('array of 1 index, ZeroOrOne selection mode (multi-selection) becomes 1 index', function () {
            jsonString = [1];
            convertedBackVal = listBoxValueConverter.convertBack(jsonString, SELECTION_MODE.ZERO_OR_ONE);
            expectedBackVal = 1;
            expect(expectedBackVal).toEqual(convertedBackVal);
        });
        it('empty array, OneOrMore selection mode (multi-selection) becomes empty array', function () {
            jsonString = [];
            convertedBackVal = listBoxValueConverter.convertBack(jsonString, SELECTION_MODE.ONE_OR_MORE);
            expectedBackVal = [];
            expect(expectedBackVal).toEqual(convertedBackVal);
        });
        it('array of 1 index, OneOrMore selection mode (multi-selection) becomes array of 1 item', function () {
            jsonString = [1];
            convertedBackVal = listBoxValueConverter.convertBack(jsonString, SELECTION_MODE.ONE_OR_MORE);
            expectedBackVal = [1];
            expect(expectedBackVal).toEqual(convertedBackVal);
        });
        it('array of >1 indices, OneOrMore selection mode (multi-selection) becomes array of >1 indices', function () {
            jsonString = [1, 2, 3];
            convertedBackVal = listBoxValueConverter.convertBack(jsonString, SELECTION_MODE.ONE_OR_MORE);
            expectedBackVal = [1, 2, 3];
            expect(expectedBackVal).toEqual(convertedBackVal);
        });
        it('empty array, One selection mode (single-selection) becomes -1', function () {
            jsonString = [];
            convertedBackVal = listBoxValueConverter.convertBack(jsonString, SELECTION_MODE.ONE);
            expectedBackVal = -1;
            expect(expectedBackVal).toEqual(convertedBackVal);
        });
        it('array of 1 index, One selection mode (multi-selection) becomes 1 index', function () {
            jsonString = [1];
            convertedBackVal = listBoxValueConverter.convertBack(jsonString, SELECTION_MODE.ONE);
            expectedBackVal = 1;
            expect(expectedBackVal).toEqual(convertedBackVal);
        });
    });
});
//# sourceMappingURL=niListBoxValueConverter.Test.js.map