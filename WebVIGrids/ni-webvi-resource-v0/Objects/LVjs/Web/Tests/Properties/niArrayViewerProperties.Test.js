//****************************************
// G Property Tests for ArrayViewer class
// National Instruments Copyright 2018
//****************************************
import { ArrayViewerModel } from '../../Modeling/niArrayViewerModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A ArrayViewer control', function () {
    'use strict';
    let updateService, viModel, frontPanelControls, arrayViewerModel, arrayViewerElement, numericElement, arrayViewerViewModel;
    let arraySelector, arrayElementsSelector, complexArrayType, clusterContainingCheckBoxType, numericArray2DType;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    const NIType = window.NIType;
    const NITypeNames = window.NITypeNames;
    let controlId, arrayViewerSettings, arrayViewerWithNumericSettings, arrayViewerWithClusterSettings, arrayViewerWithNumericSettingsLabel, arrayViewerWithCheckBoxSettings, arrayViewerWithCheckBoxSettingsLabel;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.arrayViewerSettings.niControlId;
            arrayViewerSettings = fixture.arrayViewerSettings;
            arrayViewerWithNumericSettings = fixture.arrayViewerWithNumericSettings;
            arrayViewerWithClusterSettings = fixture.arrayViewerWithClusterSettings;
            arrayViewerWithNumericSettingsLabel = fixture.arrayViewerWithNumericSettingsLabel;
            arrayViewerWithCheckBoxSettings = fixture.arrayViewerWithCheckBoxSettings;
            arrayViewerWithCheckBoxSettingsLabel = fixture.arrayViewerWithCheckBoxSettingsLabel;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    // TODO should be removed after we migrate to jasmine >= 2.7 and the `it` blocks support async functions natively
    const makeAsync = function (done, fn) {
        fn().then(() => done()).catch((ex) => done.fail(ex));
    };
    describe('with 1D numeric array ', function () {
        beforeEach(function (done) {
            makeAsync(done, async function () {
                arrayViewerElement = webAppHelper.createNIElement(arrayViewerSettings);
                numericElement = webAppHelper.createNIElement(arrayViewerWithNumericSettings, controlId);
                await testHelpers.waitForAsync(function () {
                    return arrayViewerElement.templateControl !== null;
                });
            });
        });
        beforeEach(function () {
            frontPanelControls = viModel.getAllControlModels();
            arrayViewerModel = frontPanelControls[controlId];
            arrayViewerViewModel = viModel.getControlViewModel(controlId);
            arraySelector = '[ni-control-id=\'' + controlId + '\']';
            arrayElementsSelector = arraySelector + ' ' + numericElement.tagName;
        });
        it('setting disabled property updates childElements as well.', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                arrayViewerViewModel.setGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME, true);
            }, function () {
                expect(arrayViewerElement.disabled).toBe(true);
                const arrayElements = document.querySelectorAll(arrayElementsSelector);
                arrayElements.forEach(arrayElement => {
                    expect(arrayElement.disabled).toBe(true);
                });
            }, function () {
                arrayViewerViewModel.setGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME, false);
            }, function () {
                expect(arrayViewerElement.disabled).toBe(false);
                const arrayElements = document.querySelectorAll(arrayElementsSelector);
                arrayElements.forEach(arrayElement => {
                    expect(arrayElement.disabled).toBe(false);
                });
            });
        });
        it('setting visible rows property updates rowsAndColumns.', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                arrayViewerViewModel.setGPropertyValue(ArrayViewerModel.VISIBLE_ROWS_G_PROPERTY_NAME, 4);
            }, function () {
                expect(arrayViewerElement.rowsAndColumns).toBe('4,1');
            });
        });
        it('setting visible columns property of a vertical array updates visible columns accordingly and sets the orientation to horizontal.', function (done) {
            let currentArrayViewerWidth;
            testHelpers.runMultipleAsync(done, function () {
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                currentArrayViewerWidth = parseInt(arrayViewerElement.childElement.offsetWidth);
                arrayViewerViewModel.setGPropertyValue(ArrayViewerModel.VISIBLE_COLUMNS_G_PROPERTY_NAME, 5);
            }, function () {
                expect(arrayViewerElement.rowsAndColumns).toBe('1,5');
                expect(parseInt(arrayViewerElement.childElement.offsetWidth) > currentArrayViewerWidth).toBe(true);
                expect(arrayViewerElement.orientation).toBe('horizontal');
            });
        });
        it('setting visible rows property of a horizontal array updates visible rows accordingly and sets the orientation to vertical.', function (done) {
            let currentArrayViewerHeight;
            testHelpers.runMultipleAsync(done, function () {
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                webAppHelper.dispatchMessage(controlId, {
                    rowsAndColumns: '1,4'
                });
            }, function () {
                currentArrayViewerHeight = parseInt(arrayViewerElement.childElement.offsetHeight);
                arrayViewerViewModel.setGPropertyValue(ArrayViewerModel.VISIBLE_ROWS_G_PROPERTY_NAME, 5);
            }, function () {
                expect(arrayViewerElement.rowsAndColumns).toBe('5,1');
                expect(parseInt(arrayViewerElement.childElement.offsetHeight) > currentArrayViewerHeight).toBe(true);
                expect(arrayViewerElement.orientation).toBe('vertical');
            });
        });
        it('property read for visible rows returns the current value.', function (done) {
            const newVisibleRowsValue = 5;
            const newRowsAndColumnsValue = newVisibleRowsValue + "," + 1;
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    rowsAndColumns: newRowsAndColumnsValue
                });
            }, function () {
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                const currentVisibleRowsValue = arrayViewerViewModel.getGPropertyValue(ArrayViewerModel.VISIBLE_ROWS_G_PROPERTY_NAME);
                expect(currentVisibleRowsValue).toEqual(newVisibleRowsValue);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('with complex type ', function () {
        beforeEach(function () {
            arrayViewerElement = webAppHelper.createNIElement(arrayViewerSettings);
            webAppHelper.createNIElement(arrayViewerWithNumericSettings, controlId);
            complexArrayType = new NIType({
                name: NITypeNames.ARRAY,
                rank: 1,
                subtype: NITypeNames.COMPLEXDOUBLE
            }).toJSON();
        });
        beforeEach(function () {
            frontPanelControls = viModel.getAllControlModels();
            arrayViewerModel = frontPanelControls[controlId];
            arrayViewerViewModel = viModel.getControlViewModel(controlId);
        });
        it('property read for Value returns the current value.', function (done) {
            const newValue = ['0+i', '2+11i', '12-12i'];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: complexArrayType,
                    value: newValue
                });
            }, function () {
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                const currentValue = arrayViewerViewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
                expect(currentValue).toEqual(newValue);
            });
        });
        it('property set for Value updates model.', function (done) {
            const newValue = ['102-19i'];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: complexArrayType });
            }, function () {
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(arrayViewerModel.value).toEqual(newValue);
            });
        });
        it('property set for Value updates control element.', function (done) {
            const newValue = ['10+i', '21+1i'];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: complexArrayType });
            }, function () {
                arrayViewerModel = frontPanelControls[controlId];
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(arrayViewerModel.value).toEqual(newValue);
            }, function () {
                expect(arrayViewerElement.value).toEqual(newValue);
            });
        });
        it('property set for Value does not call controlChanged function of updateService', function (done) {
            const newValue = ['102-19i'];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: complexArrayType });
            }, function () {
                spyOn(updateService, 'controlChanged');
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(updateService.controlChanged).not.toHaveBeenCalled();
            });
        });
        it('property set for valueSignaling calls controlChanged fuction of updateService with correct arguments', function (done) {
            const newValue = ['102-19i'];
            const oldValue = ['0+i', '2+11i', '12-12i'];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: complexArrayType,
                    value: oldValue
                });
            }, function () {
                spyOn(updateService, 'controlChanged');
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, arrayViewerModel, 'value', newValue, oldValue);
            });
        });
        it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
            const Value = ['0+i', '2+11i', '12-12i'];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: complexArrayType,
                    value: Value
                });
            }, function () {
                spyOn(updateService, 'controlChanged');
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, Value);
                expect(updateService.controlChanged).toHaveBeenCalled();
            });
        });
        it('property set for valueSignaling updates model.', function (done) {
            const newValue = ['102-19i'];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: complexArrayType });
            }, function () {
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(arrayViewerModel.value).toEqual(newValue);
            });
        });
        it('property set for valueSignaling updates control element.', function (done) {
            const newValue = ['10+i', '21+1i'];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: complexArrayType });
            }, function () {
                arrayViewerModel = frontPanelControls[controlId];
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(arrayViewerModel.value).toEqual(newValue);
            }, function () {
                expect(arrayViewerElement.value).toEqual(newValue);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('with cluster containing check box and numeric ', function () {
        beforeEach(function () {
            arrayViewerElement = webAppHelper.createNIElement(arrayViewerSettings);
            webAppHelper.createNIElement(arrayViewerWithClusterSettings, controlId);
            webAppHelper.createNIElement(arrayViewerWithCheckBoxSettings, arrayViewerWithClusterSettings.niControlId);
            webAppHelper.createNIElement(arrayViewerWithCheckBoxSettingsLabel, arrayViewerWithClusterSettings.niControlId);
            webAppHelper.createNIElement(arrayViewerWithNumericSettings, arrayViewerWithClusterSettings.niControlId);
            webAppHelper.createNIElement(arrayViewerWithNumericSettingsLabel, arrayViewerWithClusterSettings.niControlId);
            clusterContainingCheckBoxType = (new NIType({
                name: NITypeNames.CLUSTER,
                fields: [arrayViewerWithCheckBoxSettingsLabel.text, arrayViewerWithNumericSettingsLabel.text],
                subtype: [NITypeNames.BOOLEAN, NITypeNames.DOUBLE]
            }).makeArray(1)).toJSON();
        });
        beforeEach(function () {
            frontPanelControls = viModel.getAllControlModels();
            arrayViewerModel = frontPanelControls[controlId];
            arrayViewerViewModel = viModel.getControlViewModel(controlId);
        });
        it('property read for Value returns the current value.', function (done) {
            const newValue = [{ Checkbox: true, Numeric: 10 }, { Checkbox: false, Numeric: -11 }];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: clusterContainingCheckBoxType,
                    value: newValue
                });
            }, function () {
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                const currentValue = arrayViewerViewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
                expect(currentValue).toEqual(newValue);
            });
        });
        it('property set for Value updates model.', function (done) {
            const newValue = [{ Checkbox: true, Numeric: 10 }, { Checkbox: false, Numeric: -11 }];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: clusterContainingCheckBoxType
                });
            }, function () {
                arrayViewerModel = frontPanelControls[controlId];
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(arrayViewerModel.value).toEqual(newValue);
            });
        });
        it('property set for Value updates control element.', function (done) {
            const newValue = [{ Checkbox: true, Numeric: 10 }, { Checkbox: false, Numeric: -11 }];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: clusterContainingCheckBoxType
                });
            }, function () {
                arrayViewerModel = frontPanelControls[controlId];
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(arrayViewerModel.value).toEqual(newValue);
            }, function () {
                expect(arrayViewerElement.value).toEqual(newValue);
            });
        });
        it('property set for Value does not call controlChanged function of updateService', function (done) {
            const newValue = [{ Checkbox: true, Numeric: 10 }, { Checkbox: false, Numeric: -11 }];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: clusterContainingCheckBoxType
                });
            }, function () {
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                spyOn(updateService, 'controlChanged');
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(updateService.controlChanged).not.toHaveBeenCalled();
            });
        });
        it('property set for valueSignaling calls controlChanged fuction of updateService with correct arguments', function (done) {
            const newValue = [{ Checkbox: true, Numeric: 10 }, { Checkbox: false, Numeric: -11 }];
            const oldValue = ['0+i', '2+11i', '12-12i'];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: clusterContainingCheckBoxType,
                    value: oldValue
                });
            }, function () {
                spyOn(updateService, 'controlChanged');
                arrayViewerModel = frontPanelControls[controlId];
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, arrayViewerModel, 'value', newValue, oldValue);
            });
        });
        it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
            const Value = [{ Checkbox: true, Numeric: 10 }, { Checkbox: false, Numeric: -11 }];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: complexArrayType,
                    value: Value
                });
            }, function () {
                spyOn(updateService, 'controlChanged');
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, Value);
                expect(updateService.controlChanged).toHaveBeenCalled();
            });
        });
        it('property set for valueSignaling updates model.', function (done) {
            const newValue = [{ Checkbox: true, Numeric: 10 }, { Checkbox: false, Numeric: -11 }];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: clusterContainingCheckBoxType
                });
            }, function () {
                arrayViewerModel = frontPanelControls[controlId];
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(arrayViewerModel.value).toEqual(newValue);
            });
        });
        it('property set for valueSignaling updates control element.', function (done) {
            const newValue = [{ Checkbox: true, Numeric: 10 }, { Checkbox: false, Numeric: -11 }];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: clusterContainingCheckBoxType
                });
            }, function () {
                arrayViewerModel = frontPanelControls[controlId];
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(arrayViewerModel.value).toEqual(newValue);
            }, function () {
                expect(arrayViewerElement.value).toEqual(newValue);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('with 2D numeric array ', function () {
        beforeEach(function () {
            arrayViewerSettings.dimensions = 2;
            arrayViewerElement = webAppHelper.createNIElement(arrayViewerSettings);
            webAppHelper.createNIElement(arrayViewerWithClusterSettings, controlId);
            webAppHelper.createNIElement(arrayViewerWithNumericSettings, arrayViewerWithClusterSettings.niControlId);
            numericArray2DType = new NIType({
                name: NITypeNames.ARRAY,
                rank: 2,
                subtype: NITypeNames.DOUBLE
            }).toJSON();
        });
        beforeEach(function () {
            frontPanelControls = viModel.getAllControlModels();
            arrayViewerModel = frontPanelControls[controlId];
            arrayViewerViewModel = viModel.getControlViewModel(controlId);
        });
        it('property read for Value returns the current value.', function (done) {
            const newValue = [[1, 2, 3, 4],
                [2, 3, 4, 5],
                [3, 4, 5, 6]];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: numericArray2DType,
                    value: newValue
                });
            }, function () {
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                const currentValue = arrayViewerViewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
                expect(currentValue).toEqual(newValue);
            });
        });
        it('property set for Value updates model.', function (done) {
            const newValue = [[1, 2, 3, 4],
                [2, 3, 4, 5],
                [3, 4, 5, 6]];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: numericArray2DType
                });
            }, function () {
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(arrayViewerModel.value).toEqual(newValue);
            });
        });
        it('property set for Value updates control element.', function (done) {
            const newValue = [[1, 2, 3, 4],
                [2, 3, 4, 5],
                [3, 4, 5, 6]];
            webAppHelper.dispatchMessage(controlId, {
                dimensions: 2,
                niType: numericArray2DType
            });
            testHelpers.runMultipleAsync(done, function () {
                arrayViewerModel = frontPanelControls[controlId];
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            }, function () {
                expect(arrayViewerModel.value).toEqual(newValue);
                expect(arrayViewerElement.value).toEqual(newValue);
            });
        });
        it('property set for visible rows amd visible columns property updates model.', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: numericArray2DType
                });
            }, function () {
                arrayViewerModel = frontPanelControls[controlId];
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                arrayViewerViewModel.setGPropertyValue(ArrayViewerModel.VISIBLE_ROWS_G_PROPERTY_NAME, 3);
                arrayViewerViewModel.setGPropertyValue(ArrayViewerModel.VISIBLE_COLUMNS_G_PROPERTY_NAME, 4);
                expect(arrayViewerModel.rowsAndColumns).toEqual('3,4');
            });
        });
        it('property read for visible rows amd visible columns returns the current value.', function (done) {
            const newVisibleRowsValue = 5;
            const newVisibleColumnsValue = 6;
            const newRowsAndColumnsValue = newVisibleRowsValue + "," + newVisibleColumnsValue;
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: numericArray2DType,
                    rowsAndColumns: newRowsAndColumnsValue
                });
            }, function () {
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                const currentVisibleRowsValue = arrayViewerViewModel.getGPropertyValue(ArrayViewerModel.VISIBLE_ROWS_G_PROPERTY_NAME);
                const currentVisibleColumnsValue = arrayViewerViewModel.getGPropertyValue(ArrayViewerModel.VISIBLE_COLUMNS_G_PROPERTY_NAME);
                expect(currentVisibleRowsValue).toEqual(newVisibleRowsValue);
                expect(currentVisibleColumnsValue).toEqual(newVisibleColumnsValue);
            });
        });
        it('property set for valueSignaling calls controlChanged fuction of updateService with correct arguments', function (done) {
            const newValue = [[1, 2, 3, 4],
                [2, 3, 4, 5],
                [3, 4, 5, 6]];
            const oldValue = ['0+i', '2+11i', '12-12i'];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: numericArray2DType,
                    value: oldValue
                });
            }, function () {
                spyOn(updateService, 'controlChanged');
                arrayViewerModel = frontPanelControls[controlId];
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, arrayViewerModel, 'value', newValue, oldValue);
            });
        });
        it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
            const Value = [[1, 2, 3, 4],
                [2, 3, 4, 5],
                [3, 4, 5, 6]];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: complexArrayType,
                    value: Value
                });
            }, function () {
                spyOn(updateService, 'controlChanged');
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, Value);
                expect(updateService.controlChanged).toHaveBeenCalled();
            });
        });
        it('property set for valueSignaling updates model.', function (done) {
            const newValue = [[1, 2, 3, 4],
                [2, 3, 4, 5],
                [3, 4, 5, 6]];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: numericArray2DType
                });
            }, function () {
                arrayViewerModel = frontPanelControls[controlId];
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(arrayViewerModel.value).toEqual(newValue);
            });
        });
        it('property set for valueSignaling updates control element.', function (done) {
            const newValue = [[1, 2, 3, 4],
                [2, 3, 4, 5],
                [3, 4, 5, 6]];
            webAppHelper.dispatchMessage(controlId, {
                dimensions: 2,
                niType: numericArray2DType
            });
            testHelpers.runMultipleAsync(done, function () {
                arrayViewerModel = frontPanelControls[controlId];
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
                arrayViewerViewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            }, function () {
                expect(arrayViewerModel.value).toEqual(newValue);
                expect(arrayViewerElement.value).toEqual(newValue);
                arrayViewerModel = frontPanelControls[controlId];
                arrayViewerViewModel = viModel.getControlViewModel(controlId);
            });
        });
        it('property set for Size throws error.', function (done) {
            const size = { Width: 100, Height: 200 };
            testHelpers.runAsync(done, function () {
                expect(function () {
                    arrayViewerViewModel.setGPropertyValue(VisualModel.SIZE_G_PROPERTY_NAME, size);
                }).toThrow();
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
    });
});
//# sourceMappingURL=niArrayViewerProperties.Test.js.map