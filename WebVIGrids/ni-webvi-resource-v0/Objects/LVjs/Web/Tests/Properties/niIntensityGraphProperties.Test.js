//****************************************
// G Property Tests for IntensityGraphModel class
// National Instruments Copyright 2018
//****************************************
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A IntensityGraph control', function () {
    'use strict';
    let updateService, viModel, frontPanelControls, graphModel, viewModel, graphElement;
    let graphTools, cursorLegend, plotLegend, scaleLegend;
    let intensityGraphSettings, plotLegendSettings, graphToolsSettings, cursorLegendSettings, scaleLegendSettings;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let graphId, graphToolsId, cursorLegendId, plotLegendId, scaleLegendId;
    const value1 = [
        [0, 0, 0, 0],
        [3, 4, 5, 6],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    const value2 = [
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [3, 4, 5, 6]
    ];
    const value3 = [
        [11, 12, 14, 15],
        [10, 18, 17, 16],
        [1, 1, 1, 1],
        [3, 4, 5, 6]
    ];
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            graphId = fixture.intensityGraphSettings2.niControlId;
            graphToolsId = fixture.graphToolsSettings.niControlId;
            cursorLegendId = fixture.cursorLegendSettings.niControlId;
            plotLegendId = fixture.plotLegendSettings.niControlId;
            scaleLegendId = fixture.scaleLegendSettings.niControlId;
            intensityGraphSettings = fixture.intensityGraphSettings2;
            plotLegendSettings = fixture.plotLegendSettings;
            graphToolsSettings = fixture.graphToolsSettings;
            cursorLegendSettings = fixture.cursorLegendSettings;
            scaleLegendSettings = fixture.scaleLegendSettings;
            plotLegendSettings.graphRef = graphId;
            cursorLegendSettings.graphRef = graphId;
            graphToolsSettings.graphRef = graphId;
            scaleLegendSettings.graphRef = graphId;
            Object.freeze(intensityGraphSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    beforeEach(function (done) {
        webAppHelper.createNIElement(intensityGraphSettings);
        plotLegend = webAppHelper.createNIElement(plotLegendSettings);
        graphTools = webAppHelper.createNIElement(graphToolsSettings);
        cursorLegend = webAppHelper.createNIElement(cursorLegendSettings);
        scaleLegend = webAppHelper.createNIElement(scaleLegendSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            graphModel = frontPanelControls[graphId];
            viewModel = viModel.getControlViewModel(graphId);
            graphElement = viewModel.element;
        });
    });
    afterEach(function () {
        webAppHelper.removeNIElement(graphId);
        webAppHelper.removeNIElement(graphToolsId);
        webAppHelper.removeNIElement(cursorLegendId);
        webAppHelper.removeNIElement(plotLegendId);
        webAppHelper.removeNIElement(scaleLegendId);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('property read for Value returns the current value.', function () {
        graphModel.setMultipleProperties({ value: value1 });
        const items = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
        expect(items).toEqual(value1);
    });
    it('property set for Value updates model.', function (done) {
        const newValue = value2;
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(graphModel.value).toEqual(newValue);
        });
    });
    it('property set for Value updates control element.', function (done) {
        const newValue = value3;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(graphModel.value).toEqual(newValue);
        }, function () {
            const series = graphElement.graph.getData();
            expect(series[0].data).toEqual(newValue);
        });
    });
    it('property set for Value does not call controlChanged function of updateService', function (done) {
        const newValue = value2;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).not.toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling calls controlChanged function of updateService with correct arguments', function (done) {
        const newValue = value2;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, graphModel, 'value', newValue, intensityGraphSettings.value);
        });
    });
    it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
        const newValue = intensityGraphSettings.value;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling updates model.', function (done) {
        const newValue = value2;
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(graphModel.value).toEqual(newValue);
        });
    });
    it('property set for valueSignaling updates control element.', function (done) {
        const newValue = value3;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(graphModel.value).toEqual(newValue);
        }, function () {
            const series = graphElement.graph.getData();
            expect(series[0].data).toEqual(newValue);
        });
    });
    it('property set for Disabled updates the graph and all the tools and legends.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            expect(graphElement.disabled).toBe(false);
            expect(graphTools.disabled).toBe(false);
            expect(cursorLegend.disabled).toBe(false);
            expect(plotLegend.disabled).toBe(false);
            expect(scaleLegend.disabled).toBe(false);
        }, function () {
            viewModel.setGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME, true);
        }, function () {
            expect(graphElement.disabled).toBe(true);
            expect(graphTools.disabled).toBe(true);
            expect(cursorLegend.disabled).toBe(true);
            expect(plotLegend.disabled).toBe(true);
            expect(scaleLegend.disabled).toBe(true);
        });
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(intensityGraphSettings.left),
            "Top": parseInt(intensityGraphSettings.top)
        };
        expect(position).toEqual(expectedPosition);
    });
    it('property set for Position updates model.', function (done) {
        const newPosition = { Left: 100, Top: 200 };
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
            expect(parseInt(graphModel.left)).toEqual(newPosition.Left);
            expect(parseInt(graphModel.top)).toEqual(newPosition.Top);
        });
    });
    it('property set for Position updates control element.', function (done) {
        const newPosition = { Left: 150, Top: 250 };
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
        }, function () {
            const computedStyle = window.getComputedStyle(graphElement);
            expect(parseInt(computedStyle.left)).toEqual(newPosition.Left);
            expect(parseInt(computedStyle.top)).toEqual(newPosition.Top);
        });
    });
});
//# sourceMappingURL=niIntensityGraphProperties.Test.js.map