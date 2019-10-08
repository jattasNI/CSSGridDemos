"use strict";
(function () {
    'use strict';
    const VIREO_POKER = NationalInstruments.HtmlVI.VireoPoker;
    const Vireo = NationalInstruments.Vireo.Vireo;
    const viName = 'videf30', viaFilePath = '/Fixtures/VIA/picalc.via', enqueueCommand = 'enqueue(videf30)';
    const createBenchmarkOptions = function (digitsOfPI, deferEnabled) {
        return {
            onStart: function () {
                const viaText = testHelpers.fetchFixture(viaFilePath);
                this.vireo = new Vireo();
                this.vireo.eggShell.loadVia(viaText);
                VIREO_POKER.poke(this.vireo, viName, 'digitsOfPI', digitsOfPI);
            },
            defer: deferEnabled
        };
    };
    const listOfTests = [
        8,
        16,
        32,
        64,
        128,
        256
    ];
    listOfTests.forEach(function (digitsOfPI) {
        suite('Calculate ' + digitsOfPI + ' digits of pi', function () {
            benchmark('running vireo synchronously', function () {
                this.vireo.eggShell.loadVia(enqueueCommand);
                while (this.vireo.eggShell.executeSlicesUntilWait(1000000) !== 0) {
                    // Run Vireo synchronously
                }
            }, createBenchmarkOptions(digitsOfPI, false));
            benchmark('running vireo asynchronously', function (deferred) {
                this.vireo.eggShell.loadVia(enqueueCommand);
                this.vireo.eggShell.executeSlicesUntilClumpsFinished(function () {
                    deferred.resolve();
                });
            }, createBenchmarkOptions(digitsOfPI, true));
        });
    });
}());
//# sourceMappingURL=piCalcPerformanceTest.js.map