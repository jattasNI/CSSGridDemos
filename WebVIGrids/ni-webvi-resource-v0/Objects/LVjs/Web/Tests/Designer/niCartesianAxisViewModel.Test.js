//****************************************
// Tests for CartesianAxisViewModel class
// National Instruments Copyright 2014
//****************************************
import { CartesianAxisModel } from '../../Modeling/niCartesianAxisModel.js';
import { CartesianGraphModel } from '../../Modeling/niCartesianGraphModel.js';
describe('A CartesianAxisViewModel', function () {
    'use strict';
    const graphId = 'Function1';
    let axis1, axis2, axis1Settings, axis1ElementSettings;
    const axis1Id = 'Function13', axis2Id = 'Function12';
    let viModel, frontPanelControls, graph;
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
        axis1 = {
            label: 'Amplitude',
            show: true,
            showLabel: true,
            axisPosition: 'left',
            minimum: 0,
            maximum: 10,
            autoScale: 'none',
            logScale: false,
            niControlId: axis1Id,
            kind: CartesianAxisModel.MODEL_KIND
        };
        axis1Settings = {
            label: 'Amplitude1',
            show: false,
            showLabel: false,
            axisPosition: 'right',
            minimum: 10,
            maximum: 100,
            autoScale: 'exact',
            logScale: true
        };
        axis1ElementSettings = {
            'label': 'Amplitude1',
            show: false,
            'show-label': false,
            'axis-position': 'right',
            minimum: 10,
            maximum: 100,
            'auto-scale': 'exact',
            'log-scale': true,
            'ni-control-id': axis1Id
        };
        axis2 = {
            label: 'Time',
            show: true,
            showLabel: true,
            axisPosition: 'bottom',
            minimum: 0,
            maximum: 10,
            autoScale: 'none',
            logScale: false,
            niControlId: axis2Id,
            kind: CartesianAxisModel.MODEL_KIND
        };
        graph = {
            niControlId: graphId,
            kind: CartesianGraphModel.MODEL_KIND,
            left: '100px',
            top: '200px',
            width: '300px',
            height: '400px'
        };
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    describe('allows creation ', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: graph },
                { currentSettings: axis1, parentId: graphId }
            ], done);
        });
        it('with default settings', function (done) {
            testHelpers.runAsync(done, function () {
                const viewModel = viModel.getControlViewModel(graphId);
                expect(viewModel).toBeDefined();
                webAppHelper.removeNIElement(graphId);
            });
        });
        it('and allows to call the setMultipleProperties method with a property update', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                const axisModel = frontPanelControls[axis1Id];
                axisModel.setMultipleProperties({ label: 'newName' });
            }, function () {
                const axisModel = frontPanelControls[axis1Id];
                expect(axisModel).toBeDefined();
                expect(axisModel.label).toBe('newName');
                const axisViewModel = viModel.getControlViewModel(axis1Id);
                expect(axisViewModel).toBeDefined();
                webAppHelper.removeNIElement(graphId);
            });
        });
    });
    describe('allows creation ', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: graph },
                { currentSettings: axis1, parentId: graphId },
                { currentSettings: axis2, parentId: graphId }
            ], done);
        });
        it('and updates the Model when properties change.', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(axis1Id, axis1Settings);
            }, function () {
                const model = viModel.getControlModel(axis1Id);
                Object.keys(axis1Settings).forEach(function (key) {
                    expect(model[key]).toBe(axis1Settings[key]);
                });
                webAppHelper.removeNIElement(graphId);
            });
        });
    });
    describe('allows an axis element ', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: graph }
            ], done);
        });
        it('to be added directly to the page.', function (done) {
            const graphElement = document.querySelector('[ni-control-id="' + graphId + '"]');
            webAppHelper.appendElement('ni-cartesian-axis', axis1ElementSettings, graphElement);
            testHelpers.runAsync(done, function () {
                const model = viModel.getControlModel(axis1Id);
                expect(model.label).toBe('Amplitude1');
                expect(model.show).toBe(false);
                expect(model.showLabel).toBe(false);
                expect(model.minimum).toBe(10);
                expect(model.maximum).toBe(100);
                expect(model.autoScale).toBe('exact');
                expect(model.logScale).toBe(true);
                webAppHelper.removeNIElement(graphId);
            });
        });
    });
});
//# sourceMappingURL=niCartesianAxisViewModel.Test.js.map