//****************************************
// G Property Tests for DataGridModel class
// National Instruments Copyright 2018
//****************************************
import { DataGridColumnModel } from '../../Modeling/niDataGridColumnModel.js';
import { NumericTextBoxModel } from '../../Modeling/niNumericTextBoxModel.js';
import { StringControlModel } from '../../Modeling/niStringControlModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A DataGrid control', function () {
    'use strict';
    let controlId = 'DataGridModelId';
    const $internalDoNotUse = NationalInstruments.Globals.jQuery;
    const addRowButtonsSelector = '.ni-row-count-text-field,.ni-add-rows-button';
    const pagingControlsSelector = '.jqx-grid-pager-input';
    let updateService, viModel, controlModel, viewModel, controlElement;
    let dataGridSettings, column0TemplateControl, column1TemplateControl, dataGridSettingsColumn0, dataGridSettingsColumn1, dataGridSettingsColumnCheckBoxControl0, dataGridSettingsColumnLinearProgressBarControl1;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    const NIType = window.NIType;
    const NITypeNames = window.NITypeNames;
    const buildNITypeForColumn = function (columnTypeName, settingsColumn) {
        return (new NIType({ name: NITypeNames.CLUSTER, fields: [settingsColumn.fieldName], subtype: [columnTypeName] }).makeArray(1)).toJSON();
    };
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.dataGridSettings2.niControlId;
            dataGridSettings = fixture.dataGridSettings2;
            dataGridSettingsColumn0 = fixture.dataGridSettingsColumn0;
            dataGridSettingsColumnCheckBoxControl0 = fixture.dataGridSettings2ColumnCheckBoxControl0;
            dataGridSettingsColumn1 = fixture.dataGridSettingsColumn1;
            dataGridSettingsColumnLinearProgressBarControl1 = fixture.dataGridSettings2ColumnLinearProgressBarControl1;
            Object.freeze(dataGridSettingsColumn0);
            Object.freeze(dataGridSettingsColumn1);
            Object.freeze(dataGridSettingsColumnCheckBoxControl0);
            Object.freeze(dataGridSettingsColumnLinearProgressBarControl1);
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
        // domVerifier.verifyDomState();
    });
    describe('with column as ', function () {
        dataGridSettingsColumn0 = {
            niControlId: 'FunctionColumn0',
            kind: DataGridColumnModel.MODEL_KIND,
            width: '200',
            header: 'Column A',
            fieldName: 'A',
            index: 0
        };
        [{
                dataGridSettings: {
                    kind: StringControlModel.MODEL_KIND,
                    niControlId: 'StringControlID'
                },
                values: ['Row 0', 'Row 1'],
                newValue: ['Row 0', 'Row 1', 'Row 2', 'ABC', 'def', 'ghi', '0123', '4567', '89!'],
                niType: buildNITypeForColumn(NITypeNames.STRING, dataGridSettingsColumn0),
                column: 'string'
            }, {
                dataGridSettings: {
                    kind: NumericTextBoxModel.MODEL_KIND,
                    niControlId: 'NumericTextBoxControlID'
                },
                values: [3.4, 5.3, 12, 100, -10],
                newValue: [1],
                niType: buildNITypeForColumn(NITypeNames.DOUBLE, dataGridSettingsColumn0),
                column: 'numeric'
            }].forEach(function (controlSettings) {
            it(controlSettings.control + ' get property Value return current value.', function (done) {
                let i, values;
                dataGridSettings.niType = controlSettings.niType;
                webAppHelper.createNIElement(dataGridSettings);
                webAppHelper.createNIElement(dataGridSettingsColumn0, dataGridSettings.niControlId);
                webAppHelper.createNIElement(controlSettings.dataGridSettings, dataGridSettingsColumn0.niControlId);
                const createDataGridValues = function (fieldName, baseValues) {
                    let valueToPush;
                    const result = [];
                    for (i = 0; i < baseValues.length; i++) {
                        valueToPush = {};
                        valueToPush[fieldName] = baseValues[i];
                        result.push(valueToPush);
                    }
                    return result;
                };
                const pushValues = function () {
                    controlModel = viModel.getControlModel(dataGridSettings.niControlId);
                    viewModel = viModel.getControlViewModel(dataGridSettings.niControlId);
                    controlElement = viewModel.element;
                    expect(controlModel).toBeDefined();
                    expect(viewModel).toBeDefined();
                    expect(controlElement).toBeDefined();
                    values = createDataGridValues(dataGridSettingsColumn0.fieldName, controlSettings.values);
                };
                const getGPropertyValue = function () {
                    const currentValue = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
                    expect(currentValue).toEqual(values);
                };
                testHelpers.runMultipleAsync(done, pushValues, function () { webAppHelper.dispatchMessage(dataGridSettings.niControlId, { value: values }); }, getGPropertyValue);
            });
        });
        [{
                dataGridSettings: {
                    kind: StringControlModel.MODEL_KIND,
                    niControlId: 'StringControlID'
                },
                values: ['Row 0', 'Row 1'],
                newValue: ['Row 0', 'Row 1', 'Row 3'],
                niType: buildNITypeForColumn(NITypeNames.STRING, dataGridSettingsColumn0),
                control: 'string'
            }, {
                dataGridSettings: {
                    kind: NumericTextBoxModel.MODEL_KIND,
                    niControlId: 'NumericTextBoxControlID'
                },
                values: [3.4, 5.3, 12, 100, -10],
                newValue: [1],
                niType: buildNITypeForColumn(NITypeNames.DOUBLE, dataGridSettingsColumn0),
                control: 'numeric'
            }].forEach(function (controlSettings) {
            it(controlSettings.control + ' set property Value update model.', function (done) {
                let i, values, newValues;
                dataGridSettings.niType = controlSettings.niType;
                webAppHelper.createNIElement(dataGridSettings);
                webAppHelper.createNIElement(dataGridSettingsColumn0, dataGridSettings.niControlId);
                webAppHelper.createNIElement(controlSettings.dataGridSettings, dataGridSettingsColumn0.niControlId);
                const createDataGridValues = function (fieldName, baseValues) {
                    let valueToPush;
                    const result = [];
                    for (i = 0; i < baseValues.length; i++) {
                        valueToPush = {};
                        valueToPush[fieldName] = baseValues[i];
                        result.push(valueToPush);
                    }
                    return result;
                };
                const pushValues = function () {
                    controlModel = viModel.getControlModel(dataGridSettings.niControlId);
                    viewModel = viModel.getControlViewModel(dataGridSettings.niControlId);
                    controlElement = viewModel.element;
                    expect(controlModel).toBeDefined();
                    expect(viewModel).toBeDefined();
                    expect(controlElement).toBeDefined();
                    values = createDataGridValues(dataGridSettingsColumn0.fieldName, controlSettings.values);
                    newValues = createDataGridValues(dataGridSettingsColumn0.fieldName, controlSettings.newValue);
                };
                const setGPropertyValue = function () {
                    testHelpers.runAsync(done, function () {
                        viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValues);
                        expect(controlModel.value).toEqual(newValues);
                    });
                };
                testHelpers.runMultipleAsync(done, pushValues, function () { webAppHelper.dispatchMessage(dataGridSettings.niControlId, { value: values }); }, setGPropertyValue);
            });
            it(controlSettings.control + ' set property ValueSignaling update model and calls controlChanged function of updateService with correct arguments.', function (done) {
                let i, values, newValues;
                dataGridSettings.niType = controlSettings.niType;
                webAppHelper.createNIElement(dataGridSettings);
                webAppHelper.createNIElement(dataGridSettingsColumn0, dataGridSettings.niControlId);
                webAppHelper.createNIElement(controlSettings.dataGridSettings, dataGridSettingsColumn0.niControlId);
                const createDataGridValues = function (fieldName, baseValues) {
                    let valueToPush;
                    const result = [];
                    for (i = 0; i < baseValues.length; i++) {
                        valueToPush = {};
                        valueToPush[fieldName] = baseValues[i];
                        result.push(valueToPush);
                    }
                    return result;
                };
                const pushValues = function () {
                    controlModel = viModel.getControlModel(dataGridSettings.niControlId);
                    viewModel = viModel.getControlViewModel(dataGridSettings.niControlId);
                    controlElement = viewModel.element;
                    expect(controlModel).toBeDefined();
                    expect(viewModel).toBeDefined();
                    expect(controlElement).toBeDefined();
                    values = createDataGridValues(dataGridSettingsColumn0.fieldName, controlSettings.values);
                    newValues = createDataGridValues(dataGridSettingsColumn0.fieldName, controlSettings.newValue);
                };
                const setGPropertyValueSignaling = function () {
                    testHelpers.runAsync(done, function () {
                        spyOn(updateService, 'controlChanged');
                        viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValues);
                        expect(controlModel.value).toEqual(newValues);
                        expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValues, values);
                    });
                };
                testHelpers.runMultipleAsync(done, pushValues, function () { webAppHelper.dispatchMessage(dataGridSettings.niControlId, { value: values }); }, setGPropertyValueSignaling);
            });
            it(controlSettings.control + ' property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
                let i, values;
                dataGridSettings.niType = controlSettings.niType;
                webAppHelper.createNIElement(dataGridSettings);
                webAppHelper.createNIElement(dataGridSettingsColumn0, dataGridSettings.niControlId);
                webAppHelper.createNIElement(controlSettings.dataGridSettings, dataGridSettingsColumn0.niControlId);
                const createDataGridValues = function (fieldName, baseValues) {
                    let valueToPush;
                    const result = [];
                    for (i = 0; i < baseValues.length; i++) {
                        valueToPush = {};
                        valueToPush[fieldName] = baseValues[i];
                        result.push(valueToPush);
                    }
                    return result;
                };
                const pushValues = function () {
                    controlModel = viModel.getControlModel(dataGridSettings.niControlId);
                    viewModel = viModel.getControlViewModel(dataGridSettings.niControlId);
                    controlElement = viewModel.element;
                    expect(controlModel).toBeDefined();
                    expect(viewModel).toBeDefined();
                    expect(controlElement).toBeDefined();
                    values = createDataGridValues(dataGridSettingsColumn0.fieldName, controlSettings.values);
                };
                const setGPropertyValueSignaling = function () {
                    testHelpers.runAsync(done, function () {
                        spyOn(updateService, 'controlChanged');
                        viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, values);
                        expect(controlModel.value).toEqual(values);
                        expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', values, values);
                    });
                };
                testHelpers.runMultipleAsync(done, pushValues, function () { webAppHelper.dispatchMessage(dataGridSettings.niControlId, { value: values }); }, setGPropertyValueSignaling);
            });
        });
        [{
                dataGridSettings: {
                    kind: StringControlModel.MODEL_KIND,
                    niControlId: 'StringControlID'
                },
                values: ['Row 0', 'Row 1'],
                newValue: ['Row 0', 'Row 1', 'Row 2', 'ABC'],
                niType: buildNITypeForColumn(NITypeNames.STRING, dataGridSettingsColumn0),
                control: 'string'
            }, {
                dataGridSettings: {
                    kind: NumericTextBoxModel.MODEL_KIND,
                    niControlId: 'NumericTextBoxControlID'
                },
                values: [3.4, 5.3, 12, 100, -10],
                newValue: [1],
                niType: buildNITypeForColumn(NITypeNames.DOUBLE, dataGridSettingsColumn0),
                control: 'numeric'
            }].forEach(function (controlSettings) {
            it(controlSettings.control + ' set property Value update element as well.', function (done) {
                let i, values, newValues;
                dataGridSettings.niType = controlSettings.niType;
                webAppHelper.createNIElement(dataGridSettings);
                webAppHelper.createNIElement(dataGridSettingsColumn0, dataGridSettings.niControlId);
                webAppHelper.createNIElement(controlSettings.dataGridSettings, dataGridSettingsColumn0.niControlId);
                const createDataGridValues = function (fieldName, baseValues) {
                    let valueToPush;
                    const result = [];
                    for (i = 0; i < baseValues.length; i++) {
                        valueToPush = {};
                        valueToPush[fieldName] = baseValues[i];
                        result.push(valueToPush);
                    }
                    return result;
                };
                const pushValues = function () {
                    controlModel = viModel.getControlModel(dataGridSettings.niControlId);
                    viewModel = viModel.getControlViewModel(dataGridSettings.niControlId);
                    controlElement = viewModel.element;
                    expect(controlModel).toBeDefined();
                    expect(viewModel).toBeDefined();
                    expect(controlElement).toBeDefined();
                    values = createDataGridValues(dataGridSettingsColumn0.fieldName, controlSettings.values);
                    newValues = createDataGridValues(dataGridSettingsColumn0.fieldName, controlSettings.newValue);
                };
                const setGPropertyValueUpdateElement = function () {
                    testHelpers.runMultipleAsync(done, function () {
                        viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValues);
                        expect(controlModel.value).toEqual(newValues);
                    }, function () {
                        expect(controlElement.value).toEqual(newValues);
                    });
                };
                testHelpers.runMultipleAsync(done, pushValues, function () { webAppHelper.dispatchMessage(dataGridSettings.niControlId, { value: values }); }, setGPropertyValueUpdateElement);
            });
            it(controlSettings.control + ' set property ValueSiganling update element as well.', function (done) {
                let i, values, newValues;
                dataGridSettings.niType = controlSettings.niType;
                webAppHelper.createNIElement(dataGridSettings);
                webAppHelper.createNIElement(dataGridSettingsColumn0, dataGridSettings.niControlId);
                webAppHelper.createNIElement(controlSettings.dataGridSettings, dataGridSettingsColumn0.niControlId);
                const createDataGridValues = function (fieldName, baseValues) {
                    let valueToPush;
                    const result = [];
                    for (i = 0; i < baseValues.length; i++) {
                        valueToPush = {};
                        valueToPush[fieldName] = baseValues[i];
                        result.push(valueToPush);
                    }
                    return result;
                };
                const pushValues = function () {
                    controlModel = viModel.getControlModel(dataGridSettings.niControlId);
                    viewModel = viModel.getControlViewModel(dataGridSettings.niControlId);
                    controlElement = viewModel.element;
                    expect(controlModel).toBeDefined();
                    expect(viewModel).toBeDefined();
                    expect(controlElement).toBeDefined();
                    values = createDataGridValues(dataGridSettingsColumn0.fieldName, controlSettings.values);
                    newValues = createDataGridValues(dataGridSettingsColumn0.fieldName, controlSettings.newValue);
                };
                const setGPropertyValueSignalingUpdateElement = function () {
                    testHelpers.runMultipleAsync(done, function () {
                        viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValues);
                        expect(controlModel.value).toEqual(newValues);
                    }, function () {
                        expect(controlElement.value).toEqual(newValues);
                    });
                };
                testHelpers.runMultipleAsync(done, pushValues, function () { webAppHelper.dispatchMessage(dataGridSettings.niControlId, { value: values }); }, setGPropertyValueSignalingUpdateElement);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('property set for Value updates control element for multiple column.', function (done) {
        webAppHelper.createNIElement(dataGridSettings);
        webAppHelper.createNIElement(dataGridSettingsColumn0, dataGridSettings.niControlId);
        webAppHelper.createNIElement(dataGridSettingsColumn1, dataGridSettings.niControlId);
        webAppHelper.createNIElement(dataGridSettingsColumnCheckBoxControl0, dataGridSettingsColumn0.niControlId);
        webAppHelper.createNIElement(dataGridSettingsColumnLinearProgressBarControl1, dataGridSettingsColumn1.niControlId);
        const newType = new NIType({
            name: NITypeNames.CLUSTER,
            fields: [dataGridSettingsColumn0.fieldName, dataGridSettingsColumn1.fieldName],
            subtype: [NITypeNames.BOOLEAN, NITypeNames.DOUBLE]
        }).makeArray(1);
        const newValue = [{ A: true, B: 10 }, { A: false, B: 1 }, { A: true, B: 2 }];
        testHelpers.runMultipleAsync(done, function () {
            controlModel = viModel.getControlModel(dataGridSettings.niControlId);
            viewModel = viModel.getControlViewModel(dataGridSettings.niControlId);
            controlElement = viewModel.element;
        }, function () {
            webAppHelper.dispatchMessage(dataGridSettings.niControlId, { niType: newType });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        }, function () {
            expect(controlElement.value).toEqual(newValue);
        }, function () {
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('updates childElements as well on setting disabled property', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            controlElement = webAppHelper.createNIElement(dataGridSettings);
            webAppHelper.createNIElement(dataGridSettingsColumn0, dataGridSettings.niControlId);
            column0TemplateControl = webAppHelper.createNIElement(dataGridSettingsColumnCheckBoxControl0, dataGridSettingsColumn0.niControlId);
            webAppHelper.createNIElement(dataGridSettingsColumn1, dataGridSettings.niControlId);
            column1TemplateControl = webAppHelper.createNIElement(dataGridSettingsColumnLinearProgressBarControl1, dataGridSettingsColumn1.niControlId);
        }, function () {
            controlModel = viModel.getControlModel(dataGridSettings.niControlId);
            viewModel = viModel.getControlViewModel(dataGridSettings.niControlId);
            viewModel.setGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME, true);
        }, function () {
            expect(controlElement.disabled).toBe(true);
            expect(column0TemplateControl.disabled).toBe(true);
            expect(column1TemplateControl.disabled).toBe(true);
            const addRowPaneElements = controlElement.querySelectorAll(addRowButtonsSelector);
            addRowPaneElements.forEach(element => {
                expect(element.disabled).toBe(true);
            });
            expect($internalDoNotUse(controlElement.jqref).jqxGrid('disabled')).toBe(true);
            const pagingControls = controlElement.querySelectorAll(pagingControlsSelector);
            pagingControls.forEach(control => {
                expect(control.disabled).toBe(true);
            });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME, false);
        }, function () {
            expect(controlElement.disabled).toBe(false);
            expect(column0TemplateControl.disabled).toBe(false);
            expect(column1TemplateControl.disabled).toBe(false);
            const addRowPaneElements = controlElement.querySelectorAll(addRowButtonsSelector);
            addRowPaneElements.forEach(element => {
                expect(element.disabled).toBe(false);
            });
            expect($internalDoNotUse(controlElement.jqref).jqxGrid('disabled')).toBe(false);
            const pagingControls = controlElement.querySelectorAll(pagingControlsSelector);
            pagingControls.forEach(control => {
                expect(control.disabled).toBe(false);
            });
        }, function () {
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('property read for Position returns the current position.', function () {
        const newDataGridSettings = Object.assign({}, dataGridSettings);
        newDataGridSettings.niControlId = "DataGridNew";
        controlElement = webAppHelper.createNIElement(newDataGridSettings);
        viewModel = viModel.getControlViewModel(newDataGridSettings.niControlId);
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(newDataGridSettings.left),
            "Top": parseInt(newDataGridSettings.top)
        };
        expect(position).toEqual(expectedPosition);
        webAppHelper.removeNIElement(newDataGridSettings.niControlId);
    });
    it('property set for Position updates model.', function (done) {
        const newPosition = { Left: 100, Top: 200 };
        testHelpers.runAsync(done, function () {
            const newDataGridSettings = Object.assign({}, dataGridSettings);
            newDataGridSettings.niControlId = "DataGridNew";
            controlElement = webAppHelper.createNIElement(newDataGridSettings);
            viewModel = viModel.getControlViewModel(newDataGridSettings.niControlId);
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
            controlModel = viModel.getControlModel(newDataGridSettings.niControlId);
            expect(parseInt(controlModel.left)).toEqual(newPosition.Left);
            expect(parseInt(controlModel.top)).toEqual(newPosition.Top);
            webAppHelper.removeNIElement(newDataGridSettings.niControlId);
        });
    });
    it('property set for Position updates control element.', function (done) {
        const newPosition = { Left: 150, Top: 250 };
        const newDataGridSettings = Object.assign({}, dataGridSettings);
        testHelpers.runMultipleAsync(done, function () {
            controlElement = webAppHelper.createNIElement(newDataGridSettings);
            viewModel = viModel.getControlViewModel(newDataGridSettings.niControlId);
            controlElement = viewModel.element;
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
        }, function () {
            const computedStyle = window.getComputedStyle(controlElement);
            expect(parseInt(computedStyle.left)).toEqual(newPosition.Left);
            expect(parseInt(computedStyle.top)).toEqual(newPosition.Top);
            webAppHelper.removeNIElement(newDataGridSettings.niControlId);
        });
    });
});
//# sourceMappingURL=niDataGridProperties.Test.js.map