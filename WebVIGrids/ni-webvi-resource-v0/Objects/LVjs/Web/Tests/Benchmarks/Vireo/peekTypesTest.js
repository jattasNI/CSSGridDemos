"use strict";
(function () {
    'use strict';
    const viName = '_%46unction%2Egvi', viaCodePath = '/Fixtures/VIA/peekpoketypes.via';
    const VIREO_PEEKER = NationalInstruments.HtmlVI.VireoPeeker;
    const createPeekValueTest = function (valuePath) {
        return function peekValueTest() {
            VIREO_PEEKER.peek(this.vireo, viName, valuePath);
        };
    };
    const createBenchmarkOptions = function () {
        return {
            onStart: function () {
                const viaCode = testHelpers.fetchFixture(viaCodePath);
                this.vireo = testHelpers.createVireoAndRunVia(viaCode);
            }
        };
    };
    suite('Peek performance for various types', function () {
        benchmark('Type String', createPeekValueTest('dataItem_StringIn'), createBenchmarkOptions());
        benchmark('Type Numeric (Double)', createPeekValueTest('dataItem_NumericDoubleOut'), createBenchmarkOptions());
        benchmark('Type Numeric (i32)', createPeekValueTest('dataItem_Numeric32Out'), createBenchmarkOptions());
        benchmark('Type Numeric (i64)', createPeekValueTest('dataItem_Numeric64Out'), createBenchmarkOptions());
        benchmark('Type Complex (Double)', createPeekValueTest('dataItem_ComplexIn'), createBenchmarkOptions());
        benchmark('Type Boolean', createPeekValueTest('dataItem_BooleanOut'), createBenchmarkOptions());
        benchmark('Type Time stamp', createPeekValueTest('dataItem_TimestampOut'), createBenchmarkOptions());
    });
}());
//# sourceMappingURL=peekTypesTest.js.map