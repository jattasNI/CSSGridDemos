"use strict";
//****************************************
// Helpers to create shims
// National Instruments Copyright 2015
//****************************************
window.testHelpers = window.testHelpers || {};
window.testHelpers.shimBuilder = {};
window.testHelpers.shimBuilder.createShimConstructorFunction = function (constructorEnumName, callbackContainer, callbackName) {
    'use strict';
    if (typeof constructorEnumName !== 'string' ||
        callbackContainer === undefined ||
        typeof callbackName !== 'string') {
        throw new Error('Invalid mock constructor function parameters');
    }
    return function () {
        let i;
        const args = [];
        for (i = 0; i < arguments.length; i = i + 1) {
            args[i] = arguments[i];
        }
        return callbackContainer[callbackName].call(this, constructorEnumName, args);
    };
};
window.testHelpers.shimBuilder.addShimFunction = function (obj, propName, propEnumName, callbackContainer, callbackName) {
    'use strict';
    if (obj === undefined ||
        typeof propName !== 'string' ||
        typeof propEnumName !== 'string' ||
        callbackContainer === undefined ||
        typeof callbackName !== 'string') {
        throw new Error('Invalid mock function parameters');
    }
    Object.defineProperty(obj, propName, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function () {
            let i;
            const args = [];
            for (i = 0; i < arguments.length; i = i + 1) {
                args[i] = arguments[i];
            }
            return callbackContainer[callbackName].call(this, propEnumName, args);
        }
    });
};
window.testHelpers.shimBuilder.addShimProperty = function (obj, propName, propEnumGetterName, propEnumSetterName, callbackContainer, callbackName) {
    'use strict';
    if (obj === undefined ||
        typeof propName !== 'string' ||
        typeof propEnumGetterName !== 'string' ||
        typeof propEnumSetterName !== 'string' ||
        callbackContainer === undefined ||
        typeof callbackName !== 'string') {
        throw new Error('Invalid mock property parameters');
    }
    Object.defineProperty(obj, propName, {
        configurable: false,
        enumerable: true,
        get: function () {
            let i;
            const args = [];
            for (i = 0; i < arguments.length; i = i + 1) {
                args[i] = arguments[i];
            }
            return callbackContainer[callbackName].call(this, propEnumGetterName, args);
        },
        set: function () {
            let i;
            const args = [];
            for (i = 0; i < arguments.length; i = i + 1) {
                args[i] = arguments[i];
            }
            return callbackContainer[callbackName].call(this, propEnumSetterName, args);
        }
    });
};
//# sourceMappingURL=shimBuilder.js.map