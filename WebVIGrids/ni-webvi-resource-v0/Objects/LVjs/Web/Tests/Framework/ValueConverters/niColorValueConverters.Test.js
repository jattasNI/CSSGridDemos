import { ColorValueConverters as colorValueConverter } from '../../../Framework/ValueConverters/niColorValueConverters.js';
describe('A color value converter', function () {
    'use strict';
    it('converts hex color to corresponding integer color value', function () {
        const hexValue = '#000';
        const expectedValue = 4278190080;
        const convertedValue = colorValueConverter.hexToInteger(hexValue);
        expect(convertedValue).toBe(expectedValue);
    });
    it('converts hex color (different input value) to corresponding integer color value', function () {
        const hexValue = '#123';
        const expectedValue = 4279312947;
        const convertedValue = colorValueConverter.hexToInteger(hexValue);
        expect(convertedValue).toBe(expectedValue);
    });
    it('converts 6-digit hex color to corresponding integer color value', function () {
        const hexValue = '#F2F2F2';
        const expectedValue = 4294111986;
        const convertedValue = colorValueConverter.hexToInteger(hexValue);
        expect(convertedValue).toBe(expectedValue);
    });
    it('converts 6-digit hex color (different input value) to corresponding integer color value', function () {
        const hexValue = '#4d5359';
        const expectedValue = 4283257689;
        const convertedValue = colorValueConverter.hexToInteger(hexValue);
        expect(convertedValue).toBe(expectedValue);
    });
    it('converts hex color string preceded by white spaces to corresponding integer color value', function () {
        const newColor = '  #fff';
        const expectedValue = 4294967295;
        const convertedValue = colorValueConverter.getIntegerValueForInputColor(newColor);
        expect(convertedValue).toBe(expectedValue);
    });
    it('converts rgba color string preceded by white spaces to corresponding integer color value', function () {
        const newColor = ' rgba(153,83,86,0.6)';
        const expectedValue = 2576962390;
        const convertedValue = colorValueConverter.getIntegerValueForInputColor(newColor);
        expect(convertedValue).toBe(expectedValue);
    });
    it('converts rgba color to corresponding integer color value', function () {
        const newColor = 'rgba(51,71,188,0.13)';
        const expectedValue = 557008828;
        const convertedValue = colorValueConverter.getIntegerValueForInputColor(newColor);
        expect(convertedValue).toBe(expectedValue);
    });
});
//# sourceMappingURL=niColorValueConverters.Test.js.map