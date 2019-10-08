//****************************************
// Tests for RingSelectorViewModel class
// National Instruments Copyright 2015
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
describe('A RingSelectorViewModel', function () {
    'use strict';
    let controlId;
    let viModel, frontPanelControls, controlModel, controlElement, ringSelectorsettings, ringSelectorUpdateSettings, ringSelectorUpdateSettings2;
    let ringSelectorDoubleUpdateSettings, ringSelectorDoubleUpdateSettings2, ringSelectorInt4UpdateSettings, ringSelectorInt64UpdateSettings2;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.ringSelectorsettings.niControlId;
            ringSelectorsettings = fixture.ringSelectorsettings;
            ringSelectorUpdateSettings = fixture.ringSelectorUpdateSettings;
            ringSelectorUpdateSettings2 = fixture.ringSelectorUpdateSettings2;
            ringSelectorDoubleUpdateSettings = fixture.ringSelectorDoubleUpdateSettings;
            ringSelectorDoubleUpdateSettings2 = fixture.ringSelectorDoubleUpdateSettings2;
            ringSelectorInt4UpdateSettings = fixture.ringSelectorInt4UpdateSettings;
            ringSelectorInt64UpdateSettings2 = fixture.ringSelectorInt64UpdateSettings2;
            ringSelectorDoubleUpdateSettings.niType = window.NITypes.DOUBLE;
            ringSelectorInt4UpdateSettings.niType = window.NITypes.INT64;
            Object.freeze(ringSelectorsettings);
            Object.freeze(ringSelectorUpdateSettings);
            Object.freeze(ringSelectorUpdateSettings2);
            Object.freeze(ringSelectorDoubleUpdateSettings);
            Object.freeze(ringSelectorDoubleUpdateSettings2);
            Object.freeze(ringSelectorInt4UpdateSettings);
            Object.freeze(ringSelectorInt64UpdateSettings2);
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
        // TODO mraj DOM_POLLUTION
        //domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page', function (done) {
        $(document.body).append('<ni-ring-selector ni-control-id="' + controlId + '"></ni-ring-selector>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        let viewModel;
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
        it('and has the correct initial values.', function (done) {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlModel.allowUndefined).toEqual(ringSelectorsettings.allowUndefined);
            expect(controlModel.value).toEqual(ringSelectorsettings.value);
            expect(controlModel.items).toEqual(ringSelectorsettings.items);
            expect(controlModel.popupEnabled).toEqual(false); // Default value
            expect(controlModel.textAlignment).toEqual(ringSelectorsettings.textAlignment);
            testHelpers.runAsync(done, function () {
                expect($(controlElement.children[1]).css('display')).toEqual('none');
            });
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, ringSelectorUpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.allowUndefined).toEqual(ringSelectorUpdateSettings.allowUndefined);
                expect(controlModel.value).toEqual(ringSelectorUpdateSettings.value);
                expect(controlModel.popupEnabled).toEqual(ringSelectorUpdateSettings.popupEnabled);
                expect($(controlElement.children[1]).css('display')).toEqual('block');
                expect(controlModel.textAlignment).toEqual(ringSelectorUpdateSettings.textAlignment);
            });
        });
        it('and handles setting the value property to a nonexisting / unlabeled value', function (done) {
            webAppHelper.dispatchMessage(controlId, ringSelectorUpdateSettings2);
            testHelpers.runAsync(done, function () {
                expect(controlModel.value).toEqual(ringSelectorUpdateSettings2.value);
                expect(controlElement.value.numberValue).toEqual(ringSelectorUpdateSettings2.value);
                // When a new value is set programmatically that doesn't map to any existing item,
                // the control will accept that value and show it as "<newValue>", even if
                // allowUndefined is false. This matches the behavior of the WPF control.
                const newIndex = controlElement.firstElementChild.selectedIndexes[0];
                expect(newIndex).toEqual(ringSelectorsettings.items.length); // i.e. control added a new item to show this value
            });
        });
        it('and handles value updates when type = Double', function (done) {
            const localRingSelectorDoubleUpdateSettings = Object.assign({}, ringSelectorDoubleUpdateSettings);
            webAppHelper.dispatchMessage(controlId, localRingSelectorDoubleUpdateSettings);
            testHelpers.runAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, ringSelectorDoubleUpdateSettings2);
                testHelpers.runAsync(done, function () {
                    expect(controlModel.value).toEqual(ringSelectorDoubleUpdateSettings2.value);
                    const newSelectedIndex = controlElement.firstElementChild.selectedIndexes[0];
                    expect(newSelectedIndex).toEqual(1);
                    const newValue = controlElement.value;
                    expect(newValue.numberValue).toEqual(ringSelectorDoubleUpdateSettings2.value);
                });
            });
        });
        it('and handles value updates when type = Int64', function (done) {
            const localRingSelectorInt4UpdateSettings = Object.assign({}, ringSelectorInt4UpdateSettings);
            webAppHelper.dispatchMessage(controlId, localRingSelectorInt4UpdateSettings);
            testHelpers.runAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, ringSelectorInt64UpdateSettings2);
                testHelpers.runAsync(done, function () {
                    expect(controlModel.value).toEqual(ringSelectorInt64UpdateSettings2.value);
                    const newSelectedIndex = controlElement.firstElementChild.selectedIndexes[0];
                    expect(newSelectedIndex).toEqual(1);
                    const newValue = controlElement.value;
                    expect(newValue.stringValue).toEqual(ringSelectorInt64UpdateSettings2.value);
                });
            });
        });
        it('and handles unknown property changes.', function (done) {
            const unknownSettings = {
                unknown: 'unknown'
            };
            const sendUnknownProperties = function () {
                webAppHelper.dispatchMessage(controlId, unknownSettings);
            };
            expect(sendUnknownProperties).toThrow();
            testHelpers.runAsync(done, function () {
                expect(controlModel.allowUndefined).toEqual(ringSelectorsettings.allowUndefined);
                expect(controlModel.value).toEqual(ringSelectorsettings.value);
                expect(controlModel.items).toEqual(ringSelectorsettings.items);
            });
        });
        it('and updates disabledIndexes property.', function (done) {
            const setting = {
                disabledIndexes: [1, 2]
            };
            webAppHelper.dispatchMessage(controlId, setting);
            testHelpers.runAsync(done, function () {
                expect(JSON.parse(controlElement.disabledIndexes)).toEqual(setting.disabledIndexes);
            });
        });
        it('and retain the disabledIndexes when updating items.', function (done) {
            const setting = {
                disabledIndexes: [1, 3]
            }, itemSetting = {
                items: [{ "value": "1", "displayValue": "first" }, { "value": "2", "displayValue": "second" }, { "value": "3", "displayValue": "third" }]
            };
            webAppHelper.dispatchMessage(controlId, setting);
            testHelpers.runAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, itemSetting);
                const items = controlElement.querySelectorAll('jqx-list-item');
                setting.disabledIndexes.forEach(index => {
                    if (index >= 0 && index < items.length) {
                        expect(items[index].disabled).toEqual(true);
                    }
                });
                expect(JSON.parse(controlElement.disabledIndexes)).toEqual(setting.disabledIndexes);
            });
        });
        it('and retain the disabledIndexes when updating value.', function (done) {
            const setting = {
                disabledIndexes: [1, 3]
            }, valueSetting = {
                value: 2
            };
            webAppHelper.dispatchMessage(controlId, setting);
            testHelpers.runAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, valueSetting);
                const items = controlElement.querySelectorAll('jqx-list-item');
                setting.disabledIndexes.forEach(index => {
                    if (index >= 0 && index < items.length) {
                        expect(items[index].disabled).toEqual(true);
                    }
                });
                expect(JSON.parse(controlElement.disabledIndexes)).toEqual(setting.disabledIndexes);
            });
        });
        // CAR 702866 : MSEdge + text-align + CSS variables not working
        it('and updates textAlignment property. #FailsEdge', function (done) {
            webAppHelper.dispatchMessage(controlId, { textAlignment: 'right' });
            testHelpers.runAsync(done, function () {
                const ringStyle = window.getComputedStyle(controlElement);
                expect(ringStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN)).toEqual('right');
                expect(ringStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX)).toEqual('flex-end');
                /*
                // CAR 705613
                // let ringDropDownStyle = window.getComputedStyle(controlElement.querySelector('jqx-drop-down-list'));
                // expect(ringDropDownStyle.textAlign).toEqual('right');
                */
                const ringDropDownButtonStyle = window.getComputedStyle(controlElement.querySelector('jqx-drop-down-list .jqx-action-button'));
                expect(ringDropDownButtonStyle.alignItems).toEqual('flex-end');
            });
        });
    });
    it('responds to the jqx selectIndex method and sets the new selected index.', function (done) {
        controlElement = webAppHelper.createNIElement(ringSelectorsettings);
        testHelpers.runAsync(done, function () {
            const internalControl = controlElement.firstElementChild;
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            internalControl.selectedIndexes = [2];
            expect(controlModel.value).toEqual(10);
            webAppHelper.removeNIElement(controlId);
        });
    });
});
//# sourceMappingURL=niRingSelectorViewModel.Test.js.map