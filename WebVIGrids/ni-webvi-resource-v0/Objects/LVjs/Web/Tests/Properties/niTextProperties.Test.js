//****************************************
// G Property Tests for TextModel class
// National Instruments Copyright 2018
//****************************************
import { TextModel } from '../../Modeling/niTextModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A Text control', function () {
    'use strict';
    let controlId;
    let viModel, frontPanelControls, controlModel, viewModel, controlElement, textSettings;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.textSettings.niControlId;
            textSettings = fixture.textSettings;
            Object.freeze(textSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function (done) {
        webAppHelper.createNIElement(textSettings);
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
    it('property read for Text returns the current text.', function () {
        const currentText = viewModel.getGPropertyValue('Text');
        expect(currentText).toEqual(textSettings.text);
    });
    it('property set for text updates model.', function (done) {
        const newText = 'newText';
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(TextModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.text).toEqual(newText);
        });
    });
    it('property set for text updates control element.', function (done) {
        const newText = 'Text3';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue('Text', newText);
            expect(controlModel.text).toEqual(newText);
        }, function () {
            expect(controlElement.text).toEqual(newText);
        });
    });
    it('property set empty string for text updates control element.', function (done) {
        const newText = '';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(TextModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.text).toEqual(newText);
        }, function () {
            expect(controlElement.text).toEqual(newText);
        });
    });
    it('property set non ASCII characters for text updates control element.', function (done) {
        const newText = 'Iñtërnâtiônàlizætiøn☃💩😴😄😃⛔🎠🚓🚇<!-- test comment -->';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(TextModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.text).toEqual(newText);
        }, function () {
            expect(controlElement.text).toEqual(newText);
        });
    });
    it('property set multiline text for text updates control element.', function (done) {
        const newText = `This is 
        multiline text`;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(TextModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.text).toEqual(newText);
        }, function () {
            expect(controlElement.text).toEqual(newText);
        });
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(textSettings.left),
            "Top": parseInt(textSettings.top)
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
//# sourceMappingURL=niTextProperties.Test.js.map