"use strict";
//****************************************
// Tests for ArrayViewerModel class
// National Instruments Copyright 2014
//****************************************
// Disabled array of cluster of array of numeric test. It has issues in IE11, and ni-array-viewer will need changes to correctly support that case.
// See TA188396 / US109779.
describe('A ArrayViewerViewModel', function () {
    'use strict';
    const $internalDoNotUse = NationalInstruments.Globals.jQuery;
    let viModel, frontPanelControls, arrayViewerModel, arrayViewerElement;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, arrayViewerSettings, arrayViewerSettings2, arrayViewerWithNumericSettings, arrayViewerWithClusterSettings, arrayViewerWithNumericSettings2, arrayViewerWithNumericSettingsLabel, arrayViewerWithStringSettings, arrayViewerWithStringSettingsLabel, arrayViewerWithBooleanButtonSettings, arrayViewerWithBooleanLEDSettings, clusterSettings;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.arrayViewerSettings.niControlId;
            arrayViewerSettings = fixture.arrayViewerSettings;
            arrayViewerSettings2 = fixture.arrayViewerSettings2;
            arrayViewerWithNumericSettings = fixture.arrayViewerWithNumericSettings;
            arrayViewerWithClusterSettings = fixture.arrayViewerWithClusterSettings;
            arrayViewerWithNumericSettings2 = fixture.arrayViewerWithNumericSettings2;
            arrayViewerWithNumericSettingsLabel = fixture.arrayViewerWithNumericSettingsLabel;
            arrayViewerWithStringSettings = fixture.arrayViewerWithStringSettings;
            arrayViewerWithStringSettingsLabel = fixture.arrayViewerWithStringSettingsLabel;
            arrayViewerWithBooleanButtonSettings = fixture.booleanButtonSettings2;
            arrayViewerWithBooleanLEDSettings = fixture.arrayViewerWithBooleanLEDSettings;
            clusterSettings = fixture.clusterSettings;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    describe('update model property updates element property', function () {
        let viewModel, internalControl;
        beforeEach(function (done) {
            arrayViewerElement = webAppHelper.createNIElement(arrayViewerSettings);
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.createNIElement(arrayViewerWithNumericSettings, controlId);
            }, function () {
                frontPanelControls = viModel.getAllControlModels();
                arrayViewerModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
                internalControl = $internalDoNotUse(arrayViewerElement.firstElementChild);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        describe('sets model properties - ', function () {
            it('rows / columns', function (done) {
                testHelpers.runMultipleAsync(done, function () {
                    arrayViewerModel.rowsAndColumns = '2,1';
                }, function () {
                    viewModel.userInteractionChanged('end', 'move');
                }, function () {
                    expect(internalControl.jqxArray('rows')).toEqual(2);
                });
            });
            it('vertical orientation rows/columns', function (done) {
                testHelpers.runMultipleAsync(done, function () {
                    arrayViewerModel.orientation = 'vertical';
                    arrayViewerModel.rowsAndColumns = '1,2';
                }, function () {
                    expect(internalControl.jqxArray('rows')).toEqual(1);
                    expect(internalControl.jqxArray('columns')).toEqual(2);
                    expect(arrayViewerElement.rowsAndColumns).toEqual('1,2');
                });
            });
            it('dimensions and vertical scrollbar visibility', function (done) {
                testHelpers.runMultipleAsync(done, function () {
                    arrayViewerModel.dimensions = 2;
                    arrayViewerModel.verticalScrollbarVisibility = true;
                }, function () {
                    expect(internalControl.jqxArray('dimensions')).toEqual(2);
                    expect(internalControl.jqxArray('showVerticalScrollbar')).toEqual(true);
                });
            });
            it('index editor width', function (done) {
                testHelpers.runMultipleAsync(done, function () {
                    arrayViewerModel.indexEditorWidth = 50;
                }, function () {
                    expect(internalControl.jqxArray('indexerWidth')).toEqual(50);
                });
            });
            it('index visibility', function (done) {
                testHelpers.runMultipleAsync(done, function () {
                    arrayViewerModel.indexVisibility = false;
                }, function () {
                    expect(internalControl.jqxArray('showIndexDisplay')).toEqual(false);
                });
            });
            it('horizontal scrollbar visibility', function (done) {
                testHelpers.runMultipleAsync(done, function () {
                    arrayViewerModel.horizontalScrollbarVisibility = true;
                }, function () {
                    expect(internalControl.jqxArray('showHorizontalScrollbar')).toEqual(true);
                });
            });
        });
    });
    describe('dynamically updates value triggering ModelPropertyChanged', function () {
        let viewModel;
        beforeEach(function (done) {
            arrayViewerElement = webAppHelper.createNIElement(arrayViewerSettings);
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.createNIElement(arrayViewerWithNumericSettings, controlId);
            }, function () {
                frontPanelControls = viModel.getAllControlModels();
                arrayViewerModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('verifies initial values', function () {
            expect(arrayViewerModel).toBeDefined();
            expect(viewModel).toBeDefined();
        });
        it('changes 1D value', function (done) {
            const numericDownButton = document.querySelector('ni-array-viewer table [jqx-id="downButton"]');
            $(numericDownButton).simulate('click');
            testHelpers.runAsync(done, function () {
                expect(arrayViewerModel.value).toEqual([4]);
            });
        });
        it('changes 2D value', function (done) {
            arrayViewerModel.value = [[2], [3]];
            testHelpers.runAsync(done, function () {
                expect(arrayViewerElement.value).toEqual([[2], [3]]);
            });
        });
    });
    describe('dynamically updates properties on the template element and applies them to the value elements', function () {
        let selector;
        beforeEach(function (done) {
            arrayViewerElement = webAppHelper.createNIElement(arrayViewerSettings);
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.createNIElement(arrayViewerWithNumericSettings, controlId);
            }, function () {
                frontPanelControls = viModel.getAllControlModels();
                arrayViewerModel = frontPanelControls[controlId];
                selector = '[ni-control-id=\'' + controlId + '\']';
                selector = selector + ' div.jqx-array-element-' + arrayViewerElement.childElement.id;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('updates size', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                arrayViewerElement.elementSize = { width: 100, height: 100 };
            }, function () {
                const controls = document.querySelectorAll(selector);
                let i;
                for (i = 0; i < controls.length; i++) {
                    const niControl = controls[i].firstElementChild;
                    expect(niControl.style.width).toEqual('100px');
                    expect(niControl.style.height).toEqual('100px');
                }
                expect(arrayViewerElement.elementSize).toEqual({ width: 100, height: 100 });
            });
        });
        it('updates fontSize', function (done) {
            let viewModel;
            testHelpers.runMultipleAsync(done, function () {
                viewModel = viModel.getControlViewModel('Function10');
                viewModel.model.fontSize = '20px';
            }, function () {
                const controls = document.querySelectorAll(selector);
                expect(controls[0].childNodes[0].style.fontSize).toEqual('20px');
            });
        });
    });
    describe('allows modifying style of array elements', function () {
        let cloneSelector;
        beforeEach(function (done) {
            arrayViewerElement = webAppHelper.createNIElement(arrayViewerSettings);
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.createNIElement(arrayViewerWithBooleanLEDSettings, controlId);
            }, function () {
                frontPanelControls = viModel.getAllControlModels();
                arrayViewerModel = frontPanelControls[controlId];
                cloneSelector = 'jqx-led[ni-template-id=\'' + arrayViewerWithBooleanLEDSettings.niControlId + '\']';
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('updates true background', function (done) {
            let ledControl, ledControlModel, trueBackgroundProperty, trueBackgroundColor;
            testHelpers.runMultipleAsync(done, function () {
                trueBackgroundProperty = '--ni-true-background';
                ledControl = document.querySelector(cloneSelector);
                trueBackgroundColor = ledControl.style.getPropertyValue(trueBackgroundProperty);
                expect(trueBackgroundColor).toEqual('white');
                ledControlModel = viModel.getControlModel('Function11');
                ledControlModel.setMultipleProperties({ 'trueBackground': 'red' });
            }, function () {
                trueBackgroundColor = ledControl.style.getPropertyValue(trueBackgroundProperty);
                expect(trueBackgroundColor).toEqual('red');
            });
        });
        it('updates font size', function (done) {
            let ledControl, ledControlModel, fontSizeProperty, fontSize;
            testHelpers.runMultipleAsync(done, function () {
                fontSizeProperty = 'font-size';
                ledControl = document.querySelector(cloneSelector);
                ledControlModel = viModel.getControlModel('Function11');
                ledControlModel.setMultipleProperties({ 'fontSize': '25px' });
            }, function () {
                fontSize = ledControl.style.getPropertyValue(fontSizeProperty);
                expect(fontSize).toEqual('25px');
            });
        });
    });
    describe('allows modifying style of elements contained in cluster inside an array', function () {
        let cloneSelector;
        beforeEach(function (done) {
            arrayViewerElement = webAppHelper.createNIElement(arrayViewerSettings);
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.createNIElement(clusterSettings, controlId);
                webAppHelper.createNIElement(arrayViewerWithBooleanLEDSettings, clusterSettings.niControlId);
            }, function () {
                frontPanelControls = viModel.getAllControlModels();
                arrayViewerModel = frontPanelControls[controlId];
                cloneSelector = 'jqx-led[ni-template-id=\'' + arrayViewerWithBooleanLEDSettings.niControlId + '\']';
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('updates true background', function (done) {
            let ledControl, ledControlModel, trueBackgroundProperty, trueBackgroundColor;
            testHelpers.runMultipleAsync(done, function () {
                trueBackgroundProperty = '--ni-true-background';
                ledControl = document.querySelector(cloneSelector);
                trueBackgroundColor = ledControl.style.getPropertyValue(trueBackgroundProperty);
                expect(trueBackgroundColor).toEqual('white');
                ledControlModel = viModel.getControlModel('Function11');
                ledControlModel.setMultipleProperties({ 'trueBackground': 'red' });
            }, function () {
                trueBackgroundColor = ledControl.style.getPropertyValue(trueBackgroundProperty);
                expect(trueBackgroundColor).toEqual('red');
            });
        });
        it('updates font size', function (done) {
            let ledControl, ledControlModel, fontSizeProperty, fontSize;
            testHelpers.runMultipleAsync(done, function () {
                fontSizeProperty = 'font-size';
                ledControl = document.querySelector(cloneSelector);
                ledControlModel = viModel.getControlModel('Function11');
                ledControlModel.setMultipleProperties({ 'fontSize': '25px' });
            }, function () {
                fontSize = ledControl.style.getPropertyValue(fontSizeProperty);
                expect(fontSize).toEqual('25px');
            });
        });
    });
    describe('allows dropping boolean button control', function () {
        beforeEach(function (done) {
            arrayViewerElement = webAppHelper.createNIElement(arrayViewerSettings);
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.createNIElement(arrayViewerWithBooleanButtonSettings, controlId);
            }, function () {
                frontPanelControls = viModel.getAllControlModels();
                arrayViewerModel = frontPanelControls[controlId];
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('should not create duplicate nested buttons inside cloned element', function (done) {
            // Setting content to be undefined will get reset to its child node.
            arrayViewerElement.templateControl.content = undefined;
            expect(arrayViewerElement.templateControl.content instanceof HTMLElement).toBe(true);
            testHelpers.runMultipleAsync(done, function () {
                arrayViewerModel.rowsAndColumns = '3,1';
            }, function () {
                const childBooleanButtons = arrayViewerElement.childElement.querySelectorAll('jqx-toggle-button');
                childBooleanButtons.forEach(button => {
                    const childButtons = button.querySelectorAll('button');
                    expect(childButtons.length).toEqual(1);
                });
            });
        });
    });
    describe('allows creating nested arrays', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: arrayViewerSettings },
                { currentSettings: arrayViewerWithClusterSettings, parentId: controlId },
                { currentSettings: arrayViewerWithNumericSettings, parentId: arrayViewerWithClusterSettings.niControlId },
                { currentSettings: arrayViewerWithNumericSettingsLabel, parentId: arrayViewerWithClusterSettings.niControlId },
                { currentSettings: arrayViewerWithStringSettings, parentId: arrayViewerWithClusterSettings.niControlId },
                { currentSettings: arrayViewerWithStringSettingsLabel, parentId: arrayViewerWithClusterSettings.niControlId }
            ], done);
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('with an array of clusters', function (done) {
            testHelpers.runAsync(done, function () {
                const arrayViewModel = viModel.getControlViewModel(controlId);
                const clusterViewModel = viModel.getControlViewModel(arrayViewerWithClusterSettings.niControlId);
                const numericViewModel = viModel.getControlViewModel(arrayViewerWithNumericSettings.niControlId);
                const stringViewModel = viModel.getControlViewModel(arrayViewerWithStringSettings.niControlId);
                expect(Object.keys(viModel.getAllControlModels()).length).toBe(6);
                expect(arrayViewModel).toBeDefined();
                expect(clusterViewModel.model.getOwner()).toBe(arrayViewModel.model);
                expect(stringViewModel.model.getOwner()).toBe(clusterViewModel.model);
                expect(numericViewModel.model.getOwner()).toBe(clusterViewModel.model);
            });
        });
        xit('with an array of cluster of array of numeric', function (done) {
            testHelpers.runAsync(done, function () {
                const arrayViewModel = viModel.getControlViewModel(controlId);
                const clusterViewModel = viModel.getControlViewModel(arrayViewerWithClusterSettings.niControlId);
                const array2ViewModel = viModel.getControlViewModel(arrayViewerSettings2.niControlId);
                const numeric2ViewModel = viModel.getControlViewModel(arrayViewerWithNumericSettings2.niControlId);
                expect(Object.keys(viModel.getAllControlModels()).length).toBe(4);
                expect(arrayViewModel).toBeDefined();
                expect(clusterViewModel.model.getOwner()).toBe(arrayViewModel.model);
                expect(array2ViewModel.model.getOwner()).toBe(clusterViewModel.model);
                expect(numeric2ViewModel.model.getOwner()).toBe(array2ViewModel.model);
            });
        });
    });
});
//# sourceMappingURL=niArrayViewerViewModel.Test.js.map