//****************************************
// Tests for Custom Elements
// National Instruments Copyright 2014
//****************************************
import { NIElement } from '../../Elements/ni-element.js';
describe('A Custom Element', function () {
    'use strict';
    const addSectionFixture = function () {
        const fixture = window.setFixtures('<section>');
        const fixtureCanvas = fixture.find('section').get(0);
        return fixtureCanvas;
    };
    if (document.body === null) {
        const body = document.createElement('body');
        document.body = body;
    }
    it('changes a boolean, numeric, and string value which updates the property and DOM', function () {
        const myElem = document.createElement('ni-test');
        expect(myElem.booleanProp).toBe(false);
        // in ce-v1, we don't sync default value (TODO: until connected?), but do respond to updates
        expect(myElem.getAttribute('boolean-prop')).toBe(null);
        myElem.booleanProp = true;
        expect(myElem.booleanProp).toBe(true);
        expect(myElem.getAttribute('boolean-prop')).toBe('');
        myElem.booleanProp = false;
        expect(myElem.booleanProp).toBe(false);
        expect(myElem.getAttribute('boolean-prop')).toBe(null);
        expect(myElem.numberProp).toBe(42);
        // in ce-v1, we don't sync default value (TODO: until connected?), but do respond to updates
        expect(myElem.getAttribute('number-prop')).toBe(null);
        myElem.numberProp = 55;
        expect(myElem.numberProp).toBe(55);
        expect(myElem.getAttribute('number-prop')).toBe('55');
        myElem.numberProp = NaN;
        expect(myElem.numberProp).not.toBe(myElem.numberProp); // NaN check, needed because isNaN(undefined) === true and because of type coersion isNaN('NaN') === true
        expect(myElem.getAttribute('number-prop')).toBe('NaN');
        myElem.numberProp = Number.POSITIVE_INFINITY;
        expect(myElem.numberProp).toBe(Number.POSITIVE_INFINITY);
        expect(myElem.getAttribute('number-prop')).toBe('Infinity');
        myElem.numberProp = Number.NEGATIVE_INFINITY;
        expect(myElem.numberProp).toBe(Number.NEGATIVE_INFINITY);
        expect(myElem.getAttribute('number-prop')).toBe('-Infinity');
        myElem.numberProp = +0;
        expect(1 / myElem.numberProp).toBe(Number.POSITIVE_INFINITY);
        expect(myElem.getAttribute('number-prop')).toBe('0');
        myElem.numberProp = -0;
        expect(1 / myElem.numberProp).toBe(Number.NEGATIVE_INFINITY);
        expect(myElem.getAttribute('number-prop')).toBe('-0');
        expect(myElem.stringProp).toBe('Hello World!');
        // in ce-v1, we don't sync default value (TODO: until connected?), but do respond to updates
        expect(myElem.getAttribute('string-prop')).toBe(null);
        myElem.stringProp = 'THIS IS THE BETTER LABVIEW';
        expect(myElem.stringProp).toBe('THIS IS THE BETTER LABVIEW');
        expect(myElem.getAttribute('string-prop')).toBe('THIS IS THE BETTER LABVIEW');
    });
    it('changes a configuration object property which updates the property and the DOM', function () {
        const myElem = document.createElement('ni-test');
        let timesCalled = 0;
        myElem.addEventListener('obj-prop-changed', function () {
            timesCalled = timesCalled + 1;
        });
        // in ce-v1, we don't sync default value (TODO: until connected?), but do respond to updates
        expect(myElem.getAttribute('obj-prop')).toEqual(null);
        expect(timesCalled).toBe(0);
        // Does not change any value, so no update paths triggered, so stays default
        myElem.objProp = {};
        expect(myElem.getAttribute('obj-prop')).toEqual(null);
        expect(timesCalled).toBe(0);
        // Does not change any value, so no update paths triggered, so stays default
        myElem.objProp = { notUseful: 'bunny' };
        expect(myElem.getAttribute('obj-prop')).toEqual(null);
        expect(timesCalled).toBe(0);
        myElem.objProp = { num: 55 };
        expect(JSON.parse(myElem.getAttribute('obj-prop'))).toEqual({
            num: 55,
            bool: true,
            str: 'I like trains'
        });
        expect(timesCalled).toBe(1);
        myElem.objProp = { bool: false };
        expect(JSON.parse(myElem.getAttribute('obj-prop'))).toEqual({
            num: 55,
            bool: false,
            str: 'I like trains'
        });
        expect(timesCalled).toBe(2);
        myElem.objProp = { str: 'turtles are cool too' };
        expect(JSON.parse(myElem.getAttribute('obj-prop'))).toEqual({
            num: 55,
            bool: false,
            str: 'turtles are cool too'
        });
        expect(timesCalled).toBe(3);
        myElem.objProp = {
            num: 75,
            bool: true,
            str: 'nigel is a pretty bird'
        };
        expect(JSON.parse(myElem.getAttribute('obj-prop'))).toEqual({
            num: 75,
            bool: true,
            str: 'nigel is a pretty bird'
        });
        expect(myElem.objProp).toEqual({
            num: 75,
            bool: true,
            str: 'nigel is a pretty bird'
        });
        expect(timesCalled).toBe(4);
    });
    it('changes a configuration object property numeric value that gets encoded as a string in the JSON attribute', function () {
        const myElem = document.createElement('ni-test');
        myElem.objProp = { num: Number.POSITIVE_INFINITY };
        expect(JSON.parse(myElem.getAttribute('obj-prop'))).toEqual({
            num: 'Infinity',
            bool: true,
            str: 'I like trains'
        });
        myElem.objProp = { num: Number.NEGATIVE_INFINITY };
        expect(JSON.parse(myElem.getAttribute('obj-prop'))).toEqual({
            num: '-Infinity',
            bool: true,
            str: 'I like trains'
        });
        myElem.objProp = { num: NaN };
        expect(JSON.parse(myElem.getAttribute('obj-prop'))).toEqual({
            num: 'NaN',
            bool: true,
            str: 'I like trains'
        });
        myElem.objProp = { num: -0 };
        expect(Object.is(myElem.objProp.num, -0)).toBe(true);
        expect(JSON.parse(myElem.getAttribute('obj-prop'))).toEqual({
            num: '-0',
            bool: true,
            str: 'I like trains'
        });
    });
    it('changes a numeric property which updates the property and does not update DOM', function () {
        const myElem = document.createElement('ni-test');
        expect(myElem.numNoSync).toBe(42);
        // in ce-v1, we don't sync default value (TODO: until connected?), but do respond to updates
        expect(myElem.getAttribute('num-no-sync')).toBe(null);
        myElem.numNoSync = 55;
        expect(myElem.numNoSync).toBe(55);
        // since no-sync stays the default value of null
        expect(myElem.getAttribute('num-no-sync')).toBe(null);
    });
    it('changes a numeric value and fires an event', function () {
        const myElem = document.createElement('ni-test');
        let timesCalled = 0;
        myElem.addEventListener('num-fires-changed', function (evt) {
            expect(evt.detail.numFires).toBe(55);
            timesCalled = timesCalled + 1;
        });
        expect(myElem.numFires).toBe(42);
        // in ce-v1, we don't sync default value (TODO: until connected?), but do respond to updates
        expect(myElem.getAttribute('num-fires')).toBe(null);
        myElem.numFires = 55;
        expect(myElem.numFires).toBe(55);
        expect(myElem.getAttribute('num-fires')).toBe('55');
        expect(timesCalled).toBe(1);
    });
    it('changes a numeric non signaling value which does not fire an event', function () {
        const myElem = document.createElement('ni-test');
        let timesCalled = 0;
        myElem.addEventListener('num-fires-changed', function (evt) {
            expect(evt.detail.numFires).toBe(55);
            timesCalled = timesCalled + 1;
            evt.preventDefault();
        });
        expect(myElem.numFires).toBe(42);
        // in ce-v1, we don't sync default value (TODO: until connected?), but do respond to updates
        expect(myElem.getAttribute('num-fires')).toBe(null);
        myElem.numFiresNonSignaling = 55;
        expect(myElem.numFires).toBe(55);
        expect(myElem.getAttribute('num-fires')).toBe('55');
        expect(timesCalled).toBe(0);
    });
    it('changes an attribute that is not managed and no event fires', function () {
        const myElem = document.createElement('ni-test');
        let timesCalled = 0;
        myElem.addEventListener('so-rad-changed', function () {
            timesCalled = timesCalled + 1;
        });
        expect(myElem.soRad).toBe(undefined);
        expect(myElem.getAttribute('so-rad')).toBe(null);
        myElem.setAttribute('so-rad', 'totally man!');
        expect(myElem.soRad).toBe(undefined);
        expect(myElem.getAttribute('so-rad')).toBe('totally man!');
        expect(timesCalled).toBe(0);
    });
    it('removes a string attribute and the value is reverted', function (done) {
        const myElem = document.createElement('ni-test');
        //defaults
        expect(myElem.stringProp).toBe('Hello World!');
        // in ce-v1, we don't sync default value (TODO: until connected?), but do respond to updates
        expect(myElem.getAttribute('string-prop')).toBe(null);
        // change from default
        myElem.stringProp = 'change default';
        expect(myElem.stringProp).toBe('change default');
        expect(myElem.getAttribute('string-prop')).toBe('change default');
        // change back to default
        myElem.stringProp = 'Hello World!';
        expect(myElem.stringProp).toBe('Hello World!');
        expect(myElem.getAttribute('string-prop')).toBe('Hello World!');
        // remove attribute which is an invalid value so it is coerced to default
        myElem.removeAttribute('string-prop');
        expect(myElem.stringProp).toBe('Hello World!');
        testHelpers.runAsync(done, function () {
            // TODO with native custom elements this should be either synchronous or at the end of the microtask
            expect(myElem.getAttribute('string-prop')).toBe('Hello World!');
        });
    });
    describe('that has parent and child elements', function () {
        let container;
        beforeEach(function () {
            container = addSectionFixture();
            window.testHelpers.elementEventLog = [];
        });
        it('verifies element parent is created first', function (done) {
            container.innerHTML = '<ni-test-parent><ni-test-child></ni-test-child></ni-test-parent>';
            testHelpers.runAsync(done, function () {
                const eventString = window.testHelpers.elementEventLog
                    .filter(event => event.when === 'created')
                    .map(event => event.what)
                    .join('');
                expect(eventString).toBe('[pc][cc]');
            });
        });
        it('verifies element parent is attached first', function (done) {
            container.innerHTML = '<ni-test-parent><ni-test-child></ni-test-child></ni-test-parent>';
            testHelpers.runAsync(done, function () {
                const eventString = window.testHelpers.elementEventLog
                    .filter(event => event.when === 'attached')
                    .map(event => event.what)
                    .join('');
                expect(eventString).toBe('[pa][ca]');
            });
        });
        it('verifies order of parent created+attached and child created+attached #FailsSafari', function (done) {
            container.innerHTML = '<ni-test-parent><ni-test-child></ni-test-child></ni-test-parent>';
            testHelpers.runAsync(done, function () {
                const eventString = window.testHelpers.elementEventLog
                    .map(event => event.what)
                    .join('');
                expect(eventString).toBe('[pc][pa][cc][ca]');
            });
        });
    });
    describe('that is added to the DOM', function () {
        let myElem;
        const uniqueId = 'veryuniqueid';
        beforeEach(function (done) {
            expect(document.getElementById(uniqueId)).toBe(null);
            $(document.body).append('<ni-test id="' + uniqueId + '" obj-prop="{bad json}"></ni-test>');
            testHelpers.runAsync(done, function () {
                myElem = document.getElementById(uniqueId);
                expect(myElem).toBeDefined();
                expect(myElem.numberProp).toBe(42);
                expect(myElem.stringProp).toBe('Hello World!');
                expect(myElem.booleanProp).toBe(false);
                expect(myElem.numFires).toBe(42);
                expect(myElem.numNoSync).toBe(42);
                expect(myElem.numNoSyncFires).toBe(42);
                expect(myElem.objProp).toEqual({
                    num: 42,
                    bool: true,
                    str: 'I like trains'
                });
            });
        });
        afterEach(function () {
            document.body.removeChild(myElem);
            expect(document.getElementById(uniqueId)).toBe(null);
        });
        it('attempts to set a JSON attribute to null', function (done) {
            myElem.setAttribute('obj-prop', JSON.stringify({
                str: null
            }));
            testHelpers.runAsync(done, function () {
                expect(myElem.objProp).toEqual({
                    num: 42,
                    bool: true,
                    str: 'I like trains'
                });
            });
        });
        it('attempts to set a JSON attribute to an invalid type', function (done) {
            myElem.setAttribute('obj-prop', JSON.stringify({
                bool: 'fabulous manzier bros'
            }));
            testHelpers.runAsync(done, function () {
                expect(myElem.objProp).toEqual({
                    num: 42,
                    bool: true,
                    str: 'I like trains'
                });
            });
        });
        it('attempts to set a numeric JSON attribute to the string Infinity', function (done) {
            myElem.setAttribute('obj-prop', JSON.stringify({
                num: 'Infinity'
            }));
            testHelpers.runAsync(done, function () {
                expect(myElem.objProp).toEqual({
                    num: Number.POSITIVE_INFINITY,
                    bool: true,
                    str: 'I like trains'
                });
            });
        });
        it('attempts to set a numeric JSON attribute to the string -Infinity', function (done) {
            myElem.setAttribute('obj-prop', JSON.stringify({
                num: '-Infinity'
            }));
            testHelpers.runAsync(done, function () {
                expect(myElem.objProp).toEqual({
                    num: Number.NEGATIVE_INFINITY,
                    bool: true,
                    str: 'I like trains'
                });
            });
        });
        it('attempts to set a numeric JSON attribute to the string NaN', function (done) {
            myElem.setAttribute('obj-prop', JSON.stringify({
                num: 'NaN'
            }));
            testHelpers.runAsync(done, function () {
                expect(myElem.objProp.num).not.toBe(myElem.objProp.num); // NaN check, needed because isNaN(undefined) === true and because of type coersion isNaN('NaN') === true
            });
        });
        it('attempts to set a numeric JSON attribute to null', function (done) {
            myElem.setAttribute('obj-prop', JSON.stringify({
                num: null
            }));
            testHelpers.runAsync(done, function () {
                expect(myElem.objProp.num).not.toBe(myElem.objProp.num); // NaN check, needed because isNaN(undefined) === true and because of type coersion isNaN('NaN') === true
            });
        });
        it('attempts to set a numeric attribute to the string NaN', function (done) {
            myElem.setAttribute('number-prop', 'NaN');
            testHelpers.runAsync(done, function () {
                expect(myElem.numberProp).not.toBe(myElem.numberProp); // NaN check, needed because isNaN(undefined) === true and because of type coersion isNaN('NaN') === true
            });
        });
        it('attempts to detach and reattach an element', function () {
            document.body.removeChild(myElem);
            expect(document.getElementById(uniqueId)).toBe(null);
            document.body.appendChild(myElem);
            expect(document.getElementById(uniqueId)).not.toBe(null);
        });
    });
    it('modified by the user using setAttributeType using an invalid type throws an exception', function () {
        const myElem = document.createElement('ni-test');
        const task = function () {
            myElem.setAttributeTyped('boolean-prop', [{
                    propertyName: 'boolean-prop',
                    type: 'boolean'
                }], function () {
            });
        };
        expect(task).toThrow();
    });
    it('with a property modified by the user with an invalid type throws an exception', function () {
        const myElem = document.createElement('ni-test');
        const task1 = function () {
            myElem.booleanProp = 'hey you pikachu';
        };
        const task2 = function () {
            myElem.objProp = function () {
            };
        };
        const task3 = function () {
            myElem.objProp = {
                bool: 'hey you pikachu'
            };
        };
        expect(task1).toThrow();
        expect(task2).toThrow();
        expect(task3).toThrow();
    });
    it('adding a property without any configuration throws an exception', function () {
        const parent = NIElement;
        const proto = Object.create(parent.prototype);
        proto.addAllProperties = function (targetPrototype) {
            parent.prototype.addAllProperties.call(this, targetPrototype);
            proto.addProperty(targetPrototype);
        };
        const performDefinition = function () {
            NIElement.defineElementInfo(proto, 'ni-test-one', 'HTMLNITestOne');
        };
        expect(performDefinition).toThrow();
    });
    it('adding a property with an empty configuration throws an exception', function () {
        const parent = NIElement;
        const proto = Object.create(parent.prototype);
        proto.addAllProperties = function (targetPrototype) {
            parent.prototype.addAllProperties.call(this, targetPrototype);
            proto.addProperty(targetPrototype, {});
        };
        const performDefinition = function () {
            NIElement.defineElementInfo(proto, 'ni-test-one', 'HTMLNITestOne');
        };
        expect(performDefinition).toThrow();
    });
    it('adding a property with a bad name throws an exception', function () {
        const parent = NIElement;
        const proto = Object.create(parent.prototype);
        proto.addAllProperties = function (targetPrototype) {
            parent.prototype.addAllProperties.call(this, targetPrototype);
            proto.addProperty(targetPrototype, {
                propertyName: 'PascalCaseBad'
            });
        };
        const performDefinition = function () {
            NIElement.defineElementInfo(proto, 'ni-test-one', 'HTMLNITestOne');
        };
        expect(performDefinition).toThrow();
    });
    it('adding a property with an invalid default value type throws an exception', function () {
        const parent = NIElement;
        const proto = Object.create(parent.prototype);
        proto.addAllProperties = function (targetPrototype) {
            parent.prototype.addAllProperties.call(this, targetPrototype);
            proto.addProperty(targetPrototype, {
                propertyName: 'test',
                defaultValue: function () { }
            });
        };
        const performDefinition = function () {
            NIElement.defineElementInfo(proto, 'ni-test-one', 'HTMLNITestOne');
        };
        expect(performDefinition).toThrow();
    });
    it('adding a property with a non boolean fireEvent parameter throws an exception', function () {
        const parent = NIElement;
        const proto = Object.create(parent.prototype);
        proto.addAllProperties = function (targetPrototype) {
            parent.prototype.addAllProperties.call(this, targetPrototype);
            proto.addProperty(targetPrototype, {
                propertyName: 'test',
                defaultValue: false,
                fireEvent: 'I am a string'
            });
        };
        const performDefinition = function () {
            NIElement.defineElementInfo(proto, 'ni-test-one', 'HTMLNITestOne');
        };
        expect(performDefinition).toThrow();
    });
    it('adding a property with a non boolean addNonSignalingProperty parameter throws an exception', function () {
        const parent = NIElement;
        const proto = Object.create(parent.prototype);
        proto.addAllProperties = function (targetPrototype) {
            parent.prototype.addAllProperties.call(this, targetPrototype);
            proto.addProperty(targetPrototype, {
                propertyName: 'test',
                defaultValue: false,
                addNonSignalingProperty: 'I am a string'
            });
        };
        const performDefinition = function () {
            NIElement.defineElementInfo(proto, 'ni-test-one', 'HTMLNITestOne');
        };
        expect(performDefinition).toThrow();
    });
    it('adding a property with a non boolean preventAttributeSync parameter throws an exception', function () {
        const parent = NIElement;
        const proto = Object.create(parent.prototype);
        proto.addAllProperties = function (targetPrototype) {
            parent.prototype.addAllProperties.call(this, targetPrototype);
            proto.addProperty(targetPrototype, {
                propertyName: 'test',
                defaultValue: false,
                preventAttributeSync: 'I am a string'
            });
        };
        const performDefinition = function () {
            NIElement.defineElementInfo(proto, 'ni-test-one', 'HTMLNITestOne');
        };
        expect(performDefinition).toThrow();
    });
    it('adding a boolean default value of true throws an exception', function () {
        const parent = NIElement;
        const proto = Object.create(parent.prototype);
        proto.addAllProperties = function (targetPrototype) {
            parent.prototype.addAllProperties.call(this, targetPrototype);
            proto.addProperty(targetPrototype, {
                propertyName: 'test',
                defaultValue: true
            });
        };
        const performDefinition = function () {
            NIElement.defineElementInfo(proto, 'ni-test-one', 'HTMLNITestOne');
        };
        expect(performDefinition).toThrow();
    });
    it('adding an object default value that is an array throws an exception', function () {
        const parent = NIElement;
        const proto = Object.create(parent.prototype);
        proto.addAllProperties = function (targetPrototype) {
            parent.prototype.addAllProperties.call(this, targetPrototype);
            proto.addProperty(targetPrototype, {
                propertyName: 'test',
                defaultValue: []
            });
        };
        const performDefinition = function () {
            NIElement.defineElementInfo(proto, 'ni-test-one', 'HTMLNITestOne');
        };
        expect(performDefinition).toThrow();
    });
    it('adding an object default value with only one value throws an exception', function () {
        const parent = NIElement;
        const proto = Object.create(parent.prototype);
        proto.addAllProperties = function (targetPrototype) {
            parent.prototype.addAllProperties.call(this, targetPrototype);
            proto.addProperty(targetPrototype, {
                propertyName: 'test',
                defaultValue: { myNum: 42 }
            });
        };
        const performDefinition = function () {
            NIElement.defineElementInfo(proto, 'ni-test-one', 'HTMLNITestOne');
        };
        expect(performDefinition).toThrow();
    });
    it('adding an object default value with a non boolean, string, or number value throws an exception', function () {
        const parent = NIElement;
        const proto = Object.create(parent.prototype);
        proto.addAllProperties = function (targetPrototype) {
            parent.prototype.addAllProperties.call(this, targetPrototype);
            proto.addProperty(targetPrototype, {
                propertyName: 'test',
                defaultValue: { myNum: {} }
            });
        };
        const performDefinition = function () {
            NIElement.defineElementInfo(proto, 'ni-test-one', 'HTMLNITestOne');
        };
        expect(performDefinition).toThrow();
    });
    it('adding a property to the prototype when a property of the same name already exists throws an exception', function () {
        const parent = NIElement;
        const proto = Object.create(parent.prototype);
        proto.testProp = 'I am already here';
        proto.addAllProperties = function (targetPrototype) {
            parent.prototype.addAllProperties.call(this, targetPrototype);
            proto.addProperty(targetPrototype, {
                propertyName: 'testProp',
                defaultValue: 42
            });
        };
        const performDefinition = function () {
            NIElement.defineElementInfo(proto, 'ni-test-one', 'HTMLNITestOne');
        };
        expect(performDefinition).toThrow();
    });
    it('adding a property to the prototype when a private property of the same name already exists throws an exception', function () {
        const parent = NIElement;
        const proto = Object.create(parent.prototype);
        proto._testProp = 'I am already here';
        proto.addAllProperties = function (targetPrototype) {
            parent.prototype.addAllProperties.call(this, targetPrototype);
            proto.addProperty(targetPrototype, {
                propertyName: 'testProp',
                defaultValue: 42
            });
        };
        const performDefinition = function () {
            NIElement.defineElementInfo(proto, 'ni-test-one', 'HTMLNITestOne');
        };
        expect(performDefinition).toThrow();
    });
    it('adding a property to the prototype when a non signaling property of the same name already exists throws an exception', function () {
        const parent = NIElement;
        const proto = Object.create(parent.prototype);
        proto.testPropNonSignaling = 'I am already here';
        proto.addAllProperties = function (targetPrototype) {
            parent.prototype.addAllProperties.call(this, targetPrototype);
            proto.addProperty(targetPrototype, {
                propertyName: 'testProp',
                defaultValue: 42
            });
        };
        const performDefinition = function () {
            NIElement.defineElementInfo(proto, 'ni-test-one', 'HTMLNITestOne');
        };
        expect(performDefinition).toThrow();
    });
    it('defining the element info twice throws an exception', function () {
        const parent = NIElement;
        const proto = Object.create(parent.prototype);
        proto.addAllProperties = function (targetPrototype) {
            parent.prototype.addAllProperties.call(this, targetPrototype);
            proto.addProperty(targetPrototype, {
                propertyName: 'testProp',
                defaultValue: 42
            });
        };
        const performDefinition = function () {
            NIElement.defineElementInfo(proto, 'ni-test-one', 'HTMLNITestOne');
        };
        expect(performDefinition).not.toThrow();
        expect(performDefinition).toThrow();
    });
});
//# sourceMappingURL=niCustomElements.Test.js.map