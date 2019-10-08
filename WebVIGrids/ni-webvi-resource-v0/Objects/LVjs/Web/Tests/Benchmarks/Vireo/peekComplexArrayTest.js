"use strict";
(function () {
    'use strict';
    const VIREO_PEEKER = NationalInstruments.HtmlVI.VireoPeeker;
    const viName = '_%46unction%2Egvi', viaFilePath = '/Fixtures/VIA/peekpokecomplexarray.viat';
    const createBenchmarkOptions = function (arraySize) {
        return {
            onStart: function () {
                const viaCode = window.testHelpers.fetchViaTemplate(viaFilePath, { ARRAY_SIZE: arraySize });
                this.vireo = window.testHelpers.createVireoAndRunVia(viaCode);
            }
        };
    };
    const peekArrayTest = function () {
        VIREO_PEEKER.peek(this.vireo, viName, 'dataItem_Array');
    };
    suite('Peek performance for Complex (Double) arrays', function () {
        benchmark('Array Size: 10', peekArrayTest, createBenchmarkOptions(10));
        benchmark('Array Size: 100', peekArrayTest, createBenchmarkOptions(100));
        benchmark('Array Size: 1000', peekArrayTest, createBenchmarkOptions(1000));
        benchmark('Array Size: 10000', peekArrayTest, createBenchmarkOptions(10000));
        benchmark('Array Size: 100000', peekArrayTest, createBenchmarkOptions(100000));
    });
}());
//# sourceMappingURL=peekComplexArrayTest.js.map