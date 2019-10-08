//******************************************
// Tests for VI Model classes
// National Instruments Copyright 2014
//******************************************
import { BooleanButtonModel } from '../../Modeling/niBooleanButtonModel.js';
import { ClusterModel } from '../../Modeling/niClusterModel.js';
import { VirtualInstrumentModel } from '../../Modeling/niVirtualInstrumentModel.js';
describe('A VIModel', function () {
    'use strict';
    const viName = 'Function.gvi';
    const viRef = '';
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    describe('without any children elements', function () {
        let viModel;
        beforeEach(function () {
            viModel = new VirtualInstrumentModel();
        });
        afterEach(function () {
            viModel = undefined;
        });
        it('allows to call his constructor', function () {
            expect(viModel).toBeDefined();
        });
        it('has undefined values by default', function () {
            expect(viModel.viName).toBe(undefined);
            expect(viModel.viRef).toBe(undefined);
        });
        it('can change the default values', function () {
            viModel.viName = viName;
            viModel.viRef = viRef;
            expect(viModel.viName).toBe(viName);
            expect(viModel.viRef).toBe(viRef);
        });
        it('has an owner that is the value undefined', function () {
            expect(viModel.getOwner()).toBe(undefined);
        });
        it('has no control models', function () {
            expect(viModel.getAllControlModels()).toEqual({});
        });
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    describe('is created in a web application', function () {
        let viModel;
        let buttonSettings, clusterSettings;
        let buttonUpdateSettings;
        const testHelpers = window.testHelpers;
        const webAppHelper = testHelpers.createWebAppTestHelper();
        const domVerifier = testHelpers.createDomVerifier(this.description);
        beforeAll(function (done) {
            domVerifier.captureDomState();
            webAppHelper.installWebAppFixture(done);
        });
        beforeAll(function () {
            viModel = webAppHelper.getVIModelForFixture();
        });
        beforeEach(function () {
            buttonSettings = {
                niControlId: 'id45',
                bindingInfo: {
                    prop: 'value',
                    field: 'field1',
                    isLatched: true
                },
                kind: BooleanButtonModel.MODEL_KIND,
                left: '100px',
                top: '200px',
                width: '300px',
                height: '400px'
            };
            buttonUpdateSettings = {
                left: '500px',
                top: '600px',
                width: '700px',
                height: '800px'
            };
            clusterSettings = {
                niControlId: 'id55',
                bindingInfo: {
                    prop: 'value',
                    dataItem: 'dataItem_22',
                    unplacedOrDisabled: false,
                    isLatched: false
                },
                kind: ClusterModel.MODEL_KIND
            };
        });
        afterAll(function (done) {
            webAppHelper.removeWebAppFixture(done);
        });
        afterAll(function () {
            domVerifier.verifyDomState();
        });
        describe('with two child elements', function () {
            let buttonModel;
            beforeEach(function (done) {
                webAppHelper.createNIElement(clusterSettings);
                webAppHelper.createNIElement(buttonSettings, clusterSettings.niControlId);
                testHelpers.runAsync(done, function () {
                    buttonModel = viModel.getControlModel(buttonSettings.niControlId);
                });
            });
            afterEach(function (done) {
                webAppHelper.removeNIElement(clusterSettings.niControlId);
                testHelpers.runAsync(done, function () {
                    buttonModel = undefined;
                });
            });
            it('has access to two child models', function () {
                const controlModels = viModel.getAllControlModels();
                expect(controlModels).toBeDefined();
                expect(Object.keys(controlModels).length).toBe(2);
                expect(controlModels[clusterSettings.niControlId]).toBeDefined();
                expect(controlModels[buttonSettings.niControlId]).toBeDefined();
            });
            it('can run getLocalBindingInfo on the controls', function () {
                const controlModels = viModel.getAllControlModels();
                const clusterLocalBindingInfo = controlModels[clusterSettings.niControlId].getLocalBindingInfo();
                const buttonLocalBindingInfo = controlModels[buttonSettings.niControlId].getLocalBindingInfo();
                expect(buttonLocalBindingInfo).toEqual({
                    runtimePath: undefined,
                    encodedVIName: 'test%2Egvi',
                    prop: 'value',
                    sync: false,
                    dataItem: '',
                    accessMode: '',
                    isLatched: true
                });
                expect(clusterLocalBindingInfo).toEqual({
                    runtimePath: 'dataItem_22',
                    encodedVIName: 'test%2Egvi',
                    prop: 'value',
                    sync: false,
                    dataItem: 'dataItem_22',
                    accessMode: '',
                    isLatched: false
                });
            });
            it('can call processControlUpdate for a control owned by the VI', function (done) {
                viModel.processControlUpdate(buttonSettings.niControlId, buttonUpdateSettings);
                testHelpers.runAsync(done, function () {
                    expect(buttonModel.top).toBe(buttonUpdateSettings.top);
                    expect(buttonModel.left).toBe(buttonUpdateSettings.left);
                    expect(buttonModel.width).toBe(buttonUpdateSettings.width);
                    expect(buttonModel.height).toBe(buttonUpdateSettings.height);
                });
            });
            it('can call processControlUpdateToSetGPropertyValue for a control owned by the VI', function (done) {
                viModel.processControlUpdateToSetGPropertyValue(buttonSettings.niControlId, 'Value', true);
                testHelpers.runAsync(done, function () {
                    expect(buttonModel.value).toBe(true);
                });
            });
            it('can call processControlUpdateToGetGPropertyValue for a control owned by the VI', function (done) {
                viModel.processControlUpdate(buttonSettings.niControlId, { value: false });
                testHelpers.runAsync(done, function () {
                    const value = viModel.processControlUpdateToGetGPropertyValue(buttonSettings.niControlId, 'Value');
                    expect(value).toBe(false);
                });
            });
        });
    });
});
//# sourceMappingURL=niVirtualInstrumentModel.Test.js.map