//****************************************
// G Property Tests for BooleanLedModel class
// National Instruments Copyright 2018
//****************************************
import { BooleanControlModel } from '../../Modeling/niBooleanControlModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A BooleanLed control', function () {
    'use strict';
    let updateService, viModel, frontPanelControls, controlModel, viewModel, controlElement;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, booleanLedSettings;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.booleanLedSettings2.niControlId;
            booleanLedSettings = fixture.booleanLedSettings2;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    beforeEach(function (done) {
        Object.freeze(booleanLedSettings);
        webAppHelper.createNIElement(booleanLedSettings);
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
        const items = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
        expect(items).toEqual(booleanLedSettings.value);
    });
    it('property set for Value updates model.', function (done) {
        const newValue = false;
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        });
    });
    it('property set for Value updates control element.', function (done) {
        const newValue = false;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        }, function () {
            expect(controlElement.checked).toEqual(newValue);
        });
    });
    it('property set for Value does not call controlChanged function of updateService', function (done) {
        const newValue = false;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).not.toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling calls controlChanged function of updateService with correct arguments', function (done) {
        const newValue = false;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValue, booleanLedSettings.value);
        });
    });
    it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
        const newValue = booleanLedSettings.value;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling updates model.', function (done) {
        const newValue = false;
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        });
    });
    it('property set for valueSignaling updates control element.', function (done) {
        const newValue = false;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        }, function () {
            expect(controlElement.checked).toEqual(newValue);
        });
    });
    it('property read for Text returns the current Content.', function () {
        const text = viewModel.getGPropertyValue(BooleanControlModel.TEXT_G_PROPERTY_NAME);
        expect(text).toEqual([controlModel.trueContent, controlModel.falseContent]);
    });
    it('property set for Text updates model.', function (done) {
        const newText = ['text1', 'text2'];
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(BooleanControlModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.trueContent).toEqual(newText[0]);
            expect(controlModel.falseContent).toEqual(newText[1]);
        });
    });
    it('property set for Text updates control element.', function (done) {
        const newText = ['text1', 'text2'];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(BooleanControlModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.trueContent).toEqual(newText[0]);
            expect(controlModel.falseContent).toEqual(newText[1]);
        }, function () {
            expect(controlElement.trueContent).toEqual(newText[0]);
            expect(controlElement.falseContent).toEqual(newText[1]);
        });
    });
    it('property set empty string for text updates control element.', function (done) {
        const newText = ['', ''];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(BooleanControlModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.trueContent).toEqual(newText[0]);
            expect(controlModel.falseContent).toEqual(newText[1]);
        }, function () {
            expect(controlElement.trueContent).toEqual(newText[0]);
            expect(controlElement.falseContent).toEqual(newText[1]);
        });
    });
    it('property set non ASCII characters for text updates control element.', function (done) {
        const newText = ['Iñtërnâtiônàlizætiøn☃💩😴😄😃⛔🎠🚓🚇<!-- test comment -->', 'text2'];
        const expectedText = ['Iñtërnâtiônàlizætiøn☃💩😴😄😃⛔🎠🚓🚇&lt;!-- test comment --&gt;', 'text2'];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(BooleanControlModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.trueContent).toEqual(expectedText[0]);
            expect(controlModel.falseContent).toEqual(expectedText[1]);
        }, function () {
            expect(controlElement.trueContent).toEqual(expectedText[0]);
            expect(controlElement.falseContent).toEqual(expectedText[1]);
        });
    });
    it('property set multiline text for text updates control element.', function (done) {
        const newText = [`This is
        multiline text`, 'text2'];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(BooleanControlModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.trueContent).toEqual(newText[0]);
            expect(controlModel.falseContent).toEqual(newText[1]);
        }, function () {
            expect(controlElement.trueContent).toEqual(newText[0]);
            expect(controlElement.falseContent).toEqual(newText[1]);
        });
    });
    it('property set for text with array containing more than two elements updates control element.', function (done) {
        const newText = ['text1', 'text2', 'text3'];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(BooleanControlModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.trueContent).toEqual(newText[0]);
            expect(controlModel.falseContent).toEqual(newText[1]);
        }, function () {
            expect(controlElement.trueContent).toEqual(newText[0]);
            expect(controlElement.falseContent).toEqual(newText[1]);
        });
    });
    it('property set for text with empty array will leave the control element unchanged.', function (done) {
        const newText = [];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(BooleanControlModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.trueContent).toEqual(booleanLedSettings.trueContent);
            expect(controlModel.falseContent).toEqual(booleanLedSettings.falseContent);
        }, function () {
            expect(controlElement.trueContent).toEqual(booleanLedSettings.trueContent);
            expect(controlElement.falseContent).toEqual(booleanLedSettings.falseContent);
        });
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(booleanLedSettings.left),
            "Top": parseInt(booleanLedSettings.top)
        };
        expect(position).toEqual(expectedPosition);
    });
    it('property set for Position updates model.', function (done) {
        const newPosition = { Left: 101, Top: 201 };
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
            expect(parseInt(controlModel.left)).toEqual(newPosition.Left);
            expect(parseInt(controlModel.top)).toEqual(newPosition.Top);
        });
    });
    it('property set for Position updates control element.', function (done) {
        const newPosition = { Left: 151, Top: 251 };
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
        }, function () {
            const computedStyle = window.getComputedStyle(controlElement);
            expect(parseInt(computedStyle.left)).toEqual(newPosition.Left);
            expect(parseInt(computedStyle.top)).toEqual(newPosition.Top);
        });
    });
});
//# sourceMappingURL=niBooleanLedProperties.Test.js.map