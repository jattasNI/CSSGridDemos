//****************************************
// G Property Tests for CheckBoxModel class
// National Instruments Copyright 2018
//****************************************
import { BooleanControlModel } from '../../Modeling/niBooleanControlModel.js';
import { CheckBoxModel } from '../../Modeling/niCheckBoxModel.js';
import { ColorValueConverters as ColorHelpers } from '../../Framework/ValueConverters/niColorValueConverters.js';
import { NI_SUPPORT } from '../../Framework/niSupport.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A CheckBox control', function () {
    'use strict';
    let controlId;
    let updateService, viModel, frontPanelControls, controlModel, viewModel, controlElement, checkBoxSettings;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.checkBoxSettings2.niControlId;
            checkBoxSettings = fixture.checkBoxSettings2;
            Object.freeze(checkBoxSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    beforeEach(function (done) {
        webAppHelper.createNIElement(checkBoxSettings);
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
        const currentValue = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
        expect(currentValue).toEqual(checkBoxSettings.value);
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
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValue, checkBoxSettings.value);
        });
    });
    it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
        const newValue = checkBoxSettings.value;
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
            expect(controlModel.content).toEqual(checkBoxSettings.content);
        }, function () {
            expect(controlElement.content).toEqual(checkBoxSettings.content);
        });
    });
    it('property get for checkmark color returns the current checkmark color', function () {
        const currentColor = viewModel.getGPropertyValue(CheckBoxModel.CHECK_MARK_COLOR_G_PROPERTY_NAME);
        expect(ColorHelpers.integerToRGBA(currentColor)).toEqual(checkBoxSettings.checkMarkColor);
    });
    it('property set for checkmark color updates the model.', function () {
        const argbInt = 0x91EE1C25;
        const expectedColor = 'rgba(238,28,37,0.57)';
        viewModel.setGPropertyValue(CheckBoxModel.CHECK_MARK_COLOR_G_PROPERTY_NAME, argbInt);
        expect(controlModel.checkMarkColor).toEqual(expectedColor);
    });
    it('property set for checkmark color updates the element.', function (done) {
        const argbInt = 0xFFEE1C25;
        const expectedColor = 'rgba(238,28,37,1)';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(CheckBoxModel.CHECK_MARK_COLOR_G_PROPERTY_NAME, argbInt);
        }, function () {
            expect(controlElement.style.getPropertyValue('--ni-check-mark-color')).toEqual(expectedColor);
        });
    });
    it('property get for checkmark color with hex value return the expected integer value', function (done) {
        const updateSettings = { checkMarkColor: ' #fff' };
        const expectedIntColor = 4294967295;
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, updateSettings);
        }, function () {
            const currentColor = viewModel.getGPropertyValue(CheckBoxModel.CHECK_MARK_COLOR_G_PROPERTY_NAME);
            expect(currentColor).toEqual(expectedIntColor);
        });
    });
    it('property get for checkmark color throws an error when checkmark is in gradient format.', function () {
        const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_WITH_GRADIENT_COLOR_NOT_SUPPORTED', CheckBoxModel.CHECK_MARK_COLOR_G_PROPERTY_NAME);
        webAppHelper.dispatchMessage(controlId, {
            checkMarkColor: ' linear-gradient(190deg, #FFFFFF 0%, #AAAAAA 100%)'
        });
        expect(function () {
            viewModel.getGPropertyValue(CheckBoxModel.CHECK_MARK_COLOR_G_PROPERTY_NAME);
        }).toThrowError(Error, errorMessage);
    });
    it('property get for checkmark color with hex value return the expected integer value', function () {
        const updateSettings = { checkMarkColor: ' #fff' };
        const expectedIntColor = 4294967295;
        webAppHelper.dispatchMessage(controlId, updateSettings);
        const currentColor = viewModel.getGPropertyValue(CheckBoxModel.CHECK_MARK_COLOR_G_PROPERTY_NAME);
        expect(currentColor).toEqual(expectedIntColor);
    });
});
//# sourceMappingURL=niCheckBoxProperties.Test.js.map