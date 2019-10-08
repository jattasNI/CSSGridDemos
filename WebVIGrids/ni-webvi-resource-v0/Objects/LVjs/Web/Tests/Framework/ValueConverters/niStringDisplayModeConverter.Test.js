//****************************************
// G Property Tests for StringControl class
// National Instruments Copyright 2018
//****************************************
import { StringDisplayModeConverter as stringDisplayModeConverter } from '../../../Framework/ValueConverters/niStringDisplayModeConverter.js';
describe('A string display converter', function () {
    'use strict';
    [
        ["", ""],
        ["aaa", "aaa"],
        ["aaa aaa\u000c", "aaa\\saaa\\f"],
        ["aaa\\aaa\u000Aa", "aaa\\\\aaa\\na"],
        ["aaa\taaa\r", "aaa\\taaa\\r"],
        ["aaa\u0002aaa", "aaa\\02aaa"],
        ["aaa\u0018aaa", "aaa\\18aaa"],
        ["aaa\u76aaaaa", "aaa\u76aaaaa"],
        ["Iñtërnâtiônàlizætiøn☃💩😴😄😃⛔🎠🚓🚇<!-- test comment -->", "Iñtërnâtiônàlizætiøn☃💩😴😄😃⛔🎠🚓🚇<!--\\stest\\scomment\\s-->"]
    ].forEach(function (inputAndExpectedOutput) {
        it('converts and returns string in escape format from default format', function () {
            const inputString = inputAndExpectedOutput[0];
            const expectedOutputString = inputAndExpectedOutput[1];
            const actualString = stringDisplayModeConverter.toEscapedDisplayMode(inputString);
            expect(actualString).toEqual(expectedOutputString);
        });
    });
    [
        ["", ""],
        ["aaa", "aaa"],
        ["aaa\\saaa\\f", "aaa aaa\u000c"],
        ["aaa\\\\aaa\\na", "aaa\\aaa\u000Aa"],
        ["aaa\\taaa", "aaa\taaa"],
        ["aaa\\taaa\\r", "aaa\taaa\r"],
        ["aaa\\00aaa", "aaa\u0000aaa"],
        ["aaa\\20aaa", "aaa aaa"],
        ["aaa\\52aaa", "aaaRaaa"],
        ["aaa\\80aaa", "aaa?aaa"],
        ["Iñtërnâtiônàlizætiøn☃💩😴😄😃⛔🎠🚓🚇<!--\\stest\\scomment\\s-->", "Iñtërnâtiônàlizætiøn☃💩😴😄😃⛔🎠🚓🚇<!-- test comment -->"]
    ].forEach(function (inputAndExpectedOutput) {
        it('converts and returns string in default format from escape format', function () {
            const inputString = inputAndExpectedOutput[0];
            const expectedOutputString = inputAndExpectedOutput[1];
            const actualString = stringDisplayModeConverter.toDefaultDisplayMode(inputString);
            expect(actualString).toEqual(expectedOutputString);
        });
    });
});
//# sourceMappingURL=niStringDisplayModeConverter.Test.js.map