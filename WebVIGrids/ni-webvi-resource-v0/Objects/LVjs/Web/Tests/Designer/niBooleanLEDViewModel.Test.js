//****************************************
// Tests for BooleanButtonModel class
// National Instruments Copyright 2014
//****************************************
import { BooleanControlModel } from '../../Modeling/niBooleanControlModel.js';
import { BooleanLEDModel } from '../../Modeling/niBooleanLEDModel.js';
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
import { VIReferenceService as viReferenceService } from '../../Framework/niVIReferenceService.js';
describe('A BooleanLEDViewModel', function () {
    'use strict';
    let viModel, frontPanelControls, buttonModel, buttonElement, booleanLEDViewModel;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, booleanLedSettings;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.booleanLedSettings.niControlId;
            booleanLedSettings = fixture.booleanLedSettings;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function () {
        booleanLedSettings.value = false;
        booleanLedSettings.shape = BooleanLEDModel.ShapeEnum.ROUND;
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('allows creation with false value to create falseContent', function (done) {
        booleanLedSettings.value = false;
        booleanLedSettings.falseContent = '<span class="jqx-false-content">falseContent</span>';
        webAppHelper.createNIElement(booleanLedSettings);
        testHelpers.runMultipleAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            buttonModel = frontPanelControls[controlId];
            expect(buttonModel).toBeDefined();
            booleanLEDViewModel = viModel.getControlViewModel(controlId);
            expect(booleanLEDViewModel).toBeDefined();
            buttonElement = booleanLEDViewModel.element;
        }, function () {
            const falseSpan = buttonElement.querySelector('.jqx-false-content');
            const content = falseSpan.textContent;
            expect(content).toEqual('falseContent');
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('allows creation with true value to create trueContent', function (done) {
        booleanLedSettings.value = true;
        booleanLedSettings.trueContent = '<span class="jqx-true-content">trueContent</span>';
        webAppHelper.createNIElement(booleanLedSettings);
        testHelpers.runMultipleAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            buttonModel = frontPanelControls[controlId];
            expect(buttonModel).toBeDefined();
            booleanLEDViewModel = viModel.getControlViewModel(controlId);
            expect(booleanLEDViewModel).toBeDefined();
            buttonElement = booleanLEDViewModel.element;
        }, function () {
            const trueSpan = buttonElement.querySelector('.jqx-true-content');
            const content = trueSpan.textContent;
            expect(content).toEqual('trueContent');
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('allows creation with shape set to square', function (done) {
        booleanLedSettings.value = true;
        booleanLedSettings.shape = BooleanLEDModel.ShapeEnum.SQUARE;
        webAppHelper.createNIElement(booleanLedSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            buttonModel = frontPanelControls[controlId];
            expect(buttonModel).toBeDefined();
            expect(buttonModel.shape).toEqual(BooleanLEDModel.ShapeEnum.SQUARE);
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('dynamically updates properties triggering ModelPropertyChanged', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElement(booleanLedSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                buttonModel = frontPanelControls[controlId];
                booleanLEDViewModel = viModel.getControlViewModel(controlId);
                buttonElement = booleanLEDViewModel.element;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('first verifies initial values', function () {
            expect(buttonModel).toBeDefined();
            expect(booleanLEDViewModel).toBeDefined();
            expect(buttonElement.querySelector('.jqx-false-content').textContent).toEqual('falseContent');
            expect(buttonModel.momentary).toEqual(false);
            expect(buttonModel.clickMode).toEqual(BooleanControlModel.ClickModeEnum.PRESS);
            expect(buttonElement.hasAttribute('disabled')).toEqual(false);
        });
        it('updates value', function (done) {
            const updateSettings = {};
            updateSettings.value = true;
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(buttonElement.querySelector('.jqx-true-content').textContent).toEqual('trueContent');
            });
        });
        it('updates true content', function (done) {
            const updateSettings = {};
            updateSettings.value = true;
            updateSettings.trueContent = '<span class="jqx-true-content">this is all true</span>';
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(buttonElement.querySelector('.jqx-true-content').textContent).toEqual('this is all true');
            });
        });
        it('allows false content to contain HTML comment', function (done) {
            const updateSettings = {};
            updateSettings.falseContent = '<span class="jqx-false-content"><!-- falseContentComment --></span>';
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(buttonElement.querySelector('.jqx-false-content-container').innerHTML).toEqual('<span class="jqx-false-content"><!-- falseContentComment --></span>');
            });
        });
        it('allows true content to contain HTML comment', function (done) {
            const updateSettings = {};
            updateSettings.value = true;
            updateSettings.trueContent = '<span class="jqx-true-content"><!-- trueContentComment --></span>';
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(buttonElement.querySelector('.jqx-true-content-container').innerHTML).toEqual('<span class="jqx-true-content"><!-- trueContentComment --></span>');
            });
        });
        it('adds disable attribute to element', function (done) {
            const updateSettings = {};
            updateSettings.enabled = false;
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(buttonElement.hasAttribute('disabled')).toEqual(true);
            });
        });
        it('updates color states for trueBackground, falseBackground, trueForeground, falseForeground', function (done) {
            testHelpers.disablePointerEvents(buttonElement);
            const updateSettings = {};
            updateSettings.trueBackground = 'white';
            updateSettings.trueForeground = 'green';
            updateSettings.falseBackground = 'yellow';
            updateSettings.falseForeground = 'red';
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runMultipleAsync(done, function () {
                const buttonElementStyle = window.getComputedStyle(buttonElement);
                expect(buttonElementStyle.getPropertyValue(CSS_PROPERTIES.TRUE_BACKGROUND)).toContain('white');
                expect(buttonElementStyle.getPropertyValue(CSS_PROPERTIES.TRUE_FOREGROUND_COLOR)).toEqual('green');
                expect(buttonElementStyle.getPropertyValue(CSS_PROPERTIES.FALSE_BACKGROUND)).toContain('yellow');
                expect(buttonElementStyle.getPropertyValue(CSS_PROPERTIES.FALSE_FOREGROUND_COLOR)).toEqual('red');
                const containerStyleFalse = window.getComputedStyle(buttonElement.querySelector('.jqx-container'));
                expect(containerStyleFalse.backgroundColor).toContain('rgb(255, 255, 0)');
                expect(containerStyleFalse.color).toEqual('rgb(255, 0, 0)');
                const setTrueUpdateSettings = { value: true };
                webAppHelper.dispatchMessage(controlId, setTrueUpdateSettings);
            }, function () {
                const containerStyleTrue = window.getComputedStyle(buttonElement.querySelector('.jqx-container'));
                expect(containerStyleTrue.backgroundColor).toContain('rgb(255, 255, 255)');
                expect(containerStyleTrue.color).toEqual('rgb(0, 128, 0)');
            });
        });
        it('updates gradient color status for trueBackground, falseBackground', function (done) {
            testHelpers.disablePointerEvents(buttonElement);
            const updateSettings = {};
            updateSettings.trueBackground = "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(248, 148, 28) 100%)";
            updateSettings.falseBackground = "linear-gradient(90deg, rgb(255, 202, 215) 0%, rgb(202, 234, 156) 100%)";
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runMultipleAsync(done, function () {
                const buttonElementStyle = window.getComputedStyle(buttonElement);
                expect(buttonElementStyle.getPropertyValue(CSS_PROPERTIES.TRUE_BACKGROUND)).toContain("linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(248, 148, 28) 100%)");
                expect(buttonElementStyle.getPropertyValue(CSS_PROPERTIES.FALSE_BACKGROUND)).toContain("linear-gradient(90deg, rgb(255, 202, 215) 0%, rgb(202, 234, 156) 100%)");
                const containerStyleFalse = window.getComputedStyle(buttonElement.querySelector('.jqx-container'));
                expect(containerStyleFalse.backgroundImage).toContain("linear-gradient(90deg, rgb(255, 202, 215) 0%, rgb(202, 234, 156) 100%)");
                const setTrueUpdateSettings = { value: true };
                webAppHelper.dispatchMessage(controlId, setTrueUpdateSettings);
            }, function () {
                const containerStyleTrue = window.getComputedStyle(buttonElement.querySelector('.jqx-container'));
                expect(containerStyleTrue.backgroundImage).toContain("linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(248, 148, 28) 100%)");
            });
        });
        it('updates content visible to false', function (done) {
            const updateSettings = {};
            updateSettings.trueContent = '<span class="jqx-true-content ni-hidden">trueContent</span>';
            updateSettings.falseContent = '<span class="jqx-false-content ni-hidden">falseContent</span>';
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(buttonElement.querySelector('.jqx-false-content').classList.contains('ni-hidden')).toEqual(true);
                expect(buttonElement.querySelector('.jqx-true-content').classList.contains('ni-hidden')).toEqual(true);
            });
        });
        it('updates content visible to true', function (done) {
            const updateSettings = {};
            updateSettings.value = true;
            booleanLedSettings.trueContent = '<span class="jqx-true-content">trueContent</span>';
            booleanLedSettings.falseContent = '<span class="jqx-false-content">falseContent</span>';
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(buttonElement.querySelector('.jqx-false-content').classList.contains('ni-hidden')).toEqual(false);
                expect(buttonElement.querySelector('.jqx-true-content').classList.contains('ni-hidden')).toEqual(false);
            });
        });
        it('updates shape to square', function (done) {
            const updateSettings = {};
            updateSettings.shape = BooleanLEDModel.ShapeEnum.SQUARE;
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(buttonModel.shape).toEqual(BooleanLEDModel.ShapeEnum.SQUARE);
            });
        });
        it('updates value, clickMode, momentary', function (done) {
            const updateSettings = {};
            updateSettings.value = false;
            updateSettings.clickMode = BooleanControlModel.ClickModeEnum.RELEASE;
            updateSettings.momentary = true;
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(buttonModel.momentary).toEqual(true);
                expect(buttonModel.clickMode).toEqual(BooleanControlModel.ClickModeEnum.RELEASE);
            });
        });
        it('updates readOnly', function (done) {
            webAppHelper.dispatchMessage(controlId, { readOnly: true });
            testHelpers.runAsync(done, function () {
                expect(buttonModel.readOnly).toEqual(true);
                expect(buttonElement.hasAttribute('readonly')).toEqual(true);
            });
        });
    });
    it('allows to call the click event updates value', function (done) {
        webAppHelper.createNIElement(booleanLedSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            buttonModel = frontPanelControls[controlId];
            booleanLEDViewModel = viModel.getControlViewModel(controlId);
            buttonElement = booleanLEDViewModel.element;
            let val = buttonModel.value;
            expect(val).toEqual(false);
            // Need to use simulate since mechanical actions fires on addEventListener events, not bind events
            buttonElement._mouseDownHandler();
            val = buttonModel.value;
            expect(val).toEqual(true);
            buttonElement._documentUpHandler({ buttons: 1, stopPropagation: function () { }, preventDefault: function () { } });
            const newVal = buttonModel.value;
            expect(newVal).toEqual(true);
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('does not update value if clicked in readOnly', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElement(booleanLedSettings);
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { readOnly: true });
            }, function () {
                frontPanelControls = viModel.getAllControlModels();
                buttonModel = frontPanelControls[controlId];
                booleanLEDViewModel = viModel.getControlViewModel(controlId);
                buttonElement = booleanLEDViewModel.element;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('even when updating the value happens when released', function (done) {
            webAppHelper.dispatchMessage(controlId, { momentary: false, clickMode: BooleanControlModel.ClickModeEnum.RELEASE });
            testHelpers.runAsync(done, function () {
                // Button not pressed.
                expect(buttonModel.value).toEqual(booleanLedSettings.value);
                // Button mouse down.
                $(buttonElement).simulate('mousedown');
                expect(buttonModel.value).toEqual(booleanLedSettings.value);
                // Button mouse up.
                $(buttonElement).simulate('click');
                expect(buttonModel.value).toEqual(booleanLedSettings.value);
            });
        });
        it('even when updating the value happens when pressed', function () {
            webAppHelper.dispatchMessage(controlId, { momentary: false, clickMode: BooleanControlModel.ClickModeEnum.PRESS });
            // Button not pressed.
            expect(buttonModel.value).toEqual(booleanLedSettings.value);
            // Button mouse down.
            $(buttonElement).simulate('mousedown');
            expect(buttonModel.value).toEqual(booleanLedSettings.value);
            // Button mouse up.
            $(buttonElement).simulate('click');
            expect(buttonModel.value).toEqual(booleanLedSettings.value);
        });
        it('even when updating the value happens until released', function () {
            webAppHelper.dispatchMessage(controlId, { clickMode: BooleanControlModel.ClickModeEnum.RELEASE, momentary: true });
            // Button not pressed.
            expect(buttonModel.value).toEqual(booleanLedSettings.value);
            // Button mouse down.
            $(buttonElement).simulate('mousedown');
            expect(buttonModel.value).toEqual(booleanLedSettings.value);
            // Button mouse up.
            $(buttonElement).simulate('click');
            expect(buttonModel.value).toEqual(booleanLedSettings.value);
        });
    });
    describe('does update value if clicked in readOnly mode in edit panel', function () {
        beforeEach(function () {
            viReferenceService.getWebAppModelByVIRef('').updateService.setIdeMode(true);
        });
        afterEach(function () {
            viReferenceService.getWebAppModelByVIRef('').updateService.setIdeMode(false);
        });
        it('even when updating the value happens when released', function (done) {
            booleanLedSettings.momentary = false;
            booleanLedSettings.clickMode = BooleanControlModel.ClickModeEnum.RELEASE;
            webAppHelper.createNIElement(booleanLedSettings);
            testHelpers.runMultipleAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                buttonModel = frontPanelControls[controlId];
                booleanLEDViewModel = viModel.getControlViewModel(controlId);
            }, function () {
                buttonElement = booleanLEDViewModel.element;
                buttonModel.readOnly = true;
            }, function () {
                // Button mouse down
                buttonElement._mouseDownHandler({
                    buttons: 1,
                    stopPropagation: function () { },
                    preventDefault: function () { }
                });
                expect(buttonModel.value).toEqual(false);
                //Button mouse up
                buttonElement._documentUpHandler();
                expect(buttonModel.value).toEqual(true);
                webAppHelper.removeNIElement(controlId);
            });
        });
    });
    describe('with contentVisible starting false', function () {
        beforeEach(function (done) {
            booleanLedSettings.trueContent = '<span class="jqx-true-content ni-hidden">trueContent<span>';
            booleanLedSettings.falseContent = '<span class="jqx-false-content ni-hidden">falseContent<span>';
            webAppHelper.createNIElement(booleanLedSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                buttonModel = frontPanelControls[controlId];
                booleanLEDViewModel = viModel.getControlViewModel(controlId);
                buttonElement = booleanLEDViewModel.element;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('starts with invisible content', function () {
            expect(buttonElement.querySelector('.jqx-false-content').classList.contains('ni-hidden')).toEqual(true);
            expect(buttonElement.querySelector('.jqx-true-content').classList.contains('ni-hidden')).toEqual(true);
        });
        it('can change to show the content', function (done) {
            const updateSettings = {};
            updateSettings.trueContent = '<span class="jqx-true-content">trueContent<span>';
            updateSettings.falseContent = '<span class="jqx-false-content">falseContent<span>';
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(buttonElement.querySelector('.jqx-false-content').classList.contains('ni-hidden')).toEqual(false);
                expect(buttonElement.querySelector('.jqx-true-content').classList.contains('ni-hidden')).toEqual(false);
            });
        });
    });
});
//# sourceMappingURL=niBooleanLEDViewModel.Test.js.map