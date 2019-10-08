//****************************************
// Tests for UrlImageModel class
// National Instruments Copyright 2014
//****************************************
import { UrlImageModel } from '../../Modeling/niUrlImageModel.js';
describe('A UrlImageModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const visible = true;
    const source = 'source';
    const alternate = 'alternate';
    const stretch = 'uniform';
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            top: top,
            left: left,
            width: width,
            height: height,
            visible: visible,
            source: source,
            alternate: alternate,
            stretch: stretch
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            source: source + ' other',
            alternate: alternate + ' other',
            stretch: 'fill'
        };
        controlModel = new UrlImageModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('can be constructed', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('can get and set the source property', function () {
        controlModel.source = source;
        expect(controlModel.source).toEqual(source);
    });
    it('can get and set the alternate property', function () {
        controlModel.alternate = alternate;
        expect(controlModel.alternate).toEqual(alternate);
    });
    it('can get and set the stretch property', function () {
        controlModel.stretch = stretch;
        expect(controlModel.stretch).toEqual(stretch);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.width).toEqual(width);
        expect(controlModel.height).toEqual(height);
        expect(controlModel.source).toEqual(source);
        expect(controlModel.alternate).toEqual(alternate);
        expect(controlModel.stretch).toEqual(stretch);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.top).toEqual(otherSettings.top);
        expect(controlModel.left).toEqual(otherSettings.left);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.height).toEqual(otherSettings.height);
        expect(controlModel.source).toEqual(otherSettings.source);
        expect(controlModel.alternate).toEqual(otherSettings.alternate);
        expect(controlModel.stretch).toEqual(otherSettings.stretch);
    });
});
//# sourceMappingURL=niUrlImageModel.Test.js.map