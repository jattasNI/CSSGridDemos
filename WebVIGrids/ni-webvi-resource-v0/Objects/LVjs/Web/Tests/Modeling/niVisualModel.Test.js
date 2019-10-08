//****************************************
// Tests for VisualModel class
// National Instruments Copyright 2014
//****************************************
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A VisualModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const readOnly = true;
    const foreground = '#0000FF';
    const fontSize = '20px';
    const fontFamily = 'Arial, sans-serif';
    const fontStyle = 'italic';
    const fontWeight = 'bold';
    const textDecoration = 'line-through';
    const labelId = 'labelId';
    const controlResizeMode = 'fixed';
    const borderWidth = '0px';
    const margin = '0px';
    const padding = '0px';
    const visible = true;
    let settings = {};
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            top: top,
            left: left,
            width: width,
            height: height,
            readOnly: readOnly,
            foreground: foreground,
            fontSize: fontSize,
            fontFamily: fontFamily,
            fontStyle: fontStyle,
            fontWeight: fontWeight,
            textDecoration: textDecoration,
            labelId: labelId,
            controlResizeMode: controlResizeMode,
            borderWidth: borderWidth,
            margin: margin,
            padding: padding,
            visible: visible
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            readOnly: !readOnly,
            foreground: '#FF0000',
            fontSize: '30px',
            fontFamily: 'serif',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textDecoration: 'underline',
            labelId: labelId + '2',
            controlResizeMode: 'resize-horizontally',
            borderWidth: '5px',
            margin: '5px',
            padding: '5px',
            visible: !visible
        };
        settings = {};
        controlModel = new VisualModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to set and get the top property', function () {
        controlModel.top = top;
        expect(controlModel.top).toEqual(top);
    });
    it('allows to set and get the left property', function () {
        controlModel.left = left;
        expect(controlModel.left).toEqual(left);
    });
    it('allows to set and get the width property', function () {
        controlModel.width = width;
        expect(controlModel.width).toEqual(width);
    });
    it('allows to set and get the height property', function () {
        controlModel.height = height;
        expect(controlModel.height).toEqual(height);
    });
    it('allows to set and get the readOnly property', function () {
        controlModel.readOnly = readOnly;
        expect(controlModel.readOnly).toEqual(readOnly);
    });
    it('allows to set and get the foreground property', function () {
        controlModel.foreground = foreground;
        expect(controlModel.foreground).toEqual(foreground);
    });
    it('allows to set and get the fontSize property', function () {
        controlModel.fontSize = fontSize;
        expect(controlModel.fontSize).toEqual(fontSize);
    });
    it('allows to set and get the fontFamily property', function () {
        controlModel.fontFamily = fontFamily;
        expect(controlModel.fontFamily).toEqual(fontFamily);
    });
    it('allows to set and get the fontStyle property', function () {
        controlModel.fontStyle = fontStyle;
        expect(controlModel.fontStyle).toEqual(fontStyle);
    });
    it('allows to set and get the fontWeight property', function () {
        controlModel.fontWeight = fontWeight;
        expect(controlModel.fontWeight).toEqual(fontWeight);
    });
    it('allows to set and get the textDecoration property', function () {
        controlModel.textDecoration = textDecoration;
        expect(controlModel.textDecoration).toEqual(textDecoration);
    });
    it('allows to set and get the labelId property', function () {
        controlModel.labelId = labelId;
        expect(controlModel.labelId).toEqual(labelId);
    });
    it('allows to set and get the controlResizeMode property', function () {
        controlModel.controlResizeMode = controlResizeMode;
        expect(controlModel.controlResizeMode).toEqual(controlResizeMode);
    });
    it('allows to set and get the borderWidth property', function () {
        controlModel.borderWidth = borderWidth;
        expect(controlModel.borderWidth).toEqual(borderWidth);
    });
    it('allows to set and get the margin property', function () {
        controlModel.margin = margin;
        expect(controlModel.margin).toEqual(margin);
    });
    it('allows to set and get the padding property', function () {
        controlModel.padding = padding;
        expect(controlModel.padding).toEqual(padding);
    });
    it('allows to set and get the visible property', function () {
        controlModel.visible = visible;
        expect(controlModel.visible).toEqual(visible);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update all the properties at the same time', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.top).toEqual(top);
        expect(controlModel.left).toEqual(left);
        expect(controlModel.width).toEqual(width);
        expect(controlModel.height).toEqual(height);
        expect(controlModel.readOnly).toEqual(readOnly);
        expect(controlModel.foreground).toEqual(foreground);
        expect(controlModel.fontSize).toEqual(fontSize);
        expect(controlModel.fontFamily).toEqual(fontFamily);
        expect(controlModel.fontStyle).toEqual(fontStyle);
        expect(controlModel.fontWeight).toEqual(fontWeight);
        expect(controlModel.textDecoration).toEqual(textDecoration);
        expect(controlModel.labelId).toEqual(labelId);
        expect(controlModel.controlResizeMode).toEqual(controlResizeMode);
        expect(controlModel.borderWidth).toEqual(borderWidth);
        expect(controlModel.margin).toEqual(margin);
        expect(controlModel.padding).toEqual(padding);
        expect(controlModel.visible).toEqual(visible);
    });
    it('allows to call the setMultipleProperties method with an unknown property', function () {
        controlModel.setMultipleProperties(completeSettings);
        const sendUnknownProperties = function () {
            controlModel.setMultipleProperties({
                unknownProperty: 'someValue'
            });
        };
        expect(sendUnknownProperties).toThrow();
        expect(controlModel.top).toEqual(top);
        expect(controlModel.left).toEqual(left);
        expect(controlModel.width).toEqual(width);
        expect(controlModel.height).toEqual(height);
        expect(controlModel.readOnly).toEqual(readOnly);
        expect(controlModel.foreground).toEqual(foreground);
        expect(controlModel.fontSize).toEqual(fontSize);
        expect(controlModel.fontFamily).toEqual(fontFamily);
        expect(controlModel.fontStyle).toEqual(fontStyle);
        expect(controlModel.fontWeight).toEqual(fontWeight);
        expect(controlModel.textDecoration).toEqual(textDecoration);
        expect(controlModel.labelId).toEqual(labelId);
        expect(controlModel.controlResizeMode).toEqual(controlResizeMode);
        expect(controlModel.borderWidth).toEqual(borderWidth);
        expect(controlModel.margin).toEqual(margin);
        expect(controlModel.padding).toEqual(padding);
        expect(controlModel.visible).toEqual(visible);
    });
    it('allows to call the setMultipleProperties method to update just one property without updating others', function () {
        controlModel.setMultipleProperties(completeSettings);
        settings = {
            top: top * 2
        };
        controlModel.setMultipleProperties(settings);
        expect(controlModel.top).toEqual(settings.top);
        expect(controlModel.left).toEqual(left);
        expect(controlModel.width).toEqual(width);
        expect(controlModel.height).toEqual(height);
        expect(controlModel.readOnly).toEqual(readOnly);
        expect(controlModel.foreground).toEqual(foreground);
        expect(controlModel.fontSize).toEqual(fontSize);
        expect(controlModel.fontFamily).toEqual(fontFamily);
        expect(controlModel.fontStyle).toEqual(fontStyle);
        expect(controlModel.fontWeight).toEqual(fontWeight);
        expect(controlModel.textDecoration).toEqual(textDecoration);
        expect(controlModel.labelId).toEqual(labelId);
        expect(controlModel.controlResizeMode).toEqual(controlResizeMode);
        expect(controlModel.borderWidth).toEqual(borderWidth);
        expect(controlModel.margin).toEqual(margin);
        expect(controlModel.padding).toEqual(padding);
        expect(controlModel.visible).toEqual(visible);
    });
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.left).toEqual(otherSettings.left);
        expect(controlModel.top).toEqual(otherSettings.top);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.height).toEqual(otherSettings.height);
        expect(controlModel.readOnly).toEqual(otherSettings.readOnly);
        expect(controlModel.foreground).toEqual(otherSettings.foreground);
        expect(controlModel.fontSize).toEqual(otherSettings.fontSize);
        expect(controlModel.fontFamily).toEqual(otherSettings.fontFamily);
        expect(controlModel.fontStyle).toEqual(otherSettings.fontStyle);
        expect(controlModel.fontWeight).toEqual(otherSettings.fontWeight);
        expect(controlModel.textDecoration).toEqual(otherSettings.textDecoration);
        expect(controlModel.labelId).toEqual(otherSettings.labelId);
        expect(controlModel.controlResizeMode).toEqual(otherSettings.controlResizeMode);
        expect(controlModel.borderWidth).toEqual(otherSettings.borderWidth);
        expect(controlModel.margin).toEqual(otherSettings.margin);
        expect(controlModel.padding).toEqual(otherSettings.padding);
        expect(controlModel.visible).toEqual(otherSettings.visible);
    });
});
//# sourceMappingURL=niVisualModel.Test.js.map