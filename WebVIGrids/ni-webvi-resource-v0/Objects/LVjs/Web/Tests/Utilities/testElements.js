//****************************************
// Helpers to run tests that must be performed asynchronously
// National Instruments Copyright 2015
//****************************************
import { NIElement } from '../../Elements/ni-element.js';
window.testHelpers = window.testHelpers || {};
(function () {
    'use strict';
    window.testHelpers.elementEventLog = [];
    class HTMLNITest extends NIElement {
        addAllProperties(targetPrototype) {
            super.addAllProperties(targetPrototype);
            const proto = HTMLNITest.prototype;
            proto.addProperty(targetPrototype, {
                propertyName: 'numberProp',
                defaultValue: 42
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'stringProp',
                defaultValue: 'Hello World!'
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'booleanProp',
                defaultValue: false
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'numFires',
                defaultValue: 42,
                fireEvent: true,
                addNonSignalingProperty: true
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'numNoSync',
                defaultValue: 42,
                preventAttributeSync: true
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'numNoSyncFires',
                defaultValue: 42,
                fireEvent: true,
                preventAttributeSync: true
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'objProp',
                defaultValue: {
                    num: 42,
                    bool: true,
                    str: 'I like trains'
                },
                fireEvent: true
            });
        }
    }
    NIElement.defineElementInfo(HTMLNITest.prototype, 'ni-test', 'HTMLNITest');
    // Allow extensions if needed
    NIElement._finalizeObservedAttributes(HTMLNITest);
    window.customElements.define(HTMLNITest.prototype.elementInfo.tagName, HTMLNITest);
    class HTMLNITestParent extends NIElement {
        createdCallback() {
            super.createdCallback();
            window.testHelpers.elementEventLog.push({
                what: '[pc]',
                when: 'created',
                who: 'parent'
            });
        }
        attachedCallback() {
            const firstCall = super.attachedCallback();
            window.testHelpers.elementEventLog.push({
                what: '[pa]',
                when: 'attached',
                who: 'parent'
            });
            return firstCall;
        }
    }
    NIElement.defineElementInfo(HTMLNITestParent.prototype, 'ni-test-parent', 'HTMLNITestParent');
    // Allow extensions if needed
    NIElement._finalizeObservedAttributes(HTMLNITestParent);
    window.customElements.define(HTMLNITestParent.prototype.elementInfo.tagName, HTMLNITestParent);
    class HTMLNITestChild extends NIElement {
        createdCallback() {
            super.createdCallback();
            window.testHelpers.elementEventLog.push({
                what: '[cc]',
                when: 'created',
                who: 'child'
            });
        }
        attachedCallback() {
            const firstCall = super.attachedCallback();
            window.testHelpers.elementEventLog.push({
                what: '[ca]',
                when: 'attached',
                who: 'child'
            });
            return firstCall;
        }
    }
    NIElement.defineElementInfo(HTMLNITestChild.prototype, 'ni-test-child', 'HTMLNITestChild');
    // Allow extensions if needed
    NIElement._finalizeObservedAttributes(HTMLNITestChild);
    window.customElements.define(HTMLNITestChild.prototype.elementInfo.tagName, HTMLNITestChild);
}());
//# sourceMappingURL=testElements.js.map