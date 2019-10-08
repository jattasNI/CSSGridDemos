//****************************************
// Tests for HyperlinkViewModel class
// National Instruments Copyright 2015
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
describe('A HyperlinkViewModel', function () {
    'use strict';
    let viModel, frontPanelControls, controlModel, controlElement;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, hyperlinkSettings, hyperlinkUpdatedSettings;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.hyperlinkSettings.niControlId;
            hyperlinkSettings = fixture.hyperlinkSettings;
            hyperlinkUpdatedSettings = fixture.hyperlinkUpdatedSettings;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function () {
        Object.freeze(hyperlinkSettings);
        Object.freeze(hyperlinkUpdatedSettings);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page.', function (done) {
        $(document.body).append('<ni-hyperlink ni-control-id="' + controlId + '"></ni-hyperlink>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        let viewModel, internalControl;
        beforeEach(function (done) {
            webAppHelper.createNIElement(hyperlinkSettings);
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
            expect(controlModel.href).toEqual(hyperlinkSettings.href);
            expect(controlModel.content).toEqual(hyperlinkSettings.content);
            expect(controlModel.textAlignment).toEqual(hyperlinkSettings.textAlignment);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, hyperlinkUpdatedSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel).toBeDefined();
                expect(viewModel).toBeDefined();
                expect(internalControl).toBeDefined();
                expect(internalControl.href).toMatch(hyperlinkUpdatedSettings.href);
                expect(internalControl.firstChild).toBeDefined();
                expect(internalControl.firstChild.nodeValue).toBeDefined();
                expect(internalControl.firstChild.nodeValue).toEqual(hyperlinkUpdatedSettings.content);
                expect(internalControl.getAttribute('target')).toBeNull();
                expect(controlModel.textAlignment).toEqual(hyperlinkUpdatedSettings.textAlignment);
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
                expect(internalControl.href).toMatch(hyperlinkSettings.href);
                expect(internalControl.firstChild).toBeDefined();
                expect(internalControl.firstChild.nodeValue).toBeDefined();
                expect(internalControl.firstChild.nodeValue).toEqual(hyperlinkSettings.content);
            });
        });
        // CAR 702866 : MSEdge + text-align + CSS variables not working
        it('and updates textAlignment property. #FailsEdge', function (done) {
            webAppHelper.dispatchMessage(controlId, { textAlignment: 'center' });
            testHelpers.runAsync(done, function () {
                const hyperlinkStyle = window.getComputedStyle(controlElement);
                expect(hyperlinkStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN)).toEqual('center');
                const hyperlinkAnchorStyle = window.getComputedStyle(controlElement.querySelector('a'));
                expect(hyperlinkAnchorStyle.textAlign).toEqual('center');
            });
        });
        it('and should update the correct cursor style when element in readonly mode', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                controlElement.setAttribute('readonly', '');
            }, function () {
                const hyperlinkAnchorStyle = window.getComputedStyle(controlElement.querySelector('a'));
                expect(hyperlinkAnchorStyle.cursor).toEqual('pointer');
                expect(hyperlinkAnchorStyle.pointerEvents).toEqual('auto');
            });
        });
    });
});
//# sourceMappingURL=niHyperlinkViewModel.Test.js.map