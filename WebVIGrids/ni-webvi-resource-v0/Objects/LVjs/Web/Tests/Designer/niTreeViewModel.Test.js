//****************************************
// Tests for TreeViewModel class
// National Instruments Copyright 2018
//****************************************
import { DeepCopyConverter as DEEP_COPY_CONVERTER } from '../../Framework/ValueConverters/niDeepCopyValueConverter.js';
import { TreeHelpers as TREE_HELPERS } from '../../Elements/jqxtreehelpers.js';
import { TreeModel } from '../../Modeling/niTreeModel.js';
describe('A TreeControlViewModel', function () {
    'use strict';
    let controlId = 'TreeControlViewModelId';
    let viModel, frontPanelControls, controlModel, controlElement, treeSettings;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let updateSettings;
    const pathFieldName = 'MyPath';
    const data0FieldName = 'MyData';
    const newDataSourceType = new window.NIType({
        name: window.NITypeNames.CLUSTER,
        fields: [pathFieldName, data0FieldName],
        subtype: [window.NITypeNames.STRING, window.NITypeNames.STRING]
    }).makeArray(1);
    const newDataSource = [
        {
            [pathFieldName]: 'A',
            [data0FieldName]: 'Grandparent'
        },
        {
            [pathFieldName]: 'A\\B',
            [data0FieldName]: 'Parent'
        },
        {
            [pathFieldName]: 'A\\B\\C',
            [data0FieldName]: 'Child'
        }
    ];
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
    });
    beforeEach(function () {
        const treeType = newDataSourceType.toJSON();
        updateSettings = {
            niType: treeType,
            columnHeaders: ['GrandParent', 'Parent', 'Child'],
            columnWidths: ['auto', 50, 40]
        };
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
    const getTableCellValues = function (niTreeElement) {
        niTreeElement.expandAll();
        const tableRows = niTreeElement.querySelectorAll('table tr');
        const result = [];
        for (let i = 0; i < tableRows.length; i++) {
            result[i] = [];
            const cells = tableRows[i].querySelectorAll('td');
            for (let j = 0; j < cells.length; j++) {
                result[i][j] = cells[j].textContent;
            }
        }
        return result;
    };
    const getTableRowBoundingClientRects = function (niTreeElement) {
        const tableRows = niTreeElement.querySelectorAll('table tr');
        const tableRowBoundingClientRects = [];
        for (let i = 0; i < tableRows.length; i++) {
            tableRowBoundingClientRects[i] = tableRows[i].getBoundingClientRect();
        }
        return tableRowBoundingClientRects;
    };
    const getVerticalScrollbarVisibility = function (niTreeElement) {
        const verticalScrollbar = niTreeElement.querySelector('div.jqx-scrollbar');
        // Ensure that the first (or only) scrollbar returned by the above querySelector call is a vertical scrollbar (not a horizontal scrollbar).
        expect(window.getComputedStyle(verticalScrollbar).top).toEqual('0px');
        return window.getComputedStyle(verticalScrollbar).visibility;
    };
    const getTableBoundingClientRect = function (niTreeElement) {
        const table = niTreeElement.querySelectorAll('table');
        const tableBoundingClientRect = table[0].getBoundingClientRect();
        return tableBoundingClientRect;
    };
    const getTableRowHeight = function (niTreeElement) {
        const tableRowBounds = getTableRowBoundingClientRects(niTreeElement);
        return tableRowBounds[0].height;
    };
    const createSingleColumnDataSource = function (numberOfRows, dataValue = '') {
        expect(0).toBeLessThan(numberOfRows);
        expect(numberOfRows).toBeLessThan(27);
        const ASCIICodeForupperCaseLetterA = 65;
        const dataSourceArray = [];
        for (let i = 0; i < numberOfRows; i++) {
            dataSourceArray.push({
                [pathFieldName]: String.fromCharCode(ASCIICodeForupperCaseLetterA + i),
                [data0FieldName]: dataValue
            });
        }
        return dataSourceArray;
    };
    it('allows a tree with data to be added directly to the page.', function (done) {
        $(document.body).append('<ni-tree ni-control-id=\'' + treeSettings.niControlId + '\'' +
            'data-source=\'' + JSON.stringify(newDataSource) + '\'' +
            'ni-type=\'' + updateSettings.niType + '\'' +
            '></ni-tree>');
        testHelpers.runMultipleAsync(done, function () {
            const expectedCellValues = [['A', 'Grandparent'], ['B', 'Parent'], ['C', 'Child']];
            const viewModel = viModel.getControlViewModel(treeSettings.niControlId);
            expect(viewModel).toBeDefined();
            const treeElement = viewModel.element;
            expect(treeElement).toBeDefined();
            const cellValues = getTableCellValues(treeElement);
            expect(cellValues).toEqual(expectedCellValues);
        }, function () {
            webAppHelper.removeNIElement(treeSettings.niControlId);
        });
    });
    it('ensures all rows are visible after the user scrolls to the bottom of a table with a large dataset (vertical scrollbar is visible) and then switches to a small dataset (vertical scrollbar is hidden) (CAR 742251).', function (done) {
        const newTreeSettings = Object.assign({}, treeSettings, { niType: updateSettings.niType, dataSource: createSingleColumnDataSource(16) });
        webAppHelper.createNIElement(newTreeSettings);
        let tableRowBoundsForSixteenRowTable;
        const numberOfRowsInOneRowTable = 1;
        testHelpers.runMultipleAsync(done, function () {
            // Get the bounds of the rows of the table
            const treeElement = viModel.getControlViewModel(treeSettings.niControlId).element;
            tableRowBoundsForSixteenRowTable = getTableRowBoundingClientRects(treeElement);
            expect(getVerticalScrollbarVisibility(treeElement)).toEqual('visible');
            // Set the scroll offset "top" position to be twice the amount as what the table height will be with the small one row data source
            const rowHeight = getTableRowHeight(treeElement);
            const scrollOffsetTop = 2 * rowHeight * numberOfRowsInOneRowTable;
            treeElement.jqref.jqxTreeGrid('scrollOffset', scrollOffsetTop, 0);
            // Ensure that setting the scrolloffset did indeed move the table row as we expect
            const tableRowBoundsForSixteenRowTableAfterSettingScrollOffset = getTableRowBoundingClientRects(treeElement);
            expect(tableRowBoundsForSixteenRowTable[0].y - scrollOffsetTop).toBeCloseTo(tableRowBoundsForSixteenRowTableAfterSettingScrollOffset[0].y);
            // Change the datasource of the table so that there is just one row
            webAppHelper.dispatchMessage(treeSettings.niControlId, { dataSource: createSingleColumnDataSource(1) });
        }, function () {
            const treeElement = viModel.getControlViewModel(treeSettings.niControlId).element;
            // Get the coordinates of the first row of the table and ensure there is only one row in the table
            const tableRowBoundsForOneRowTable = getTableRowBoundingClientRects(treeElement);
            expect(tableRowBoundsForOneRowTable.length).toEqual(numberOfRowsInOneRowTable);
            // Ensure the y position of the first row with the original large datasource is the same as the y position after the scroll
            // offset has been changed and then the new small datasource has been set. This ensures that the first row on the table with
            // the small datasource is visible (CAR 742251).
            expect(tableRowBoundsForSixteenRowTable[0].y).toBeCloseTo(tableRowBoundsForOneRowTable[0].y);
        }, function () {
            webAppHelper.removeNIElement(treeSettings.niControlId);
        });
    });
    describe('Ensures scroll offset does not change after updating tree data with new data that has the same amount of rows.', function () {
        beforeEach(function () {
            const newTreeSettings = Object.assign({}, treeSettings, { niType: updateSettings.niType, dataSource: createSingleColumnDataSource(16) });
            webAppHelper.createNIElement(newTreeSettings);
        });
        afterEach(function () {
            webAppHelper.removeNIElement(treeSettings.niControlId);
        });
        it('scroll offset starts at the bottom of the table', function (done) {
            let scrollOffsetBeforeDataSourceChange;
            testHelpers.runMultipleAsync(done, function () {
                const treeElement = viModel.getControlViewModel(treeSettings.niControlId).element;
                const tableBounds = getTableBoundingClientRect(treeElement);
                // The maximum possible scrolloffset is less than tableBounds.height (since the height of the table is not 0),
                // so in this case JQX will adjust to the maximum possible scroll offset.
                treeElement.jqref.jqxTreeGrid('scrollOffset', tableBounds.height, 0);
                scrollOffsetBeforeDataSourceChange = treeElement.jqref.jqxTreeGrid('scrollOffset');
                webAppHelper.dispatchMessage(treeSettings.niControlId, { dataSource: createSingleColumnDataSource(16, 'new data') });
            }, function () {
                const treeElement = viModel.getControlViewModel(treeSettings.niControlId).element;
                const scrollOffsetAfterDataSourceChange = treeElement.jqref.jqxTreeGrid('scrollOffset');
                expect(scrollOffsetBeforeDataSourceChange.top).toEqual(scrollOffsetAfterDataSourceChange.top);
            });
        });
        it('scroll offset starts somewhere in the middle of the table.', function (done) {
            let scrollOffsetBeforeDataSourceChange;
            testHelpers.runMultipleAsync(done, function () {
                const treeElement = viModel.getControlViewModel(treeSettings.niControlId).element;
                const rowHeight = getTableRowHeight(treeElement);
                const scrollOffsetTop = 1.5 * rowHeight;
                treeElement.jqref.jqxTreeGrid('scrollOffset', scrollOffsetTop, 0);
                scrollOffsetBeforeDataSourceChange = treeElement.jqref.jqxTreeGrid('scrollOffset');
                webAppHelper.dispatchMessage(treeSettings.niControlId, { dataSource: createSingleColumnDataSource(16, 'new data') });
            }, function () {
                const treeElement = viModel.getControlViewModel(treeSettings.niControlId).element;
                const scrollOffsetAfterDataSourceChange = treeElement.jqref.jqxTreeGrid('scrollOffset');
                expect(scrollOffsetBeforeDataSourceChange.top).toEqual(scrollOffsetAfterDataSourceChange.top);
            });
        });
        it('scroll offset starts at the top of the table.', function (done) {
            let scrollOffsetBeforeDataSourceChange;
            testHelpers.runMultipleAsync(done, function () {
                const treeElement = viModel.getControlViewModel(treeSettings.niControlId).element;
                const scrollOffsetTop = 0;
                treeElement.jqref.jqxTreeGrid('scrollOffset', scrollOffsetTop, 0);
                scrollOffsetBeforeDataSourceChange = treeElement.jqref.jqxTreeGrid('scrollOffset');
                webAppHelper.dispatchMessage(treeSettings.niControlId, { dataSource: createSingleColumnDataSource(16, 'new data') });
            }, function () {
                const treeElement = viModel.getControlViewModel(treeSettings.niControlId).element;
                const scrollOffsetAfterDataSourceChange = treeElement.jqref.jqxTreeGrid('scrollOffset');
                expect(scrollOffsetBeforeDataSourceChange.top).toEqual(scrollOffsetAfterDataSourceChange.top);
            });
        });
    });
    describe('updates its element\'s dataSource property when its model\'s does', function () {
        let viewModel;
        beforeEach(function (done) {
            controlElement = webAppHelper.createNIElement(treeSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        const getAllRowsFlatArray = function (treeElement) {
            return treeElement.jqref.jqxTreeGrid('source').records.map(row => controlElement.jqref.jqxTreeGrid('getRow', row.id));
        };
        it('first verifies initial values', function () {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlElement).toBeDefined();
            expect(controlElement.dataSource).toEqual(treeSettings.dataSource);
        });
        it('and accepts a valid dataSource', function (done) {
            webAppHelper.dispatchMessage(controlId, { niType: updateSettings.niType, dataSource: newDataSource });
            testHelpers.runAsync(done, function () {
                expect(controlElement.dataSource).toEqual(newDataSource);
            });
        });
        it('and maintains expand/collapsed row state after a dataSource change which affects paths', function (done) {
            let dataSourceWithUpdatedPaths = DEEP_COPY_CONVERTER.deepCopy(newDataSource);
            dataSourceWithUpdatedPaths[0][pathFieldName] = 'NewA';
            dataSourceWithUpdatedPaths[1][pathFieldName] = 'NewA\\NewB';
            dataSourceWithUpdatedPaths[2][pathFieldName] = 'NewA\\NewB\\NewC';
            dataSourceWithUpdatedPaths = dataSourceWithUpdatedPaths.concat(DEEP_COPY_CONVERTER.deepCopy(newDataSource));
            let expandedPathsBefore, expandedPathsAfter;
            const pathDataField = TREE_HELPERS.getJqxDataFieldName(pathFieldName);
            webAppHelper.dispatchMessage(controlId, { niType: updateSettings.niType, dataSource: newDataSource });
            testHelpers.runMultipleAsync(done, function () {
                // Expand all rows, row-by-row (which triggers the same event / code path as interactive expand, whereas calling expandAll does not)
                getAllRowsFlatArray(controlElement).forEach(row => controlElement.jqref.jqxTreeGrid('expandRow', row.id));
                expandedPathsBefore = getAllRowsFlatArray(controlElement).filter(row => row.expanded).map(row => row[pathDataField]);
                webAppHelper.dispatchMessage(controlId, { dataSource: dataSourceWithUpdatedPaths });
            }, function () {
                expandedPathsAfter = getAllRowsFlatArray(controlElement).filter(row => row.expanded).map(row => row[pathDataField]);
                expect(expandedPathsAfter).toEqual(expandedPathsBefore);
            });
        });
        it('and accepts paths with leading or trailing blackslashes', function (done) {
            webAppHelper.dispatchMessage(controlId, { niType: updateSettings.niType, dataSource: [{ [pathFieldName]: '\\A\\B\\' }] });
            testHelpers.runAsync(done, function () {
                const actualData = controlElement.jqref.jqxTreeGrid('source')._source.localdata;
                const pathDataField = TREE_HELPERS.getJqxDataFieldName(pathFieldName);
                expect(actualData.length).toEqual(2);
                expect(actualData.every(node => node[pathDataField] === 'A\\B' || node[pathDataField] === 'A')).toBe(true);
            });
        });
        it('but rejects a null dataSource', function (done) {
            const nullDataSource = null;
            webAppHelper.dispatchMessage(controlId, { dataSource: nullDataSource });
            testHelpers.runAsync(done, () => expect(controlElement.dataSource).toEqual(treeSettings.dataSource));
        });
        it('but rejects an invalid dataSource', function (done) {
            const invalidDataSource = ['Grandparent', 'Parent', 'Child'];
            webAppHelper.dispatchMessage(controlId, { dataSource: invalidDataSource });
            testHelpers.runAsync(done, () => expect(controlElement.dataSource).toEqual(treeSettings.dataSource));
        });
        it('but omits rows with paths containing two or more consequtive backslashes', function (done) {
            webAppHelper.dispatchMessage(controlId, { niType: updateSettings.niType, dataSource: [{ [pathFieldName]: 'A\\B' }, { [pathFieldName]: 'B\\\\C' }] });
            testHelpers.runAsync(done, () => {
                const actualData = controlElement.jqref.jqxTreeGrid('source')._source.localdata;
                const pathDataField = TREE_HELPERS.getJqxDataFieldName(pathFieldName);
                expect(actualData.length).toEqual(2);
                expect(actualData.every(node => node[pathDataField] === 'A\\B' || node[pathDataField] === 'A')).toBe(true);
            });
        });
        it('but omits rows with paths that are empty', function (done) {
            webAppHelper.dispatchMessage(controlId, { niType: updateSettings.niType, dataSource: [{ [pathFieldName]: 'A\\B' }, { [pathFieldName]: '' }] });
            testHelpers.runAsync(done, () => {
                const actualData = controlElement.jqref.jqxTreeGrid('source')._source.localdata;
                const pathDataField = TREE_HELPERS.getJqxDataFieldName(pathFieldName);
                expect(actualData.length).toEqual(2);
                expect(actualData.every(node => node[pathDataField] === 'A\\B' || node[pathDataField] === 'A')).toBe(true);
            });
        });
    });
    describe('renders the correct data in the tabular view', function () {
        beforeEach(function (done) {
            controlElement = webAppHelper.createNIElement(treeSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        const createTypeForFieldNames = function (fieldNames) {
            const treeType = (new window.NIType({
                name: window.NITypeNames.CLUSTER,
                fields: fieldNames,
                subtype: fieldNames.map(field => window.NITypeNames.STRING)
            }).makeArray(1)).toJSON();
            return treeType;
        };
        const createDataSourceAndExpectedResultsForFieldNames = function (fieldNames, rowCount) {
            const dataSource = [];
            const expectedResults = [];
            let lastPath = '';
            const pathFieldName = fieldNames[0];
            for (let i = 0; i < rowCount; i++) {
                const cluster = {};
                expectedResults[i] = [];
                const curPathSegment = pathFieldName + i;
                const curPath = lastPath + curPathSegment;
                cluster[pathFieldName] = curPath;
                expectedResults[i][0] = curPathSegment;
                for (let j = 1; j < fieldNames.length; j++) {
                    cluster[fieldNames[j]] = data0FieldName + i + fieldNames[j];
                    expectedResults[i][j] = cluster[fieldNames[j]];
                }
                dataSource.push(cluster);
                lastPath += curPathSegment + '\\';
            }
            return { dataSource: dataSource, expectedResults: expectedResults };
        };
        it('with standard field names', function (done) {
            const fieldNames = [pathFieldName, data0FieldName];
            const treeType = createTypeForFieldNames(fieldNames);
            const dataSourceAndExpectedResults = createDataSourceAndExpectedResultsForFieldNames(fieldNames, 3);
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: treeType });
            }, function () {
                webAppHelper.dispatchMessage(controlId, { dataSource: dataSourceAndExpectedResults.dataSource });
            }, function () {
                const result = getTableCellValues(controlElement);
                expect(result).toEqual(dataSourceAndExpectedResults.expectedResults);
            });
        });
        it('with single field and nonstandard name', function (done) {
            const fieldNames = ['p'];
            const treeType = createTypeForFieldNames(fieldNames);
            const dataSourceAndExpectedResults = createDataSourceAndExpectedResultsForFieldNames(fieldNames, 1);
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: treeType });
            }, function () {
                webAppHelper.dispatchMessage(controlId, { dataSource: dataSourceAndExpectedResults.dataSource });
            }, function () {
                const result = getTableCellValues(controlElement);
                expect(result).toEqual(dataSourceAndExpectedResults.expectedResults);
            });
        });
        it('with control-reserved field names', function (done) {
            const fieldNames = ['my_path', 'id', 'parentId', 'caption', 'explicit', 'explicitPath', 'visible', '_visible', 'leaf',
                'parent', 'expanded', 'checked', 'selected', 'level', 'icon', 'data'];
            const treeType = createTypeForFieldNames(fieldNames);
            const dataSourceAndExpectedResults = createDataSourceAndExpectedResultsForFieldNames(fieldNames, 3);
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: treeType });
            }, function () {
                webAppHelper.dispatchMessage(controlId, { dataSource: dataSourceAndExpectedResults.dataSource });
            }, function () {
                const result = getTableCellValues(controlElement);
                expect(result).toEqual(dataSourceAndExpectedResults.expectedResults);
            });
        });
        it('when the new data has additional rows or path changes (full refresh)', function (done) {
            const fieldNames = [pathFieldName, data0FieldName];
            const treeType = createTypeForFieldNames(fieldNames);
            const initialSourceAndResults = createDataSourceAndExpectedResultsForFieldNames(fieldNames, 3);
            const updatedSourceAndResults = {
                dataSource: DEEP_COPY_CONVERTER.deepCopy(initialSourceAndResults.dataSource),
                expectedResults: DEEP_COPY_CONVERTER.deepCopy(initialSourceAndResults.expectedResults)
            };
            updatedSourceAndResults.dataSource[3] = {
                [pathFieldName]: 'New Path',
                [data0FieldName]: 'New Column Value'
            };
            updatedSourceAndResults.expectedResults[3] = ['New Path', 'New Column Value'];
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: treeType });
            }, function () {
                webAppHelper.dispatchMessage(controlId, { dataSource: initialSourceAndResults.dataSource });
            }, function () {
                webAppHelper.dispatchMessage(controlId, { dataSource: updatedSourceAndResults.dataSource });
            }, function () {
                const result = getTableCellValues(controlElement);
                expect(result).toEqual(updatedSourceAndResults.expectedResults);
            });
        });
        it('when the new data has the same paths and row count (partial refresh)', function (done) {
            const fieldNames = [pathFieldName, data0FieldName];
            const treeType = createTypeForFieldNames(fieldNames);
            const initialSourceAndResults = createDataSourceAndExpectedResultsForFieldNames(fieldNames, 3);
            const updatedSourceAndResults = {
                dataSource: DEEP_COPY_CONVERTER.deepCopy(initialSourceAndResults.dataSource),
                expectedResults: DEEP_COPY_CONVERTER.deepCopy(initialSourceAndResults.expectedResults)
            };
            for (let i = 0; i < updatedSourceAndResults.dataSource.length; i++) {
                const newValue = 'NewData' + i;
                updatedSourceAndResults.dataSource[i][data0FieldName] = newValue;
                updatedSourceAndResults.expectedResults[i][1] = newValue;
            }
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: treeType });
            }, function () {
                webAppHelper.dispatchMessage(controlId, { dataSource: initialSourceAndResults.dataSource });
            }, function () {
                webAppHelper.dispatchMessage(controlId, { dataSource: updatedSourceAndResults.dataSource });
            }, function () {
                const result = getTableCellValues(controlElement);
                expect(result).toEqual(updatedSourceAndResults.expectedResults);
            });
        });
    });
    describe('dynamically updates properties triggering ModelPropertyChanged', function () {
        beforeEach(function (done) {
            controlElement = webAppHelper.createNIElement(treeSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                webAppHelper.dispatchMessage(controlId, { niType: newDataSourceType, dataSource: newDataSource });
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('for selection', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { allowSelection: true });
            }, function () {
                webAppHelper.dispatchMessage(controlId, { selection: ['A\\B'] });
            }, function () {
                expect(controlElement.selection).toEqual(['A\\B']);
            });
        });
        it('for columnHeaders', function (done) {
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlElement.columnHeaders).toEqual(updateSettings.columnHeaders);
            });
        });
        it('for columnWidths', function (done) {
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlElement.columnWidths).toEqual(updateSettings.columnWidths);
            });
        });
        it('for allowSelection', function (done) {
            webAppHelper.dispatchMessage(controlId, { allowSelection: true });
            testHelpers.runAsync(done, function () {
                expect(controlElement.allowSelection).toEqual(true);
            });
        });
        it('for enabled', function (done) {
            webAppHelper.dispatchMessage(controlId, { enabled: false });
            testHelpers.runAsync(done, function () {
                expect(controlElement.disabled).toEqual(true);
                expect(controlElement.jqref.jqxTreeGrid('disabled')).toEqual(true);
                expect(window.getComputedStyle(controlElement).opacity).toBeLessThan(1.0);
            });
        });
        // Fails Edge because getComputedStyle is returning a "calc()" string rather than the computed style in px
        it('for fontSize #FailsEdge', function (done) {
            const oldLineItemHeight = parseInt(window.getComputedStyle(controlElement.querySelector('div.jqx-grid-header')).height, 10);
            webAppHelper.dispatchMessage(controlId, { fontSize: '28px' });
            testHelpers.runAsync(done, function () {
                const newLineItemHeight = parseInt(window.getComputedStyle(controlElement.querySelector('div.jqx-grid-header')).height, 10);
                expect(oldLineItemHeight).toBeLessThan(newLineItemHeight);
                expect(window.getComputedStyle(controlElement.querySelector('table td')).fontSize).toEqual('28px');
            });
        });
    });
    describe('correctly handles function calls from method nodes', function () {
        let viewModel;
        beforeEach(function (done) {
            controlElement = webAppHelper.createNIElement(treeSettings);
            viewModel = viModel.getControlViewModel(treeSettings.niControlId);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                webAppHelper.dispatchMessage(controlId, { niType: newDataSourceType, dataSource: newDataSource });
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        describe('for \'OpenTreeItem\'', function () {
            it('with empty path.', async (done) => {
                viewModel.invokeInternalControlFunction('open', ['']);
                testHelpers.runAsync(done, function () {
                    expect(Array.from(controlElement._expandedParents)).toEqual(controlElement.dataSource.map(n => n[pathFieldName]));
                });
            });
            it('with non-empty path.', async (done) => {
                viewModel.invokeInternalControlFunction('open', ['A']);
                testHelpers.runAsync(done, function () {
                    expect(Array.from(controlElement._expandedParents)).toEqual(['A']);
                });
            });
            it('with non-empty path and extraneous backslashes.', async (done) => {
                // expect this async function call not to throw.
                viewModel.invokeInternalControlFunction('open', ['\\A\\'])
                    .then(() => {
                    expect(Array.from(controlElement._expandedParents)).toEqual(['A']);
                    done();
                })
                    .catch(() => done.fail(new Error('Expected call to throw')));
            });
            it('with invalid path.', async (done) => {
                // expect this async function call to throw.
                viewModel.invokeInternalControlFunction('open', ['Invalid\\Path'])
                    .then(() => done.fail(new Error('Expected call to throw')))
                    .catch(() => done());
            });
            it('when the given item is already open.', async (done) => {
                makeAsync(done, async function () {
                    await viewModel.invokeInternalControlFunction('open', ['A\\B\\C']);
                    expect(Array.from(controlElement._expandedParents)).toEqual(['A\\B\\C']);
                    await viewModel.invokeInternalControlFunction('open', ['A\\B\\C']);
                    expect(Array.from(controlElement._expandedParents)).toEqual(['A\\B\\C']);
                });
            });
        });
        describe('for \'CloseTreeItem\'', function () {
            beforeEach(function () {
                controlElement.expandAll();
            });
            it('with empty path.', async (done) => {
                viewModel.invokeInternalControlFunction('close', ['']);
                testHelpers.runAsync(done, function () {
                    expect(Array.from(controlElement._expandedParents).length).toBe(0);
                });
            });
            it('with non-empty path.', async (done) => {
                viewModel.invokeInternalControlFunction('close', ['A\\B']);
                testHelpers.runAsync(done, function () {
                    expect(Array.from(controlElement._expandedParents)).toEqual(['A']);
                });
            });
            it('with non-empty path and extraneous backslashes.', async (done) => {
                // expect this async function call not to throw.
                viewModel.invokeInternalControlFunction('close', ['\\A\\B\\'])
                    .then(() => {
                    expect(Array.from(controlElement._expandedParents)).toEqual(['A']);
                    done();
                })
                    .catch(() => done.fail(new Error('Expected call to throw')));
            });
            it('with invalid path.', async (done) => {
                // expect this async function call to throw.
                viewModel.invokeInternalControlFunction('close', ['Invalid\\Path'])
                    .then(() => done.fail(new Error('Expected call to throw')))
                    .catch(() => done());
            });
            it('when the given item is already closed.', async (done) => {
                makeAsync(done, async function () {
                    await viewModel.invokeInternalControlFunction('close', ['A\\B']);
                    expect(Array.from(controlElement._expandedParents)).toEqual(['A']);
                    await viewModel.invokeInternalControlFunction('close', ['A\\B\\C']);
                    expect(Array.from(controlElement._expandedParents)).toEqual(['A']);
                });
            });
        });
    });
    describe('The \'controlEventOccurred\' event', function () {
        beforeEach(function (done) {
            controlElement = webAppHelper.createNIElement(treeSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                webAppHelper.dispatchMessage(controlId, { niType: newDataSourceType, dataSource: newDataSource });
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('is raised in response to expanding a row interactively.', function () {
            const expectedEventData = { 'Location': 'A', 'Data': { [pathFieldName]: 'A', [data0FieldName]: 'Grandparent' } };
            const viewModel = viModel.getControlViewModel(treeSettings.niControlId);
            const internalHandler = spyOn(viewModel.model, 'controlEventOccurred').and.callThrough();
            const treegrid = viewModel.element.jqref;
            treegrid.jqxTreeGrid('expandRow', 1);
            expect(internalHandler).toHaveBeenCalledWith(TreeModel.TREE_ITEM_OPENED_EVENT_NAME, expectedEventData);
        });
    });
});
//# sourceMappingURL=niTreeViewModel.Test.js.map