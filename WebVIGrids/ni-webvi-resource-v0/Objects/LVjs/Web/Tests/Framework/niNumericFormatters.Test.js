"use strict";
//******************************************
// Tests for NINumeric data type
// National Instruments Copyright 2016
//******************************************
describe('The NINumeric', function () {
    'use strict';
    const niNumericFormatters = window.NINumericFormatters;
    describe('toSINotation function', function () {
        it('can format special cases', function () {
            const testVector = [
                [NaN, 0, 'NaN'],
                [undefined, 0, 'undefined'],
                [null, 0, 'null'],
                [0, 1, '0'],
                [0.00, 0, '0'],
                [0.0, 3, '0'],
                [0.000, 2, '0'],
                [Infinity, 2, 'Infinity'],
                [-Infinity, 3, '-Infinity'],
                [1.2, NaN, '1'],
                [1.2, undefined, '1'],
                [-1.2, Infinity, '-1'],
                [-1.2, -Infinity, '-1'],
                [1.2, null, '1'],
                [1.2, -1, '1'],
                [1, 21, '1'],
                [NaN, NaN, 'NaN'],
                [undefined, undefined, 'undefined'],
                [null, null, 'null']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('removes last 0s', function () {
            const testVector = [
                [1.5e-5, 10, '15μ'],
                [1.5e-4, 10, '150μ'],
                [1.5e-3, 10, '1.5m'],
                [1.5e-2, 10, '15m'],
                [1.5e-1, 10, '150m'],
                [-1.5e-5, 10, '-15μ'],
                [-1.5e-4, 10, '-150μ'],
                [-1.5e-3, 10, '-1.5m'],
                [-1.5e-2, 10, '-15m'],
                [-1.5e-1, 10, '-150m'],
                [1.00000e-5, 5, '10μ'],
                [1.00000e-4, 4, '100μ'],
                [1.00000e-3, 3, '1m'],
                [1.00000e-2, 2, '10m'],
                [1.00000e-1, 1, '100m'],
                [-1.00000e-5, 5, '-10μ'],
                [-1.00000e-4, 4, '-100μ'],
                [-1.00000e-3, 3, '-1m'],
                [-1.00000e-2, 2, '-10m'],
                [-1.00000e-1, 1, '-100m'],
                [5.00000e-5, 0, '50μ'],
                [5.00000e-4, 0, '500μ'],
                [5.00000e-3, 0, '5m'],
                [5.00000e-2, 0, '50m'],
                [5.00000e-1, 0, '500m'],
                [-5.00000e-5, 0, '-50μ'],
                [-5.00000e-4, 0, '-500μ'],
                [-5.00000e-3, 0, '-5m'],
                [-5.00000e-2, 0, '-50m'],
                [-5.00000e-1, 0, '-500m'] //-500.00m -> -500m
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('rounds up', function () {
            const testVector = [
                //test 10 decimals with rounding up
                [1.55555555555555555e-5, 10, '15.5555555556μ'],
                [1.55555555555555555e-4, 10, '155.5555555556μ'],
                [1.55555555555555555e-3, 10, '1.5555555556m'],
                [1.55555555555555555e-2, 10, '15.5555555556m'],
                [1.55555555555555555e-1, 10, '155.5555555556m'],
                [-1.55555555555555555e-5, 10, '-15.5555555556μ'],
                [-1.55555555555555555e-4, 10, '-155.5555555556μ'],
                [-1.55555555555555555e-3, 10, '-1.5555555556m'],
                [-1.55555555555555555e-2, 10, '-15.5555555556m'],
                [-1.55555555555555555e-1, 10, '-155.5555555556m'],
                //test rounding up with decimals removal
                [1.555555e-5, 4, '15.5556μ'],
                [1.5555555e-4, 3, '155.556μ'],
                [1.55555e-3, 2, '1.56m'],
                [1.55555e-2, 1, '15.6m'],
                [1.55555e-1, 0, '156m'],
                [-1.555555e-5, 4, '-15.5556μ'],
                [-1.5555555e-4, 3, '-155.556μ'],
                [-1.55555e-3, 2, '-1.56m'],
                [-1.55555e-2, 1, '-15.6m'],
                [-1.55555e-1, 0, '-156m']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('rounds down', function () {
            const testVector = [
                //test 10 decimals with rounding down
                [1.555555555549e-5, 10, '15.5555555555μ'],
                [1.5555555555549e-4, 10, '155.5555555555μ'],
                [1.55555555549e-3, 10, '1.5555555555m'],
                [1.555555555549e-2, 10, '15.5555555555m'],
                [1.5555555555549e-1, 10, '155.5555555555m'],
                [-1.555555555549e-5, 10, '-15.5555555555μ'],
                [-1.5555555555549e-4, 10, '-155.5555555555μ'],
                [-1.55555555549e-3, 10, '-1.5555555555m'],
                [-1.555555555549e-2, 10, '-15.5555555555m'],
                [-1.5555555555549e-1, 10, '-155.5555555555m'],
                //test rounding down with decimals removal
                [1.5554999e-5, 3, '15.555μ'],
                [1.5555499e-4, 3, '155.555μ'],
                [1.554999e-3, 2, '1.55m'],
                [1.554999e-2, 1, '15.5m'],
                [1.554999e-1, 0, '155m'],
                [-1.555499e-5, 3, '-15.555μ'],
                [-1.555549e-4, 3, '-155.555μ'],
                [-1.554999e-3, 2, '-1.55m'],
                [-1.554999e-2, 1, '-15.5m'],
                [-1.554999e-1, 0, '-155m']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format to yocto (y)', function () {
            const testVector = [
                [1.5e-45, 5, '1.5E-21y'],
                //[1.5e-44, 20, '0.00000000000000000001y'],
                //on IE/PhantomJS toFixed() has precision on 20 decimals, but on Chrome/Firefox is 100 decimals =>
                //on IE '0.000000000000000000015' is aproximated to '0.00000000000000000002', and on Chrome/Firefox is not aproximated
                [1.5e-28, 10, '0.00015y'],
                [1.5e-28, 5, '0.00015y'],
                [1.5e-27, 4, '0.0015y'],
                [1.5e-26, 3, '0.015y'],
                [1.5e-25, 2, '0.15y'],
                [1.5e-24, 1, '1.5y'],
                [1.59e-24, 0, '2y'],
                [-1.5e-45, 5, '-1.5E-21y'],
                //[-1.5e-44, 20, '-0.00000000000000000001y'],
                //on IE/PhantomJS toFixed() has precision on 20 decimals, but on Chrome/Firefox is 100 decimals =>
                //on IE '0.000000000000000000015' is aproximated to '0.00000000000000000002', and on Chrome/Firefox is not aproximated
                [-1.5e-28, 10, '-0.00015y'],
                [-1.5e-28, 5, '-0.00015y'],
                [-1.5e-27, 4, '-0.0015y'],
                [-1.5e-26, 3, '-0.015y'],
                [-1.5e-25, 2, '-0.15y'],
                [-1.5e-24, 1, '-1.5y'],
                [-1.59e-24, 0, '-2y'],
                [1.5e-23, 10, '15y'],
                [1.5e-23, 3, '15y'],
                [1.5e-22, 2, '150y'],
                [-1.5e-23, 10, '-15y'],
                [-1.5e-23, 3, '-15y'],
                [-1.5e-22, 2, '-150y']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format to zepto (z)', function () {
            const testVector = [
                [1.5e-21, 1, '1.5z'],
                [1.59e-21, 0, '2z'],
                [-1.5e-21, 1, '-1.5z'],
                [-1.59e-21, 0, '-2z'],
                [1.5e-20, 10, '15z'],
                [1.5e-20, 3, '15z'],
                [1.5e-19, 2, '150z'],
                [-1.5e-20, 10, '-15z'],
                [-1.5e-20, 3, '-15z'],
                [-1.5e-19, 2, '-150z']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format to atto (a)', function () {
            const testVector = [
                [1.5e-18, 1, '1.5a'],
                [1.59e-18, 0, '2a'],
                [-1.5e-18, 1, '-1.5a'],
                [-1.59e-18, 0, '-2a'],
                [1.5e-17, 10, '15a'],
                [1.5e-17, 3, '15a'],
                [1.5e-16, 2, '150a'],
                [-1.5e-17, 10, '-15a'],
                [-1.5e-17, 3, '-15a'],
                [-1.5e-16, 2, '-150a']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format to femto (f)', function () {
            const testVector = [
                [1.5e-15, 1, '1.5f'],
                [1.59e-15, 0, '2f'],
                [-1.5e-15, 1, '-1.5f'],
                [-1.59e-15, 0, '-2f'],
                [1.5e-14, 10, '15f'],
                [1.5e-14, 3, '15f'],
                [1.5e-13, 2, '150f'],
                [-1.5e-14, 10, '-15f'],
                [-1.5e-14, 3, '-15f'],
                [-1.5e-13, 2, '-150f']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format to pico (p)', function () {
            const testVector = [
                [1.5e-12, 1, '1.5p'],
                [1.59e-12, 0, '2p'],
                [-1.5e-12, 1, '-1.5p'],
                [-1.59e-12, 0, '-2p'],
                [1.5e-11, 10, '15p'],
                [1.5e-11, 3, '15p'],
                [1.5e-10, 2, '150p'],
                [-1.5e-11, 10, '-15p'],
                [-1.5e-11, 3, '-15p'],
                [-1.5e-10, 2, '-150p']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format to nano (n)', function () {
            const testVector = [
                [1.5e-9, 1, '1.5n'],
                [1.59e-9, 0, '2n'],
                [-1.5e-9, 1, '-1.5n'],
                [-1.59e-9, 0, '-2n'],
                [1.5e-8, 10, '15n'],
                [1.5e-8, 3, '15n'],
                [1.5e-7, 2, '150n'],
                [-1.5e-8, 10, '-15n'],
                [-1.5e-8, 3, '-15n'],
                [-1.5e-7, 2, '-150n']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format to mirco (μ)', function () {
            const testVector = [
                [1.5e-6, 1, '1.5μ'],
                [1.59e-6, 0, '2μ'],
                [-1.5e-6, 1, '-1.5μ'],
                [-1.59e-6, 0, '-2μ'],
                [1.5e-5, 10, '15μ'],
                [1.5e-5, 3, '15μ'],
                [1.5e-4, 2, '150μ'],
                [-1.5e-5, 10, '-15μ'],
                [-1.5e-5, 3, '-15μ'],
                [-1.5e-4, 2, '-150μ']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format to milli (m)', function () {
            const testVector = [
                [1.5e-3, 1, '1.5m'],
                [1.5e-3, 0, '2m'],
                [-1.5e-3, 1, '-1.5m'],
                [-1.5e-3, 0, '-2m'],
                [1.5e-2, 10, '15m'],
                [1.5e-2, 3, '15m'],
                [1.5e-1, 2, '150m'],
                [-1.5e-2, 10, '-15m'],
                [-1.5e-2, 3, '-15m'],
                [-1.5e-1, 2, '-150m']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('successfully keeps the units', function () {
            const testVector = [
                [1.5e0, 1, '1.5'],
                [1.5e0, 0, '2'],
                [1.5e1, 0, '15'],
                [1.5e2, 1, '150'],
                [-1.5e0, 1, '-1.5'],
                [-1.5e0, 0, '-2'],
                [-1.5e1, 0, '-15'],
                [-1.5e2, 1, '-150']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format to kilo (k)', function () {
            const testVector = [
                [1.5e3, 10, '1.5k'],
                [1.5e3, 3, '1.5k'],
                [1.5e4, 2, '15k'],
                [1.5e5, 1, '150k'],
                [1.5e5, 0, '150k'],
                [-1.5e3, 10, '-1.5k'],
                [-1.5e3, 3, '-1.5k'],
                [-1.5e4, 2, '-15k'],
                [-1.5e5, 1, '-150k'],
                [-1.5e5, 0, '-150k']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format to Mega (M)', function () {
            const testVector = [
                [1.5e6, 10, '1.5M'],
                [1.5e6, 3, '1.5M'],
                [1.5e7, 2, '15M'],
                [1.5e8, 1, '150M'],
                [1.5e8, 0, '150M'],
                [-1.5e6, 10, '-1.5M'],
                [-1.5e6, 3, '-1.5M'],
                [-1.5e7, 2, '-15M'],
                [-1.5e8, 1, '-150M'],
                [-1.5e8, 0, '-150M']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format to Giga (G)', function () {
            const testVector = [
                [1.5e9, 10, '1.5G'],
                [1.5e9, 3, '1.5G'],
                [1.5e10, 2, '15G'],
                [1.5e11, 1, '150G'],
                [1.5e11, 0, '150G'],
                [-1.5e9, 10, '-1.5G'],
                [-1.5e9, 3, '-1.5G'],
                [-1.5e10, 2, '-15G'],
                [-1.5e11, 1, '-150G'],
                [-1.5e11, 0, '-150G']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format to Tera (T)', function () {
            const testVector = [
                [1.5e12, 10, '1.5T'],
                [1.5e12, 3, '1.5T'],
                [1.5e13, 2, '15T'],
                [1.5e14, 1, '150T'],
                [1.5e14, 0, '150T'],
                [-1.5e12, 10, '-1.5T'],
                [-1.5e12, 3, '-1.5T'],
                [-1.5e13, 2, '-15T'],
                [-1.5e14, 1, '-150T'],
                [-1.5e14, 0, '-150T']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format to Peta (P)', function () {
            const testVector = [
                [1.5e15, 10, '1.5P'],
                [1.5e15, 3, '1.5P'],
                [1.5e16, 2, '15P'],
                [1.5e17, 1, '150P'],
                [1.5e17, 0, '150P'],
                [-1.5e15, 10, '-1.5P'],
                [-1.5e15, 3, '-1.5P'],
                [-1.5e16, 2, '-15P'],
                [-1.5e17, 1, '-150P'],
                [-1.5e17, 0, '-150P']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format to Exa (E)', function () {
            const testVector = [
                [1.5e18, 10, '1.5E'],
                [1.5e18, 3, '1.5E'],
                [1.5e19, 2, '15E'],
                [1.5e20, 1, '150E'],
                [1.5e20, 0, '150E'],
                [-1.5e18, 10, '-1.5E'],
                [-1.5e18, 3, '-1.5E'],
                [-1.5e19, 2, '-15E'],
                [-1.5e20, 1, '-150E'],
                [-1.5e20, 0, '-150E']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format to Zetta (Z)', function () {
            const testVector = [
                [1.5e21, 10, '1.5Z'],
                [1.5e21, 3, '1.5Z'],
                [1.5e22, 2, '15Z'],
                [1.5e23, 1, '150Z'],
                [1.5e23, 0, '150Z'],
                [-1.5e21, 10, '-1.5Z'],
                [-1.5e21, 3, '-1.5Z'],
                [-1.5e22, 2, '-15Z'],
                [-1.5e23, 1, '-150Z'],
                [-1.5e23, 0, '-150Z']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format to Yotta (Y)', function () {
            const testVector = [
                [1.5e24, 10, '1.5Y'],
                [1.5e24, 3, '1.5Y'],
                [1.5e25, 2, '15Y'],
                [1.5e26, 1, '150Y'],
                [1.5e26, 0, '150Y'],
                [1.5e27, 3, '1500Y'],
                [1.5e28, 2, '15000Y'],
                [1.5e+44, 5, '150000000000000000000Y'],
                [1.5e+45, 5, '1.5E+21Y'],
                [-1.5e24, 10, '-1.5Y'],
                [-1.5e24, 3, '-1.5Y'],
                [-1.5e25, 2, '-15Y'],
                [-1.5e26, 1, '-150Y'],
                [-1.5e26, 0, '-150Y'],
                [-1.5e27, 3, '-1500Y'],
                [-1.5e28, 2, '-15000Y'],
                [-1.5e+44, 5, '-150000000000000000000Y'],
                [-1.5e+45, 5, '-1.5E+21Y']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toSiNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
    });
    describe('toDecPrecisionNotation function', function () {
        it('can format special cases', function () {
            const testVector = [
                [NaN, 0, 'NaN'],
                [undefined, 0, 'undefined'],
                [null, 0, 'null'],
                [0.00, 0, '0'],
                [0.0, 3, '0'],
                [0.000, 2, '0'],
                [Infinity, 2, 'Infinity'],
                [-Infinity, 3, '-Infinity'],
                [1.2, NaN, '1.2'],
                [1.2, undefined, '1.2'],
                [-1.2, Infinity, '-1.2'],
                [-1.2, -Infinity, '-1.2'],
                [1.2, null, '1.2'],
                [NaN, NaN, 'NaN'],
                [undefined, undefined, 'undefined'],
                [null, null, 'null']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDigits = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toDecPrecisionNotation(inputValue, numberOfDigits)).toBe(expectedValue);
            });
        });
        it('can format integers', function () {
            const testVector = [
                [10, 2, '10'],
                [10, 1, '1E+1'],
                [100, 2, '1E+2'],
                [1000, 2, '1E+3'],
                [-10, 2, '-10'],
                [-100, 2, '-1E+2'],
                [0, 0, '0'],
                [0, 1, '0'],
                [0, 2, '0']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDigits = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toDecPrecisionNotation(inputValue, numberOfDigits)).toBe(expectedValue);
            });
        });
        it('can format big numbers', function () {
            const testVector = [
                [100E+21, 2, '1E+23'],
                [-100E+21, 2, '-1E+23'],
                [100E+21, 22, '1E+23'],
                [-100E+21, 22, '-1E+23']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDigits = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toDecPrecisionNotation(inputValue, numberOfDigits)).toBe(expectedValue);
            });
        });
        it('can format small numbers', function () {
            const testVector = [
                [1E-21, 2, '1E-21'],
                [-1.212E-21, 2, '-1.2E-21'],
                [-1.259E-21, 2, '-1.3E-21'],
                [-1.259E-21, 22, '-1.259E-21']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDigits = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toDecPrecisionNotation(inputValue, numberOfDigits)).toBe(expectedValue);
            });
        });
        it('can format floats', function () {
            const testVector = [
                [20.49, 2, '20'],
                [20.5, 2, '21'],
                [20.51, 2, '21'],
                [1100.5, 1, '1E+3'],
                [1100.5, 2, '1.1E+3'],
                [1100.5, 3, '1.1E+3'],
                [1100.5, 4, '1101'],
                [1100.5, 5, '1100.5'],
                [1100.5, 6, '1100.5'],
                [1500.0, 1, '2E+3']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDigits = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toDecPrecisionNotation(inputValue, numberOfDigits)).toBe(expectedValue);
            });
        });
    });
    describe('toDecFixedNotation function', function () {
        it('can format special cases', function () {
            const testVector = [
                [NaN, 0, 'NaN'],
                [undefined, 0, 'undefined'],
                [null, 0, 'null'],
                [0.00, 0, '0'],
                [0, 3, '0.000'],
                [0.000, 2, '0.00'],
                [Infinity, 2, 'Infinity'],
                [-Infinity, 3, '-Infinity'],
                [1.2, NaN, '1'],
                [1.2, undefined, '1'],
                [-1.5, Infinity, '-2'],
                [-1.2, -Infinity, '-1'],
                [1.5, null, '2'],
                [NaN, NaN, 'NaN'],
                [undefined, undefined, 'undefined'],
                [null, null, 'null']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toDecFixedNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format integers', function () {
            const testVector = [
                [10, 0, '10'],
                [10, 1, '10.0'],
                [10, 2, '10.00'],
                [1000, 2, '1000.00'],
                [0, 1, '0.0'],
                [0, 2, '0.00']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toDecFixedNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format big numbers', function () {
            const testVector = [
                [100E+21, 0, '1E+23'],
                [100E+2, 2, '10000.00'],
                [100E+2, 20, '10000.00000000000000000000'],
                [100E+2, 21, '10000'],
                [-100E+21, 0, '-1E+23'],
                [-100E+2, 2, '-10000.00'],
                [-100E+2, 20, '-10000.00000000000000000000'],
                [-100E+2, 21, '-10000']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toDecFixedNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format small numbers', function () {
            const testVector = [
                [1.259E-21, 2, '0.00'],
                [1.259E-21, 21, '0'],
                [1.2E-20, 20, '0.00000000000000000001'],
                [1.5E-20, 20, '0.00000000000000000002'],
                [-1.259E-21, 2, '-0.00'],
                [-1.259E-21, 21, '-0'],
                [-1.2E-20, 20, '-0.00000000000000000001'],
                [-1.5E-20, 20, '-0.00000000000000000002']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toDecFixedNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
        it('can format floats', function () {
            const testVector = [
                [20.49, 0, '20'],
                [20.55, 0, '21'],
                [20.55, 1, '20.6'],
                [20.49, 2, '20.49'],
                [20.5, 2, '20.50'],
                [20.55, 21, '21'],
                [-20.49, 0, '-20'],
                [-20.55, 0, '-21'],
                [-20.55, 1, '-20.6'],
                [-20.49, 2, '-20.49'],
                [-20.5, 2, '-20.50'],
                [-20.55, 21, '-21']
            ];
            testVector.forEach(function (t) {
                const inputValue = t[0], numberOfDecimals = t[1], expectedValue = t[2];
                expect(niNumericFormatters.prototype.toDecFixedNotation(inputValue, numberOfDecimals)).toBe(expectedValue);
            });
        });
    });
});
//# sourceMappingURL=niNumericFormatters.Test.js.map