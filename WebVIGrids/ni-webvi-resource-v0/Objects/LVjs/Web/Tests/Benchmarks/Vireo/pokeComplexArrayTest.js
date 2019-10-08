"use strict";
(function () {
    'use strict';
    const VIREO_POKER = NationalInstruments.HtmlVI.VireoPoker;
    const viName = '_%46unction%2Egvi', viaFilePath = '/Fixtures/VIA/peekpokecomplexarray.viat';
    const generateArray = function (arraySize) {
        const dataArray = [];
        let value = false;
        while (arraySize-- > 0) {
            value = Math.random() + ' + ' + Math.random() + 'i';
            dataArray.push(value);
        }
        return dataArray;
    };
    const createBenchmarkOptions = function (arraySize) {
        return {
            onStart: function () {
                const viaCode = testHelpers.fetchViaTemplate(viaFilePath, { ARRAY_SIZE: arraySize });
                this.vireo = window.testHelpers.createVireoAndRunVia(viaCode);
                this.dataArray = generateArray(arraySize);
            }
        };
    };
    const pokeArrayTest = function () {
        VIREO_POKER.poke(this.vireo, viName, 'dataItem_Array', this.dataArray);
    };
    suite('Poke performance for Complex (Double) arrays', function () {
        benchmark('Array Size: 10', pokeArrayTest, createBenchmarkOptions(10));
        benchmark('Array Size: 100', pokeArrayTest, createBenchmarkOptions(100));
        benchmark('Array Size: 1000', pokeArrayTest, createBenchmarkOptions(1000));
        benchmark('Array Size: 10000', pokeArrayTest, createBenchmarkOptions(10000));
        benchmark('Array Size: 100000', pokeArrayTest, createBenchmarkOptions(100000));
    });
}());
//# sourceMappingURL=pokeComplexArrayTest.js.map