//****************************************
// G Property Tests for cartesianAxisModel class
// National Instruments Copyright 2018
//****************************************
import { CartesianAxisModel, FIT_INDICES as FitIndicesEnum, FIT_TYPES as FitTypesEnum } from '../../Modeling/niCartesianAxisModel.js';
import { NI_SUPPORT } from '../../Framework/niSupport.js';
import { SCALE_INDICES } from '../../Designer/niCartesianAxisViewModel.js';
describe('A Cartesian Axis ', function () {
    'use strict';
    let viModel, frontPanelControls, activeXCartesianAxisModel, activeXCartesianAxisViewModel, activeYCartesianAxisViewModel, cartesianAxisElement;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let cartesianGraphSettings, cartesianGraphXAxisSettings, cartesianGraphYAxisSettings;
    let graphId, xAxisId, yAxisId;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then(fixture => {
            graphId = fixture.cartesianGraphSettings2.niControlId;
            xAxisId = fixture.cartesianGraphAxis4Settings.niControlId;
            yAxisId = fixture.cartesianGraphAxis1Settings.niControlId;
            cartesianGraphSettings = fixture.cartesianGraphSettings2;
            cartesianGraphXAxisSettings = fixture.cartesianGraphAxis4Settings;
            cartesianGraphYAxisSettings = fixture.cartesianGraphAxis1Settings;
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
    beforeEach(function (done) {
        webAppHelper.createNIElementHierarchy([{
                currentSettings: cartesianGraphSettings
            },
            {
                currentSettings: cartesianGraphXAxisSettings,
                parentId: graphId
            },
            {
                currentSettings: cartesianGraphYAxisSettings,
                parentId: graphId
            }], done);
    });
    beforeEach(function () {
        frontPanelControls = viModel.getAllControlModels();
        activeXCartesianAxisModel = frontPanelControls[xAxisId];
        activeXCartesianAxisViewModel = viModel.getControlViewModel(xAxisId);
    });
    afterEach(function () {
        webAppHelper.removeNIElement(graphId);
    });
    it('property read for Mapping returns default value (Linear type).', function () {
        const currentFitType = activeXCartesianAxisViewModel.getGPropertyValue(CartesianAxisModel.MAPPING_G_PROPERTY_NAME);
        expect(currentFitType).toEqual(SCALE_INDICES.LINEAR_SCALE);
    });
    it('property set for Mapping updates the model.', function () {
        const newMapping = SCALE_INDICES.LOG_SCALE;
        activeXCartesianAxisViewModel.setGPropertyValue(CartesianAxisModel.MAPPING_G_PROPERTY_NAME, newMapping);
        expect(activeXCartesianAxisModel.logScale).toBe(true);
    });
    it('property set for Mapping updates the control element.', function (done) {
        const newMapping = SCALE_INDICES.LOG_SCALE;
        cartesianAxisElement = activeXCartesianAxisViewModel.element;
        testHelpers.runMultipleAsync(done, function () {
            activeXCartesianAxisViewModel.setGPropertyValue(CartesianAxisModel.MAPPING_G_PROPERTY_NAME, newMapping);
        }, function () {
            expect(cartesianAxisElement.logScale).toBe(true);
        });
    });
    it('property set for Mapping with out of bound values updates the control element with logScale as true.', function (done) {
        const newMapping = 6;
        cartesianAxisElement = activeXCartesianAxisViewModel.element;
        testHelpers.runMultipleAsync(done, function () {
            activeXCartesianAxisViewModel.setGPropertyValue(CartesianAxisModel.MAPPING_G_PROPERTY_NAME, newMapping);
            expect(activeXCartesianAxisModel.logScale).toBe(true);
        }, function () {
            expect(cartesianAxisElement.logScale).toBe(true);
        });
    });
    it("property set for Mapping as logScale from linerScale with negative value for 'Minimum of Range' updates the 'Minimum of Range' to 0.1.", function () {
        const newMapping = SCALE_INDICES.LOG_SCALE;
        webAppHelper.dispatchMessage(xAxisId, {
            minimum: -1
        });
        activeXCartesianAxisViewModel.setGPropertyValue(CartesianAxisModel.MAPPING_G_PROPERTY_NAME, newMapping);
        expect(activeXCartesianAxisModel.minimum).toBe(0.1);
    });
    it("property set for Mapping as logScale from linerScale with less than 0.1 value for 'Maximum of Range' updates the 'Maximum of Range' to 10.", function () {
        const newMapping = SCALE_INDICES.LOG_SCALE;
        webAppHelper.dispatchMessage(xAxisId, {
            maximum: 0
        });
        activeXCartesianAxisViewModel.setGPropertyValue(CartesianAxisModel.MAPPING_G_PROPERTY_NAME, newMapping);
        expect(activeXCartesianAxisModel.maximum).toBe(10);
    });
    it("property set for Mapping as logScale from linerScale with 0.1 as a value for 'Maximum of Range' updates the 'Maximum of Range' to 10.", function () {
        const newMapping = SCALE_INDICES.LOG_SCALE;
        webAppHelper.dispatchMessage(xAxisId, {
            maximum: 0.1
        });
        activeXCartesianAxisViewModel.setGPropertyValue(CartesianAxisModel.MAPPING_G_PROPERTY_NAME, newMapping);
        expect(activeXCartesianAxisModel.maximum).toBe(10);
    });
    it('property read for range returns current value.', function () {
        const currentRange = activeXCartesianAxisViewModel.getGPropertyValue(CartesianAxisModel.RANGE_G_PROPERTY_NAME);
        expect(currentRange).toEqual({
            Maximum: cartesianGraphXAxisSettings.maximum,
            Minimum: cartesianGraphXAxisSettings.minimum
        });
    });
    it('property set for Range with incorrect (max < min) value throws an exception.', function () {
        const minimum = 10;
        const maximum = 5;
        const errorMessage = NI_SUPPORT.i18n('msg_MIN_MUST_BE_LESS_THAN_MAX', minimum, maximum);
        expect(function () {
            activeXCartesianAxisViewModel.setGPropertyValue(CartesianAxisModel.RANGE_G_PROPERTY_NAME, {
                Maximum: maximum,
                Minimum: minimum
            });
        }).toThrowError(Error, errorMessage);
    });
    it('property set for Range updates the model.', function () {
        const expectedRange = {
            Maximum: 15,
            Minimum: 10
        };
        activeXCartesianAxisViewModel.setGPropertyValue(CartesianAxisModel.RANGE_G_PROPERTY_NAME, expectedRange);
        const currentModelRange = {
            Maximum: activeXCartesianAxisModel.maximum,
            Minimum: activeXCartesianAxisModel.minimum
        };
        expect(currentModelRange).toEqual(expectedRange);
    });
    it('property set for Range updates the control element.', function (done) {
        const newRange = {
            Maximum: 15,
            Minimum: 10
        };
        cartesianAxisElement = activeXCartesianAxisViewModel.element;
        testHelpers.runMultipleAsync(done, function () {
            activeXCartesianAxisViewModel.setGPropertyValue(CartesianAxisModel.RANGE_G_PROPERTY_NAME, newRange);
            const currentModelRange = {
                Maximum: activeXCartesianAxisModel.maximum,
                Minimum: activeXCartesianAxisModel.minimum
            };
            expect(currentModelRange).toEqual(newRange);
        }, function () {
            const currentElementRange = {
                Maximum: cartesianAxisElement.maximum,
                Minimum: cartesianAxisElement.minimum
            };
            expect(currentElementRange).toEqual(newRange);
        });
    });
    it('property set for Range with negative values and mapping set to Logarithmic updates the minimum value to 0.1 and keep the maximum value unchanged', function () {
        const newRange = {
            Maximum: -1,
            Minimum: -5
        };
        webAppHelper.dispatchMessage(xAxisId, {
            logScale: true
        });
        activeXCartesianAxisViewModel.setGPropertyValue(CartesianAxisModel.RANGE_G_PROPERTY_NAME, newRange);
        const currentModelRange = {
            Maximum: activeXCartesianAxisModel.maximum,
            Minimum: activeXCartesianAxisModel.minimum
        };
        expect(currentModelRange).toEqual({
            Maximum: cartesianGraphXAxisSettings.maximum,
            Minimum: 0.1
        });
    });
    it('property read for FitType of X axis returns default value (FitExactly).', function () {
        const currentFitType = activeXCartesianAxisViewModel.getGPropertyValue(CartesianAxisModel.FIT_TYPE_G_PROPERTY_NAME);
        expect(currentFitType).toEqual(FitIndicesEnum.exact);
    });
    it('property read for FitType of Y axis returns default value (FitLoosely).', function () {
        activeYCartesianAxisViewModel = viModel.getControlViewModel(yAxisId);
        const currentFitType = activeYCartesianAxisViewModel.getGPropertyValue(CartesianAxisModel.FIT_TYPE_G_PROPERTY_NAME);
        expect(currentFitType).toEqual(FitIndicesEnum.loose);
    });
    it('property set for FitType updates the model.', function () {
        const newFitType = FitIndicesEnum.none;
        activeXCartesianAxisViewModel.setGPropertyValue(CartesianAxisModel.FIT_TYPE_G_PROPERTY_NAME, newFitType);
        expect(activeXCartesianAxisModel.autoScale).toEqual(FitTypesEnum[newFitType]);
    });
    it('property set for FitType updates the control element.', function (done) {
        const newFitType = FitIndicesEnum.loose;
        cartesianAxisElement = activeXCartesianAxisViewModel.element;
        testHelpers.runMultipleAsync(done, function () {
            activeXCartesianAxisViewModel.setGPropertyValue(CartesianAxisModel.FIT_TYPE_G_PROPERTY_NAME, newFitType);
        }, function () {
            expect(cartesianAxisElement.autoScale).toEqual(FitTypesEnum[newFitType]);
        });
    });
    it('property set for FitType with out of bound values updates the control element with None as autoScale.', function (done) {
        const newFitType = 6;
        cartesianAxisElement = activeXCartesianAxisViewModel.element;
        testHelpers.runMultipleAsync(done, function () {
            activeXCartesianAxisViewModel.setGPropertyValue(CartesianAxisModel.FIT_TYPE_G_PROPERTY_NAME, newFitType);
        }, function () {
            expect(cartesianAxisElement.autoScale).toEqual(FitTypesEnum[FitIndicesEnum.none]);
        });
    });
    it("property read for FitType with 'growexact' as autoScale returns GrowOnly index value.", function () {
        webAppHelper.dispatchMessage(xAxisId, {
            autoScale: 'growexact'
        });
        const currentFitType = activeXCartesianAxisViewModel.getGPropertyValue(CartesianAxisModel.FIT_TYPE_G_PROPERTY_NAME);
        expect(currentFitType).toEqual(FitIndicesEnum.growloose);
    });
});
//# sourceMappingURL=niCartesianAxisProperties.Test.js.map