//****************************************
// Tests for DataGridViewModel class
// National Instruments Copyright 2014
//****************************************
import { BooleanLEDModel } from '../../Modeling/niBooleanLEDModel.js';
import { CheckBoxModel } from '../../Modeling/niCheckBoxModel.js';
import { DropDownModel } from '../../Modeling/niDropDownModel.js';
import { JQXNumericValueConverter as JQX_NUM_VAL_CONVERTER } from '../../Framework/ValueConverters/niJQXNumericValueConverter.js';
import { LinearProgressBarModel } from '../../Modeling/niLinearProgressBarModel.js';
import { NumericTextBoxModel } from '../../Modeling/niNumericTextBoxModel.js';
import { SliderModel } from '../../Modeling/niSliderModel.js';
import { StringControlModel } from '../../Modeling/niStringControlModel.js';
describe('A DataGridViewModel', function () {
    'use strict';
    const $internalDoNotUse = NationalInstruments.Globals.jQuery;
    let viModel, controlModel, controlElement;
    let settings, updateSettings, settingsColumn0, settingsColumnControl0, settingsColumn1, settingsColumnControl1;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    const NITypes = window.NITypes;
    const NIType = window.NIType;
    const NITypeNames = window.NITypeNames;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            settings = fixture.dataGridSettings;
            updateSettings = fixture.dataGridUpdateSettings;
            settingsColumn0 = fixture.dataGridSettingsColumn0;
            settingsColumnControl0 = fixture.dataGridSettingsColumnStringControl0;
            settingsColumn1 = fixture.dataGridSettingsColumn1;
            settingsColumnControl1 = fixture.dataGridSettingsColumnNumericControl1;
            Object.freeze(settings);
            Object.freeze(updateSettings);
            Object.freeze(settingsColumn0);
            Object.freeze(settingsColumnControl0);
            Object.freeze(settingsColumn1);
            Object.freeze(settingsColumnControl1);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        // TODO mraj DOM_POLLUTION
        //domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page.', function (done) {
        $(document.body).append('<ni-data-grid ni-control-id="' + settings.niControlId + '"></ni-data-grid>');
        testHelpers.runMultipleAsync(done, function () {
            const viewModel = viModel.getControlViewModel(settings.niControlId);
            expect(viewModel).toBeDefined();
        }, function () {
            webAppHelper.removeNIElement(settings.niControlId);
        });
    });
    it('allows elements to be added directly to the page via DOM functions', function (done) {
        const dataGrid = document.createElement('ni-data-grid');
        dataGrid.niControlId = settings.niControlId;
        const column0 = document.createElement('ni-data-grid-column');
        column0.niControlId = settingsColumn0.niControlId;
        column0.index = settingsColumn0.index;
        column0.fieldName = settingsColumn0.fieldName;
        const columnControl0 = document.createElement('ni-string-control');
        columnControl0.niControlId = settingsColumnControl0.niControlId;
        column0.appendChild(columnControl0);
        dataGrid.appendChild(column0);
        document.body.appendChild(dataGrid);
        testHelpers.runMultipleAsync(done, function () {
            const viewModelDataGrid = viModel.getControlViewModel(settings.niControlId), viewModelColumn0 = viModel.getControlViewModel(settingsColumn0.niControlId), viewModelColumnControl0 = viModel.getControlViewModel(settingsColumnControl0.niControlId);
            expect(viewModelDataGrid).toBeDefined();
            expect(viewModelColumn0).toBeDefined();
            expect(viewModelColumnControl0).toBeDefined();
        }, function () {
            webAppHelper.removeNIElement(settings.niControlId);
        });
    });
    xit('responds to a click to change the selected column (when in edit mode)', function (done) {
        webAppHelper.createNIElement(settings);
        webAppHelper.createNIElement(settingsColumn0, settings.niControlId);
        webAppHelper.createNIElement(settingsColumnControl0, settingsColumn0.niControlId);
        webAppHelper.createNIElement(settingsColumn1, settings.niControlId);
        webAppHelper.createNIElement(settingsColumnControl1, settingsColumn1.niControlId);
        testHelpers.runMultipleAsync(done, function () {
            viModel.getControlViewModel(settings.niControlId).element.isInEditMode = true;
        }, function () {
            const columnHeaderToClick = $(viModel.getControlViewModel(settings.niControlId).element.querySelectorAll('div[role=\'columnheader\']')[2]);
            columnHeaderToClick.simulate('click');
        }, function () {
            expect(viModel.getControlViewModel(settings.niControlId).element.selectedColumn).toBe(1);
        }, function () {
            const columnHeaderToClick = $(viModel.getControlViewModel(settings.niControlId).element.querySelectorAll('div[role=\'columnheader\']')[1]);
            columnHeaderToClick.simulate('click');
        }, function () {
            expect(viModel.getControlViewModel(settings.niControlId).element.selectedColumn).toBe(0);
        }, function () {
            const columnHeaderToClick = $(viModel.getControlViewModel(settings.niControlId).element.querySelectorAll('div[role=\'columnheader\']')[0]);
            columnHeaderToClick.simulate('click');
        }, function () {
            expect(viModel.getControlViewModel(settings.niControlId).element.selectedColumn).toBe(-1);
        }, function () {
            webAppHelper.removeNIElement(settings.niControlId);
        });
    });
    it('allows elements to be added directly to the page via jQuery functions', function (done) {
        const str = '<ni-data-grid ni-control-id="' + settings.niControlId + '">' +
            '<ni-data-grid-column ni-control-id="' + settingsColumn0.niControlId + '" index="' + settingsColumn0.index + '" fieldName="' + settingsColumn0.fieldName + '" >' +
            '<ni-string-control ni-control-id="' + settingsColumnControl0.niControlId + '" />' +
            '</ni-data-grid-column>' +
            '<ni-data-grid-column ni-control-id="' + settingsColumn1.niControlId + '" index="' + settingsColumn1.index + '" fieldName="' + settingsColumn1.fieldName + '" >' +
            '<jqx-numeric-text-box ni-control-id="' + settingsColumnControl1.niControlId + '" />' +
            '</ni-data-grid-column>' +
            '</ni-data-grid>';
        $(document.body).append(str);
        testHelpers.runMultipleAsync(done, function () {
            expect(viModel.getControlModel(settings.niControlId)).toBeDefined();
            expect(viModel.getControlModel(settingsColumn0.niControlId)).toBeDefined();
            expect(viModel.getControlModel(settingsColumnControl0.niControlId)).toBeDefined();
            expect(viModel.getControlModel(settingsColumn1.niControlId)).toBeDefined();
            expect(viModel.getControlModel(settingsColumnControl1.niControlId)).toBeDefined();
            expect(viModel.getControlViewModel(settings.niControlId)).toBeDefined();
            expect(viModel.getControlViewModel(settingsColumn0.niControlId)).toBeDefined();
            expect(viModel.getControlViewModel(settingsColumnControl0.niControlId)).toBeDefined();
            expect(viModel.getControlViewModel(settingsColumn1.niControlId)).toBeDefined();
            expect(viModel.getControlViewModel(settingsColumnControl1.niControlId)).toBeDefined();
        }, function () {
            webAppHelper.removeNIElement(settings.niControlId);
        });
    });
    describe('exists after the custom element is created', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(settings);
            webAppHelper.createNIElement(settingsColumn0, settings.niControlId);
            webAppHelper.createNIElement(settingsColumnControl0, settingsColumn0.niControlId);
            testHelpers.runAsync(done, function () {
                controlModel = viModel.getControlModel(settings.niControlId);
                viewModel = viModel.getControlViewModel(settings.niControlId);
                controlElement = viewModel.element;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(settings.niControlId);
        });
        it('and has the correct initial values.', function () {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlModel.readOnly).toEqual(settings.readOnly);
            expect(controlModel.rowHeaderVisible).toEqual(settings.rowHeaderVisible);
            expect(controlModel.columnHeaderVisible).toEqual(settings.columnHeaderVisible);
            expect(controlModel.allowSorting).toEqual(settings.allowSorting);
            expect(controlModel.allowPaging).toEqual(settings.allowPaging);
            expect(controlModel.allowFiltering).toEqual(settings.allowFiltering);
            expect(controlModel.allowGrouping).toEqual(settings.allowGrouping);
            expect(controlModel.rowHeight).toEqual(settings.rowHeight);
            expect(controlModel.altRowColors).toEqual(settings.altRowColors);
            expect(controlModel.altRowStart).toEqual(settings.altRowStart);
            expect(controlModel.altRowStep).toEqual(settings.altRowStep);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(settings.niControlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.rowHeaderVisible).toEqual(updateSettings.rowHeaderVisible);
                expect(controlModel.columnHeaderVisible).toEqual(updateSettings.columnHeaderVisible);
                expect(controlModel.allowSorting).toEqual(updateSettings.allowSorting);
                expect(controlModel.allowPaging).toEqual(updateSettings.allowPaging);
                expect(controlModel.allowFiltering).toEqual(updateSettings.allowFiltering);
                expect(controlModel.allowGrouping).toEqual(updateSettings.allowGrouping);
                expect(controlModel.rowHeight).toEqual(updateSettings.rowHeight);
                expect(controlModel.altRowColors).toEqual(updateSettings.altRowColors);
                expect(controlModel.altRowStart).toEqual(updateSettings.altRowStart);
                expect(controlModel.altRowStep).toEqual(updateSettings.altRowStep);
            });
        });
        it('and handles unknown property changes.', function (done) {
            const unknownSettings = {
                unknown: 'unknown'
            };
            const sendUnknownProperties = function () {
                webAppHelper.dispatchMessage(settings.niControlId, unknownSettings);
            };
            expect(sendUnknownProperties).toThrow();
            testHelpers.runAsync(done, function () {
                expect(controlModel.readOnly).toEqual(settings.readOnly);
                expect(controlModel.rowHeaderVisible).toEqual(settings.rowHeaderVisible);
                expect(controlModel.columnHeaderVisible).toEqual(settings.columnHeaderVisible);
                expect(controlModel.allowSorting).toEqual(settings.allowSorting);
                expect(controlModel.allowPaging).toEqual(settings.allowPaging);
                expect(controlModel.allowFiltering).toEqual(settings.allowFiltering);
                expect(controlModel.allowGrouping).toEqual(settings.allowGrouping);
                expect(controlModel.rowHeight).toEqual(settings.rowHeight);
                expect(controlModel.altRowColors).toEqual(settings.altRowColors);
                expect(controlModel.altRowStart).toEqual(settings.altRowStart);
                expect(controlModel.altRowStep).toEqual(settings.altRowStep);
            });
        });
    });
    describe('updates values correctly', function () {
        let viewModel;
        let columnModel, columnViewModel, columnElement;
        let columnControlModel, columnControlViewModel, columnControlElement;
        const numericValues = [1.1, 2.2, 3.3, 4.4, 5.5, 6.6, 7.7, 8.8, 9.9];
        const numericValues1 = [5.5];
        const booleanValues = [false, true, false, true];
        const stringValues = ['Row 0', 'Row 1', 'Row 2', 'ABC', 'def', 'ghi', '0123', '4567', '89!'];
        const arrValues = [[1], [2], [3], [4]];
        let localSettings;
        const buildNITypeForColumn = function (columntTypeName) {
            return (new NIType({ name: NITypeNames.CLUSTER, fields: [settingsColumn0.fieldName], subtype: [columntTypeName] }).makeArray(1)).toJSON();
        };
        const testColumnType = function (done, controlSettings) {
            let i, val;
            let foundControls = null, checkCount = 0;
            const values = [];
            const baseValues = controlSettings.values;
            let valuePropertyName = controlSettings.valuePropertyName;
            if (valuePropertyName === undefined) {
                valuePropertyName = 'value';
            }
            localSettings = Object.assign({}, settings);
            localSettings.niType = controlSettings.niType;
            webAppHelper.createNIElement(localSettings);
            webAppHelper.createNIElement(settingsColumn0, localSettings.niControlId);
            controlSettings.settings.niControlId = settingsColumnControl0.niControlId;
            webAppHelper.createNIElement(controlSettings.settings, settingsColumn0.niControlId);
            const pushValues = function () {
                let valueToPush;
                controlModel = viModel.getControlModel(localSettings.niControlId);
                viewModel = viModel.getControlViewModel(localSettings.niControlId);
                controlElement = viewModel.element;
                expect(controlModel).toBeDefined();
                expect(viewModel).toBeDefined();
                expect(controlElement).toBeDefined();
                columnModel = viModel.getControlModel(settingsColumn0.niControlId);
                columnViewModel = viModel.getControlViewModel(settingsColumn0.niControlId);
                columnElement = columnViewModel.element;
                expect(columnModel).toBeDefined();
                expect(columnViewModel).toBeDefined();
                expect(columnElement).toBeDefined();
                columnControlModel = viModel.getControlModel(settingsColumnControl0.niControlId);
                columnControlViewModel = viModel.getControlViewModel(settingsColumnControl0.niControlId);
                columnControlElement = columnControlViewModel.element;
                expect(columnControlModel).toBeDefined();
                expect(columnControlViewModel).toBeDefined();
                expect(columnControlElement).toBeDefined();
                for (i = 0; i < baseValues.length; i++) {
                    valueToPush = {};
                    valueToPush[columnElement.fieldName] = baseValues[i];
                    values.push(valueToPush);
                }
                webAppHelper.dispatchMessage(localSettings.niControlId, { value: values });
            };
            const checkControlValues = function () {
                let i;
                for (i = 0; i < foundControls.length; i++) {
                    val = foundControls[i][valuePropertyName];
                    if (controlSettings.getValueToCheck !== undefined) {
                        val = controlSettings.getValueToCheck(val);
                    }
                    expect(val).toEqual(baseValues[i]);
                }
            };
            const checkControls = function () {
                let controls;
                if (foundControls !== null) {
                    return;
                }
                const jqxGrid = $(controlElement).children('div')[0];
                if (controlSettings.elementQuery !== undefined) {
                    controls = controlSettings.elementQuery(jqxGrid);
                }
                else {
                    controls = jqxGrid.querySelectorAll(columnControlElement.tagName);
                }
                if (controls.length === baseValues.length) {
                    foundControls = controls;
                    checkControlValues();
                }
                else {
                    checkCount++;
                    if (checkCount >= 3) {
                        expect(controls.length).toEqual(baseValues.length); // Fail test if controls not found after 3 frames
                    }
                }
            };
            testHelpers.runMultipleAsync(done, pushValues, checkControls, checkControls, checkControls); // Note: 3 calls to checkControls here should match the max checkCount from above
        };
        afterEach(function () {
            webAppHelper.removeNIElement(localSettings.niControlId);
            localSettings.niType = undefined;
        });
        it('for the string column type', function (done) {
            testColumnType(done, {
                settings: { kind: StringControlModel.MODEL_KIND },
                values: stringValues,
                valuePropertyName: 'text',
                niType: buildNITypeForColumn(NITypeNames.STRING)
            });
        });
        it('for the numeric text box column type', function (done) {
            testColumnType(done, {
                settings: { kind: NumericTextBoxModel.MODEL_KIND },
                values: numericValues,
                getValueToCheck: function (val) {
                    return JQX_NUM_VAL_CONVERTER.convertBack(val, NITypes.DOUBLE);
                },
                niType: buildNITypeForColumn(NITypeNames.DOUBLE)
            });
        });
        it('for the checkbox column type', function (done) {
            testColumnType(done, {
                settings: { kind: CheckBoxModel.MODEL_KIND },
                values: booleanValues,
                valuePropertyName: 'checked',
                niType: buildNITypeForColumn(NITypeNames.BOOLEAN)
            });
        });
        it('for the boolean LED column type', function (done) {
            testColumnType(done, {
                settings: { kind: BooleanLEDModel.MODEL_KIND },
                values: booleanValues,
                valuePropertyName: 'checked',
                niType: buildNITypeForColumn(NITypeNames.BOOLEAN)
            });
        });
        it('for the slider column type', function (done) {
            testColumnType(done, {
                settings: { kind: SliderModel.MODEL_KIND },
                values: numericValues1,
                getValueToCheck: function (val) {
                    return parseFloat(val);
                },
                niType: buildNITypeForColumn(NITypeNames.DOUBLE)
            });
        });
        it('for the progress bar column type', function (done) {
            testColumnType(done, {
                settings: { kind: LinearProgressBarModel.MODEL_KIND },
                values: numericValues,
                niType: buildNITypeForColumn(NITypeNames.DOUBLE)
            });
        });
        it('for the dropdown column type', function (done) {
            testColumnType(done, {
                settings: { kind: DropDownModel.MODEL_KIND, source: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] },
                values: arrValues,
                valuePropertyName: 'selectedIndexes',
                niType: buildNITypeForColumn(NITypeNames.INT32)
            });
        });
    });
    it('is virtualized (based on how many rows are visible)', function (done) {
        let viewModel;
        let columnViewModel, columnElement;
        let columnControlViewModel, columnControlElement;
        const localSettings = Object.assign({}, settings);
        localSettings.height = '300px';
        localSettings.rowHeight = 25;
        webAppHelper.createNIElement(localSettings);
        webAppHelper.createNIElement(settingsColumn0, localSettings.niControlId);
        webAppHelper.createNIElement(settingsColumnControl0, settingsColumn0.niControlId);
        testHelpers.runMultipleAsync(done, function () {
            let valueToPush, i;
            const values = [];
            controlModel = viModel.getControlModel(localSettings.niControlId);
            viewModel = viModel.getControlViewModel(localSettings.niControlId);
            controlElement = viewModel.element;
            columnViewModel = viModel.getControlViewModel(settingsColumn0.niControlId);
            columnElement = columnViewModel.element;
            columnControlViewModel = viModel.getControlViewModel(settingsColumnControl0.niControlId);
            columnControlElement = columnControlViewModel.element;
            for (i = 0; i < 1000; i++) {
                valueToPush = {};
                valueToPush[columnElement.fieldName] = 'ABC ' + i;
                values.push(valueToPush);
            }
            webAppHelper.dispatchMessage(localSettings.niControlId, { value: values });
        }, function () {
            // This allows the control to be rendered and visible. The test will still pass without this.
        }, function () {
            const jqxGrid = $(controlElement).children('div')[0];
            const controls = jqxGrid.querySelectorAll(columnControlElement.tagName);
            // Since the data grid is virtualized, there should be only enough controls created to fill the data grid's visible height,
            // so in this case, much fewer than 1000.
            expect(controls.length).toBeGreaterThan(0);
            // From above, rowheight = 25 and data grid height = 300, so the number of controls would be ~12 without headers / toolbars. But, we
            // have to take into account the headers, toolbars, and the fact that at least one more control is created in the bottom of the data
            // grid to allow for scrolling.
            // We're not very exact here, we mainly care that it's much fewer than the number of values in the dataset.
            expect(controls.length).toBeLessThan(20);
            webAppHelper.removeNIElement(localSettings.niControlId);
        });
    });
    it('can add new rows at runtime', function (done) {
        let viewModel;
        let columnControlViewModel, columnControlElement;
        let foundControls = false, checkCount = 0;
        webAppHelper.createNIElement(settings);
        webAppHelper.createNIElement(settingsColumn0, settings.niControlId);
        webAppHelper.createNIElement(settingsColumnControl0, settingsColumn0.niControlId);
        const checkControls = function () {
            if (foundControls) {
                return;
            }
            const jqxGrid = $(controlElement).children('div')[0];
            const controls = jqxGrid.querySelectorAll(columnControlElement.tagName);
            if (controls.length === 3) {
                foundControls = true;
                webAppHelper.removeNIElement(settings.niControlId);
            }
            else {
                checkCount++;
                if (checkCount > 3) {
                    expect(controls.length).toEqual(3); // Fail test if controls not found after 3 frames
                }
            }
        };
        testHelpers.runMultipleAsync(done, function () {
            controlModel = viModel.getControlModel(settings.niControlId);
            viewModel = viModel.getControlViewModel(settings.niControlId);
            controlElement = viewModel.element;
            columnControlViewModel = viModel.getControlViewModel(settingsColumnControl0.niControlId);
            columnControlElement = columnControlViewModel.element;
            const addRowsInput = document.querySelector('div.ni-add-rows-toolbar div.jqx-input');
            expect(addRowsInput).toBeDefined();
            $internalDoNotUse(addRowsInput).jqxNumberInput('val', 3);
            const addRowsButton = document.querySelector('div.ni-add-rows-toolbar input[type=\'button\']');
            expect(addRowsButton).toBeDefined();
            $(addRowsButton).simulate('click');
        }, checkControls, checkControls, checkControls); // Note: 3 calls to checkControls here should match the max checkCount from above
    });
    describe('sets style correctly', function () {
        let viewModel;
        let columnViewModel, columnElement;
        let columnControlModel, columnControlViewModel, columnControlElement;
        const booleanValues = [false, true, false, true];
        const numericValues = [1.1, 2.2, 3.3, 4.4, 5.5, 6.6, 7.7, 8.8, 9.9];
        const numericValues1 = [5.5];
        const stringValues = ['Row 0', 'Row 1', 'Row 2', 'ABC', 'def', 'ghi', '0123', '4567', '89!'];
        const arrValues = [[1], [2], [3], [4]];
        let localSettings;
        const buildNITypeForColumn = function (columntTypeName) {
            return (new NIType({ name: NITypeNames.CLUSTER, fields: [settingsColumn0.fieldName], subtype: [columntTypeName] }).makeArray(1)).toJSON();
        };
        const testStyleOnColumnElement = function (done, controlSettings) {
            const values = [];
            let foundControls = null, i;
            const baseValues = controlSettings.values;
            localSettings = Object.assign({}, settings);
            localSettings.niType = controlSettings.niType;
            webAppHelper.createNIElement(localSettings);
            webAppHelper.createNIElement(settingsColumn0, localSettings.niControlId);
            controlSettings.settings.niControlId = settingsColumnControl0.niControlId;
            webAppHelper.createNIElement(controlSettings.settings, settingsColumn0.niControlId);
            const pushValues = function () {
                let valueToPush;
                viewModel = viModel.getControlViewModel(localSettings.niControlId);
                controlElement = viewModel.element;
                columnViewModel = viModel.getControlViewModel(settingsColumn0.niControlId);
                columnElement = columnViewModel.element;
                columnControlViewModel = viModel.getControlViewModel(settingsColumnControl0.niControlId);
                columnControlModel = viModel.getControlModel(settingsColumnControl0.niControlId);
                columnControlElement = columnControlViewModel.element;
                expect(columnElement).toBeDefined();
                for (i = 0; i < baseValues.length; i++) {
                    valueToPush = {};
                    valueToPush[columnElement.fieldName] = baseValues[i];
                    values.push(valueToPush);
                }
                webAppHelper.dispatchMessage(localSettings.niControlId, { value: values });
            };
            const applyStyle = function () {
                const property = {};
                property[controlSettings.propertyUnderTest] = controlSettings.propertyValueToSet;
                columnControlModel.setMultipleProperties(property);
            };
            const checkStyle = function () {
                foundControls = controlElement.querySelectorAll(columnControlElement.tagName + '[ni-template-id]');
                expect(foundControls.length).toEqual(baseValues.length);
                let cloneControl;
                for (cloneControl of foundControls) {
                    const cssVariableValue = cloneControl.style.getPropertyValue(controlSettings.cssVariableToCheck);
                    expect(cssVariableValue).toEqual(controlSettings.propertyValueToSet);
                }
            };
            testHelpers.runMultipleAsync(done, pushValues, applyStyle, checkStyle);
        };
        afterEach(function () {
            webAppHelper.removeNIElement(localSettings.niControlId);
            localSettings.niType = undefined;
        });
        it('for the boolean LED column element', function (done) {
            testStyleOnColumnElement(done, {
                settings: { kind: BooleanLEDModel.MODEL_KIND },
                values: booleanValues,
                niType: buildNITypeForColumn(NITypeNames.BOOLEAN),
                propertyUnderTest: 'trueBackground',
                propertyValueToSet: 'yellow',
                cssVariableToCheck: '--ni-true-background'
            });
        });
        it('for the string column type', function (done) {
            testStyleOnColumnElement(done, {
                settings: { kind: StringControlModel.MODEL_KIND },
                values: stringValues,
                niType: buildNITypeForColumn(NITypeNames.STRING),
                propertyUnderTest: 'foreground',
                propertyValueToSet: 'red',
                cssVariableToCheck: '--ni-foreground-color'
            });
        });
        it('for the numeric text box column type', function (done) {
            testStyleOnColumnElement(done, {
                settings: { kind: NumericTextBoxModel.MODEL_KIND },
                values: numericValues,
                niType: buildNITypeForColumn(NITypeNames.DOUBLE),
                propertyUnderTest: 'foreground',
                propertyValueToSet: 'red',
                cssVariableToCheck: '--ni-foreground-color'
            });
        });
        it('for the checkbox column type', function (done) {
            testStyleOnColumnElement(done, {
                settings: { kind: CheckBoxModel.MODEL_KIND },
                values: booleanValues,
                niType: buildNITypeForColumn(NITypeNames.BOOLEAN),
                propertyUnderTest: 'foreground',
                propertyValueToSet: 'green',
                cssVariableToCheck: '--ni-foreground-color'
            });
        });
        it('for the slider column type', function (done) {
            testStyleOnColumnElement(done, {
                settings: { kind: SliderModel.MODEL_KIND },
                values: numericValues1,
                niType: buildNITypeForColumn(NITypeNames.DOUBLE),
                propertyUnderTest: 'fill',
                propertyValueToSet: 'yellow',
                cssVariableToCheck: '--ni-fill-background'
            });
        });
        it('for the dropdown column type', function (done) {
            testStyleOnColumnElement(done, {
                settings: { kind: DropDownModel.MODEL_KIND, source: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] },
                values: arrValues,
                niType: buildNITypeForColumn(NITypeNames.INT32),
                propertyUnderTest: 'textAlignment',
                propertyValueToSet: 'center',
                cssVariableToCheck: '--ni-text-align'
            });
        });
    });
});
//# sourceMappingURL=niDataGridViewModel.Test.js.map