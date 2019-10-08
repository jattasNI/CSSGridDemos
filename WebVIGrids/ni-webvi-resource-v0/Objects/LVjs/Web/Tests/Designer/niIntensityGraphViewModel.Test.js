//****************************************
// Tests for BooleangraphModel class
// National Instruments Copyright 2014
//****************************************
import { IntensityGraphModel } from '../../Modeling/niIntensityGraphModel.js';
describe('A IntensityGraphViewModel', function () {
    'use strict';
    let controlId;
    let intensityGraphAxis1Settings, intensityGraphAxis2Settings, intensityGraphAxis3Settings;
    let viModel, frontPanelControls, graphModel, intensityGraphSettings;
    const value1 = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    const value2 = [
        [2, 2, 2, 2],
        [2, 2, 2, 2],
        [2, 2, 2, 2],
        [2, 2, 2, 2]
    ];
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.intensityGraphSettings.niControlId;
            intensityGraphAxis1Settings = fixture.intensityGraphAxis1Settings;
            intensityGraphAxis2Settings = fixture.intensityGraphAxis2Settings;
            intensityGraphAxis3Settings = fixture.intensityGraphAxis3Settings;
            intensityGraphSettings = fixture.intensityGraphSettings;
            Object.freeze(intensityGraphAxis1Settings);
            Object.freeze(intensityGraphAxis2Settings);
            Object.freeze(intensityGraphAxis3Settings);
            Object.freeze(intensityGraphSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('allows creation of graph with default intensityGraphSettings and no axes', function (done) {
        webAppHelper.createNIElement({
            niControlId: controlId,
            kind: IntensityGraphModel.MODEL_KIND,
            left: '270px',
            top: '150px',
            width: '750px',
            height: '300px',
            visible: true
        });
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            graphModel = frontPanelControls[controlId];
            expect(graphModel).toBeDefined();
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('allows to call the ModelPropertyChanged method with a property update', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.createNIElement({
                niControlId: controlId,
                kind: IntensityGraphModel.MODEL_KIND,
                left: '270px',
                top: '150px',
                width: '750px',
                height: '300px',
                visible: true
            });
        }, function () {
            frontPanelControls = viModel.getAllControlModels();
            graphModel = frontPanelControls[controlId];
            expect(graphModel).toBeDefined();
            graphModel.setMultipleProperties({ value: value1 });
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            graphModel.setMultipleProperties(intensityGraphSettings);
        }, function () {
            webAppHelper.removeNIElement(controlId);
        });
    });
    it('allows creation of full graph', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.createNIElement({
                niControlId: controlId,
                kind: IntensityGraphModel.MODEL_KIND,
                left: '270px',
                top: '150px',
                width: '750px',
                height: '300px',
                visible: true
            });
        }, function () {
            webAppHelper.createNIElement(intensityGraphAxis1Settings, controlId);
            webAppHelper.createNIElement(intensityGraphAxis2Settings, controlId);
            webAppHelper.createNIElement(intensityGraphAxis3Settings, controlId);
        }, function () {
            frontPanelControls = viModel.getAllControlModels();
            graphModel = frontPanelControls[controlId];
            expect(graphModel).toBeDefined();
            graphModel.setMultipleProperties({ value: value2 });
            const viewModel = viModel.getControlViewModel(controlId);
            const axis1ViewModel = viModel.getControlViewModel(intensityGraphAxis1Settings.niControlId);
            const axis2ViewModel = viModel.getControlViewModel(intensityGraphAxis2Settings.niControlId);
            const axis3ViewModel = viModel.getControlViewModel(intensityGraphAxis3Settings.niControlId);
            const element = viewModel.element;
            const axisX = $(element).find('.flot-x-axis');
            expect(axisX).toBeDefined();
            //CSS class .flot-tick-label is missing for some reason
            let tickLabels = axisX[0].childNodes;
            expect(tickLabels.length).toBe(11);
            const axisY = $(element).find('.flot-y-axis');
            expect(axisY).toBeDefined();
            //CSS class .flot-tick-label is missing for some reason
            tickLabels = axisY[0].childNodes;
            expect(tickLabels.length).toBeGreaterThan(2);
            expect(viewModel).toBeDefined();
            expect(axis1ViewModel).toBeDefined();
            expect(axis2ViewModel).toBeDefined();
            expect(axis3ViewModel).toBeDefined();
        }, function () {
            webAppHelper.removeNIElement(intensityGraphAxis1Settings.niControlId);
            webAppHelper.removeNIElement(intensityGraphAxis2Settings.niControlId);
            webAppHelper.removeNIElement(intensityGraphAxis3Settings.niControlId);
        }, function () {
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('allows creation with multiple axis ', function () {
        const intensityGraph = {
            niControlId: 'Function1',
            kind: IntensityGraphModel.MODEL_KIND,
            left: '270px',
            top: '150px',
            width: '750px',
            height: '300px',
            visible: true
        };
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: intensityGraph },
                { currentSettings: intensityGraphAxis1Settings, parentId: intensityGraph.niControlId },
                { currentSettings: intensityGraphAxis2Settings, parentId: intensityGraph.niControlId },
                { currentSettings: intensityGraphAxis3Settings, parentId: intensityGraph.niControlId }
            ], done);
        });
        beforeEach(function (done) {
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(intensityGraphAxis1Settings.niControlId, { autoScale: 'auto' }); // exact
            }, function () {
                webAppHelper.dispatchMessage(intensityGraphAxis2Settings.niControlId, { autoScale: 'auto' }); // exact
            }, function () {
                webAppHelper.dispatchMessage(intensityGraphAxis3Settings.niControlId, { autoScale: 'auto' }); // none
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('and allows autoscaling of data', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                graphModel = frontPanelControls[controlId];
                graphModel.setMultipleProperties({ value: value2 });
            }, function () {
                const axis1ViewModel = viModel.getControlViewModel(intensityGraphAxis1Settings.niControlId), axis2ViewModel = viModel.getControlViewModel(intensityGraphAxis2Settings.niControlId), axis3ViewModel = viModel.getControlViewModel(intensityGraphAxis3Settings.niControlId);
                const axis1Min = axis1ViewModel.element.getFlotAxis().min, axis1Max = axis1ViewModel.element.getFlotAxis().max, axis2Min = axis2ViewModel.element.getFlotAxis().min, axis2Max = axis2ViewModel.element.getFlotAxis().max, axis3Min = axis3ViewModel.element.getFlotAxis().min, axis3Max = axis3ViewModel.element.getFlotAxis().max;
                expect(axis1Min).toBe(0);
                expect(axis1Max).toBe(4);
                expect(axis2Min).toBe(0);
                expect(axis2Max).toBe(4);
                expect(axis3Min).toBe(0);
                expect(axis3Max).toBe(100);
            });
        });
    });
});
//# sourceMappingURL=niIntensityGraphViewModel.Test.js.map