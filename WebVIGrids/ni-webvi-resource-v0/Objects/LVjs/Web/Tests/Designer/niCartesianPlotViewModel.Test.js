//****************************************
// Tests for CartesianPlotViewModel class
// National Instruments Copyright 2015
//****************************************
import { CartesianGraphModel } from "../../Modeling/niCartesianGraphModel.js";
import { CartesianPlotModel } from "../../Modeling/niCartesianPlotModel.js";
describe('A CartesianPlotViewModel', function () {
    'use strict';
    const graphId = 'Function1';
    let plot1, plot1Settings, plot1ElementSettings;
    const axis1Id = 'Function13', axis2Id = 'Function12', plot1Id = 'Function15';
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
        plot1 = {
            xaxis: axis1Id,
            yaxis: axis2Id,
            niControlId: plot1Id,
            kind: CartesianPlotModel.MODEL_KIND
        };
        plot1Settings = {
            xaxis: axis1Id + 'test',
            yaxis: axis2Id + 'test'
        };
        plot1ElementSettings = {
            xaxis: axis1Id,
            yaxis: axis2Id,
            'ni-control-id': plot1Id
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
    describe('allows a plot element ', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: graph }
            ], done);
        });
        it('to be added directly to the page.', function (done) {
            const graphElement = document.querySelector('[ni-control-id="' + graphId + '"]');
            webAppHelper.appendElement('ni-cartesian-plot', plot1ElementSettings, graphElement);
            testHelpers.runAsync(done, function () {
                const model = viModel.getControlModel(plot1Id);
                expect(model.xaxis).toBe(axis1Id);
                expect(model.yaxis).toBe(axis2Id);
                webAppHelper.removeNIElement(graphId);
            });
        });
    });
    describe('allows creation of plot on graph ', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: graph },
                { currentSettings: plot1, parentId: graphId }
            ], done);
        });
        afterEach(function () {
            webAppHelper.removeNIElement(graphId);
        });
        it('with default settings', function (done) {
            testHelpers.runAsync(done, function () {
                const viewModel = viModel.getControlViewModel(plot1Id);
                expect(viewModel).toBeDefined();
            });
        });
        it('and it can call the setMultipleProperties method with a property update', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                const plotModel = frontPanelControls[plot1Id];
                plotModel.setMultipleProperties({ xaxis: 'newName' });
            }, function () {
                const plotModel = frontPanelControls[plot1Id];
                expect(plotModel).toBeDefined();
                expect(plotModel.xaxis).toBe('newName');
                const plotViewModel = viModel.getControlViewModel(plot1Id);
                expect(plotViewModel).toBeDefined();
            });
        });
        it('and updates the Model when properties change.', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(plot1Id, plot1Settings);
            }, function () {
                const model = viModel.getControlModel(plot1Id);
                Object.keys(plot1Settings).forEach(function (key) {
                    expect(model[key]).toBe(plot1Settings[key]);
                });
            });
        });
    });
});
//# sourceMappingURL=niCartesianPlotViewModel.Test.js.map