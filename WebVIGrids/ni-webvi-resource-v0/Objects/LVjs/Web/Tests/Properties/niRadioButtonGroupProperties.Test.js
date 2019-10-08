//****************************************
// G Property Tests for RadioButtonGroupModel class
// National Instruments Copyright 2018
//****************************************
import { ColorValueConverters as ColorHelpers } from '../../Framework/ValueConverters/niColorValueConverters.js';
import { NI_SUPPORT } from '../../Framework/niSupport.js';
import { NumericValueSelectorModel } from '../../Modeling/niNumericValueSelectorModel.js';
import { RadioButtonGroupModel } from '../../Modeling/niRadioButtonGroupModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A RadioButtonGroup control', function () {
    'use strict';
    let controlId;
    let updateService, viModel, frontPanelControls, controlModel, controlElement, viewModel, radioButtonSettings;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.radioButtonSettings2.niControlId;
            radioButtonSettings = fixture.radioButtonSettings2;
            Object.freeze(radioButtonSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    beforeEach(function (done) {
        webAppHelper.createNIElement(radioButtonSettings);
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
    it('property read for Items throws an exception.', function () {
        expect(function () {
            viewModel.getGPropertyValue(NumericValueSelectorModel.ITEMS_G_PROPERTY_NAME);
        }).toThrow();
    });
    it('property read for Value returns current value.', function () {
        const currentValue = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
        expect(currentValue).toEqual(radioButtonSettings.value);
    });
    it('property set for Value updates model.', function (done) {
        const newValue = 2;
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        });
    });
    it('property set for Items throws an exception.', function (done) {
        const newItems = ['alpha', 'beta', 'charlie'];
        testHelpers.runAsync(done, function () {
            expect(function () {
                viewModel.setGPropertyValue(NumericValueSelectorModel.ITEMS_G_PROPERTY_NAME, newItems);
            }).toThrow();
        });
    });
    it('property set for Value updates control element.', function (done) {
        const newValue = 2;
        const newSource = [{ value: '0', displayValue: 'a' },
            { value: '1', displayValue: 'b' },
            { value: '2', displayValue: 'c' },
            { value: '3', displayValue: 'd' }];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(radioButtonSettings.niControlId, { items: newSource });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        }, function () {
            expect(controlElement.value.numberValue).toEqual(newValue);
        });
    });
    it('set Value property to negative resets back to 0.', function (done) {
        const newValue = -2;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(0);
        }, function () {
            expect(controlElement.value.numberValue).toEqual(0);
        });
    });
    it('set Value property > +ve enum bounds resets back to highest value within bounds.', function (done) {
        const newValue = 4;
        const newSource = [{ value: '0', displayValue: 'first' },
            { value: '1', displayValue: 'second' },
            { value: '2', displayValue: 'third' },
            { value: '3', displayValue: 'fourth' }];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(radioButtonSettings.niControlId, { items: newSource });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(3);
        }, function () {
            expect(controlElement.value.numberValue).toEqual(3);
        });
    });
    it('property set for Value does not call controlChanged function of updateService', function (done) {
        const newValue = 2;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).not.toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling calls controlChanged function of updateService with correct arguments', function (done) {
        const newValue = 2;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValue, radioButtonSettings.value);
        });
    });
    it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
        const newValue = radioButtonSettings.value;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling updates model.', function (done) {
        const newValue = 2;
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        });
    });
    it('property set for valueSignaling updates control element.', function (done) {
        const newValue = 2;
        const newSource = [{ value: '0', displayValue: 'a' },
            { value: '1', displayValue: 'b' },
            { value: '2', displayValue: 'c' },
            { value: '3', displayValue: 'd' }];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(radioButtonSettings.niControlId, { items: newSource });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        }, function () {
            expect(controlElement.value.numberValue).toEqual(newValue);
        });
    });
    it('set valueSignaling property to negative resets back to 0.', function (done) {
        const newValue = -2;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(0);
        }, function () {
            expect(controlElement.value.numberValue).toEqual(0);
        });
    });
    it('set valueSignaling property > +ve enum bounds resets back to highest value within bounds.', function (done) {
        const newValue = 4;
        const newSource = [{ value: '0', displayValue: 'first' },
            { value: '1', displayValue: 'second' },
            { value: '2', displayValue: 'third' },
            { value: '3', displayValue: 'fourth' }];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(radioButtonSettings.niControlId, { items: newSource });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(3);
        }, function () {
            expect(controlElement.value.numberValue).toEqual(3);
        });
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(radioButtonSettings.left),
            "Top": parseInt(radioButtonSettings.top)
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
    it('property get for selected color returns the current model selected color value in integer format', function () {
        const currentColor = viewModel.getGPropertyValue(RadioButtonGroupModel.SELECTED_COLOR_G_PROPERTY_NAME);
        expect(ColorHelpers.integerToRGBA(currentColor)).toEqual(controlModel.selectedButtonBackground);
    });
    it('property set for selected Color updates the model.', function () {
        const argbInt = 0x99995356;
        const expectedColor = 'rgba(153,83,86,0.6)';
        viewModel.setGPropertyValue(RadioButtonGroupModel.SELECTED_COLOR_G_PROPERTY_NAME, argbInt);
        expect(controlModel.selectedButtonBackground).toEqual(expectedColor);
    });
    it('property set for selected color updates the element.', function (done) {
        const argbInt = 0x213347BC;
        const expectedColor = 'rgba(51,71,188,0.13)';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(RadioButtonGroupModel.SELECTED_COLOR_G_PROPERTY_NAME, argbInt);
        }, function () {
            expect(controlElement.selectedButtonBackground).toEqual(expectedColor);
        });
    });
    it('property get for selected color throws an error when it is in gradient format.', function () {
        const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_WITH_GRADIENT_COLOR_NOT_SUPPORTED', RadioButtonGroupModel.SELECTED_COLOR_G_PROPERTY_NAME);
        webAppHelper.dispatchMessage(controlId, {
            selectedButtonBackground: 'linear-gradient(190deg, #FFFFFF 0%, #AAAAAA 100%)'
        });
        expect(function () {
            viewModel.getGPropertyValue(RadioButtonGroupModel.SELECTED_COLOR_G_PROPERTY_NAME);
        }).toThrowError(Error, errorMessage);
    });
    it('property get for selected color with hex value return the expected integer value', function () {
        const updateSettings = { selectedButtonBackground: '#fff' };
        const expectedIntColor = 4294967295;
        webAppHelper.dispatchMessage(controlId, updateSettings);
        const currentColor = viewModel.getGPropertyValue(RadioButtonGroupModel.SELECTED_COLOR_G_PROPERTY_NAME);
        expect(currentColor).toEqual(expectedIntColor);
    });
    it('property get for unselected color returns the current model unselected color value in integer format', function () {
        const currentColor = viewModel.getGPropertyValue(RadioButtonGroupModel.UNSELECTED_COLOR_G_PROPERTY_NAME);
        expect(ColorHelpers.integerToRGBA(currentColor)).toEqual(controlModel.unselectedButtonBackground);
    });
    it('property set for unselected color updates the model.', function () {
        const argbInt = 0x99995356;
        const expectedColor = 'rgba(153,83,86,0.6)';
        viewModel.setGPropertyValue(RadioButtonGroupModel.UNSELECTED_COLOR_G_PROPERTY_NAME, argbInt);
        expect(controlModel.unselectedButtonBackground).toEqual(expectedColor);
    });
    it('property set for unselected Color updates the element.', function (done) {
        const argbInt = 0x213347BC;
        const expectedColor = 'rgba(51,71,188,0.13)';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(RadioButtonGroupModel.UNSELECTED_COLOR_G_PROPERTY_NAME, argbInt);
        }, function () {
            expect(controlElement.unselectedButtonBackground).toEqual(expectedColor);
        });
    });
    it('property get for unselected color throws an error when it is in gradient format.', function () {
        const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_WITH_GRADIENT_COLOR_NOT_SUPPORTED', RadioButtonGroupModel.UNSELECTED_COLOR_G_PROPERTY_NAME);
        webAppHelper.dispatchMessage(controlId, {
            unselectedButtonBackground: 'linear-gradient(190deg, #FFFFFF 0%, #AAAAAA 100%)'
        });
        expect(function () {
            viewModel.getGPropertyValue(RadioButtonGroupModel.UNSELECTED_COLOR_G_PROPERTY_NAME);
        }).toThrowError(Error, errorMessage);
    });
    it('property get for unselected color with hex value return the expected integer value', function () {
        const updateSettings = { unselectedButtonBackground: ' #fff' };
        const expectedIntColor = 4294967295;
        webAppHelper.dispatchMessage(controlId, updateSettings);
        const currentColor = viewModel.getGPropertyValue(RadioButtonGroupModel.UNSELECTED_COLOR_G_PROPERTY_NAME);
        expect(currentColor).toEqual(expectedIntColor);
    });
});
//# sourceMappingURL=niRadioButtonGroupProperties.Test.js.map