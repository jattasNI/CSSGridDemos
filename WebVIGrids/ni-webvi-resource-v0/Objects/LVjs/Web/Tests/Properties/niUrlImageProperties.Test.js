//****************************************
// G Property Tests for UrlImageModel class
// National Instruments Copyright 2018
//****************************************
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A UrlImage control', function () {
    'use strict';
    let controlId;
    let viModel, frontPanelControls, controlModel, viewModel, controlElement, urlImageViewSettings;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.urlImageViewSettings.niControlId;
            urlImageViewSettings = fixture.urlImageViewSettings;
            Object.freeze(urlImageViewSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function (done) {
        webAppHelper.createNIElement(urlImageViewSettings);
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
        const url = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
        expect(url).toEqual(urlImageViewSettings.source);
    });
    it('property set for Value updates model.', function (done) {
        const newUrl = '../Utilities/other.png';
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newUrl);
            expect(controlModel.source).toEqual(newUrl);
        });
    });
    it('property set for Value updates control element.', function (done) {
        const newUrl = '../Utilities/other.png';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newUrl);
            expect(controlModel.source).toEqual(newUrl);
        }, function () {
            expect(controlElement.source).toEqual(newUrl);
        });
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(urlImageViewSettings.left),
            "Top": parseInt(urlImageViewSettings.top)
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
});
//# sourceMappingURL=niUrlImageProperties.Test.js.map