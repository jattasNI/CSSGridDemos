"use strict";
(function () {
    'use strict';
    const VIREO_PEEKER = NationalInstruments.HtmlVI.VireoPeeker;
    const VIREO_POKER = NationalInstruments.HtmlVI.VireoPoker;
    const Vireo = NationalInstruments.Vireo.Vireo;
    const viName = '_Function%2Egviweb', viaFilePath = '/Fixtures/VIA/peekpokeWaveform.via';
    const createBenchmarkOptions = function (arraySizeY) {
        return {
            onStart: function () {
                const viaText = testHelpers.fetchFixture(viaFilePath);
                this.vireo = new Vireo();
                this.vireo.eggShell.loadVia(viaText);
                VIREO_POKER.poke(this.vireo, viName, 'dataItem_ArraySize', arraySizeY);
                while (this.vireo.eggShell.executeSlicesUntilWait(1000000) !== 0) {
                    // Run Vireo synchronously
                }
            }
        };
    };
    const waveformPeekTest = function () {
        VIREO_PEEKER.peek(this.vireo, viName, 'dataItem_OutputWaveform');
    };
    suite('Peek performance for Waveform', function () {
        benchmark('Waveform Y Size: 10', waveformPeekTest, createBenchmarkOptions(10));
        benchmark('Waveform Y Size: 100', waveformPeekTest, createBenchmarkOptions(100));
        benchmark('Waveform Y Size: 1000', waveformPeekTest, createBenchmarkOptions(1000));
        benchmark('Waveform Y Size: 10000', waveformPeekTest, createBenchmarkOptions(10000));
        benchmark('Waveform Y Size: 100000', waveformPeekTest, createBenchmarkOptions(100000));
    });
}());
//# sourceMappingURL=peekWaveformTest.js.map