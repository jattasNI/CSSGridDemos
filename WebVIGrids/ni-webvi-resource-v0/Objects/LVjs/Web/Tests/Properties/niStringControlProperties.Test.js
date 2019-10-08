//****************************************
// G Property Tests for StringControlModel class
// National Instruments Copyright 2018
//****************************************
import { StringControlModel } from '../../Modeling/niStringControlModel.js';
import { StringControlViewModel } from '../../Designer/niStringControlViewModel.js';
import { StringDisplayModeConstants } from '../../Framework/Constants/niStringDisplayModeConstants.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A String control', function () {
    'use strict';
    let controlId;
    let updateService, viModel, frontPanelControls, controlModel, viewModel, controlElement, stringSettings;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    const textDisplayMode = StringDisplayModeConstants.TextDisplayMode;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.stringSettings.niControlId;
            stringSettings = fixture.stringSettings;
            Object.freeze(stringSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    beforeEach(function (done) {
        webAppHelper.createNIElement(stringSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            viewModel = viModel.getControlViewModel(controlId);
            controlElement = viewModel.element;
        });
    });
    afterEach(function () {
        webAppHelper.removeNIElement(controlId);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('property read for Value returns the current text.', function () {
        const currentText = viewModel.getGPropertyValue('Value');
        expect(currentText).toEqual(stringSettings.text);
    });
    it('property set for Value updates model.', function (done) {
        const newText = 'newText';
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newText);
            expect(controlModel.text).toEqual(newText);
        });
    });
    it('property set for Value updates control element.', function (done) {
        const newText = 'string';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newText);
            expect(controlModel.text).toEqual(newText);
        }, function () {
            expect(controlElement.text).toEqual(newText);
        });
    });
    it('property set empty string for Value updates control element.', function (done) {
        const newText = '';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newText);
            expect(controlModel.text).toEqual(newText);
        }, function () {
            expect(controlElement.text).toEqual(newText);
        });
    });
    it('property set non ASCII characters for Value updates control element.', function (done) {
        const newText = 'Iñtërnâtiônàlizætiøn☃💩<!-- test comment -->';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newText);
            expect(controlModel.text).toEqual(newText);
        }, function () {
            expect(controlElement.text).toEqual(newText);
        });
    });
    it('property set multiline text for Value updates control element.', function (done) {
        const newText = `Say hello to
        multi-line
        strings!`;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newText);
            expect(controlModel.text).toEqual(newText);
        }, function () {
            expect(controlElement.text).toEqual(newText);
        });
    });
    it('property set for Value does not call controlChanged function of updateService', function (done) {
        const newText = 'string';
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newText);
            expect(updateService.controlChanged).not.toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling calls controlChanged fuction of updateService with correct arguments.', function (done) {
        const newText = 'string';
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newText);
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'text', newText, stringSettings.text);
        });
    });
    it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
        const newText = stringSettings.text;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newText);
            expect(updateService.controlChanged).toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling updates model.', function (done) {
        const newText = 'string';
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newText);
            expect(controlModel.text).toEqual(newText);
        });
    });
    it('property set for valueSignaling updates control element.', function (done) {
        const newText = 'string';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newText);
            expect(controlModel.text).toEqual(newText);
        }, function () {
            expect(controlElement.text).toEqual(newText);
        });
    });
    it('property read for EnableWrap returns the current word wrap setting.', function () {
        const currentWordWrap = viewModel.getGPropertyValue(StringControlModel.ENABLE_WRAP_G_PROPERTY_NAME);
        expect(currentWordWrap).toEqual(stringSettings.wordWrap);
    });
    it('property set for EnableWrap updates model.', function (done) {
        const newWordWrap = true;
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(StringControlModel.ENABLE_WRAP_G_PROPERTY_NAME, newWordWrap);
            expect(controlModel.wordWrap).toEqual(newWordWrap);
        });
    });
    it('property set for EnableWrap updates control element.', function (done) {
        const newWordWrap = true;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(StringControlModel.ENABLE_WRAP_G_PROPERTY_NAME, newWordWrap);
            expect(controlModel.wordWrap).toEqual(newWordWrap);
        }, function () {
            expect(controlElement.wordWrap).toEqual(true);
        });
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(stringSettings.left),
            "Top": parseInt(stringSettings.top)
        };
        expect(position).toEqual(expectedPosition);
    });
    it('property set for Position updates model.', function (done) {
        const newPosition = { Left: 100, Top: 200 };
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
            expect(parseInt(controlModel.left)).toEqual(newPosition.Left);
            expect(parseInt(controlModel.top)).toEqual(newPosition.Top);
        });
    });
    it('property set for Position updates control element.', function (done) {
        const newPosition = { Left: 150, Top: 250 };
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
        }, function () {
            const computedStyle = window.getComputedStyle(controlElement);
            expect(parseInt(computedStyle.left)).toEqual(newPosition.Left);
            expect(parseInt(computedStyle.top)).toEqual(newPosition.Top);
        });
    });
    it('property get for VerticalScrollBarVisibility returns current VerticalScrollBarVisibility setting.', function () {
        const expectedVerticalScrollBarVisibility = stringSettings.allowVerticalScrollbar ? StringControlViewModel.scrollBarVisibilityEnum.Automatic : StringControlViewModel.scrollBarVisibilityEnum.None;
        const currentVerticalScrollBarVisibility = viewModel.getGPropertyValue(StringControlModel.VERTICAL_SCROLLBAR_VISIBILITY_G_PROPERTY_NAME);
        expect(currentVerticalScrollBarVisibility).toEqual(expectedVerticalScrollBarVisibility);
    });
    it('property set for VerticalScrollBarVisibility updates model.', function () {
        const newVerticalScrollBarVisibility = StringControlViewModel.scrollBarVisibilityEnum.None;
        viewModel.setGPropertyValue(StringControlModel.VERTICAL_SCROLLBAR_VISIBILITY_G_PROPERTY_NAME, newVerticalScrollBarVisibility);
        expect(controlModel.allowVerticalScrollbar).toEqual(false);
    });
    it('property set for VerticalScrollBarVisibility updates control element.', function (done) {
        const newVerticalScrollBarVisibility = StringControlViewModel.scrollBarVisibilityEnum.None;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(StringControlModel.VERTICAL_SCROLLBAR_VISIBILITY_G_PROPERTY_NAME, newVerticalScrollBarVisibility);
        }, function () {
            expect(controlElement.style.getPropertyValue('--ni-overflow-y')).toEqual('hidden');
        });
    });
    it('property get for HorizontalScrollBarVisibility returns current VerticalScrollBarVisibility setting.', function () {
        const expectedHorizontalScrollBarVisibility = stringSettings.allowHorizontalScrollbar ? StringControlViewModel.scrollBarVisibilityEnum.Automatic : StringControlViewModel.scrollBarVisibilityEnum.None;
        const currentHorizontalScrollBarVisibility = viewModel.getGPropertyValue(StringControlModel.HORIZONTAL_SCROLL_BAR_VISIBILITY_G_PROPERTY_NAME);
        expect(currentHorizontalScrollBarVisibility).toEqual(expectedHorizontalScrollBarVisibility);
    });
    it('property set for HorizontalScrollBarVisibility updates model.', function () {
        const newHorizontalScrollBarVisibility = StringControlViewModel.scrollBarVisibilityEnum.Automatic;
        viewModel.setGPropertyValue(StringControlModel.HORIZONTAL_SCROLL_BAR_VISIBILITY_G_PROPERTY_NAME, newHorizontalScrollBarVisibility);
        expect(controlModel.allowHorizontalScrollbar).toEqual(true);
    });
    it('property set for HorizontalScrollBarVisibility updates control element.', function (done) {
        const newHorizontalScrollBarVisibility = StringControlViewModel.scrollBarVisibilityEnum.Automatic;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(StringControlModel.HORIZONTAL_SCROLL_BAR_VISIBILITY_G_PROPERTY_NAME, newHorizontalScrollBarVisibility);
        }, function () {
            expect(controlElement.style.getPropertyValue('--ni-overflow-x')).toEqual('auto');
        });
    });
    it('property get for KeyFocus returns true if the element or one of its descendants has keyboard focus, false otherwise.', function () {
        const previousKeyFocusPropertyValue = viewModel.getGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME);
        expect(previousKeyFocusPropertyValue).toEqual(false);
        viewModel.setGPropertyValue(StringControlModel.KEY_FOCUS_G_PROPERTY_NAME, true);
        const currentKeyFocusPropertyValue = viewModel.getGPropertyValue(StringControlModel.KEY_FOCUS_G_PROPERTY_NAME);
        expect(currentKeyFocusPropertyValue).toEqual(true);
    });
    it('property set true for KeyFocus makes the control the active element in the document.', function () {
        viewModel.setGPropertyValue(StringControlModel.KEY_FOCUS_G_PROPERTY_NAME, true);
        expect(viewModel.element.contains(document.activeElement)).toEqual(true);
        expect(viewModel.element.querySelector('textarea')).toEqual(document.activeElement);
    });
    it('property set false for KeyFocus blurs the control.', function () {
        viewModel.setGPropertyValue(StringControlModel.KEY_FOCUS_G_PROPERTY_NAME, true);
        expect(viewModel.element.contains(document.activeElement)).toEqual(true);
        viewModel.setGPropertyValue(StringControlModel.KEY_FOCUS_G_PROPERTY_NAME, false);
        expect(viewModel.element.contains(document.activeElement)).toEqual(false);
    });
    it('property read for SelectAllOnFocus returns current SelectAllOnFocus setting.', function () {
        const currentSelectAllOnFocus = viewModel.getGPropertyValue(StringControlModel.SELECT_ALL_ON_FOCUS_G_PROPERTY_NAME);
        expect(currentSelectAllOnFocus).toEqual(stringSettings.typeToReplace);
    });
    it('property set for SelectAllOnFocus updates model.', function () {
        const newSelectAllOnFocus = true;
        viewModel.setGPropertyValue(StringControlModel.SELECT_ALL_ON_FOCUS_G_PROPERTY_NAME, newSelectAllOnFocus);
        expect(controlModel.typeToReplace).toEqual(newSelectAllOnFocus);
    });
    it('property set for SelectAllOnFocus updates control element.', function (done) {
        const newSelectAllOnFocus = true;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(StringControlModel.SELECT_ALL_ON_FOCUS_G_PROPERTY_NAME, newSelectAllOnFocus);
            expect(controlModel.typeToReplace).toEqual(newSelectAllOnFocus);
        }, function () {
            expect(controlElement.typeToReplace).toEqual(newSelectAllOnFocus);
        });
    });
    it('property read for ShowEscapeSequences returns current ShowEscapeSequences setting.', function () {
        const newShowEscapeSequences = viewModel.getGPropertyValue(StringControlModel.ESCAPE_SEQUENCE_G_PROPERTY_NAME);
        expect(newShowEscapeSequences).toEqual(false);
    });
    it('property set for ShowEscapeSequences updates model.', function () {
        const newShowEscapeSequences = true;
        viewModel.setGPropertyValue(StringControlModel.ESCAPE_SEQUENCE_G_PROPERTY_NAME, newShowEscapeSequences);
        expect(controlModel.escapedDisplayMode).toEqual(textDisplayMode.ESCAPED);
    });
    it('property set for ShowEscapeSequences updates control element.', function (done) {
        const newShowEscapeSequences = true;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(StringControlModel.ESCAPE_SEQUENCE_G_PROPERTY_NAME, newShowEscapeSequences);
            expect(controlModel.escapedDisplayMode).toEqual(textDisplayMode.ESCAPED);
        }, function () {
            expect(controlElement.escapedDisplayMode).toEqual(textDisplayMode.ESCAPED);
        });
    });
});
//# sourceMappingURL=niStringControlProperties.Test.js.map