//****************************************
// Tests for PathSelectorViewModel class
// National Instruments Copyright 2015
//****************************************
import { PathSelectorModel } from '../../Modeling/niPathSelectorModel.js';
describe('A PathSelectorViewModel', function () {
    'use strict';
    const $internalDoNotUse = NationalInstruments.Globals.jQuery;
    const controlId = 'PathSelectorViewModelId';
    let viModel, frontPanelControls, controlModel, controlElement, settings, updateSettings, updateSettingsNotAPath;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        webAppHelper.installWebAppFixture(done);
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function () {
        settings = {
            niControlId: controlId,
            kind: PathSelectorModel.MODEL_KIND,
            visible: true,
            path: { components: [''], type: 'absolute' },
            readOnly: false,
            fontSize: '16px',
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
            fontStyle: 'normal',
            left: '272px',
            top: '166px',
            width: '90px',
            height: '22px',
            textAlignment: 'right'
        };
        updateSettings = {
            path: { components: ['home'], type: 'absolute' },
            readOnly: true,
            fontSize: '20px',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            fontStyle: 'italic',
            popupEnabled: true,
            textAlignment: 'center'
        };
        updateSettingsNotAPath = {
            path: { components: [], type: 'absolute' },
            readOnly: true,
            fontSize: '20px',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            fontStyle: 'italic',
            textAlignment: 'left'
        };
        Object.freeze(settings);
        Object.freeze(updateSettings);
        Object.freeze(updateSettingsNotAPath);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        // TODO mraj DOM_POLLUTION
        //domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page.', function (done) {
        $(document.body).append('<ni-path-selector ni-control-id="' + controlId + '"></ni-path-selector>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        let viewModel, internalControl;
        beforeEach(function (done) {
            webAppHelper.createNIElement(settings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
                controlElement = viewModel.element;
                internalControl = controlElement.firstElementChild;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('and has the correct initial values.', function () {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlModel.path).toEqual(settings.path);
            expect(controlModel.readOnly).toEqual(settings.readOnly);
            expect(controlModel.popupEnabled).toEqual(false); // Default value.
            expect(controlModel.textAlignment).toEqual(settings.textAlignment);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.path).toEqual(updateSettings.path);
                expect(controlModel.readOnly).toEqual(updateSettings.readOnly);
                expect(controlModel.fontSize).toEqual(updateSettings.fontSize);
                expect(controlModel.fontFamily).toEqual(updateSettings.fontFamily);
                expect(controlModel.fontWeight).toEqual(updateSettings.fontWeight);
                expect(controlModel.fontStyle).toEqual(updateSettings.fontStyle);
                expect(controlModel.popupEnabled).toEqual(updateSettings.popupEnabled);
                expect(controlModel.textAlignment).toEqual(updateSettings.textAlignment);
            });
        });
        it('and updates the Model when properties change, even with not a path value.', function (done) {
            webAppHelper.dispatchMessage(controlId, updateSettingsNotAPath);
            testHelpers.runAsync(done, function () {
                expect(controlModel.path).toEqual(updateSettingsNotAPath.path);
                expect(controlModel.readOnly).toEqual(updateSettingsNotAPath.readOnly);
                expect(controlModel.fontSize).toEqual(updateSettingsNotAPath.fontSize);
                expect(controlModel.fontFamily).toEqual(updateSettingsNotAPath.fontFamily);
                expect(controlModel.fontWeight).toEqual(updateSettingsNotAPath.fontWeight);
                expect(controlModel.fontStyle).toEqual(updateSettingsNotAPath.fontStyle);
                expect(controlModel.textAlignment).toEqual(updateSettingsNotAPath.textAlignment);
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
                expect(controlModel.path).toEqual(settings.path);
                expect(controlModel.readOnly).toEqual(settings.readOnly);
            });
        });
        // CAR 702866 : MSEdge + text-align + CSS variables not working
        /*
        // CAR 705614
         it('and updates textAlignment property. #FailsEdge', function (done) {
            webAppHelper.dispatchMessage(controlId, { textAlignment: 'center' });

            testHelpers.runAsync(done, function () {
                var controlStyle = window.getComputedStyle(controlElement);
                expect(controlStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN)).toEqual('center');

                var inputContainerStyle = window.getComputedStyle(controlElement.querySelector("input.jqx-path-control-input"));
                expect(inputContainerStyle.textAlign).toEqual('center');
            });
        });*/
        it('allows calls to the change event listener to update value.', function () {
            const oldValue = controlModel.path;
            expect(oldValue).toEqual(settings.path);
            $internalDoNotUse(internalControl).val('home:\\');
            $(internalControl).trigger('change'); // Normally this happens when the pathcontrol loses focus
            const newValue = controlModel.path;
            expect(newValue).toEqual(updateSettings.path);
        });
    });
});
//# sourceMappingURL=niPathSelectorViewModel.Test.js.map