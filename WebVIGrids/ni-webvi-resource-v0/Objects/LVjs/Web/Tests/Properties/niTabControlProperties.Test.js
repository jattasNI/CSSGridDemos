//****************************************
// G Property Tests for TabControl
// National Instruments Copyright 2018
//****************************************
import { TabControlModel } from '../../Modeling/niTabControlModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A Tab control', function () {
    'use strict';
    let controlId;
    let stopButtonControlId;
    let updateService, viModel, controlModel, viewModel, controlElement, stopButtonControlViewModel;
    let tabSettings, stopButtonSettings, settingsTab0, settingsTab1, settingsLayout0, settingsLayout1;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.tabSettings2.niControlId;
            stopButtonControlId = fixture.tabStopButtonSettings.niControlId;
            stopButtonSettings = fixture.tabStopButtonSettings;
            settingsLayout1 = fixture.tabSettings2Layout1;
            settingsLayout0 = fixture.tabSettings2Layout0;
            settingsTab1 = fixture.tabSettings2Tab1;
            settingsTab0 = fixture.tabSettings2Tab0;
            tabSettings = fixture.tabSettings2;
            Object.freeze(tabSettings);
            Object.freeze(settingsTab0);
            Object.freeze(settingsTab1);
            Object.freeze(settingsLayout0);
            Object.freeze(settingsLayout1);
            Object.freeze(stopButtonSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    beforeEach(function (done) {
        webAppHelper.createNIElement(tabSettings);
        webAppHelper.createNIElement(settingsTab0, tabSettings.niControlId);
        webAppHelper.createNIElement(settingsLayout0, settingsTab0.niControlId);
        webAppHelper.createNIElement(settingsTab1, tabSettings.niControlId);
        webAppHelper.createNIElement(settingsLayout1, settingsTab1.niControlId);
        webAppHelper.createNIElement(stopButtonSettings, settingsLayout0.niControlId);
        testHelpers.runAsync(done, function () {
            controlModel = viModel.getControlModel(tabSettings.niControlId);
            viewModel = viModel.getControlViewModel(controlId);
            controlElement = viewModel.element;
            stopButtonControlViewModel = viModel.getControlViewModel(stopButtonSettings.niControlId);
            done();
        });
    });
    afterEach(function () {
        webAppHelper.removeNIElement(stopButtonControlId);
        webAppHelper.removeNIElement(controlId);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('disable property is set to false by default', function () {
        let isDisabled = viewModel.getGPropertyValue('Disabled');
        expect(isDisabled).toEqual(false);
        isDisabled = stopButtonControlViewModel.getGPropertyValue('Disabled');
        expect(isDisabled).toEqual(false);
    });
    it('calling disable on tab control disables control inside the tab control', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue('Disabled', true);
        }, function () {
            const isDisabled = stopButtonControlViewModel.element.disabled;
            expect(isDisabled).toEqual(true);
        });
    });
    it('property read for Value returns the current selected Index.', function () {
        const currentSelectedIndex = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
        expect(currentSelectedIndex).toEqual(tabSettings.selectedIndex);
    });
    it('property set for Value updates model.', function (done) {
        const newSelectedIndex = 1;
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newSelectedIndex);
            expect(controlModel.selectedIndex).toEqual(newSelectedIndex);
        });
    });
    it('property set for Value updates control element.', function (done) {
        const newSelectedIndex = 1;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newSelectedIndex);
            expect(controlModel.selectedIndex).toEqual(newSelectedIndex);
        }, function () {
            expect(controlElement.selectedIndex).toEqual(newSelectedIndex);
        });
    });
    it('property set negative index for Value updates control element and control model to 0.', function (done) {
        const newSelectedIndex = -5;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newSelectedIndex);
            expect(controlModel.selectedIndex).toEqual(0);
        }, function () {
            expect(controlElement.selectedIndex).toEqual(0);
        });
    });
    it('property set out of bound index for Value updates control element and control model to last index.', function (done) {
        const newSelectedIndex = 5;
        const expectedValue = controlModel.childModels.length - 1;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newSelectedIndex);
            expect(controlModel.selectedIndex).toEqual(expectedValue);
        }, function () {
            expect(controlElement.selectedIndex).toEqual(expectedValue);
        });
    });
    it('property set for Value does not call controlChanged function of updateService', function (done) {
        const newSelectedIndex = 1;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newSelectedIndex);
            expect(updateService.controlChanged).not.toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling calls controlChanged function of updateService with correct arguments', function (done) {
        const newSelectedIndex = 1;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newSelectedIndex);
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'selectedIndex', newSelectedIndex, tabSettings.selectedIndex);
        });
    });
    it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
        const newSelectedIndex = tabSettings.selectedIndex;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newSelectedIndex);
            expect(updateService.controlChanged).toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling updates model.', function (done) {
        const newSelectedIndex = 1;
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newSelectedIndex);
            expect(controlModel.selectedIndex).toEqual(newSelectedIndex);
        });
    });
    it('property set for valueSignaling updates control element.', function (done) {
        const newSelectedIndex = 1;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newSelectedIndex);
            expect(controlModel.selectedIndex).toEqual(newSelectedIndex);
        }, function () {
            expect(controlElement.selectedIndex).toEqual(newSelectedIndex);
        });
    });
    it('property set negative index for valueSignaling updates control element and control model to 0.', function (done) {
        const newSelectedIndex = -5;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newSelectedIndex);
            expect(controlModel.selectedIndex).toEqual(0);
        }, function () {
            expect(controlElement.selectedIndex).toEqual(0);
        });
    });
    it('property set out of bound index for valueSignaling updates control element and control model to last index.', function (done) {
        const newSelectedIndex = 5;
        const expectedValue = controlModel.childModels.length - 1;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newSelectedIndex);
            expect(controlModel.selectedIndex).toEqual(expectedValue);
        }, function () {
            expect(controlElement.selectedIndex).toEqual(expectedValue);
        });
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(tabSettings.left),
            "Top": parseInt(tabSettings.top)
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
    it('property read for ActiveTab with default state returns 0.', function () {
        const currentValue = viewModel.getGPropertyValue(TabControlModel.ACTIVE_TAB_G_PROPERTY_NAME);
        expect(currentValue).toEqual(0);
    });
    it('property set for ActiveTab with negative value throws an exception.', function () {
        expect(function () {
            const negativeActiveTab = -7;
            viewModel.setGPropertyValue(TabControlModel.ACTIVE_TAB_G_PROPERTY_NAME, negativeActiveTab);
        }).toThrow();
    });
    it('property set for ActiveTab with out of bound value throws an exception.', function () {
        expect(function () {
            const newActiveTab = 10;
            viewModel.setGPropertyValue(TabControlModel.ACTIVE_TAB_G_PROPERTY_NAME, newActiveTab);
        }).toThrow();
    });
    it('property set for ActiveTab updates model.', function (done) {
        const newActiveTab = 1;
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(TabControlModel.ACTIVE_TAB_G_PROPERTY_NAME, newActiveTab);
            expect(controlModel.activeTab).toEqual(newActiveTab);
        });
    });
    it('property set for Tab throws error.', function () {
        expect(function () {
            viewModel.setGPropertyValue(TabControlModel.TAB_G_PROPERTY_NAME, {});
        }).toThrow();
    });
    it('property get for Tab with default state returns reference of first child', function (done) {
        testHelpers.runAsync(done, function () {
            const tabReference = viewModel.getGPropertyValue(TabControlModel.TAB_G_PROPERTY_NAME);
            const activeTabModel = controlModel.childModels[0];
            const expectedTabReference = activeTabModel.rootOwner.getControlViewModel(activeTabModel.niControlId);
            expect(tabReference).toEqual(expectedTabReference);
        });
    });
    it('property get for Tab after changing the activeTab returns reference of new activeTab ', function (done) {
        const newActiveTabIndex = 1;
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(TabControlModel.ACTIVE_TAB_G_PROPERTY_NAME, newActiveTabIndex);
            const tabReference = viewModel.getGPropertyValue(TabControlModel.TAB_G_PROPERTY_NAME);
            const activeTabModel = controlModel.childModels[newActiveTabIndex];
            const expectedTabReference = activeTabModel.rootOwner.getControlViewModel(activeTabModel.niControlId);
            expect(tabReference).toEqual(expectedTabReference);
        });
    });
});
//# sourceMappingURL=niTabControlProperties.Test.js.map