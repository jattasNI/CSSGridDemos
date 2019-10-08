"use strict";
(function () {
    'use strict';
    const VIREO_PEEKER = NationalInstruments.HtmlVI.VireoPeeker;
    const peekArrayTest = function () {
        VIREO_PEEKER.peek(this.vireo, '_%46unction%2Egvi', 'dataItem_Array');
    };
    const createBenchmarkOptions = function (viaFilePath, arraySize) {
        return {
            onStart: function () {
                const viaCode = window.testHelpers.fetchViaTemplate(viaFilePath, { ARRAY_SIZE: arraySize });
                this.vireo = window.testHelpers.createVireoAndRunVia(viaCode);
            }
        };
    };
    const testList = [
        10,
        100,
        1000,
        10000,
        100000
    ];
    testList.forEach(function (arraySize) {
        suite('Peek performance for arrays of size ' + arraySize, function () {
            benchmark('Booleans', peekArrayTest, createBenchmarkOptions('/Fixtures/VIA/peekpokebooleanarray.viat', arraySize));
            benchmark('Complex (Double)', peekArrayTest, createBenchmarkOptions('/Fixtures/VIA/peekpokecomplexarray.viat', arraySize));
            benchmark('Numeric (Double)', peekArrayTest, createBenchmarkOptions('/Fixtures/VIA/peekpokenumericdoublearray.viat', arraySize));
            benchmark('Numeric (i32)', peekArrayTest, createBenchmarkOptions('/Fixtures/VIA/peekpokenumerici32array.viat', arraySize));
            benchmark('Numeric (i64)', peekArrayTest, createBenchmarkOptions('/Fixtures/VIA/peekpokenumerici64array.viat', arraySize));
            benchmark('Timestamp', peekArrayTest, createBenchmarkOptions('/Fixtures/VIA/peekpoketimestamparray.viat', arraySize));
        });
    });
}());
//# sourceMappingURL=peekScalarArrayTest.js.map