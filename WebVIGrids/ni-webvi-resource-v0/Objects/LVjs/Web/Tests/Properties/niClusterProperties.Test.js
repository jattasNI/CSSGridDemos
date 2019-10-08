//****************************************
// G Property Tests for ClusterModel class
// National Instruments Copyright 2018
//****************************************
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A cluster control', function () {
    'use strict';
    let updateService, viModel, controlModel, viewModel, frontPanelControls, controlElement, newNIType;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    const NIType = window.NIType;
    const NITypeNames = window.NITypeNames;
    let controlId, clusterSettings, innerClusterSettings, innerClusterLabelSettings, clusterContainingNumericSettings, clusterContainingNumericLabelSettings, clusterContainingStringSettings, clusterContainingStringLabelSettings, clusterContainingProgressbarSettings, clusterContainingEnumSettings;
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
            clusterContainingProgressbarSettings = fixture.clusterContainingProgressbarSettings;
            clusterContainingEnumSettings = fixture.clusterContainingEnumSettings;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
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
    describe('setting disabled property', function () {
        beforeEach(function () {
            webAppHelper.createNIElement(clusterSettings);
            webAppHelper.createNIElement(innerClusterSettings, controlId);
            webAppHelper.createNIElement(clusterContainingNumericSettings, controlId);
            webAppHelper.createNIElement(clusterContainingStringSettings, innerClusterSettings.niControlId);
        });
        beforeEach(function () {
            frontPanelControls = viModel.getAllControlModels();
        });
        it('disables the cluster control on setting disable property to true', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                controlModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
                viewModel.setGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME, true);
                expect(controlModel.enabled).toEqual(false);
            }, function () {
                controlElement = viewModel.element;
                expect(controlElement['disabled']).toBe(true);
                expect(controlElement.children[0]['disabled']).toBe(true); // check inner cluster enable state.
                expect(controlElement.children[1]['disabled']).toBe(true); // check numeric control enable state inside outer cluster.
                expect(controlElement.children[0].children[0]['disabled']).toBe(true); // check string control's enable state inside inner cluster.
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('with string control', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: clusterSettings },
                { currentSettings: clusterContainingStringLabelSettings, parentId: controlId },
                { currentSettings: clusterContainingStringSettings, parentId: controlId }
            ], done);
        });
        beforeEach(function () {
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            viewModel = viModel.getControlViewModel(controlId);
            controlElement = viewModel.element;
            newNIType = new NIType({
                name: NITypeNames.CLUSTER,
                fields: [clusterContainingStringLabelSettings.text],
                subtype: [NITypeNames.STRING]
            }).toJSON();
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('property read for Value returns the current value.', function (done) {
            const newValue = { String: 'test string' };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: newNIType,
                    value: newValue
                });
            }, function () {
                const currentValue = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
                expect(currentValue).toEqual(newValue);
            });
        });
        it('property set for Value updates model.', function (done) {
            const newValue = { String: '##!89' };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: newNIType });
            }, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            });
        });
        it('property set for Value updates control element.', function (done) {
            const newValue = { String: 'new text' };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: newNIType });
            }, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            }, function () {
                expect(controlElement.value).toEqual(newValue);
            });
        });
        it('property set for Value does not call controlChanged function of updateService', function (done) {
            const newValue = { String: '##!89' };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: newNIType });
            }, function () {
                spyOn(updateService, 'controlChanged');
                viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(updateService.controlChanged).not.toHaveBeenCalled();
            });
        });
        it('property set for valueSignaling calls controlChanged function of updateService with correct arguments', function (done) {
            const newValue = { String: '##!89' };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: newNIType });
            }, function () {
                spyOn(updateService, 'controlChanged');
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValue, clusterSettings.value);
            });
        });
        it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
            const newValue = clusterSettings.value;
            testHelpers.runAsync(done, function () {
                spyOn(updateService, 'controlChanged');
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(updateService.controlChanged).toHaveBeenCalled();
            });
        });
        it('property set for valueSignaling updates model.', function (done) {
            const newValue = { String: '##!89' };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: newNIType });
            }, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            });
        });
        it('property set for valueSignaling updates control element.', function (done) {
            const newValue = { String: 'new text' };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: newNIType });
            }, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            }, function () {
                expect(controlElement.value).toEqual(newValue);
            });
        });
        it('property read for Position returns the current position.', function () {
            const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
            const expectedPosition = {
                "Left": parseInt(clusterSettings.left),
                "Top": parseInt(clusterSettings.top)
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
    });
    describe('with nested cluster with numeric control', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: clusterSettings },
                { currentSettings: innerClusterSettings, parentId: controlId },
                { currentSettings: innerClusterLabelSettings, parentId: controlId },
                { currentSettings: clusterContainingNumericSettings, parentId: innerClusterSettings.niControlId },
                { currentSettings: clusterContainingNumericLabelSettings, parentId: innerClusterSettings.niControlId }
            ], done);
        });
        beforeEach(function () {
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            viewModel = viModel.getControlViewModel(controlId);
            controlElement = viewModel.element;
            newNIType = new NIType({
                name: NITypeNames.CLUSTER,
                fields: ['cluster'],
                subtype: [{
                        name: NITypeNames.CLUSTER,
                        fields: ['numeric'],
                        subtype: [NITypeNames.DOUBLE]
                    }]
            }).toJSON();
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('property read for Value returns the current value.', function (done) {
            const newValue = {
                Cluster2: {
                    Numeric: 10
                }
            };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, {
                    niType: newNIType,
                    value: newValue
                });
            }, function () {
                const currentValue = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
                expect(currentValue).toEqual(newValue);
            });
        });
        it('property set for Value updates model.', function (done) {
            const newValue = {
                Cluster2: {
                    Numeric: 10
                }
            };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: newNIType });
            }, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            });
        });
        it('property set for Value updates control element.', function (done) {
            const newValue = {
                Cluster2: {
                    Numeric: 10
                }
            };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: newNIType });
            }, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            }, function () {
                expect(controlElement.value).toEqual(newValue);
            });
        });
        it('property set for Value does not call controlChanged function of updateService', function (done) {
            const newValue = {
                Cluster2: {
                    Numeric: 10
                }
            };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: newNIType });
            }, function () {
                spyOn(updateService, 'controlChanged');
                viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
                expect(updateService.controlChanged).not.toHaveBeenCalled();
            });
        });
        it('property set for valueSignaling calls controlChanged function of updateService with correct arguments', function (done) {
            const newValue = {
                Cluster2: {
                    Numeric: 10
                }
            };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: newNIType });
            }, function () {
                spyOn(updateService, 'controlChanged');
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValue, clusterSettings.value);
            });
        });
        it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
            const newValue = clusterSettings.value;
            testHelpers.runAsync(done, function () {
                spyOn(updateService, 'controlChanged');
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(updateService.controlChanged).toHaveBeenCalled();
            });
        });
        it('property set for valueSignaling updates model.', function (done) {
            const newValue = {
                Cluster2: {
                    Numeric: 10
                }
            };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: newNIType });
            }, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            });
        });
        it('property set for valueSignaling updates control element.', function (done) {
            const newValue = {
                Cluster2: {
                    Numeric: 10
                }
            };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: newNIType });
            }, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            }, function () {
                expect(controlElement.value).toEqual(newValue);
            });
        });
        it('property set for valueSignaling updates control element.', function (done) {
            const newValue = {
                Cluster2: {
                    Numeric: 10
                }
            };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: newNIType });
            }, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            }, function () {
                expect(controlElement.value).toEqual(newValue);
            });
        });
    });
    describe('with progressBar control', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: clusterSettings },
                { currentSettings: clusterContainingProgressbarSettings, parentId: controlId }
            ], done);
        });
        beforeEach(function () {
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            viewModel = viModel.getControlViewModel(controlId);
            controlElement = viewModel.element;
            newNIType = new NIType({
                name: NITypeNames.CLUSTER,
                fields: ['Progress Bar'],
                subtype: [NITypeNames.DOUBLE]
            }).toJSON();
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('property set for valueSignaling with out of bound updates control element without validation.', function (done) {
            const newValue = {
                Cluster2: {
                    value: 11
                }
            };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: newNIType });
            }, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            }, function () {
                expect(controlElement.value).toEqual(newValue);
            });
        });
    });
    describe('with Enum control', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElementHierarchy([
                { currentSettings: clusterSettings },
                { currentSettings: clusterContainingEnumSettings, parentId: controlId }
            ], done);
        });
        beforeEach(function () {
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            viewModel = viModel.getControlViewModel(controlId);
            controlElement = viewModel.element;
            newNIType = new NIType({
                name: NITypeNames.CLUSTER,
                fields: ['Enum'],
                subtype: [NITypeNames.DOUBLE]
            }).toJSON();
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('property set for valueSignaling with out of bound updates control element without validation.', function (done) {
            const newValue = {
                Cluster2: {
                    value: 3
                }
            };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, { niType: newNIType });
            }, function () {
                viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
                expect(controlModel.value).toEqual(newValue);
            }, function () {
                expect(controlElement.value).toEqual(newValue);
            });
        });
    });
});
//# sourceMappingURL=niClusterProperties.Test.js.map