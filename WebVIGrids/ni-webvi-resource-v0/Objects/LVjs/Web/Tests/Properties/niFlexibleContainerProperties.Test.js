//****************************************
// Tests for position property of a control inside a flexible front panel.
// National Instruments Copyright 2018
//****************************************
import { FrontPanelModel } from '../../Modeling/niFrontPanelModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A control inside a flexible container front panel', function () {
    'use strict';
    const controlId = 'FrontPanelViewModelId';
    const webAppHelper = testHelpers.createWebAppTestHelper();
    let booleanButtonSettings, viModel, settings;
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            booleanButtonSettings = fixture.booleanButtonSettings2;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function () {
        settings = {
            niControlId: controlId,
            kind: FrontPanelModel.MODEL_KIND,
            layout: 'flexible',
            width: '300px',
            height: '400px'
        };
        Object.freeze(settings);
        webAppHelper.createNIElement(settings);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    afterEach(function () {
        webAppHelper.removeNIElement(controlId);
    });
    it('will error out when get position property is invoked', function () {
        webAppHelper.createNIElement(booleanButtonSettings, controlId);
        expect(function () {
            const controlViewModel = viModel.getControlViewModel(booleanButtonSettings.niControlId);
            controlViewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        }).toThrow();
        webAppHelper.removeNIElement(booleanButtonSettings.niControlId);
    });
    it('will error out when set position property is invoked', function () {
        webAppHelper.createNIElement(booleanButtonSettings, controlId);
        expect(function () {
            const newPosition = { Left: 106, Top: 206 };
            const controlViewModel = viModel.getControlViewModel(booleanButtonSettings.niControlId);
            controlViewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
        }).toThrow();
        webAppHelper.removeNIElement(booleanButtonSettings.niControlId);
    });
    it('will error out when get size property is invoked', function () {
        webAppHelper.createNIElement(booleanButtonSettings, controlId);
        expect(function () {
            const controlViewModel = viModel.getControlViewModel(booleanButtonSettings.niControlId);
            controlViewModel.getGPropertyValue(VisualModel.SIZE_G_PROPERTY_NAME);
        }).toThrow();
        webAppHelper.removeNIElement(booleanButtonSettings.niControlId);
    });
    it('will error out when set size property is invoked', function (done) {
        testHelpers.runAsync(done, function () {
            webAppHelper.createNIElement(booleanButtonSettings, controlId);
            const size = { Width: 200, Height: 100 };
            const controlViewModel = viModel.getControlViewModel(booleanButtonSettings.niControlId);
            expect(function () {
                controlViewModel.setGPropertyValue(VisualModel.SIZE_G_PROPERTY_NAME, size);
            }).toThrow();
            webAppHelper.removeNIElement(booleanButtonSettings.niControlId);
        });
    });
});
//# sourceMappingURL=niFlexibleContainerProperties.Test.js.map