//****************************************
// Tests for BooleanclusterModel class
// National Instruments Copyright 2014
//****************************************
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A ClusterViewModel', function () {
    'use strict';
    let viModel;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, clusterSettings, innerClusterSettings, innerClusterLabelSettings, clusterContainingNumericSettings, clusterContainingNumericLabelSettings, clusterContainingStringSettings, clusterContainingStringLabelSettings;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.clusterSettings.niControlId;
            clusterSettings = fixture.clusterSettings;
            innerClusterSettings = fixture.innerClusterSettings;
            innerClusterLabelSettings = fixture.innerClusterLabelSettings;
            clusterContainingNumericSettings = fixture.clusterContainingNumericSettings;
            clusterContainingNumericLabelSettings = fixture.clusterContainingNumericLabelSettings;
            clusterContainingStringSettings = fixture.clusterContainingStringSettings;
            clusterContainingStringLabelSettings = fixture.clusterContainingStringLabelSettings;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function () {
        Object.freeze(clusterSettings);
        Object.freeze(innerClusterSettings);
        Object.freeze(innerClusterLabelSettings);
        Object.freeze(clusterContainingNumericSettings);
        Object.freeze(clusterContainingNumericLabelSettings);
        Object.freeze(clusterContainingStringSettings);
        Object.freeze(clusterContainingStringLabelSettings);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    describe('allows creation of nested cluster ', function () {
        // intitalizing a nested cluster
        /*
            settings.niControlId
                   | ----- settings2.niControlId
                                   | ---- numericSettings.niControlId
                                   | ---- stringSettings.niControlId
        */
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: clusterSettings },
                { currentSettings: innerClusterSettings, parentId: controlId },
                { currentSettings: clusterContainingNumericSettings, parentId: innerClusterSettings.niControlId },
                { currentSettings: clusterContainingStringSettings, parentId: innerClusterSettings.niControlId }
            ], done);
        });
        it('to be setup with proper hierarchy', function (done) {
            testHelpers.runAsync(done, function () {
                const viewModel = viModel.getControlViewModel(controlId);
                const viewModel2 = viModel.getControlViewModel(innerClusterSettings.niControlId);
                const viewModel3 = viModel.getControlViewModel(clusterContainingNumericSettings.niControlId);
                expect(Object.keys(viModel.getAllControlModels()).length).toBe(4);
                expect(viewModel).toBeDefined();
                expect(viewModel2.model.getOwner()).toBe(viewModel.model);
                expect(viewModel3.model.getOwner()).toBe(viewModel2.model);
                expect(viewModel2.model.childModels.length).toBe(2);
                webAppHelper.removeNIElement(controlId);
            });
        });
        it('allows to delete the whole cluster', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                expect(Object.keys(viModel.getAllControlModels()).length).toBe(4);
                webAppHelper.removeNIElement(clusterContainingNumericSettings.niControlId);
                webAppHelper.removeNIElement(clusterContainingStringSettings.niControlId);
                webAppHelper.removeNIElement(innerClusterSettings.niControlId);
                webAppHelper.removeNIElement(controlId);
            }, function () {
                expect(Object.keys(viModel.getAllControlModels()).length).toBe(0);
            });
        });
        it('allows to delete the whole cluster', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                expect(Object.keys(viModel.getAllControlModels()).length).toBe(4);
                webAppHelper.removeNIElement(controlId);
            }, function () {
                expect(Object.keys(viModel.getAllControlModels()).length).toBe(0);
            });
        });
        it('and handles unknown property changes.', function (done) {
            const unknownSettings = {
                unknown: 'unknown'
            };
            testHelpers.runMultipleAsync(done, function () {
                const sendUnknownProperties = function () {
                    webAppHelper.dispatchMessage(controlId, unknownSettings);
                };
                expect(sendUnknownProperties).toThrow();
            }, function () {
                webAppHelper.removeNIElement(controlId);
            });
        });
    });
    // TODO mraj The following tests are trying to observe behavior of the reparenting buffer which is not available for the test update service
    // Should be moved to an editor update service test
    // settings.niControlId contains settings2.niControlId, settings2.niControlId contains clusterContainingNumericSettings.niControlId
    xit('allows creating nested cluster dynamiclly', function (done) {
        webAppHelper.createNIElement(innerClusterSettings);
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.createNIElement(clusterContainingNumericSettings, innerClusterSettings.niControlId);
        }, function () {
            webAppHelper.createNIElement(clusterSettings);
        }, function () {
            webAppHelper.removeNIElement(clusterContainingNumericSettings.niControlId);
            webAppHelper.removeNIElement(innerClusterSettings.niControlId);
            webAppHelper.createNIElement(innerClusterSettings, controlId);
        }, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            const viewModel2 = viModel.getControlViewModel(innerClusterSettings.niControlId);
            const viewModel3 = viModel.getControlViewModel(clusterContainingNumericSettings.niControlId);
            expect(viewModel2.model.getOwner()).toBe(viewModel.model);
            expect(viewModel3.model.getOwner()).toBe(viewModel2.model);
            expect(viewModel2.model.childModels.length).toBe(1);
            webAppHelper.removeNIElement(clusterContainingNumericSettings.niControlId);
            webAppHelper.removeNIElement(clusterContainingStringSettings.niControlId);
            webAppHelper.removeNIElement(innerClusterSettings.niControlId);
            webAppHelper.removeNIElement(controlId);
        });
    });
    xit('allows to move elements from topviModel to cluster', function (done) {
        expect(Object.keys(viModel.getAllControlModels()).length).toBe(0);
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.createNIElement(clusterContainingNumericSettings);
        }, function () {
            webAppHelper.createNIElement(clusterSettings, innerClusterSettings.niControlId);
        }, function () {
            webAppHelper.createNIElement(innerClusterSettings, controlId);
        }, function () {
            webAppHelper.createNIElement(clusterSettings);
        }, function () {
            webAppHelper.removeNIElement(clusterContainingNumericSettings.niControlId);
        }, function () {
            webAppHelper.createNIElement(clusterContainingNumericSettings, innerClusterSettings.niControlId);
        }, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            const viewModel2 = viModel.getControlViewModel(innerClusterSettings.niControlId);
            const viewModel3 = viModel.getControlViewModel(clusterContainingNumericSettings.niControlId);
            expect(Object.keys(viModel.getAllControlModels()).length).toBe(4);
            expect(viewModel).toBeDefined();
            expect(viewModel2.model.getOwner()).toBe(viewModel.model);
            expect(viewModel3.model.getOwner()).toBe(viewModel2.model);
            expect(viewModel2.model.childModels.length).toBe(2);
        }, function () {
            webAppHelper.removeNIElement(clusterContainingNumericSettings.niControlId);
        }, function () {
            webAppHelper.removeNIElement(clusterContainingStringSettings.niControlId);
        }, function () {
            webAppHelper.removeNIElement(innerClusterSettings.niControlId);
        }, function () {
            webAppHelper.removeNIElement(controlId);
        });
    });
    xit('allows to move elements from one cluster to topviModel', function (done) {
        webAppHelper.createNIElement(clusterContainingNumericSettings, innerClusterSettings.niControlId);
        webAppHelper.createNIElement(clusterContainingStringSettings, innerClusterSettings.niControlId);
        webAppHelper.createNIElement(innerClusterSettings, controlId);
        webAppHelper.createNIElement(clusterSettings);
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.removeNIElement(clusterContainingNumericSettings.niControlId);
            webAppHelper.createNIElement(clusterContainingNumericSettings);
        }, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            const viewModel2 = viModel.getControlViewModel(innerClusterSettings.niControlId);
            const viewModel3 = viModel.getControlViewModel(clusterContainingNumericSettings.niControlId);
            expect(Object.keys(viModel.getAllControlModels()).length).toBe(4);
            expect(viewModel).toBeDefined();
            expect(viewModel2.model.getOwner()).toBe(viewModel.model);
            expect(viewModel3.model.getOwner()).toBe(viModel);
            expect(viewModel2.model.childModels.length).toBe(1);
            webAppHelper.removeNIElement(clusterContainingNumericSettings.niControlId);
            webAppHelper.removeNIElement(clusterContainingStringSettings.niControlId);
            webAppHelper.removeNIElement(innerClusterSettings.niControlId);
            webAppHelper.removeNIElement(controlId);
        });
    });
    xit('allows to move elements from its parent cluster  to a sibling cluster ', function (done) {
        webAppHelper.createNIElement(clusterContainingNumericSettings, innerClusterSettings.niControlId);
        webAppHelper.createNIElement(clusterContainingStringSettings, innerClusterSettings.niControlId);
        webAppHelper.createNIElement(innerClusterSettings, controlId);
        webAppHelper.createNIElement(clusterSettings);
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.removeNIElement(clusterContainingNumericSettings.niControlId);
            webAppHelper.createNIElement(clusterContainingNumericSettings);
        }, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            const viewModel2 = viModel.getControlViewModel(innerClusterSettings.niControlId);
            const viewModel3 = viModel.getControlViewModel(clusterContainingNumericSettings.niControlId);
            expect(Object.keys(viModel.getAllControlModels()).length).toBe(4);
            expect(viewModel).toBeDefined();
            expect(viewModel2.model.getOwner()).toBe(viewModel.model);
            expect(viewModel3.model.getOwner()).toBe(viModel);
            expect(viewModel2.model.childModels.length).toBe(1);
            webAppHelper.removeNIElement(clusterContainingNumericSettings.niControlId);
            webAppHelper.removeNIElement(clusterContainingStringSettings.niControlId);
            webAppHelper.removeNIElement(innerClusterSettings.niControlId);
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('create nested cluster ', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: clusterSettings },
                { currentSettings: innerClusterSettings, parentId: controlId }
            ], done);
        });
        it('and updates the Model when properties change.', function (done) {
            const updateSettings2 = {
                text: 'Fred'
            };
            const updateSettings1 = {
                value: 6.66
            };
            let numericControl;
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.createNIElement(innerClusterLabelSettings, controlId);
                webAppHelper.createNIElement(clusterContainingNumericSettings, innerClusterSettings.niControlId);
                webAppHelper.createNIElement(clusterContainingNumericLabelSettings, innerClusterSettings.niControlId);
                webAppHelper.createNIElement(clusterContainingStringSettings, innerClusterSettings.niControlId);
                webAppHelper.createNIElement(clusterContainingStringLabelSettings, innerClusterSettings.niControlId);
            }, function () {
                const viewModel3 = viModel.getControlViewModel(clusterContainingNumericSettings.niControlId);
                const viewModel4 = viModel.getControlViewModel(clusterContainingStringSettings.niControlId);
                expect(Object.keys(viModel.getAllControlModels()).length).toBe(7);
                const stringControl = viewModel4.element;
                stringControl.text = updateSettings2.text;
                const event = document.createEvent('Event');
                event.detail = { text: updateSettings2.text };
                event.initEvent('change', true, false);
                stringControl.dispatchEvent(event);
                numericControl = viewModel3.element;
                numericControl.properties.value.notify = true;
                numericControl.value = updateSettings1.value;
            }, function () {
                const viewModel3 = viModel.getControlViewModel(clusterContainingNumericSettings.niControlId);
                const viewModel4 = viModel.getControlViewModel(clusterContainingStringSettings.niControlId);
                expect(viewModel4.model.text).toEqual(updateSettings2.text);
                expect(viewModel3.model.value).toEqual(updateSettings1.value);
                numericControl.properties.value.notify = false;
            }, function () {
                webAppHelper.removeNIElement(clusterContainingStringSettings.niControlId);
                webAppHelper.removeNIElement(clusterContainingStringLabelSettings.niControlId);
            }, function () {
                expect(Object.keys(viModel.getAllControlModels()).length).toBe(5);
            }, function () {
                webAppHelper.removeNIElement(controlId);
            });
        });
        function isElementVisible(domElement, root) {
            return new Promise(resolve => {
                const observer = new IntersectionObserver(([entry]) => {
                    resolve(entry.intersectionRatio === 1);
                    observer.disconnect();
                }, root);
                observer.observe(domElement);
            });
        }
        // TODO : Should be removed after we migrate to jasmine 2.7 or higher.
        const makeAsync = function (done, fn) {
            fn().then(() => done()).catch((ex) => done.fail(ex));
        };
        it('set cluster size wide enough for string to be visible and set size to narrow enough for string control to be hidden #FailsSafari', function (done) {
            makeAsync(done, async function () {
                const stringControl = webAppHelper.createNIElement(clusterContainingStringSettings, innerClusterSettings.niControlId);
                await testHelpers.waitAsync();
                const clusterViewModel = viModel.getControlViewModel(innerClusterSettings.niControlId);
                clusterViewModel.setGPropertyValue(VisualModel.SIZE_G_PROPERTY_NAME, { Width: 500, Height: 500 });
                await testHelpers.waitAsync();
                const visible = await isElementVisible(stringControl, clusterViewModel.element);
                expect(visible).toBe(true);
                clusterViewModel.setGPropertyValue(VisualModel.SIZE_G_PROPERTY_NAME, { Width: 10, Height: 10 });
                await testHelpers.waitAsync();
                const visibleAfter = await isElementVisible(stringControl, clusterViewModel.element);
                expect(visibleAfter).toBe(false);
                webAppHelper.removeNIElement(clusterContainingStringSettings.niControlId);
                webAppHelper.removeNIElement(controlId);
            });
        });
    });
});
//# sourceMappingURL=niClusterViewModel.Test.js.map