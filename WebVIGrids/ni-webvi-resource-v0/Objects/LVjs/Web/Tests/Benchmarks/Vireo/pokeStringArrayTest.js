"use strict";
(function () {
    'use strict';
    const VIREO_PEEKER = NationalInstruments.HtmlVI.VireoPeeker;
    const VIREO_POKER = NationalInstruments.HtmlVI.VireoPoker;
    const viName = '_%46unction%2Egvi', viaFilePath = '/Fixtures/VIA/peekpokestringarray.viat';
    const pokeArrayTest = function () {
        VIREO_POKER.poke(this.vireo, viName, 'dataItem_Array', this.dataArray);
    };
    const createBenchmarkOptions = function (stringSize, arraySize) {
        return {
            onStart: function () {
                const viaCode = testHelpers.fetchViaTemplate(viaFilePath, { STRING_SIZE: stringSize, ARRAY_SIZE: arraySize });
                this.vireo = testHelpers.createVireoAndRunVia(viaCode);
                this.dataArray = VIREO_PEEKER.peek(this.vireo, viName, 'dataItem_Array');
            }
        };
    };
    suite('Poke performance for String arrays', function () {
        benchmark('String Size: 10, Array Size: 10', pokeArrayTest, createBenchmarkOptions(10, 10));
        benchmark('String Size: 10, Array Size: 100', pokeArrayTest, createBenchmarkOptions(10, 100));
        benchmark('String Size: 10, Array Size: 1000', pokeArrayTest, createBenchmarkOptions(10, 1000));
        benchmark('String Size: 10, Array Size: 10000', pokeArrayTest, createBenchmarkOptions(10, 10000));
        // // Vireo Cannot enlarge memory arrays.
        xbenchmark('String Size: 10, Array Size: 100000', pokeArrayTest, createBenchmarkOptions(10, 100000));
        benchmark('String Size: 100, Array Size: 10', pokeArrayTest, createBenchmarkOptions(100, 10));
        benchmark('String Size: 100, Array Size: 100', pokeArrayTest, createBenchmarkOptions(100, 100));
        benchmark('String Size: 100, Array Size: 1000', pokeArrayTest, createBenchmarkOptions(100, 1000));
        benchmark('String Size: 100, Array Size: 10000', pokeArrayTest, createBenchmarkOptions(100, 10000));
        // // Vireo Cannot enlarge memory arrays.
        xbenchmark('String Size: 100, Array Size: 100000', pokeArrayTest, createBenchmarkOptions(100, 100000));
        benchmark('String Size: 1000, Array Size: 10', pokeArrayTest, createBenchmarkOptions(1000, 10));
        benchmark('String Size: 1000, Array Size: 100', pokeArrayTest, createBenchmarkOptions(1000, 100));
        benchmark('String Size: 1000, Array Size: 1000', pokeArrayTest, createBenchmarkOptions(1000, 1000));
        // // Vireo Cannot enlarge memory arrays.
        xbenchmark('String Size: 1000, Array Size: 10000', pokeArrayTest, createBenchmarkOptions(1000, 10000));
        // // Vireo Cannot enlarge memory arrays.
        xbenchmark('String Size: 1000, Array Size: 100000', pokeArrayTest, createBenchmarkOptions(1000, 100000));
        benchmark('String Size: 10000, Array Size: 10', pokeArrayTest, createBenchmarkOptions(10000, 10));
        benchmark('String Size: 10000, Array Size: 100', pokeArrayTest, createBenchmarkOptions(10000, 100));
        // // Vireo Cannot enlarge memory arrays.
        xbenchmark('String Size: 10000, Array Size: 1000', pokeArrayTest, createBenchmarkOptions(10000, 1000));
        // // Vireo Cannot enlarge memory arrays.
        xbenchmark('String Size: 10000, Array Size: 10000', pokeArrayTest, createBenchmarkOptions(10000, 10000));
        // // Vireo Cannot enlarge memory arrays.
        xbenchmark('String Size: 10000, Array Size: 100000', pokeArrayTest, createBenchmarkOptions(10000, 100000));
    });
}());
//# sourceMappingURL=pokeStringArrayTest.js.map