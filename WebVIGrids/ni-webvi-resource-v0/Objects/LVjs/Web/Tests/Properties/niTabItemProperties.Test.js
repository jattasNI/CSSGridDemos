//****************************************
// G Property Tests for Tab Item
// National Instruments Copyright 2018
//****************************************
import { TabItemModel } from '../../Modeling/niTabItemModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A Tab Item', function () {
    'use strict';
    let controlId;
    let viModel, tabControlModel, tabControlViewModel, tabItem1ViewModel, tabItem1Model, tabItem1Element, tabItem2ViewModel, tabItem2Model, tabItem2Element, tabElement;
    let tabSettings, settingsTab0, settingsTab1, settingsLayout0, settingsLayout1;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.tabSettings.niControlId;
            settingsLayout1 = Object.freeze(fixture.tabSettings2Layout1);
            settingsLayout0 = Object.freeze(fixture.tabSettings2Layout0);
            settingsTab1 = Object.freeze(fixture.tabSettings2Tab1);
            settingsTab0 = Object.freeze(fixture.tabSettings2Tab0);
            tabSettings = Object.freeze(fixture.tabSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function (done) {
        webAppHelper.createNIElement(tabSettings);
        webAppHelper.createNIElement(settingsTab0, tabSettings.niControlId);
        webAppHelper.createNIElement(settingsLayout0, settingsTab0.niControlId);
        webAppHelper.createNIElement(settingsTab1, tabSettings.niControlId);
        webAppHelper.createNIElement(settingsLayout1, settingsTab1.niControlId);
        testHelpers.runAsync(done, function () {
            tabControlModel = viModel.getControlModel(tabSettings.niControlId);
            tabControlViewModel = viModel.getControlViewModel(controlId);
            tabElement = tabControlViewModel.element;
            tabItem1ViewModel = viModel.getControlViewModel(settingsTab0.niControlId);
            tabItem1Model = viModel.getControlModel(settingsTab0.niControlId);
            tabItem1Element = tabItem1ViewModel.element;
            tabItem2ViewModel = viModel.getControlViewModel(settingsTab1.niControlId);
            tabItem2Model = viModel.getControlModel(settingsTab1.niControlId);
            tabItem2Element = tabItem2ViewModel.element;
            done();
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
    it('property read for Enable will return default value (true)', function () {
        const isEnabled = tabItem1ViewModel.getGPropertyValue(TabItemModel.ENABLED_G_PROPERTY_NAME);
        expect(isEnabled).toEqual(true);
    });
    it('setting enable to false on tab item does not disable tab control.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            tabItem1ViewModel.setGPropertyValue(TabItemModel.ENABLED_G_PROPERTY_NAME, false);
        }, function () {
            const isDisabled = tabControlViewModel.element.disabled;
            expect(isDisabled).toEqual(false);
        });
    });
    it('property set for Enable updates model.', function (done) {
        const newIsEnabled = false;
        testHelpers.runAsync(done, function () {
            tabItem1ViewModel.setGPropertyValue(TabItemModel.ENABLED_G_PROPERTY_NAME, newIsEnabled);
            expect(tabItem1Model.enabled).toEqual(newIsEnabled);
        });
    });
    it('property set for Enable updates tab item element.', function (done) {
        const newIsEnabled = false;
        testHelpers.runMultipleAsync(done, function () {
            tabItem1ViewModel.setGPropertyValue(TabItemModel.ENABLED_G_PROPERTY_NAME, newIsEnabled);
        }, function () {
            expect(tabItem1Element.disabled).toBe(true);
        });
    });
    it('property set for Enable updates tab item element layout.', function (done) {
        const newIsEnabled = false;
        testHelpers.runMultipleAsync(done, function () {
            tabItem1ViewModel.setGPropertyValue(TabItemModel.ENABLED_G_PROPERTY_NAME, newIsEnabled);
        }, function () {
            const layoutPanel = tabItem1Element.firstChild;
            expect(layoutPanel.disabled).toEqual(true);
        });
    });
    it('property set for Enable updates corresponding Ribbon item.', function (done) {
        const newIsEnabled = false;
        testHelpers.runMultipleAsync(done, function () {
            tabItem1ViewModel.setGPropertyValue(TabItemModel.ENABLED_G_PROPERTY_NAME, newIsEnabled);
        }, function () {
            const ribbonItems = tabElement.querySelectorAll('.jqx-ribbon-header > li');
            const activeTabIndex = 0;
            expect(ribbonItems[activeTabIndex].classList.contains('jqx-fill-state-disabled')).toBe(true);
        });
    });
    it('property set for Enable with true value does not update selected tab item', function (done) {
        const newIsEnabled = true;
        testHelpers.runMultipleAsync(done, function () {
            expect(tabControlModel.selectedIndex).toEqual(0);
            tabItem1ViewModel.setGPropertyValue(TabItemModel.ENABLED_G_PROPERTY_NAME, newIsEnabled);
        }, function () {
            expect(tabControlModel.selectedIndex).toEqual(0);
        });
    });
    it('property set for Enable with false value updates Selected Tab item to next Enabled Tab item.', function (done) {
        const newIsEnabled = false;
        testHelpers.runMultipleAsync(done, function () {
            expect(tabControlModel.selectedIndex).toEqual(0);
            tabItem1ViewModel.setGPropertyValue(TabItemModel.ENABLED_G_PROPERTY_NAME, newIsEnabled);
        }, function () {
            expect(tabControlModel.selectedIndex).toEqual(1);
        });
    });
    it('property set for Enable with false value updates Selected Tab item to next left Enabled Tab item if there is no item on the right side.', function (done) {
        const newIsEnabled = false;
        webAppHelper.dispatchMessage(controlId, {
            selectedIndex: 1
        });
        testHelpers.runMultipleAsync(done, function () {
            tabItem2ViewModel.setGPropertyValue(TabItemModel.ENABLED_G_PROPERTY_NAME, newIsEnabled);
        }, function () {
            expect(tabControlModel.selectedIndex).toEqual(0);
        });
    });
    it('property read for Enable with parent Tab control disabled returns default value (true).', function () {
        webAppHelper.dispatchMessage(controlId, {
            enabled: false
        });
        const isEnabled = tabItem1ViewModel.getGPropertyValue(TabItemModel.ENABLED_G_PROPERTY_NAME);
        expect(isEnabled).toEqual(true);
    });
    it("property set for Enable with parent Tab control disabled updates model.", function (done) {
        webAppHelper.dispatchMessage(controlId, {
            enabled: false
        });
        const newIsEnabled = false;
        testHelpers.runMultipleAsync(done, function () {
            tabItem1ViewModel.setGPropertyValue(TabItemModel.ENABLED_G_PROPERTY_NAME, newIsEnabled);
        }, function () {
            expect(tabItem1Model.enabled).toEqual(newIsEnabled);
        });
    });
    it("Re-enabling the tab control after disabling, should not change the 'Enable' property of tab item", function (done) {
        const newIsEnabled = false;
        testHelpers.runMultipleAsync(done, function () {
            tabItem1ViewModel.setGPropertyValue(TabItemModel.ENABLED_G_PROPERTY_NAME, newIsEnabled);
        }, function () {
            webAppHelper.dispatchMessage(controlId, {
                enabled: false
            });
            webAppHelper.dispatchMessage(controlId, {
                enabled: true
            });
        }, function () {
            expect(tabItem1Model.enabled).toEqual(newIsEnabled);
        });
    });
    it("property set for Enable with disabled parent tab control will be persisted even after re-enabling the parent tab control", function (done) {
        const newIsEnabled = false;
        webAppHelper.dispatchMessage(controlId, {
            enabled: false
        });
        testHelpers.runMultipleAsync(done, function () {
            tabItem1ViewModel.setGPropertyValue(TabItemModel.ENABLED_G_PROPERTY_NAME, newIsEnabled);
        }, function () {
            webAppHelper.dispatchMessage(controlId, {
                enabled: true
            });
        }, function () {
            expect(tabItem1Model.enabled).toEqual(newIsEnabled);
        });
    });
    it('property set for Enable with false value does not disable the last enabled item.', function (done) {
        const newIsEnabled = false;
        testHelpers.runMultipleAsync(done, function () {
            expect(tabControlModel.selectedIndex).toEqual(0);
            tabItem1ViewModel.setGPropertyValue(TabItemModel.ENABLED_G_PROPERTY_NAME, newIsEnabled);
        }, function () {
            tabItem2ViewModel.setGPropertyValue(TabItemModel.ENABLED_G_PROPERTY_NAME, newIsEnabled);
            expect(tabItem2Model.enabled).toEqual(true);
        }, function () {
            expect(tabItem2Element.firstChild.disabled).toEqual(false);
            expect(tabControlModel.selectedIndex).toEqual(1);
        });
    });
    it('property read for Visible will return default value (true)', function () {
        const isVisible = tabItem1ViewModel.getGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME);
        expect(isVisible).toEqual(true);
    });
    it('setting visible to false on tab item does not hide tab control.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            tabItem1ViewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, false);
        }, function () {
            const isHidden = tabControlViewModel.element.hidden;
            expect(isHidden).toEqual(false);
        });
    });
    it('property set for Visible updates model.', function (done) {
        const newIsVisible = false;
        testHelpers.runAsync(done, function () {
            tabItem1ViewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, newIsVisible);
            expect(tabItem1Model.visible).toEqual(newIsVisible);
        });
    });
    it('property set for Visible updates tab item element.', function (done) {
        const newIsVisible = false;
        testHelpers.runMultipleAsync(done, function () {
            tabItem1ViewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, newIsVisible);
        }, function () {
            expect(tabItem1Element.classList.contains('ni-hidden')).toBe(true);
        });
    });
    it('property set for Visible updates corresponding Ribbon item.', function (done) {
        const newIsVisible = false;
        testHelpers.runMultipleAsync(done, function () {
            tabItem1ViewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, newIsVisible);
        }, function () {
            const ribbonItems = tabElement.querySelectorAll('.jqx-ribbon-header > li');
            const activeTabIndex = 0;
            expect(ribbonItems[activeTabIndex].style.display).toEqual('none');
        });
    });
    it('property set for Visible with true value does not update selected tab item', function (done) {
        const newIsVisible = true;
        testHelpers.runMultipleAsync(done, function () {
            expect(tabControlModel.selectedIndex).toEqual(0);
            tabItem1ViewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, newIsVisible);
        }, function () {
            expect(tabControlModel.selectedIndex).toEqual(0);
        });
    });
    it('property set for Visible with false value updates Selected Tab item to next Visible Tab item.', function (done) {
        const newIsVisible = false;
        testHelpers.runMultipleAsync(done, function () {
            expect(tabControlModel.selectedIndex).toEqual(0);
            tabItem1ViewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, newIsVisible);
        }, function () {
            expect(tabControlModel.selectedIndex).toEqual(1);
        });
    });
    it('property set for Visible with false value updates Selected Tab item to next left Visible Tab item if there is no item on the right side.', function (done) {
        const newIsVisible = false;
        webAppHelper.dispatchMessage(controlId, {
            selectedIndex: 1
        });
        testHelpers.runMultipleAsync(done, function () {
            tabItem2ViewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, newIsVisible);
        }, function () {
            expect(tabControlModel.selectedIndex).toEqual(0);
        });
    });
    it("property set for Visible with invisible parent Tab control updates model.", function (done) {
        webAppHelper.dispatchMessage(controlId, {
            visible: false
        });
        const newIsVisible = false;
        testHelpers.runMultipleAsync(done, function () {
            tabItem1ViewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, newIsVisible);
        }, function () {
            expect(tabItem1Model.visible).toEqual(newIsVisible);
        });
    });
    it("changing the visibility of Tab control, should not change the 'Visible' property of tab item", function (done) {
        const newIsVisible = false;
        testHelpers.runMultipleAsync(done, function () {
            tabItem1ViewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, newIsVisible);
        }, function () {
            webAppHelper.dispatchMessage(controlId, {
                visible: false
            });
            webAppHelper.dispatchMessage(controlId, {
                visible: true
            });
        }, function () {
            expect(tabItem1Model.visible).toEqual(newIsVisible);
        });
    });
    it("property set for Visible with hidden parent tab control will be persisted even after visible the parent tab control", function (done) {
        const newIsVisible = false;
        webAppHelper.dispatchMessage(controlId, {
            visible: false
        });
        testHelpers.runMultipleAsync(done, function () {
            tabItem1ViewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, newIsVisible);
        }, function () {
            webAppHelper.dispatchMessage(controlId, {
                visible: true
            });
        }, function () {
            expect(tabItem1Model.visible).toEqual(newIsVisible);
        });
    });
    it('property set for Visible with false value does not hide the last visible item.', function (done) {
        const newIsVisible = false;
        testHelpers.runMultipleAsync(done, function () {
            expect(tabControlModel.selectedIndex).toEqual(0);
            tabItem1ViewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, newIsVisible);
        }, function () {
            expect(tabControlModel.selectedIndex).toEqual(1);
            tabItem2ViewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, newIsVisible);
            expect(tabItem2Model.visible).toEqual(true);
        }, function () {
            expect(tabItem2Element.classList.contains('ni-hidden')).toBe(false);
            expect(tabControlModel.selectedIndex).toEqual(1);
        });
    });
    it('property get for Name returns current name of tab item.', function () {
        const currentName = tabItem1ViewModel.getGPropertyValue(TabItemModel.NAME_G_PROPERTY_NAME);
        expect(currentName).toEqual(settingsTab0.header);
    });
    it('property set for Name updates model with same name.', function () {
        const newName = 'TestName';
        tabItem1ViewModel.setGPropertyValue(TabItemModel.NAME_G_PROPERTY_NAME, newName);
        expect(tabItem1Model.header).toEqual(newName);
    });
    it('property set for Name updates control element with same name.', function (done) {
        const newName = 'TestName';
        testHelpers.runMultipleAsync(done, function () {
            tabItem1ViewModel.setGPropertyValue(TabItemModel.NAME_G_PROPERTY_NAME, newName);
        }, function () {
            expect(tabItem1Element.header).toEqual(newName);
        });
    });
    it('property set for Name with special character updates model with name having special character', function () {
        const newName = 'Iñtërnâtiônàlizætiøn☃💩😴😄😃⛔🎠🚓🚇<!-- test comment -->';
        tabItem1ViewModel.setGPropertyValue(TabItemModel.NAME_G_PROPERTY_NAME, newName);
        expect(tabItem1Model.header).toEqual(newName);
    });
    it('property set for Name with empty string updates model name with empty string.', function () {
        const newName = '';
        tabItem1ViewModel.setGPropertyValue(TabItemModel.NAME_G_PROPERTY_NAME, newName);
        expect(tabItem1Model.header).toEqual(newName);
    });
    it('property set for Name with same values for multiple tab items updates models.', function () {
        const newName = 'TestName';
        tabItem1ViewModel.setGPropertyValue(TabItemModel.NAME_G_PROPERTY_NAME, newName);
        tabItem2ViewModel.setGPropertyValue(TabItemModel.NAME_G_PROPERTY_NAME, newName);
        expect(tabItem1Model.header).toEqual(newName);
        expect(tabItem2Model.header).toEqual(newName);
    });
});
//# sourceMappingURL=niTabItemProperties.Test.js.map