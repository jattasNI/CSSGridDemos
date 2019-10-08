//****************************************
// G Property Tests for EnumSelectorModel class
// National Instruments Copyright 2018
//****************************************
import { NumericValueSelectorModel } from '../../Modeling/niNumericValueSelectorModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('An Enum control', function () {
    'use strict';
    let updateService, viModel, frontPanelControls, controlModel, controlElement, viewModel;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, enumSelectorSettings;
    const newSource = [{ value: '0', displayValue: 'a' },
        { value: '1', displayValue: 'b' },
        { value: '2', displayValue: 'c' },
        { value: '3', displayValue: 'd' }];
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.enumSelectorSettings.niControlId;
            enumSelectorSettings = fixture.enumSelectorSettings;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    beforeEach(function (done) {
        Object.freeze(enumSelectorSettings);
        webAppHelper.createNIElement(enumSelectorSettings);
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
        expect(currentValue).toEqual(enumSelectorSettings.value);
    });
    it('property read for DisabledIndexes returns all the disabled indexes.', function (done) {
        const disabledIndexes = [1];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlModel.niControlId, { disabledIndexes: disabledIndexes });
        }, function () {
            const currentDisabledIndexes = viewModel.getGPropertyValue(NumericValueSelectorModel.DISABLED_INDEXES_G_PROPERTY_NAME);
            expect(currentDisabledIndexes).toEqual(disabledIndexes);
        });
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
        const newValue = 1;
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, { items: newSource });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        }, function () {
            expect(controlElement.firstElementChild.selectedIndexes).toEqual([newValue]);
        });
    });
    it('set Value property to negative resets back to 0.', function (done) {
        const newValue = -2;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(0);
        }, function () {
            expect(controlElement.firstElementChild.selectedIndexes).toEqual([0]);
        });
    });
    it('set Value property > +ve enum bounds resets back to highest value within bounds.', function (done) {
        const newValue = 4;
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, { items: newSource });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(3);
        }, function () {
            expect(controlElement.firstElementChild.selectedIndexes).toEqual([3]);
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
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValue, enumSelectorSettings.value);
        });
    });
    it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
        const newValue = enumSelectorSettings.value;
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
        const newValue = 1;
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, { items: newSource });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        }, function () {
            expect(controlElement.firstElementChild.selectedIndexes).toEqual([newValue]);
        });
    });
    it('set valueSignaling property to negative resets back to 0.', function (done) {
        const newValue = -2;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(0);
        }, function () {
            expect(controlElement.firstElementChild.selectedIndexes).toEqual([0]);
        });
    });
    it('set valueSignaling property > +ve enum bounds resets back to highest value within bounds.', function (done) {
        const newValue = 4;
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, { items: newSource });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(3);
        }, function () {
            expect(controlElement.firstElementChild.selectedIndexes).toEqual([3]);
        });
    });
    it('property set for DisabledIndexes updates the control element', function (done) {
        const disabledIndexes = [0, 1];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlElement.niControlId, { items: newSource });
        }, function () {
            viewModel.setGPropertyValue(NumericValueSelectorModel.DISABLED_INDEXES_G_PROPERTY_NAME, disabledIndexes);
            expect(controlModel.disabledIndexes).toEqual(disabledIndexes);
        }, function () {
            expect(JSON.parse(controlElement.disabledIndexes)).toEqual(disabledIndexes);
        });
    });
    it('set DisabledIndexes to empty array updates the control element.', function (done) {
        const disabledIndexes = [];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(enumSelectorSettings.niControlId, {
                items: newSource
            });
        }, function () {
            viewModel.setGPropertyValue(NumericValueSelectorModel.DISABLED_INDEXES_G_PROPERTY_NAME, disabledIndexes);
            expect(controlModel.disabledIndexes).toEqual(disabledIndexes);
        }, function () {
            expect(JSON.parse(controlElement.disabledIndexes)).toEqual(disabledIndexes);
        });
    });
    it('set DisabledIndexes should not remove out of bounds, duplicate indices and update the valid indices of element.', function (done) {
        const disabledIndexes = [-1, 2, 2, 100, -10];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(enumSelectorSettings.niControlId, {
                items: newSource
            });
        }, function () {
            viewModel.setGPropertyValue(NumericValueSelectorModel.DISABLED_INDEXES_G_PROPERTY_NAME, disabledIndexes);
            expect(controlModel.disabledIndexes).toEqual(disabledIndexes);
        }, function () {
            expect(JSON.parse(controlElement.disabledIndexes)).toEqual(disabledIndexes);
            const items = controlElement.querySelectorAll('jqx-list-item');
            disabledIndexes.forEach(index => {
                if (index >= 0 && index < items.length) {
                    expect(items[index].disabled).toEqual(true);
                    // also check for opacity
                    const style = window.getComputedStyle(items[index]);
                    expect(style.opacity).toBeLessThan(1.0);
                }
            });
        });
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(enumSelectorSettings.left),
            "Top": parseInt(enumSelectorSettings.top)
        };
        expect(position).toEqual(expectedPosition);
    });
    it('property set for Position updates model.', function (done) {
        const newPosition = { Left: 107, Top: 207 };
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
            expect(parseInt(controlModel.left)).toEqual(newPosition.Left);
            expect(parseInt(controlModel.top)).toEqual(newPosition.Top);
        });
    });
    it('property set for Position updates control element.', function (done) {
        const newPosition = { Left: 157, Top: 257 };
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
        }, function () {
            const computedStyle = window.getComputedStyle(controlElement);
            expect(parseInt(computedStyle.left)).toEqual(newPosition.Left);
            expect(parseInt(computedStyle.top)).toEqual(newPosition.Top);
        });
    });
    it('property set true for KeyFocus makes the control the active element in the document.', function () {
        const previousKeyFocusPropertyValue = viewModel.getGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME);
        expect(previousKeyFocusPropertyValue).toEqual(false);
        viewModel.setGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME, true);
        expect(viewModel.element.contains(document.activeElement)).toEqual(true);
        expect(viewModel.element.querySelector('jqx-drop-down-list')).toEqual(document.activeElement);
    });
    it('property set false for KeyFocus blurs the control.', function () {
        viewModel.setGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME, true);
        expect(viewModel.element.contains(document.activeElement)).toEqual(true);
        viewModel.setGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME, false);
        expect(viewModel.element.contains(document.activeElement)).toEqual(false);
    });
});
//# sourceMappingURL=niEnumSelectorProperties.Test.js.map