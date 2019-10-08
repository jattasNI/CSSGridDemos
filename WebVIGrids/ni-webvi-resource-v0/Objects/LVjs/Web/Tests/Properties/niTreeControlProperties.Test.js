//****************************************
// G Property Tests for TreeControlModel class
// National Instruments Copyright 2018
//****************************************
import { TreeModel } from '../../Modeling/niTreeModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A Tree control', function () {
    'use strict';
    let controlId;
    let viModel, frontPanelControls, controlModel, viewModel, controlElement, treeSettings, updateSettings, updateService;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    const NIType = window.NIType;
    const NITypeNames = window.NITypeNames;
    const oldDataSource = [{ "Path": "A", "Column0": "Grandparent" }, { "Path": "A\\B\\C", "Column0": "Child" }];
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.treeSettings.niControlId;
            treeSettings = fixture.treeSettings;
            Object.freeze(treeSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    beforeEach(function (done) {
        const treeType = (new NIType({
            name: NITypeNames.CLUSTER,
            fields: ["Path", "Column0"],
            subtype: [NITypeNames.STRING, NITypeNames.STRING]
        }).makeArray(1)).toJSON();
        updateSettings = {
            niType: treeType,
            allowSelection: true
        };
        webAppHelper.createNIElement(treeSettings);
        testHelpers.runMultipleAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            viewModel = viModel.getControlViewModel(controlId);
            controlElement = viewModel.element;
        }, function () {
            webAppHelper.dispatchMessage(treeSettings.niControlId, updateSettings);
            webAppHelper.dispatchMessage(treeSettings.niControlId, { dataSource: oldDataSource });
        }, function () {
            testHelpers.runAsyncScheduler(done);
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
    it('property set for tree selection state updates tree selection.', function (done) {
        let rows = controlElement.jqref.jqxTreeGrid('getRows');
        testHelpers.runMultipleAsync(done, function () {
            expect(rows[0].expanded).not.toEqual(true);
            viewModel.setGPropertyValue(TreeModel.SELECTION_G_PROPERTY_NAME, "A\\B\\C");
        }, function () {
            rows = controlElement.jqref.jqxTreeGrid('getRows');
            expect(rows[0].expanded).toEqual(true);
            expect(controlElement.selection).toEqual(["A\\B\\C"]);
        });
    });
    it('property set for invalid tree selection throws.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(TreeModel.SELECTION_G_PROPERTY_NAME, "A");
        }, function () {
            expect(viewModel.model.selection).toEqual(['A']);
        }, function () {
            const setInvalidSelection = () => {
                viewModel.setGPropertyValue(TreeModel.SELECTION_G_PROPERTY_NAME, "D");
            };
            expect(setInvalidSelection).toThrow();
            expect(viewModel.model.selection).toEqual(['A']);
        });
    });
    it('property set for tree selection followed by data update that still has selected path maintains selection.', function (done) {
        const rows = controlElement.jqref.jqxTreeGrid('getRows');
        testHelpers.runMultipleAsync(done, function () {
            expect(rows[0].expanded).not.toEqual(true);
            viewModel.setGPropertyValue(TreeModel.SELECTION_G_PROPERTY_NAME, "A\\B\\C");
        }, function () {
            const newDataSource = [{ "Path": "A", "Column0": "Grandparent" }, { "Path": "A\\B\\C", "Column0": "Child" }, { "Path": "A\\B", "Column0": "Parent" }];
            webAppHelper.dispatchMessage(treeSettings.niControlId, { dataSource: newDataSource });
        }, function () {
            expect(controlElement.selection).toEqual(["A\\B\\C"]);
        });
    });
    it('property set for tree selection followed by data update that does not have selected path returns no selection.', function (done) {
        const rows = controlElement.jqref.jqxTreeGrid('getRows');
        controlElement.allowSelection = true;
        testHelpers.runMultipleAsync(done, function () {
            expect(rows[0].expanded).not.toEqual(true);
            viewModel.setGPropertyValue(TreeModel.SELECTION_G_PROPERTY_NAME, "A\\B\\C");
        }, function () {
            const newDataSource = [{ "Path": "A", "Column0": "Grandparent" }, { "Path": "A\\B", "Column0": "Parent" }];
            webAppHelper.dispatchMessage(treeSettings.niControlId, { dataSource: newDataSource });
        }, function () {
            const selection = viewModel.getGPropertyValue(TreeModel.SELECTION_G_PROPERTY_NAME);
            expect(selection).toEqual("");
        });
    });
    it('property get for tree selected data succeeds after selection is set.', function (done) {
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(TreeModel.SELECTION_G_PROPERTY_NAME, "A\\B\\C");
            const selectedData = viewModel.getGPropertyValue(TreeModel.SELECTED_DATA_G_PROPERTY_NAME);
            expect(selectedData).toEqual({
                "Path": "A\\B\\C",
                "Column0": "Child"
            });
        });
    });
    it('property get for tree selected data returns empty strings for column data after invalid selection is set.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            const setInvalidSelection = () => {
                viewModel.setGPropertyValue(TreeModel.SELECTION_G_PROPERTY_NAME, "D");
            };
            expect(setInvalidSelection).toThrow();
        }, function () {
            const selectedData = viewModel.getGPropertyValue(TreeModel.SELECTED_DATA_G_PROPERTY_NAME);
            expect(selectedData).toEqual({
                "Path": "",
                "Column0": ""
            });
        });
    });
    it('property get for tree selected data returns updated values for column data after dataSource is changed.', function (done) {
        testHelpers.runAsync(done, function () {
            // dataSource has been set by the beforeAll function
            // set selection to some record in that dataSource
            webAppHelper.dispatchMessage(controlId, {
                selection: ['A\\B\\C']
            });
            // Confirm that when we read selectedData, it gives us back the record we just selected
            const oldSelectedData = viewModel.getGPropertyValue(TreeModel.SELECTED_DATA_G_PROPERTY_NAME);
            expect(oldSelectedData).toEqual({
                "Path": "A\\B\\C",
                "Column0": "Child"
            });
            // Now, change out the row we have selected to have different data.
            const expectedValue = { "Path": "A\\B\\C", "Column0": "DataUpdated!" };
            const newDataSource = [{ "Path": "A", "Column0": "Grandparent" }, expectedValue];
            webAppHelper.dispatchMessage(controlId, {
                dataSource: newDataSource
            });
            // Finally, check that when we read selectedData, without waiting on an animation frame, we get the updated record we just set.
            const newSelectedData = viewModel.getGPropertyValue(TreeModel.SELECTED_DATA_G_PROPERTY_NAME);
            expect(newSelectedData).toEqual(expectedValue);
        });
    });
    it('property set for selection with leading or trailing backslashes succeeds.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(TreeModel.SELECTION_G_PROPERTY_NAME, ["\\A\\B\\"]);
        }, function () {
            expect(controlElement.selection).toEqual(["A\\B"]);
            expect(controlModel.selection).toEqual(["A\\B"]);
        });
    });
    it('property set for selection with a path that contains two or more consequtive backslashes throws.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            const setInvalidSelection = function () {
                viewModel.setGPropertyValue(TreeModel.SELECTION_G_PROPERTY_NAME, ["A\\\\\\B"]);
            };
            expect(setInvalidSelection).toThrow();
        }, function () {
            expect(controlElement.selection).toEqual([]);
            expect(controlModel.selection).toEqual([]);
        });
    });
    it('property set for empty selection clears tree selection.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(TreeModel.SELECTION_G_PROPERTY_NAME, ['']);
        }, function () {
            const selection = controlElement.jqref.jqxTreeGrid('getSelection');
            expect(selection.length).toEqual(0);
            expect(controlElement.selection).toEqual([]);
            expect(controlModel.selection).toEqual([]);
        }, function () {
            viewModel.setGPropertyValue(TreeModel.SELECTION_G_PROPERTY_NAME, []);
        }, function () {
            const selection = controlElement.jqref.jqxTreeGrid('getSelection');
            expect(selection.length).toEqual(0);
            expect(controlElement.selection).toEqual([]);
            expect(controlModel.selection).toEqual([]);
        });
    });
    it('property set for tree column headers succeeds.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(TreeModel.COLUMN_HEADERS_G_PROPERTY_NAME, ["Header1", "Header2"]);
        }, function () {
            expect(controlElement.columnHeaders).toEqual(["Header1", "Header2"]);
        });
    });
    it('property read for Value returns the current value.', function (done) {
        const newDataSource = [{ "Path": "A", "Column0": "Grandparent" }, { "Path": "A\\B\\C", "Column0": "Child" }, { "Path": "A\\B", "Column0": "Parent" }];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(controlId, {
                dataSource: newDataSource
            });
        }, function () {
            const currentValue = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
            expect(currentValue).toEqual(newDataSource);
        });
    });
    it('property set for Value updates model.', function (done) {
        const newDataSource = [{ "Path": "A", "Column0": "Grandparent" }, { "Path": "A\\B\\C", "Column0": "Child" }, { "Path": "A\\B", "Column0": "Parent" }];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newDataSource);
        }, function () {
            expect(controlModel.dataSource).toEqual(newDataSource);
        });
    });
    it('property set for Value updates control element.', function (done) {
        const newDataSource = [{ "Path": "A", "Column0": "Grandparent" }, { "Path": "A\\B\\C", "Column0": "Child" }, { "Path": "A\\B", "Column0": "Parent" }];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newDataSource);
            expect(controlModel.dataSource).toEqual(newDataSource);
        }, function () {
            expect(controlElement.dataSource).toEqual(newDataSource);
        });
    });
    it('property set for Value does not call controlChanged function of updateService', function (done) {
        const newDataSource = [{ "Path": "A", "Column0": "Grandparent" }, { "Path": "A\\B\\C", "Column0": "Child" }, { "Path": "A\\B", "Column0": "Parent" }];
        testHelpers.runMultipleAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newDataSource);
        }, function () {
            expect(updateService.controlChanged).not.toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling calls controlChanged function of updateService with correct arguments', function (done) {
        const newDataSource = [{ "Path": "A", "Column0": "Grandparent" }, { "Path": "A\\B\\C", "Column0": "Child" }, { "Path": "A\\B", "Column0": "Parent" }];
        testHelpers.runMultipleAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newDataSource);
        }, function () {
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'dataSource', newDataSource, oldDataSource);
        });
    });
    it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
        const newDataSource = treeSettings.dataSource;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newDataSource);
            expect(updateService.controlChanged).toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling updates model.', function (done) {
        const newDataSource = [{ "Path": "A", "Column0": "Grandparent" }, { "Path": "A\\B\\C", "Column0": "Child" }, { "Path": "A\\B", "Column0": "Parent" }];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newDataSource);
        }, function () {
            expect(controlModel.dataSource).toEqual(newDataSource);
        });
    });
    it('property set for valueSignaling updates control element.', function (done) {
        const newDataSource = [{ "Path": "A", "Column0": "Grandparent" }, { "Path": "A\\B\\C", "Column0": "Child" }, { "Path": "A\\B", "Column0": "Parent" }];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newDataSource);
            expect(controlModel.dataSource).toEqual(newDataSource);
        }, function () {
            expect(controlElement.dataSource).toEqual(newDataSource);
        });
    });
});
//# sourceMappingURL=niTreeControlProperties.Test.js.map