"use strict";
//****************************************
// Tests for TabItemViewModel class
// National Instruments Copyright 2014
//****************************************
describe('A TabItemViewModel', function () {
    'use strict';
    let viModel;
    let tabSettingsTab0, tabUpdateSettingsTab0, tabUpdateSettingsTab0Reverse, tabUpdateSettingsTab0Header, tabSettingsTab1, tabUpdateSettingsTab1, updateSettingsTab1Reverse, tabSettings;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            tabSettingsTab0 = fixture.tabSettingsTab0;
            tabUpdateSettingsTab0 = fixture.tabUpdateSettingsTab0;
            tabUpdateSettingsTab0Reverse = fixture.tabUpdateSettingsTab0Reverse;
            tabUpdateSettingsTab0Header = fixture.tabUpdateSettingsTab0Header;
            tabSettingsTab1 = fixture.tabSettingsTab1;
            tabUpdateSettingsTab1 = fixture.tabUpdateSettingsTab1;
            updateSettingsTab1Reverse = fixture.tabUpdateSettingsTab1Reverse;
            tabSettings = fixture.tabSettings;
            Object.freeze(tabSettings);
            Object.freeze(updateSettingsTab1Reverse);
            Object.freeze(tabUpdateSettingsTab1);
            Object.freeze(tabSettingsTab1);
            Object.freeze(tabUpdateSettingsTab0Header);
            Object.freeze(tabUpdateSettingsTab0Reverse);
            Object.freeze(tabUpdateSettingsTab0);
            Object.freeze(tabSettingsTab0);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    describe('exists after it is created with a parent tab control and sibling tab item', function () {
        let ModelTab0, viewModelTab0, ModelTab1, viewModelTab1, ModelTabControl, viewModelTabControl;
        beforeEach(function (done) {
            webAppHelper.createNIElement(tabSettings);
            webAppHelper.createNIElement(tabSettingsTab0, tabSettings.niControlId);
            webAppHelper.createNIElement(tabSettingsTab1, tabSettings.niControlId);
            testHelpers.runAsync(done, function () {
                ModelTab0 = viModel.getControlModel(tabSettingsTab0.niControlId);
                ModelTab1 = viModel.getControlModel(tabSettingsTab1.niControlId);
                ModelTabControl = viModel.getControlModel(tabSettings.niControlId);
                viewModelTab0 = viModel.getControlViewModel(tabSettingsTab0.niControlId);
                viewModelTab1 = viModel.getControlViewModel(tabSettingsTab1.niControlId);
                viewModelTabControl = viModel.getControlViewModel(tabSettings.niControlId);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(tabSettings.niControlId);
        });
        it('and has the correct initial values.', function () {
            expect(ModelTab0).toBeDefined();
            expect(ModelTab1).toBeDefined();
            expect(ModelTabControl).toBeDefined();
            expect(viewModelTab0).toBeDefined();
            expect(viewModelTab1).toBeDefined();
            expect(viewModelTabControl).toBeDefined();
            expect(ModelTab0.header).toEqual(tabSettingsTab0.header);
            expect(ModelTab1.header).toEqual(tabSettingsTab1.header);
            expect(ModelTab0.tabPosition).toEqual(tabSettingsTab0.tabPosition);
            expect(ModelTab1.tabPosition).toEqual(tabSettingsTab1.tabPosition);
            expect(ModelTabControl.tabStripPlacement).toEqual(tabSettings.tabStripPlacement);
            expect(ModelTabControl.selectedIndex).toEqual(tabSettings.selectedIndex);
        });
        it('and updates the Model when tabPosition property changes.', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(tabSettingsTab0.niControlId, tabUpdateSettingsTab0);
            }, function () {
                expect(ModelTab0.tabPosition).toEqual(tabUpdateSettingsTab0.tabPosition);
            }, function () {
                webAppHelper.dispatchMessage(tabSettingsTab1.niControlId, tabUpdateSettingsTab1);
            }, function () {
                expect(ModelTab1.tabPosition).toEqual(tabUpdateSettingsTab1.tabPosition);
            }, function () {
                webAppHelper.dispatchMessage(tabSettingsTab0.niControlId, tabUpdateSettingsTab0Reverse);
            }, function () {
                expect(ModelTab0.tabPosition).toEqual(tabUpdateSettingsTab0Reverse.tabPosition);
            }, function () {
                webAppHelper.dispatchMessage(tabSettingsTab1.niControlId, updateSettingsTab1Reverse);
            }, function () {
                expect(ModelTab1.tabPosition).toEqual(updateSettingsTab1Reverse.tabPosition);
            });
        });
        it('and updates the Model when header property changes.', function (done) {
            webAppHelper.dispatchMessage(tabSettingsTab0.niControlId, tabUpdateSettingsTab0Header);
            testHelpers.runAsync(done, function () {
                expect(ModelTab0.header).toEqual(tabUpdateSettingsTab0Header.header);
            });
        });
        it('and handles unknown property changes.', function (done) {
            const unknownSettings = {
                unknown: 'unknown'
            };
            const sendUnknownProperties = function () {
                webAppHelper.dispatchMessage(tabSettingsTab0.niControlId, unknownSettings);
            };
            expect(sendUnknownProperties).toThrow();
            testHelpers.runAsync(done, function () {
                expect(ModelTab0.header).toEqual(tabSettingsTab0.header);
                expect(ModelTab0.tabPosition).toEqual(tabSettingsTab0.tabPosition);
            });
        });
    });
});
//# sourceMappingURL=niTabItemViewModel.Test.js.map