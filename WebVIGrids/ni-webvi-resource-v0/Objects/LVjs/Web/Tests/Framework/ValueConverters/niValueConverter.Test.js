import { ValueConverter as valueConverter } from '../../../Framework/ValueConverters/niValueConverter.js';
describe('A value converter', function () {
    'use strict';
    it('convert returns original value', function () {
        const value = 5;
        const convertedValue = valueConverter.convert(value);
        expect(convertedValue).toBe(value);
    });
    it('convertBack returns original value', function () {
        const value = 5;
        const convertedBackValue = valueConverter.convert(value);
        expect(convertedBackValue).toBe(value);
    });
});
//# sourceMappingURL=niValueConverter.Test.js.map