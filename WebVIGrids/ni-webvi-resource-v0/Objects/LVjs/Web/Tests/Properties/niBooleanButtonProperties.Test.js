//****************************************
// G Property Tests for BooleanButtonModel class
// National Instruments Copyright 2018
//****************************************
import { BooleanControlModel } from '../../Modeling/niBooleanControlModel.js';
import { ColorValueConverters as ColorHelpers } from '../../Framework/ValueConverters/niColorValueConverters.js';
import { NI_SUPPORT } from '../../Framework/niSupport.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A BooleanButton control', function () {
    'use strict';
    let updateService, viModel, frontPanelControls, controlModel, viewModel, controlElement;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, booleanButtonSettings;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.booleanButtonSettings2.niControlId;
            booleanButtonSettings = fixture.booleanButtonSettings2;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    beforeEach(function (done) {
        Object.freeze(booleanButtonSettings);
        webAppHelper.createNIElement(booleanButtonSettings);
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
        const value = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
        expect(value).toEqual(booleanButtonSettings.value);
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
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValue, booleanButtonSettings.value);
        });
    });
    it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
        const newValue = booleanButtonSettings.value;
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
        expect(text).toEqual([controlModel.content]);
    });
    it('property set for Text updates model.', function (done) {
        const newText = ['Text2'];
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(BooleanControlModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.content).toEqual(newText[0]);
        });
    });
    it('property set for Text updates control element.', function (done) {
        const newText = ['Text2'];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(BooleanControlModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.content).toEqual(newText[0]);
        }, function () {
            expect(controlElement.content).toEqual(newText[0]);
        });
    });
    it('property set empty string for text updates control element.', function (done) {
        const newText = [''];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(BooleanControlModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.content).toEqual(newText[0]);
        }, function () {
            expect(controlElement.content).toEqual(newText[0]);
        });
    });
    it('property set non ASCII characters for text updates control element.', function (done) {
        const newText = ['Iñtërnâtiônàlizætiøn☃💩😴😄😃⛔🎠🚓🚇<!-- test comment -->'];
        const expectedText = 'Iñtërnâtiônàlizætiøn☃💩😴😄😃⛔🎠🚓🚇&lt;!-- test comment --&gt;';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(BooleanControlModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.content).toEqual(expectedText);
        }, function () {
            expect(controlElement.content).toEqual(expectedText);
        });
    });
    it('property set multiline text for text updates control element.', function (done) {
        const newText = [`This is
        multiline text`];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(BooleanControlModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.content).toEqual(newText[0]);
        }, function () {
            expect(controlElement.content).toEqual(newText[0]);
        });
    });
    it('property set for text with array containing more than one elements updates control element.', function (done) {
        const newText = ['text1', 'text2', 'text3'];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(BooleanControlModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.content).toEqual(newText[0]);
        }, function () {
            expect(controlElement.content).toEqual(newText[0]);
        });
    });
    it('property set for text with empty array will leave the control element unchanged.', function (done) {
        const newText = [];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(BooleanControlModel.TEXT_G_PROPERTY_NAME, newText);
            expect(controlModel.content).toEqual(booleanButtonSettings.content);
        }, function () {
            expect(controlElement.content).toEqual(booleanButtonSettings.content);
        });
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(booleanButtonSettings.left),
            "Top": parseInt(booleanButtonSettings.top)
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
    it('property get for Size gets the size of the control.', function (done) {
        testHelpers.runAsync(done, function () {
            const sizePromise = viewModel.getGPropertyValue(VisualModel.SIZE_G_PROPERTY_NAME);
            sizePromise.then(function (size) {
                expect(size.Width).toEqual(parseInt(booleanButtonSettings.width));
                expect(size.Height).toEqual(parseInt(booleanButtonSettings.height));
            });
        });
    });
    it('property set and get for Size returns the correct updated size of the control.', function (done) {
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.SIZE_G_PROPERTY_NAME, { Width: 100, Height: 50 });
            const sizePromise = viewModel.getGPropertyValue(VisualModel.SIZE_G_PROPERTY_NAME);
            sizePromise.then(function (size) {
                expect(size.Width).toEqual(100);
                expect(size.Height).toEqual(50);
                const style = window.getComputedStyle(controlElement);
                expect(parseInt(style.width)).toEqual(100);
                expect(parseInt(style.height)).toEqual(50);
            });
        });
    });
    it('property get for true color returns the current true color', function () {
        const currentColor = viewModel.getGPropertyValue(BooleanControlModel.TRUE_COLOR_G_PROPERTY_NAME);
        expect(ColorHelpers.integerToRGBA(currentColor)).toEqual(booleanButtonSettings.trueBackground);
    });
    it('property set for true color updates the model.', function () {
        const argbInt = 0x99995356;
        const expectedColor = 'rgba(153,83,86,0.6)';
        viewModel.setGPropertyValue(BooleanControlModel.TRUE_COLOR_G_PROPERTY_NAME, argbInt);
        expect(controlModel.trueBackground).toEqual(expectedColor);
    });
    it('property set for true color updates the element.', function (done) {
        const argbInt = 0x213347BC;
        const expectedColor = 'rgba(51,71,188,0.13)';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(BooleanControlModel.TRUE_COLOR_G_PROPERTY_NAME, argbInt);
        }, function () {
            expect(controlElement.style.getPropertyValue("--ni-true-background")).toEqual(expectedColor);
        });
    });
    it('property get for true color with hex value return the expected integer value', function () {
        const updateSettings = { trueBackground: ' #fff' };
        const expectedIntColor = 4294967295;
        webAppHelper.dispatchMessage(controlId, updateSettings);
        const currentColor = viewModel.getGPropertyValue(BooleanControlModel.TRUE_COLOR_G_PROPERTY_NAME);
        expect(currentColor).toEqual(expectedIntColor);
    });
    it('property get for false color returns the current false color', function () {
        const currentColor = viewModel.getGPropertyValue(BooleanControlModel.FALSE_COLOR_G_PROPERTY_NAME);
        expect(ColorHelpers.integerToRGBA(currentColor)).toEqual(booleanButtonSettings.falseBackground);
    });
    it('property set for false color updates the model.', function () {
        const argbInt = 0x99995356;
        const expectedColor = 'rgba(153,83,86,0.6)';
        viewModel.setGPropertyValue(BooleanControlModel.FALSE_COLOR_G_PROPERTY_NAME, argbInt);
        expect(controlModel.falseBackground).toEqual(expectedColor);
    });
    it('property set for false color updates the element.', function (done) {
        const argbInt = 0x213347BC;
        const expectedColor = 'rgba(51,71,188,0.13)';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(BooleanControlModel.FALSE_COLOR_G_PROPERTY_NAME, argbInt);
        }, function () {
            expect(controlElement.style.getPropertyValue("--ni-false-background")).toEqual(expectedColor);
        });
    });
    it('property get for true gradient color throws error.', function (done) {
        const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_WITH_GRADIENT_COLOR_NOT_SUPPORTED', BooleanControlModel.TRUE_COLOR_G_PROPERTY_NAME);
        const updateSettings = {};
        updateSettings.trueBackground = "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(248, 148, 28) 100%)";
        webAppHelper.dispatchMessage(controlId, updateSettings);
        testHelpers.runAsync(done, function () {
            expect(function () {
                viewModel.getGPropertyValue(BooleanControlModel.TRUE_COLOR_G_PROPERTY_NAME);
            }).toThrowError(Error, errorMessage);
        });
    });
    it('property get for false gradient color throws error.', function (done) {
        const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_WITH_GRADIENT_COLOR_NOT_SUPPORTED', BooleanControlModel.FALSE_COLOR_G_PROPERTY_NAME);
        const updateSettings = {};
        updateSettings.falseBackground = "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(248, 148, 28) 100%)";
        webAppHelper.dispatchMessage(controlId, updateSettings);
        testHelpers.runAsync(done, function () {
            expect(function () {
                viewModel.getGPropertyValue(BooleanControlModel.FALSE_COLOR_G_PROPERTY_NAME);
            }).toThrowError(Error, errorMessage);
        });
    });
    it('property get for false color with hex value return the expected integer value', function () {
        const updateSettings = { falseBackground: '#fff' };
        const expectedIntColor = 4294967295;
        webAppHelper.dispatchMessage(controlId, updateSettings);
        const currentColor = viewModel.getGPropertyValue(BooleanControlModel.FALSE_COLOR_G_PROPERTY_NAME);
        expect(currentColor).toEqual(expectedIntColor);
    });
});
//# sourceMappingURL=niBooleanButtonProperties.Test.js.map