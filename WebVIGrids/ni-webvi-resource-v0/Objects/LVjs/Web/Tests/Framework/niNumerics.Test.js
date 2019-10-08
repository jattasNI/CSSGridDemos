//******************************************
// Tests for NINumerics
// National Instruments Copyright 2016
//******************************************
import { NINumericsHelpers as NUM_HELPERS } from '../../Framework/niNumerics.js';
describe('The NINumerics helpers: ', function () {
    'use strict';
    describe('coerceDisplayDigits ', function () {
        // Usage: coerceDisplayDigits(significantDigits, precisionDigits)  or
        // Usage: coerceDisplayDigits(significantDigits, precisionDigits, unsetValue)
        it('returns significantDigits as undefined when the input value is -1', function () {
            const digits = NUM_HELPERS.coerceDisplayDigits(-1, 1);
            expect(digits).toBeDefined();
            expect(digits.significantDigits).toBe(undefined);
        });
        it('returns precisionDigits as undefined when the input value is -1', function () {
            const digits = NUM_HELPERS.coerceDisplayDigits(1, -1);
            expect(digits).toBeDefined();
            expect(digits.precisionDigits).toBe(undefined);
        });
        it('coerces significantDigits to the range [1, 21]', function () {
            let digits = NUM_HELPERS.coerceDisplayDigits(0, 1);
            expect(digits.significantDigits).toBe(1);
            digits = NUM_HELPERS.coerceDisplayDigits(1, 1);
            expect(digits.significantDigits).toBe(1);
            digits = NUM_HELPERS.coerceDisplayDigits(21, 1);
            expect(digits.significantDigits).toBe(21);
            digits = NUM_HELPERS.coerceDisplayDigits(22, 1);
            expect(digits.significantDigits).toBe(21);
        });
        it('coerces precisionDigits to the range [0, 20]', function () {
            // Note: -1 is always a special case. The assumption is that if precisionDigits is -1, significantDigits should be set to something non-negative (and vice versa)
            // So here, we expect negative values to be coerced to 0, except for -1 (which gets mapped to undefined)
            let digits = NUM_HELPERS.coerceDisplayDigits(-1, -2);
            expect(digits.precisionDigits).toBe(0);
            digits = NUM_HELPERS.coerceDisplayDigits(-1, 0);
            expect(digits.precisionDigits).toBe(0);
            digits = NUM_HELPERS.coerceDisplayDigits(-1, 20);
            expect(digits.precisionDigits).toBe(20);
            digits = NUM_HELPERS.coerceDisplayDigits(-1, 21);
            expect(digits.precisionDigits).toBe(20);
        });
        it('returns precisionDigits as undefined, if both the significantDigits and precisionDigits inputs were set', function () {
            // sigificantDigits and precisionDigits are expected to be mutually exclusive.
            // If both are set, we prefer significantDigits (and ignore precisionDigits)
            const digits = NUM_HELPERS.coerceDisplayDigits(4, 5);
            expect(digits.significantDigits).toBe(4);
            expect(digits.precisionDigits).toBe(undefined);
        });
        it('returns defaults to 0 precisionDigits, when neither input is valid', function () {
            const digits = NUM_HELPERS.coerceDisplayDigits(-1, -1);
            expect(digits.significantDigits).toBe(undefined);
            expect(digits.precisionDigits).toBe(0);
        });
        it('accepts a third parameter (unsetValue), which will be set instead of undefined when the inputs are -1', function () {
            let digits = NUM_HELPERS.coerceDisplayDigits(-1, 4, null);
            expect(digits.significantDigits).toBe(null);
            expect(digits.precisionDigits).toBe(4);
            digits = NUM_HELPERS.coerceDisplayDigits(5, -1, null);
            expect(digits.significantDigits).toBe(5);
            expect(digits.precisionDigits).toBe(null);
        });
    });
});
//# sourceMappingURL=niNumerics.Test.js.map