import { VireoPeeker as VIREO_PEEKER } from '../../Framework/niVireoPeeker.js';
// The import path to vireoHelpers should be relative to the path under Object\LVjs\Web instead of the HtmlControls.Design\Web folder
// since thats where the product/test/rollup will use this file from.
import vireoHelpers from '../../../../../NodeApps/node_modules/@ni-private/webvi-deps/node_modules/vireo/source/core/vireo.loader.wasm32-unknown-emscripten.release.js';
describe('Boolean mechanical action (#FailsCSP)', function () {
    'use strict';
    let executionTestHelper, valueChangedSimulator;
    const staticHelpers = vireoHelpers.staticHelpers;
    const assertControlValue = function (vireo, viName, dataItemName, expectedValue) {
        const encodedViName = staticHelpers.encodeIdentifier(viName);
        const newValue = VIREO_PEEKER.peek(vireo, encodedViName, dataItemName);
        expect(newValue).toEqual(expectedValue);
    };
    const latchingTest = function (testConfig, done) {
        const runningCallback = function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const allButtonsIds = Array.from(document.querySelectorAll(testConfig.controlElementName)).map(function (btn) { return btn.getAttribute('ni-control-id'); });
            // Generate control changed events for all controls
            allButtonsIds.forEach(function (v) {
                valueChangedSimulator.simulateNewValueEvent(viModel, v, true);
            });
            // Assert that values made it to Vireo.
            document.querySelectorAll(testConfig.controlElementName).forEach(function (controlElement) {
                const bindingInfo = controlElement.bindingInfo;
                assertControlValue(vireo, testConfig.viName, bindingInfo.dataItem, true);
            });
        };
        const completeCallback = function (webAppModel, vireo) {
            document.querySelectorAll(testConfig.controlElementName).forEach(function (controlElement) {
                const bindingInfo = controlElement.bindingInfo;
                // If it is a latched boolean, its value must have changed to false after reading it
                const expectedValue = !bindingInfo.isLatched;
                assertControlValue(vireo, testConfig.viName, bindingInfo.dataItem, expectedValue);
            });
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    };
    beforeEach(function () {
        executionTestHelper = testHelpers.createWebAppLocalExecutionTestHelper();
        valueChangedSimulator = testHelpers.createValueChangedSimulator();
    });
    it('resets to false for buttons', function (done) {
        const testConfig = {
            viName: 'WebApp::Buttons.gviweb',
            htmlFixturePath: testHelpers.getPathRelativeToFixtures('BooleanMechanicalAction/Builds/App_Web/Buttons.html'),
            viaCodePath: testHelpers.getPathRelativeToFixtures('BooleanMechanicalAction/Builds/App_Web/Buttons.via.txt'),
            controlElementName: 'jqx-toggle-button'
        };
        latchingTest(testConfig, done);
    });
    it('resets to false for switches', function (done) {
        const testConfig = {
            viName: 'WebApp::Switches.gviweb',
            htmlFixturePath: testHelpers.getPathRelativeToFixtures('BooleanMechanicalAction/Builds/App_Web/Switches.html'),
            viaCodePath: testHelpers.getPathRelativeToFixtures('BooleanMechanicalAction/Builds/App_Web/Switches.via.txt'),
            controlElementName: 'jqx-switch-button'
        };
        latchingTest(testConfig, done);
    });
    it('resets to false for leds', function (done) {
        const testConfig = {
            viName: 'WebApp::LEDs.gviweb',
            htmlFixturePath: testHelpers.getPathRelativeToFixtures('BooleanMechanicalAction/Builds/App_Web/LEDs.html'),
            viaCodePath: testHelpers.getPathRelativeToFixtures('BooleanMechanicalAction/Builds/App_Web/LEDs.via.txt'),
            controlElementName: 'jqx-led'
        };
        latchingTest(testConfig, done);
    });
});
//# sourceMappingURL=BooleanMechanicalAction.Test.js.map