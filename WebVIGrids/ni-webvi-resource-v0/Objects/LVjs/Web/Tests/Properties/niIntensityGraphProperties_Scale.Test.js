//****************************************
// G Property Tests for Scale of IntensityGraphModel class
// National Instruments Copyright 2018
//****************************************
import { GraphBaseModel } from '../../Modeling/niGraphBaseModel.js';
import { NI_SUPPORT } from '../../Framework/niSupport.js';
describe('A IntensityGraph control', function () {
    'use strict';
    let viModel, frontPanelControls, graphModelWithXScale, graphModelWithYScale, viewModelOfGraphWithYAxis, viewModelOfGraphWithXAxis;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let intensityGraphXAxis1Settings, intensityGraphSettingsWithXScale, intensityGraphSettingsWithYScale, intensityGraphYAxis1Settings;
    let graphId;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then(fixture => {
            graphId = fixture.intensityGraphSettings2.niControlId;
            intensityGraphSettingsWithXScale = fixture.intensityGraphSettings2;
            intensityGraphSettingsWithYScale = fixture.intensityGraphSettings2;
            intensityGraphXAxis1Settings = fixture.cartesianGraphAxis4Settings;
            intensityGraphYAxis1Settings = fixture.cartesianGraphAxis1Settings;
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
    describe('with X scales', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([{
                    currentSettings: intensityGraphSettingsWithXScale
                },
                {
                    currentSettings: intensityGraphXAxis1Settings,
                    parentId: graphId
                }], done);
        });
        afterEach(function () {
            webAppHelper.removeNIElement(graphId);
        });
        it('property set for X Scale throws error.', function () {
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_CANNOT_BE_SET', GraphBaseModel.X_SCALE_G_PROPERTY_NAME);
            expect(function () {
                frontPanelControls = viModel.getAllControlModels();
                graphModelWithXScale = frontPanelControls[graphId];
                viewModelOfGraphWithXAxis = viModel.getControlViewModel(graphId);
                viewModelOfGraphWithXAxis.setGPropertyValue(GraphBaseModel.X_SCALE_G_PROPERTY_NAME, {});
            }).toThrowError(Error, errorMessage);
        });
        it('property get for X Scale with default state returns reference of first child.', function (done) {
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                graphModelWithXScale = frontPanelControls[graphId];
                viewModelOfGraphWithXAxis = viModel.getControlViewModel(graphId);
                const actualXScaleReference = viewModelOfGraphWithXAxis.getGPropertyValue(GraphBaseModel.X_SCALE_G_PROPERTY_NAME);
                const activeXScaleModel = graphModelWithXScale.childModels[0];
                const expectedXScaleReference = activeXScaleModel.rootOwner.getControlViewModel(activeXScaleModel.niControlId);
                expect(actualXScaleReference).toEqual(expectedXScaleReference);
            });
        });
    });
    describe('with Y scales', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([{
                    currentSettings: intensityGraphSettingsWithYScale
                },
                {
                    currentSettings: intensityGraphYAxis1Settings,
                    parentId: graphId
                }], done);
        });
        afterEach(function () {
            webAppHelper.removeNIElement(graphId);
        });
        it("property set for Y Scale throws error.", function () {
            frontPanelControls = viModel.getAllControlModels();
            graphModelWithYScale = frontPanelControls[graphId];
            viewModelOfGraphWithYAxis = viModel.getControlViewModel(graphId);
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_CANNOT_BE_SET', GraphBaseModel.Y_SCALE_G_PROPERTY_NAME);
            expect(function () {
                viewModelOfGraphWithYAxis.setGPropertyValue(GraphBaseModel.Y_SCALE_G_PROPERTY_NAME, {});
            }).toThrowError(Error, errorMessage);
        });
        it('property get for Y Scale with default state returns reference of first child.', function (done) {
            frontPanelControls = viModel.getAllControlModels();
            graphModelWithYScale = frontPanelControls[graphId];
            viewModelOfGraphWithYAxis = viModel.getControlViewModel(graphId);
            testHelpers.runAsync(done, function () {
                const actualYScaleReference = viewModelOfGraphWithYAxis.getGPropertyValue(GraphBaseModel.Y_SCALE_G_PROPERTY_NAME);
                const activeYScaleModel = graphModelWithYScale.childModels[0];
                const expectedYScaleReference = activeYScaleModel.rootOwner.getControlViewModel(activeYScaleModel.niControlId);
                expect(actualYScaleReference).toEqual(expectedYScaleReference);
            });
        });
    });
});
//# sourceMappingURL=niIntensityGraphProperties_Scale.Test.js.map