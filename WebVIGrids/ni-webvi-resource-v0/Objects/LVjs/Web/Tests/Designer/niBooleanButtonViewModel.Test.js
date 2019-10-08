//*****************************************
// Tests for BooleanButtonModel class
// National Instruments Copyright 2014
//*****************************************
import { BooleanControlModel } from '../../Modeling/niBooleanControlModel.js';
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
import { VIReferenceService as viReferenceService } from '../../Framework/niVIReferenceService.js';
describe('A BooleanButtonViewModel', function () {
    'use strict';
    let viModel, frontPanelControls, buttonModel, buttonElement, buttonViewModel;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, booleanButtonSettings, booleanButtonUpdateSettings, booleanButtonCommentContentSettings;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.booleanButtonSettings.niControlId;
            booleanButtonSettings = fixture.booleanButtonSettings;
            booleanButtonUpdateSettings = fixture.booleanButtonUpdateSettings;
            booleanButtonCommentContentSettings = fixture.booleanButtonCommentContentSettings;
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
    it('allows creating an instance with value set to true', function (done) {
        booleanButtonSettings.value = true;
        buttonElement = webAppHelper.createNIElement(booleanButtonSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            buttonModel = frontPanelControls[controlId];
            const val = buttonModel.value;
            expect(val).toEqual(true);
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('allows creating an instance with value set to false', function (done) {
        booleanButtonSettings.value = false;
        buttonElement = webAppHelper.createNIElement(booleanButtonSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            buttonModel = frontPanelControls[controlId];
            const val = buttonModel.value;
            expect(val).toEqual(false);
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('allows creating an instance with default textAlignment value as center.', function (done) {
        buttonElement = webAppHelper.createNIElement(booleanButtonSettings);
        // Note: Centered text is hardcoded via CSS in niControlStyles.css. It's not configurable via
        // the editor, so it's not using CSS variables currently.
        testHelpers.runAsync(done, function (done) {
            const textContainer = buttonElement.querySelector("button .ni-text");
            const textContainerStyle = window.getComputedStyle(textContainer);
            expect(textContainerStyle.textAlign).toEqual('center');
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('dynamically updates properties triggering ModelPropertyChanged', function () {
        let buttonViewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(booleanButtonSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                buttonModel = frontPanelControls[controlId];
                buttonViewModel = viModel.getControlViewModel(controlId);
                buttonElement = buttonViewModel.element;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('verifies initial values', function (done) {
            testHelpers.runAsync(done, function () {
                expect(buttonModel).toBeDefined();
                expect(buttonViewModel).toBeDefined();
                expect(buttonModel.content).toEqual(booleanButtonSettings.content);
                expect(buttonModel.value).toEqual(false);
                expect(buttonModel.momentary).toEqual(false);
                expect(buttonModel.clickMode).toEqual(BooleanControlModel.ClickModeEnum.PRESS);
                expect(buttonModel.trueBackground).toEqual(booleanButtonSettings.trueBackground);
                expect(buttonModel.trueForeground).toEqual(booleanButtonSettings.trueForeground);
                expect(buttonModel.falseBackground).toEqual(booleanButtonSettings.falseBackground);
                expect(buttonModel.falseForeground).toEqual(booleanButtonSettings.falseForeground);
                expect(buttonModel.borderColor).toEqual(booleanButtonSettings.borderColor);
            });
        });
        it('updates content, value, momentary and clickMode', function (done) {
            webAppHelper.dispatchMessage(controlId, booleanButtonUpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(buttonModel.content).toEqual(booleanButtonUpdateSettings.content);
                expect(buttonElement.checked).toEqual(true);
                expect(buttonModel.momentary).toEqual(true);
                expect(buttonModel.clickMode).toEqual(BooleanControlModel.ClickModeEnum.RELEASE);
                expect(buttonModel.fontSize).toEqual('20px');
                expect(buttonModel.fontFamily).toEqual('sans-serif');
                expect(buttonModel.fontWeight).toEqual('bold');
                expect(buttonModel.fontStyle).toEqual('italic');
                expect(buttonModel.trueBackground).toEqual(booleanButtonUpdateSettings.trueBackground);
                expect(buttonModel.trueForeground).toEqual(booleanButtonUpdateSettings.trueForeground);
                expect(buttonModel.falseBackground).toEqual(booleanButtonUpdateSettings.falseBackground);
                expect(buttonModel.falseForeground).toEqual(booleanButtonUpdateSettings.falseForeground);
                expect(buttonModel.borderColor).toEqual(booleanButtonUpdateSettings.borderColor);
            });
        });
        it('updates contentVisible', function (done) {
            webAppHelper.dispatchMessage(controlId, {
                content: '<div class="ni-glyph ni-hidden"></div><span class="ni-text ni-hidden">content</span>'
            });
            testHelpers.runAsync(done, function () {
                const contentSpan = buttonElement.querySelector('.ni-text');
                const glyphSpan = buttonElement.querySelector('.ni-glyph');
                expect(contentSpan.classList.contains('ni-hidden')).toEqual(true);
                expect(glyphSpan.classList.contains('ni-hidden')).toEqual(true);
            });
        });
        it('updates readOnly', function (done) {
            webAppHelper.dispatchMessage(controlId, {
                readOnly: true
            });
            testHelpers.runAsync(done, function () {
                expect(buttonModel.readOnly).toEqual(true);
                expect(buttonElement.hasAttribute('readonly')).toEqual(true);
            });
        });
        it('updates trueBackground, trueForeground, falseBackground, falseForeground', function (done) {
            testHelpers.disablePointerEvents(buttonElement);
            const values = {
                trueForeground: '#C1C1C1',
                trueBackground: '#B2B3B4',
                falseForeground: '#DD0011',
                falseBackground: '#A8CDA0'
            };
            webAppHelper.dispatchMessage(controlId, values);
            testHelpers.runMultipleAsync(done, function () {
                const style = window.getComputedStyle(buttonElement);
                expect(style.getPropertyValue(CSS_PROPERTIES.TRUE_BACKGROUND)).toEqual(values.trueBackground);
                expect(style.getPropertyValue(CSS_PROPERTIES.TRUE_FOREGROUND_COLOR)).toEqual(values.trueForeground);
                expect(style.getPropertyValue(CSS_PROPERTIES.FALSE_BACKGROUND)).toEqual(values.falseBackground);
                expect(style.getPropertyValue(CSS_PROPERTIES.FALSE_FOREGROUND_COLOR)).toEqual(values.falseForeground);
                const buttonStyle = window.getComputedStyle(buttonElement.querySelector('button'));
                expect(buttonStyle.color).toEqual('rgb(221, 0, 17)');
                expect(buttonStyle.backgroundColor).toContain('rgb(168, 205, 160)');
                // Simulate click so we can check the true colors
                buttonElement._downHandler({ buttons: 1, stopPropagation: function () { }, preventDefault: function () { } });
            }, function () {
                const buttonStyle = window.getComputedStyle(buttonElement.querySelector('button'));
                expect(buttonStyle.color).toEqual('rgb(193, 193, 193)');
                expect(buttonStyle.backgroundColor).toContain('rgb(178, 179, 180)');
                buttonElement._documentUpHandler();
            });
        });
        it('updates border #intermittent', function (done) {
            testHelpers.disablePointerEvents(buttonElement);
            webAppHelper.dispatchMessage(controlId, {
                borderColor: '#ADFF00'
            });
            testHelpers.runAsync(done, function () {
                expect(buttonModel.borderColor).toEqual('#ADFF00');
                const style = window.getComputedStyle(buttonElement);
                expect(style.getPropertyValue(CSS_PROPERTIES.BORDER_COLOR)).toEqual('#ADFF00');
                const buttonStyle = window.getComputedStyle(buttonElement.querySelector('button'));
                expect(buttonStyle.borderTopColor).toEqual('rgb(173, 255, 0)');
                expect(buttonStyle.borderRightColor).toEqual('rgb(173, 255, 0)');
                expect(buttonStyle.borderBottomColor).toEqual('rgb(173, 255, 0)');
                expect(buttonStyle.borderLeftColor).toEqual('rgb(173, 255, 0)');
            });
        });
        it('allows content to contain a html comment', function (done) {
            webAppHelper.dispatchMessage(controlId, booleanButtonCommentContentSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                buttonViewModel = viModel.getControlViewModel(controlId);
                buttonElement = buttonViewModel.element;
                expect(buttonElement.$content.element.innerHTML).toEqual('<div class="ni-glyph"></div><span class="ni-text"><!-- Comment Test --></span>');
            });
        });
    });
    // Mechanical action testing.
    it('allows a click with mechanical action set to when released to update value', function (done) {
        booleanButtonSettings.momentary = false;
        booleanButtonSettings.clickMode = BooleanControlModel.ClickModeEnum.RELEASE;
        webAppHelper.createNIElement(booleanButtonSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            buttonModel = frontPanelControls[controlId];
            buttonViewModel = viModel.getControlViewModel(controlId);
            buttonElement = buttonViewModel.element;
            // Button not pressed
            expect(buttonModel.value).toEqual(false);
            // Button mouse down
            buttonElement._downHandler({ buttons: 1, stopPropagation: function () { }, preventDefault: function () { } });
            expect(buttonModel.value).toEqual(false);
            //Button mouse up
            buttonElement._documentUpHandler();
            expect(buttonModel.value).toEqual(true);
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('allows a click with mechanical action set to when pressed to update value', function (done) {
        booleanButtonSettings.momentary = false;
        booleanButtonSettings.clickMode = BooleanControlModel.ClickModeEnum.PRESS;
        webAppHelper.createNIElement(booleanButtonSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            buttonModel = frontPanelControls[controlId];
            buttonViewModel = viModel.getControlViewModel(controlId);
            buttonElement = buttonViewModel.element;
            // Button not pressed
            expect(buttonModel.value).toEqual(false);
            // Button mouse down
            buttonElement._downHandler({ buttons: 1, stopPropagation: function () { }, preventDefault: function () { } });
            expect(buttonModel.value).toEqual(true);
            //Button mouse up
            buttonElement._documentUpHandler();
            expect(buttonModel.value).toEqual(true);
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('allows a click with mechanical action set to until released to update value', function (done) {
        booleanButtonSettings.momentary = true;
        booleanButtonSettings.clickMode = BooleanControlModel.ClickModeEnum.RELEASE;
        webAppHelper.createNIElement(booleanButtonSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            buttonModel = frontPanelControls[controlId];
            buttonViewModel = viModel.getControlViewModel(controlId);
            buttonElement = buttonViewModel.element;
            // Button not pressed
            expect(buttonModel.value).toEqual(false);
            // Button mouse down
            buttonElement._downHandler({ buttons: 1, stopPropagation: function () { }, preventDefault: function () { } });
            expect(buttonModel.value).toEqual(true);
            //Button mouse up
            buttonElement._documentUpHandler();
            expect(buttonModel.value).toEqual(false);
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('updates value (by clicking) of indicator in edit time and mechanical action is set to', function () {
        beforeEach(function () {
            viReferenceService.getWebAppModelByVIRef('').updateService.setIdeMode(true);
        });
        afterEach(function () {
            viReferenceService.getWebAppModelByVIRef('').updateService.setIdeMode(false);
        });
        it("'when released'", function (done) {
            booleanButtonSettings.momentary = false;
            booleanButtonSettings.clickMode = BooleanControlModel.ClickModeEnum.RELEASE;
            webAppHelper.createNIElement(booleanButtonSettings);
            testHelpers.runMultipleAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                buttonModel = frontPanelControls[controlId];
                buttonViewModel = viModel.getControlViewModel(controlId);
            }, function () {
                buttonElement = buttonViewModel.element;
                buttonModel.readOnly = true;
            }, function () {
                // Button mouse down
                buttonElement._downHandler({
                    buttons: 1,
                    stopPropagation: function () { },
                    preventDefault: function () { }
                });
                expect(buttonModel.value).toEqual(false);
                // Button mouse up
                buttonElement._documentUpHandler();
                expect(buttonModel.value).toEqual(true);
                webAppHelper.removeNIElement(controlId);
            });
        });
    });
    describe('does not update value (by clicking) when control is readOnly and mechanical action is set to', function () {
        it("'when released'", function (done) {
            booleanButtonSettings.momentary = false;
            booleanButtonSettings.clickMode = BooleanControlModel.ClickModeEnum.RELEASE;
            booleanButtonSettings.readOnly = true;
            webAppHelper.createNIElement(booleanButtonSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                buttonModel = frontPanelControls[controlId];
                buttonViewModel = viModel.getControlViewModel(controlId);
                buttonElement = buttonViewModel.element;
                // Button not pressed
                expect(buttonModel.value).toEqual(false);
                // Button mouse down
                $(buttonElement.firstElementChild).simulate('mousedown');
                expect(buttonModel.value).toEqual(false);
                //Button mouse up
                $(buttonElement.firstElementChild).simulate('click');
                expect(buttonModel.value).toEqual(false);
                webAppHelper.removeNIElement(controlId);
            });
        });
        it('when pressed', function (done) {
            booleanButtonSettings.momentary = false;
            booleanButtonSettings.clickMode = BooleanControlModel.ClickModeEnum.PRESS;
            booleanButtonSettings.readOnly = true;
            webAppHelper.createNIElement(booleanButtonSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                buttonModel = frontPanelControls[controlId];
                buttonViewModel = viModel.getControlViewModel(controlId);
                buttonElement = buttonViewModel.element;
                // Button not pressed
                expect(buttonModel.value).toEqual(false);
                // Button mouse down
                $(buttonElement.firstElementChild).simulate('mousedown');
                expect(buttonModel.value).toEqual(false);
                //Button mouse up
                $(buttonElement.firstElementChild).simulate('click');
                expect(buttonModel.value).toEqual(false);
                webAppHelper.removeNIElement(controlId);
            });
        });
        it('until released', function (done) {
            booleanButtonSettings.momentary = true;
            booleanButtonSettings.clickMode = BooleanControlModel.ClickModeEnum.RELEASE;
            booleanButtonSettings.readOnly = true;
            webAppHelper.createNIElement(booleanButtonSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                buttonModel = frontPanelControls[controlId];
                buttonViewModel = viModel.getControlViewModel(controlId);
                buttonElement = buttonViewModel.element;
                // Button not pressed
                expect(buttonModel.value).toEqual(false);
                // Button mouse down
                $(buttonElement.firstElementChild).simulate('mousedown');
                expect(buttonModel.value).toEqual(false);
                //Button mouse up
                $(buttonElement.firstElementChild).simulate('click');
                expect(buttonModel.value).toEqual(false);
                webAppHelper.removeNIElement(controlId);
            });
        });
    });
    // End of Mechanical action testing
    it('allows to create with contentVisible false', function (done) {
        booleanButtonSettings.contentVisible = false;
        booleanButtonSettings.value = true;
        webAppHelper.createNIElement(booleanButtonSettings);
        testHelpers.runAsync(done, function () {
            buttonModel = frontPanelControls[controlId];
            buttonViewModel = viModel.getControlViewModel(controlId);
            buttonElement = buttonViewModel.element;
            expect(buttonElement.checked).toEqual(true);
            webAppHelper.removeNIElement(controlId);
        });
    });
});
//# sourceMappingURL=niBooleanButtonViewModel.Test.js.map