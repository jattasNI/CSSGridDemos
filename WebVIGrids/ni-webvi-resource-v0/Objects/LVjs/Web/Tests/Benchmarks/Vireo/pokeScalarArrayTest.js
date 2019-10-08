"use strict";
(function () {
    'use strict';
    const VIREO_POKER = NationalInstruments.HtmlVI.VireoPoker;
    const pokeArrayTest = function () {
        VIREO_POKER.poke(this.vireo, '_%46unction%2Egvi', 'dataItem_Array', this.dataArray);
    };
    const createBenchmarkOptions = function (viaFilePath, arraySize, generateArray) {
        return {
            onStart: function () {
                const viaCode = testHelpers.fetchViaTemplate(viaFilePath, { ARRAY_SIZE: arraySize });
                this.vireo = window.testHelpers.createVireoAndRunVia(viaCode);
                this.dataArray = generateArray(arraySize);
            }
        };
    };
    const generateArrayBoolean = function (arraySize) {
        const dataArray = [];
        let value = false;
        while (arraySize-- > 0) {
            value = Math.random() > 0.5;
            dataArray.push(value);
        }
        return dataArray;
    };
    const generateArrayComplex = function (arraySize) {
        const dataArray = [];
        let value = false;
        while (arraySize-- > 0) {
            value = Math.random() + ' + ' + Math.random() + 'i';
            dataArray.push(value);
        }
        return dataArray;
    };
    const generateArrayNumericDouble = function (arraySize) {
        const dataArray = [];
        let value = false;
        while (arraySize-- > 0) {
            value = Math.random();
            dataArray.push(value);
        }
        return dataArray;
    };
    const generateArrayNumericI32 = function (arraySize) {
        const dataArray = [];
        let value = false;
        while (arraySize-- > 0) {
            value = Math.floor(Math.random() * 2147483647);
            dataArray.push(value);
        }
        return dataArray;
    };
    const generateArrayNumericI64 = function (arraySize) {
        const dataArray = [];
        let value = false;
        while (arraySize-- > 0) {
            value = '' + (Math.random() * 2147483647);
            dataArray.push(value);
        }
        return dataArray;
    };
    const generateArrayTimestamp = function (arraySize) {
        const dataArray = [];
        let value = false;
        while (arraySize-- > 0) {
            value = '3564393516:10919439473967926821';
            dataArray.push(value);
        }
        return dataArray;
    };
    const testList = [
        10,
        100,
        1000,
        10000,
        100000
    ];
    testList.forEach(function (arraySize) {
        suite('Poke performance for arrays of size ' + arraySize, function () {
            benchmark('Booleans', pokeArrayTest, createBenchmarkOptions('/Fixtures/VIA/peekpokebooleanarray.viat', arraySize, generateArrayBoolean));
            benchmark('Complex (Double)', pokeArrayTest, createBenchmarkOptions('/Fixtures/VIA/peekpokecomplexarray.viat', arraySize, generateArrayComplex));
            benchmark('Numeric (Double)', pokeArrayTest, createBenchmarkOptions('/Fixtures/VIA/peekpokenumericdoublearray.viat', arraySize, generateArrayNumericDouble));
            benchmark('Numeric (i32)', pokeArrayTest, createBenchmarkOptions('/Fixtures/VIA/peekpokenumerici32array.viat', arraySize, generateArrayNumericI32));
            benchmark('Numeric (i64)', pokeArrayTest, createBenchmarkOptions('/Fixtures/VIA/peekpokenumerici64array.viat', arraySize, generateArrayNumericI64));
            benchmark('Timestamp', pokeArrayTest, createBenchmarkOptions('/Fixtures/VIA/peekpoketimestamparray.viat', arraySize, generateArrayTimestamp));
        });
    });
}());
//# sourceMappingURL=pokeScalarArrayTest.js.map