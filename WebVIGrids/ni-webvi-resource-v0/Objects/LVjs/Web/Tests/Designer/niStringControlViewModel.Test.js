//****************************************
// Tests for StringControlViewModel class
// National Instruments Copyright 2015
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
describe('A StringControlViewModel', function () {
    'use strict';
    let controlId;
    let viModel, frontPanelControls, controlModel, controlElement, stringSettings, stringUpdateSettings;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.stringSettings.niControlId;
            stringSettings = fixture.stringSettings;
            stringUpdateSettings = fixture.stringUpdateSettings;
            Object.freeze(stringSettings);
            Object.freeze(stringUpdateSettings);
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
        $(document.body).append('<ni-string-control ni-control-id="' + controlId + '"></ni-string-control>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        let viewModel, internalControl;
        beforeEach(function (done) {
            webAppHelper.createNIElement(stringSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
                controlElement = viewModel.element;
                internalControl = controlElement.querySelector('textarea');
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('and has the correct initial values on the model.', function () {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlModel.text).toEqual(stringSettings.text);
            expect(controlModel.readOnly).toEqual(stringSettings.readOnly);
            expect(controlModel.acceptsReturn).toEqual(stringSettings.acceptsReturn);
            expect(controlModel.typeToReplace).toEqual(stringSettings.typeToReplace);
            expect(controlModel.wordWrap).toEqual(stringSettings.wordWrap);
            expect(controlModel.textAlignment).toEqual(stringSettings.textAlignment);
            expect(controlModel.allowHorizontalScrollbar).toEqual(stringSettings.allowHorizontalScrollbar);
            expect(controlModel.allowVerticalScrollbar).toEqual(stringSettings.allowVerticalScrollbar);
        });
        it('and has the correct initial values on the element.', function () {
            const stringControlStyle = window.getComputedStyle(controlElement);
            expect(controlElement.text).toEqual(stringSettings.text);
            expect(controlElement.acceptsReturn).toBe(true);
            expect(controlElement.typeToReplace).toEqual(stringSettings.typeToReplace);
            expect(controlElement.wordWrap).toBe(false);
            expect(controlElement.disabled).toBe(false);
            expect(stringControlStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN)).toEqual(stringSettings.textAlignment);
            expect(stringControlStyle.getPropertyValue(CSS_PROPERTIES.OVERFLOW_X)).toEqual('hidden');
            expect(stringControlStyle.getPropertyValue(CSS_PROPERTIES.OVERFLOW_Y)).toEqual('auto');
        });
        it('and has an internal control with the expected tag name and initial value.', function () {
            expect(internalControl.tagName).toEqual('TEXTAREA');
            expect(internalControl.value).toEqual(stringSettings.text);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, stringUpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.text).toEqual(stringUpdateSettings.text);
                expect(controlModel.readOnly).toEqual(stringUpdateSettings.readOnly);
                expect(controlModel.acceptsReturn).toEqual(stringUpdateSettings.acceptsReturn);
                expect(controlModel.typeToReplace).toEqual(stringUpdateSettings.typeToReplace);
                expect(controlModel.fontSize).toEqual('20px');
                expect(controlModel.fontFamily).toEqual('sans-serif');
                expect(controlModel.fontWeight).toEqual('bold');
                expect(controlModel.fontStyle).toEqual('italic');
                expect(controlModel.wordWrap).toEqual(stringUpdateSettings.wordWrap);
                expect(controlModel.textAlignment).toEqual(stringUpdateSettings.textAlignment);
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
                expect(controlModel.text).toEqual(stringSettings.text);
                expect(controlModel.readOnly).toEqual(stringSettings.readOnly);
                expect(controlModel.acceptsReturn).toEqual(stringSettings.acceptsReturn);
                expect(controlModel.typeToReplace).toEqual(stringSettings.typeToReplace);
            });
        });
        // CAR 702866 : MSEdge + text-align + CSS variables not working
        it('and updates textAlignment property. #FailsEdge', function (done) {
            webAppHelper.dispatchMessage(controlId, { textAlignment: 'center' });
            testHelpers.runAsync(done, function () {
                const stringControlStyle = window.getComputedStyle(controlElement);
                expect(stringControlStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN)).toEqual('center');
                expect(window.getComputedStyle(internalControl).textAlign).toEqual('center');
            });
        });
        it('adds disabled attribute to element', function (done) {
            webAppHelper.dispatchMessage(controlId, { enabled: false });
            testHelpers.runAsync(done, function () {
                expect(controlElement.hasAttribute('disabled')).toEqual(true);
                expect(internalControl.hasAttribute('disabled')).toEqual(true);
            });
        });
        it('and updates scrollbar (overflow) properties.', function (done) {
            webAppHelper.dispatchMessage(controlId, { allowHorizontalScrollbar: false, allowVerticalScrollbar: false });
            testHelpers.runAsync(done, function () {
                const stringControlStyle = window.getComputedStyle(controlElement);
                expect(stringControlStyle.getPropertyValue(CSS_PROPERTIES.OVERFLOW_X)).toEqual('hidden');
                expect(stringControlStyle.getPropertyValue(CSS_PROPERTIES.OVERFLOW_Y)).toEqual('hidden');
                const internalControlStyle = window.getComputedStyle(internalControl);
                expect(internalControlStyle.overflowX).toEqual('hidden');
                expect(internalControlStyle.overflowY).toEqual('hidden');
            });
        });
        it('allows calls to the change event listener to update value.', function () {
            const oldValue = controlModel.text;
            expect(oldValue).toEqual('Editable');
            internalControl.value = 'Testing';
            const event = document.createEvent('Event');
            event.initEvent('change', true, false);
            internalControl.dispatchEvent(event);
            const newValue = controlModel.text;
            expect(newValue).toEqual('Testing');
        });
        it('and retains the old value after a focus + blur with no changes', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                internalControl.focus();
            }, function () {
                internalControl.blur();
            }, function () {
                expect(controlElement.text).toEqual(stringSettings.text);
            });
        });
        it('and reflects foreground (color) to the HTML input.', function (done) {
            const expectedForeground = 'rgb(11, 22, 33)';
            webAppHelper.dispatchMessage(controlId, { foreground: expectedForeground });
            testHelpers.runAsync(done, function () {
                const stringControlStyle = window.getComputedStyle(controlElement);
                expect(stringControlStyle.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR)).toEqual(expectedForeground);
                const internalControlStyle = window.getComputedStyle(internalControl);
                expect(internalControlStyle.color).toEqual(expectedForeground);
            });
        });
    });
});
//# sourceMappingURL=niStringControlViewModel.Test.js.map