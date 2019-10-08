"use strict";
window.testHelpers = window.testHelpers || {};
window.testHelpers.createFunctionMonitor = function (objectToMonitor, functionName) {
    'use strict';
    let callback;
    const orig = objectToMonitor[functionName];
    if (typeof orig !== 'function') {
        throw new Error('The property targeted by name (' + functionName + ') must be of type function');
    }
    objectToMonitor[functionName] = function () {
        let i;
        const args = [];
        for (i = 0; i < arguments.length; i = i + 1) {
            args.push(arguments[i]);
        }
        const retVal = orig.apply(this, args);
        if (typeof callback === 'function') {
            callback.apply(this, args);
        }
        return retVal;
    };
    const errorFunc = function () {
        throw new Error('Monitor for function (' + functionName + ') has already been removed');
    };
    return {
        setCallback: function (newCB) {
            if (callback === errorFunc) {
                errorFunc();
            }
            else {
                callback = newCB;
            }
        },
        removeMonitor: function () {
            callback = errorFunc;
            objectToMonitor[functionName] = orig;
        }
    };
};
//# sourceMappingURL=monitors.js.map