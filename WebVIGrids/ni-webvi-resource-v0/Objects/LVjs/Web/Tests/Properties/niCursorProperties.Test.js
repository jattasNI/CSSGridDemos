//****************************************
// G Property Tests for niCursorViewModel class
// National Instruments Copyright 2018
//****************************************
import { CursorModel } from '../../Modeling/niCursorModel.js';
import { GraphBaseModel } from '../../Modeling/niGraphBaseModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A CartesianGraph control with a cursor element', function () {
    'use strict';
    let viModel, frontPanelControls, graphModel, graphViewModel, cursorModel, cursorViewModel;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let cartesianGraphSettings, cartesianGraphLabelSettings, cursorSettings, cursorSettings2, cursorId;
    let graphId, graphLabelId;
    // TODO should be removed after we migrate to jasmine >= 2.7 and the `it` blocks support async functions natively
    const makeAsync = function (done, fn) {
        fn().then(() => done()).catch((ex) => done.fail(ex));
    };
    const waitForCursorPositionChange = async function (cursorViewModel) {
        const xPosition = cursorViewModel.getGPropertyValue(CursorModel.X_POSITION_G_PROPERTY_NAME);
        const yPosition = cursorViewModel.getGPropertyValue(CursorModel.Y_POSITION_G_PROPERTY_NAME);
        await testHelpers.waitForAsync(function () {
            return cursorViewModel.getGPropertyValue(CursorModel.X_POSITION_G_PROPERTY_NAME) !== xPosition ||
                cursorViewModel.getGPropertyValue(CursorModel.Y_POSITION_G_PROPERTY_NAME) !== yPosition;
        });
    };
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            graphId = fixture.cartesianGraphSettings2.niControlId;
            graphLabelId = fixture.cartesianGraphLabelSettings2.niControlId;
            cursorId = fixture.cursorSettings.niControlId;
            cartesianGraphSettings = fixture.cartesianGraphSettings2;
            cartesianGraphLabelSettings = fixture.cartesianGraphLabelSettings2;
            cartesianGraphSettings.labelId = graphLabelId;
            cursorSettings = fixture.cursorSettings;
            cursorSettings2 = fixture.cursorSettings2;
            cartesianGraphSettings.followerIds = [];
            cartesianGraphSettings.followerIds.push(graphLabelId);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function (done) {
        Object.freeze(cartesianGraphSettings);
        webAppHelper.createNIElement(cartesianGraphSettings);
        webAppHelper.createNIElement(cursorSettings, graphId);
        webAppHelper.createNIElement(cartesianGraphLabelSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            graphModel = frontPanelControls[graphId];
            cursorModel = frontPanelControls[cursorId];
            cursorViewModel = viModel.getControlViewModel(cursorId);
            graphViewModel = viModel.getControlViewModel(graphId);
        });
    });
    afterEach(function () {
        webAppHelper.removeNIElement(cursorId);
        webAppHelper.removeNIElement(graphLabelId);
        webAppHelper.removeNIElement(graphId);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('property read for cursor property returns the current cursor.', function (done) {
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            const cursorReference = graphViewModel.getGPropertyValue(GraphBaseModel.CURSOR_G_PROPERTY_NAME);
            expect(cursorViewModel).toEqual(cursorReference);
        });
    });
    it('property read for cursor label property returns the current value of cursor label.', function (done) {
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            const cursorlabelValue = cursorViewModel.getGPropertyValue(CursorModel.NAME_G_PROPERTY_NAME);
            expect(cursorlabelValue).toEqual(cursorSettings.label);
        });
    });
    it('property read for cursor visible property returns the current show value of cursor.', function (done) {
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            const cursorVisibleValue = cursorViewModel.getGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME);
            expect(cursorVisibleValue).toEqual(cursorSettings.show);
        });
    });
    it('property set for cursor label property updates the model.', function (done) {
        const expectedCursorName = "cursornew";
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            cursorViewModel.setGPropertyValue(CursorModel.NAME_G_PROPERTY_NAME, expectedCursorName);
            await testHelpers.waitAsync();
            expect(cursorModel.label).toEqual(expectedCursorName);
        });
    });
    it('property set for cursor visible property updates the model.', function (done) {
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            cursorViewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, false);
            expect(cursorModel.show).toEqual(false);
        });
    });
    it('property set for active cursor updates the model.', function (done) {
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            webAppHelper.createNIElement(cursorSettings2, graphId);
            await testHelpers.waitAsync();
            graphViewModel.setGPropertyValue(GraphBaseModel.ACTIVE_CURSOR_G_PROPERTY_NAME, 1);
            await testHelpers.waitAsync();
            expect(graphModel.activeCursor).toEqual(1);
            const cursorReference = graphViewModel.getGPropertyValue(GraphBaseModel.CURSOR_G_PROPERTY_NAME);
            const cursorName = cursorReference.getGPropertyValue(CursorModel.NAME_G_PROPERTY_NAME);
            expect(cursorName).toEqual(cursorSettings2.label);
        });
    });
    it('property get for active cursor returns the new active cursor that is set.', function (done) {
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            webAppHelper.createNIElement(cursorSettings2, graphId);
            graphViewModel.setGPropertyValue(GraphBaseModel.ACTIVE_CURSOR_G_PROPERTY_NAME, 1);
            await testHelpers.waitAsync();
            expect(graphViewModel.getGPropertyValue(GraphBaseModel.ACTIVE_CURSOR_G_PROPERTY_NAME)).toEqual(1);
            const cursorReference = graphViewModel.getGPropertyValue(GraphBaseModel.CURSOR_G_PROPERTY_NAME);
            const cursorName = cursorReference.getGPropertyValue(CursorModel.NAME_G_PROPERTY_NAME);
            expect(cursorName).toEqual(cursorSettings2.label);
        });
    });
    it('property set for active cursor outside range throws error.', function (done) {
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            const setGPropertyActiveCursorFunction = function () {
                graphViewModel.setGPropertyValue(GraphBaseModel.ACTIVE_CURSOR_G_PROPERTY_NAME, 10);
            };
            expect(setGPropertyActiveCursorFunction).toThrow();
        });
    });
    it('property get for cursor if active cursor is currently set out of range throws error.', function (done) {
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            const getGPropertyActiveCursorFunction = function () {
                graphModel.activeCursor = 10;
                graphViewModel.getGPropertyValue(GraphBaseModel.CURSOR_G_PROPERTY_NAME);
            };
            expect(getGPropertyActiveCursorFunction).toThrow();
        });
    });
    it('property set for graph cursor property throws error.', function (done) {
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            const setGPropertyCursorReferenceFunction = function () {
                graphViewModel.setGPropertyValue(GraphBaseModel.CURSOR_G_PROPERTY_NAME, cursorViewModel);
            };
            expect(setGPropertyCursorReferenceFunction).toThrow();
        });
    });
    it('property set for cursor label allows empty string values.', function (done) {
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            cursorViewModel.setGPropertyValue(CursorModel.NAME_G_PROPERTY_NAME, "");
            await testHelpers.waitAsync();
            expect(cursorModel.label).toEqual("");
        });
    });
    it('property set for cursor label allows non ASCII character string values.', function (done) {
        const textWithSpecialCharacters = 'Iñtërnâtiônàlizætiøn☃💩<!-- test comment -->';
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            cursorViewModel.setGPropertyValue(CursorModel.NAME_G_PROPERTY_NAME, textWithSpecialCharacters);
            await testHelpers.waitAsync();
            expect(cursorModel.label).toEqual(textWithSpecialCharacters);
        });
    });
    it('property set for cursor label allows duplicate string values.', function (done) {
        const expectedCursorName = "Cursor 1";
        makeAsync(done, async function () {
            webAppHelper.createNIElement(cursorSettings2, graphId);
            await testHelpers.waitAsync();
            graphViewModel.setGPropertyValue(GraphBaseModel.ACTIVE_CURSOR_G_PROPERTY_NAME, 1);
            const cursorReference = graphViewModel.getGPropertyValue(GraphBaseModel.CURSOR_G_PROPERTY_NAME);
            cursorReference.setGPropertyValue(CursorModel.NAME_G_PROPERTY_NAME, expectedCursorName);
            await testHelpers.waitAsync();
            const actualCursorName = cursorReference.getGPropertyValue(CursorModel.NAME_G_PROPERTY_NAME);
            expect(actualCursorName).toEqual(expectedCursorName);
        });
    });
    it('property get for cursor xPosition and yPosition property returns the current value.', function (done) {
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
            let xPosition, yPosition;
            await testHelpers.waitForAsync(function () {
                xPosition = cursorViewModel.getGPropertyValue(CursorModel.X_POSITION_G_PROPERTY_NAME);
                yPosition = cursorViewModel.getGPropertyValue(CursorModel.Y_POSITION_G_PROPERTY_NAME);
                return xPosition === 0 && yPosition === 1;
            });
            expect(xPosition).toBe(0);
            expect(yPosition).toBe(1);
        });
    });
    it('property set for cursor xPosition and yPosition property updates the element.', function (done) {
        makeAsync(done, async function () {
            cursorViewModel.setGPropertyValue(CursorModel.X_POSITION_G_PROPERTY_NAME, 1);
            cursorViewModel.setGPropertyValue(CursorModel.Y_POSITION_G_PROPERTY_NAME, 2);
            await testHelpers.waitAsync();
            const xPosition = cursorViewModel.getGPropertyValue(CursorModel.X_POSITION_G_PROPERTY_NAME);
            const yPosition = cursorViewModel.getGPropertyValue(CursorModel.Y_POSITION_G_PROPERTY_NAME);
            expect(xPosition).toBe(1);
            expect(yPosition).toBe(2);
        });
    });
    it('property set for cursor xPosition and yPosition property with floating values updates the element.', function (done) {
        makeAsync(done, async function () {
            cursorViewModel.setGPropertyValue(CursorModel.X_POSITION_G_PROPERTY_NAME, 1.0);
            cursorViewModel.setGPropertyValue(CursorModel.Y_POSITION_G_PROPERTY_NAME, 2.0);
            await testHelpers.waitAsync();
            const xPosition = cursorViewModel.getGPropertyValue(CursorModel.X_POSITION_G_PROPERTY_NAME);
            const yPosition = cursorViewModel.getGPropertyValue(CursorModel.Y_POSITION_G_PROPERTY_NAME);
            expect(xPosition).toBe(1);
            expect(yPosition).toBe(2);
        });
    });
    it('property set for cursor xPosition and yPosition property snaps to closest plot value on xy plane.', function (done) {
        makeAsync(done, async function () {
            cursorViewModel.setGPropertyValue(CursorModel.X_POSITION_G_PROPERTY_NAME, 0.7);
            cursorViewModel.setGPropertyValue(CursorModel.Y_POSITION_G_PROPERTY_NAME, 1.6);
            await waitForCursorPositionChange(cursorViewModel);
            const xPosition = cursorViewModel.getGPropertyValue(CursorModel.X_POSITION_G_PROPERTY_NAME);
            const yPosition = cursorViewModel.getGPropertyValue(CursorModel.Y_POSITION_G_PROPERTY_NAME);
            expect(xPosition).toBe(1);
            expect(yPosition).toBe(2);
        });
    });
    it('property set for xPosition and yPosition for free cursor updates the cursor without snapping.', function (done) {
        makeAsync(done, async function () {
            webAppHelper.createNIElement(cursorSettings2, graphId);
            graphViewModel.setGPropertyValue(GraphBaseModel.ACTIVE_CURSOR_G_PROPERTY_NAME, 1);
            await testHelpers.waitAsync();
            expect(graphViewModel.getGPropertyValue(GraphBaseModel.ACTIVE_CURSOR_G_PROPERTY_NAME)).toEqual(1);
            const cursorReference = graphViewModel.getGPropertyValue(GraphBaseModel.CURSOR_G_PROPERTY_NAME);
            cursorReference.setGPropertyValue(CursorModel.X_POSITION_G_PROPERTY_NAME, 0.7);
            cursorReference.setGPropertyValue(CursorModel.Y_POSITION_G_PROPERTY_NAME, 1.6);
            await testHelpers.waitAsync();
            const xPosition = cursorReference.getGPropertyValue(CursorModel.X_POSITION_G_PROPERTY_NAME);
            const yPosition = cursorReference.getGPropertyValue(CursorModel.Y_POSITION_G_PROPERTY_NAME);
            expect(xPosition).toBe(0.7);
            expect(yPosition).toBe(1.6);
        });
    });
    it('property set for xPosition and yPosition for a cursor does not change other cursor positions.', function (done) {
        makeAsync(done, async function () {
            webAppHelper.createNIElement(cursorSettings2, graphId);
            graphViewModel.setGPropertyValue(GraphBaseModel.ACTIVE_CURSOR_G_PROPERTY_NAME, 1);
            await testHelpers.waitAsync();
            expect(graphViewModel.getGPropertyValue(GraphBaseModel.ACTIVE_CURSOR_G_PROPERTY_NAME)).toEqual(1);
            const cursorReference = graphViewModel.getGPropertyValue(GraphBaseModel.CURSOR_G_PROPERTY_NAME);
            cursorReference.setGPropertyValue(CursorModel.X_POSITION_G_PROPERTY_NAME, 0.7);
            cursorReference.setGPropertyValue(CursorModel.Y_POSITION_G_PROPERTY_NAME, 1.6);
            await testHelpers.waitAsync();
            let xPosition, yPosition;
            await testHelpers.waitForAsync(function () {
                // Note: We are validating cursor position of another cursor
                // and not the one modified above.
                xPosition = cursorViewModel.getGPropertyValue(CursorModel.X_POSITION_G_PROPERTY_NAME);
                yPosition = cursorViewModel.getGPropertyValue(CursorModel.Y_POSITION_G_PROPERTY_NAME);
                return xPosition === 0 && yPosition === 1;
            });
            expect(xPosition).toBe(0);
            expect(yPosition).toBe(1);
        });
    });
});
//# sourceMappingURL=niCursorProperties.Test.js.map