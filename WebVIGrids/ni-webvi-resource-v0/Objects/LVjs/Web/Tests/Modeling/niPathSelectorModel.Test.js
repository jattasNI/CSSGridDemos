//****************************************
// Tests for PathSelectorModel class
// National Instruments Copyright 2015
//****************************************
import { PathSelectorModel } from '../../Modeling/niPathSelectorModel.js';
describe('A PathSelectorModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const visible = true;
    const path = '/';
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            top: top,
            left: left,
            width: width,
            height: height,
            visible: visible,
            path: path,
            textAlignment: 'center'
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            visible: !visible,
            path: path + 'home',
            textAlignment: 'right'
        };
        controlModel = new PathSelectorModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to set and get the path property', function () {
        controlModel.path = path;
        expect(controlModel.path).toEqual(path);
    });
    it('allows to set and get the path property with null', function () {
        controlModel.path = null;
        expect(controlModel.path).toEqual(null);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.width).toEqual(width);
        expect(controlModel.height).toEqual(height);
        expect(controlModel.path).toEqual(path);
        expect(controlModel.textAlignment).toEqual(completeSettings.textAlignment);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.top).toEqual(otherSettings.top);
        expect(controlModel.left).toEqual(otherSettings.left);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.height).toEqual(otherSettings.height);
        expect(controlModel.path).toEqual(otherSettings.path);
        expect(controlModel.textAlignment).toEqual(otherSettings.textAlignment);
    });
});
//# sourceMappingURL=niPathSelectorModel.Test.js.map