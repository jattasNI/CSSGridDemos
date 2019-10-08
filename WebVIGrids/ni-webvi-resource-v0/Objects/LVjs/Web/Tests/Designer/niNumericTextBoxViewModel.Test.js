//****************************************
// Tests for NumericTextBoxViewModel class
// National Instruments Copyright 2014
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
import { JQXNumericValueConverter } from '../../Framework/ValueConverters/niJQXNumericValueConverter.js';
describe('A NumericTextBoxViewModel', function () {
    'use strict';
    const NITypes = window.NITypes;
    let controlId;
    let viModel, frontPanelControls, controlModel, controlElement, numericTextBoxSettings, numericTextBoxUpdateSettings, numericTextBoxInt64Settings, numericTextBoxInt64UpdateSettings, numericTextBoxComplexSettings, numericTextBoxComplexUpdateSettings, numericTextBoxComplexUpdateSettings2, numericTextBoxU32Settings, numericTextBoxU32UpdateSettings, numericTextBoxFullRangeInt64Settings, numericTextBoxFullRangeUInt64Settings;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.numericTextBoxSettings.niControlId;
            numericTextBoxSettings = fixture.numericTextBoxSettings;
            numericTextBoxUpdateSettings = fixture.numericTextBoxUpdateSettings;
            numericTextBoxInt64Settings = fixture.numericTextBoxInt64Settings;
            numericTextBoxInt64UpdateSettings = fixture.numericTextBoxInt64UpdateSettings;
            numericTextBoxComplexSettings = fixture.numericTextBoxComplexSettings;
            numericTextBoxComplexUpdateSettings = fixture.numericTextBoxComplexUpdateSettings;
            numericTextBoxComplexUpdateSettings2 = fixture.numericTextBoxComplexUpdateSettings2;
            numericTextBoxU32Settings = fixture.numericTextBoxU32Settings;
            numericTextBoxU32UpdateSettings = fixture.numericTextBoxU32UpdateSettings;
            numericTextBoxSettings.niType = NITypes.DOUBLE;
            numericTextBoxInt64Settings.niType = NITypes.INT64;
            numericTextBoxComplexSettings.niType = NITypes.COMPLEXDOUBLE;
            numericTextBoxU32Settings.niType = NITypes.UINT32;
            numericTextBoxFullRangeInt64Settings = Object.assign({}, numericTextBoxInt64Settings, numericTextBoxInt64UpdateSettings, { value: '0' });
            numericTextBoxFullRangeInt64Settings.niType = NITypes.INT64;
            numericTextBoxFullRangeUInt64Settings = Object.assign({}, numericTextBoxInt64Settings, fixture.numericTextBoxUInt64UpdateSettings, { value: '0' });
            numericTextBoxFullRangeUInt64Settings.niType = NITypes.UINT64;
            Object.freeze(numericTextBoxSettings);
            Object.freeze(numericTextBoxUpdateSettings);
            Object.freeze(numericTextBoxInt64Settings);
            Object.freeze(numericTextBoxInt64UpdateSettings);
            Object.freeze(numericTextBoxComplexSettings);
            Object.freeze(numericTextBoxComplexUpdateSettings);
            Object.freeze(numericTextBoxComplexUpdateSettings2);
            Object.freeze(numericTextBoxU32Settings);
            Object.freeze(numericTextBoxU32UpdateSettings);
            Object.freeze(numericTextBoxFullRangeInt64Settings);
            Object.freeze(numericTextBoxFullRangeUInt64Settings);
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
        domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page.', function (done) {
        $(document.body).append('<jqx-numeric-text-box ni-control-id="' + controlId + '"></jqx-numeric-text-box>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(numericTextBoxSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
                controlElement = viewModel.element;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('and has the correct initial values.', function () {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlModel.minimum).toEqual(numericTextBoxSettings.minimum);
            expect(controlModel.maximum).toEqual(numericTextBoxSettings.maximum);
            expect(controlModel.interval).toEqual(numericTextBoxSettings.interval);
            expect(controlModel.significantDigits).toEqual(numericTextBoxSettings.significantDigits);
            expect(controlModel.precisionDigits).toEqual(numericTextBoxSettings.precisionDigits);
            expect(controlModel.format).toEqual(numericTextBoxSettings.format);
            expect(controlModel.value).toEqual(numericTextBoxSettings.value);
            expect(controlModel.spinButtonsPosition).toEqual(numericTextBoxSettings.spinButtonsPosition);
            expect(controlModel.spinButtons).toEqual(numericTextBoxSettings.spinButtons);
            expect(controlModel.textAlignment).toEqual(numericTextBoxSettings.textAlignment);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, numericTextBoxUpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.minimum).toEqual(numericTextBoxUpdateSettings.minimum);
                expect(controlModel.maximum).toEqual(numericTextBoxUpdateSettings.maximum);
                expect(controlModel.interval).toEqual(numericTextBoxUpdateSettings.interval);
                expect(controlModel.significantDigits).toEqual(numericTextBoxUpdateSettings.significantDigits);
                expect(controlModel.precisionDigits).toEqual(numericTextBoxUpdateSettings.precisionDigits);
                expect(controlModel.format).toEqual(numericTextBoxUpdateSettings.format);
                expect(controlModel.value).toEqual(numericTextBoxUpdateSettings.value);
                expect(controlModel.spinButtonsPosition).toEqual(numericTextBoxUpdateSettings.spinButtonsPosition);
                expect(controlModel.spinButtons).toEqual(numericTextBoxUpdateSettings.spinButtons);
                expect(controlModel.fontSize).toEqual('20px');
                expect(controlModel.fontFamily).toEqual('sans-serif');
                expect(controlModel.fontWeight).toEqual('bold');
                expect(controlModel.fontStyle).toEqual('italic');
                expect(controlModel.textAlignment).toEqual(numericTextBoxUpdateSettings.textAlignment);
            });
        });
        it('and handles unknown property changes.', function (done) {
            const unknownSettings = {
                unknown: 'unknown'
            };
            const sendUnknownProperties = function () {
                webAppHelper.dispatchMessage(controlId, unknownSettings);
            };
            expect(sendUnknownProperties).toThrow();
            testHelpers.runAsync(done, function () {
                expect(controlModel.minimum).toEqual(numericTextBoxSettings.minimum);
                expect(controlModel.maximum).toEqual(numericTextBoxSettings.maximum);
                expect(controlModel.interval).toEqual(numericTextBoxSettings.interval);
                expect(controlModel.significantDigits).toEqual(numericTextBoxSettings.significantDigits);
                expect(controlModel.precisionDigits).toEqual(numericTextBoxSettings.precisionDigits);
                expect(controlModel.format).toEqual(numericTextBoxSettings.format);
                expect(controlModel.value).toEqual(numericTextBoxSettings.value);
            });
        });
        it('allows to call the setGPropertyValue method to handle unknown model property', function () {
            const sendUnknownProperty = function () {
                viewModel.setGPropertyValue('Unknown', 'value');
            };
            expect(sendUnknownProperty).toThrow();
        });
        it('allows to call the getGPropertyValue method to handle unknown model property', function () {
            const getValueOfUnknownProperty = function () {
                viewModel.getGPropertyValue('Unknown');
            };
            expect(getValueOfUnknownProperty).toThrow();
        });
        // CAR 702866 : MSEdge + text-align + CSS variables not working
        it('and updates textAlignment property. #FailsEdge', function (done) {
            webAppHelper.dispatchMessage(controlId, { textAlignment: 'left' });
            testHelpers.runAsync(done, function () {
                const controlStyle = window.getComputedStyle(controlElement);
                expect(controlStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN)).toEqual('left');
                const inputContainerStyle = window.getComputedStyle(controlElement.querySelector("input.jqx-numeric-text-box-component"));
                expect(inputContainerStyle.textAlign).toEqual('left');
            });
        });
        it('adds disable attribute to element', function (done) {
            const numericTextBoxUpdateSettings = {};
            numericTextBoxUpdateSettings.enabled = false;
            webAppHelper.dispatchMessage(controlId, numericTextBoxUpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlElement.hasAttribute('disabled')).toEqual(true);
            });
        });
        it('and reflects foreground (color) to the HTML input.', function (done) {
            const expectedForeground = 'rgb(11, 22, 33)';
            webAppHelper.dispatchMessage(controlId, { foreground: expectedForeground });
            testHelpers.runAsync(done, function () {
                const controlStyle = window.getComputedStyle(controlElement);
                expect(controlStyle.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR)).toEqual(expectedForeground);
                const inputElement = controlElement.querySelector('input');
                const internalControlStyle = window.getComputedStyle(inputElement);
                expect(internalControlStyle.color).toEqual(expectedForeground);
            });
        });
        it('and retains the old value after a focus + blur with no changes', function (done) {
            testHelpers.jqxInputFocusUpdateAndBlur(() => {
                const currentValue = JQXNumericValueConverter.convertBack(controlElement.value, numericTextBoxSettings.niType);
                expect(currentValue).toEqual(numericTextBoxSettings.value);
                done();
            }, controlElement);
        });
    });
    describe('exists after the custom element is created using the int64 data type', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(numericTextBoxInt64Settings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
                controlElement = viewModel.element;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('and has the correct initial values.', function () {
            expect(controlModel.minimum).toEqual(numericTextBoxInt64Settings.minimum);
            expect(controlModel.maximum).toEqual(numericTextBoxInt64Settings.maximum);
            expect(controlModel.interval).toEqual(numericTextBoxInt64Settings.interval);
            expect(controlModel.value).toEqual(numericTextBoxInt64Settings.value);
            expect(controlModel.niType).toEqual(numericTextBoxInt64Settings.niType);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, numericTextBoxInt64UpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.minimum).toEqual(numericTextBoxInt64UpdateSettings.minimum);
                expect(controlModel.maximum).toEqual(numericTextBoxInt64UpdateSettings.maximum);
                expect(controlModel.interval).toEqual(numericTextBoxInt64UpdateSettings.interval);
                expect(controlModel.value).toEqual(numericTextBoxInt64UpdateSettings.value);
            });
        });
    });
    describe('exists after the custom element is created using the complex data type', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(numericTextBoxComplexSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
                controlElement = viewModel.element;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('and has the correct initial values.', function () {
            expect(controlModel.minimum).toEqual(numericTextBoxComplexSettings.minimum);
            expect(controlModel.maximum).toEqual(numericTextBoxComplexSettings.maximum);
            expect(controlModel.interval).toEqual(numericTextBoxComplexSettings.interval);
            expect(controlModel.value).toEqual(numericTextBoxComplexSettings.value);
            expect(controlModel.niType).toEqual(numericTextBoxComplexSettings.niType);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, numericTextBoxComplexUpdateSettings);
            webAppHelper.dispatchMessage(controlId, numericTextBoxComplexUpdateSettings2);
            testHelpers.runAsync(done, function () {
                expect(controlModel.minimum).toEqual(numericTextBoxComplexUpdateSettings.minimum);
                expect(controlModel.maximum).toEqual(numericTextBoxComplexUpdateSettings.maximum);
                expect(controlModel.interval).toEqual(numericTextBoxComplexUpdateSettings.interval);
                expect(controlModel.value).toEqual(numericTextBoxComplexUpdateSettings2.value);
            });
        });
    });
    describe('exists after the custom element is created using unsigned 32-bit data type', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(numericTextBoxU32Settings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
                controlElement = viewModel.element;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('and has the correct initial values.', function () {
            expect(controlModel.minimum).toEqual(numericTextBoxU32Settings.minimum);
            expect(controlModel.maximum).toEqual(numericTextBoxU32Settings.maximum);
            expect(controlModel.interval).toEqual(numericTextBoxU32Settings.interval);
            expect(controlModel.value).toEqual(numericTextBoxU32Settings.value);
            expect(controlModel.niType).toEqual(numericTextBoxU32Settings.niType);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, numericTextBoxU32UpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.minimum).toEqual(numericTextBoxU32UpdateSettings.minimum);
                expect(controlModel.maximum).toEqual(numericTextBoxU32UpdateSettings.maximum);
                expect(controlModel.interval).toEqual(numericTextBoxU32UpdateSettings.interval);
                expect(controlModel.value).toEqual(numericTextBoxU32UpdateSettings.value);
            });
        });
    });
    describe('does not coerce programmatic value changes based on [min, max] -', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElement(numericTextBoxSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                const viewModel = viModel.getControlViewModel(controlId);
                controlElement = viewModel.element;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('setting value < min', function (done) {
            controlModel.value = -1; // (Configured minimum is 0)
            testHelpers.runAsync(done, function () {
                expect(controlElement.value).toEqual('-1');
            });
        });
        it('setting value > max', function (done) {
            controlModel.value = 99; // (Configured maximum is 10)
            testHelpers.runAsync(done, function () {
                expect(controlElement.value).toEqual('99');
            });
        });
        it('no change event fired when current value is outside new [min, max] and value is not coerced', function (done) {
            controlElement.addEventListener('change', function () {
                fail('change event should not be fired');
            });
            controlModel.min = 8; // (Current value is 5, so current value now outside [min, max])
            testHelpers.runAsync(done, function () {
                expect(controlElement.value).toEqual('5');
            });
        });
    });
    it('\'s element does not coerce the initial value (when added to the page) based on min/max', function (done) {
        $(document.body).append('<jqx-numeric-text-box ni-control-id="' + controlId + '" validation="interaction" min="5" max="10" value="2"></jqx-numeric-text-box>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel.element.value).toEqual('2');
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('keeps full precision for 64-bit integer values', function () {
        const createControl = function (done, numericSettings) {
            webAppHelper.createNIElement(numericSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                const viewModel = viModel.getControlViewModel(controlId);
                controlElement = viewModel.element;
            });
        };
        afterEach(function () {
            webAppHelper.removeNIElement(numericTextBoxInt64Settings.niControlId);
        });
        describe('for type = Int64', function () {
            beforeEach(function (done) {
                createControl(done, numericTextBoxFullRangeInt64Settings);
            });
            it('when newValue = Int64.MinValue', function (done) {
                testHelpers.jqxInputFocusUpdateAndBlur(() => {
                    expect(controlModel.value).toEqual('-9223372036854775808');
                    done();
                }, controlElement, '-9223372036854775808');
            });
            it('when newValue = Int64.MaxValue', function (done) {
                testHelpers.jqxInputFocusUpdateAndBlur(() => {
                    expect(controlModel.value).toEqual('9223372036854775807');
                    done();
                }, controlElement, '9223372036854775807');
            });
            it('when newValue is near Int64.MinValue, specified as floating point', function (done) {
                testHelpers.jqxInputFocusUpdateAndBlur(() => {
                    expect(controlModel.value).toEqual('-9223372036854775801');
                    done();
                }, controlElement, '-9223372036854775800.9');
            });
            it('when newValue is near Int64.MaxValue, specified as floating point (rounding down)', function (done) {
                testHelpers.jqxInputFocusUpdateAndBlur(() => {
                    expect(controlModel.value).toEqual('9223372036854775800');
                    done();
                }, controlElement, '9223372036854775800.1');
            });
            it('when newValue is near Int64.MaxValue, specified as floating point (rounding up)', function (done) {
                testHelpers.jqxInputFocusUpdateAndBlur(() => {
                    expect(controlModel.value).toEqual('9223372036854775801');
                    done();
                }, controlElement, '9223372036854775800.9');
            });
        });
        describe('for type = UInt64', function () {
            beforeEach(function (done) {
                createControl(done, numericTextBoxFullRangeUInt64Settings);
            });
            it('when newValue = UInt64.MinValue', function (done) {
                testHelpers.jqxInputFocusUpdateAndBlur(() => {
                    expect(controlModel.value).toEqual('0');
                    done();
                }, controlElement, '0');
            });
            it('when newValue = UInt64.MaxValue', function (done) {
                testHelpers.jqxInputFocusUpdateAndBlur(() => {
                    expect(controlModel.value).toEqual('18446744073709551615');
                    done();
                }, controlElement, '18446744073709551615');
            });
            it('when newValue is near UInt64.MinValue, specified as floating point', function (done) {
                testHelpers.jqxInputFocusUpdateAndBlur(() => {
                    expect(controlModel.value).toEqual('0');
                    done();
                }, controlElement, '0.1');
            });
            it('when newValue is near UInt64.MaxValue, specified as floating point (rounding down)', function (done) {
                testHelpers.jqxInputFocusUpdateAndBlur(() => {
                    expect(controlModel.value).toEqual('18446744073709551610');
                    done();
                }, controlElement, '18446744073709551610.1');
            });
            it('when newValue is near UInt64.MaxValue, specified as floating point (rounding up)', function (done) {
                testHelpers.jqxInputFocusUpdateAndBlur(() => {
                    expect(controlModel.value).toEqual('18446744073709551611');
                    done();
                }, controlElement, '18446744073709551610.9');
            });
        });
    });
});
//# sourceMappingURL=niNumericTextBoxViewModel.Test.js.map