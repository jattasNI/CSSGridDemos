"use strict";
(function () {
    'use strict';
    const replaceAllBracesOnText = function (text, substitutions) {
        let toReplace, replaceRegex;
        if (typeof substitutions === 'object') {
            for (toReplace in substitutions) {
                if (substitutions.hasOwnProperty(toReplace)) {
                    replaceRegex = new RegExp('\\{' + toReplace + '\\}');
                    text = text.replace(replaceRegex, substitutions[toReplace]);
                }
            }
        }
        return text;
    };
    const loadFileSync = function (filePath) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', filePath, false);
        xhr.send(null);
        // PhantomJS can return status = 0, even for success, for a file URL (used by Chutzpah):
        // https://github.com/ariya/phantomjs/issues/10291#issuecomment-94994562
        const isSuccessfulPhantomJSXHRResponse = xhr.status === 0 && typeof xhr.responseText === 'string' && xhr.responseText !== '';
        if (xhr.status === 200 || isSuccessfulPhantomJSXHRResponse) {
            return xhr.responseText;
        }
        else {
            throw new Error('Could not load file at path: ' + filePath);
        }
    };
    window.testHelpers = window.testHelpers || {};
    window.testHelpers.fetchViaTemplate = function (viaCodePath, replaceOnTemplate) {
        let viaCode = loadFileSync(viaCodePath);
        viaCode = replaceAllBracesOnText(viaCode, replaceOnTemplate);
        return viaCode;
    };
    window.testHelpers.createVireoAndRunVia = function (viaCode) {
        // TODO mraj update the benchmark test helpers for the new vireo api
        // Need to find a way to support async test setup https://github.com/bestiejs/benchmark.js/pull/174
        const vireo = new NationalInstruments.Vireo.Vireo();
        vireo.eggShell.loadVia(viaCode);
        while (vireo.eggShell.executeSlicesUntilWait(1000000) !== 0) {
            // Run synchronously to completion
        }
        return vireo;
    };
}());
//# sourceMappingURL=vireoBenchUtils.js.map