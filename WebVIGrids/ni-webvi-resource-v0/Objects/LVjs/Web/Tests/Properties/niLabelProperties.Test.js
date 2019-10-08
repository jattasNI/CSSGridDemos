//****************************************
// G Property Tests for LabelModel class
// National Instruments Copyright 2018
//****************************************
import { LabelModel } from '../../Modeling/niLabelModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A Label', function () {
    'use strict';
    let viModel, controlModel, controlElement, labelModel, labelElement, viewModel, labelViewModel;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, labelId, booleanButtonSettings, booleanLabelSettings;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.booleanButtonWithLabelSettings.niControlId;
            booleanButtonSettings = fixture.booleanButtonWithLabelSettings;
            labelId = fixture.booleanButtonLabelSettings.niControlId;
            booleanLabelSettings = fixture.booleanButtonLabelSettings;
            booleanButtonSettings.followerIds = [];
            booleanButtonSettings.followerIds.push(labelId);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function (done) {
        Object.freeze(booleanButtonSettings);
        controlElement = webAppHelper.createNIElement(booleanButtonSettings);
        labelElement = webAppHelper.createNIElement(booleanLabelSettings);
        testHelpers.runAsync(done, function () {
            const frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            labelModel = frontPanelControls[labelId];
            viewModel = viModel.getControlViewModel(controlId);
            labelViewModel = viModel.getControlViewModel(labelId);
        });
    });
    afterEach(function () {
        webAppHelper.removeNIElement(controlId);
        webAppHelper.removeNIElement(labelId);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    // Helper function copied to this file
    // TODO should be removed after we migrate to jasmine >= 2.7 and the `it` blocks support async functions natively
    const makeAsync = function (done, fn) {
        fn().then(() => done()).catch((ex) => done.fail(ex));
    };
    // Actual tests
    it('property set for control disabled state updates label disabled state.', function (done) {
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME, true);
            expect(controlModel.enabled).toEqual(false);
            expect(labelModel.enabled).toEqual(false);
            await testHelpers.waitAsync();
            expect(controlElement.disabled).toEqual(true);
            expect(labelElement.disabled).toEqual(true);
        });
    });
    it('label reference get for label throws', function () {
        const getLabelReferenceForLabel = function () {
            labelViewModel.getGPropertyValue(VisualModel.LABEL_G_PROPERTY_NAME);
        };
        expect(getLabelReferenceForLabel).toThrow();
    });
    it('label reference set for a control throws', function () {
        const setLabelReference = function () {
            viewModel.setGPropertyValue(VisualModel.LABEL_G_PROPERTY_NAME, {});
        };
        expect(setLabelReference).toThrow();
    });
    it('reference get for control with label returns the label model', function () {
        const labelReference = viewModel.getGPropertyValue(VisualModel.LABEL_G_PROPERTY_NAME);
        expect(labelReference).toEqual(labelViewModel);
    });
    it('text get for a control label returns the correct label text', function () {
        const labelReference = viewModel.getGPropertyValue(VisualModel.LABEL_G_PROPERTY_NAME);
        const labelText = labelReference.getGPropertyValue(LabelModel.TEXT_G_PROPERTY_NAME);
        expect(labelText).toEqual('Foo');
    });
    it('text set for a control label updates label element', function (done) {
        makeAsync(done, async function () {
            const newLabelText = 'Bar';
            await testHelpers.waitAsync();
            const labelReference = viewModel.getGPropertyValue(VisualModel.LABEL_G_PROPERTY_NAME);
            labelReference.setGPropertyValue(LabelModel.TEXT_G_PROPERTY_NAME, newLabelText);
            await testHelpers.waitAsync();
            expect(labelElement.text).toEqual(newLabelText);
        });
    });
    it('text set for a control label with empty string updates label element', function (done) {
        makeAsync(done, async function () {
            const newLabelText = '';
            await testHelpers.waitAsync();
            const labelReference = viewModel.getGPropertyValue(VisualModel.LABEL_G_PROPERTY_NAME);
            labelReference.setGPropertyValue(LabelModel.TEXT_G_PROPERTY_NAME, newLabelText);
            await testHelpers.waitAsync();
            expect(labelElement.text).toEqual(newLabelText);
        });
    });
    it('text set for a control label with non ASCII string updates label element', function (done) {
        makeAsync(done, async function () {
            const newLabelText = 'Iñtërnâtiônàlizætiøn☃💩😴😄😃⛔🎠🚓🚇<!-- test comment -->';
            await testHelpers.waitAsync();
            const labelReference = viewModel.getGPropertyValue(VisualModel.LABEL_G_PROPERTY_NAME);
            labelReference.setGPropertyValue(LabelModel.TEXT_G_PROPERTY_NAME, newLabelText);
            await testHelpers.waitAsync();
            expect(labelElement.text).toEqual(newLabelText);
        });
    });
    it('text get for a control label after a text set returns the updated label text', function (done) {
        makeAsync(done, async function () {
            const newLabelText = 'Bar';
            await testHelpers.waitAsync();
            const labelReference = viewModel.getGPropertyValue(VisualModel.LABEL_G_PROPERTY_NAME);
            labelReference.setGPropertyValue(LabelModel.TEXT_G_PROPERTY_NAME, newLabelText);
            await testHelpers.waitAsync();
            const updatedText = labelReference.getGPropertyValue(LabelModel.TEXT_G_PROPERTY_NAME);
            expect(updatedText).toEqual(newLabelText);
        });
    });
    it('text set for a hidden control label updates correctly', function (done) {
        makeAsync(done, async function () {
            const newLabelText = 'Bar';
            const labelReference = viewModel.getGPropertyValue(VisualModel.LABEL_G_PROPERTY_NAME);
            await testHelpers.waitAsync();
            labelReference.visible = false;
            await testHelpers.waitAsync();
            labelReference.setGPropertyValue(LabelModel.TEXT_G_PROPERTY_NAME, newLabelText);
            await testHelpers.waitAsync();
            const updatedText = labelReference.getGPropertyValue(LabelModel.TEXT_G_PROPERTY_NAME);
            expect(updatedText).toEqual(newLabelText);
            expect(labelElement.text).toEqual(newLabelText);
        });
    });
    it('property set for control visible state "off", updates label visible state.', function (done) {
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            expect(viewModel.getGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME)).toEqual(true);
            expect(labelViewModel.getGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME)).toEqual(true);
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, false);
            await testHelpers.waitAsync();
            expect(viewModel.getGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME)).toEqual(false);
            expect(labelViewModel.getGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME)).toEqual(false);
        });
    });
    it('property set for Position on control moves the label along with the control.', function (done) {
        makeAsync(done, async function () {
            const newPosition = { Left: 200, Top: 300 };
            const labelPosition = labelViewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
            const controlPosition = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
            await testHelpers.waitAsync();
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
            await testHelpers.waitAsync();
            const newLabelPosition = labelViewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
            const newControlPosition = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
            const leftLabelDifference = labelPosition.Left - newLabelPosition.Left;
            const topLabelDifference = labelPosition.Top - newLabelPosition.Top;
            const leftControlDifference = controlPosition.Left - newControlPosition.Left;
            const topControlDifference = controlPosition.Top - newControlPosition.Top;
            expect(leftLabelDifference).toEqual(leftControlDifference);
            expect(topLabelDifference).toEqual(topControlDifference);
        });
    });
    it('property get for Position returns the current position.', function () {
        const position = labelViewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": 0,
            "Top": 0
        };
        expect(position).toEqual(expectedPosition);
    });
    it('property get for TotalBounds gets the total bounds of the control.', function (done) {
        makeAsync(done, async function () {
            const expectedBounds = {
                Left: 0,
                Top: 0,
                Width: 400,
                Height: 500
            };
            const totalBounds = await viewModel.getGPropertyValue(VisualModel.TOTAL_BOUNDS_G_PROPERTY_NAME);
            expect(totalBounds.Left).toBe(expectedBounds.Left);
            expect(totalBounds.Top).toBe(expectedBounds.Top);
            expect(totalBounds.Width).toBe(expectedBounds.Width);
            expect(totalBounds.Height).toBe(expectedBounds.Height);
        });
    });
    it('property get for TotalBounds does not include hidden label follower.', function (done) {
        makeAsync(done, async function () {
            const expectedBounds = {
                Left: 90,
                Top: 90,
                Width: 310,
                Height: 410
            };
            await testHelpers.waitAsync();
            labelViewModel.model.visible = false;
            await testHelpers.waitAsync();
            const totalBounds = await viewModel.getGPropertyValue(VisualModel.TOTAL_BOUNDS_G_PROPERTY_NAME);
            expect(totalBounds.Left).toBe(expectedBounds.Left);
            expect(totalBounds.Top).toBe(expectedBounds.Top);
            expect(totalBounds.Width).toBe(expectedBounds.Width);
            expect(totalBounds.Height).toBe(expectedBounds.Height);
        });
    });
    it('property set for Position throws error.', function (done) {
        const newPosition = { Left: 100, Top: 200 };
        testHelpers.runAsync(done, function () {
            expect(function () {
                labelViewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
            }).toThrow();
        });
    });
    it('property set for Size throws error.', function (done) {
        const size = { Width: 100, Height: 200 };
        testHelpers.runAsync(done, function () {
            expect(function () {
                labelViewModel.setGPropertyValue(VisualModel.SIZE_G_PROPERTY_NAME, size);
            }).toThrow();
        });
    });
});
//# sourceMappingURL=niLabelProperties.Test.js.map