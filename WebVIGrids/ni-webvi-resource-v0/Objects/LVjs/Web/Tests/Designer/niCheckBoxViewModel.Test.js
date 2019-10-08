//****************************************
// Tests for CheckBoxViewModel class
// National Instruments Copyright 2015
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
import { VIReferenceService as viReferenceService } from '../../Framework/niVIReferenceService.js';
describe('A CheckBoxViewModel', function () {
    'use strict';
    let controlId;
    let viModel, frontPanelControls, controlModel, controlElement, inputElement, labelElement, checkBoxSettings, checkBoxUpdateSettings, checkBoxCommentContentSettings, checkBoxViewModel;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.checkBoxSettings.niControlId;
            checkBoxSettings = fixture.checkBoxSettings;
            checkBoxUpdateSettings = fixture.checkBoxUpdateSettings;
            checkBoxCommentContentSettings = fixture.checkBoxCommentContentSettings;
            Object.freeze(checkBoxSettings);
            Object.freeze(checkBoxUpdateSettings);
            Object.freeze(checkBoxCommentContentSettings);
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
        $(document.body).append('<jqx-check-box ni-control-id="' + controlId + '"></jqx-check-box>');
        testHelpers.runAsync(done, function () {
            checkBoxViewModel = viModel.getControlViewModel(controlId);
            expect(checkBoxViewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElement(checkBoxSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                checkBoxViewModel = viModel.getControlViewModel(controlId);
                controlElement = checkBoxViewModel.element;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('and has the correct initial values.', function () {
            expect(controlModel).toBeDefined();
            expect(checkBoxViewModel).toBeDefined();
            expect(controlModel.value).toEqual(checkBoxSettings.value);
            expect(controlModel.contentVisible).toEqual(checkBoxSettings.contentVisible);
            expect(controlModel.content).toEqual(checkBoxSettings.content);
            expect(controlModel.clickMode).toEqual(checkBoxSettings.clickMode);
            expect(controlModel.momentary).toEqual(checkBoxSettings.momentary);
            expect(controlModel.readOnly).toEqual(checkBoxSettings.readOnly);
            expect(controlModel.textAlignment).toEqual(checkBoxSettings.textAlignment);
            expect(controlModel.trueBackground).toEqual(checkBoxSettings.trueBackground);
            expect(controlModel.falseBackground).toEqual(checkBoxSettings.falseBackground);
            expect(controlModel.textColor).toEqual(checkBoxSettings.textColor);
            expect(controlModel.checkMarkColor).toEqual(checkBoxSettings.checkMarkColor);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, checkBoxUpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.value).toEqual(checkBoxUpdateSettings.value);
                expect(controlModel.contentVisible).toEqual(checkBoxUpdateSettings.contentVisible);
                expect(controlModel.content).toEqual(checkBoxUpdateSettings.content);
                expect(controlModel.clickMode).toEqual(checkBoxUpdateSettings.clickMode);
                expect(controlModel.momentary).toEqual(checkBoxUpdateSettings.momentary);
                expect(controlModel.fontSize).toEqual('20px');
                expect(controlModel.fontFamily).toEqual('sans-serif');
                expect(controlModel.fontWeight).toEqual('bold');
                expect(controlModel.fontStyle).toEqual('italic');
                expect(controlModel.readOnly).toEqual(checkBoxUpdateSettings.readOnly);
                expect(controlModel.textAlignment).toEqual(checkBoxUpdateSettings.textAlignment);
                expect(controlModel.trueBackground).toEqual(checkBoxUpdateSettings.trueBackground);
                expect(controlModel.falseBackground).toEqual(checkBoxUpdateSettings.falseBackground);
                expect(controlModel.textColor).toEqual(checkBoxUpdateSettings.textColor);
                expect(controlModel.checkMarkColor).toEqual(checkBoxUpdateSettings.checkMarkColor);
            });
        });
        it('and allows content to contain html comment.', function (done) {
            webAppHelper.dispatchMessage(controlId, { content: '<span class="ni-text"><!-- Comment Off/On --></span>' });
            testHelpers.runAsync(done, function () {
                expect(controlModel.content).toEqual(checkBoxCommentContentSettings.content);
            });
        });
        it('and handles unknown property changes.', function () {
            const unknownSettings = {
                unknown: 'unknown'
            };
            const sendUnknownProperties = function () {
                webAppHelper.dispatchMessage(controlId, unknownSettings);
            };
            expect(sendUnknownProperties).toThrow();
        });
        // CAR 702866 : MSEdge + text-align + CSS variables not working
        /*
        // CAR 705613
        it('and update textAlignment property. #FailsEdge', function (done) {
            webAppHelper.dispatchMessage(controlId, { textAlignment: 'center' });

            testHelpers.runAsync(done, function () {
                let controlStyle = window.getComputedStyle(controlElement);
                expect(controlStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN)).toEqual('center');

                let containerStyle = window.getComputedStyle(controlElement.querySelector('jqx-check-box > div'));
                expect(containerStyle.textAlign).toEqual('center');
            });
        });
        */
        it('and updates trueBackground, falseBackground, checkMarkColor and textColor properties on element.', function (done) {
            testHelpers.disablePointerEvents(controlElement);
            const newValues = {
                trueBackground: 'linear-gradient(45.5deg, rgb(170, 0, 204) 0%, rgb(166, 166, 166) 100%)',
                falseBackground: 'yellow',
                textColor: 'red',
                checkMarkColor: 'blue'
            };
            webAppHelper.dispatchMessage(controlId, newValues);
            testHelpers.runMultipleAsync(done, function () {
                const style = window.getComputedStyle(controlElement);
                expect(style.getPropertyValue(CSS_PROPERTIES.TRUE_BACKGROUND)).toEqual(newValues.trueBackground);
                expect(style.getPropertyValue(CSS_PROPERTIES.FALSE_BACKGROUND)).toEqual(newValues.falseBackground);
                expect(style.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR)).toEqual(newValues.textColor);
                expect(style.getPropertyValue(CSS_PROPERTIES.CHECK_MARK_COLOR)).toEqual(newValues.checkMarkColor);
                const falseBackgroundStyle = window.getComputedStyle(controlElement.querySelector('.jqx-input'));
                expect(falseBackgroundStyle.backgroundColor).toContain('rgb(255, 255, 0)');
                const textLabelStyle = window.getComputedStyle(controlElement.querySelector('.jqx-label'));
                expect(textLabelStyle.color).toContain('rgb(255, 0, 0)');
                controlElement.checked = true;
            }, function () {
                const trueInputStyle = window.getComputedStyle(controlElement.querySelector('.jqx-input'));
                expect(trueInputStyle.backgroundImage).toContain(newValues.trueBackground);
                expect(trueInputStyle.color).toContain('rgb(0, 0, 255)');
            });
        });
    });
    it('can be created as an indicator', function (done) {
        const localSettings = Object.assign({}, checkBoxSettings);
        localSettings.readOnly = true;
        webAppHelper.createNIElement(localSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            checkBoxViewModel = viModel.getControlViewModel(controlId);
            expect(controlModel).toBeDefined();
            expect(checkBoxViewModel).toBeDefined();
            expect(controlModel.value).toEqual(localSettings.value);
            expect(controlModel.contentVisible).toEqual(localSettings.contentVisible);
            expect(controlModel.content).toEqual(localSettings.content);
            expect(controlModel.clickMode).toEqual(localSettings.clickMode);
            expect(controlModel.momentary).toEqual(localSettings.momentary);
            expect(controlModel.readOnly).toEqual(localSettings.readOnly);
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('allows simulated clicks to update the value', function () {
        it('on the checkbox.', function (done) {
            webAppHelper.createNIElement(checkBoxSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                checkBoxViewModel = viModel.getControlViewModel(controlId);
                expect(checkBoxViewModel).toBeDefined();
                controlElement = checkBoxViewModel.element;
                inputElement = controlElement.querySelector('.jqx-input');
                expect(inputElement).toBeDefined();
                expect(controlModel.value).toEqual(checkBoxSettings.value);
                expect(controlElement.checked).toEqual(checkBoxSettings.value);
                controlElement._downHandler({ originalEvent: { target: inputElement }, preventDefault: function () { }, stopPropagation: function () { } });
                controlElement._documentUpHandler({ originalEvent: { target: inputElement }, preventDefault: function () { }, stopPropagation: function () { } });
                expect(controlModel.value).toEqual(!checkBoxSettings.value);
                expect(controlElement.checked).toEqual(!checkBoxSettings.value);
                webAppHelper.removeNIElement(controlId);
            });
        });
        it('on the label.', function (done) {
            webAppHelper.createNIElement(checkBoxSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                checkBoxViewModel = viModel.getControlViewModel(controlId);
                expect(checkBoxViewModel).toBeDefined();
                controlElement = checkBoxViewModel.element;
                labelElement = controlElement.querySelector('.jqx-label');
                expect(labelElement).toBeDefined();
                expect(controlModel.value).toEqual(checkBoxSettings.value);
                expect(controlElement.checked).toEqual(checkBoxSettings.value);
                controlElement._downHandler({ originalEvent: { target: labelElement }, preventDefault: function () { }, stopPropagation: function () { } });
                controlElement._documentUpHandler({ originalEvent: { target: labelElement }, preventDefault: function () { }, stopPropagation: function () { } });
                expect(controlModel.value).toEqual(!checkBoxSettings.value);
                expect(controlElement.checked).toEqual(!checkBoxSettings.value);
                webAppHelper.removeNIElement(controlId);
            });
        });
    });
    it('does not change the value if it is readOnly and user clicks on it', function (done) {
        const localSettings = Object.assign({}, checkBoxSettings);
        localSettings.readOnly = true;
        webAppHelper.createNIElement(localSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            checkBoxViewModel = viModel.getControlViewModel(controlId);
            expect(checkBoxViewModel).toBeDefined();
            controlElement = checkBoxViewModel.element;
            // Initial check
            expect(controlModel.value).toEqual(localSettings.value);
            // Need to use simulate since mechanical actions fires on addEventListener events, not bind events
            $(controlElement).simulate('mousedown');
            expect(controlModel.value).toEqual(localSettings.value);
            // Value should not change regardless of clicks.
            $(controlElement).simulate('click');
            expect(controlModel.value).toEqual(localSettings.value);
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('can be created with contentVisible set to false.', function (done) {
        const localSettings = Object.assign({}, checkBoxSettings);
        localSettings.contentVisible = false;
        localSettings.content = '<span class="ni-text ni-hidden">on/off</span>';
        webAppHelper.createNIElement(localSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            checkBoxViewModel = viModel.getControlViewModel(controlId);
            expect(checkBoxViewModel).toBeDefined();
            controlElement = checkBoxViewModel.element;
            expect(controlModel.contentVisible).toEqual(false);
            const labelText = controlElement.querySelector('.ni-text');
            expect(labelText.classList.contains('ni-hidden')).toEqual(true);
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('can be created with the value set to false.', function (done) {
        const localSettings = Object.assign({}, checkBoxSettings);
        localSettings.value = true;
        webAppHelper.createNIElement(localSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            checkBoxViewModel = viModel.getControlViewModel(controlId);
            expect(checkBoxViewModel).toBeDefined();
            controlElement = checkBoxViewModel.element;
            expect(controlElement.checked).toEqual(true);
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('if it is an indicator and in edit time', function () {
        beforeEach(function () {
            viReferenceService.getWebAppModelByVIRef('').updateService.setIdeMode(true);
        });
        afterEach(function () {
            viReferenceService.getWebAppModelByVIRef('').updateService.setIdeMode(false);
        });
        it('does change the value and user clicks on it', function (done) {
            webAppHelper.createNIElement(checkBoxSettings);
            testHelpers.runMultipleAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                checkBoxViewModel = viModel.getControlViewModel(controlId);
            }, function () {
                controlElement = checkBoxViewModel.element;
                inputElement = controlElement.querySelector('.jqx-input');
                controlModel.readOnly = true;
            }, function () {
                controlElement._downHandler({
                    originalEvent: { target: inputElement },
                    preventDefault: function () { },
                    stopPropagation: function () { }
                });
                controlElement._documentUpHandler({
                    originalEvent: { target: inputElement },
                    preventDefault: function () { },
                    stopPropagation: function () { }
                });
                expect(controlModel.value).toEqual(!checkBoxSettings.value);
                expect(controlElement.checked).toEqual(!checkBoxSettings.value);
                webAppHelper.removeNIElement(controlId);
            });
        });
    });
});
//# sourceMappingURL=niCheckBoxViewModel.Test.js.map