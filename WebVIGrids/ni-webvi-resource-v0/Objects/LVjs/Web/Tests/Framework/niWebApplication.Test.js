//******************************************
// Tests for Web Application
// National Instruments Copyright 2014
//******************************************
import { LocalUpdateService } from '../../Framework/niLocalUpdateService.js';
import { VIReferenceService as viReferenceService } from '../../Framework/niVIReferenceService.js';
describe('A web application (#FailsCSP)', function () {
    'use strict';
    const SERVICE_STATE_ENUM = LocalUpdateService.StateEnum;
    const wasmPath = window.testHelpers.getWasmPath();
    const createWebAppLocalUpdateHelper = function (webAppElement) {
        const waitForServiceState = function (waitingState, callback) {
            webAppElement.addEventListener('service-state-changed', function runningListener(evt) {
                if (evt.detail.serviceState === waitingState) {
                    webAppElement.removeEventListener('service-state-changed', runningListener);
                    callback();
                }
            });
        };
        const attachAndWaitForFinish = function (callback) {
            waitForServiceState(SERVICE_STATE_ENUM.RUNNING, function () {
                waitForServiceState(SERVICE_STATE_ENUM.READY, function () {
                    callback();
                });
            });
            document.body.appendChild(webAppElement);
        };
        const cleanup = function () {
            document.body.removeChild(webAppElement);
        };
        return {
            attachAndWaitForFinish: attachAndWaitForFinish,
            cleanup: cleanup
        };
    };
    describe('configured for local updates with simple via text', function () {
        let webAppElement;
        beforeEach(function () {
            webAppElement = document.createElement('ni-web-application');
            webAppElement.vireoSource = 'data:text/plain,' + encodeURI('start( VI<( clump( ) ) > )');
            webAppElement.engine = 'VIREO';
            webAppElement.location = 'BROWSER';
            webAppElement.wasmUrl = wasmPath;
            webAppElement.appendChild(document.createElement('ni-virtual-instrument'));
        });
        afterEach(function () {
            webAppElement = undefined;
        });
        describe('with unspecified vireo total memory', function () {
            let webAppLocalUpdateHelper;
            beforeEach(function (done) {
                webAppLocalUpdateHelper = createWebAppLocalUpdateHelper(webAppElement);
                webAppLocalUpdateHelper.attachAndWaitForFinish(done);
            });
            afterEach(function () {
                webAppLocalUpdateHelper.cleanup();
                webAppLocalUpdateHelper = undefined;
            });
            it('creates vireo with default memory', function () {
                expect(webAppElement).toBeDefined();
                const vireo = viReferenceService.getWebAppModelByVIRef('').updateService.vireo;
                const actualVireoMemory = vireo.eggShell.internal_module_do_not_use_or_you_will_be_fired.HEAP8.length;
                expect(actualVireoMemory).toBe(16 * 1024 * 1024);
            });
        });
        describe('with a specified vireo total memory', function () {
            let webAppLocalUpdateHelper;
            beforeEach(function (done) {
                webAppElement.vireoTotalMemory = (64 * 1024 * 1024).toString();
                webAppLocalUpdateHelper = createWebAppLocalUpdateHelper(webAppElement);
                webAppLocalUpdateHelper.attachAndWaitForFinish(done);
            });
            afterEach(function () {
                webAppLocalUpdateHelper.cleanup();
                webAppLocalUpdateHelper = undefined;
            });
            it('ignores that new value vireo with that total memory', function () {
                expect(webAppElement).toBeDefined();
                const vireo = viReferenceService.getWebAppModelByVIRef('').updateService.vireo;
                const actualVireoMemory = vireo.eggShell.internal_module_do_not_use_or_you_will_be_fired.HEAP8.length;
                expect(actualVireoMemory).toBe(16 * 1024 * 1024);
            });
        });
    });
});
//# sourceMappingURL=niWebApplication.Test.js.map