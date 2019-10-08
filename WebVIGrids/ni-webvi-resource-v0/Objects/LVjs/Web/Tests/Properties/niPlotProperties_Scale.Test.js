//****************************************
// G Property Tests for XAxisIndex and YAxisIndex of Plot View Model class
// National Instruments Copyright 2018
//****************************************
import { CartesianPlotModel } from '../../Modeling/niCartesianPlotModel.js';
import { NI_SUPPORT } from '../../Framework/niSupport.js';
describe('A CartesianGraph control', function () {
    'use strict';
    let viModel, frontPanelControls, plot1Model, plot1ViewModel;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let cartesianGraphXAxis1Settings, cartesianGraphXAxis2Settings, cartesianGraphSettings, cartesianGraphYAxis1Settings, cartesianGraphYAxis2Settings, plotSettings1;
    let graphId;
    // TODO should be removed after we migrate to jasmine >= 2.7 and the `it` blocks support async functions natively
    const makeAsync = function (done, fn) {
        fn().then(() => done()).catch((ex) => done.fail(ex));
    };
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then(fixture => {
            graphId = fixture.cartesianGraphSettings2.niControlId;
            cartesianGraphSettings = fixture.cartesianGraphSettings2;
            cartesianGraphXAxis1Settings = fixture.cartesianGraphAxis4Settings;
            cartesianGraphXAxis2Settings = fixture.cartesianGraphAxis2Settings;
            cartesianGraphYAxis1Settings = fixture.cartesianGraphAxis1Settings;
            cartesianGraphYAxis2Settings = fixture.cartesianGraphAxis3Settings;
            plotSettings1 = fixture.cartesianGraphPlot1Settings;
            plotSettings1.label = "Plot1";
            plotSettings1.show = true;
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
                    currentSettings: cartesianGraphSettings
                },
                {
                    currentSettings: cartesianGraphYAxis1Settings,
                    parentId: graphId
                },
                {
                    currentSettings: cartesianGraphXAxis2Settings,
                    parentId: graphId
                },
                {
                    currentSettings: plotSettings1,
                    parentId: graphId
                }], done);
        });
        afterEach(function () {
            webAppHelper.removeNIElement(graphId);
        });
        it('for a plot, property read for YAxisIndex with default state returns 0.', function (done) {
            makeAsync(done, async function () {
                frontPanelControls = viModel.getAllControlModels();
                plot1Model = frontPanelControls[plotSettings1.niControlId];
                plot1ViewModel = viModel.getControlViewModel(plotSettings1.niControlId);
                const currentValue = await plot1ViewModel.getGPropertyValue(CartesianPlotModel.Y_AXIS_INDEX_G_PROPERTY_NAME);
                expect(currentValue).toEqual(0);
            });
        });
        it('for a plot, property set for YAxisIndex with negative value throws an exception.', function () {
            frontPanelControls = viModel.getAllControlModels();
            plot1Model = frontPanelControls[plotSettings1.niControlId];
            plot1ViewModel = viModel.getControlViewModel(plotSettings1.niControlId);
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', CartesianPlotModel.Y_AXIS_INDEX_G_PROPERTY_NAME, 0);
            expect(function () {
                const negativeYAxisIndex = -7;
                plot1ViewModel.setGPropertyValue(CartesianPlotModel.Y_AXIS_INDEX_G_PROPERTY_NAME, negativeYAxisIndex);
            }).toThrowError(Error, errorMessage);
        });
        it('for a plot, property set for YAxisIndex with out of bound value throws an exception.', function () {
            frontPanelControls = viModel.getAllControlModels();
            plot1Model = frontPanelControls[plotSettings1.niControlId];
            plot1ViewModel = viModel.getControlViewModel(plotSettings1.niControlId);
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', CartesianPlotModel.Y_AXIS_INDEX_G_PROPERTY_NAME, 0);
            expect(function () {
                const newYAxisIndex = 10;
                plot1ViewModel.setGPropertyValue(CartesianPlotModel.Y_AXIS_INDEX_G_PROPERTY_NAME, newYAxisIndex);
            }).toThrowError(Error, errorMessage);
        });
        it('for a plot, property read for XAxisIndex with default state returns 0.', function (done) {
            makeAsync(done, async function () {
                frontPanelControls = viModel.getAllControlModels();
                plot1Model = frontPanelControls[plotSettings1.niControlId];
                plot1ViewModel = viModel.getControlViewModel(plotSettings1.niControlId);
                const currentValue = await plot1ViewModel.getGPropertyValue(CartesianPlotModel.X_AXIS_INDEX_G_PROPERTY_NAME);
                expect(currentValue).toEqual(0);
            });
        });
        it('for a plot, property set for XAxisIndex with out of bound value throws an exception.', function () {
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', CartesianPlotModel.X_AXIS_INDEX_G_PROPERTY_NAME, 0);
            frontPanelControls = viModel.getAllControlModels();
            plot1Model = frontPanelControls[plotSettings1.niControlId];
            plot1ViewModel = viModel.getControlViewModel(plotSettings1.niControlId);
            expect(function () {
                const newXAxisIndex = 10;
                plot1ViewModel.setGPropertyValue(CartesianPlotModel.X_AXIS_INDEX_G_PROPERTY_NAME, newXAxisIndex);
            }).toThrowError(Error, errorMessage);
        });
        it('for a plot, property set for XAxisIndex with negative value throws an exception.', function () {
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', CartesianPlotModel.X_AXIS_INDEX_G_PROPERTY_NAME, 0);
            frontPanelControls = viModel.getAllControlModels();
            plot1Model = frontPanelControls[plotSettings1.niControlId];
            plot1ViewModel = viModel.getControlViewModel(plotSettings1.niControlId);
            expect(function () {
                const negativeXAxisIndex = -7;
                plot1ViewModel.setGPropertyValue(CartesianPlotModel.X_AXIS_INDEX_G_PROPERTY_NAME, negativeXAxisIndex);
            }).toThrowError(Error, errorMessage);
        });
    });
    describe('with multiple X and Y scales', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([{
                    currentSettings: cartesianGraphSettings
                },
                {
                    currentSettings: cartesianGraphYAxis1Settings,
                    parentId: graphId
                },
                {
                    currentSettings: cartesianGraphYAxis2Settings,
                    parentId: graphId
                },
                {
                    currentSettings: cartesianGraphXAxis2Settings,
                    parentId: graphId
                },
                {
                    currentSettings: cartesianGraphXAxis1Settings,
                    parentId: graphId
                },
                {
                    currentSettings: plotSettings1,
                    parentId: graphId
                }], done);
        });
        afterEach(function () {
            webAppHelper.removeNIElement(graphId);
        });
        it('for a plot, property read for YAxisIndex with default state returns 0.', function (done) {
            makeAsync(done, async function () {
                frontPanelControls = viModel.getAllControlModels();
                plot1Model = frontPanelControls[plotSettings1.niControlId];
                plot1ViewModel = viModel.getControlViewModel(plotSettings1.niControlId);
                const currentValue = await plot1ViewModel.getGPropertyValue(CartesianPlotModel.Y_AXIS_INDEX_G_PROPERTY_NAME);
                expect(currentValue).toEqual(0);
            });
        });
        it('for a plot, property set for YAxisIndex with negative value throws an exception.', function () {
            frontPanelControls = viModel.getAllControlModels();
            plot1Model = frontPanelControls[plotSettings1.niControlId];
            plot1ViewModel = viModel.getControlViewModel(plotSettings1.niControlId);
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', CartesianPlotModel.Y_AXIS_INDEX_G_PROPERTY_NAME, 1);
            expect(function () {
                const negativeXAxisIndex = -7;
                plot1ViewModel.setGPropertyValue(CartesianPlotModel.Y_AXIS_INDEX_G_PROPERTY_NAME, negativeXAxisIndex);
            }).toThrowError(Error, errorMessage);
        });
        it('for a plot, property set for YAxisIndex with out of bound value throws an exception.', function () {
            frontPanelControls = viModel.getAllControlModels();
            plot1Model = frontPanelControls[plotSettings1.niControlId];
            plot1ViewModel = viModel.getControlViewModel(plotSettings1.niControlId);
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', CartesianPlotModel.Y_AXIS_INDEX_G_PROPERTY_NAME, 1);
            expect(function () {
                const newYAxisIndex = 10;
                plot1ViewModel.setGPropertyValue(CartesianPlotModel.Y_AXIS_INDEX_G_PROPERTY_NAME, newYAxisIndex);
            }).toThrowError(Error, errorMessage);
        });
        it('for a plot, property set for YAxisIndex updates model.', function (done) {
            frontPanelControls = viModel.getAllControlModels();
            plot1Model = frontPanelControls[plotSettings1.niControlId];
            plot1ViewModel = viModel.getControlViewModel(plotSettings1.niControlId);
            testHelpers.runAsync(done, function () {
                const newYAxisIndex = 1;
                plot1ViewModel.setGPropertyValue(CartesianPlotModel.Y_AXIS_INDEX_G_PROPERTY_NAME, newYAxisIndex);
                expect(plot1Model.yaxis).toEqual(cartesianGraphYAxis2Settings.niControlId);
            });
        });
        it('for a plot, property set for XAxisIndex updates model.', function (done) {
            frontPanelControls = viModel.getAllControlModels();
            plot1Model = frontPanelControls[plotSettings1.niControlId];
            plot1ViewModel = viModel.getControlViewModel(plotSettings1.niControlId);
            testHelpers.runAsync(done, function () {
                const newYAxisIndex = 1;
                plot1ViewModel.setGPropertyValue(CartesianPlotModel.X_AXIS_INDEX_G_PROPERTY_NAME, newYAxisIndex);
                expect(plot1Model.xaxis).toEqual(cartesianGraphXAxis1Settings.niControlId);
            });
        });
        it('for a plot, property get for YAxisIndex after changing the YAxisIndex returns the new YAxisIndex.', function (done) {
            makeAsync(done, async function () {
                frontPanelControls = viModel.getAllControlModels();
                plot1Model = frontPanelControls[plotSettings1.niControlId];
                plot1ViewModel = viModel.getControlViewModel(plotSettings1.niControlId);
                const newYAxisIndex = 1;
                plot1ViewModel.setGPropertyValue(CartesianPlotModel.Y_AXIS_INDEX_G_PROPERTY_NAME, newYAxisIndex);
                const actualYAxisIndex = await plot1ViewModel.getGPropertyValue(CartesianPlotModel.Y_AXIS_INDEX_G_PROPERTY_NAME);
                expect(actualYAxisIndex).toEqual(newYAxisIndex);
            });
        });
        it('for a plot, property read for XAxisIndex with default state returns 0.', function (done) {
            makeAsync(done, async function () {
                frontPanelControls = viModel.getAllControlModels();
                plot1Model = frontPanelControls[plotSettings1.niControlId];
                plot1ViewModel = viModel.getControlViewModel(plotSettings1.niControlId);
                const currentValue = await plot1ViewModel.getGPropertyValue(CartesianPlotModel.X_AXIS_INDEX_G_PROPERTY_NAME);
                expect(currentValue).toEqual(0);
            });
        });
        it('for a plot, property set for XAxisIndex with negative value throws an exception.', function () {
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', CartesianPlotModel.X_AXIS_INDEX_G_PROPERTY_NAME, 1);
            frontPanelControls = viModel.getAllControlModels();
            plot1Model = frontPanelControls[plotSettings1.niControlId];
            plot1ViewModel = viModel.getControlViewModel(plotSettings1.niControlId);
            expect(function () {
                const negativeXAxisIndex = -7;
                plot1ViewModel.setGPropertyValue(CartesianPlotModel.X_AXIS_INDEX_G_PROPERTY_NAME, negativeXAxisIndex);
            }).toThrowError(Error, errorMessage);
        });
        it('for a plot, property set for XAxisIndex with out of bound value throws an exception.', function () {
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', CartesianPlotModel.X_AXIS_INDEX_G_PROPERTY_NAME, 1);
            frontPanelControls = viModel.getAllControlModels();
            plot1Model = frontPanelControls[plotSettings1.niControlId];
            plot1ViewModel = viModel.getControlViewModel(plotSettings1.niControlId);
            expect(function () {
                const newXAxisIndex = 10;
                plot1ViewModel.setGPropertyValue(CartesianPlotModel.X_AXIS_INDEX_G_PROPERTY_NAME, newXAxisIndex);
            }).toThrowError(Error, errorMessage);
        });
        it('for a plot, property get for XAxisIndex after changing the XAxisIndex returns new XAxisIndex.', function (done) {
            makeAsync(done, async function () {
                const newXAxisIndex = 1;
                frontPanelControls = viModel.getAllControlModels();
                plot1Model = frontPanelControls[plotSettings1.niControlId];
                plot1ViewModel = viModel.getControlViewModel(plotSettings1.niControlId);
                plot1ViewModel.setGPropertyValue(CartesianPlotModel.X_AXIS_INDEX_G_PROPERTY_NAME, newXAxisIndex);
                const actualXAxisIndex = await plot1ViewModel.getGPropertyValue(CartesianPlotModel.X_AXIS_INDEX_G_PROPERTY_NAME);
                expect(actualXAxisIndex).toEqual(newXAxisIndex);
            });
        });
    });
});
//# sourceMappingURL=niPlotProperties_Scale.Test.js.map