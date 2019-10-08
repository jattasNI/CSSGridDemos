//****************************************
// Tests for CartesianGraphViewModel class
// National Instruments Copyright 2014
//****************************************
import { CartesianPlotModel } from '../../Modeling/niCartesianPlotModel.js';
describe('A CartesianGraphViewModel', function () {
    'use strict';
    let viModel, frontPanelControls, graphModel;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    const NITypes = window.NITypes;
    const NIType = window.NIType;
    const NITypeNames = window.NITypeNames;
    let controlId, cartesianGraphSettings, cartesianGraphAxis1Settings, cartesianGraphAxis2Settings, cartesianGraphPlot1Settings, cartesianGraphPlot2Settings, cartesianGraphRenderer1Settings, cartesianGraphRenderer2Settings;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.cartesianGraphSettings.niControlId;
            cartesianGraphSettings = fixture.cartesianGraphSettings;
            cartesianGraphAxis1Settings = fixture.cartesianGraphAxis1Settings;
            cartesianGraphAxis2Settings = fixture.cartesianGraphAxis2Settings;
            cartesianGraphPlot1Settings = fixture.cartesianGraphPlot1Settings;
            cartesianGraphPlot2Settings = fixture.cartesianGraphPlot2Settings;
            cartesianGraphRenderer1Settings = fixture.cartesianGraphRenderer1Settings;
            cartesianGraphRenderer2Settings = fixture.cartesianGraphRenderer2Settings;
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
    describe('allows creation of graph ', function () {
        beforeEach(function () {
            webAppHelper.createNIElement(cartesianGraphSettings);
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('with default settings and no axes', function (done) {
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                graphModel = frontPanelControls[controlId];
                expect(graphModel).toBeDefined();
                const viewModel = viModel.getControlViewModel(controlId);
                expect(viewModel).toBeDefined();
            });
        });
        it('and can change the value of the graph', function (done) {
            const value1D = [7, 9, 30];
            const updateSettings = { value: value1D };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, updateSettings);
            }, function () {
                frontPanelControls = viModel.getAllControlModels();
                graphModel = frontPanelControls[controlId];
                expect(graphModel.value).toEqual(value1D);
            });
        });
    });
    describe('allows creation of graph with axes ', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: cartesianGraphSettings },
                { currentSettings: cartesianGraphAxis1Settings, parentId: controlId },
                { currentSettings: cartesianGraphAxis2Settings, parentId: controlId }
            ], done);
        });
        it('and then adding nested axes', function (done) {
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                graphModel = frontPanelControls[controlId];
                expect(graphModel).toBeDefined();
                const viewModel = viModel.getControlViewModel(controlId);
                const axis1ViewModel = viModel.getControlViewModel(cartesianGraphAxis1Settings.niControlId);
                const axis2ViewModel = viModel.getControlViewModel(cartesianGraphAxis2Settings.niControlId);
                expect(viewModel).toBeDefined();
                expect(axis1ViewModel).toBeDefined();
                expect(axis2ViewModel).toBeDefined();
                webAppHelper.removeNIElement(controlId);
            });
        });
        it('and allows removing of the nested axes', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.removeNIElement(cartesianGraphAxis1Settings.niControlId);
            }, function () {
                frontPanelControls = viModel.getAllControlModels();
                graphModel = frontPanelControls[controlId];
                expect(graphModel).toBeDefined();
                const viewModel = viModel.getControlViewModel(controlId);
                const axis1ViewModel = viModel.getControlViewModel(cartesianGraphAxis1Settings.niControlId);
                const axis2ViewModel = viModel.getControlViewModel(cartesianGraphAxis2Settings.niControlId);
                expect(viewModel).toBeDefined();
                expect(axis1ViewModel).not.toBeDefined();
                expect(axis2ViewModel).toBeDefined();
                webAppHelper.removeNIElement(controlId);
            });
        });
        it('and shows data with the default plot settings if a plot is not available', function (done) {
            const value1D = [7, 9, 30];
            const updateSettings = { value: value1D };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, updateSettings);
            }, function () {
                const graphElement = viModel.getControlViewModel(controlId).element;
                const series = graphElement.graph.getData();
                expect(series[0].lines.show).toBe(true);
                expect(series[0].points.show).toBe(false);
                expect(series[0].bars.show).toBe(false);
                expect(series[0].lines.lineWidth).toBe(1);
                expect(series[0].lines.fill).toBe(false);
            }, function () {
                webAppHelper.removeNIElement(controlId);
            });
        });
        it('and have data if the plot is not available', function (done) {
            const value1D = [7, 9, 30];
            const updateSettings = { value: value1D };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, updateSettings);
            }, function () {
                const graphElement = viModel.getControlViewModel(controlId).element;
                const series = graphElement.graph.getData();
                expect(series[0].data).toEqual(value1D);
            }, function () {
                webAppHelper.removeNIElement(controlId);
            });
        });
    });
    describe('allows different data formats in graph, ', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: cartesianGraphSettings },
                { currentSettings: cartesianGraphAxis1Settings, parentId: controlId },
                { currentSettings: cartesianGraphAxis2Settings, parentId: controlId }
            ], done);
        });
        it('works with an 1D numeric array', function (done) {
            const value1D = [7, 9, 30];
            const updateSettings = { value: value1D };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, updateSettings);
            }, function () {
                const graphElement = viModel.getControlViewModel(controlId).element;
                const series = graphElement.graph.getData();
                expect(series[0].data).toEqual(value1D);
                webAppHelper.removeNIElement(controlId);
            });
        });
        it('works with an 2D numeric array', function (done) {
            const value2D = [[3, 15, 24], [7, 9, 30]];
            const updateSettings = {
                value: value2D,
                niType: NITypes.DOUBLE.makeArray(2).toJSON()
            };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, updateSettings);
            }, function () {
                const graphElement = viModel.getControlViewModel(controlId).element;
                const series = graphElement.graph.getData();
                expect(series[0].data).toEqual(value2D[0]);
                expect(series[1].data).toEqual(value2D[1]);
                webAppHelper.removeNIElement(controlId);
            });
        });
        it('uses GraphDataPipeline to handle data format conversion', function (done) {
            const value1D = [7, 9, 30];
            const updateSettings = { value: value1D };
            const graphElement = document.querySelector('[ni-control-id="' + controlId + '"]');
            spyOn(NationalInstruments.HtmlVI.DataPipeline.GraphDataPipeline.prototype, 'toFlot').and.callThrough();
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, updateSettings);
            }, function () {
                expect(NationalInstruments.HtmlVI.DataPipeline.GraphDataPipeline.prototype.toFlot).toHaveBeenCalledWith(graphElement, value1D, NationalInstruments.HtmlVI.DataPipeline.DataTypesEnum.oneDimensionNumericArray);
                webAppHelper.removeNIElement(controlId);
            });
        });
    });
    describe('allows creation of graph with renderer ', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: cartesianGraphSettings },
                { currentSettings: cartesianGraphAxis1Settings, parentId: controlId },
                { currentSettings: cartesianGraphAxis2Settings, parentId: controlId },
                { currentSettings: cartesianGraphPlot1Settings, parentId: controlId },
                { currentSettings: cartesianGraphRenderer1Settings, parentId: cartesianGraphPlot1Settings.niControlId }
            ], done);
        });
        it('and won\'t have data if the plot is hidden', function (done) {
            const value1D = [7, 9, 30];
            const updateSettings = { value: value1D };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, updateSettings);
            }, function () {
                const graphElement = viModel.getControlViewModel(controlId).element;
                const series = graphElement.graph.getData();
                expect(series[0].data).toEqual([]);
            }, function () {
                webAppHelper.removeNIElement(controlId);
            });
        });
    });
    describe('allows creation of graph with two renderers ', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: cartesianGraphSettings },
                { currentSettings: cartesianGraphAxis1Settings, parentId: controlId },
                { currentSettings: cartesianGraphAxis2Settings, parentId: controlId },
                { currentSettings: cartesianGraphPlot1Settings, parentId: controlId },
                { currentSettings: cartesianGraphRenderer1Settings, parentId: cartesianGraphPlot1Settings.niControlId },
                { currentSettings: cartesianGraphPlot2Settings, parentId: controlId },
                { currentSettings: cartesianGraphRenderer2Settings, parentId: cartesianGraphPlot2Settings.niControlId }
            ], done);
        });
        it('and have only the visible data if one plot is hidden', function (done) {
            const value2D = [[3, 15, 24], [7, 9, 30]];
            const updateSettings = {
                value: value2D,
                niType: NITypes.DOUBLE.makeArray(2).toJSON()
            };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, updateSettings);
            }, function () {
                const graphElement = viModel.getControlViewModel(controlId).element;
                const series = graphElement.graph.getData();
                expect(series[0].data).toEqual([]);
                expect(series[1].data).toEqual(value2D[1]);
            }, function () {
                webAppHelper.removeNIElement(controlId);
            });
        });
    });
    describe('allows setting plot names through metadata ', function () {
        let channelNames, waveformArray, updateSettings;
        beforeAll(function () {
            channelNames = ['Channel 0', 'Channel 1'];
            waveformArray = [
                new window.NIAnalogWaveform({
                    Y: [3, 15, 24],
                    dt: 1,
                    channelName: channelNames[0]
                }),
                new window.NIAnalogWaveform({
                    Y: [7, 9, 30],
                    dt: 1,
                    channelName: channelNames[1]
                })
            ];
            updateSettings = {
                value: waveformArray,
                niType: new NIType({
                    name: NITypeNames.ANALOGWAVEFORM,
                    subtype: NITypeNames.DOUBLE
                }).makeArray(1).toJSON()
            };
        });
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: cartesianGraphSettings },
                { currentSettings: cartesianGraphAxis1Settings, parentId: controlId },
                { currentSettings: cartesianGraphAxis2Settings, parentId: controlId },
                { currentSettings: cartesianGraphPlot1Settings, parentId: controlId },
                { currentSettings: cartesianGraphRenderer1Settings, parentId: cartesianGraphPlot1Settings.niControlId }
            ], done);
        });
        it('and overrides existing plot names when metadataOverridesPlotNames is true', function (done) {
            webAppHelper.dispatchMessage(controlId, {
                metadataOverridesPlotNames: true
            });
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, updateSettings);
            }, function () {
                frontPanelControls = viModel.getAllControlModels();
                graphModel = frontPanelControls[controlId];
                const plotModels = graphModel.childModels.filter(x => (x instanceof CartesianPlotModel));
                const graphElement = viModel.getControlViewModel(controlId).element;
                const plotElements = graphElement.querySelectorAll('ni-cartesian-plot');
                expect(plotElements[0].label).toEqual(channelNames[0]);
                expect(plotModels[0].label).toEqual(channelNames[0]);
                expect(plotElements[1].label).toEqual(channelNames[1]);
                expect(plotModels[1].label).toEqual(channelNames[1]);
            }, function () {
                webAppHelper.removeNIElement(controlId);
            });
        });
        it('and does not override existing plot names when metadataOverridesPlotNames is false', function (done) {
            webAppHelper.dispatchMessage(controlId, {
                metadataOverridesPlotNames: false
            });
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, updateSettings);
            }, function () {
                frontPanelControls = viModel.getAllControlModels();
                graphModel = frontPanelControls[controlId];
                const plotModels = graphModel.childModels.filter(x => (x instanceof CartesianPlotModel));
                const graphElement = viModel.getControlViewModel(controlId).element;
                const plotElements = graphElement.querySelectorAll('ni-cartesian-plot');
                expect(plotElements[0].label).toEqual("Plot 1");
                expect(plotModels[0].label).toEqual("Plot 1");
                expect(plotElements[1].label).toEqual(channelNames[1]);
                expect(plotModels[1].label).toEqual(channelNames[1]);
            }, function () {
                webAppHelper.removeNIElement(controlId);
            });
        });
    });
});
//# sourceMappingURL=niCartesianGraphViewModel.Test.js.map