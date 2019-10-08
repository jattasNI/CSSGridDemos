//****************************************
// Tests for ni-tree element
// National Instruments Copyright 2019
//****************************************
import { TreeStates } from '../../Framework/niTreeStates.js';
import { TreeValueConverter } from '../../Framework/ValueConverters/niTreeValueConverter.js';
describe('The ni-tree element', function () {
    'use strict';
    const TreeSelectionMode = TreeStates.SelectionModeEnum;
    let tree;
    const testValues = {
        allowSelection: true,
        columnHeaders: ['Path', 'Data'],
        columnHeaderVisible: true,
        columnWidths: [100, 100],
        dataSource: [{
                "Path": 'a',
                "Data": "id=0, h=0"
            },
            {
                "Path": 'a\\b\\c',
                "Data": "id=1, h=2"
            },
            {
                "Path": 'b',
                "Data": "id=2, h=0"
            }
        ],
        niType: new window.NIType({
            name: window.NITypeNames.CLUSTER,
            fields: ["Path", "Data"],
            subtype: [window.NITypeNames.STRING, window.NITypeNames.STRING]
        }).makeArray(1).toJSON(),
        selection: 'a',
        multiSelection: ['a', 'b']
    };
    const initializeTree = function (properties) {
        const tree = document.createElement('ni-tree');
        Object.keys(properties).forEach(propertyName => {
            tree[propertyName] = testValues[propertyName];
        });
        document.body.appendChild(tree);
        return tree;
    };
    const uninitializeTree = function () {
        if (tree !== undefined) {
            document.body.removeChild(tree);
            tree = undefined;
        }
    };
    const testHelpers = window.testHelpers;
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function () {
        domVerifier.captureDomState();
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    describe('The public properties.', function () {
        describe('The \'allowSelection\' property', function () {
            let expectedSelection;
            beforeAll(function () {
                // In order to test whether or not 'allowSelection' is having the expect effects,
                // we need a tree that is properly set up with elements than can be selected.
                tree = initializeTree({
                    niType: testValues.niType,
                    dataSource: testValues.dataSource
                });
                expectedSelection = testValues.selection;
            });
            afterAll(function () {
                uninitializeTree();
            });
            it('defaults to false.', function () {
                expect(tree.allowSelection).toBe(false);
                expect(tree.jqref.jqxTreeGrid('selectionMode')).toBe(TreeValueConverter.convertNIToJQXSelectionMode(TreeSelectionMode.SINGLE));
            });
            it('disallows selection when false.', function () {
                tree.selection = expectedSelection;
                expect(tree.selection).toEqual([]);
            });
            it('can be set to true.', function () {
                tree.allowSelection = true;
                expect(tree.allowSelection).toBe(true);
                expect(tree.jqref.jqxTreeGrid('selectionMode')).toBe(TreeValueConverter.convertNIToJQXSelectionMode(TreeSelectionMode.SINGLE));
            });
            it('allows selection when true.', function () {
                tree.selection = expectedSelection;
                expect(tree.selection).toEqual([expectedSelection]);
            });
            it('clears the current selection when changed to false.', function () {
                tree.allowSelection = false;
                expect(tree.selection).toEqual([]);
            });
        });
        describe('The \'selectionMode\' property', function () {
            let expectedSelection;
            beforeAll(function () {
                tree = initializeTree({
                    niType: testValues.niType,
                    dataSource: testValues.dataSource,
                    allowSelection: true
                });
                expectedSelection = testValues.selection;
            });
            afterAll(function () {
                uninitializeTree();
            });
            it('defaults to singleRow.', function () {
                expect(tree.selectionMode).toBe(TreeSelectionMode.SINGLE);
                expect(tree.jqref.jqxTreeGrid('selectionMode')).toBe(TreeValueConverter.convertNIToJQXSelectionMode(TreeSelectionMode.SINGLE));
            });
            it('can be set to multipleRows.', function () {
                tree.selectionMode = TreeSelectionMode.MULTIPLE;
                expect(tree.jqref.jqxTreeGrid('selectionMode')).toBe(TreeValueConverter.convertNIToJQXSelectionMode(TreeSelectionMode.MULTIPLE));
            });
            it('maintains the current selection when changed from single to multiple.', function () {
                tree.selection = testValues.selection;
                tree.selectionMode = TreeSelectionMode.MULTIPLE;
                expect(tree.selection).toEqual([expectedSelection]);
            });
            it('maintains the first selected item when changed from multiple to single.', function () {
                tree.selectionMode = TreeSelectionMode.MULTIPLE;
                tree.selection = testValues.multiSelection;
                tree.selectionMode = TreeSelectionMode.SINGLE;
                expect(tree.selection).toEqual([expectedSelection]);
            });
            it('maintains an empty selection when changed from multiple to single with no selected items.', function () {
                tree.selection = [];
                tree.selectionMode = TreeSelectionMode.MULTIPLE;
                tree.selectionMode = TreeSelectionMode.SINGLE;
                expect(tree.selection).toEqual([]);
            });
        });
        describe('The \'columnHeaders\' property', function () {
            beforeAll(function () {
                // The 'niType' property is what informs the creation of columns. We need
                // to set a valid niType that will result in columns existing in order to test headers.
                tree = initializeTree({
                    niType: testValues.niType
                });
            });
            afterAll(function () {
                uninitializeTree();
            });
            it('defaults to an empty array.', function () {
                expect(tree.columnHeaders).toEqual([]);
            });
            it('initializes the individual column headers to \' \'', function () {
                const actualHeaders = tree.jqref.jqxTreeGrid('columns').records.map(c => c.text);
                expect(actualHeaders).toEqual([' ', ' ']);
            });
            it('can be larger than the number of columns in the tree.', function () {
                tree.columnHeaders = ['One', 'Two', 'Three', 'Four'];
                expect(tree.columnHeaders).toEqual(['One', 'Two', 'Three', 'Four']);
                const actualHeaders = tree.jqref.jqxTreeGrid('columns').records.map(c => c.text);
                expect(actualHeaders).toEqual(['One', 'Two']);
            });
            // This test only exists because of a bug in the jqxtreegrid where auto-sizing columns doesn't work
            // when a column's header is undefined or empty. The tree coerces it to a single whitespace character.
            // Should this become no long the case, this test can safely be removed.
            it('coerces empty headers to \' \'', function () {
                tree.columnHeaders = [];
                const actualHeaders = tree.jqref.jqxTreeGrid('columns').records.map(c => c.text);
                expect(actualHeaders).toEqual([' ', ' ']);
            });
        });
        describe('The \'columnHeaderVisible\' property', function () {
            beforeAll(function () {
                // We don't need to initialize any other properties in order to test the columnHeaderVisible property.
                tree = initializeTree({});
            });
            afterAll(function () {
                uninitializeTree();
            });
            it('defaults to false.', function () {
                expect(tree.columnHeaderVisible).toBe(false);
                expect(tree.jqref.jqxTreeGrid('showHeader')).toBe(false);
            });
            it('can be set to true.', function () {
                tree.columnHeaderVisible = true;
                expect(tree.columnHeaderVisible).toBe(true);
                expect(tree.jqref.jqxTreeGrid('showHeader')).toBe(true);
            });
        });
        describe('The \'columnWidths\' property', function () {
            beforeAll(function () {
                // The 'niType' property is what informs the creation of columns. We need
                // to set a valid niType that will result in columns existing in order to test widths.
                tree = initializeTree({
                    niType: testValues.niType
                });
            });
            afterAll(function () {
                uninitializeTree();
            });
            it('defaults the first column to \'auto\'', function () {
                expect(tree.columnWidths).toEqual(['auto']);
                expect(tree.jqref.jqxTreeGrid('columns').records[0]._width).toBe('auto');
            });
            it('can be larger than the number of columns in the tree.', function () {
                const expected = [100, 100, 100, 100];
                tree.columnWidths = expected;
                expect(tree.columnWidths).toEqual(expected);
                const actualWidths = tree.jqref.jqxTreeGrid('columns').records.map(c => c.width);
                expect(actualWidths).toEqual([100, 100]);
            });
            it('can be set to a percentage.', function () {
                const expected = ['50%', '50%'];
                tree.columnWidths = expected;
                expect(tree.columnWidths).toEqual(expected);
                const actualWidths = tree.jqref.jqxTreeGrid('columns').records.map(c => c._width);
                expect(actualWidths[0] === actualWidths[1]).toBe(true);
            });
        });
        describe('The \'dataSource\' property', function () {
            beforeAll(function () {
                // We're testing 'dataSource', so don't initialize it here. We do, however, need
                // an niType compatible with the test data in order to actually have anything to display / test.
                tree = initializeTree({
                    niType: testValues.niType
                });
            });
            afterAll(function () {
                uninitializeTree();
            });
            afterEach(function () {
                tree.dataSource = [];
            });
            it('defaults to an empty array.', function () {
                expect(tree.dataSource).toEqual([]);
            });
            it('accepts properly formatted paths.', function () {
                const expected = [{
                        'Path': 'a\\b',
                        'Data': 'Clean Path'
                    }];
                tree.dataSource = expected;
                expect(tree.dataSource).toEqual(expected);
                const treeSource = tree.jqref.jqxTreeGrid('source').records;
                expect(treeSource.length).toBe(2);
                expect(treeSource[0].caption).toBe('a');
                expect(treeSource[1].caption).toBe('b');
            });
            it('accepts paths with a single leading backslash.', function () {
                const expected = [{
                        'Path': '\\a\\b',
                        'Data': '\\Leading Backslash'
                    }];
                tree.dataSource = expected;
                expect(tree.dataSource).toEqual(expected);
                const treeSource = tree.jqref.jqxTreeGrid('source').records;
                expect(treeSource.length).toBe(2);
                expect(treeSource[0].caption).toBe('a');
                expect(treeSource[1].caption).toBe('b');
            });
            it('accepts paths with a single trailing backslash.', function () {
                const expected = [{
                        'Path': 'a\\b\\',
                        'Data': 'Trailing Backslash\\'
                    }];
                tree.dataSource = expected;
                expect(tree.dataSource).toEqual(expected);
                const treeSource = tree.jqref.jqxTreeGrid('source').records;
                expect(treeSource.length).toBe(2);
                expect(treeSource[0].caption).toBe('a');
                expect(treeSource[1].caption).toBe('b');
            });
            it('handles duplicate paths gracefully.', function () {
                const expected = [{
                        'Path': 'a',
                        'Data': 'This Should Exist'
                    },
                    {
                        'Path': 'a\\b',
                        'Data': 'This Should Also Exist'
                    },
                    {
                        'Path': '\\a\\b\\',
                        'Data': 'This Should _NOT_ Exist'
                    }];
                // We should not get an exception when this happens.
                expect(function () {
                    tree.dataSource = expected;
                }).not.toThrow();
                // The value of the 'dataSource' property on ni-tree should not, itself, be mutated.
                expect(tree.dataSource).toEqual(expected);
                // The jqx-treegrid should ignore subsequent duplicates.
                const treeSource = tree.jqref.jqxTreeGrid('source').records;
                expect(treeSource.length).toBe(2);
                expect(treeSource[0].caption).toBe('a');
                expect(treeSource[0].__Data).toBe('This Should Exist');
                expect(treeSource[1].caption).toBe('b');
                expect(treeSource[1].__Data).toBe('This Should Also Exist');
            });
            it('rejects values whose type is not supported.', function () {
                tree.dataSource = ['a', 'a\\b', 'a\\b\\c'];
                expect(tree.dataSource).toEqual([]);
                tree.dataSource = [{
                        "Path": 1,
                        "Data": "One"
                    }, {
                        "Path": 2,
                        "Data": "Two"
                    }];
                expect(tree.dataSource).toEqual([]);
                tree.dataSource = [{
                        "Path": "1",
                        "Data": 1
                    }, {
                        "Path": "2",
                        "Data": 2
                    }];
                expect(tree.dataSource).toEqual([]);
            });
            it('rejects items containing double backslashes.', function () {
                tree.dataSource = [{
                        "Path": 'a\\\\b',
                        "Data": 'Invalid Path'
                    }, {
                        "Path": 'a',
                        "Data": "Valid Path"
                    }];
                const treeSource = tree.jqref.jqxTreeGrid('source').records;
                expect(treeSource.length).toBe(1);
                expect(treeSource[0].__Path).toBe('a');
            });
        });
        describe('The \'niType\' property', function () {
            beforeEach(function () {
                tree = initializeTree({});
            });
            afterEach(function () {
                uninitializeTree();
            });
            it('defaults to empty string.', function () {
                expect(tree.niType).toBe('');
            });
            it('accepts elements whose fields are strings.', function () {
                const supportedType = new window.NIType({
                    name: window.NITypeNames.CLUSTER,
                    fields: ["Path", "SupportedTypeColumn"],
                    subtype: [window.NITypeNames.STRING, window.NITypeNames.STRING]
                }).makeArray(1).toJSON();
                tree.niType = supportedType;
                expect(tree.niType).toBe(supportedType);
                const columns = tree.jqref.jqxTreeGrid('columns').records;
                expect(columns.length).toBe(2);
                expect(columns[0].datafield).toBe('caption'); // The first column is always bound to 'caption'.
                expect(columns[1].datafield).toBe('__SupportedTypeColumn'); // Subsequent columns should be bound to their sanitized field name.
            });
            it('handles elements whose fields are not strings gracefully.', function () {
                const unsupportedType = new window.NIType({
                    name: window.NITypeNames.CLUSTER,
                    fields: ["Path", "UnsupportedTypeColumn"],
                    subtype: [window.NITypeNames.STRING, window.NITypeNames.DOUBLE]
                }).makeArray(1).toJSON();
                // We should not get an exception when this happens.
                expect(function () {
                    tree.niType = unsupportedType;
                }).not.toThrow();
                // The ni-tree property should be what we just set.
                expect(tree.niType).toBe(unsupportedType);
                // We should not create columns for this type.
                const columns = tree.jqref.jqxTreeGrid('columns').records;
                expect(columns.length).toBe(0);
            });
        });
        describe('The \'selectedData\' property', function () {
            let expectedSelectedData;
            beforeEach(function () {
                // In order to test the selectedData property, we need to have data in the tree
                // that is selectable. So we need an niType, a dataSource, and we need to enable
                // the allowSelection property.
                tree = initializeTree({
                    niType: testValues.niType,
                    dataSource: testValues.dataSource,
                    allowSelection: true
                });
                expectedSelectedData = [testValues.dataSource[0]];
            });
            afterEach(function () {
                uninitializeTree();
            });
            it('defaults to empty array.', function () {
                expect(tree.selectedData).toEqual([]);
            });
            xit('is read-only.', function () {
                expect(function () {
                    tree.selectedData = [{
                            Path: 'a',
                            Data: 'Data'
                        }];
                }).toThrow();
            });
            it('is empty when \'allowSelection\' is false.', function () {
                tree.allowSelection = false;
                tree.selection = expectedSelectedData.Path;
                expect(tree.selectedData.length).toBe(0);
            });
            it('returns expected value when implicit record is selected.', function () {
                tree.selection = 'a\\b';
                expect(tree.selectedData).toEqual([{
                        Path: 'a\\b',
                        Data: ''
                    }]);
            });
            it('returns expected value when explicit record is selected.', function () {
                tree.selection = expectedSelectedData[0].Path;
                expect(tree.selectedData).toEqual(expectedSelectedData);
            });
        });
        describe('The \'selection\' property', function () {
            let expectedSelection;
            beforeEach(function () {
                // In order to test the selection property, we need to have data in the tree
                // that is selectable. So we need an niType, a dataSource, and we need to enable
                // the allowSelection property.
                tree = initializeTree({
                    niType: testValues.niType,
                    dataSource: testValues.dataSource,
                    allowSelection: true
                });
                expectedSelection = testValues.selection;
            });
            afterEach(function () {
                uninitializeTree();
            });
            it('defaults to empty array.', function () {
                expect(tree.selection).toEqual([]);
            });
            it('is empty when \'allowSelection\' is false.', function () {
                tree.allowSelection = false;
                tree.selection = expectedSelection;
                expect(tree.selection.length).toBe(0);
                expect(tree.jqref.jqxTreeGrid('getSelection').length).toBe(0);
            });
            it('can be set to an array of selected items when \'selectionMode\' is \'multipleRows\'.', function () {
                tree.allowSelection = true;
                tree.selectionMode = TreeSelectionMode.MULTIPLE;
                tree.selection = ['a', 'b'];
                expect(tree.selection).toEqual(['a', 'b']);
                const actualSelection = tree.jqref.jqxTreeGrid('getSelection');
                expect(actualSelection.length).toBe(2);
                expect(actualSelection[0].__Path).toBe('a');
                expect(actualSelection[1].__Path).toBe('b');
            });
            it('can be set to an implicitly created record.', function () {
                tree.allowSelection = true;
                tree.selection = 'a\\b';
                expect(tree.selection).toEqual(['a\\b']);
                const actualSelection = tree.jqref.jqxTreeGrid('getSelection');
                expect(actualSelection.length).toBe(1);
                expect(actualSelection[0].__Path).toBe('a\\b');
            });
            it('can be set to an explicitly created record.', function () {
                tree.allowSelection = true;
                tree.selection = 'a';
                expect(tree.selection).toEqual(['a']);
                const actualSelection = tree.jqref.jqxTreeGrid('getSelection');
                expect(actualSelection.length).toBe(1);
                expect(actualSelection[0].__Path).toBe('a');
            });
            it('accepts values with leading or trailing backslashes.', function () {
                tree.allowSelection = true;
                tree.selection = '\\a\\b\\';
                expect(tree.selection).toEqual(['a\\b']);
            });
        });
        describe('The \'disabled\' property', function () {
            beforeAll(function () {
                tree = initializeTree({});
            });
            afterAll(function () {
                uninitializeTree();
            });
            it('defaults to false.', function () {
                expect(tree.disabled).toBe(false);
                expect(tree.jqref.jqxTreeGrid('disabled')).toBe(false);
            });
            it('can be set to true.', function () {
                tree.disabled = true;
                expect(tree.disabled).toBe(true);
                expect(tree.jqref.jqxTreeGrid('disabled')).toBe(true);
            });
        });
    });
    describe('The public events', function () {
        describe('The \'foldingChanged\' event', function () {
            beforeEach(function () {
                // In order to test folding-related events, we need to have data that can
                // actually be folded. So we need a dataSource and a compatible niType.
                tree = initializeTree({
                    niType: testValues.niType,
                    dataSource: testValues.dataSource
                });
            });
            afterEach(function () {
                uninitializeTree();
            });
            it('is raised in response to interactive changes.', function () {
                // Spy on the internal event handler; The thing which would raise the ni-tree's custom event.
                const internalHandler = spyOn(tree, '_rowExpansionChangeHandler').and.callThrough();
                // Listen for the ni-tree's custom event.
                let eventReceived = false;
                let path, data, changeType;
                tree.addEventListener('foldingChanged', function (e) {
                    eventReceived = true;
                    path = e.detail.path;
                    data = e.detail.data;
                    changeType = e.detail.changeType;
                });
                // Bypassing ni-tree's API (which would flag / guard against raising the custom event)
                // effectively mimicks an interactive change.
                const treegrid = tree.jqref;
                treegrid.jqxTreeGrid('expandRow', 1);
                // After that, we expect that the internal handler was called, and that the ni-tree
                // raised the custom event in response.
                expect(internalHandler).toHaveBeenCalled();
                expect(eventReceived).toBe(true);
                expect(path).toEqual('a');
                expect(data).toEqual(testValues.dataSource[0]);
                expect(changeType).toEqual('rowExpand');
            });
            it('is not raised in response to programmatic changes.', function () {
                // Listen for the ni-tree's custom event.
                let eventReceived = false;
                tree.addEventListener('foldingChanged', function () {
                    eventReceived = true;
                });
                // Use the ni-tree's 'expand' method to change folding. This should guard against raising the custom event.
                tree.expand(tree.dataSource[0].Path);
                // After that, we expect that the ni-tree did not raise its own custom event.
                expect(eventReceived).toBe(false);
            });
        });
        describe('The \'selectionChange\' event', function () {
            beforeEach(function () {
                // In order to test selection-related events, we need to have data in the tree
                // that is selectable. So we need an niType, a dataSource, and we need to enable
                // the allowSelection property.
                tree = initializeTree({
                    niType: testValues.niType,
                    dataSource: testValues.dataSource,
                    allowSelection: true
                });
            });
            afterEach(function () {
                uninitializeTree();
            });
            it('is raised in response to interactive changes.', function () {
                // Spy on the internal event handler; The thing which would raise the ni-tree's custom event.
                const internalHandler = spyOn(tree, '_interactiveSelectionChangeHandler').and.callThrough();
                // Listen for the ni-tree's custom event.
                let eventReceived = false;
                tree.addEventListener('selectionChange', function () {
                    eventReceived = true;
                });
                // Bypassing ni-tree's API (which would flag / guard against raising the custom event)
                // effectively mimicks an interactive change.
                const treegrid = tree.jqref;
                treegrid.jqxTreeGrid('selectRow', 1);
                // After that, we expect that the internal handler was called, and that the ni-tree
                // raised the custom event in response.
                expect(internalHandler).toHaveBeenCalled();
                expect(eventReceived).toBe(true);
            });
            it('is not raised in response to programmatic changes.', function () {
                // Spy on the internal event handler; The thing which would raise the ni-tree's custom event.
                const internalHandler = spyOn(tree, '_interactiveSelectionChangeHandler').and.callThrough();
                // Listen for the ni-tree's custom event.
                let eventReceived = false;
                tree.addEventListener('selectionChange', function () {
                    eventReceived = true;
                });
                // Use the ni-tree's 'expand' method to change folding. This should guard against raising the custom event.
                tree.selection = tree.dataSource[0].Path;
                // After that, we expect that the ni-tree did handle the jqx event
                // internally to update its state, but did not also raise its own custom event.
                expect(internalHandler).toHaveBeenCalled();
                expect(eventReceived).toBe(false);
            });
            describe('has appropriate event details', function () {
                it('when the previous selection was set programmatically.', function () {
                    const treegrid = tree.jqref;
                    // Programmatically set the selection.
                    tree.selection = tree.dataSource[0].Path;
                    // Spy on the internal event handler; The thing which would raise the ni-tree's custom event.
                    const internalHandler = spyOn(tree, '_interactiveSelectionChangeHandler').and.callThrough();
                    // Listen for the ni-tree's custom event.
                    let eventData = null;
                    tree.addEventListener('selectionChange', function (e) {
                        eventData = e;
                    });
                    // Bypassing ni-tree's API (which would flag / guard against raising the custom event)
                    // effectively mimicks an interactive change.
                    treegrid.jqxTreeGrid('selectRow', 2);
                    // After that, we expect that the ni-tree did handle the jqx event
                    // internally to update its state, but did not also raise its own custom event.
                    expect(internalHandler).toHaveBeenCalled();
                    expect(eventData).not.toBe(null);
                    expect(eventData.detail.newSelection).toEqual(["a\\b"]);
                    expect(eventData.detail.oldSelection).toEqual(["a"]);
                });
                it('when the previous selection was set interactively.', function () {
                    const treegrid = tree.jqref;
                    tree.expandAll();
                    // Programmatically set the selection.
                    treegrid.jqxTreeGrid('selectRow', 1);
                    // Spy on the internal event handler; The thing which would raise the ni-tree's custom event.
                    const internalHandler = spyOn(tree, '_interactiveSelectionChangeHandler').and.callThrough();
                    // Listen for the ni-tree's custom event.
                    let eventData = null;
                    tree.addEventListener('selectionChange', function (e) {
                        eventData = e;
                    });
                    // Bypassing ni-tree's API (which would flag / guard against raising the custom event)
                    // effectively mimicks an interactive change.
                    treegrid.jqxTreeGrid('selectRow', 2);
                    // After that, we expect that the ni-tree did handle the jqx event
                    // internally to update its state, but did not also raise its own custom event.
                    expect(internalHandler).toHaveBeenCalled();
                    expect(eventData).not.toBe(null);
                    expect(eventData.detail.newSelection).toEqual(["a\\b"]);
                    expect(eventData.detail.oldSelection).toEqual(["a"]);
                });
            });
        });
    });
});
//# sourceMappingURL=ni-tree.Test.js.map