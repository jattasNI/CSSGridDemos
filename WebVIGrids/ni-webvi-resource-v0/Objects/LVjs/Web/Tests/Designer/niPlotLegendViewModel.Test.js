//****************************************
// Tests for PlotLegendModel class
// National Instruments Copyright 2014
//****************************************
import { CartesianGraphModel } from "../../Modeling/niCartesianGraphModel.js";
import { CartesianPlotModel } from "../../Modeling/niCartesianPlotModel.js";
import { PlotLegendModel } from "../../Modeling/niPlotLegendModel.js";
import { PlotRendererModel } from "../../Modeling/niPlotRendererModel.js";
describe('A PlotLegendViewModel', function () {
    'use strict';
    const controlId = 'Function1';
    const graphId = 'graph1';
    const axis1Id = 'axis1';
    const axis2Id = 'axis2';
    const plot1Id = 'plot1';
    const renderer1Id = 'renderer';
    let plot1;
    let renderer1;
    let graph;
    let viModel, frontPanelControls, plotLegendModel, plotLegendElement, settings, updateSettings;
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
            kind: PlotLegendModel.MODEL_KIND,
            isInEditMode: false,
            graphRef: graphId,
            fontSize: '16px',
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
            fontStyle: 'normal',
            left: '100px',
            top: '200px',
            width: '300px',
            height: '400px',
            visible: true
        };
        updateSettings = {
            isInEditMode: true,
            fontSize: '20px',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            fontStyle: 'italic',
            graphRef: 'graph2'
        };
        plot1 = {
            label: 'Plot 1',
            show: true,
            xaxis: axis1Id,
            yaxis: axis2Id,
            enableHover: false,
            hoverFormat: '',
            niControlId: plot1Id,
            kind: CartesianPlotModel.MODEL_KIND
        };
        renderer1 = {
            lineWidth: 2,
            pointColor: '#00FF00',
            pointSize: 1,
            pointShape: 'rectangle',
            niControlId: renderer1Id,
            kind: PlotRendererModel.MODEL_KIND
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
    beforeEach(function () {
        webAppHelper.createNIElement(graph);
    });
    afterEach(function () {
        webAppHelper.removeNIElement(graphId);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page.', function (done) {
        $(document.body).append('<ni-plot-legend ni-control-id="' + controlId + '" graph-ref="' + graphId + '"></ni-plot-legend>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            const model = viewModel.model;
            expect(model).toBeDefined();
            expect(model.graphRef).toEqual('graph1');
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('allows creating an instance with values set', function (done) {
        plotLegendElement = webAppHelper.createNIElement(settings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            plotLegendModel = frontPanelControls[controlId];
            let val = plotLegendModel.isInEditMode;
            expect(val).toEqual(false);
            plotLegendModel.isInEditMode = true;
            val = plotLegendModel.isInEditMode;
            expect(val).toEqual(true);
            let name = plotLegendModel.graphRef;
            expect(name).toEqual('graph1');
            plotLegendModel.graphRef = 'fred';
            name = plotLegendModel.graphRef;
            expect(name).toEqual('fred');
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('dynamically updates properties triggering ModelPropertyChanged', function () {
        let viewModel;
        beforeEach(function (done) {
            plotLegendElement = webAppHelper.createNIElement(settings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                plotLegendModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('verifies initial values', function () {
            expect(plotLegendModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(plotLegendElement.isInEditMode).toEqual(false);
        });
        it('updates graphRef and isInEditMode', function (done) {
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(plotLegendElement.isInEditMode).toEqual(true);
                expect(plotLegendElement.graphRef).toEqual('graph2');
                expect(plotLegendModel.fontSize).toEqual('20px');
                expect(plotLegendModel.fontFamily).toEqual('sans-serif');
                expect(plotLegendModel.fontWeight).toEqual('bold');
                expect(plotLegendModel.fontStyle).toEqual('italic');
            });
        });
    });
    describe('add and remove rows', function () {
        beforeEach(function (done) {
            plotLegendElement = webAppHelper.createNIElement(settings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                plotLegendModel = frontPanelControls[controlId];
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('verifies add and remove row', function () {
            plotLegendElement.plotAdded();
            expect(plotLegendElement.nPlots).toEqual(1);
            plotLegendElement.plotRemoved();
            expect(plotLegendElement.nPlots).toEqual(0);
        });
    });
    describe('test the helpers', function () {
        const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        // TODO mraj these tests are really slow on IE 11, should figure out why
        beforeEach(function (done) {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
            webAppHelper.createNIElementHierarchy([
                { currentSettings: plot1, parentId: graphId },
                { currentSettings: renderer1, parentId: plot1Id }
            ], done);
            plotLegendElement = webAppHelper.createNIElement(settings);
        });
        afterEach(function () {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            webAppHelper.removeNIElement(controlId);
        });
        it('inner', function (done) {
            testHelpers.runAsync(done, function () {
                const frontPanelControls = viModel.getAllControlModels();
                const plotLegendModel = frontPanelControls[controlId];
                const graphModel = frontPanelControls[graphId];
                expect(graphModel).toBeDefined();
                expect(plotLegendModel).toBeDefined();
                const helpers = plotLegendElement.helpers;
                const renderer = helpers.getRenderer(0);
                const index = helpers.rendererToIndex(renderer);
                expect(index).toEqual(0);
                // plot name
                expect(helpers.getPlotName(0)).toBe('Plot 1');
                // line width
                helpers.handleClick('No line', null, 0);
                expect(renderer.lineWidth).toEqual(0);
                const isNone = helpers.getState('No line', 0);
                expect(isNone).toEqual(true);
                helpers.handleClick('1-pixel', null, 0);
                expect(renderer.lineWidth).toEqual(1);
                const is1Pixel = helpers.getState('1-pixel', 0);
                expect(is1Pixel).toEqual(true);
                helpers.handleClick('2-pixels', null, 0);
                expect(renderer.lineWidth).toEqual(2);
                const is2Pixels = helpers.getState('2-pixels', 0);
                expect(is2Pixels).toEqual(true);
                helpers.handleClick('3-pixels', null, 0);
                expect(renderer.lineWidth).toEqual(3);
                const is3Pixels = helpers.getState('3-pixels', 0);
                expect(is3Pixels).toEqual(true);
                helpers.handleClick('4-pixels', null, 0);
                expect(renderer.lineWidth).toEqual(4);
                const is4Pixels = helpers.getState('4-pixels', 0);
                expect(is4Pixels).toEqual(true);
                helpers.handleClick('5-pixels', null, 0);
                expect(renderer.lineWidth).toEqual(5);
                const is5Pixels = helpers.getState('5-pixels', 0);
                expect(is5Pixels).toEqual(true);
                // line style
                helpers.handleClick('Line', null, 0);
                expect(renderer.lineStroke).not.toEqual('');
                expect(renderer.pointColor).toEqual('');
                expect(renderer.barFill).toEqual('');
                expect(renderer.areaFill).toEqual('');
                const isLine = helpers.getState('Line', 0);
                expect(isLine).toEqual(true);
                helpers.handleClick('Point', null, 0);
                expect(renderer.lineStroke).toEqual('');
                expect(renderer.pointColor).not.toEqual('');
                expect(renderer.barFill).toEqual('');
                expect(renderer.areaFill).toEqual('');
                const isPoint = helpers.getState('Point', 0);
                expect(isPoint).toEqual(true);
                helpers.handleClick('Line & Point', null, 0);
                expect(renderer.lineStroke).not.toEqual('');
                expect(renderer.pointColor).not.toEqual('');
                expect(renderer.barFill).toEqual('');
                expect(renderer.areaFill).toEqual('');
                const isLineAndPoint = helpers.getState('Line & Point', 0);
                expect(isLineAndPoint).toEqual(true);
                helpers.handleClick('Bar', null, 0);
                expect(renderer.lineStroke).toEqual('');
                expect(renderer.pointColor).toEqual('');
                expect(renderer.barFill).not.toEqual('');
                expect(renderer.areaFill).toEqual('');
                const isBar = helpers.getState('Bar', 0);
                expect(isBar).toEqual(true);
                helpers.handleClick('Fill', null, 0);
                expect(renderer.lineStroke).toEqual('');
                expect(renderer.pointColor).toEqual('');
                expect(renderer.barFill).toEqual('');
                expect(renderer.areaFill).not.toEqual('');
                const isFill = helpers.getState('Fill', 0);
                expect(isFill).toEqual(true);
                // line shape
                helpers.handleClick('Ellipse', null, 0);
                expect(renderer.pointShape).toEqual('ellipse');
                const isEllipse = helpers.getState('Ellipse', 0);
                expect(isEllipse).toEqual(true);
                helpers.handleClick('Rectangle', null, 0);
                expect(renderer.pointShape).toEqual('rectangle');
                const isRect = helpers.getState('Rectangle', 0);
                expect(isRect).toEqual(true);
                helpers.handleClick('Diamond', null, 0);
                expect(renderer.pointShape).toEqual('diamond');
                const isDiamond = helpers.getState('Diamond', 0);
                expect(isDiamond).toEqual(true);
                helpers.handleClick('Cross', null, 0);
                expect(renderer.pointShape).toEqual('cross');
                const isCross = helpers.getState('Cross', 0);
                expect(isCross).toEqual(true);
                helpers.handleClick('Plus', null, 0);
                expect(renderer.pointShape).toEqual('plus');
                const isPlus = helpers.getState('Plus', 0);
                expect(isPlus).toEqual(true);
                // line style
                helpers.handleClick('No style', null, 0);
                expect(renderer.lineStyle).toEqual('');
                let isStyle = helpers.getState('No style', 0);
                expect(isStyle).toEqual(true);
                helpers.handleClick('Solid', null, 0);
                expect(renderer.lineStyle).toEqual('solid');
                isStyle = helpers.getState('Solid', 0);
                expect(isStyle).toEqual(true);
                helpers.handleClick('Dot', null, 0);
                expect(renderer.lineStyle).toEqual('dot');
                isStyle = helpers.getState('Dot', 0);
                expect(isStyle).toEqual(true);
                helpers.handleClick('Dot-dash', null, 0);
                expect(renderer.lineStyle).toEqual('dashdot');
                isStyle = helpers.getState('Dot-dash', 0);
                expect(isStyle).toEqual(true);
                helpers.handleClick('Medium dash', null, 0);
                expect(renderer.lineStyle).toEqual('mediumdash');
                isStyle = helpers.getState('Medium dash', 0);
                expect(isStyle).toEqual(true);
                helpers.handleClick('Large dash', null, 0);
                expect(renderer.lineStyle).toEqual('largedash');
                isStyle = helpers.getState('Large dash', 0);
                expect(isStyle).toEqual(true);
                // area baseline
                helpers.handleClick('Zero', null, 0);
                expect(renderer.areaBaseLine).toEqual('zero');
                let isBase = helpers.getState('Zero', 0);
                expect(isBase).toEqual(true);
                helpers.handleClick('-Inf', null, 0);
                expect(renderer.areaBaseLine).toEqual('negativeinfinity');
                isBase = helpers.getState('-Inf', 0);
                expect(isBase).toEqual(true);
                helpers.handleClick('Inf', null, 0);
                expect(renderer.areaBaseLine).toEqual('positiveinfinity');
                isBase = helpers.getState('Inf', 0);
                expect(isBase).toEqual(true);
                helpers.handleClick('Color', { hex: 'ff00ff' }, 0);
                expect(renderer.areaFill).toEqual('#ff00ff');
                const color = helpers.getState('Color', 0);
                expect(color).toEqual('#ff00ff');
                helpers.handleClick('Hover', true, 0);
                expect(helpers.getPlot(0).enableHover).toEqual(true);
            });
        });
    });
    describe('content not added until legend is first visible', function () {
        beforeEach(function (done) {
            settings.visible = false;
            plotLegendElement = webAppHelper.createNIElement(settings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                plotLegendModel = frontPanelControls[controlId];
                const style = window.getComputedStyle(plotLegendElement);
                expect(style.visibility).toEqual('hidden');
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        xit('verifies content', function (done) {
            plotLegendElement.plotAdded();
            testHelpers.runMultipleAsync(done, function () {
                expect(plotLegendElement.nPlots).toEqual(1);
                const div = plotLegendElement.firstChild;
                const tbl = div.firstChild;
                expect(tbl.childNodes.length).toEqual(0);
                webAppHelper.dispatchMessage(controlId, { visible: true });
            }, function () {
                const div = plotLegendElement.firstChild;
                const tbl = div.firstChild;
                expect(tbl.childNodes.length).toEqual(1);
            });
        });
    });
    describe('responds to changes of the plot element ', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: plot1, parentId: graphId },
                { currentSettings: renderer1, parentId: plot1Id }
            ], done);
            plotLegendElement = webAppHelper.createNIElement(settings);
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('responds to a plot name change', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(plot1Id, { label: 'Plot 2' });
            }, function () {
                const title = plotLegendElement.querySelector('.ni-plot-title');
                expect(title.innerText).toBe('Plot 2');
            });
        });
    });
});
//# sourceMappingURL=niPlotLegendViewModel.Test.js.map