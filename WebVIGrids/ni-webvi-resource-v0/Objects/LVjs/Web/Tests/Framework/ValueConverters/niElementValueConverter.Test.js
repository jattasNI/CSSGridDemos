import { ElementValueConverter as ELEMENT_VAL_CONVERTER } from '../../../Framework/ValueConverters/niElementValueConverter.js';
import { JQXNumericValueConverter } from '../../../Framework/ValueConverters/niJQXNumericValueConverter.js';
import { JsonValueConverter } from '../../../Framework/ValueConverters/niJsonValueConverter.js';
import { ListBoxValueConverter } from '../../../Framework/ValueConverters/niListBoxValueConverter.js';
import { NumericValueConverter } from '../../../Framework/ValueConverters/niNumericValueConverter.js';
import { ValueConverter } from '../../../Framework/ValueConverters/niValueConverter.js';
describe('An element value converter', function () {
    'use strict';
    const NITypes = window.NITypes;
    const NIType = window.NIType;
    describe('findValueConverter gets', function () {
        let expectedValueConverter, expectedJQXValueConverter;
        describe('a valueConverter when element is', function () {
            beforeEach(function () {
                expectedValueConverter = ValueConverter;
            });
            it('a non NI element', function () {
                const element = document.createElement('div');
                const valConverter = ELEMENT_VAL_CONVERTER.findValueConverter(element);
                expect(valConverter).toBe(expectedValueConverter);
            });
            it('a non existant NI element', function () {
                const element = document.createElement('ni-custom-not-existant-element');
                const valConverter = ELEMENT_VAL_CONVERTER.findValueConverter(element);
                expect(valConverter).toBe(expectedValueConverter);
            });
        });
        describe('a NumericValueConverter when element is', function () {
            beforeEach(function () {
                expectedValueConverter = NumericValueConverter;
                expectedJQXValueConverter = JQXNumericValueConverter;
            });
            it('a jqx-numeric-text-box', function () {
                const element = document.createElement('jqx-numeric-text-box');
                const valConverter = ELEMENT_VAL_CONVERTER.findValueConverter(element);
                expect(valConverter).toBe(expectedJQXValueConverter);
            });
            it('a jqx-gauge', function () {
                const element = document.createElement('jqx-gauge');
                const valConverter = ELEMENT_VAL_CONVERTER.findValueConverter(element);
                expect(valConverter).toBe(expectedJQXValueConverter);
            });
            it('a ni-ring-selector', function () {
                const element = document.createElement('ni-ring-selector');
                const valConverter = ELEMENT_VAL_CONVERTER.findValueConverter(element);
                expect(valConverter).toBe(expectedValueConverter);
            });
            it('a ni-enum-selector', function () {
                const element = document.createElement('ni-enum-selector');
                const valConverter = ELEMENT_VAL_CONVERTER.findValueConverter(element);
                expect(valConverter).toBe(expectedValueConverter);
            });
            it('a ni-radio-button-group', function () {
                const element = document.createElement('ni-radio-button-group');
                const valConverter = ELEMENT_VAL_CONVERTER.findValueConverter(element);
                expect(valConverter).toBe(expectedValueConverter);
            });
            it('a jqx-tank', function () {
                const element = document.createElement('jqx-tank');
                const valConverter = ELEMENT_VAL_CONVERTER.findValueConverter(element);
                expect(valConverter).toBe(expectedJQXValueConverter);
            });
            it('a jqx-slider', function () {
                const element = document.createElement('jqx-slider');
                const valConverter = ELEMENT_VAL_CONVERTER.findValueConverter(element);
                expect(valConverter).toBe(expectedJQXValueConverter);
            });
        });
        describe('a ListBoxValueConverter when element is', function () {
            beforeEach(function () {
                expectedValueConverter = ListBoxValueConverter;
            });
            it('a jqx-list-box', function () {
                const element = document.createElement('jqx-list-box');
                const valConverter = ELEMENT_VAL_CONVERTER.findValueConverter(element);
                expect(valConverter).toBe(expectedValueConverter);
            });
        });
        describe('a JsonValueConverter when element is', function () {
            beforeEach(function () {
                expectedValueConverter = JsonValueConverter;
            });
            it('a ni-path-selector', function () {
                const element = document.createElement('ni-path-selector');
                const valConverter = ELEMENT_VAL_CONVERTER.findValueConverter(element);
                expect(valConverter).toBe(expectedValueConverter);
            });
        });
    });
    describe('GetConverterParameters gets', function () {
        let expectedParams;
        describe('undefined when element is', function () {
            beforeEach(function () {
                expectedParams = undefined;
            });
            it('a non NI element', function () {
                const element = document.createElement('div');
                const params = ELEMENT_VAL_CONVERTER.getConverterParameters(element);
                expect(params).toBe(expectedParams);
            });
            it('a non existant NI element', function () {
                const element = document.createElement('ni-custom-not-existant-element');
                const params = ELEMENT_VAL_CONVERTER.getConverterParameters(element);
                expect(params).toBe(expectedParams);
            });
        });
        describe('the numeric niType when element is', function () {
            it('a jqx-numeric-text-box', function () {
                const element = document.createElement('jqx-numeric-text-box');
                element.niType = NITypes.DOUBLE.toShortJSON();
                element.inputFormat = 'floatingPoint';
                const params = ELEMENT_VAL_CONVERTER.getConverterParameters(element);
                expect(params instanceof NIType).toBe(true);
                expect(params.isDouble()).toBe(true);
            });
            it('a jqx-gauge', function () {
                const element = document.createElement('jqx-gauge');
                element.niType = NITypes.INT32.toShortJSON();
                element.scaleType = 'integer';
                const params = ELEMENT_VAL_CONVERTER.getConverterParameters(element);
                expect(params instanceof NIType).toBe(true);
                expect(params.isInt32()).toBe(true);
            });
            it('a ni-ring-selector', function () {
                const element = document.createElement('ni-ring-selector');
                element.niType = NITypes.INT32.toShortJSON();
                const params = ELEMENT_VAL_CONVERTER.getConverterParameters(element);
                expect(params instanceof NIType).toBe(true);
                expect(params.isInt32()).toBe(true);
            });
            it('a ni-enum-selector', function () {
                const element = document.createElement('ni-enum-selector');
                element.niType = NITypes.INT32.toShortJSON();
                const params = ELEMENT_VAL_CONVERTER.getConverterParameters(element);
                expect(params instanceof NIType).toBe(true);
                expect(params.isInt32()).toBe(true);
            });
            it('a ni-radio-button-group', function () {
                const element = document.createElement('ni-radio-button-group');
                element.niType = NITypes.INT32.toShortJSON();
                const params = ELEMENT_VAL_CONVERTER.getConverterParameters(element);
                expect(params instanceof NIType).toBe(true);
                expect(params.isInt32()).toBe(true);
            });
            it('a jqx-tank', function () {
                const element = document.createElement('jqx-tank');
                element.niType = NITypes.INT32.toShortJSON();
                element.scaleType = 'integer';
                element.wordLength = 'int32';
                const params = ELEMENT_VAL_CONVERTER.getConverterParameters(element);
                expect(params instanceof NIType).toBe(true);
                expect(params.isInt32()).toBe(true);
            });
            it('a jqx-slider', function () {
                const element = document.createElement('jqx-slider');
                element.niType = NITypes.INT32.toShortJSON();
                element.scaleType = 'integer';
                element.wordLength = 'int32';
                const params = ELEMENT_VAL_CONVERTER.getConverterParameters(element);
                expect(params instanceof NIType).toBe(true);
                expect(params.isInt32()).toBe(true);
            });
        });
        describe('the ListBox Selection Mode when element is', function () {
            it('a jqx-list-box', function () {
                const element = document.createElement('jqx-list-box');
                element.selectionMode = 'zeroOrOne';
                const params = ELEMENT_VAL_CONVERTER.getConverterParameters(element);
                expect(params).toBe(ListBoxValueConverter.convertJQXToNISelectionMode(element.selectionMode));
            });
        });
    });
    // We won't test Convert and ConvertBack methods here, since those are tested.
    // Per ValueConverter.
});
//# sourceMappingURL=niElementValueConverter.Test.js.map