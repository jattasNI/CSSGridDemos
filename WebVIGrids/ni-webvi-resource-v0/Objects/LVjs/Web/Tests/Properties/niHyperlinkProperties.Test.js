//****************************************
// G Property Tests for HyperlinkModel class
// National Instruments Copyright 2018
//****************************************
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A Hyperlink control', function () {
    'use strict';
    let updateService, viModel, frontPanelControls, controlModel, viewModel, controlElement;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, hyperlinkSettings;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.hyperlinkSettings2.niControlId;
            hyperlinkSettings = fixture.hyperlinkSettings2;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    beforeEach(function (done) {
        Object.freeze(hyperlinkSettings);
        webAppHelper.createNIElement(hyperlinkSettings);
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
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('property read for Value returns the current value.', function () {
        const href = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
        expect(href).toEqual(hyperlinkSettings.href);
    });
    it('property set for Value updates model.', function (done) {
        const newHref = 'www.ni.com';
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newHref);
            expect(controlModel.href).toEqual(newHref);
        });
    });
    it('property set for Value updates control element.', function (done) {
        const newHref = 'www.news.com';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newHref);
            expect(controlModel.href).toEqual(newHref);
        }, function () {
            expect(controlElement.href).toEqual(newHref);
        });
    });
    it('property set for Value does not call controlChanged function of updateService', function (done) {
        const newHref = 'www.ni.com';
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newHref);
            expect(updateService.controlChanged).not.toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling calls controlChanged fuction of updateService with correct arguments.', function (done) {
        const newHref = 'www.ni.com';
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newHref);
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'href', newHref, hyperlinkSettings.href);
        });
    });
    it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
        const newHref = hyperlinkSettings.href;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newHref);
            expect(updateService.controlChanged).toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling updates model.', function (done) {
        const newHref = 'www.ni.com';
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newHref);
            expect(controlModel.href).toEqual(newHref);
        });
    });
    it('property set for valueSignaling updates control element.', function (done) {
        const newHref = 'www.ni.com';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newHref);
            expect(controlModel.href).toEqual(newHref);
        }, function () {
            expect(controlElement.href).toEqual(newHref);
        });
    });
    it('property set for Disabled to true disables control element by removing href attribute.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME, true);
        }, function () {
            const anchorElement = controlElement.getElementsByTagName('a')[0];
            expect(anchorElement.href).toEqual('');
        });
    });
    it('property set for Disabled to true from false enables control element by restoring the href attribute.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, 'http://ni.com/');
            viewModel.setGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME, true);
            viewModel.setGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME, false);
        }, function () {
            const anchorElement = controlElement.getElementsByTagName('a')[0];
            expect(anchorElement.href).toEqual('http://ni.com/');
        });
    });
    it('property set for Disabled to true and changing value does not restore the anchor href attribute.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME, true);
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, 'http://ni.com/');
        }, function () {
            const anchorElement = controlElement.getElementsByTagName('a')[0];
            expect(anchorElement.href).toEqual('');
        });
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(hyperlinkSettings.left),
            "Top": parseInt(hyperlinkSettings.top)
        };
        expect(position).toEqual(expectedPosition);
    });
    it('property set for Position updates model.', function (done) {
        const newPosition = { Left: 100, Top: 200 };
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
            expect(parseInt(controlModel.left)).toEqual(newPosition.Left);
            expect(parseInt(controlModel.top)).toEqual(newPosition.Top);
        });
    });
    it('property set for Position updates control element.', function (done) {
        const newPosition = { Left: 150, Top: 250 };
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
        }, function () {
            const computedStyle = window.getComputedStyle(controlElement);
            expect(parseInt(computedStyle.left)).toEqual(newPosition.Left);
            expect(parseInt(computedStyle.top)).toEqual(newPosition.Top);
        });
    });
    it('property get for KeyFocus returns true if the element or one of its descendants has keyboard focus, false otherwise.', function () {
        const previousKeyFocusPropertyValue = viewModel.getGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME);
        expect(previousKeyFocusPropertyValue).toEqual(false);
        viewModel.setGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME, true);
        const currentKeyFocusPropertyValue = viewModel.getGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME);
        expect(currentKeyFocusPropertyValue).toEqual(true);
    });
    it('property set true for KeyFocus makes the control the active element in the document.', function () {
        viewModel.setGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME, true);
        expect(viewModel.element.contains(document.activeElement)).toEqual(true);
        expect(viewModel.element.querySelector('a')).toEqual(document.activeElement);
    });
    it('property set false for KeyFocus blurs the control.', function () {
        viewModel.setGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME, true);
        expect(viewModel.element.contains(document.activeElement)).toEqual(true);
        viewModel.setGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME, false);
        expect(viewModel.element.contains(document.activeElement)).toEqual(false);
    });
});
//# sourceMappingURL=niHyperlinkProperties.Test.js.map