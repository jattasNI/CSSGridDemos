import { LocalUpdateService } from '../../Framework/niLocalUpdateService.js';
window.testHelpers = window.testHelpers || {};
window.testHelpers.createWebAppLocalExecutionTestHelper = function () {
    'use strict';
    const SERVICE_STATE = LocalUpdateService.StateEnum;
    const webAppHelper = window.testHelpers.createLocalWebAppTestHelper();
    const setupAndWaitForStop = function (testConfig, done, callback) {
        const viName = testConfig.viName;
        const htmlFixturePath = testConfig.htmlFixturePath;
        const viaCodePath = testConfig.viaCodePath;
        let webAppModel, vireo;
        webAppHelper.setupWebApp(viName, viaCodePath, htmlFixturePath);
        webAppHelper.onWebAppState(SERVICE_STATE.READY, function () {
            // Done downloading via code.
            webAppModel = webAppHelper.getWebAppModel();
            vireo = webAppHelper.getVireoInstance();
        });
        webAppHelper.onWebAppState(SERVICE_STATE.READY, function () {
            // Finish running
            callback(webAppModel, vireo);
            webAppHelper.cleanupWebApp(done);
        });
        webAppHelper.runTest();
    };
    const setupAndWaitForRunningAndStop = function (testConfig, done, runningCallback, completeCallback) {
        const viName = testConfig.viName;
        const htmlFixturePath = testConfig.htmlFixturePath;
        const viaCodePath = testConfig.viaCodePath;
        let webAppModel, vireo;
        webAppHelper.setupWebApp(viName, viaCodePath, htmlFixturePath);
        webAppHelper.onWebAppState(SERVICE_STATE.READY, function () {
            // Done downloading via code.
            webAppModel = webAppHelper.getWebAppModel();
            vireo = webAppHelper.getVireoInstance();
        });
        webAppHelper.onWebAppState(SERVICE_STATE.RUNNING, function () {
            // In running state.
            runningCallback(webAppModel, vireo);
        });
        webAppHelper.onWebAppState(SERVICE_STATE.READY, function () {
            // Finished running.
            completeCallback(webAppModel, vireo);
            webAppHelper.cleanupWebApp(done);
        });
        webAppHelper.runTest();
    };
    return {
        setupAndWaitForStop: setupAndWaitForStop,
        setupAndWaitForRunningAndStop: setupAndWaitForRunningAndStop
    };
};
//# sourceMappingURL=webAppLocalExecutionTestHelper.js.map