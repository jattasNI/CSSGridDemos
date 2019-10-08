"use strict";
//****************************************
// Tests for ListBoxViewModel class
// National Instruments Copyright 2015
//****************************************
describe('A ListBoxViewModel', function () {
    'use strict';
    let viModel, frontPanelControls, controlModel, controlElement, inputElement;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, listBoxSettings, listBoxZeroOrOneSelectionSettings, listBoxZeroOrMoreSelectionSettings, listBoxMultiSelectionSettings, listBoxUpdatedSettings;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.listBoxSettings.niControlId;
            listBoxSettings = fixture.listBoxSettings;
            listBoxZeroOrOneSelectionSettings = fixture.listBoxZeroOrOneSelectionSettings;
            listBoxZeroOrMoreSelectionSettings = fixture.listBoxZeroOrMoreSelectionSettings;
            listBoxMultiSelectionSettings = fixture.listBoxMultiSelectionSettings;
            listBoxUpdatedSettings = fixture.listBoxUpdatedSettings;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function () {
        Object.freeze(listBoxSettings);
        Object.freeze(listBoxUpdatedSettings);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page', function (done) {
        $(document.body).append('<jqx-list-box ni-control-id="' + controlId + '" ni-type="Int32"></jqx-list-box>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        let viewModel;
        beforeEach(function (done) {
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
        it('and has the correct initial values.', function () {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlModel.selectionMode).toEqual(listBoxSettings.selectionMode);
            expect(controlModel.selectedIndexes).toEqual(listBoxSettings.selectedIndexes);
            expect(controlModel.source).toEqual(listBoxSettings.source);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, listBoxUpdatedSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.selectionMode).toEqual(listBoxUpdatedSettings.selectionMode);
                expect(controlModel.selectedIndexes).toEqual(listBoxUpdatedSettings.selectedIndexes);
                expect(controlModel.source).toEqual(listBoxUpdatedSettings.source);
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
                expect(controlModel.selectionMode).toEqual(listBoxSettings.selectionMode);
                expect(controlModel.selectedIndexes).toEqual(listBoxSettings.selectedIndexes);
                expect(controlModel.source).toEqual(listBoxSettings.source);
            });
        });
    });
    it('responds to the jqx change event, and does nothing if the selection does not change.', function (done) {
        controlElement = webAppHelper.createNIElement(listBoxSettings);
        testHelpers.runAsync(done, function () {
            const internalControl = controlElement;
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            $(internalControl).trigger($.Event('change', {
                args: {}
            }));
            expect(controlModel.selectedIndexes).toEqual(0);
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('responds to the jqx selectIndex method and sets the new selected index (selectionMode One).', function (done) {
        controlElement = webAppHelper.createNIElement(listBoxSettings);
        testHelpers.runAsync(done, function () {
            const internalControl = controlElement;
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            internalControl.selectedIndexes = [2];
            expect(controlModel.selectedIndexes).toEqual(2);
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('responds to the jqx selectIndex method and reverts invalid selections (selectionMode One).', function (done) {
        controlElement = webAppHelper.createNIElement(listBoxSettings);
        testHelpers.runAsync(done, function () {
            const internalControl = controlElement;
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            internalControl.selectedIndexes = [1];
            expect(controlModel.selectedIndexes).toEqual(1);
            internalControl.selectedIndexes = [];
            expect(controlModel.selectedIndexes).toEqual(-1);
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('responds to the jqx selectIndex method and sets the new selected index (selectionMode ZeroOrOne).', function (done) {
        controlElement = webAppHelper.createNIElement(listBoxZeroOrOneSelectionSettings);
        testHelpers.runAsync(done, function () {
            const internalControl = controlElement;
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            internalControl.selectedIndexes = [0];
            expect(controlModel.selectedIndexes).toEqual(0);
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('responds to the jqx selectIndex method and and reverts invalid selections (selectionMode ZeroOrOne).', function (done) {
        controlElement = webAppHelper.createNIElement(listBoxZeroOrOneSelectionSettings);
        testHelpers.runAsync(done, function () {
            const internalControl = controlElement;
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            internalControl.selectedIndexes = [1];
            internalControl.selectedIndexes = [2];
            expect(controlModel.selectedIndexes).toEqual(2);
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('Simulate unselecting the selected item in ZeroOrOne mode changes value to -1 (selectionMode ZeroOrOne).', function (done) {
        controlElement = webAppHelper.createNIElement(listBoxZeroOrOneSelectionSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            inputElement = controlElement.querySelector('jqx-list-item[selected]');
            controlElement.selectionChangeAction = 'press';
            expect(inputElement).toBeDefined();
            const event = {
                deltaY: 50,
                stopPropagation: function () { },
                preventDefault: function () { },
                detail: { value: 20 }
            };
            if (JQX.Utilities.Core.isMobile) {
                event.originalEvent = { target: inputElement };
                controlElement._pointerUpHandler(event);
            }
            else {
                event.originalEvent = { target: inputElement };
                controlElement._downHandler(event);
            }
            expect(controlModel.selectedIndexes).toEqual(-1);
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('Simulate unselecting the selected items in ZeroOrMore changes value to empty array (selectionMode ZeroOrMore).', function (done) {
        controlElement = webAppHelper.createNIElement(listBoxZeroOrMoreSelectionSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            inputElement = controlElement.querySelectorAll('jqx-list-item[selected]');
            controlElement.selectionChangeAction = 'press';
            expect(inputElement).toBeDefined();
            let index = 0;
            for (index = 0; index < inputElement.length; index++) {
                const event = {
                    deltaY: 50,
                    stopPropagation: function () { },
                    preventDefault: function () { },
                    detail: { value: 20 }
                };
                if (JQX.Utilities.Core.isMobile) {
                    event.originalEvent = { target: inputElement[index] };
                    controlElement._pointerUpHandler(event);
                }
                else {
                    event.originalEvent = { target: inputElement[index] };
                    controlElement._downHandler(event);
                }
            }
            expect(controlModel.selectedIndexes).toEqual([]);
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('responds to the jqx selectIndex method and sets the new selected index (multiple selection).', function (done) {
        controlElement = webAppHelper.createNIElement(listBoxMultiSelectionSettings);
        testHelpers.runAsync(done, function () {
            const internalControl = controlElement;
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            internalControl.selectedIndexes = [1, 2];
            expect(controlModel.selectedIndexes).toEqual([1, 2]);
            internalControl.selectedIndexes = [];
            expect(controlModel.selectedIndexes).toEqual([]);
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('does not trigger model.controlChanged() when SelectionMode changes, but selectedIndexes needs no coercion -', function () {
        it('from SelectionMode One to ZeroOrOne', function (done) {
            controlElement = webAppHelper.createNIElement(listBoxSettings);
            testHelpers.runMultipleAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                expect(controlModel.selectedIndexes).toEqual(0);
                spyOn(controlModel, 'controlChanged');
                webAppHelper.dispatchMessage(controlId, { selectionMode: 'ZeroOrOne' });
            }, function () {
                expect(controlModel.selectedIndexes).toEqual(0);
                expect(controlModel.controlChanged).not.toHaveBeenCalled();
            }, function () {
                webAppHelper.removeNIElement(controlId);
            });
        });
        it('from SelectionMode ZeroOrMore to OneOrMore', function (done) {
            controlElement = webAppHelper.createNIElement(listBoxZeroOrMoreSelectionSettings);
            testHelpers.runMultipleAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                expect(controlModel.selectedIndexes).toEqual([0, 1]);
                spyOn(controlModel, 'controlChanged');
                webAppHelper.dispatchMessage(controlId, { selectionMode: 'OneOrMore' });
            }, function () {
                expect(controlModel.selectedIndexes).toEqual([0, 1]);
                expect(controlModel.controlChanged).not.toHaveBeenCalled();
            }, function () {
                webAppHelper.removeNIElement(controlId);
            });
        });
    });
});
//# sourceMappingURL=niListBoxViewModel.Test.js.map