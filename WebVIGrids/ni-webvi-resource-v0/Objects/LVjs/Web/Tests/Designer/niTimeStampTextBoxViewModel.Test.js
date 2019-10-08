//****************************************
// Tests for TimeStampTextBoxViewModel class
// National Instruments Copyright 2015
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
import { JQXDateTimeValueConverter } from '../../Framework/ValueConverters/niJQXDateTimeValueConverter.js';
import { NI_SUPPORT } from '../../Framework/niSupport.js';
describe('A TimeStampTextBoxViewModel', function () {
    'use strict';
    let controlId = 'TimeStampTextBoxViewModelId';
    let viModel, frontPanelControls, controlModel, controlElement, timeStampSettings, timeStampUpdateSettings, timeStampIndicatorSettings;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.timeStampSettings.niControlId;
            timeStampSettings = fixture.timeStampSettings;
            timeStampUpdateSettings = fixture.timeStampUpdateSettings;
            timeStampIndicatorSettings = fixture.timeStampIndicatorSettings;
            Object.freeze(timeStampSettings);
            Object.freeze(timeStampUpdateSettings);
            Object.freeze(timeStampIndicatorSettings);
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
        $(document.body).append('<jqx-date-time-picker ni-control-id="' + controlId + '"></jqx-date-time-picker>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(timeStampSettings);
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
            expect(controlModel.visible).toEqual(timeStampSettings.visible);
            expect(controlModel.value).toEqual(timeStampSettings.value);
            expect(controlModel.configuration).toEqual(timeStampSettings.configuration);
            expect(controlModel.readOnly).toEqual(timeStampSettings.readOnly);
            expect(controlModel.minimum).toEqual(timeStampSettings.minimum);
            expect(controlModel.maximum).toEqual(timeStampSettings.maximum);
            expect(controlModel.formatString).toEqual('MM/dd/yyyy hh:mm:ss.fff tt');
            expect(controlModel.showCalendarButton).toEqual(false);
            expect(controlModel.spinButtons).toEqual(false);
            expect(controlModel.textAlignment).toEqual(timeStampSettings.textAlignment);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, timeStampUpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.value).toEqual(timeStampUpdateSettings.value);
                expect(controlModel.readOnly).toEqual(timeStampUpdateSettings.readOnly);
                expect(controlModel.minimum).toEqual(timeStampUpdateSettings.minimum);
                expect(controlModel.maximum).toEqual(timeStampUpdateSettings.maximum);
                expect(controlModel.showCalendarButton).toEqual(timeStampUpdateSettings.showCalendarButton);
                expect(controlModel.spinButtons).toEqual(timeStampUpdateSettings.spinButtons);
                expect(controlModel.formatString).toEqual(timeStampUpdateSettings.formatString);
                expect(controlModel.textAlignment).toEqual(timeStampUpdateSettings.textAlignment);
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
                expect(controlModel.visible).toEqual(timeStampSettings.visible);
                expect(controlModel.value).toEqual(timeStampSettings.value);
                expect(controlModel.configuration).toEqual(timeStampSettings.configuration);
                expect(controlModel.readOnly).toEqual(timeStampSettings.readOnly);
            });
        });
        // CAR 702866 : MSEdge + text-align + CSS variables not working
        it('and updates textAlignment property. #FailsEdge', function (done) {
            webAppHelper.dispatchMessage(controlId, { textAlignment: 'center' });
            testHelpers.runAsync(done, function () {
                const style = window.getComputedStyle(controlElement);
                expect(style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN)).toEqual('center');
                const containerStyle = window.getComputedStyle(controlElement.querySelector('input.jqx-date-time-input'));
                expect(containerStyle.textAlign).toEqual('center');
            });
        });
        it('and reflects foreground (color) to the HTML input.', function (done) {
            const expectedForeground = 'rgb(11, 22, 33)';
            webAppHelper.dispatchMessage(controlId, { foreground: expectedForeground });
            testHelpers.runAsync(done, function () {
                const controlStyle = window.getComputedStyle(controlElement);
                expect(controlStyle.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR)).toEqual(expectedForeground);
                const internalControl = controlElement.querySelector('input');
                const internalControlStyle = window.getComputedStyle(internalControl);
                expect(internalControlStyle.color).toEqual(expectedForeground);
            });
        });
        it('allows calls to the change event to update the value.', function () {
            const oldValue = controlModel.value;
            expect(oldValue).toEqual('2714018400:0');
            const newDate = new window.NITimestamp(new Date(Date.UTC(2010, 11, 31, 11, 59, 59, 987)));
            const newDateTime = JQXDateTimeValueConverter.convert(newDate);
            controlElement.value = newDateTime;
            $(controlElement).trigger($.Event('change', {
                detail: {
                    value: newDateTime
                }
            }));
            const newValue = controlModel.value;
            expect(newValue).toEqual('3376641599:18206936400751327000');
        });
        it('and retains the old value after a focus + blur with no changes', function (done) {
            const inputElement = controlElement.querySelector('input');
            testHelpers.runMultipleAsync(done, function () {
                inputElement.dispatchEvent(new CustomEvent('focus'));
                inputElement.focus();
            }, function () {
                inputElement.dispatchEvent(new CustomEvent('blur'));
                inputElement.blur();
            }, function () {
                const currentValue = JQXDateTimeValueConverter.convertBack(controlElement.value);
                expect(currentValue).toEqual(timeStampSettings.value);
            });
        });
        it('and after cloning the control, min/max/value are correct', function (done) {
            const clonedControl = NI_SUPPORT.cloneControlElement(controlElement);
            const cloneId = NI_SUPPORT.uniqueId();
            clonedControl.setAttribute('ni-control-id', cloneId);
            document.body.appendChild(clonedControl);
            testHelpers.runAsync(done, function () {
                expect(clonedControl.min).toEqual(controlElement.min);
                expect(clonedControl.min.timeZone).toEqual(controlElement.min.timeZone);
                expect(clonedControl.max).toEqual(controlElement.max);
                expect(clonedControl.max.timeZone).toEqual(controlElement.max.timeZone);
                expect(clonedControl.value).toEqual(controlElement.value);
                expect(clonedControl.value.timeZone).toEqual(controlElement.value.timeZone);
                webAppHelper.removeNIElement(cloneId);
            });
        });
    });
    it('is created when the element is an indicator and has the correct initial values.', function (done) {
        webAppHelper.createNIElement(timeStampIndicatorSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            const viewModel = viModel.getControlViewModel(controlId);
            controlElement = viewModel.element;
            expect(controlModel.value).toEqual(timeStampSettings.value);
            expect(controlModel.readOnly).toEqual(true);
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('does not coerce programmatic value changes based on [min, max] -', function () {
        let controlElement, settings;
        beforeEach(function (done) {
            settings = Object.assign({}, timeStampSettings, {
                minimum: '2713996800:0',
                value: '3029529600:0',
                maximum: '3976300800:0' // 1/1/2030
            });
            webAppHelper.createNIElement(settings);
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
            const newValue = '2556230400:0'; // 1/1/1985
            controlModel.value = newValue;
            testHelpers.runAsync(done, function () {
                const elementValue = JQXDateTimeValueConverter.convertBack(controlElement.value);
                expect(elementValue).toEqual(newValue);
            });
        });
        it('setting value > max', function (done) {
            const newValue = '4165603200:0'; // 1/1/2035
            controlModel.value = newValue;
            testHelpers.runAsync(done, function () {
                const elementValue = JQXDateTimeValueConverter.convertBack(controlElement.value);
                expect(elementValue).toEqual(newValue);
            });
        });
        it('no change event fired when current value is outside new [min, max] and value is not coerced', function (done) {
            controlElement.addEventListener('change', function () {
                fail('change event should not be fired');
            });
            controlModel.min = '3345148800:0'; // 1/1/2010 (so currentValue 1/1/2000 is out of range)
            testHelpers.runAsync(done, function () {
                const elementValue = JQXDateTimeValueConverter.convertBack(controlElement.value);
                expect(elementValue).toEqual(settings.value);
            });
        });
    });
    it('\'s element does not coerce the initial value (when added to the page) based on min/max', function (done) {
        $(document.body).append('<jqx-date-time-picker ni-control-id="' + controlId + '" style="width: 10px; height: 10px;" validation="interaction" ' +
            'min="DateTime(\'2010-01-01 00:00:00.000\', \'UTC\')" max="DateTime(\'2030-01-01 00:00:00.000\', \'UTC\')" ' +
            'value="DateTime(\'2000-01-01 00:00:00.000\', \'UTC\')"></jqx-date-time-picker>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel.element.value).toEqual(new JQX.Utilities.DateTime('2000-01-01 00:00:00.000', 'UTC'));
            webAppHelper.removeNIElement(controlId);
        });
    });
});
//# sourceMappingURL=niTimeStampTextBoxViewModel.Test.js.map