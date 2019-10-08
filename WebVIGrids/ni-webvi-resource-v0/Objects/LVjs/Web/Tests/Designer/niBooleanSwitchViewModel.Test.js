//*****************************************
// Tests for BooleanSwitchViewModel class
// National Instruments Copyright 2015
//*****************************************
import { BooleanControlModel } from '../../Modeling/niBooleanControlModel.js';
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
import { VIReferenceService as viReferenceService } from '../../Framework/niVIReferenceService.js';
describe('A BooleanSwitchViewModel', function () {
    'use strict';
    let viModel, frontPanelControls, buttonElement, controlModel, controlElement, switchViewModel;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, booleanSwitchSettings, booleanSwitchUpdatedSettings;
    const getFilteredClassList = function (controlElement) {
        let classList = [].slice.call(controlElement.classList);
        classList = classList.filter(className => !(className.startsWith('ni-') || className.startsWith('jqx-')));
        return classList;
    };
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.booleanSwitchSettings.niControlId;
            booleanSwitchSettings = fixture.booleanSwitchSettings;
            booleanSwitchUpdatedSettings = fixture.booleanSwitchUpdatedSettings;
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
        $(document.body).append('<jqx-switch-button ni-control-id="' + controlId + '"></jqx-switch-button>');
        testHelpers.runAsync(done, function () {
            switchViewModel = viModel.getControlViewModel(controlId);
            expect(switchViewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElement(booleanSwitchSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                switchViewModel = viModel.getControlViewModel(controlId);
                controlElement = switchViewModel.element;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('and has the correct initial values.', function () {
            expect(controlModel).toBeDefined();
            expect(switchViewModel).toBeDefined();
            expect(controlModel.value).toEqual(booleanSwitchSettings.value);
            expect(controlModel.contentVisible).toEqual(booleanSwitchSettings.contentVisible);
            expect(controlModel.orientation).toEqual(booleanSwitchSettings.orientation);
            expect(controlModel.trueContent).toEqual(booleanSwitchSettings.trueContent);
            expect(controlModel.falseContent).toEqual(booleanSwitchSettings.falseContent);
            expect(controlModel.foreground).toContain(booleanSwitchSettings.foreground);
            expect(controlModel.textAlignment).toEqual(booleanSwitchSettings.textAlignment);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, booleanSwitchUpdatedSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.value).toEqual(booleanSwitchUpdatedSettings.value);
                expect(controlModel.contentVisible).toEqual(booleanSwitchUpdatedSettings.contentVisible);
                expect(controlModel.orientation).toEqual(booleanSwitchUpdatedSettings.orientation);
                expect(controlModel.trueContent).toEqual(booleanSwitchUpdatedSettings.trueContent);
                expect(controlModel.falseContent).toEqual(booleanSwitchUpdatedSettings.falseContent);
                expect(controlModel.fontSize).toEqual('20px');
                expect(controlModel.fontFamily).toEqual('sans-serif');
                expect(controlModel.fontWeight).toEqual('bold');
                expect(controlModel.fontStyle).toEqual('italic');
                expect(controlModel.foreground).toContain(booleanSwitchUpdatedSettings.foreground);
                expect(controlModel.textAlignment).toContain(booleanSwitchUpdatedSettings.textAlignment);
            });
        });
        it('and updates readOnly property change', function (done) {
            webAppHelper.dispatchMessage(controlId, { readOnly: true });
            testHelpers.runAsync(done, function () {
                expect(controlModel.readOnly).toEqual(true);
                expect(controlElement.hasAttribute('readonly')).toEqual(true);
            });
        });
        it('and updates foreground property change', function (done) {
            testHelpers.disablePointerEvents(controlElement);
            webAppHelper.dispatchMessage(controlId, { foreground: 'blue' });
            testHelpers.runAsync(done, function () {
                const controlStyle = window.getComputedStyle(controlElement);
                expect(controlStyle.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR)).toContain('blue');
                const trueContentStyle = window.getComputedStyle(controlElement.querySelector('.jqx-true-content'));
                expect(trueContentStyle.color).toEqual('rgb(0, 0, 255)');
                const falseContentStyle = window.getComputedStyle(controlElement.querySelector('.jqx-false-content'));
                expect(falseContentStyle.color).toEqual('rgb(0, 0, 255)');
            });
        });
        it('and contains custom classes inside class attribute.', function () {
            expect(controlElement.classList.contains('TestCssCustomClass')).toEqual(true);
            expect(controlElement.classList.contains('TestCssCustomClass2')).toEqual(true);
        });
        it('and updates custom classes inside class attribute', function (done) {
            testHelpers.disablePointerEvents(controlElement);
            webAppHelper.dispatchMessage(controlId, { customClasses: ['TestCssCustomClass3'] });
            testHelpers.runMultipleAsync(done, function () {
                const classList = getFilteredClassList(controlElement);
                expect(classList).toContain("TestCssCustomClass3");
            }, function () {
                webAppHelper.dispatchMessage(controlId, { customClasses: [''] });
            }, function () {
                const classList = getFilteredClassList(controlElement);
                expect(classList).not.toContain("TestCssCustomClass1");
                expect(classList).not.toContain("TestCssCustomClass2");
                expect(classList).not.toContain("TestCssCustomClass3");
            });
        });
        /*
        // CAR 705613
        it('and updates textAlignment property change', function (done) {
            webAppHelper.dispatchMessage(controlId, { textAlignment: 'center' });

            testHelpers.runAsync(done, function () {
                expect(window.getComputedStyle(controlElement).getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX)).toEqual('center');

                let containerStyle = window.getComputedStyle(controlElement.querySelector('div.jqx-container > div.jqx-inner-container > span.jqx-true-content-container'));
                expect(containerStyle.justifyContent).toEqual('center');
            });
        });
        */
        it('and handles unknown property changes.', function (done) {
            const unknownSettings = {
                unknown: 'unknown'
            };
            const sendUnknownProperties = function () {
                webAppHelper.dispatchMessage(controlId, unknownSettings);
            };
            expect(sendUnknownProperties).toThrow();
            testHelpers.runAsync(done, function () {
                expect(controlModel.value).toEqual(booleanSwitchSettings.value);
                expect(controlModel.contentVisible).toEqual(booleanSwitchSettings.contentVisible);
                expect(controlModel.orientation).toEqual(booleanSwitchSettings.orientation);
                expect(controlModel.trueContent).toEqual(booleanSwitchSettings.trueContent);
                expect(controlModel.falseContent).toEqual(booleanSwitchSettings.falseContent);
            });
        });
    });
    it('can be created with contentVisible set to false.', function (done) {
        webAppHelper.createNIElement(booleanSwitchSettings);
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, { trueContent: '<span class="jqx-true-content ni-hidden">trueContent<span>', falseContent: '<span class="jqx-false-content ni-hidden">falseContent<span>' });
            switchViewModel = viModel.getControlViewModel(controlId);
            controlElement = switchViewModel.element;
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
        }, function () {
            expect(controlModel.contentVisible).toEqual(booleanSwitchSettings.contentVisible);
            expect(controlModel.falseContentVisibility).toEqual(booleanSwitchSettings.falseContentVisibility);
            const trueSpan = controlElement.querySelector('.jqx-true-content');
            expect(trueSpan.classList.contains('ni-hidden')).toEqual(true);
            const falseSpan = controlElement.querySelector('.jqx-false-content');
            expect(falseSpan.classList.contains('ni-hidden')).toEqual(true);
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('does not update value in readOnly mode by clicking and mechanical action is', function () {
        beforeEach(function (done) {
            booleanSwitchSettings.readOnly = true;
            buttonElement = webAppHelper.createNIElement(booleanSwitchSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('set to when released', function (done) {
            webAppHelper.dispatchMessage(controlId, { momentary: false, clickMode: BooleanControlModel.ClickModeEnum.RELEASE });
            testHelpers.runAsync(done, function () {
                // Button not pressed
                expect(controlModel.value).toEqual(false);
                // Button mouse down
                $(buttonElement).simulate('mousedown');
                expect(controlModel.value).toEqual(false);
                //Button mouse up
                $(buttonElement).simulate('click');
                expect(controlModel.value).toEqual(false);
            });
        });
        it('set to when pressed', function (done) {
            webAppHelper.dispatchMessage(controlId, { momentary: false, clickMode: BooleanControlModel.ClickModeEnum.PRESS });
            testHelpers.runAsync(done, function () {
                // Button not pressed
                expect(controlModel.value).toEqual(false);
                // Button mouse down
                $(buttonElement).simulate('mousedown');
                expect(controlModel.value).toEqual(false);
                //Button mouse up
                $(buttonElement).simulate('click');
                expect(controlModel.value).toEqual(false);
            });
        });
        it('set to until released', function (done) {
            webAppHelper.dispatchMessage(controlId, { momentary: true, clickMode: BooleanControlModel.ClickModeEnum.RELEASE });
            testHelpers.runAsync(done, function () {
                // Button not pressed
                expect(controlModel.value).toEqual(false);
                // Button mouse down
                $(buttonElement).simulate('mousedown');
                expect(controlModel.value).toEqual(false);
                //Button mouse up
                $(buttonElement).simulate('click');
                expect(controlModel.value).toEqual(false);
            });
        });
    });
    describe('does update value in readOnly mode in edit time by clicking and mechanical action is', function () {
        beforeEach(function () {
            viReferenceService.getWebAppModelByVIRef('').updateService.setIdeMode(true);
        });
        afterEach(function () {
            viReferenceService.getWebAppModelByVIRef('').updateService.setIdeMode(false);
        });
        it("'set to when released'", function (done) {
            booleanSwitchSettings.momentary = false;
            booleanSwitchSettings.clickMode = BooleanControlModel.ClickModeEnum.RELEASE;
            webAppHelper.createNIElement(booleanSwitchSettings);
            testHelpers.runMultipleAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                switchViewModel = viModel.getControlViewModel(controlId);
            }, function () {
                buttonElement = switchViewModel.element;
                controlModel.readOnly = true;
            }, function () {
                buttonElement._mouseDownHandler({ originalEvent: { target: buttonElement } });
                buttonElement._switchThumbDropHandler();
                expect(controlModel.value).toEqual(true);
                webAppHelper.removeNIElement(controlId);
            });
        });
    });
});
//# sourceMappingURL=niBooleanSwitchViewModel.Test.js.map