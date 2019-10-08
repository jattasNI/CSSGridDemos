"use strict";
(function () {
    'use strict';
    const VIREO_PEEKER = NationalInstruments.HtmlVI.VireoPeeker;
    const viName = '_%46unction%2Egvi', viaFilePath = '/Fixtures/VIA/peekpokestringarray.viat';
    const createBenchmarkOptions = function (template) {
        return {
            onStart: function () {
                const viaCode = window.testHelpers.fetchViaTemplate(viaFilePath, template);
                this.vireo = window.testHelpers.createVireoAndRunVia(viaCode);
            }
        };
    };
    const peekArrayTest = function () {
        VIREO_PEEKER.peek(this.vireo, viName, 'dataItem_Array');
    };
    suite('Peek performance for String arrays', function () {
        benchmark('String Size: 10, Array Size: 10', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 10, ARRAY_SIZE: 10 }));
        benchmark('String Size: 10, Array Size: 100', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 10, ARRAY_SIZE: 100 }));
        benchmark('String Size: 10, Array Size: 1000', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 10, ARRAY_SIZE: 1000 }));
        benchmark('String Size: 10, Array Size: 10000', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 10, ARRAY_SIZE: 10000 }));
        // // Vireo runs out of memory with this.
        xbenchmark('String Size: 10, Array Size: 100000', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 10, ARRAY_SIZE: 100000 }));
        benchmark('String Size: 100, Array Size: 10', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 100, ARRAY_SIZE: 10 }));
        benchmark('String Size: 100, Array Size: 100', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 100, ARRAY_SIZE: 100 }));
        benchmark('String Size: 100, Array Size: 1000', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 100, ARRAY_SIZE: 1000 }));
        benchmark('String Size: 100, Array Size: 10000', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 100, ARRAY_SIZE: 10000 }));
        // // Vireo Runs out of memory with this
        xbenchmark('String Size: 100, Array Size: 100000', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 100, ARRAY_SIZE: 100000 }));
        benchmark('String Size: 1000, Array Size: 10', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 1000, ARRAY_SIZE: 10 }));
        benchmark('String Size: 1000, Array Size: 100', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 1000, ARRAY_SIZE: 100 }));
        benchmark('String Size: 1000, Array Size: 1000', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 1000, ARRAY_SIZE: 1000 }));
        // // Vireo Runs out of memory with this
        xbenchmark('String Size: 1000, Array Size: 10000', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 1000, ARRAY_SIZE: 10000 }));
        // // Vireo Runs out of memory with this
        xbenchmark('String Size: 1000, Array Size: 100000', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 1000, ARRAY_SIZE: 100000 }));
        benchmark('String Size: 10000, Array Size: 10', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 10000, ARRAY_SIZE: 10 }));
        benchmark('String Size: 10000, Array Size: 100', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 10000, ARRAY_SIZE: 100 }));
        // // Vireo Runs out of memory with this
        xbenchmark('String Size: 10000, Array Size: 1000', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 10000, ARRAY_SIZE: 1000 }));
        // // Vireo Runs out of memory with this
        xbenchmark('String Size: 10000, Array Size: 10000', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 10000, ARRAY_SIZE: 10000 }));
        // // Vireo Runs out of memory with this
        xbenchmark('String Size: 10000, Array Size: 100000', peekArrayTest, createBenchmarkOptions({ STRING_SIZE: 10000, ARRAY_SIZE: 100000 }));
    });
}());
//# sourceMappingURL=peekStringArrayTest.js.map