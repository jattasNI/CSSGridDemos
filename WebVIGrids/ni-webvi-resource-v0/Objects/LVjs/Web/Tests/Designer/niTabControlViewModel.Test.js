//****************************************
// Tests for TabControlViewModel class
// National Instruments Copyright 2014
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
import { TabControlModel } from '../../Modeling/niTabControlModel.js';
import { TabItemModel } from '../../Modeling/niTabItemModel.js';
describe('A TabControlViewModel', function () {
    'use strict';
    const $internalDoNotUse = NationalInstruments.Globals.jQuery;
    let viModel, frontPanelControls, controlModel;
    let settings, updateSettings, settingsTab0, settingsTab1;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        webAppHelper.installWebAppFixture(done);
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function () {
        settings = {
            niControlId: 'FunctionTabControl0',
            kind: TabControlModel.MODEL_KIND,
            fontSize: '16px',
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
            fontStyle: 'normal',
            tabStripPlacement: 'Top',
            tabSelectorHidden: false,
            selectedIndex: 0,
            minHeight: '100px'
        };
        updateSettings = {
            tabStripPlacement: 'Right',
            tabSelectorHidden: true,
            selectedIndex: 1,
            fontSize: '20px',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            fontStyle: 'italic',
            minHeight: '200px'
        };
        settingsTab0 = {
            niControlId: 'FunctionTab0',
            kind: TabItemModel.MODEL_KIND,
            header: 'Banana for Scale',
            tabPosition: 0
        };
        settingsTab1 = {
            niControlId: 'FunctionTab1',
            kind: TabItemModel.MODEL_KIND,
            header: 'Grumpy Cat Dislikes',
            tabPosition: 1
        };
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page.', function (done) {
        $(document.body).append('<ni-tab-control ni-control-id="' + settings.niControlId + '"></ni-tab-control>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(settings.niControlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(settings.niControlId);
        });
    });
    it('allows elements to be added directly to the page via DOM functions', function (done) {
        const tabControl = document.createElement('ni-tab-control');
        tabControl.niControlId = settings.niControlId;
        const tabItem0 = document.createElement('ni-tab-item');
        tabItem0.niControlId = settingsTab0.niControlId;
        tabItem0.tabPosition = settingsTab0.tabPosition;
        tabControl.appendChild(tabItem0);
        document.body.appendChild(tabControl);
        testHelpers.runAsync(done, function () {
            const viewModelTabControl = viModel.getControlViewModel(settings.niControlId), viewModelTabItem0 = viModel.getControlViewModel(settingsTab0.niControlId);
            expect(viewModelTabControl).toBeDefined();
            expect(viewModelTabItem0).toBeDefined();
            webAppHelper.removeNIElement(settings.niControlId);
        });
    });
    describe('tests interactive tab changes', function () {
        beforeEach(function () {
            webAppHelper.createNIElement(settings);
            webAppHelper.createNIElement(settingsTab0, settings.niControlId);
            webAppHelper.createNIElement(settingsTab1, settings.niControlId);
        });
        beforeEach(function (done) {
            testHelpers.runAsyncScheduler(function waitForTabChildren() {
                if (viModel.getControlViewModel(settings.niControlId).element.querySelector('.jqx-ribbon-header') === null) {
                    testHelpers.runAsyncScheduler(waitForTabChildren);
                }
                else {
                    done();
                }
            });
        });
        it('responds to a click to change tabs', function (done) {
            const jqxRibbon = $internalDoNotUse('.jqx-ribbon');
            testHelpers.runMultipleAsync(done, function () {
                jqxRibbon.jqxRibbon('selectedIndex', 1);
            }, function () {
                expect(viModel.getControlModel(settings.niControlId).selectedIndex).toBe(1);
            }, function () {
                jqxRibbon.jqxRibbon('selectedIndex', 0);
            }, function () {
                expect(viModel.getControlModel(settings.niControlId).selectedIndex).toBe(0);
            }, function () {
                webAppHelper.removeNIElement(settings.niControlId);
            });
        });
    });
    it('allows elements to be added directly to the page via jQuery functions', function (done) {
        const str = '<ni-tab-control ni-control-id="' + settings.niControlId + '">' +
            '<div></div>' +
            '<ni-tab-item ni-control-id="' + settingsTab0.niControlId + '" tab-position="' + settingsTab0.tabPosition + '" ></ni-tab-item>' +
            '<ni-tab-item ni-control-id="' + settingsTab1.niControlId + '" tab-position="' + settingsTab1.tabPosition + '" ></ni-tab-item>' +
            '</ni-tab-control>';
        $(document.body).append(str);
        testHelpers.runAsync(done, function () {
            expect(viModel.getControlModel(settings.niControlId)).toBeDefined();
            expect(viModel.getControlModel(settingsTab0.niControlId)).toBeDefined();
            expect(viModel.getControlModel(settingsTab1.niControlId)).toBeDefined();
            expect(viModel.getControlViewModel(settings.niControlId)).toBeDefined();
            expect(viModel.getControlViewModel(settingsTab0.niControlId)).toBeDefined();
            expect(viModel.getControlViewModel(settingsTab1.niControlId)).toBeDefined();
            webAppHelper.removeNIElement(settings.niControlId);
        });
    });
    it('prints errors when duplicate and missing tab items occur', function (done) {
        const tabControl = document.createElement('ni-tab-control');
        tabControl.niControlId = settings.niControlId;
        const tabItem0 = document.createElement('ni-tab-item');
        tabItem0.niControlId = settingsTab0.niControlId;
        tabItem0.tabPosition = 1;
        const tabItem1 = document.createElement('ni-tab-item');
        tabItem1.niControlId = settingsTab1.niControlId;
        tabItem1.tabPosition = 1;
        tabControl.appendChild(tabItem0);
        tabControl.appendChild(tabItem1);
        document.body.appendChild(tabControl);
        testHelpers.runAsync(done, function () {
            expect(viModel.getControlModel(settings.niControlId)).toBeDefined();
            expect(viModel.getControlModel(settingsTab0.niControlId)).toBeDefined();
            expect(viModel.getControlModel(settingsTab1.niControlId)).toBeDefined();
            expect(viModel.getControlViewModel(settings.niControlId)).toBeDefined();
            expect(viModel.getControlViewModel(settingsTab0.niControlId)).toBeDefined();
            expect(viModel.getControlViewModel(settingsTab1.niControlId)).toBeDefined();
            webAppHelper.removeNIElement(settings.niControlId);
        });
    });
    describe('exists after creation with tabStripPlacement on Top', function () {
        let viewModel, tabControl;
        beforeEach(function (done) {
            tabControl = webAppHelper.createNIElement(settings);
            webAppHelper.createNIElement(settingsTab0, settings.niControlId);
            webAppHelper.createNIElement(settingsTab1, settings.niControlId);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[settings.niControlId];
                viewModel = viModel.getControlViewModel(settings.niControlId);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(settings.niControlId);
        });
        it('and has the correct initial values.', function () {
            const style = window.getComputedStyle(tabControl);
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlModel.selectedIndex).toEqual(settings.selectedIndex);
            expect(controlModel.tabStripPlacement).toEqual(settings.tabStripPlacement);
            expect(style.getPropertyValue(CSS_PROPERTIES.MIN_HEIGHT)).toEqual(settings.minHeight);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(settings.niControlId, updateSettings);
            testHelpers.runAsync(done, function () {
                const style = window.getComputedStyle(tabControl);
                expect(controlModel.selectedIndex).toEqual(updateSettings.selectedIndex);
                expect(controlModel.tabStripPlacement).toEqual(updateSettings.tabStripPlacement);
                expect(controlModel.tabSelectorHidden).toEqual(updateSettings.tabSelectorHidden);
                expect(controlModel.fontSize).toEqual('20px');
                expect(controlModel.fontFamily).toEqual('sans-serif');
                expect(controlModel.fontWeight).toEqual('bold');
                expect(controlModel.fontStyle).toEqual('italic');
                expect(style.getPropertyValue(CSS_PROPERTIES.MIN_HEIGHT)).toEqual(updateSettings.minHeight);
            });
        });
        it('and its element can hide the tab selector', function (done) {
            webAppHelper.dispatchMessage(settings.niControlId, { tabSelectorHidden: true });
            testHelpers.runAsync(done, function () {
                const tabSelectorStyle = window.getComputedStyle(tabControl.querySelector('div.jqx-ribbon'));
                expect(tabControl.tabSelectorHidden).toEqual(true);
                expect(tabSelectorStyle.display).toEqual('none');
            });
        });
        it('updates color states for background, foregroundColor, inactiveBackground, inactiveForegroundColor', function (done) {
            testHelpers.disablePointerEvents(tabControl);
            const updateSettings = {};
            updateSettings.background = 'white';
            updateSettings.foreground = 'green';
            updateSettings.inactiveBackground = 'yellow';
            updateSettings.inactiveForeground = 'red';
            webAppHelper.dispatchMessage(settings.niControlId, updateSettings);
            testHelpers.runAsync(done, function () {
                const tabControlStyle = window.getComputedStyle(tabControl);
                expect(tabControlStyle.getPropertyValue(CSS_PROPERTIES.BACKGROUND)).toContain('white');
                expect(tabControlStyle.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR)).toEqual('green');
                expect(tabControlStyle.getPropertyValue(CSS_PROPERTIES.INACTIVE_BACKGROUND)).toContain('yellow');
                expect(tabControlStyle.getPropertyValue(CSS_PROPERTIES.INACTIVE_FOREGROUND_COLOR)).toEqual('red');
                const tabHeaders = tabControl.querySelectorAll('.jqx-ribbon-item');
                const tabItemInactive = window.getComputedStyle(tabControl.querySelector('ni-tab-item:not(.ni-selected)'));
                const tabHeaderInactive = window.getComputedStyle(tabHeaders[1]);
                expect(tabHeaderInactive.backgroundColor).toContain('rgb(255, 255, 0)');
                expect(tabItemInactive.backgroundColor).toContain('rgb(255, 255, 0)');
                expect(tabHeaderInactive.color).toEqual('rgb(255, 0, 0)');
                const tabHeaderActive = window.getComputedStyle(tabHeaders[0]);
                const tabItemActive = window.getComputedStyle(tabControl.querySelector('ni-tab-item.ni-selected'));
                expect(tabHeaderActive.backgroundColor).toContain('rgb(255, 255, 255)');
                expect(tabItemActive.backgroundColor).toContain('rgb(255, 255, 255)');
                expect(tabHeaderActive.color).toEqual('rgb(0, 128, 0)');
            });
        });
        it('updates gradient color status for background, inactiveBackground', function (done) {
            testHelpers.disablePointerEvents(tabControl);
            const updateSettings = {};
            updateSettings.background = "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(248, 148, 28) 100%)";
            updateSettings.inactiveBackground = "linear-gradient(90deg, rgb(255, 202, 215) 0%, rgb(202, 234, 156) 100%)";
            webAppHelper.dispatchMessage(settings.niControlId, updateSettings);
            testHelpers.runAsync(done, function () {
                const tabControlStyle = window.getComputedStyle(tabControl);
                expect(tabControlStyle.getPropertyValue(CSS_PROPERTIES.BACKGROUND)).toContain('linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(248, 148, 28) 100%)');
                expect(tabControlStyle.getPropertyValue(CSS_PROPERTIES.INACTIVE_BACKGROUND)).toContain('linear-gradient(90deg, rgb(255, 202, 215) 0%, rgb(202, 234, 156) 100%)');
                const tabHeaders = tabControl.querySelectorAll('.jqx-ribbon-item');
                const tabItemInactive = window.getComputedStyle(tabControl.querySelector('ni-tab-item:not(.ni-selected)'));
                const tabHeaderInactive = window.getComputedStyle(tabHeaders[1]);
                expect(tabHeaderInactive.backgroundImage).toContain('linear-gradient(90deg, rgb(255, 202, 215) 0%, rgb(202, 234, 156) 100%)');
                expect(tabItemInactive.backgroundImage).toContain('linear-gradient(90deg, rgb(255, 202, 215) 0%, rgb(202, 234, 156) 100%)');
                const tabHeaderActive = window.getComputedStyle(tabHeaders[0]);
                const tabItemActive = window.getComputedStyle(tabControl.querySelector('ni-tab-item.ni-selected'));
                expect(tabHeaderActive.backgroundImage).toContain('linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(248, 148, 28) 100%)');
                expect(tabItemActive.backgroundImage).toContain('linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(248, 148, 28) 100%)');
            });
        });
        it('and handles unknown property changes.', function (done) {
            const unknownSettings = {
                unknown: 'unknown'
            };
            const sendUnknownProperties = function () {
                webAppHelper.dispatchMessage(settings.niControlId, unknownSettings);
            };
            expect(sendUnknownProperties).toThrow();
            testHelpers.runAsync(done, function () {
                expect(controlModel.selectedIndex).toEqual(settings.selectedIndex);
                expect(controlModel.tabStripPlacement).toEqual(settings.tabStripPlacement);
            });
        });
    });
});
//# sourceMappingURL=niTabControlViewModel.Test.js.map