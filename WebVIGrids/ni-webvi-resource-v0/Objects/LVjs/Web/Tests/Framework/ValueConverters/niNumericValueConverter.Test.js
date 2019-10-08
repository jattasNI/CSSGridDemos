import { NumericValueConverter as numValueConverter } from '../../../Framework/ValueConverters/niNumericValueConverter.js';
describe('A numeric value converter', function () {
    'use strict';
    const NITypes = window.NITypes;
    describe('convert returns an object with the key "stringValue" mapping to a string value with ', function () {
        it('an INT64 value type.', function () {
            const value = '5000';
            const convertedValue = numValueConverter.convert(value, NITypes.INT64);
            const expectedValue = { stringValue: '5000' };
            expect(expectedValue).toEqual(convertedValue);
        });
        it('an UINT64 value type', function () {
            const value = '5000';
            const convertedValue = numValueConverter.convert(value, NITypes.UINT64);
            const expectedValue = { stringValue: '5000' };
            expect(expectedValue).toEqual(convertedValue);
        });
        it('a Complex Single type', function () {
            const value = '1+i';
            const convertedValue = numValueConverter.convert(value, NITypes.COMPLEXSINGLE);
            const expectedValue = { stringValue: '1+i' };
            expect(expectedValue).toEqual(convertedValue);
        });
        it('a Complex Double type', function () {
            const value = '1+i';
            const convertedValue = numValueConverter.convert(value, NITypes.COMPLEXDOUBLE);
            const expectedValue = { stringValue: '1+i' };
            expect(expectedValue).toEqual(convertedValue);
        });
    });
    describe('convert returns an object with the key "numberValue" mapping to ', function () {
        it('value if "parseNumberValue" is not true', function () {
            const value = 5000;
            const convertedValue = numValueConverter.convert(value, NITypes.INT32, false);
            const expectedValue = { numberValue: 5000 };
            expect(expectedValue).toEqual(convertedValue);
        });
        it('parsed numeric value if "parseNumberValue" is true', function () {
            const value = '5000';
            const convertedValue = numValueConverter.convert(value, NITypes.INT32, true);
            const expectedValue = { numberValue: 5000 };
            expect(expectedValue).toEqual(convertedValue);
        });
    });
    // Type validation.
    describe('convert throws error if ', function () {
        it('niType is a large NumericValueType and value is not a string', function () {
            const convertingAction = function () {
                numValueConverter.convert(5000, NITypes.INT64);
            };
            expect(convertingAction).toThrow();
        });
        it('niType is not a large NumericValueType and value is not a numeric', function () {
            const convertingAction = function () {
                numValueConverter.convert('5000', NITypes.INT32, false);
            };
            expect(convertingAction).toThrow();
        });
    });
    describe('convertBack returns "stringValue" from "obj" if "niType" is a large number', function () {
        it('like an INT64', function () {
            const obj = { stringValue: '5000' };
            const convertedaBackVal = numValueConverter.convertBack(obj, NITypes.INT64);
            const expectedBackVal = '5000';
            expect(expectedBackVal).toEqual(convertedaBackVal);
        });
        it('like an UINT64', function () {
            const obj = { stringValue: '5000' };
            const convertedaBackVal = numValueConverter.convertBack(obj, NITypes.UINT64);
            const expectedBackVal = '5000';
            expect(expectedBackVal).toEqual(convertedaBackVal);
        });
        it('like a Complex Single', function () {
            const obj = { stringValue: '1+i' };
            const convertedaBackVal = numValueConverter.convertBack(obj, NITypes.COMPLEXSINGLE);
            const expectedBackVal = '1+i';
            expect(expectedBackVal).toEqual(convertedaBackVal);
        });
        it('like a Complex Double', function () {
            const obj = { stringValue: '1+i' };
            const convertedaBackVal = numValueConverter.convertBack(obj, NITypes.COMPLEXDOUBLE);
            const expectedBackVal = '1+i';
            expect(expectedBackVal).toEqual(convertedaBackVal);
        });
    });
    describe('convertBack returns "numberValue" from "obj" if "niType" is not a large number', function () {
        it('like an Int32', function () {
            const obj = { numberValue: 0 };
            const convertedaBackVal = numValueConverter.convertBack(obj, NITypes.INT32);
            const expectedBackVal = 0;
            expect(expectedBackVal).toEqual(convertedaBackVal);
        });
        it('even undefined', function () {
            const obj = { numberValue: 0 };
            const convertedaBackVal = numValueConverter.convertBack(obj, undefined);
            const expectedBackVal = 0;
            expect(expectedBackVal).toEqual(convertedaBackVal);
        });
    });
    // Exceptional cases
    describe('convertBack throws error when', function () {
        it('"obj" is not an "object"', function () {
            const convertingAction = function () {
                numValueConverter.convertBack(1000, NITypes.INT64);
            };
            expect(convertingAction).toThrow();
        });
        it('"value" in {stringValue: value} is not a "string"', function () {
            const convertingAction = function () {
                numValueConverter.convertBack({ stringValue: 1000 }, NITypes.INT64);
            };
            expect(convertingAction).toThrow();
        });
        it('"value" in {numberValue: value} is not a "number"', function () {
            const convertingAction = function () {
                numValueConverter.convertBack({ numberValue: '1000' }, NITypes.INT32);
            };
            expect(convertingAction).toThrow();
        });
    });
});
//# sourceMappingURL=niNumericValueConverter.Test.js.map