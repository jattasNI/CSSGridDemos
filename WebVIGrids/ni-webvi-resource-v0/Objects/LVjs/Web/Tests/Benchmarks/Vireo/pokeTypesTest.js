"use strict";
(function () {
    'use strict';
    const VIREO_POKER = NationalInstruments.HtmlVI.VireoPoker;
    const viName = '_%46unction%2Egvi', viaFilePath = '/Fixtures/VIA/peekpoketypes.via';
    const createPokeValueTest = function (valuePath, value) {
        return function pokeValueTest() {
            VIREO_POKER.poke(this.vireo, viName, valuePath, value);
        };
    };
    const createBenchmarkOptions = function () {
        return {
            onStart: function () {
                const viaCode = testHelpers.fetchFixture(viaFilePath);
                this.vireo = testHelpers.createVireoAndRunVia(viaCode);
            }
        };
    };
    suite('Poke performance for types', function () {
        benchmark('Type String', createPokeValueTest('dataItem_StringIn', 'Hello World'), createBenchmarkOptions());
        benchmark('Type Number (Double)', createPokeValueTest('dataItem_NumericDoubleIn', 3.1416), createBenchmarkOptions());
        benchmark('Type Number (i32)', createPokeValueTest('dataItem_Numeric32In', 42), createBenchmarkOptions());
        benchmark('Type Number (i64)', createPokeValueTest('dataItem_Numeric64In', '42000000000'), createBenchmarkOptions());
        benchmark('Type Complex (Double)', createPokeValueTest('dataItem_ComplexIn', '10 + 15i'), createBenchmarkOptions());
        benchmark('Type Boolean', createPokeValueTest('dataItem_BooleanIn', true), createBenchmarkOptions());
        benchmark('Type Timestamp', createPokeValueTest('dataItem_TimestampIn', '3564057536:7811758927381448193'), createBenchmarkOptions());
    });
}());
//# sourceMappingURL=pokeTypesTest.js.map