//****************************************
// G Property Tests for ChartModel class
// National Instruments Copyright 2018
//****************************************
import { CursorModel } from '../../Modeling/niCursorModel.js';
import { GraphBaseModel } from '../../Modeling/niGraphBaseModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A chart control', function () {
    'use strict';
    let viModel, controlModel, controlElement, frontPanelControls, cursorModel;
    let viewModel, cursorViewModel;
    let chartId, cursorId;
    let chartSettings, cursorSettings, cursorSettings2;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            chartId = fixture.chartSettings.niControlId;
            chartSettings = fixture.chartSettings;
            cursorId = fixture.cursorSettings.niControlId;
            cursorSettings = fixture.cursorSettings;
            cursorSettings2 = fixture.cursorSettings2;
            Object.freeze(chartSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function (done) {
        webAppHelper.createNIElement(chartSettings);
        webAppHelper.createNIElement(cursorSettings, chartId);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            viewModel = viModel.getControlViewModel(chartId);
            controlModel = frontPanelControls[chartId];
            controlElement = viewModel.element;
            cursorModel = frontPanelControls[cursorId];
            cursorViewModel = viModel.getControlViewModel(cursorId);
        });
    });
    afterEach(function () {
        webAppHelper.removeNIElement(cursorId);
        webAppHelper.removeNIElement(chartId);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('property read for Value throws an exception.', function () {
        expect(function () {
            viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
        }).toThrow();
    });
    it('property set for Value throws an exception.', function () {
        expect(function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
        }).toThrow();
    });
    it('property read for Value Signaling throws an exception.', function () {
        expect(function () {
            viewModel.getGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME);
        }).toThrow();
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(chartSettings.left),
            "Top": parseInt(chartSettings.top)
        };
        expect(position).toEqual(expectedPosition);
    });
    it('property set for Position updates model.', function (done) {
        const newPosition = { Left: 106, Top: 206 };
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
            expect(parseInt(controlModel.left)).toEqual(newPosition.Left);
            expect(parseInt(controlModel.top)).toEqual(newPosition.Top);
        });
    });
    it('property set for Position updates control element.', function (done) {
        const newPosition = { Left: 156, Top: 256 };
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
        }, function () {
            const computedStyle = window.getComputedStyle(controlElement);
            expect(parseInt(computedStyle.left)).toEqual(newPosition.Left);
            expect(parseInt(computedStyle.top)).toEqual(newPosition.Top);
        });
    });
    it('property read for cursor property returns the current cursor.', function (done) {
        testHelpers.runAsync(done, function () {
            const cursorReference = viewModel.getGPropertyValue(GraphBaseModel.CURSOR_G_PROPERTY_NAME);
            expect(cursorViewModel).toEqual(cursorReference);
        });
    });
    it('property read for cursor label property returns the current value of cursor label.', function (done) {
        testHelpers.runAsync(done, function () {
            const cursorlabelValue = cursorViewModel.getGPropertyValue(CursorModel.NAME_G_PROPERTY_NAME);
            expect(cursorlabelValue).toEqual(cursorSettings.label);
        });
    });
    it('property set for cursor label property updates the model.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            cursorViewModel.setGPropertyValue(CursorModel.NAME_G_PROPERTY_NAME, "cursornew");
        }, function () {
            expect(cursorModel.label).toEqual("cursornew");
        });
    });
    it('property set for active cursor updates the model.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.createNIElement(cursorSettings2, chartId);
        }, function () {
            viewModel.setGPropertyValue(GraphBaseModel.ACTIVE_CURSOR_G_PROPERTY_NAME, 1);
        }, function () {
            expect(controlModel.activeCursor).toEqual(1);
            const cursorReference = viewModel.getGPropertyValue(GraphBaseModel.CURSOR_G_PROPERTY_NAME);
            const cursorName = cursorReference.getGPropertyValue(CursorModel.NAME_G_PROPERTY_NAME);
            expect(cursorName).toEqual(cursorSettings2.label);
        });
    });
    it('property get for active cursor returns the new active cursor that is set.', function (done) {
        let activeCursorIndex;
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.createNIElement(cursorSettings2, chartId);
            viewModel.setGPropertyValue(GraphBaseModel.ACTIVE_CURSOR_G_PROPERTY_NAME, 1);
        }, function () {
            activeCursorIndex = viewModel.getGPropertyValue(GraphBaseModel.ACTIVE_CURSOR_G_PROPERTY_NAME);
        }, function () {
            expect(activeCursorIndex).toEqual(1);
            const cursorReference = viewModel.getGPropertyValue(GraphBaseModel.CURSOR_G_PROPERTY_NAME);
            const cursorName = cursorReference.getGPropertyValue(CursorModel.NAME_G_PROPERTY_NAME);
            expect(cursorName).toEqual(cursorSettings2.label);
        });
    });
});
//# sourceMappingURL=niChartProperties.Test.js.map