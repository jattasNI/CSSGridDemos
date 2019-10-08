//****************************************
// G Property Tests for ListBoxModel class
// National Instruments Copyright 2018
//****************************************
import { ListBoxModel } from '../../Modeling/niListBoxModel.js';
import { SelectorModel } from '../../Modeling/niSelectorModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A ListBox control', function () {
    'use strict';
    let updateService, viModel, frontPanelControls, controlModel, viewModel, controlElement;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, listBoxSettings;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.listBoxSettings.niControlId;
            listBoxSettings = fixture.listBoxSettings;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    beforeEach(function (done) {
        Object.freeze(listBoxSettings);
        webAppHelper.createNIElement(listBoxSettings);
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
    it('property read for Items returns all current items.', function () {
        const items = viewModel.getGPropertyValue(SelectorModel.ITEMS_G_PROPERTY_NAME);
        expect(items).toEqual(['alpha', 'beta', 'charlie']);
    });
    it('property read for Value returns current value.', function () {
        const currentValue = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
        expect(currentValue).toEqual(listBoxSettings.selectedIndexes);
    });
    it('property set for Items updates model.', function (done) {
        const newItems = ['ondu', 'eraDu'];
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(SelectorModel.ITEMS_G_PROPERTY_NAME, newItems);
            expect(controlModel.source).toEqual(newItems);
        });
    });
    it('property set for Value updates model.', function (done) {
        const newSource = ['one', 'two', 'three', 'four', 'five', 'six'];
        const newValue = [-2, 3, 0, 7];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, {
                source: newSource,
                selectionMode: 'OneOrMore'
            });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.selectedIndexes).toEqual(newValue);
        });
    });
    it('property set for Items updates control element.', function (done) {
        const newItems = ['ondu', 'eraDu'];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(SelectorModel.ITEMS_G_PROPERTY_NAME, newItems);
            expect(controlModel.source).toEqual(newItems);
        }, function () {
            expect(controlElement.items.map(x => x.value)).toEqual(newItems);
        });
    });
    it('property set for Value updates control element for selectionMode as one.', function (done) {
        const newValue = 2;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.selectedIndexes).toEqual(newValue);
        }, function () {
            expect(controlElement.selectedIndexes).toEqual([2]);
        });
    });
    it('property set for Value updates control element for selectionMode as zero or one.', function (done) {
        const newValue = -1;
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, {
                selectionMode: 'ZeroOrOne'
            });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.selectedIndexes).toEqual(newValue);
        }, function () {
            expect(controlElement.selectedIndexes).toEqual([]);
        });
    });
    it('property get for Value returns scalar value when selectionMode as zero or one.', function (done) {
        const newValue = 0;
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, {
                selectionMode: 'ZeroOrOne',
                selectedIndexes: newValue
            });
        }, function () {
            const currentIndex = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(currentIndex).toEqual(0);
        });
    });
    it('property set for Value updates control element for selectionMode as oneOrMore.', function (done) {
        const newValue = [5, 1, 2, 0, -9, 10];
        const newSource = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, {
                source: newSource,
                selectionMode: 'OneOrMore'
            });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.selectedIndexes).toEqual(newValue);
        }, function () {
            expect(controlElement.selectedIndexes).toEqual([5, 1, 2, 0]);
        });
    });
    it('property set for Value does not call controlChanged function of updateService', function (done) {
        const newSource = ['one', 'two', 'three', 'four', 'five', 'six'];
        const newValue = [-2, 3, 0, 7];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, {
                source: newSource,
                selectionMode: 'OneOrMore'
            });
        }, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).not.toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling calls controlChanged function of updateService with correct arguments', function (done) {
        const newValue = [-2, 3, 0, 7];
        testHelpers.runMultipleAsync(done, function () {
        }, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'selectedIndexes', newValue, listBoxSettings.selectedIndexes);
        });
    });
    it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
        const newValue = listBoxSettings.selectedIndexes;
        testHelpers.runMultipleAsync(done, function () {
        }, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling updates model.', function (done) {
        const newSource = ['one', 'two', 'three', 'four', 'five', 'six'];
        const newValue = [-2, 3, 0, 7];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, {
                source: newSource,
                selectionMode: 'OneOrMore'
            });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.selectedIndexes).toEqual(newValue);
        });
    });
    it('property set for valueSignaling updates control element for selectionMode as one.', function (done) {
        const newValue = 2;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.selectedIndexes).toEqual(newValue);
        }, function () {
            expect(controlElement.selectedIndexes).toEqual([2]);
        });
    });
    it('property set for valueSignaling updates control element for selectionMode as zero or one.', function (done) {
        const newValue = -1;
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, {
                selectionMode: 'ZeroOrOne'
            });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.selectedIndexes).toEqual(newValue);
        }, function () {
            expect(controlElement.selectedIndexes).toEqual([]);
        });
    });
    it('property set for valueSignaling updates control element for selectionMode as oneOrMore.', function (done) {
        const newValue = [5, 1, 2, 0, -9, 10];
        const newSource = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, {
                source: newSource,
                selectionMode: 'OneOrMore'
            });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.selectedIndexes).toEqual(newValue);
        }, function () {
            expect(controlElement.selectedIndexes).toEqual([5, 1, 2, 0]);
        });
    });
    it('property get for TopVisibleRow with default state of listbox control returns 0 (first item).', function () {
        const topVisibleRow = viewModel.getGPropertyValue(ListBoxModel.TOP_VISIBLE_ROW_G_PROPERTY_NAME);
        const expectedTopVisibleRow = 0;
        expect(topVisibleRow).toEqual(expectedTopVisibleRow);
    });
    it('property set for TopVisibleRow with negative value throws an exception.', function () {
        expect(function () {
            const negativeTopvisibleRow = -7;
            viewModel.setGPropertyValue(ListBoxModel.TOP_VISIBLE_ROW_G_PROPERTY_NAME, negativeTopvisibleRow);
        }).toThrow();
    });
    it('property set for TopVisibleRow with out of bound value throws an exception.', function () {
        expect(function () {
            const newTopvisibleRow = 10;
            viewModel.setGPropertyValue(ListBoxModel.TOP_VISIBLE_ROW_G_PROPERTY_NAME, newTopvisibleRow);
        }).toThrow();
    });
    it('property set for TopVisibleRow updates control element', function (done) {
        const newSource = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
        const newTopvisibleRow = 2;
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, {
                source: newSource
            });
        }, function () {
            viewModel.setGPropertyValue(ListBoxModel.TOP_VISIBLE_ROW_G_PROPERTY_NAME, newTopvisibleRow);
        }, function () {
            const topVisibleRow = controlElement.topVisibleIndex;
            expect(topVisibleRow).toEqual(newTopvisibleRow);
        });
    });
    it('TopVisibleRow property set to value greater than index of last possible top visible row updates the control element with last possible row at the top.', function (done) {
        const newSource = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, {
                source: newSource
            });
        }, function () {
            const newTopvisibleRow = 7;
            viewModel.setGPropertyValue(ListBoxModel.TOP_VISIBLE_ROW_G_PROPERTY_NAME, newTopvisibleRow);
        }, function () {
            const lastTopVisibleRow = 3;
            const topVisibleRow = controlElement.topVisibleIndex;
            expect(topVisibleRow).toEqual(lastTopVisibleRow);
        });
    });
    it('scrolling the items in the ListBox will updates the TopVisibleRow .', function (done) {
        const newSource = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, {
                source: newSource
            });
        }, function () {
            controlElement._scrollView.scrollTop = 40;
        }, function () {
            const newTopVisibleRow = 2;
            const topVisibleRow = controlElement.topVisibleIndex;
            expect(topVisibleRow).toEqual(newTopVisibleRow);
        });
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(listBoxSettings.left),
            "Top": parseInt(listBoxSettings.top)
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
//# sourceMappingURL=niListBoxProperties.Test.js.map