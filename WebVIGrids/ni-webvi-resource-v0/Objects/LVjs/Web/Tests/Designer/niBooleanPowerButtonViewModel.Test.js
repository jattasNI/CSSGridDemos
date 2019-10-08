//****************************************
// Tests for BooleanPowerButtonViewModel class
// National Instruments Copyright 2015
//****************************************
import { BooleanControlModel } from '../../Modeling/niBooleanControlModel.js';
describe('A BooleanPowerButtonViewModel', function () {
    'use strict';
    let viModel, frontPanelControls, buttonElement, controlModel, controlElement, viewModel;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, booleanPowerButtonSettings, booleanPowerButtonUpdatedSettings;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.booleanPowerButtonSettings.niControlId;
            booleanPowerButtonSettings = fixture.booleanPowerButtonSettings;
            booleanPowerButtonUpdatedSettings = fixture.booleanPowerButtonUpdatedSettings;
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
        $(document.body).append('<jqx-power-button ni-control-id="' + controlId + '"></jqx-power-button>');
        testHelpers.runAsync(done, function () {
            viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElement(booleanPowerButtonSettings);
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
            expect(controlModel.value).toEqual(booleanPowerButtonSettings.value);
            expect(controlModel.contentVisible).toEqual(booleanPowerButtonSettings.contentVisible);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, booleanPowerButtonUpdatedSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.value).toEqual(booleanPowerButtonUpdatedSettings.value);
                expect(controlModel.contentVisible).toEqual(booleanPowerButtonUpdatedSettings.contentVisible);
            });
        });
        it('and updates readOnly property change', function (done) {
            webAppHelper.dispatchMessage(controlId, { readOnly: true });
            testHelpers.runAsync(done, function () {
                expect(controlModel.readOnly).toEqual(true);
                expect(controlElement.hasAttribute('readonly')).toEqual(true);
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
                expect(controlModel.value).toEqual(booleanPowerButtonSettings.value);
                expect(controlModel.contentVisible).toEqual(booleanPowerButtonSettings.contentVisible);
            });
        });
    });
    describe('does not update value in readOnly mode by clicking and mechanical action is', function () {
        beforeEach(function (done) {
            booleanPowerButtonSettings.readOnly = true;
            buttonElement = webAppHelper.createNIElement(booleanPowerButtonSettings);
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
});
//# sourceMappingURL=niBooleanPowerButtonViewModel.Test.js.map