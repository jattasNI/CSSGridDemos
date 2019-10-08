import { VireoPeeker as VIREO_PEEKER } from '../../Framework/niVireoPeeker.js';
// The import path to vireoHelpers should be relative to the path under Object\LVjs\Web instead of the HtmlControls.Design\Web folder
// since thats where the product/test/rollup will use this file from.
import vireoHelpers from '../../../../../NodeApps/node_modules/@ni-private/webvi-deps/node_modules/vireo/source/core/vireo.loader.wasm32-unknown-emscripten.release.js';
describe('PropertyNode integration test', function () {
    'use strict';
    let executionTestHelper;
    let originalTimeout;
    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        executionTestHelper = testHelpers.createWebAppLocalExecutionTestHelper();
    });
    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
    const getControlIdFromDataItemName = function (viModel, dataItemName) {
        const controlModels = viModel.getAllControlModels();
        for (const i in controlModels) {
            const bindingInfo = controlModels[i].getEditorRuntimeBindingInfo();
            if (bindingInfo !== undefined && bindingInfo.dataItem === dataItemName) {
                return i;
            }
        }
        return undefined;
    };
    // These checked in .html and .via files are out of date and no longer work.  We believe this should
    // move to building them as part of the test, but for now I'm disabling this test.
    xit('read property value for scalar controls', function (done) {
        const testConfig = {
            viName: "MyVI",
            htmlFixturePath: testHelpers.getPathRelativeToFixtures('Html/PropertyNode/simpletypecontrols.html'),
            viaCodePath: testHelpers.getPathRelativeToFixtures('VIA/PropertyNode/propertynoderead.via')
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viName = testConfig.viName;
            const booleanValue = VIREO_PEEKER.peek(vireo, viName, 'booleanLocal');
            expect(booleanValue).toBe(true);
            const doubleValue = VIREO_PEEKER.peek(vireo, viName, 'doubleLocal');
            expect(doubleValue).toEqual(123.456);
            const int32Value = VIREO_PEEKER.peek(vireo, viName, 'int32Local');
            expect(int32Value).toEqual(-2147483647);
            const uint32Value = VIREO_PEEKER.peek(vireo, viName, 'uint32Local');
            expect(uint32Value).toEqual(4294967293);
            const complexValue = VIREO_PEEKER.peek(vireo, viName, 'complexDoubleLocal');
            expect(complexValue).toEqual('123.45 + 67.89i');
        });
    });
    it('write property "Disabled"', function (done) {
        const testConfig = {
            viName: 'WebApp::PropWrite_Disabled.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/PropWrite_Disabled.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/PropWrite_Disabled.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const propertyName = 'Disabled';
            const ledDisabled = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_MyLED"), propertyName);
            expect(ledDisabled).toBe(true);
            const numericTextBoxDisabled = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_MyNumeric"), propertyName);
            expect(numericTextBoxDisabled).toBe(true);
        });
    });
    it('write property "Value" for NumericControl', function (done) {
        const testConfig = {
            viName: 'WebApp::PropWrite_Value.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/PropWrite_Value.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/PropWrite_Value.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const propertyName = 'Value';
            const ledValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_MyLED"), propertyName);
            expect(ledValue).toBe(true);
            const numericValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_MyNumeric"), propertyName);
            expect(numericValue).toBe(45);
        });
    });
    it('write and read property "Disabled"', function (done) {
        const testConfig = {
            viName: 'WebApp::PropWriteRead_Disabled.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/PropWriteRead_Disabled.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/PropWriteRead_Disabled.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const propertyName = 'Disabled';
            const ledDisabled = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_MyLED"), propertyName);
            expect(ledDisabled).toBe(true);
            const numericDisabled = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_MyNumeric"), propertyName);
            expect(numericDisabled).toBe(true);
        });
    });
    it('write and read property "Value"', function (done) {
        const testConfig = {
            viName: 'WebApp::PropWriteRead_Value.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/PropWriteRead_Value.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/PropWriteRead_Value.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const propertyName = 'Value';
            const ledDisabled = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_MyLED"), propertyName);
            expect(ledDisabled).toBe(true);
            const numericDisabled = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_MyNumeric"), propertyName);
            expect(numericDisabled).toBe(45);
        });
    });
    it('write and read property "Value" for string control', function (done) {
        const testConfig = {
            viName: 'WebApp::String_PropWriteRead_Value.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/String_PropWriteRead_Value.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/String_PropWriteRead_Value.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const propertyName = 'Value';
            const ledValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_TestResult"), propertyName);
            expect(ledValue).toBe(true);
            const stringValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_String"), propertyName);
            const inputStringValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_Input_String"), propertyName);
            expect(stringValue).toBe(inputStringValue);
        });
    });
    it('write and read property "Value" for cluster containing string control', function (done) {
        const testConfig = {
            viName: 'WebApp::ClusterValueProperty_ReadWrite.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/ClusterValueProperty_ReadWrite.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/ClusterValueProperty_ReadWrite.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const propertyName = 'Value';
            const ledValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_Test_Result"), propertyName);
            expect(ledValue).toBe(true);
            const clusterValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_Cluster"), propertyName);
            const inputClusterValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_Input"), propertyName);
            expect(clusterValue).toEqual(inputClusterValue);
        });
    });
    it('write and read property "Value" for cluster containing array of numeric control', function (done) {
        const testConfig = {
            viName: 'WebApp::ClusterContainingArrayValueProperty_ReadWrite.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/ClusterContainingArrayValueProperty_ReadWrite.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/ClusterContainingArrayValueProperty_ReadWrite.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const propertyName = 'Value';
            const ledValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_Test_Result"), propertyName);
            expect(ledValue).toBe(true);
            const clusterValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_Cluster"), propertyName);
            const inputClusterValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_Input_Value"), propertyName);
            expect(clusterValue).toEqual(inputClusterValue);
        });
    });
    it('write and read property "Value" for Array of string control', function (done) {
        const testConfig = {
            viName: 'WebApp::ArrayValueProperty_ReadWrite.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/ArrayValueProperty_ReadWrite.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/ArrayValueProperty_ReadWrite.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const propertyName = 'Value';
            const ledValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_Test_Result"), propertyName);
            expect(ledValue).toBe(true);
            const arrayValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_Array"), propertyName);
            const inputArrayValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_Input_Value"), propertyName);
            expect(arrayValue).toEqual(inputArrayValue);
        });
    });
    it('write and read property "Value" for 2D Array of cluster containing numeric control', function (done) {
        const testConfig = {
            viName: 'WebApp::Array2DContainingClusterValueProperty_ReadWrite.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/Array2DContainingClusterValueProperty_ReadWrite.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/Array2DContainingClusterValueProperty_ReadWrite.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const propertyName = 'Value';
            const ledValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_Test_Result"), propertyName);
            expect(ledValue).toBe(true);
            const arrayValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_Array"), propertyName);
            const inputArrayValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_Value"), propertyName);
            expect(arrayValue).toEqual(inputArrayValue);
        });
    });
    it('read property "Value" from simple controls', function (done) {
        const testConfig = {
            viName: "WebApp::SimpProp.gviweb",
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/SimpProp.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/SimpProp.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viName = vireoHelpers.staticHelpers.encodeIdentifier(testConfig.viName);
            const squareLEDValue = VIREO_PEEKER.peek(vireo, viName, 'dataItem_PropertyReadMySquareLED');
            expect(squareLEDValue).toBe(true);
            const myNum1Value = VIREO_PEEKER.peek(vireo, viName, 'dataItem_PropertyReadMyNum1');
            expect(myNum1Value).toEqual(45);
        });
    });
    it('write property "ItemAndValues" of Ring control with duplicate items returns error', function (done) {
        const testConfig = {
            viName: "WebApp::Ring_ItemsValues_Prop_DupItems_ThrowsError.gviweb",
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/Ring_ItemsValues_Prop_DupItems_ThrowsError.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/Ring_ItemsValues_Prop_DupItems_ThrowsError.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viName = vireoHelpers.staticHelpers.encodeIdentifier(testConfig.viName);
            const ledValue = VIREO_PEEKER.peek(vireo, viName, 'dataItem_TestResult');
            expect(ledValue).toBe(true);
        });
    });
    it('read and write property "ItemAndValues" of Ring control works as expected', function (done) {
        const testConfig = {
            viName: "WebApp::Ring_ItemsValues_Prop_ReadWrite.gviweb",
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/Ring_ItemsValues_Prop_ReadWrite.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/Ring_ItemsValues_Prop_ReadWrite.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viName = vireoHelpers.staticHelpers.encodeIdentifier(testConfig.viName);
            const ledValue = VIREO_PEEKER.peek(vireo, viName, 'dataItem_TestResult');
            expect(ledValue).toBe(true);
        });
    });
    // These checked in .html and .via files are out of date and no longer work.  We believe this should
    // move to building them as part of the test, but for now I'm disabling this test.
    xit('write property value for scalar controls', function (done) {
        const testConfig = {
            viName: "MyVI",
            htmlFixturePath: testHelpers.getPathRelativeToFixtures('Html/PropertyNode/simpletypecontrols.html'),
            viaCodePath: testHelpers.getPathRelativeToFixtures('VIA/PropertyNode/propertynodewrite.via')
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const propertyName = 'Value';
            const powerButtonValue = viModel.processControlUpdateToGetGPropertyValue(46, propertyName);
            expect(powerButtonValue).toBe(false);
            const doubleValue = viModel.processControlUpdateToGetGPropertyValue(56, propertyName);
            expect(doubleValue).toEqual(0);
            const int32Value = viModel.processControlUpdateToGetGPropertyValue(61, propertyName);
            expect(int32Value).toEqual(0);
            const uint32Value = viModel.processControlUpdateToGetGPropertyValue(66, propertyName);
            expect(uint32Value).toEqual(0);
            const complexValue = viModel.processControlUpdateToGetGPropertyValue(71, propertyName);
            expect(complexValue).toEqual('0 + 0i');
        });
    });
    it('read property item for listbox control', function (done) {
        const testConfig = {
            viName: "WebApp::listbox_ItemProperty_Read.gviweb",
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/listbox_ItemProperty_Read.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/listbox_ItemProperty_Read.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const listBox = viModel.controlModels[getControlIdFromDataItemName(viModel, "dataItem_Listbox")];
            const itemArray = viModel.controlModels[getControlIdFromDataItemName(viModel, "dataItem_Items")];
            expect(itemArray.value).toEqual(listBox.source);
        });
    });
    it('write property "ValueSignaling" for Numeric Control', function (done) {
        const testConfig = {
            viName: "WebApp::Numeric_valueSignalingProperty.gviweb",
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/Numeric_valueSignalingProperty.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/Numeric_valueSignalingProperty.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const propertyName = 'Value';
            const ledValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_TrueResult"), propertyName);
            expect(ledValue).toBe(true);
        });
    });
    it('read property "Text" for Button control', function (done) {
        const testConfig = {
            viName: "WebApp::BooleanButtonTextProperty_read.gviweb",
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/BooleanButtonTextProperty_read.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/BooleanButtonTextProperty_read.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const propertyName = 'Text';
            const booleanText = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_Button"), propertyName);
            expect(booleanText).toEqual(['Button1']);
        });
    });
    it('write property "Visible"', function (done) {
        const testConfig = {
            viName: 'WebApp::PropWrite_Visible.gviweb',
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/PropWrite_Visible.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/PropWrite_Visible.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const propertyName = 'Visible';
            const ledVisible = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_MyLED"), propertyName);
            expect(ledVisible).toBe(false);
            const numericTextBoxVisible = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_MyNumeric"), propertyName);
            expect(numericTextBoxVisible).toBe(false);
        });
    });
    it('write and read property "Visible"', function (done) {
        const testConfig = {
            viName: "WebApp::PropWriteRead_Visible.gviweb",
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/PropWriteRead_Visible.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/PropWriteRead_Visible.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const propertyName = 'Visible';
            const ledVisible = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_MyLED"), propertyName);
            expect(ledVisible).toBe(false);
            const numericVisible = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_MyNumeric"), propertyName);
            expect(numericVisible).toBe(false);
        });
    });
    it('write and read property "Text" for Button control', function (done) {
        const testConfig = {
            viName: "WebApp::BooleanButtonTextProperty_ReadWrite.gviweb",
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/BooleanButtonTextProperty_ReadWrite.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/BooleanButtonTextProperty_ReadWrite.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const ledValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_TrueResult"), 'Value');
            expect(ledValue).toBe(true);
        });
    });
    it('read property "Text" for CheckBox control', function (done) {
        const testConfig = {
            viName: "WebApp::CheckBoxValueProperty_Read.gviweb",
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/CheckBoxValueProperty_Read.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/CheckBoxValueProperty_Read.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const propertyName = 'Text';
            const checkBoxText = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_Checkbox"), propertyName);
            expect(checkBoxText).toEqual(['True/False']);
        });
    });
    it('read property "Text" for label', function (done) {
        const testConfig = {
            viName: "WebApp::LabelTextProperty_Read.gviweb",
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/LabelTextProperty_Read.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/LabelTextProperty_Read.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const ledValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_TestResult"), 'Value');
            expect(ledValue).toBe(true);
        });
    });
    it('write and read property "Text" for label', function (done) {
        const testConfig = {
            viName: "WebApp::LabelTextProperty_ReadWrite.gviweb",
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/LabelTextProperty_ReadWrite.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/LabelTextProperty_ReadWrite.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viModel = webAppModel.updateService.getVIModels()[testConfig.viName];
            const ledValue = viModel.processControlUpdateToGetGPropertyValue(getControlIdFromDataItemName(viModel, "dataItem_TestResult"), 'Value');
            expect(ledValue).toBe(true);
        });
    });
    it('write and read property "Size" of BooleanButton control works as expected', function (done) {
        const testConfig = {
            viName: "WebApp::BooleanButtonSizeProperty_ReadWrite.gviweb",
            htmlFixturePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/BooleanButtonSizeProperty_ReadWrite.html',
            viaCodePath: '/GeneratedBuiltOutput/PropertyNodes/Builds/BooleanButtonSizeProperty_ReadWrite.via.txt'
        };
        executionTestHelper.setupAndWaitForStop(testConfig, done, function (webAppModel, vireo) {
            const viName = vireoHelpers.staticHelpers.encodeIdentifier(testConfig.viName);
            const ledValue = VIREO_PEEKER.peek(vireo, viName, 'dataItem_TestResult');
            expect(ledValue).toBe(true);
        });
    });
});
//# sourceMappingURL=PropertyNode.Test.Generated.js.map