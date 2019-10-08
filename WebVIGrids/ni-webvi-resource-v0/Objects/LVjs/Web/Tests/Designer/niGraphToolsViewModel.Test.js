//****************************************
// Tests for GraphToolsViewModel class
// National Instruments Copyright 2015
//****************************************
import { CartesianAxisModel } from "../../Modeling/niCartesianAxisModel.js";
import { CartesianGraphModel } from "../../Modeling/niCartesianGraphModel.js";
import { CartesianPlotModel } from "../../Modeling/niCartesianPlotModel.js";
import { GraphToolsModel } from "../../Modeling/niGraphToolsModel.js";
import { PlotRendererModel } from "../../Modeling/niPlotRendererModel.js";
describe('A GraphToolsViewModel', function () {
    'use strict';
    const graphToolsId = 'Function1';
    const graphId = 'graph1';
    const axis1Id = 'axis1';
    const axis2Id = 'axis2';
    const plot1Id = 'plot1';
    const renderer1Id = 'renderer1';
    let axis1, axis2, plot1, renderer1, graph;
    let viModel, frontPanelControls, graphToolsModel, graphTools;
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
        graphTools = {
            niControlId: graphToolsId,
            kind: GraphToolsModel.MODEL_KIND,
            isInEditMode: false,
            graphRef: graphId,
            mode: 'pan',
            fontSize: '16px',
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
            fontStyle: 'normal',
            top: '450px',
            width: '150px',
            height: '30px',
            left: '270px',
            visible: true
        };
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
            graphRef: graphId,
            kind: CartesianGraphModel.MODEL_KIND,
            left: '100px',
            top: '200px',
            width: '300px',
            height: '400px',
            value: [0, 1]
        };
        plot1 = {
            show: true,
            xaxis: axis1Id,
            yaxis: axis2Id,
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
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    // Helper function copied to this file
    // TODO should be removed after we migrate to jasmine >= 2.7 and the `it` blocks support async functions natively
    const makeAsync = function (done, fn) {
        fn().then(() => done()).catch((ex) => done.fail(ex));
    };
    it('allows elements to be added directly to the page.', function (done) {
        $(document.body).append('<ni-graph-tools ni-control-id="' + graphToolsId + '" graph-ref="' + graphId + '"></ni-graph-tools>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(graphToolsId);
            expect(viewModel).toBeDefined();
            const model = viewModel.model;
            expect(model).toBeDefined();
            expect(model.graphRef).toEqual('graph1');
            webAppHelper.removeNIElement(graphToolsId);
        });
    });
    it('allows creating an instance with values set', function (done) {
        webAppHelper.createNIElement(graphTools);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            graphToolsModel = frontPanelControls[graphToolsId];
            const val = graphToolsModel.isInEditMode;
            expect(val).toEqual(false);
            const name = graphToolsModel.graphRef;
            expect(name).toEqual('graph1');
            webAppHelper.removeNIElement(graphToolsId);
        });
    });
    it('verify that default interaction mode is locked', function (done) {
        webAppHelper.createNIElement(graph);
        testHelpers.runMultipleAsync(done, function () {
            $(document.body).append('<ni-graph-tools ni-control-id="' + graphToolsId + '" graph-ref="' + graphId + '"></ni-graph-tools>');
        }, function () {
            const viewModel = viModel.getControlViewModel(graphToolsId);
            const graphElement = viewModel.element;
            expect(graphElement.mode).toBe('locked');
        }, function () {
            webAppHelper.removeNIElement(graphToolsId);
            webAppHelper.removeNIElement(graphId);
        });
    });
    it('verify that the element can be initialized in zoom mode ', function (done) {
        webAppHelper.createNIElement(graph);
        testHelpers.runMultipleAsync(done, function () {
            $(document.body).append('<ni-graph-tools ni-control-id="' + graphToolsId + '" graph-ref="' + graphId + '" mode="zoom"></ni-graph-tools>');
        }, function () {
            const viewModel = viModel.getControlViewModel(graphToolsId);
            const graphElement = viewModel.element;
            const graphOptions = viewModel.element._parentGraph.graph.getOptions();
            expect(graphElement.mode).toBe('zoom');
            expect(graphOptions.zoom.interactive).toBe(true);
            expect(graphOptions.selection.mode).toBe('smart');
        }, function () {
            webAppHelper.removeNIElement(graphToolsId);
            webAppHelper.removeNIElement(graphId);
        });
    });
    it('verify that the element can be initialized in locked mode ', function (done) {
        webAppHelper.createNIElement(graph);
        testHelpers.runMultipleAsync(done, function () {
            $(document.body).append('<ni-graph-tools ni-control-id="' + graphToolsId + '" graph-ref="' + graphId + '" mode="locked"></ni-graph-tools>');
        }, function () {
            const viewModel = viModel.getControlViewModel(graphToolsId);
            const graphElement = viewModel.element;
            const graphOptions = viewModel.element._parentGraph.graph.getOptions();
            expect(graphElement.mode).toBe('locked');
            expect(graphOptions.zoom.interactive).toBe(false);
            expect(graphOptions.selection.mode).toBe(null);
        }, function () {
            webAppHelper.removeNIElement(graphToolsId);
            webAppHelper.removeNIElement(graphId);
        });
    });
    it('locks interaction when the lock button is pressed.', function (done) {
        makeAsync(done, async function () {
            webAppHelper.createNIElement(graph);
            await testHelpers.waitAsync();
            webAppHelper.createNIElement(graphTools);
            await testHelpers.waitAsync();
            const viewModel = viModel.getControlViewModel(graphToolsId);
            const graphToolsElement = viewModel.element;
            const lockButtonElement = $(graphToolsElement).find('.ni-locked-icon');
            lockButtonElement.trigger('click');
            await graphToolsElement._parentGraph.updateCompleted;
            const graphOptions = graphToolsElement._parentGraph.graph.getOptions();
            expect(graphToolsElement.mode).toBe('locked');
            expect(graphOptions.zoom.interactive).toBe(false);
            expect(graphOptions.selection.mode).toBe(null);
            await testHelpers.waitAsync();
            webAppHelper.removeNIElement(graphToolsId);
            webAppHelper.removeNIElement(graphId);
        });
    });
    it('enables box zoom mode when when the box zoom button is pressed.', function (done) {
        makeAsync(done, async function () {
            webAppHelper.createNIElement(graph);
            await testHelpers.waitAsync();
            webAppHelper.createNIElement(graphTools);
            await testHelpers.waitAsync();
            const viewModel = viModel.getControlViewModel(graphToolsId);
            const graphToolsElement = viewModel.element;
            const boxZoomButtonElement = $(graphToolsElement).find('.ni-zoom-region-icon');
            boxZoomButtonElement.trigger('click');
            await graphToolsElement._parentGraph.updateCompleted;
            const graphOptions = graphToolsElement._parentGraph.graph.getOptions();
            expect(graphToolsElement.mode).toBe('zoom');
            expect(graphOptions.zoom.interactive).toBe(true);
            expect(graphOptions.selection.mode).toBe('smart');
            await testHelpers.waitAsync();
            webAppHelper.removeNIElement(graphToolsId);
            webAppHelper.removeNIElement(graphId);
        });
    });
    it('enables pan mode when the pan button is pressed.', function (done) {
        makeAsync(done, async function () {
            webAppHelper.createNIElement(graph);
            await testHelpers.waitAsync();
            graphTools.mode = 'locked';
            webAppHelper.createNIElement(graphTools);
            await testHelpers.waitAsync();
            const viewModel = viModel.getControlViewModel(graphToolsId);
            const graphToolsElement = viewModel.element;
            const panButtonElement = $(graphToolsElement).find('.ni-pan-icon');
            panButtonElement.trigger('click');
            await graphToolsElement._parentGraph.updateCompleted;
            const graphOptions = graphToolsElement._parentGraph.graph.getOptions();
            expect(graphToolsElement.mode).toBe('pan');
            expect(graphOptions.zoom.interactive).toBe(true);
            expect(graphOptions.selection.mode).toBe(null);
            await testHelpers.waitAsync();
            webAppHelper.removeNIElement(graphToolsId);
            webAppHelper.removeNIElement(graphId);
        });
    });
    describe('allows creation of graph ', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: graph },
                { currentSettings: axis1, parentId: graphId },
                { currentSettings: axis2, parentId: graphId }
            ], done);
            testHelpers.runAsync(done, function () {
                webAppHelper.createNIElement(graphTools);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(graphId);
            webAppHelper.removeNIElement(graphToolsId);
        });
        it('and zoomOut button will call scaleOnce on all axes when pressed', function (done) {
            testHelpers.runMultipleAsync(done, function () {
            }, function () {
                const graphViewModel = viModel.getControlViewModel(graphToolsId);
                const graphElement = graphViewModel.element;
                const zoomOutButtonElement = $(graphElement).find('.ni-zoom-out-icon');
                const axis1ViewModel = viModel.getControlViewModel(axis1Id);
                const axis1Element = axis1ViewModel.element;
                const axis2ViewModel = viModel.getControlViewModel(axis2Id);
                const axis2Element = axis2ViewModel.element;
                spyOn(axis1Element, 'resetOffset').and.callThrough();
                spyOn(axis2Element, 'resetOffset').and.callThrough();
                zoomOutButtonElement.trigger('click');
                expect(axis1Element.resetOffset).toHaveBeenCalled();
                expect(axis2Element.resetOffset).toHaveBeenCalled();
            });
        });
    });
    describe('allows creation of graph with renderer ', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: graph },
                { currentSettings: axis1, parentId: graphId },
                { currentSettings: axis2, parentId: graphId },
                { currentSettings: plot1, parentId: graphId },
                { currentSettings: renderer1, parentId: plot1Id }
            ], done);
        });
        it('and zoomOut works as expected', function (done) {
            testHelpers.runMultipleAsync(done, function () {
            }, function () {
                webAppHelper.createNIElement(graphTools);
            }, function () {
                const graphViewModel = viModel.getControlViewModel(graphToolsId);
                const graphElement = graphViewModel.element;
                const zoomOutButtonElement = $(graphElement).find('.ni-zoom-out-icon');
                const axis1ViewModel = viModel.getControlViewModel(axis1Id);
                const axis1Element = axis1ViewModel.element;
                const axis2ViewModel = viModel.getControlViewModel(axis2Id);
                const axis2Element = axis2ViewModel.element;
                zoomOutButtonElement.trigger('click');
                expect(axis1Element.minimum).toBe(0);
                expect(axis1Element.maximum).toBe(1);
                expect(axis2Element.minimum).toBe(0);
                expect(axis2Element.maximum).toBe(1);
            }, function () {
                webAppHelper.removeNIElement(graphToolsId);
                webAppHelper.removeNIElement(graphId);
            });
        });
    });
    describe('Tooltip', function () {
        const axisToClientCoords = function (x, y) {
            const graphElement = viModel.getControlViewModel(graphId).element, plot = graphElement.graph, offset = plot.offset(), canvasCoords = plot.p2c({ x: x, y: y });
            return {
                x: canvasCoords.left + offset.left,
                y: canvasCoords.top + offset.top
            };
        };
        const simulateMousePosition = function (x, y) {
            const graphElement = viModel.getControlViewModel(graphId).element;
            const plot = graphElement.graph;
            const overlay = plot.getPlaceholder().find('.flot-overlay')[0];
            $(overlay).simulate('mousemove', { clientX: x, clientY: y });
        };
        let x, y;
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: graph },
                { currentSettings: axis1, parentId: graphId },
                { currentSettings: axis2, parentId: graphId },
                { currentSettings: plot1, parentId: graphId },
                { currentSettings: renderer1, parentId: plot1Id }
            ], done);
        });
        beforeEach(function (done) {
            x = 0;
            y = graph.value[0];
            const close = 2;
            const updateSettings = { enableHover: true };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(plot1Id, updateSettings);
            }, function () {
                const position = axisToClientCoords(x, y);
                simulateMousePosition(position.x + close, position.y + close);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(graphId);
        });
        it('shows the exact coordinates of the closest point', function (done) {
            testHelpers.runMultipleAsync(done, function () {
            }, function () {
                const graphElement = viModel.getControlViewModel(graphId).element, plot = graphElement.graph, tooltip = plot.getPlaceholder().parent().find('.ni-graph-tooltip'), text = tooltip.text(), coords = text.split(',').map(parseFloat);
                expect(coords[0]).toBe(x);
                expect(coords[1]).toBe(y);
            });
        });
        it('disappears when the mouse is too far', function (done) {
            const far = 100;
            testHelpers.runMultipleAsync(done, function () {
            }, function () {
                const position = axisToClientCoords(x, y);
                simulateMousePosition(position.x + far, position.y + far);
            }, function () {
                const graphElement = viModel.getControlViewModel(graphId).element, plot = graphElement.graph, tooltip = plot.getPlaceholder().parent().find('.ni-graph-tooltip');
                expect(tooltip.is('visible')).toBe(false);
            });
        });
    });
});
//# sourceMappingURL=niGraphToolsViewModel.Test.js.map