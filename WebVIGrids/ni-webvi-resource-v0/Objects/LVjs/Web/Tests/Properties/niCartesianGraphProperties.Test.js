//****************************************
// G Property Tests for CartesianGraphModel class
// National Instruments Copyright 2018
//****************************************
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A CartesianGraph control', function () {
    'use strict';
    let updateService, viModel, frontPanelControls, graphModel, viewModel, graphElement, analogWaveformType, analogWaveform1DArrayType;
    let graphTools, cursorLegend, plotLegend, scaleLegend, graphLabel;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    const NIType = window.NIType;
    const NITypeNames = window.NITypeNames;
    let cartesianGraphSettings, cartesianGraphLabelSettings, plotLegendSettings, graphToolsSettings, cursorLegendSettings, scaleLegendSettings;
    let graphId, graphLabelId, graphToolsId, cursorLegendId, plotLegendId, scaleLegendId;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            graphId = fixture.cartesianGraphSettings2.niControlId;
            graphLabelId = fixture.cartesianGraphLabelSettings2.niControlId;
            graphToolsId = fixture.graphToolsSettings.niControlId;
            cursorLegendId = fixture.cursorLegendSettings.niControlId;
            plotLegendId = fixture.plotLegendSettings.niControlId;
            scaleLegendId = fixture.scaleLegendSettings.niControlId;
            cartesianGraphSettings = fixture.cartesianGraphSettings2;
            cartesianGraphLabelSettings = fixture.cartesianGraphLabelSettings2;
            cartesianGraphSettings.labelId = graphLabelId;
            plotLegendSettings = fixture.plotLegendSettings;
            graphToolsSettings = fixture.graphToolsSettings;
            cursorLegendSettings = fixture.cursorLegendSettings;
            scaleLegendSettings = fixture.scaleLegendSettings;
            plotLegendSettings.graphRef = graphId;
            cursorLegendSettings.graphRef = graphId;
            graphToolsSettings.graphRef = graphId;
            scaleLegendSettings.graphRef = graphId;
            cartesianGraphSettings.followerIds = [];
            cartesianGraphSettings.followerIds.push(graphLabelId);
            cartesianGraphSettings.followerIds.push(plotLegendSettings.niControlId);
            cartesianGraphSettings.followerIds.push(cursorLegendSettings.niControlId);
            cartesianGraphSettings.followerIds.push(scaleLegendSettings.niControlId);
            cartesianGraphSettings.followerIds.push(graphToolsSettings.niControlId);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    beforeEach(function (done) {
        Object.freeze(cartesianGraphSettings);
        webAppHelper.createNIElement(cartesianGraphSettings);
        plotLegend = webAppHelper.createNIElement(plotLegendSettings);
        graphTools = webAppHelper.createNIElement(graphToolsSettings);
        cursorLegend = webAppHelper.createNIElement(cursorLegendSettings);
        scaleLegend = webAppHelper.createNIElement(scaleLegendSettings);
        graphLabel = webAppHelper.createNIElement(cartesianGraphLabelSettings);
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            frontPanelControls = viModel.getAllControlModels();
            graphModel = frontPanelControls[graphId];
            viewModel = viModel.getControlViewModel(graphId);
            graphElement = viewModel.element;
        });
    });
    afterEach(function () {
        webAppHelper.removeNIElement(graphLabelId);
        webAppHelper.removeNIElement(graphToolsId);
        webAppHelper.removeNIElement(cursorLegendId);
        webAppHelper.removeNIElement(plotLegendId);
        webAppHelper.removeNIElement(scaleLegendId);
        webAppHelper.removeNIElement(graphId);
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
    // Actual tests
    it('property read for Value returns the current value.', function () {
        const currentValue = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
        expect(currentValue).toEqual(cartesianGraphSettings.value);
    });
    it('property set for Value updates model for 1D array.', function (done) {
        makeAsync(done, async function () {
            const newValue = [4, 5, 6];
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(graphModel.value).toEqual(newValue);
        });
    });
    it('property set for Value updates control element for 2D array.', function (done) {
        const newValue = [[1, 4], [2, 3]];
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(graphModel.value).toEqual(newValue);
            await testHelpers.waitAsync();
            const series = graphElement.graph.getData();
            expect(series[0].data).toEqual(newValue);
        });
    });
    it('property set for Value does not call controlChanged function of updateService', function (done) {
        makeAsync(done, async function () {
            const newValue = [7, 8, 9];
            await testHelpers.waitAsync();
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).not.toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling calls controlChanged function of updateService with correct arguments', function (done) {
        makeAsync(done, async function () {
            const newValue = [7, 8, 9];
            await testHelpers.waitAsync();
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, graphModel, 'value', newValue, cartesianGraphSettings.value);
        });
    });
    it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
        makeAsync(done, async function () {
            const newValue = cartesianGraphSettings.value;
            await testHelpers.waitAsync();
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling updates model for 1D array.', function (done) {
        makeAsync(done, async function () {
            const newValue = [4, 5, 6];
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(graphModel.value).toEqual(newValue);
        });
    });
    it('property set for valueSignaling updates control element for 2D array.', function (done) {
        makeAsync(done, async function () {
            const newValue = [[1, 4], [2, 3]];
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(graphModel.value).toEqual(newValue);
            await testHelpers.waitAsync();
            const series = graphElement.graph.getData();
            expect(series[0].data).toEqual(newValue);
        });
    });
    it('property set for Value updates control element of analogWaveform type .', function (done) {
        makeAsync(done, async function () {
            const newValue = { "Y": [7, 8, 9], t0: "0:0", "dt": 1 };
            analogWaveformType = new NIType({
                name: NITypeNames.ANALOGWAVEFORM,
                subtype: NITypeNames.DOUBLE
            }).toJSON();
            await testHelpers.waitAsync();
            graphModel.setMultipleProperties({ niType: analogWaveformType });
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(graphModel.value).toEqual(newValue);
            await testHelpers.waitAsync();
            const series = graphElement.graph.getData();
            expect(series[0].data).toEqual(newValue.Y);
        });
    });
    it('property set for Value updates control element of analogWaveform1DArray type.', function (done) {
        makeAsync(done, async function () {
            const newValue = [{ "Y": [7, 8, 9], t0: "0:0", "dt": 1 },
                { "Y": [17, 18, 19, 20, 21], t0: "0:0", "dt": 1 },
                { "Y": [2], t0: "0:0", "dt": 1 }];
            analogWaveform1DArrayType = (new NIType({
                name: NITypeNames.ANALOGWAVEFORM,
                subtype: NITypeNames.DOUBLE
            }).makeArray(1)).toJSON();
            await testHelpers.waitAsync();
            graphModel.setMultipleProperties({ niType: analogWaveform1DArrayType });
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(graphModel.value).toEqual(newValue);
            await testHelpers.waitAsync();
            const series = graphElement.graph.getData();
            newValue.forEach(function (val, index) {
                expect(series[index].data).toEqual(val.Y);
            });
        });
    });
    it('property set for valueSignaling updates control element of analogWaveform type .', function (done) {
        const newValue = { "Y": [7, 8, 9], t0: "0:0", "dt": 1 };
        analogWaveformType = new NIType({
            name: NITypeNames.ANALOGWAVEFORM,
            subtype: NITypeNames.DOUBLE
        }).toJSON();
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            graphModel.setMultipleProperties({ niType: analogWaveformType });
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(graphModel.value).toEqual(newValue);
            await testHelpers.waitAsync();
            const series = graphElement.graph.getData();
            expect(series[0].data).toEqual(newValue.Y);
        });
    });
    it('property set for valueSignaling updates control element of analogWaveform1DArray type.', function (done) {
        makeAsync(done, async function () {
            const newValue = [{ "Y": [7, 8, 9], t0: "0:0", "dt": 1 },
                { "Y": [17, 18, 19, 20, 21], t0: "0:0", "dt": 1 },
                { "Y": [2], t0: "0:0", "dt": 1 }];
            analogWaveform1DArrayType = (new NIType({
                name: NITypeNames.ANALOGWAVEFORM,
                subtype: NITypeNames.DOUBLE
            }).makeArray(1)).toJSON();
            await testHelpers.waitAsync();
            graphModel.setMultipleProperties({ niType: analogWaveform1DArrayType });
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(graphModel.value).toEqual(newValue);
            await testHelpers.waitAsync();
            const series = graphElement.graph.getData();
            newValue.forEach(function (val, index) {
                expect(series[index].data).toEqual(val.Y);
            });
        });
    });
    it('property set for Disabled updates the graph and all the tools and legends.', function (done) {
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            expect(graphElement.disabled).toBe(false);
            expect(graphTools.disabled).toBe(false);
            expect(cursorLegend.disabled).toBe(false);
            expect(plotLegend.disabled).toBe(false);
            expect(scaleLegend.disabled).toBe(false);
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME, true);
            await testHelpers.waitAsync();
            expect(graphElement.disabled).toBe(true);
            expect(graphTools.disabled).toBe(true);
            expect(cursorLegend.disabled).toBe(true);
            expect(plotLegend.disabled).toBe(true);
            expect(scaleLegend.disabled).toBe(true);
        });
    });
    it('property set for visible false updates the graph and all the tools and legend.', function (done) {
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            expect(graphElement.classList.contains('ni-hidden')).toEqual(false);
            expect(graphLabel.classList.contains('ni-owning-control-hidden')).toEqual(false);
            expect(graphTools.classList.contains('ni-owning-control-hidden')).toEqual(false);
            expect(cursorLegend.classList.contains('ni-owning-control-hidden')).toEqual(false);
            expect(plotLegend.classList.contains('ni-owning-control-hidden')).toEqual(false);
            expect(scaleLegend.classList.contains('ni-owning-control-hidden')).toEqual(false);
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, false);
            await testHelpers.waitAsync();
            expect(graphElement.classList.contains('ni-hidden')).toEqual(true);
            expect(graphLabel.classList.contains('ni-owning-control-hidden')).toEqual(true);
            expect(graphTools.classList.contains('ni-owning-control-hidden')).toEqual(true);
            expect(cursorLegend.classList.contains('ni-owning-control-hidden')).toEqual(true);
            expect(plotLegend.classList.contains('ni-owning-control-hidden')).toEqual(true);
            expect(scaleLegend.classList.contains('ni-owning-control-hidden')).toEqual(true);
        });
    });
    it('property set for graph visible off with graph tools and legends visible on, and then graph visible on.', function (done) {
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, false);
            await testHelpers.waitAsync();
            expect(graphElement.classList.contains('ni-hidden')).toEqual(true);
            expect(graphLabel.classList.contains('ni-hidden')).toEqual(false);
            expect(graphTools.classList.contains('ni-hidden')).toEqual(false);
            expect(cursorLegend.classList.contains('ni-hidden')).toEqual(false);
            expect(plotLegend.classList.contains('ni-hidden')).toEqual(false);
            expect(scaleLegend.classList.contains('ni-hidden')).toEqual(false);
            expect(graphLabel.classList.contains('ni-owning-control-hidden')).toEqual(true);
            expect(graphTools.classList.contains('ni-owning-control-hidden')).toEqual(true);
            expect(cursorLegend.classList.contains('ni-owning-control-hidden')).toEqual(true);
            expect(plotLegend.classList.contains('ni-owning-control-hidden')).toEqual(true);
            expect(scaleLegend.classList.contains('ni-owning-control-hidden')).toEqual(true);
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, true);
            await testHelpers.waitAsync();
            expect(graphElement.classList.contains('ni-hidden')).toEqual(false);
            expect(graphLabel.classList.contains('ni-hidden')).toEqual(false);
            expect(graphTools.classList.contains('ni-hidden')).toEqual(false);
            expect(cursorLegend.classList.contains('ni-hidden')).toEqual(false);
            expect(plotLegend.classList.contains('ni-hidden')).toEqual(false);
            expect(scaleLegend.classList.contains('ni-hidden')).toEqual(false);
            expect(graphTools.classList.contains('ni-owning-control-hidden')).toEqual(false);
            expect(cursorLegend.classList.contains('ni-owning-control-hidden')).toEqual(false);
            expect(plotLegend.classList.contains('ni-owning-control-hidden')).toEqual(false);
            expect(scaleLegend.classList.contains('ni-owning-control-hidden')).toEqual(false);
        });
    });
    it('property set for graph visible off with graph tools and legends hidden, and then graph visible on.', function (done) {
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            for (const key in graphModel.owner.controlModels) {
                const controlModel = viModel.controlModels[key];
                if (controlModel.niControlId !== 'CartesianGraphModelId') {
                    controlModel.visible = false;
                }
            }
            viewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, false);
            await testHelpers.waitAsync();
            expect(graphElement.classList.contains('ni-hidden')).toEqual(true);
            expect(graphLabel.classList.contains('ni-hidden')).toEqual(true);
            expect(graphTools.classList.contains('ni-hidden')).toEqual(true);
            expect(cursorLegend.classList.contains('ni-hidden')).toEqual(true);
            expect(plotLegend.classList.contains('ni-hidden')).toEqual(true);
            expect(scaleLegend.classList.contains('ni-hidden')).toEqual(true);
            expect(graphLabel.classList.contains('ni-owning-control-hidden')).toEqual(true);
            expect(graphTools.classList.contains('ni-owning-control-hidden')).toEqual(true);
            expect(cursorLegend.classList.contains('ni-owning-control-hidden')).toEqual(true);
            expect(plotLegend.classList.contains('ni-owning-control-hidden')).toEqual(true);
            expect(scaleLegend.classList.contains('ni-owning-control-hidden')).toEqual(true);
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, true);
            await testHelpers.waitAsync();
            expect(graphElement.classList.contains('ni-hidden')).toEqual(false);
            expect(graphLabel.classList.contains('ni-hidden')).toEqual(true);
            expect(graphTools.classList.contains('ni-hidden')).toEqual(true);
            expect(cursorLegend.classList.contains('ni-hidden')).toEqual(true);
            expect(plotLegend.classList.contains('ni-hidden')).toEqual(true);
            expect(scaleLegend.classList.contains('ni-hidden')).toEqual(true);
            expect(graphLabel.classList.contains('ni-owning-control-hidden')).toEqual(false);
            expect(graphTools.classList.contains('ni-owning-control-hidden')).toEqual(false);
            expect(cursorLegend.classList.contains('ni-owning-control-hidden')).toEqual(false);
            expect(plotLegend.classList.contains('ni-owning-control-hidden')).toEqual(false);
            expect(scaleLegend.classList.contains('ni-owning-control-hidden')).toEqual(false);
        });
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(cartesianGraphSettings.left),
            "Top": parseInt(cartesianGraphSettings.top)
        };
        expect(position).toEqual(expectedPosition);
    });
    it('property get for TotalBounds gets the total bounds of the control.', function (done) {
        makeAsync(done, async function () {
            const expectedBounds = {
                Left: 90,
                Top: 90,
                Width: 800,
                Height: 510
            };
            const totalBounds = await viewModel.getGPropertyValue(VisualModel.TOTAL_BOUNDS_G_PROPERTY_NAME);
            expect(totalBounds.Left).toBe(expectedBounds.Left);
            expect(totalBounds.Top).toBe(expectedBounds.Top);
            expect(totalBounds.Width).toBe(expectedBounds.Width);
            expect(totalBounds.Height).toBe(expectedBounds.Height);
        });
    });
    it('property get for TotalBounds does not include hidden cursor legend follower.', function (done) {
        makeAsync(done, async function () {
            const expectedBounds = {
                Left: 100,
                Top: 200,
                Width: 320,
                Height: 400
            };
            const cursorLegendViewModel = viModel.getControlViewModel(cursorLegendId);
            await testHelpers.waitAsync();
            cursorLegendViewModel.model.visible = false;
            await testHelpers.waitAsync();
            const totalBounds = await viewModel.getGPropertyValue(VisualModel.TOTAL_BOUNDS_G_PROPERTY_NAME);
            expect(totalBounds.Left).toBe(expectedBounds.Left);
            expect(totalBounds.Top).toBe(expectedBounds.Top);
            expect(totalBounds.Width).toBe(expectedBounds.Width);
            expect(totalBounds.Height).toBe(expectedBounds.Height);
        });
    });
    it('property set for Position updates model.', function (done) {
        makeAsync(done, async function () {
            const newPosition = { Left: 105, Top: 205 };
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
            expect(parseInt(graphModel.left)).toEqual(newPosition.Left);
            expect(parseInt(graphModel.top)).toEqual(newPosition.Top);
        });
    });
    it('property set for Position updates control element.', function (done) {
        makeAsync(done, async function () {
            const newPosition = { Left: 155, Top: 255 };
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
            await testHelpers.waitAsync();
            const computedStyle = window.getComputedStyle(graphElement);
            expect(parseInt(computedStyle.left)).toEqual(newPosition.Left);
            expect(parseInt(computedStyle.top)).toEqual(newPosition.Top);
        });
    });
    it('property set for Position updates its followers', function (done) {
        makeAsync(done, async function () {
            const plotLegendViewModel = viModel.getControlViewModel(plotLegendId);
            const cursorLegendViewModel = viModel.getControlViewModel(cursorLegendId);
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, { Left: 200, Top: 250 });
            await testHelpers.waitAsync();
            const oldPlotLegendPosition = plotLegendViewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
            const oldCursorLegendPosition = cursorLegendViewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
            const oldGraphPosition = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, { Left: 250, Top: 300 });
            await testHelpers.waitAsync();
            const newPlotLegendPosition = plotLegendViewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
            const newCursorLegendPosition = cursorLegendViewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
            const newGraphPosition = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
            const graphPositionDifference = {
                Left: newGraphPosition.Left - oldGraphPosition.Left,
                Top: newGraphPosition.Top - oldGraphPosition.Top
            };
            const plotLegendPositionDifference = {
                Left: newPlotLegendPosition.Left - oldPlotLegendPosition.Left,
                Top: newPlotLegendPosition.Top - oldPlotLegendPosition.Top
            };
            const cursorLegendPositionDifference = {
                Left: newCursorLegendPosition.Left - oldCursorLegendPosition.Left,
                Top: newCursorLegendPosition.Top - oldCursorLegendPosition.Top
            };
            expect(graphPositionDifference).toEqual(plotLegendPositionDifference);
            expect(graphPositionDifference).toEqual(cursorLegendPositionDifference);
        });
    });
});
//# sourceMappingURL=niCartesianGraphProperties.Test.js.map