//****************************************
// Tests for FrontPanelModel class
// National Instruments Copyright 2018
//****************************************
import { FrontPanelModel } from '../../Modeling/niFrontPanelModel.js';
describe('A FrontPanelModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const width = 700;
    const height = 400;
    const maxWidth = '100px';
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            width: width,
            height: height,
            layout: "absolute",
            maxWidth: maxWidth,
            background: 'rgba(238,28,37,0.57)'
        };
        otherSettings = {
            width: width + 1,
            height: height + 1,
            layout: "flexible",
            maxWidth: '300px',
            background: 'rgba(300,30,30,30)'
        };
        controlModel = new FrontPanelModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.width).toEqual(completeSettings.width);
        expect(controlModel.height).toEqual(completeSettings.height);
        expect(controlModel.layout).toEqual(completeSettings.layout);
        expect(controlModel.maxWidth).toEqual(completeSettings.maxWidth);
        expect(controlModel.background).toEqual(completeSettings.background);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.height).toEqual(otherSettings.height);
        expect(controlModel.layout).toEqual(otherSettings.layout);
        expect(controlModel.maxWidth).toEqual(otherSettings.maxWidth);
        expect(controlModel.background).toEqual(otherSettings.background);
    });
});
//# sourceMappingURL=niFrontPanelModel.Test.js.map