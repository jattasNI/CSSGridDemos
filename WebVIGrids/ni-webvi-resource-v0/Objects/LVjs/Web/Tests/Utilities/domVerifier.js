"use strict";
(function () {
    'use strict';
    window.testHelpers = window.testHelpers || {};
    window.testHelpers.createDomVerifier = function (testName) {
        let originalStats;
        // The selectors should all be top level in the DOM relative to eachother
        // i.e. No elements should be shared between the selectors to exclude
        const selectorsToExclude = Object.freeze({
            karmaReportFilter: '.html-reporter *',
            chutzpahSymbolsFilter: '.jasmine-symbol-summary *',
            chutzpahAlertsFilter: '.jasmine-alert *',
            chutzpahResultsFilter: '.jasmine-results *'
        });
        const extraStats = Object.freeze({
            head: 'head *',
            body: 'body *',
            rawTotal: '*'
        });
        if (typeof testName !== 'string') {
            throw new Error('Must provide a testname to dom verifier for logging purposes');
        }
        const calculateStats = function () {
            const stats = {};
            Object.keys(extraStats).forEach(function (selectorName) {
                const count = document.querySelectorAll(extraStats[selectorName]).length;
                stats[selectorName] = count;
            });
            const removalCounts = Object.keys(selectorsToExclude).map(function (selectorName) {
                const count = document.querySelectorAll(selectorsToExclude[selectorName]).length;
                stats[selectorName] = count;
                return count;
            });
            const totalToRemove = removalCounts.reduce(function (a, b) {
                return a + b;
            });
            stats.numFilteredFromRawTotal = totalToRemove;
            stats.filteredTotal = stats.rawTotal - stats.numFilteredFromRawTotal;
            return stats;
        };
        const captureDomState = function () {
            originalStats = calculateStats();
        };
        // verifyDomState is frequently used in afterAll blocks and afterAll blocks cannot cause a test fail
        // so instead verifyDomState logs the result instead of returning or asserting an expect
        // Which means users are expected to check logs for error messages
        const verifyDomState = function () {
            const currentStats = calculateStats();
            if (originalStats.filteredTotal !== currentStats.filteredTotal) {
                console.error('The state of the DOM is not the same before (' + originalStats.filteredTotal + ' elements) and after (' + currentStats.filteredTotal + ' elements) running test: ' + testName);
                console.error('DOM Stats before: ', originalStats);
                console.error('DOM Stats after: ', currentStats);
            }
        };
        return {
            captureDomState: captureDomState,
            verifyDomState: verifyDomState
        };
    };
})();
//# sourceMappingURL=domVerifier.js.map