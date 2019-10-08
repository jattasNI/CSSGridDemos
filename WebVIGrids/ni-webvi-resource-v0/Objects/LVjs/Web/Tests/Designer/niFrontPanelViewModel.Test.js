//****************************************
// Tests for FrontPanelViewModel class
// National Instruments Copyright 2018
//****************************************
import { FrontPanelModel } from '../../Modeling/niFrontPanelModel.js';
import { LayoutControl } from '../../Elements/ni-layout-control.js';
describe('A FrontPanelViewModel', function () {
    'use strict';
    const controlId = 'FrontPanelViewModelId';
    const layoutsEnum = LayoutControl.LayoutsEnum;
    let viModel, frontPanelControls, controlModel, controlElement, settings, updateSettings;
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
            niControlId: controlId,
            kind: FrontPanelModel.MODEL_KIND,
            width: '300px',
            height: '400px',
            layout: layoutsEnum.ABSOLUTE,
            maxWidth: '300px',
            background: 'rgba(238,28,37,0.57)'
        };
        updateSettings = {
            layout: layoutsEnum.FLEXIBLE,
            width: '350px',
            maxWidth: '350px',
            background: 'rgba(30,30,30,30)'
        };
        Object.freeze(settings);
        Object.freeze(updateSettings);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page.', function (done) {
        $(document.body).append('<ni-front-panel ni-control-id="' + controlId + '"></ni-front-panel>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(settings);
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
            expect(controlModel.width).toEqual(settings.width);
            expect(controlModel.height).toEqual(settings.height);
            expect(controlModel.layout).toEqual(settings.layout);
            expect(controlModel.maxWidth).toEqual(settings.maxWidth);
            expect(controlModel.background).toEqual(settings.background);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel).toBeDefined();
                expect(viewModel).toBeDefined();
                expect(controlModel.width).toEqual(updateSettings.width);
                expect(controlModel.layout).toEqual(updateSettings.layout);
                expect(controlModel.maxWidth).toEqual(updateSettings.maxWidth);
                expect(controlElement.layout).toEqual(layoutsEnum.FLEXIBLE);
                expect(controlModel.background).toEqual(updateSettings.background);
            });
        });
        it('and updates height property.', function (done) {
            webAppHelper.dispatchMessage(controlId, { height: '500px' });
            testHelpers.runAsync(done, function () {
                expect(controlElement.style.height).toEqual('500px');
            });
        });
        it('and brings up busy state dialog when set to busy', function () {
            viewModel.setBusy();
            const busyStateDialogElement = document.getElementsByClassName('ni-busy-state')[0];
            expect(document.body.contains(busyStateDialogElement)).toEqual(true);
            busyStateDialogElement.close();
            busyStateDialogElement.remove();
        });
        it('and does nothing when set to busy if panel is already in busy state', function () {
            viewModel.setBusy();
            expect(function () {
                viewModel.setBusy();
            }).not.toThrow();
            const busyStateDialogElements = document.getElementsByClassName('ni-busy-state');
            expect(busyStateDialogElements.length).toEqual(1);
            const busyStateDialogElement = busyStateDialogElements[0];
            busyStateDialogElement.close();
            busyStateDialogElement.remove();
        });
        it('and removes busy state dialog when busy state is unset', function () {
            viewModel.setBusy();
            const busyStateDialogElement = document.getElementsByClassName('ni-busy-state')[0];
            viewModel.unsetBusy();
            expect(document.body.contains(busyStateDialogElement)).toEqual(false);
        });
        it('and does nothing when tried to unset busy state if panel is not in busy state', function () {
            expect(function () {
                viewModel.unsetBusy();
            }).not.toThrow();
            const busyStateDialogElement = document.getElementsByClassName('ni-busy-state')[0];
            expect(busyStateDialogElement).toBeUndefined();
        });
    });
});
//# sourceMappingURL=niFrontPanelViewModel.Test.js.map