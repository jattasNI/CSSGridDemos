//****************************************
// Tests for ColorScaleViewModel class
// National Instruments Copyright 2014
//****************************************
import { ColorScaleModel } from '../../Modeling/niColorScaleModel.js';
import { IntensityGraphModel } from '../../Modeling/niIntensityGraphModel.js';
describe('A ColorScaleViewModel', function () {
    'use strict';
    const graphId = 'Function1';
    let axis1, axis1Settings;
    const axis1Id = 'Function13';
    let viModel, frontPanelControls, graph;
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
    beforeEach(function (done) {
        axis1 = {
            label: 'Color scale',
            showAxis: true,
            axisPosition: 'right',
            autoScale: 'none',
            highColor: '#ff0000',
            lowColor: '#00ff00',
            markers: '[{"value":0,"color":"#000000"},{"value":50,"color":"#0000FF"},{"value":100,"color":"#FFFFFF"}]',
            niControlId: axis1Id,
            kind: ColorScaleModel.MODEL_KIND
        };
        axis1Settings = {
            label: 'Color scale 1',
            showAxis: false,
            showLabel: false,
            axisPosition: 'left',
            highColor: '#ffaa00',
            lowColor: '#00ffaa',
            markers: '[{"value":0,"color":"#000000"},{"value":50,"color":"#AA00FF"},{"value":100,"color":"#FFFFFF"}]',
            autoScale: 'exact'
        };
        graph = {
            niControlId: graphId,
            kind: IntensityGraphModel.MODEL_KIND,
            left: '100px',
            top: '200px',
            width: '300px',
            height: '400px'
        };
        webAppHelper.createNIElementHierarchy([
            { currentSettings: graph },
            { currentSettings: axis1, parentId: graphId }
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
    it('allows creation with default settings', function (done) {
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(graphId);
            expect(viewModel).toBeDefined();
        });
    });
    it('allows to call the setMultipleProperties method with a property update', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            const axisModel = frontPanelControls[axis1Id];
            axisModel.setMultipleProperties({ highColor: '#ccaacc' });
        }, function () {
            const axisModel = frontPanelControls[axis1Id];
            expect(axisModel).toBeDefined();
            expect(axisModel.highColor).toBe('#ccaacc');
        });
    });
    it('updates the Model when properties change.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(axis1Id, axis1Settings);
        }, function () {
            const model = viModel.getControlModel(axis1Id);
            Object.keys(axis1Settings).forEach(function (key) {
                expect(model[key]).toBe(axis1Settings[key]);
            });
        });
    });
});
//# sourceMappingURL=niColorScaleViewModel.Test.js.map