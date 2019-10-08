//****************************************
// Tests for CursorViewModel class
// National Instruments Copyright 2014
//****************************************
import { CartesianAxisModel } from "../../Modeling/niCartesianAxisModel.js";
import { CartesianGraphModel } from "../../Modeling/niCartesianGraphModel.js";
import { CursorModel } from "../../Modeling/niCursorModel.js";
describe('A CursorViewModel', function () {
    'use strict';
    const $internalDoNotUse = NationalInstruments.Globals.jQuery;
    const graphId = 'Function1';
    let viModel, axis1, axis2, cursor1, graph1, cursor2ElementSettings, cursor1Settings;
    const axis1Id = 'Function13', axis2Id = 'Function12', cursor1Id = 'Function20', cursor2Id = 'Function21';
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    /* flot redraw overlay is triggered on a 1000/60 ms timeout.
    runMultipleAsync is scheduled on rafs and that means that the next animation frame
    can (and will ussualy) occur before the redraw overlay. This function forces a redraw overlay*/
    const forceCursorsUpdate = function () {
        const viewModel = viModel.getControlViewModel(graphId);
        const element = viewModel.element;
        const ocontext = element.graph.getPlaceholder().find('.flot-overlay')[0].getContext('2d');
        element.graph.hooks.drawOverlay.forEach(function (hook) {
            hook.apply(element.graph, [element.graph].concat([ocontext]));
        });
    };
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
        cursor1 = {
            label: 'cursor1',
            show: true,
            showLabel: false,
            showValue: false,
            targetShape: 'square',
            snapToPlot: undefined,
            crosshairStyle: 'both',
            x: 0.5,
            y: 0.5,
            fontSize: '16px',
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
            fontStyle: 'normal',
            niControlId: cursor1Id,
            kind: CursorModel.MODEL_KIND
        };
        cursor1Settings = {
            label: 'cursor2',
            show: false,
            showLabel: true,
            showValue: true,
            targetShape: 'ellipse',
            snapToPlot: -1,
            crosshairStyle: 'vertical',
            x: 0.2,
            y: 0.3,
            fontSize: '20px',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            fontStyle: 'italic'
        };
        cursor2ElementSettings = {
            'label': 'cursor2',
            show: false,
            'show-label': true,
            'show-value': true,
            style: '"color: #ff0000;"',
            'target-shape': 'ellipse',
            'snap-to-data': false,
            'crosshair-style': 'vertical',
            x: 0.2,
            y: 0.3,
            'ni-control-id': cursor2Id
        };
        graph1 = {
            niControlId: graphId,
            kind: CartesianGraphModel.MODEL_KIND,
            left: '100px',
            top: '200px',
            width: '300px',
            height: '400px'
        };
    });
    beforeEach(function (done) {
        webAppHelper.createNIElementHierarchy([
            { currentSettings: graph1 },
            { currentSettings: axis1, parentId: graphId },
            { currentSettings: axis2, parentId: graphId },
            { currentSettings: cursor1, parentId: graphId }
        ], done);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    afterEach(function () {
        webAppHelper.removeNIElement(graphId);
    });
    it('allows creation with default settings', function (done) {
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(graphId);
            expect(viewModel).toBeDefined();
        });
    });
    xit('is positioned according to x and y coordinates', function (done) {
        webAppHelper.createNIElement(graph1);
        webAppHelper.createNIElement(axis1, graphId);
        webAppHelper.createNIElement(axis2, graphId);
        webAppHelper.createNIElement(cursor1, graphId);
        testHelpers.runMultipleAsync(done, function () {
            forceCursorsUpdate();
        }, function () {
            const viewModel = viModel.getControlViewModel(graphId);
            const element = viewModel.element;
            const plot = $internalDoNotUse(element).data('chart');
            const cursor = plot.getCursors()[0];
            expect(cursor.x).toBe(plot.width() / 2);
            expect(cursor.y).toBe(plot.height() / 2);
            webAppHelper.removeNIElement(graphId);
        });
    });
    // TODO DE7872 gleon Test disabled. There's a race condition between requestAnimationFrame
    // and a setTimeOut inside jquery.flot
    xit('can be moved programatically', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            const model = viModel.getControlModel(cursor1Id);
            model.setMultipleProperties({ x: 0.25, y: 0.75 });
        }, function () {
            forceCursorsUpdate();
        }, function () {
            const viewModel = viModel.getControlViewModel(graphId);
            const element = viewModel.element;
            const plot = $internalDoNotUse(element).data('chart');
            const cursor = plot.getCursors()[0];
            expect(cursor.x).toBe(plot.width() * 0.25);
            expect(cursor.y).toBe(plot.height() * 0.75);
        }, function () {
            webAppHelper.removeNIElement(cursor1Id);
            webAppHelper.removeNIElement(axis2Id);
            webAppHelper.removeNIElement(axis1Id);
        });
    });
    it('triggers cursorUpdated events on changes', function (done) {
        let triggered = false;
        testHelpers.runMultipleAsync(done, function () {
            const viewModel = viModel.getControlViewModel(graphId);
            const element = viewModel.element;
            $internalDoNotUse(element).on('cursorUpdated', function (e, data) {
                triggered = true;
            });
            const model = viModel.getControlModel(cursor1Id);
            model.setMultipleProperties({ x: 0.25, y: 0.75 });
        }, function () {
            forceCursorsUpdate();
        }, function () {
            expect(triggered).toBe(true);
        });
    });
    // TODO DE7872 gleon Test disabled. There's a race condition between requestAnimationFrame
    // and a setTimeOut inside jquery.flot
    xit('the Model is updated when the cursor is moved', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            const viewModel = viModel.getControlViewModel(cursor1Id);
            const element = viewModel.element;
            element.x = 0.1234;
        }, function () {
            forceCursorsUpdate();
        }, function () {
            const model = viModel.getControlModel(cursor1Id);
            expect(model.x).toBe(0.1234);
        });
    });
    // TODO DE7872 mraj there is a race condition that causes this test to intermitently fail on chrome, firefox, and phantonjs when updating x and y
    // It appears if Chrome dev tools is open the issue does not appear
    xit('updates the Model when properties change.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            forceCursorsUpdate();
        }, function () {
            webAppHelper.dispatchMessage(cursor1Id, cursor1Settings);
        }, function () {
            const model = viModel.getControlModel(cursor1Id);
            Object.keys(cursor1Settings).forEach(function (key) {
                expect(model[key]).toBe(cursor1Settings[key]);
            });
        });
    });
    it('allows cursor element to be added directly to the page.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            const viewModel = viModel.getControlViewModel(graphId);
            const element = viewModel.element;
            webAppHelper.appendElement('ni-cursor', cursor2ElementSettings, element);
        }, function () {
            const model = viModel.getControlModel(cursor2Id);
            expect(model.label).toBe('cursor2');
            expect(model.show).toBe(false);
            expect(model.showValue).toBe(true);
            expect(model.color).toBe('rgb(255, 0, 0)');
            expect(model.targetShape).toBe('ellipse');
            expect(model.snapToPlot).toBe(undefined);
            expect(model.crosshairStyle).toBe('vertical');
            expect(model.x).toBe(0.2);
            expect(model.y).toBe(0.3);
        });
    });
});
//# sourceMappingURL=niCursorViewModel.Test.js.map