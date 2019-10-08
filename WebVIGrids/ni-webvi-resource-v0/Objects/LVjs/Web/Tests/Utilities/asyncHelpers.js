"use strict";
//****************************************
// Helpers to run tests that must be performed asynchronously
// National Instruments Copyright 2015
//****************************************
window.testHelpers = window.testHelpers || {};
// This Helper function is used to check the results of a test asynchronously.
// For example, the createNIElement function and the testHelpers.messageDispatch function both have behaviors that rely on asynchronously resolved behavior.
// runAsync is used to run a piece of code after the results of createNIElement or messageDispatch are complete (assuming they are resolved on next animation frame).
window.testHelpers.runAsync = function (done, asyncCB) {
    'use strict';
    if (typeof asyncCB !== 'function' || typeof done !== 'function') {
        throw new Error('Forgot to provide callback function or done function');
    }
    if (arguments.length !== 2) {
        throw new Error('Expecting only two callbacks');
    }
    window.testHelpers.runAsyncScheduler(function () {
        const result = asyncCB();
        if (result instanceof Promise) {
            throw new Error('runMultipleAsync is not compatible with async functions or Promises. Please use the makeAsync pattern instead.');
        }
        testHelpers.runAsyncScheduler(function () {
            done();
        });
    });
};
// Expects to be called with the first parameter as the done function and the remainder as callbacks to invoke
window.testHelpers.runMultipleAsync = function () {
    'use strict';
    let i;
    // Validate Inputs
    if (arguments.length <= 2) {
        throw new Error('Must be called with more than two functions. For just calling done with an asynchronous callback use runAsync');
    }
    for (i = 0; i < arguments.length; i = i + 1) {
        if (typeof arguments[i] !== 'function') {
            throw new Error('Must only call with function inputs. The first should be the done function and the rest are asynchronous callbacks');
        }
    }
    // Extract Done function and callbacks
    const done = arguments[0];
    const callbacks = [];
    for (i = 1; i < arguments.length; i = i + 1) {
        callbacks.push(arguments[i]);
    }
    const nextFunctionToInvoke = function (done, callbacks, curr) {
        const result = (callbacks[curr])();
        if (result instanceof Promise) {
            throw new Error('runMultipleAsync is not compatible with async functions or Promises. Please use the makeAsync pattern instead.');
        }
        if (curr < callbacks.length - 1) {
            testHelpers.runAsyncScheduler(function () {
                nextFunctionToInvoke(done, callbacks, curr + 1);
            });
        }
        else if (curr === callbacks.length - 1) {
            testHelpers.runAsyncScheduler(function () {
                done();
            });
        }
        else {
            throw new Error('Problem executing multiple async callback list');
        }
    };
    testHelpers.runAsyncScheduler(function () {
        nextFunctionToInvoke(done, callbacks, 0);
    });
};
// Wait for a conditional function to return true
window.testHelpers.waitForAsync = async function (conditionFn) {
    let result = conditionFn();
    while (!result) {
        await testHelpers.waitAsync();
        result = conditionFn();
    }
};
// Promise wrapper for testHelpers.runAsyncScheduler
window.testHelpers.waitAsync = async function () {
    return new Promise(function (resolve) {
        testHelpers.runAsyncScheduler(resolve);
    });
};
// Abstraction of window.requestAnimationFrame(). Test code should not call requestAnimationFrame() or setTimeout() directly, and always use this
// helper function to guarentee all async test functions are on the same queue.
window.testHelpers.runAsyncScheduler = function (asyncCB) {
    'use strict';
    if (typeof asyncCB !== 'function') {
        throw new Error('Forgot to provide callback function');
    }
    // Using requestAnimationFrame because the document-register-element polyfill
    // is using requestAnimationFrame to schedule lifecycle callbacks
    window.requestAnimationFrame(asyncCB);
};
//# sourceMappingURL=asyncHelpers.js.map