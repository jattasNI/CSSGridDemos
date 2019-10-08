// TODO mraj remove when test enabled
//****************************************
// Tests for CursorLegendModel class
// National Instruments Copyright 2014
//****************************************
import { CartesianAxisModel } from "../../Modeling/niCartesianAxisModel.js";
import { CartesianGraphModel } from "../../Modeling/niCartesianGraphModel.js";
import { CartesianPlotModel } from "../../Modeling/niCartesianPlotModel.js";
import { CursorLegendModel } from "../../Modeling/niCursorLegendModel.js";
import { CursorModel } from "../../Modeling/niCursorModel.js";
import { PlotRendererModel } from "../../Modeling/niPlotRendererModel.js";
describe('A CursorLegendViewModel', function () {
    'use strict';
    const controlId = 'Function1';
    const graphId = 'graph1';
    const axis1Id = 'axis1';
    const axis2Id = 'axis2';
    const cursor1Id = 'cursor1';
    const plot1Id = 'plot1';
    const renderer1Id = 'renderer';
    let axis1;
    let axis2;
    let cursor1;
    let plot1;
    let renderer1;
    let viModel, frontPanelControls, cursorLegendModel, cursorLegendElement, settings, updateSettings;
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
            graphRef: graphId,
            kind: CursorLegendModel.MODEL_KIND,
            isInEditMode: false,
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
        axis1 = {
            label: 'Amplitude',
            show: true,
            showLabel: true,
            axisPosition: 'left',
            minimum: 0,
            maximum: 10,
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
            niControlId: axis2Id,
            kind: CartesianAxisModel.MODEL_KIND
        };
        plot1 = {
            xaxis: axis1Id,
            yaxis: axis2Id,
            niControlId: plot1Id,
            kind: CartesianPlotModel.MODEL_KIND
        };
        cursor1 = {
            label: cursor1Id,
            show: true,
            showLabel: true,
            showValue: true,
            targetShape: 'ellipse',
            snapToPlot: undefined,
            crosshairStyle: 'vertical',
            niControlId: cursor1Id,
            kind: CursorModel.MODEL_KIND
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
    beforeEach(function (done) {
        webAppHelper.createNIElementHierarchy([
            {
                currentSettings: {
                    niControlId: graphId,
                    kind: CartesianGraphModel.MODEL_KIND,
                    left: '270px',
                    top: '150px',
                    width: '750px',
                    height: '300px',
                    visible: true
                }
            },
            { currentSettings: axis1, parentId: graphId },
            { currentSettings: axis2, parentId: graphId },
            { currentSettings: plot1, parentId: graphId },
            { currentSettings: renderer1, parentId: plot1Id },
            { currentSettings: cursor1, parentId: graphId }
        ], done);
    });
    afterEach(function (done) {
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.removeNIElement(graphId);
        }, function () {
            expect(Object.keys(viModel.getAllControlModels()).length).toBe(0);
        });
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        // TODO mraj DOM_POLLUTION
        //domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page.', function (done) {
        $(document.body).append('<ni-cursor-legend ni-control-id="' + controlId + '" graph-ref="' + graphId + '"></ni-cursor-legend>');
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
        cursorLegendElement = webAppHelper.createNIElement(settings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            cursorLegendModel = frontPanelControls[controlId];
            let val = cursorLegendModel.isInEditMode;
            expect(val).toEqual(false);
            cursorLegendModel.isInEditMode = true;
            val = cursorLegendModel.isInEditMode;
            expect(val).toEqual(true);
            let name = cursorLegendModel.graphRef;
            expect(name).toEqual('graph1');
            cursorLegendModel.graphRef = 'fred';
            name = cursorLegendModel.graphRef;
            expect(name).toEqual('fred');
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('dynamically updates properties triggering ModelPropertyChanged', function () {
        let viewModel;
        beforeEach(function (done) {
            cursorLegendElement = webAppHelper.createNIElement(settings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                cursorLegendModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
            });
        });
        afterEach(function (done) {
            webAppHelper.removeNIElement(controlId);
            testHelpers.runAsync(done, function () {
            });
        });
        it('verifies initial values', function () {
            expect(cursorLegendModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(cursorLegendElement.isInEditMode).toEqual(false);
        });
        it('updates graphRef and isInEditMode', function (done) {
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(cursorLegendElement.isInEditMode).toEqual(true);
                expect(cursorLegendElement.graphRef).toEqual('graph2');
                expect(cursorLegendModel.fontSize).toEqual('20px');
                expect(cursorLegendModel.fontFamily).toEqual('sans-serif');
                expect(cursorLegendModel.fontWeight).toEqual('bold');
                expect(cursorLegendModel.fontStyle).toEqual('italic');
            });
        });
    });
    describe('add and remove rows', function () {
        beforeEach(function (done) {
            cursorLegendElement = webAppHelper.createNIElement(settings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                cursorLegendModel = frontPanelControls[controlId];
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        xit('verifies add and remove row', function () {
            cursorLegendElement.cursorAdded();
            expect(cursorLegendElement.nCursors).toEqual(1);
            cursorLegendElement.cursorRemoved({ label: '' });
            expect(cursorLegendElement.nCursors).toEqual(0);
        });
    });
    describe('test the helpers', function () {
        beforeEach(function () {
            cursorLegendElement = webAppHelper.createNIElement(settings);
        });
        it('inner', function (done) {
            testHelpers.runMultipleAsync(done, function () { }, function () {
                const frontPanelControls = viModel.getAllControlModels();
                const cursorLegendModel = frontPanelControls[controlId];
                const graphModel = frontPanelControls[graphId];
                expect(graphModel).toBeDefined();
                expect(cursorLegendModel).toBeDefined();
                const helpers = cursorLegendElement.helpers;
                const cursor = helpers.getCursor(0);
                const index = helpers.getIndex(cursor);
                expect(index).toEqual(0);
                // target shape
                helpers.handleClick('Ellipse', null, cursor);
                expect(cursor.targetShape).toEqual('ellipse');
                let isStyle = helpers.getState('Ellipse', cursor);
                expect(isStyle).toEqual(true);
                helpers.handleClick('Rectangle', null, cursor);
                expect(cursor.targetShape).toEqual('rectangle');
                isStyle = helpers.getState('Rectangle', cursor);
                expect(isStyle).toEqual(true);
                helpers.handleClick('Diamond', null, cursor);
                expect(cursor.targetShape).toEqual('diamond');
                isStyle = helpers.getState('Diamond', cursor);
                expect(isStyle).toEqual(true);
                helpers.handleClick('Cross', null, cursor);
                expect(cursor.targetShape).toEqual('cross');
                isStyle = helpers.getState('Cross', cursor);
                expect(isStyle).toEqual(true);
                helpers.handleClick('Plus', null, cursor);
                expect(cursor.targetShape).toEqual('plus');
                isStyle = helpers.getState('Plus', cursor);
                expect(isStyle).toEqual(true);
                const shape = helpers.getTargetShape(0);
                expect(shape).toEqual('plus');
                // cross hair style
                helpers.handleClick('No style', null, cursor);
                expect(cursor.crosshairStyle).toEqual('none');
                isStyle = helpers.getState('No style', cursor);
                expect(isStyle).toEqual(true);
                helpers.handleClick('Vertical', null, cursor);
                expect(cursor.crosshairStyle).toEqual('vertical');
                isStyle = helpers.getState('Vertical', cursor);
                expect(isStyle).toEqual(true);
                helpers.handleClick('Horizontal', null, cursor);
                expect(cursor.crosshairStyle).toEqual('horizontal');
                isStyle = helpers.getState('Horizontal', cursor);
                expect(isStyle).toEqual(true);
                helpers.handleClick('Both', null, cursor);
                expect(cursor.crosshairStyle).toEqual('both');
                isStyle = helpers.getState('Both', cursor);
                expect(isStyle).toEqual(true);
                const crosshair = helpers.getCrosshair(0);
                expect(crosshair).toEqual('both');
                helpers.handleClick('Color', { hex: 'ff00ff' }, cursor);
                expect(cursor.style.color).toEqual('rgb(255, 0, 255)');
                const color = helpers.getState('Color', cursor);
                expect(color).toEqual('rgb(255, 0, 255)');
                helpers.handleClick('visible', null, cursor);
                expect(cursor.show).toEqual(false);
                let visible = helpers.getState('visible', cursor);
                expect(visible).toEqual(false);
                helpers.handleClick('visible', null, cursor);
                helpers.handleClick('snap', null, cursor);
                expect(cursor.snapToPlot).toEqual(-1);
                visible = helpers.getState('snap', cursor);
                expect(visible).toEqual(true);
                helpers.handleClick('center', null, cursor);
                expect(cursor.x).toEqual(0.5);
                expect(cursor.y).toEqual(0.5);
            }, function () {
                webAppHelper.removeNIElement(controlId);
            });
        });
    });
    describe('test the helpers add and remove cursors', function () {
        xit('inner add and remove', function (done) {
            webAppHelper.createNIElement({
                niControlId: graphId,
                kind: CartesianGraphModel.MODEL_KIND,
                left: '270px',
                top: '150px',
                width: '750px',
                height: '300px',
                visible: true
            });
            webAppHelper.createNIElement(axis1, graphId);
            webAppHelper.createNIElement(axis2, graphId);
            webAppHelper.createNIElement(plot1, graphId);
            webAppHelper.createNIElement(renderer1, plot1Id);
            webAppHelper.createNIElement(cursor1, graphId);
            const cursorLegendElement = webAppHelper.createNIElement(settings);
            testHelpers.runMultipleAsync(done, function () {
                const helpers = cursorLegendElement.helpers;
                helpers.addCursor();
            }, function () {
                const helpers = cursorLegendElement.helpers;
                expect(cursorLegendElement.helpers.cursors.length).toEqual(2);
                helpers.deleteCursor(1);
            }, function () {
                expect(cursorLegendElement.helpers.cursors.length).toEqual(1);
            }, function () {
                webAppHelper.removeNIElement(controlId);
                webAppHelper.removeNIElement(graphId);
            }, function () {
                expect(Object.keys(viModel.getAllControlModels()).length).toBe(0);
            });
        });
    });
});
//# sourceMappingURL=niCursorLegendViewModel.Test.js.map