//****************************************
// Tests for PlotRendererViewModel class
// National Instruments Copyright 2015
//****************************************
import { CartesianGraphModel } from "../../Modeling/niCartesianGraphModel.js";
import { CartesianPlotModel } from "../../Modeling/niCartesianPlotModel.js";
import { PlotRendererModel } from "../../Modeling/niPlotRendererModel.js";
describe('A PlotRendererViewModel', function () {
    'use strict';
    const graphId = 'Function1';
    let graph, plot1, renderer1, renderer1Settings, renderer1ElementSettings;
    const axis1Id = 'Function13', axis2Id = 'Function12', plot1Id = 'Function15', renderer1Id = 'Function18';
    let viModel, frontPanelControls;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    // TODO mraj these tests are really slow on IE 11, should figure out why
    const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    beforeAll(function (done) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
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
        renderer1 = {
            lineWidth: 4,
            lineStyle: 'solid',
            pointColor: '#FFFF00',
            pointSize: 3,
            pointShape: 'ellipse',
            lineStroke: 'blue',
            niControlId: renderer1Id,
            kind: PlotRendererModel.MODEL_KIND
        };
        renderer1Settings = {
            lineWidth: 2,
            lineStyle: 'dashdot',
            pointColor: '#FF00FF',
            pointSize: 5,
            pointShape: 'diamond',
            lineStroke: 'green',
            areaFill: 'yellow',
            barFill: 'red',
            barWidth: 3
        };
        renderer1ElementSettings = {
            'line-width': 2,
            'line-style': 'dashdot',
            'point-color': '#FF00FF',
            'point-size': 5,
            'point-shape': 'diamond',
            'line-stroke': 'green',
            'area-fill': 'yellow',
            'bar-fill': 'red',
            'bar-width': 3,
            'ni-control-id': renderer1Id
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
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    describe('allows renderer creation ', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: graph },
                { currentSettings: plot1, parentId: graphId },
                { currentSettings: renderer1, parentId: plot1Id }
            ], done);
        });
        afterEach(function () {
            webAppHelper.removeNIElement(graphId);
        });
        it('and allows to call the setMultipleProperties method with a property update', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                const rendererModel = frontPanelControls[renderer1Id];
                rendererModel.setMultipleProperties(renderer1Settings);
            }, function () {
                const rendererModel = frontPanelControls[renderer1Id];
                expect(rendererModel).toBeDefined();
                const rendererViewModel = viModel.getControlViewModel(renderer1Id);
                expect(rendererViewModel).toBeDefined();
                Object.keys(renderer1Settings).forEach(function (key) {
                    expect(rendererModel[key]).toBe(renderer1Settings[key]);
                });
            });
        });
        it('and updates the Model when properties change.', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(renderer1Id, renderer1Settings);
            }, function () {
                const model = viModel.getControlModel(renderer1Id);
                Object.keys(renderer1Settings).forEach(function (key) {
                    expect(model[key]).toBe(renderer1Settings[key]);
                });
            });
        });
    });
    describe('allows graph and plot creation ', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: graph },
                { currentSettings: plot1, parentId: graphId }
            ], done);
        });
        afterEach(function () {
            webAppHelper.removeNIElement(graphId);
        });
        it('and allows a renderer element to be added directly to the page.', function (done) {
            const plotElement = document.querySelector('[ni-control-id="' + plot1Id + '"]');
            webAppHelper.appendElement('ni-cartesian-plot-renderer', renderer1ElementSettings, plotElement);
            testHelpers.runAsync(done, function () {
                const model = viModel.getControlModel(renderer1Id);
                Object.keys(renderer1Settings).forEach(function (key) {
                    expect(model[key]).toBe(renderer1Settings[key]);
                });
            });
        });
    });
});
//# sourceMappingURL=niPlotRendererViewModel.Test.js.map