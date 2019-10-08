//****************************************
// Tests for PlotLegendModel class
// National Instruments Copyright 2014
//****************************************
import { CartesianGraphModel } from "../../Modeling/niCartesianGraphModel.js";
import { CartesianPlotModel } from "../../Modeling/niCartesianPlotModel.js";
import { PlotLegendModel } from "../../Modeling/niPlotLegendModel.js";
import { PlotRendererModel } from "../../Modeling/niPlotRendererModel.js";
describe('A PlotLegendItemDisplay', function () {
    'use strict';
    const graphId = 'graphDisplay';
    const plot1Id = 'plotDisplay';
    const axis1Id = 'axisDisplay1';
    const axis2Id = 'axisDisplay2';
    const renderer1Id = 'rendererDisplay';
    let graph, plot1, renderer1, plotLegendElement, settings;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const controlId = 'FunctionDisplay';
    const checkVisibility = function (lineTypes, lineValue, plotLegendItemDisplay, index) {
        for (let i = 0; i < lineTypes.length; i++) {
            if (lineTypes[i].name === lineValue) {
                if (plotLegendItemDisplay.shapes[index].shapesGroup[lineTypes[i].name].getAttribute('visibility') !== 'visible') {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        return false;
    };
    beforeAll(function (done) {
        webAppHelper.installWebAppFixture(done);
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
        plot1 = {
            label: 'PlotDisplay',
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
            lineStroke: '#00FF00',
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
    describe('plot legend test', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: {
                        niControlId: graphId,
                        graphRef: graphId,
                        kind: CartesianGraphModel.MODEL_KIND,
                        left: '270px',
                        top: '150px',
                        width: '750px',
                        height: '300px',
                        visible: true
                    } },
                { currentSettings: plot1, parentId: graphId },
                { currentSettings: renderer1, parentId: plot1Id }
            ], done);
            plotLegendElement = webAppHelper.createNIElement(settings);
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
            webAppHelper.removeNIElement(graphId);
        });
        it('reflects the changes from the right rail', function (done) {
            graph = document.querySelector('[ni-control-id="' + graphId + '"]');
            testHelpers.runAsync(done, function () {
                graph.throttlePlotUpdates(true);
                const helpers = plotLegendElement.helpers;
                const plotLegendItemDisplay = plotLegendElement.plotLegendItemDisplay;
                const renderer = helpers.getRenderer(0);
                const index = helpers.rendererToIndex(renderer);
                const lineTypes = plotLegendItemDisplay.lineTypes;
                expect(index).toEqual(0);
                expect(helpers.getPlotName(0)).toBe('PlotDisplay');
                helpers.handleClick('Bar', null, 0);
                expect(checkVisibility(lineTypes, 'bar', plotLegendItemDisplay, index)).toBe(true);
                expect(checkVisibility(lineTypes, 'line', plotLegendItemDisplay, index)).toBe(false);
                expect(checkVisibility(lineTypes, 'fill', plotLegendItemDisplay, index)).toBe(false);
                expect(checkVisibility(lineTypes, 'points', plotLegendItemDisplay, index)).toBe(false);
                helpers.handleClick('Line', null, 0);
                expect(checkVisibility(lineTypes, 'bar', plotLegendItemDisplay, index)).toBe(false);
                expect(checkVisibility(lineTypes, 'line', plotLegendItemDisplay, index)).toBe(true);
                expect(checkVisibility(lineTypes, 'fill', plotLegendItemDisplay, index)).toBe(false);
                expect(checkVisibility(lineTypes, 'points', plotLegendItemDisplay, index)).toBe(false);
                helpers.handleClick('Fill', null, 0);
                expect(checkVisibility(lineTypes, 'fill', plotLegendItemDisplay, index)).toBeTruthy();
                expect(checkVisibility(lineTypes, 'bar', plotLegendItemDisplay, index)).toBe(false);
                expect(checkVisibility(lineTypes, 'line', plotLegendItemDisplay, index)).toBe(false);
                expect(checkVisibility(lineTypes, 'fill', plotLegendItemDisplay, index)).toBe(true);
                expect(checkVisibility(lineTypes, 'points', plotLegendItemDisplay, index)).toBe(false);
                helpers.handleClick('Point', null, 0);
                expect(checkVisibility(lineTypes, 'bar', plotLegendItemDisplay, index)).toBe(false);
                expect(checkVisibility(lineTypes, 'line', plotLegendItemDisplay, index)).toBe(false);
                expect(checkVisibility(lineTypes, 'fill', plotLegendItemDisplay, index)).toBe(false);
                expect(checkVisibility(lineTypes, 'points', plotLegendItemDisplay, index)).toBe(true);
                helpers.handleClick('Line & Point', null, 0);
                expect(checkVisibility(lineTypes, 'bar', plotLegendItemDisplay, index)).toBe(false);
                expect(checkVisibility(lineTypes, 'line', plotLegendItemDisplay, index)).toBe(true);
                expect(checkVisibility(lineTypes, 'fill', plotLegendItemDisplay, index)).toBe(false);
                expect(checkVisibility(lineTypes, 'points', plotLegendItemDisplay, index)).toBe(true);
                helpers.handleClick('Cross', null, 0);
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.line.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.fill.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.bar.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.cross.getAttribute('visiblity'), 'visible');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.ellipse.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.diamond.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.plus.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.rectangle.getAttribute('visiblity'), 'hidden');
                helpers.handleClick('Plus', null, 0);
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.line.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.fill.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.bar.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.cross.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.ellipse.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.diamond.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.plus.getAttribute('visiblity'), 'visible');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.rectangle.getAttribute('visiblity'), 'hidden');
                helpers.handleClick('Rectangle', null, 0);
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.line.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.fill.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.bar.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.cross.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.ellipse.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.diamond.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.plus.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.rectangle.getAttribute('visiblity'), 'visible');
                helpers.handleClick('Diamond', null, 0);
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.line.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.fill.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.bar.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.cross.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.ellipse.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.diamond.getAttribute('visiblity'), 'visible');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.plus.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.rectangle.getAttribute('visiblity'), 'hidden');
                helpers.handleClick('Ellipse', null, 0);
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.line.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.fill.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.bar.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.cross.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.ellipse.getAttribute('visiblity'), 'visible');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.diamond.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.plus.getAttribute('visiblity'), 'hidden');
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.points.rectangle.getAttribute('visiblity'), 'hidden');
                helpers.handleClick('2-pixels', null, 0);
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.line.getAttribute('stroke-width'), '2');
                helpers.handleClick('Dot', null, 0);
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.line.getAttribute('stroke-dasharray'), '1, 2');
                helpers.handleClick('Color', 'FFFFFF', 0);
                expect(plotLegendItemDisplay.shapes[index].shapesGroup.line.getAttribute('color'), 'rgba(255, 255, 255, 1)');
                graph.throttlePlotUpdates(false);
            });
        }, 60000);
    });
});
//# sourceMappingURL=niPlotLegendDisplay.Test.js.map