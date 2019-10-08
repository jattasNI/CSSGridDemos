//
// For instructions on adding to this test file, please look at
// the Fixtures/ControlEvents/README.md
//
import { VireoPeeker as VIREO_PEEKER } from '../../Framework/niVireoPeeker.js';
// The import path to vireoHelpers should be relative to the path under Object\LVjs\Web instead of the HtmlControls.Design\Web folder
// since thats where the product/test/rollup will use this file from.
import vireoHelpers from '../../../../../NodeApps/node_modules/@ni-private/webvi-deps/node_modules/vireo/source/core/vireo.loader.wasm32-unknown-emscripten.release.js';
describe('Control ValueChange event integration test.', function () {
    'use strict';
    let executionTestHelper, valueChangedSimulator;
    const staticHelpers = vireoHelpers.staticHelpers;
    let originalTimeout;
    const assertIndicatorValue = function (vireo, viName, dataItemName, expectedValue) {
        const encodedViName = staticHelpers.encodeIdentifier(viName);
        const newValue = VIREO_PEEKER.peek(vireo, encodedViName, dataItemName);
        expect(newValue).toEqual(expectedValue);
    };
    const getNewValueDataItem = function (controlName) {
        return "dataItem_New_" + controlName;
    };
    const getOldValueDataItem = function (controlName) {
        return "dataItem_Old_" + controlName;
    };
    const getControlReferenceEqualsDataItem = function (controlName) {
        return "dataItem_Equals_" + controlName;
    };
    const waitForReadyDataItem = function (vireo, viName) {
        return new Promise(function (resolve) {
            const encodedViName = staticHelpers.encodeIdentifier(viName);
            (function checkReady() {
                const ready = VIREO_PEEKER.peek(vireo, encodedViName, 'dataItem_Ready');
                if (!ready) {
                    setTimeout(checkReady, 0);
                }
                else {
                    resolve();
                }
            }());
        });
    };
    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        executionTestHelper = testHelpers.createWebAppLocalExecutionTestHelper();
        valueChangedSimulator = testHelpers.createValueChangedSimulator();
    });
    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
    it('update boolean indicator on boolean control value change', function (done) {
        const testConfig = {
            viName: 'Application::UpdateBooleanOnBooleanValueChange.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/UpdateBooleanOnBooleanValueChange.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/UpdateBooleanOnBooleanValueChange.via.txt',
            controlDataItemNameToModify: 'dataItem_Input',
            outputDataItem: 'dataItem_Output'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, false);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.controlDataItemNameToModify, true);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('update boolean indicator on numeric control value change', function (done) {
        const testConfig = {
            viName: 'Application::UpdateBooleanOnNumericValueChange.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/UpdateBooleanOnNumericValueChange.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/UpdateBooleanOnNumericValueChange.via.txt',
            controlDataItemNameToModify: 'dataItem_Input',
            outputDataItem: 'dataItem_Output'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, false);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.controlDataItemNameToModify, 26);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('update boolean indicator on string control value change', function (done) {
        const testConfig = {
            viName: 'Application::UpdateBooleanOnStringValueChange.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/UpdateBooleanOnStringValueChange.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/UpdateBooleanOnStringValueChange.via.txt',
            controlDataItemNameToModify: 'dataItem_Input',
            outputDataItem: 'dataItem_Output'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, false);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.controlDataItemNameToModify, "Bar");
        };
        const completeCallback = function (webAppModel, vireo) {
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('update boolean indicator on cluster control value change', function (done) {
        const testConfig = {
            viName: 'Application::UpdateBooleanOnClusterValueChange.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/UpdateBooleanOnClusterValueChange.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/UpdateBooleanOnClusterValueChange.via.txt',
            outputDataItem: 'dataItem_Output'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, false);
            valueChangedSimulator.simulateNewAndOldValueEventFromDataItem(viModel, 'dataItem_Input', { Numeric: 10, String: 'Foo' }, { Numeric: 0, String: '' });
        };
        const completeCallback = function (webAppModel, vireo) {
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('ignore value change on control that is not registered', function (done) {
        const testConfig = {
            viName: 'Application::IgnoreValueChangeEventOnUnregisteredControl.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/IgnoreValueChangeEventOnUnregisteredControl.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/IgnoreValueChangeEventOnUnregisteredControl.via.txt',
            unregisteredControlDataItemName: 'dataItem_Unregistered',
            registeredControlDataItemName: 'dataItem_Registered',
            outputDataItem: 'dataItem_Output'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, 0);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.unregisteredControlDataItemName, 42);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.registeredControlDataItemName, 17);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, 1);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('update boolean when control is changed with an event structure listening to multiple controls of same data type', function (done) {
        const testConfig = {
            viName: 'Application::ControlsOfSameTypeRegisteredInOneCase.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/ControlsOfSameTypeRegisteredInOneCase.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/ControlsOfSameTypeRegisteredInOneCase.via.txt',
            firstControlDataItemNameToModify: 'dataItem_Input_1',
            secondControlDataItemNameToModify: 'dataItem_Input_2',
            outputDataItem: 'dataItem_Output',
            testResultDataItem: 'dataItem_TestResult'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, 0);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.firstControlDataItemNameToModify, 42);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.secondControlDataItemNameToModify, 43);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, 2);
            assertIndicatorValue(vireo, testConfig.viName, testConfig.testResultDataItem, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('shared user events with an event structure listening to multiple user events in same event case', function (done) {
        const testConfig = {
            viName: 'Application::SharedUserEventsCase.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/SharedUserEventsCase.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/SharedUserEventsCase.via.txt',
            testResult1DataItem: 'dataItem_TestResult_1',
            testResult2DataItem: 'dataItem_TestResult_2'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertIndicatorValue(vireo, testConfig.viName, testConfig.testResult1DataItem, true);
            assertIndicatorValue(vireo, testConfig.viName, testConfig.testResult2DataItem, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    // VI contains an event structure in a loop. The loop exits once three button click events have occurred.
    it('multiple cases in event structure configured to listen to a different control each', function (done) {
        const testConfig = {
            viName: 'Application::MultipleEventOccurrencesInInfiniteLoop.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/MultipleEventOccurrencesInInfiniteLoop.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/MultipleEventOccurrencesInInfiniteLoop.via.txt',
            outputDataItem1: 'dataItem_Output_1',
            outputDataItem2: 'dataItem_Output_2',
            outputDataItem3: 'dataItem_Output_3'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem1, '');
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem2, '');
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem3, '');
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, 'dataItem_Button_1', true);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, 'dataItem_Button_2', true);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, 'dataItem_Button_3', true);
            // three button click event occurrences should have terminated the VI.
        };
        const completeCallback = function (webAppModel, vireo) {
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem1, 'Button_1');
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem2, 'Button_2');
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem3, 'Button_3');
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    // VI which terminates after 10 value change events on specified control
    it('ensure all events are handled on multiple value changes on same control', function (done) {
        const testConfig = {
            viName: 'Application::EventOccurrenceCounter.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/EventOccurrenceCounter.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/EventOccurrenceCounter.via.txt',
            controlToModify: 'dataItem_Input',
            numberOfValueChangesToTrigger: 10,
            outputDataItem: 'dataItem_Output'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            for (let i = 0; i < testConfig.numberOfValueChangesToTrigger; i++) {
                valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.controlToModify, 42);
            }
            // 10 value change occurrences should have terminated the VI.
        };
        const completeCallback = function (webAppModel, vireo) {
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, 10);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    const assertOldNewAndEqualsDataItemValues = function (vireo, viName, controlName, expectedOldDataItemValue, expectedNewDataItemValue, expectedEqualityDataItemValue) {
        assertIndicatorValue(vireo, viName, getOldValueDataItem(controlName), expectedOldDataItemValue);
        assertIndicatorValue(vireo, viName, getNewValueDataItem(controlName), expectedNewDataItemValue);
        assertIndicatorValue(vireo, viName, getControlReferenceEqualsDataItem(controlName), expectedEqualityDataItemValue);
    };
    it('verify old, new values and control reference for tab control', function (done) {
        const testConfig = {
            viName: 'Application::TabControl.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/TabControl.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/TabControl.via.txt',
            controlToModify: 'dataItem_Tab',
            controlName: 'Tab'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.controlName, 0, 0, false);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.controlToModify, 1);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.controlName, 0, 1, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('verify old, new values and control reference for gauge control', function (done) {
        const testConfig = {
            viName: 'Application::Gauge.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/Gauge.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/Gauge.via.txt',
            controlToModify: 'dataItem_Gauge',
            controlName: 'Gauge'
        };
        const newValue = 5.678;
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.controlName, 0, 0, false);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.controlToModify, newValue);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.controlName, 0, newValue, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('verify old, new values and control reference for datagrid control', function (done) {
        const testConfig = {
            viName: 'Application::DataGrid.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/DataGrid.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/DataGrid.via.txt',
            controlToModify: 'dataItem_DataGrid',
            controlName: 'DataGrid'
        };
        const defaultValue = [];
        const newValue = [{ String: 'Foo', Numeric: 5, Checkbox: false, LED: true, Slider: 5, Progress: 6, Dropdown: 0 }];
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.controlName, defaultValue, defaultValue, false);
            valueChangedSimulator.simulateNewAndOldValueEventFromDataItem(viModel, testConfig.controlToModify, newValue, defaultValue);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.controlName, defaultValue, newValue, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('verify old, new values and control reference for timestamp control', function (done) {
        const testConfig = {
            viName: 'Application::Timestamp.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/Timestamp.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/Timestamp.via.txt',
            controlToModify: 'dataItem_Timestamp',
            controlName: 'Timestamp'
        };
        const oldDate = '0:0';
        const newDate = '2714018600:0';
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.controlName, oldDate, oldDate, false);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.controlToModify, newDate);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.controlName, oldDate, newDate, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('verify old, new values and control reference for listbox control', function (done) {
        const testConfig = {
            viName: 'Application::Listbox.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/Listbox.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/Listbox.via.txt',
            controlToModify: 'dataItem_Listbox',
            controlName: 'Listbox'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.controlName, 0, 0, false);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.controlToModify, 2);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.controlName, -1, 2, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('verify old, new values and control reference for string control', function (done) {
        const testConfig = {
            viName: 'Application::String.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/String.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/String.via.txt',
            controlToModify: 'dataItem_String',
            controlName: 'String'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.controlName, '', '', false);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.controlToModify, 'Foo');
        };
        const completeCallback = function (webAppModel, vireo) {
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.controlName, '', 'Foo', true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('verify old, new values and control reference for boolean control', function (done) {
        const testConfig = {
            viName: 'Application::BooleanControls.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/BooleanControls.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/BooleanControls.via.txt',
            ledDataItemName: 'dataItem_LED',
            ledName: 'LED',
            buttonDataItemName: 'dataItem_Button',
            buttonName: 'Button',
            stopDataItemName: 'dataItem_Stop',
            stopName: 'Stop',
            powerbuttonDataItemName: 'dataItem_PowerButton',
            powerButtonName: 'PowerButton',
            verticalSwitchDataItemName: 'dataItem_VerticalSwitch',
            verticalSwitchName: 'VerticalSwitch',
            horizontalSwitchDataItemName: 'dataItem_HorizontalSwitch',
            horizontalSwitchName: 'HorizontalSwitch',
            checkboxDataItemName: 'dataItem_Checkbox',
            checkboxName: 'Checkbox'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.ledName, false, false, false);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.buttonName, false, false, false);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.stopName, false, false, false);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.powerButtonName, false, false, false);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.verticalSwitchName, false, false, false);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.horizontalSwitchName, false, false, false);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.checkboxName, false, false, false);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.ledDataItemName, true);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.buttonDataItemName, true);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.stopDataItemName, true);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.powerbuttonDataItemName, true);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.verticalSwitchDataItemName, true);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.horizontalSwitchDataItemName, true);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.checkboxDataItemName, true);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.ledName, false, true, true);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.buttonName, false, true, true);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.stopName, false, true, true);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.powerButtonName, false, true, true);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.verticalSwitchName, false, true, true);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.horizontalSwitchName, false, true, true);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.checkboxName, false, true, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('verify old, new values and control reference for numeric control', function (done) {
        const testConfig = {
            viName: 'Application::Numerics.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/Numerics.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/Numerics.via.txt',
            controlToModify: 'dataItem_Numeric',
            controlName: 'Numeric'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.controlName, 0, 0, false);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.controlToModify, 42);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.controlName, 0, 42, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('verify old, new values and control reference for dropdown control', function (done) {
        const testConfig = {
            viName: 'Application::Dropdown.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/Dropdown.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/Dropdown.via.txt',
            ringDataItemName: 'dataItem_Ring',
            enumDataItemName: 'dataItem_Enum',
            radioDataItemName: 'dataItem_Radio',
            enumName: 'Enum',
            ringName: 'Ring',
            radioName: 'Radio'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.enumName, 0, 0, false);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.ringName, 0, 0, false);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.radioName, 0, 0, false);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.enumDataItemName, 2);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.ringDataItemName, 2);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.radioDataItemName, 1);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.enumName, 0, 2, true);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.ringName, 0, 2, true);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.radioName, 0, 1, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('verify old, new values and control reference for cluster controls', function (done) {
        const testConfig = {
            viName: 'Application::ClusterControls.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/ClusterControls.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/ClusterControls.via.txt',
            simpleClusterDataItemName: 'dataItem_SimpleCluster',
            simpleClusterName: 'SimpleCluster',
            clusterOfClusterDataItemName: 'dataItem_ClusterOfCluster',
            clusterOfClusterName: 'ClusterOfCluster',
            clusterOfArraysDataItemName: 'dataItem_ClusterOfArrays',
            clusterOfArraysName: 'ClusterOfArrays',
            clusterOfArrayOfClustersDataItemName: 'dataItem_ClusterOfArrayOfClusters',
            clusterOfArrayOfClustersName: 'ClusterOfArrayOfClusters',
            clusterOfClusterOfArrayOfClustersDataItemName: 'dataItem_ClusterOfClusterOfArrayOfClusters',
            clusterOfClusterOfArrayOfClustersName: 'ClusterOfClusterOfArrayOfClusters',
            clusterOfArrayOfClusterOfClustersDataItemName: 'dataItem_ClusterOfArrayOfClusterOfClusters',
            clusterOfArrayOfClusterOfClustersName: 'ClusterOfArrayOfClusterOfClusters'
        };
        const simpleClusterDefaultData = { Numeric: 0, String: '' };
        const simpleClusterNewData = { Numeric: 10, String: 'Foo' };
        const clusterOfClusterDefaultData = { Cluster: { Numeric: 0 }, String: '' };
        const clusterOfClusterNewData = { Cluster: { Numeric: 75 }, String: 'Bar' };
        const clusterOfArraysDefaultData = { Array: [] };
        const clusterOfArraysNewData = { Array: [['a', 'b'], ['c', 'd']] };
        const clusterOfArrayOfClustersDefaultData = { Array: [] };
        const clusterOfArrayOfClustersNewData = { Array: [{ Numeric: 42 }, { Numeric: 67 }] };
        const clusterOfClusterOfArrayOfClustersDefaultData = { ClusterOfArrayOfStringClusters: { Array: [] }, ClusterOfArrayOfNumericClusters: { Array: [] } };
        const clusterOfClusterOfArrayOfClustersNewData = { ClusterOfArrayOfStringClusters: { Array: [{ String: 'Foo' }, { String: 'Bar' }] }, ClusterOfArrayOfNumericClusters: { Array: [{ Numeric: 5 }, { Numeric: 61 }] } };
        const clusterOfArrayOfClusterOfClustersDefaultData = { Array: [] };
        const clusterOfArrayOfClusterOfClustersNewData = { Array: [{ Cluster: { LED: true } }, { Cluster: { LED: true } }] };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.simpleClusterName, simpleClusterDefaultData, simpleClusterDefaultData, false);
            valueChangedSimulator.simulateNewAndOldValueEventFromDataItem(viModel, testConfig.simpleClusterDataItemName, simpleClusterNewData, simpleClusterDefaultData);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.clusterOfClusterName, clusterOfClusterDefaultData, clusterOfClusterDefaultData, false);
            valueChangedSimulator.simulateNewAndOldValueEventFromDataItem(viModel, testConfig.clusterOfClusterDataItemName, clusterOfClusterNewData, clusterOfClusterDefaultData);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.clusterOfArraysName, clusterOfArraysDefaultData, clusterOfArraysDefaultData, false);
            valueChangedSimulator.simulateNewAndOldValueEventFromDataItem(viModel, testConfig.clusterOfArraysDataItemName, clusterOfArraysNewData, clusterOfArraysDefaultData);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.clusterOfArrayOfClustersName, clusterOfArrayOfClustersDefaultData, clusterOfArrayOfClustersDefaultData, false);
            valueChangedSimulator.simulateNewAndOldValueEventFromDataItem(viModel, testConfig.clusterOfArrayOfClustersDataItemName, clusterOfArrayOfClustersNewData, clusterOfArrayOfClustersDefaultData);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.clusterOfClusterOfArrayOfClustersName, clusterOfClusterOfArrayOfClustersDefaultData, clusterOfClusterOfArrayOfClustersDefaultData, false);
            valueChangedSimulator.simulateNewAndOldValueEventFromDataItem(viModel, testConfig.clusterOfClusterOfArrayOfClustersDataItemName, clusterOfClusterOfArrayOfClustersNewData, clusterOfClusterOfArrayOfClustersDefaultData);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.clusterOfArrayOfClusterOfClustersName, clusterOfArrayOfClusterOfClustersDefaultData, clusterOfArrayOfClusterOfClustersDefaultData, false);
            valueChangedSimulator.simulateNewAndOldValueEventFromDataItem(viModel, testConfig.clusterOfArrayOfClusterOfClustersDataItemName, clusterOfArrayOfClusterOfClustersNewData, clusterOfArrayOfClusterOfClustersDefaultData);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.simpleClusterName, simpleClusterDefaultData, simpleClusterNewData, true);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.clusterOfClusterName, clusterOfClusterDefaultData, clusterOfClusterNewData, true);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.clusterOfArraysName, clusterOfArraysDefaultData, clusterOfArraysNewData, true);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.clusterOfArrayOfClustersName, clusterOfArrayOfClustersDefaultData, clusterOfArrayOfClustersNewData, true);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.clusterOfClusterOfArrayOfClustersName, clusterOfClusterOfArrayOfClustersDefaultData, clusterOfClusterOfArrayOfClustersNewData, true);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.clusterOfArrayOfClusterOfClustersName, clusterOfArrayOfClusterOfClustersDefaultData, clusterOfArrayOfClusterOfClustersNewData, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('verify old, new values and control reference for array controls', function (done) {
        const testConfig = {
            viName: 'Application::ArrayControls.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/ArrayControls.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/ArrayControls.via.txt',
            simpleArrayDataItemName: 'dataItem_SimpleArray',
            simpleArrayName: 'SimpleArray',
            arrayOfClustersDataItemName: 'dataItem_ArrayOfClusters',
            arrayOfClustersName: 'ArrayOfClusters',
            arrayOfClusterOfTwoClustersDataItemName: 'dataItem_ArrayOfClusterOfTwoClusters',
            arrayOfClusterOfTwoClustersName: 'ArrayOfClusterOfTwoClusters',
            twoDimensionalArrayOfClustersDataItemName: 'dataItem__2DArrayOfClusters',
            twoDimensionalArrayOfClustersName: '2DArrayOfClusters',
            threeDimensionalArrayOfClustersDataItemName: 'dataItem__3DArrayOfClusters',
            threeDimensionalArrayOfClustersName: '3DArrayOfClusters'
        };
        const simpleArrayDefaultData = [];
        const simpleArrayNewData = [1, 2, 3];
        const arrayOfClustersDefaultData = [];
        const arrayOfClustersNewData = [{ Numeric: 45, LED: true }, { Numeric: 3, LED: false }];
        const arrayOfClusterOfTwoClustersDefaultData = [];
        const arrayOfClusterOfTwoClustersNewData = [
            { FirstCluster: { String: 'Foo' }, SecondCluster: { Numeric: 1 } },
            { FirstCluster: { String: 'Bar' }, SecondCluster: { Numeric: 2 } },
            { FirstCluster: { String: 'Baz' }, SecondCluster: { Numeric: 3 } }
        ];
        const twoDimensionalArrayOfClustersDefaultData = [];
        const twoDimensionalArrayOfClustersNewData = [
            [{ Numeric: 0.0, LED: true }, { Numeric: 5.2, LED: false }],
            [{ Numeric: 6.2565, LED: false }, { Numeric: 5.7, LED: true }],
            [{ Numeric: 5, LED: false }, { Numeric: 5, LED: true }]
        ];
        const threeDimensionalArrayOfClustersDefaultData = [];
        const threeDimensionalArrayOfClustersNewData = [
            [
                [{ Numeric: 7.3, LED: true }, { Numeric: 78, LED: true }, { Numeric: 124.5, LED: true }],
                [{ Numeric: 2697.3641, LED: false }, { Numeric: 0.0, LED: true }, { Numeric: 7893.244, LED: false }]
            ],
            [
                [{ Numeric: 0.01567, LED: false }, { Numeric: 123.7798, LED: true }, { Numeric: 78.36, LED: false }],
                [{ Numeric: 789.0, LED: true }, { Numeric: 26, LED: false }, { Numeric: 0.0, LED: true }]
            ]
        ];
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.simpleArrayName, simpleArrayDefaultData, simpleArrayDefaultData, false);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.arrayOfClustersName, arrayOfClustersDefaultData, arrayOfClustersDefaultData, false);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.arrayOfClusterOfTwoClustersName, arrayOfClusterOfTwoClustersDefaultData, arrayOfClusterOfTwoClustersDefaultData, false);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.twoDimensionalArrayOfClustersName, twoDimensionalArrayOfClustersDefaultData, twoDimensionalArrayOfClustersDefaultData, false);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.threeDimensionalArrayOfClustersName, threeDimensionalArrayOfClustersDefaultData, threeDimensionalArrayOfClustersDefaultData, false);
            valueChangedSimulator.simulateNewAndOldValueEventFromDataItem(viModel, testConfig.simpleArrayDataItemName, simpleArrayNewData, simpleArrayDefaultData);
            valueChangedSimulator.simulateNewAndOldValueEventFromDataItem(viModel, testConfig.arrayOfClustersDataItemName, arrayOfClustersNewData, arrayOfClustersDefaultData);
            valueChangedSimulator.simulateNewAndOldValueEventFromDataItem(viModel, testConfig.arrayOfClusterOfTwoClustersDataItemName, arrayOfClusterOfTwoClustersNewData, arrayOfClusterOfTwoClustersDefaultData);
            valueChangedSimulator.simulateNewAndOldValueEventFromDataItem(viModel, testConfig.twoDimensionalArrayOfClustersDataItemName, twoDimensionalArrayOfClustersNewData, twoDimensionalArrayOfClustersDefaultData);
            valueChangedSimulator.simulateNewAndOldValueEventFromDataItem(viModel, testConfig.threeDimensionalArrayOfClustersDataItemName, threeDimensionalArrayOfClustersNewData, threeDimensionalArrayOfClustersDefaultData);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.simpleArrayName, simpleArrayDefaultData, simpleArrayNewData, true);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.arrayOfClustersName, arrayOfClustersDefaultData, arrayOfClustersNewData, true);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.arrayOfClusterOfTwoClustersName, arrayOfClusterOfTwoClustersDefaultData, arrayOfClusterOfTwoClustersNewData, true);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.twoDimensionalArrayOfClustersName, twoDimensionalArrayOfClustersDefaultData, twoDimensionalArrayOfClustersNewData, true);
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.threeDimensionalArrayOfClustersName, threeDimensionalArrayOfClustersDefaultData, threeDimensionalArrayOfClustersNewData, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('value change on control that does not support events does not cause a problem', function (done) {
        const testConfig = {
            viName: 'Application::IgnoreValueChangeEventOnUnregisteredControl.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/IgnoreValueChangeEventOnUnregisteredControl.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/IgnoreValueChangeEventOnUnregisteredControl.via.txt',
            registeredControlDataItemName: 'dataItem_Registered',
            outputDataItem: 'dataItem_Output'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, 0);
            const registeredControlModel = valueChangedSimulator.getControlModelFromDataItem(viModel, testConfig.registeredControlDataItemName);
            const labelControlId = registeredControlModel.followerIds[0];
            valueChangedSimulator.simulateNewAndOldValueEventWithPropertyName(viModel, labelControlId, 'text', 'old', 'new');
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.registeredControlDataItemName, 17);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, 1);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('verify old, new values and control reference for Hyperlink control', function (done) {
        const testConfig = {
            viName: 'Application::HyperLink.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/HyperLink.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/HyperLink.via.txt',
            controlToModify: 'dataItem_Hyperlink',
            controlName: 'Hyperlink'
        };
        const HyperLinkDefaultData = '';
        const HyperLinkNewData = 'www.ni.com';
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.controlName, HyperLinkDefaultData, HyperLinkDefaultData, false);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.controlToModify, HyperLinkNewData);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertOldNewAndEqualsDataItemValues(vireo, testConfig.viName, testConfig.controlName, HyperLinkDefaultData, HyperLinkNewData, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('value change on control disables the control using the property node', function (done) {
        const testConfig = {
            viName: 'Application::DisableControlOnValueChanged.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/DisableControlOnValueChanged.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/DisableControlOnValueChanged.via.txt',
            registeredControlDataItemName: 'dataItem_Button',
            outputDataItem: 'dataItem_DisabledControl'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, false);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.registeredControlDataItemName, true);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
    it('value change on control updates the control value using a property node', function (done) {
        const testConfig = {
            viName: 'Application::UpdateValuePropertyOnValueChanged.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/ControlEvents/Builds/UpdateValuePropertyOnValueChanged.html',
            viaCodePath: '/GeneratedBuiltOutput/ControlEvents/Builds/UpdateValuePropertyOnValueChanged.via.txt',
            registeredControlDataItemName: 'dataItem_Numeric',
            outputDataItem: 'dataItem_UpdatedValue'
        };
        const runningCallback = async function (webAppModel, vireo) {
            await waitForReadyDataItem(vireo, testConfig.viName);
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, false);
            valueChangedSimulator.simulateNewValueEventFromDataItem(viModel, testConfig.registeredControlDataItemName, 42);
        };
        const completeCallback = function (webAppModel, vireo) {
            assertIndicatorValue(vireo, testConfig.viName, testConfig.outputDataItem, true);
        };
        executionTestHelper.setupAndWaitForRunningAndStop(testConfig, done, runningCallback, completeCallback);
    });
});
//# sourceMappingURL=ControlValueChangeEvent.Test.Generated.js.map