//****************************************
// G Property Tests for RingSelectorModel class
// National Instruments Copyright 2018
//****************************************
import { NumericValueSelectorModel } from '../../Modeling/niNumericValueSelectorModel.js';
import { RingSelectorModel } from '../../Modeling/niRingSelectorModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A Ring control', function () {
    'use strict';
    let controlId;
    let updateService, viModel, frontPanelControls, controlModel, viewModel, controlElement, ringSelectorsettings;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    const newSource = [{ value: '0', displayValue: 'first' },
        { value: '1', displayValue: 'second' },
        { value: '2', displayValue: 'third' },
        { value: '3', displayValue: 'fourth' }];
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.ringSelectorsettings.niControlId;
            ringSelectorsettings = fixture.ringSelectorsettings;
            Object.freeze(ringSelectorsettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    beforeEach(function (done) {
        webAppHelper.createNIElement(ringSelectorsettings);
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
    it('property read for Items returns only display values.', function () {
        const items = viewModel.getGPropertyValue(NumericValueSelectorModel.ITEMS_G_PROPERTY_NAME);
        expect(items).toEqual(['first', 'second', 'third']);
    });
    it('property read for ItemsAndValues returns items and values.', function () {
        const items = viewModel.getGPropertyValue(RingSelectorModel.ITEMS_AND_VALUES_G_PROPERTY_NAME);
        expect(items).toEqual([{ String: 'first', Value: '0' }, { String: 'second', Value: '2' }, { String: 'third', Value: '10' }]);
    });
    it('property read for Value returns current value.', function () {
        const currentValue = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
        expect(currentValue).toEqual(ringSelectorsettings.value);
    });
    it('property read for DisabledIndexes returns all the disabled indexes.', function (done) {
        const disabledIndexes = [1];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(ringSelectorsettings.niControlId, { disabledIndexes: disabledIndexes });
        }, function () {
            const currentDisabledIndexes = viewModel.getGPropertyValue(NumericValueSelectorModel.DISABLED_INDEXES_G_PROPERTY_NAME);
            expect(currentDisabledIndexes).toEqual(disabledIndexes);
        });
    });
    it('property set for Items updates display values and values, and uses auto numbering scheme for values.', function (done) {
        const newItems = ['alpha', 'beta', 'charlie'];
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(NumericValueSelectorModel.ITEMS_G_PROPERTY_NAME, newItems);
            expect(controlModel.items).toEqual([{ value: 0, displayValue: 'alpha' }, { value: 1, displayValue: 'beta' }, { value: 2, displayValue: 'charlie' }]);
        });
    });
    it('property set for Items updates control element.', function (done) {
        const newItems = ['alpha', 'beta', 'charlie'];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(NumericValueSelectorModel.ITEMS_G_PROPERTY_NAME, newItems);
            expect(controlModel.items).toEqual([{ value: 0, displayValue: 'alpha' }, { value: 1, displayValue: 'beta' }, { value: 2, displayValue: 'charlie' }]);
        }, function () {
            expect(controlElement.items).toEqual('[{"displayValue":"alpha","value":0},{"displayValue":"beta","value":1},{"displayValue":"charlie","value":2}]');
        });
    });
    it('property set for DisabledIndexes updates the control element.', function (done) {
        const disabledIndexes = [0, 1];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(ringSelectorsettings.niControlId, { items: newSource });
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
            webAppHelper.dispatchMessage(ringSelectorsettings.niControlId, { items: newSource });
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
            webAppHelper.dispatchMessage(ringSelectorsettings.niControlId, { items: newSource });
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
    it('property set for ItemsAndValues updates control element.', function (done) {
        const newItems = [{ Value: 0, String: 'alpha' }, { Value: 1, String: 'beta' }, { Value: 4, String: 'tango' }];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(RingSelectorModel.ITEMS_AND_VALUES_G_PROPERTY_NAME, newItems);
        }, function () {
            expect(controlModel.items).toEqual([{ value: 0, displayValue: 'alpha' }, { value: 1, displayValue: 'beta' }, { value: 4, displayValue: 'tango' }]);
            expect(controlElement.items).toEqual('[{"displayValue":"alpha","value":0},{"displayValue":"beta","value":1},{"displayValue":"tango","value":4}]');
        });
    });
    it('property set for ItemsAndValues throws for duplicate values.', function () {
        const newItems = [{ Value: 0, String: 'alpha' }, { Value: 0, String: 'beta' }, { Value: 4, String: 'tango' }];
        const setGPropertyValuesFunction = function () {
            viewModel.setGPropertyValue(RingSelectorModel.ITEMS_AND_VALUES_G_PROPERTY_NAME, newItems);
        };
        expect(setGPropertyValuesFunction).toThrow();
    });
    it('property set for ItemsAndValues throws for empty display name values.', function () {
        const newItems = [{ Value: 0, String: '' }, { Value: 1, String: 'beta' }, { Value: 4, String: 'tango' }];
        const setGPropertyValuesFunction = function () {
            viewModel.setGPropertyValue(RingSelectorModel.ITEMS_AND_VALUES_G_PROPERTY_NAME, newItems);
        };
        expect(setGPropertyValuesFunction).toThrow();
    });
    it('property set for ItemsAndValues throws for duplicate display name values.', function () {
        const newItems = [{ Value: 0, String: 'alpha' }, { Value: 1, String: 'alpha' }, { Value: 4, String: 'tango' }];
        const setGPropertyValuesFunction = function () {
            viewModel.setGPropertyValue(RingSelectorModel.ITEMS_AND_VALUES_G_PROPERTY_NAME, newItems);
        };
        expect(setGPropertyValuesFunction).toThrow();
    });
    it('property set for Value updates control element.', function (done) {
        const newValue = 2;
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(ringSelectorsettings.niControlId, { items: newSource });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        }, function () {
            expect(controlElement.firstElementChild.selectedIndexes).toEqual([newValue]);
        });
    });
    it('property set for Value updates the model when allow undefined is true.', function (done) {
        const newValue = -2;
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(ringSelectorsettings.niControlId, {
                items: newSource,
                allowUndefined: true
            });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        });
    });
    it('set Value property to negative does not clamp.', function (done) {
        const newValue = -2;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(-2);
        }, function () {
            expect(controlElement.firstElementChild.selectedIndexes).toEqual([3]);
        });
    });
    it('set Value property > +ve out of bounds doesn not clamp.', function (done) {
        const newValue = 4;
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(ringSelectorsettings.niControlId, { items: newSource });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(4);
        }, function () {
            expect(controlElement.firstElementChild.selectedIndexes).toEqual([4]);
        });
    });
    it('set Items does not delete last element if previous Value was set to out of bounds', function (done) {
        const outOfBoundsValue = 4;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, outOfBoundsValue);
        }, function () {
            webAppHelper.dispatchMessage(ringSelectorsettings.niControlId, { items: newSource });
            expect(controlModel.value).toEqual(4);
        }, function () {
            const numberOfItems = controlElement.itemsArray.length;
            expect(numberOfItems).toBe(4);
        });
    });
    it('property set for Value does not call controlChanged function of updateService', function (done) {
        const newValue = -2;
        const newSource = [{ value: '0', displayValue: 'a' },
            { value: '11', displayValue: 'b' },
            { value: '21', displayValue: 'c' },
            { value: '13', displayValue: 'd' }];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(ringSelectorsettings.niControlId, {
                items: newSource,
                allowUndefined: true
            });
        }, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).not.toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling calls controlChanged function of updateService with correct arguments', function (done) {
        const newValue = -2;
        const newSource = [{ value: '0', displayValue: 'a' },
            { value: '11', displayValue: 'b' },
            { value: '21', displayValue: 'c' },
            { value: '13', displayValue: 'd' }];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(ringSelectorsettings.niControlId, {
                items: newSource,
                allowUndefined: true
            });
        }, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValue, ringSelectorsettings.value);
        });
    });
    it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
        const newValue = ringSelectorsettings.value;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling updates control element.', function (done) {
        const newValue = 2;
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(ringSelectorsettings.niControlId, { items: newSource });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        }, function () {
            expect(controlElement.firstElementChild.selectedIndexes).toEqual([newValue]);
        });
    });
    it('property set for valueSignaling updates the model when allow undefined is true.', function (done) {
        const newValue = -2;
        const newSource = [{ value: '0', displayValue: 'a' },
            { value: '11', displayValue: 'b' },
            { value: '21', displayValue: 'c' },
            { value: '13', displayValue: 'd' }];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(ringSelectorsettings.niControlId, {
                items: newSource,
                allowUndefined: true
            });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        });
    });
    it('set valueSignaling property to negative does not clamp.', function (done) {
        const newValue = -2;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(-2);
        }, function () {
            expect(controlElement.firstElementChild.selectedIndexes).toEqual([3]);
        });
    });
    it('set valueSignaling property > +ve out of bounds doesn not clamp.', function (done) {
        const newValue = 4;
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(ringSelectorsettings.niControlId, { items: newSource });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(4);
        }, function () {
            expect(controlElement.firstElementChild.selectedIndexes).toEqual([4]);
        });
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(ringSelectorsettings.left),
            "Top": parseInt(ringSelectorsettings.top)
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
//# sourceMappingURL=niRingSelectorProperties.Test.js.map