//****************************************
// Tests for ScaleLegendModel class
// National Instruments Copyright 2014
//****************************************
import { CartesianAxisModel } from '../../Modeling/niCartesianAxisModel.js';
import { CartesianGraphModel } from '../../Modeling/niCartesianGraphModel.js';
import { ScaleLegendModel } from '../../Modeling/niScaleLegendModel.js';
describe('A ScaleLegendViewModel', function () {
    'use strict';
    const controlId = 'Function1';
    const graphId = 'graph1';
    const axis1Id = 'axis1';
    let axis1;
    let graph;
    let viModel, frontPanelControls, scaleLegendModel, scaleLegendElement, settings, updateSettings;
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
            kind: ScaleLegendModel.MODEL_KIND,
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
        graph = {
            niControlId: graphId,
            graphRef: graphId,
            kind: CartesianGraphModel.MODEL_KIND,
            left: '100px',
            top: '200px',
            width: '300px',
            height: '400px'
        };
    });
    beforeEach(function (done) {
        webAppHelper.createNIElementHierarchy([
            {
                currentSettings: graph
            }
        ], done);
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
        $(document.body).append('<ni-scale-legend ni-control-id="' + controlId + '" graph-ref="' + graphId + '"></ni-scale-legend>');
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
        scaleLegendElement = webAppHelper.createNIElement(settings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            scaleLegendModel = frontPanelControls[controlId];
            let val = scaleLegendModel.isInEditMode;
            expect(val).toEqual(false);
            scaleLegendModel.isInEditMode = true;
            val = scaleLegendModel.isInEditMode;
            expect(val).toEqual(true);
            let name = scaleLegendModel.graphRef;
            expect(name).toEqual('graph1');
            scaleLegendModel.graphRef = 'fred';
            name = scaleLegendModel.graphRef;
            expect(name).toEqual('fred');
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('dynamically updates properties triggering ModelPropertyChanged', function () {
        let viewModel;
        beforeEach(function (done) {
            scaleLegendElement = webAppHelper.createNIElement(settings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                scaleLegendModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('verifies initial values', function () {
            expect(scaleLegendModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(scaleLegendElement.isInEditMode).toEqual(false);
        });
        it('updates content, value, momentary, and clickMode', function (done) {
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(scaleLegendElement.isInEditMode).toEqual(true);
                expect(scaleLegendElement.graphRef).toEqual('graph2');
                expect(scaleLegendModel.fontSize).toEqual('20px');
                expect(scaleLegendModel.fontFamily).toEqual('sans-serif');
                expect(scaleLegendModel.fontWeight).toEqual('bold');
                expect(scaleLegendModel.fontStyle).toEqual('italic');
            });
        });
    });
    describe('add and remove rows', function () {
        beforeEach(function (done) {
            scaleLegendElement = webAppHelper.createNIElement(settings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                scaleLegendModel = frontPanelControls[controlId];
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('verifies add and remove row', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                expect(scaleLegendElement.nScales).toEqual(0);
                webAppHelper.createNIElement(axis1, graphId);
            }, function () {
                expect(scaleLegendElement.nScales).toEqual(1);
                webAppHelper.removeNIElement(axis1Id);
            }, function () {
                expect(scaleLegendElement.nScales).toEqual(0);
            });
        });
    });
    describe('test the helpers', function () {
        beforeEach(function () {
            webAppHelper.createNIElement(axis1, graphId);
        });
        it('inner', function (done) {
            scaleLegendElement = webAppHelper.createNIElement(settings);
            testHelpers.runAsync(done, function () {
                const frontPanelControls = viModel.getAllControlModels();
                const scaleLegendModel = frontPanelControls[controlId];
                const graphModel = frontPanelControls[graphId];
                const axis1ViewModel = viModel.getControlViewModel(axis1Id);
                expect(graphModel).toBeDefined();
                expect(scaleLegendModel).toBeDefined();
                const helpers = scaleLegendElement.helpers;
                const scale = helpers.getScale(0);
                expect(scale.niControlId).toEqual(axis1ViewModel.model.niControlId);
                const index = helpers.scaleToIndex(scale);
                expect(index).toEqual(0);
                const autoscale = scale.autoScale;
                helpers.handleClick('lock', 0);
                expect(autoscale).toEqual('none');
                expect(scale.autoScale).not.toEqual('none');
                const name = helpers.getState('name', 0);
                expect(name).toEqual('Amplitude');
                webAppHelper.removeNIElement(controlId);
            });
        });
    });
    describe('content not added until legend is first visible', function () {
        beforeEach(function (done) {
            settings.visible = false;
            scaleLegendElement = webAppHelper.createNIElement(settings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                scaleLegendModel = frontPanelControls[controlId];
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        xit('verifies add and remove row', function (done) {
            scaleLegendElement.scaleAdded();
            testHelpers.runMultipleAsync(done, function () {
                expect(scaleLegendElement.nScales).toEqual(1);
                const div = scaleLegendElement.firstChild;
                const tbl = div.firstChild;
                expect(tbl.childNodes.length).toEqual(0);
                webAppHelper.dispatchMessage(controlId, { visible: true });
            }, function () {
                const div = scaleLegendElement.firstChild;
                const tbl = div.firstChild;
                expect(tbl.childNodes.length).toEqual(1);
            });
        });
    });
});
//# sourceMappingURL=niScaleLegendViewModel.Test.js.map