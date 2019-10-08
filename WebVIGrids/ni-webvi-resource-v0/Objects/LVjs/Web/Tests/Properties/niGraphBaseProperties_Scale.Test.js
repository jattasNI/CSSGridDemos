//****************************************
// G Property Tests for Scale of Graph and Chart class
// National Instruments Copyright 2018
//****************************************
import { GraphBaseModel } from '../../Modeling/niGraphBaseModel.js';
import { NI_SUPPORT } from '../../Framework/niSupport.js';
describe('A chart control', function () {
    'use strict';
    let viModel, frontPanelControls, chartModel, viewModelOfChart;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let chartXAxis1Settings, chartXAxis2Settings, chartSettings, chartYAxis1Settings, chartYAxis2Settings;
    let chartId;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then(fixture => {
            chartId = fixture.chartSettings.niControlId;
            chartSettings = fixture.chartSettings;
            chartXAxis1Settings = fixture.cartesianGraphAxis4Settings;
            chartXAxis2Settings = fixture.cartesianGraphAxis2Settings;
            chartYAxis1Settings = fixture.cartesianGraphAxis1Settings;
            chartYAxis2Settings = fixture.cartesianGraphAxis3Settings;
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
    describe('with single X and Y scale', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([{
                    currentSettings: chartSettings
                },
                {
                    currentSettings: chartYAxis2Settings,
                    parentId: chartId
                },
                {
                    currentSettings: chartXAxis2Settings,
                    parentId: chartId
                }], done);
        });
        afterEach(function () {
            webAppHelper.removeNIElement(chartId);
        });
        it('property read for ActiveYScale with default state returns 0.', function () {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            const currentValue = viewModelOfChart.getGPropertyValue(GraphBaseModel.ACTIVE_Y_SCALE_G_PROPERTY_NAME);
            expect(currentValue).toEqual(0);
        });
        it('property set for ActiveYScale with negative value throws an exception.', function () {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', GraphBaseModel.ACTIVE_Y_SCALE_G_PROPERTY_NAME, 0);
            expect(function () {
                const negativeActiveYScale = -7;
                viewModelOfChart.setGPropertyValue(GraphBaseModel.ACTIVE_Y_SCALE_G_PROPERTY_NAME, negativeActiveYScale);
            }).toThrowError(Error, errorMessage);
        });
        it('property set for ActiveYScale with out of bound value throws an exception.', function () {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', GraphBaseModel.ACTIVE_Y_SCALE_G_PROPERTY_NAME, 0);
            expect(function () {
                const newActiveYScale = 10;
                viewModelOfChart.setGPropertyValue(GraphBaseModel.ACTIVE_Y_SCALE_G_PROPERTY_NAME, newActiveYScale);
            }).toThrowError(Error, errorMessage);
        });
        it('property set for ActiveYScale updates model.', function (done) {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            testHelpers.runAsync(done, function () {
                const newActiveYScale = 0;
                viewModelOfChart.setGPropertyValue(GraphBaseModel.ACTIVE_Y_SCALE_G_PROPERTY_NAME, newActiveYScale);
                expect(chartModel.activeYScale).toEqual(newActiveYScale);
            });
        });
        it("property set for Y Scale throws error.", function () {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_CANNOT_BE_SET', GraphBaseModel.Y_SCALE_G_PROPERTY_NAME);
            expect(function () {
                viewModelOfChart.setGPropertyValue(GraphBaseModel.Y_SCALE_G_PROPERTY_NAME, {});
            }).toThrowError(Error, errorMessage);
        });
        it('property get for Y Scale with default state returns reference of first Y scale child.', function (done) {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            testHelpers.runAsync(done, function () {
                const actualYScaleReference = viewModelOfChart.getGPropertyValue(GraphBaseModel.Y_SCALE_G_PROPERTY_NAME);
                const activeYScaleModel = chartModel.childModels[0];
                const expectedYScaleReference = activeYScaleModel.rootOwner.getControlViewModel(activeYScaleModel.niControlId);
                expect(actualYScaleReference).toEqual(expectedYScaleReference);
            });
        });
        it('property read for ActiveXScale with default state returns 0.', function () {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            const currentValue = viewModelOfChart.getGPropertyValue(GraphBaseModel.ACTIVE_X_SCALE_G_PROPERTY_NAME);
            expect(currentValue).toEqual(0);
        });
        it('property set for ActiveXScale with negative value throws an exception.', function () {
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', GraphBaseModel.ACTIVE_X_SCALE_G_PROPERTY_NAME, 0);
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            expect(function () {
                const negativeActiveXScale = -7;
                viewModelOfChart.setGPropertyValue(GraphBaseModel.ACTIVE_X_SCALE_G_PROPERTY_NAME, negativeActiveXScale);
            }).toThrowError(Error, errorMessage);
        });
        it('property set for ActiveXScale with out of bound value throws an exception.', function () {
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', GraphBaseModel.ACTIVE_X_SCALE_G_PROPERTY_NAME, 0);
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            expect(function () {
                const newActiveXScale = 10;
                viewModelOfChart.setGPropertyValue(GraphBaseModel.ACTIVE_X_SCALE_G_PROPERTY_NAME, newActiveXScale);
            }).toThrowError(Error, errorMessage);
        });
        it('property set for X Scale throws error.', function () {
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_CANNOT_BE_SET', GraphBaseModel.X_SCALE_G_PROPERTY_NAME);
            expect(function () {
                frontPanelControls = viModel.getAllControlModels();
                chartModel = frontPanelControls[chartId];
                viewModelOfChart = viModel.getControlViewModel(chartId);
                viewModelOfChart.setGPropertyValue(GraphBaseModel.X_SCALE_G_PROPERTY_NAME, {});
            }).toThrowError(Error, errorMessage);
        });
        it('property get for X Scale with default state returns reference of first X scale child.', function (done) {
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                chartModel = frontPanelControls[chartId];
                viewModelOfChart = viModel.getControlViewModel(chartId);
                const actualXScaleReference = viewModelOfChart.getGPropertyValue(GraphBaseModel.X_SCALE_G_PROPERTY_NAME);
                const activeXScaleModel = chartModel.childModels[1];
                const expectedXScaleReference = activeXScaleModel.rootOwner.getControlViewModel(activeXScaleModel.niControlId);
                expect(actualXScaleReference).toEqual(expectedXScaleReference);
            });
        });
        it('property read for ActiveXScale with default state returns 0.', function () {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            const currentValue = viewModelOfChart.getGPropertyValue(GraphBaseModel.ACTIVE_X_SCALE_G_PROPERTY_NAME);
            expect(currentValue).toEqual(0);
        });
    });
    describe('with multiple X and Y scales', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([{
                    currentSettings: chartSettings
                },
                {
                    currentSettings: chartYAxis1Settings,
                    parentId: chartId
                },
                {
                    currentSettings: chartYAxis2Settings,
                    parentId: chartId
                },
                {
                    currentSettings: chartXAxis2Settings,
                    parentId: chartId
                },
                {
                    currentSettings: chartXAxis1Settings,
                    parentId: chartId
                }], done);
        });
        afterEach(function () {
            webAppHelper.removeNIElement(chartId);
        });
        it('property read for ActiveYScale with default state returns 0.', function () {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            const currentValue = viewModelOfChart.getGPropertyValue(GraphBaseModel.ACTIVE_Y_SCALE_G_PROPERTY_NAME);
            expect(currentValue).toEqual(0);
        });
        it('property set for ActiveYScale with negative value throws an exception.', function () {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', GraphBaseModel.ACTIVE_Y_SCALE_G_PROPERTY_NAME, 1);
            expect(function () {
                const negativeActiveXScale = -7;
                viewModelOfChart.setGPropertyValue(GraphBaseModel.ACTIVE_Y_SCALE_G_PROPERTY_NAME, negativeActiveXScale);
            }).toThrowError(Error, errorMessage);
        });
        it('property set for ActiveYScale with out of bound value throws an exception.', function () {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', GraphBaseModel.ACTIVE_Y_SCALE_G_PROPERTY_NAME, 1);
            expect(function () {
                const newActiveYScale = 10;
                viewModelOfChart.setGPropertyValue(GraphBaseModel.ACTIVE_Y_SCALE_G_PROPERTY_NAME, newActiveYScale);
            }).toThrowError(Error, errorMessage);
        });
        it('property set for ActiveYScale updates model.', function (done) {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            testHelpers.runAsync(done, function () {
                const newActiveYScale = 1;
                viewModelOfChart.setGPropertyValue(GraphBaseModel.ACTIVE_Y_SCALE_G_PROPERTY_NAME, newActiveYScale);
                expect(chartModel.activeYScale).toEqual(newActiveYScale);
            });
        });
        it("property set for Y Scale throws error.", function () {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_CANNOT_BE_SET', GraphBaseModel.Y_SCALE_G_PROPERTY_NAME);
            expect(function () {
                viewModelOfChart.setGPropertyValue(GraphBaseModel.Y_SCALE_G_PROPERTY_NAME, {});
            }).toThrowError(Error, errorMessage);
        });
        it('property get for Y Scale with default state returns reference of first Y scale child.', function (done) {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            testHelpers.runAsync(done, function () {
                const actualYScaleReference = viewModelOfChart.getGPropertyValue(GraphBaseModel.Y_SCALE_G_PROPERTY_NAME);
                const activeYScaleModel = chartModel.childModels[0];
                const expectedYScaleReference = activeYScaleModel.rootOwner.getControlViewModel(activeYScaleModel.niControlId);
                expect(actualYScaleReference).toEqual(expectedYScaleReference);
            });
        });
        it('property get for Y Scale after changing the activeYScale returns reference of new activeYScale.', function (done) {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            const newActiveYScale = 1;
            testHelpers.runAsync(done, function () {
                viewModelOfChart.setGPropertyValue(GraphBaseModel.ACTIVE_Y_SCALE_G_PROPERTY_NAME, newActiveYScale);
                const actualYScaleReference = viewModelOfChart.getGPropertyValue(GraphBaseModel.Y_SCALE_G_PROPERTY_NAME);
                const activeYScaleModel = chartModel.childModels[newActiveYScale];
                const expectedYScaleReference = activeYScaleModel.rootOwner.getControlViewModel(activeYScaleModel.niControlId);
                expect(actualYScaleReference).toEqual(expectedYScaleReference);
            });
        });
        it('property read for ActiveXScale with default state returns 0.', function () {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            const currentValue = viewModelOfChart.getGPropertyValue(GraphBaseModel.ACTIVE_X_SCALE_G_PROPERTY_NAME);
            expect(currentValue).toEqual(0);
        });
        it('property set for ActiveXScale with negative value throws an exception.', function () {
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', GraphBaseModel.ACTIVE_X_SCALE_G_PROPERTY_NAME, 1);
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            expect(function () {
                const negativeActiveXScale = -7;
                viewModelOfChart.setGPropertyValue(GraphBaseModel.ACTIVE_X_SCALE_G_PROPERTY_NAME, negativeActiveXScale);
            }).toThrowError(Error, errorMessage);
        });
        it('property set for ActiveXScale with out of bound value throws an exception.', function () {
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', GraphBaseModel.ACTIVE_X_SCALE_G_PROPERTY_NAME, 1);
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            expect(function () {
                const newActiveXScale = 10;
                viewModelOfChart.setGPropertyValue(GraphBaseModel.ACTIVE_X_SCALE_G_PROPERTY_NAME, newActiveXScale);
            }).toThrowError(Error, errorMessage);
        });
        it('property set for X Scale throws error.', function () {
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_CANNOT_BE_SET', GraphBaseModel.X_SCALE_G_PROPERTY_NAME);
            expect(function () {
                frontPanelControls = viModel.getAllControlModels();
                chartModel = frontPanelControls[chartId];
                viewModelOfChart = viModel.getControlViewModel(chartId);
                viewModelOfChart.setGPropertyValue(GraphBaseModel.X_SCALE_G_PROPERTY_NAME, {});
            }).toThrowError(Error, errorMessage);
        });
        it('property get for X Scale with default state returns reference of first X scale child.', function (done) {
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                chartModel = frontPanelControls[chartId];
                viewModelOfChart = viModel.getControlViewModel(chartId);
                const actualXScaleReference = viewModelOfChart.getGPropertyValue(GraphBaseModel.X_SCALE_G_PROPERTY_NAME);
                const activeXScaleModel = chartModel.childModels[2];
                const expectedXScaleReference = activeXScaleModel.rootOwner.getControlViewModel(activeXScaleModel.niControlId);
                expect(actualXScaleReference).toEqual(expectedXScaleReference);
            });
        });
        it('property get for X Scale after changing the activeXScale returns reference of new activeXScale.', function (done) {
            const newActiveXScale = 1;
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                chartModel = frontPanelControls[chartId];
                viewModelOfChart = viModel.getControlViewModel(chartId);
                viewModelOfChart.setGPropertyValue(GraphBaseModel.ACTIVE_X_SCALE_G_PROPERTY_NAME, newActiveXScale);
                const actualXScaleReference = viewModelOfChart.getGPropertyValue(GraphBaseModel.X_SCALE_G_PROPERTY_NAME);
                const activeXScaleModel = chartModel.childModels[newActiveXScale];
                const expectedXScaleReference = activeXScaleModel.rootOwner.getControlViewModel(activeXScaleModel.niControlId);
                expect(actualXScaleReference).toEqual(expectedXScaleReference);
            });
        });
        it('property read for ActiveXScale with default state returns 0.', function () {
            frontPanelControls = viModel.getAllControlModels();
            chartModel = frontPanelControls[chartId];
            viewModelOfChart = viModel.getControlViewModel(chartId);
            const currentValue = viewModelOfChart.getGPropertyValue(GraphBaseModel.ACTIVE_X_SCALE_G_PROPERTY_NAME);
            expect(currentValue).toEqual(0);
        });
        it('property get for X Scale after changing the activeXScale returns reference of new activeXScale.', function (done) {
            const newActiveXScale = 1;
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                chartModel = frontPanelControls[chartId];
                viewModelOfChart = viModel.getControlViewModel(chartId);
                viewModelOfChart.setGPropertyValue(GraphBaseModel.ACTIVE_X_SCALE_G_PROPERTY_NAME, newActiveXScale);
                const actualXScaleReference = viewModelOfChart.getGPropertyValue(GraphBaseModel.X_SCALE_G_PROPERTY_NAME);
                const activeXScaleModel = chartModel.childModels[newActiveXScale];
                const expectedXScaleReference = activeXScaleModel.rootOwner.getControlViewModel(activeXScaleModel.niControlId);
                expect(actualXScaleReference).toEqual(expectedXScaleReference);
            });
        });
    });
});
//# sourceMappingURL=niGraphBaseProperties_Scale.Test.js.map