//****************************************
// Tests for the ChartViewModel class
// National Instruments Copyright 2014
//****************************************
import { CartesianAxisModel } from "../../Modeling/niCartesianAxisModel.js";
import { ChartModel } from "../../Modeling/niChartModel.js";
describe('A ChartViewModel', function () {
    'use strict';
    const chartId = 'Function1';
    let axis1, axis2, chart, chartElementSettings;
    const axis1Id = 'Function13', axis2Id = 'Function12';
    let viModel, frontPanelControls, chartModel, chartElement, chartSettings;
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
        chart = {
            niControlId: chartId,
            kind: ChartModel.MODEL_KIND,
            left: '270px',
            top: '150px',
            width: '750px',
            height: '300px',
            visible: true,
            niType: { name: 'Array', rank: 1, subtype: { name: 'Double' } }
        };
        chartSettings = {
            niControlId: chartId,
            left: '100px',
            top: '200px',
            width: '300px',
            height: '400px',
            visible: true
        };
        chartElementSettings = {
            'ni-control-id': chartId,
            'buffer-size': 123,
            style: '"left: 100px; top: 200px; width: 300px; height: 400px;"',
            'ni-type': '{&quot;name&quot;:&quot;Double&quot;}',
            visible: true
        };
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('allows creation with default chartSettings', function (done) {
        chartElement = webAppHelper.createNIElement(chart);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            expect(chartModel).toBeDefined();
            const viewModel = viModel.getControlViewModel(chartId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(chartId);
        });
    });
    it('allows to call the setMultipleProperties method with a property update', function (done) {
        chart.visible = undefined;
        chartElement = webAppHelper.createNIElement(chart);
        testHelpers.runMultipleAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            expect(chartModel).toBeDefined();
            const viewModel = viModel.getControlViewModel(chartId);
            expect(viewModel).toBeDefined();
            chartModel.setMultipleProperties(chartSettings);
        }, function () {
            // TODO mraj it never verifies any chartSettings after calling setMultipleProperties
            webAppHelper.removeNIElement(chartId);
        });
    });
    it('allows a chart element to be added directly to the page.', function (done) {
        webAppHelper.appendElement('ni-chart', chartElementSettings, document.body);
        testHelpers.runAsync(done, function () {
            const model = viModel.getControlModel(chartId);
            expect(model.historySize).toBe(123);
            webAppHelper.removeNIElement(chartId);
        });
    });
    describe('allows creation of a chart ', function () {
        beforeEach(function (done) {
            chart.bufferSize = 128;
            webAppHelper.createNIElementHierarchy([
                { currentSettings: chart },
                { currentSettings: axis1, parentId: chartId },
                { currentSettings: axis2, parentId: chartId }
            ], done);
        });
        afterEach(function () {
            webAppHelper.removeNIElement(chartId);
        });
        it('with a different history buffer size', function (done) {
            chartElement = document.querySelector('[ni-control-id="' + chartId + '"]');
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                chartModel = frontPanelControls[chartId];
                expect(chartModel.historySize).toBe(128);
                expect(chartElement.getHistoryBuffer().capacity).toBe(128);
            });
        });
    });
    describe('allows different data formats', function () {
        let value1D;
        let updateSettings;
        beforeEach(function (done) {
            value1D = [7, 9, 30];
            updateSettings = { value: value1D };
            webAppHelper.createNIElementHierarchy([
                { currentSettings: chart },
                { currentSettings: axis1, parentId: chartId },
                { currentSettings: axis2, parentId: chartId }
            ], done);
        });
        afterEach(function () {
            webAppHelper.removeNIElement(chartId);
        });
        it('works with an 1D array', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(chartId, updateSettings);
            }, function () {
                const chartElement = viModel.getControlViewModel(chartId).element;
                expect(chartElement.graph.getData()[0].datapoints.points).toEqual([0, 7, 1, 9, 2, 30]);
            });
        });
        it('shows data with the default plot settings if a plot is not available', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(chartId, updateSettings);
            }, function () {
                const chartElement = viModel.getControlViewModel(chartId).element;
                const series = chartElement.graph.getData();
                expect(series[0].lines.show).toBe(true);
                expect(series[0].points.show).toBe(false);
                expect(series[0].bars.show).toBe(false);
                expect(series[0].lines.lineWidth).toBe(1);
                expect(series[0].lines.fill).toBe(false);
            });
        });
    });
});
//# sourceMappingURL=niChartViewModel.Test.js.map