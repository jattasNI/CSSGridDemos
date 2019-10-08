"use strict";
(function () {
    'use strict';
    window.testHelpers = window.testHelpers || {};
    /**
     * Given a JQX element with an inner jqx-input input field: (1) focuses the inner input,
     * (2) optionally updates its value, and (3) commits that edit via a blur. Note that this
     * function will use runMultipleAsync internally, so it requires a 'done' callback.
     * @param done The 'done' callback.
     * @param {HTMLElement} element The JQX element to update (should contain an input.jqx-input)
     * @param newValue (Optional) The new value to set in the input, between the focus/blur operations.
     */
    window.testHelpers.jqxInputFocusUpdateAndBlur = function (done, element, newValue) {
        const jqxInput = element.querySelector('input.jqx-input');
        testHelpers.runMultipleAsync(done, function () {
            jqxInput.dispatchEvent(new CustomEvent('focus'));
            jqxInput.focus();
        }, function () {
            if (newValue !== undefined) {
                jqxInput.value = newValue;
            }
        }, function () {
            jqxInput.dispatchEvent(new CustomEvent('blur'));
            jqxInput.blur();
        });
    };
    beforeEach(function () {
        window.jasmine.addCustomEqualityTester(function (a, b) {
            if (a instanceof JQX.Utilities.DateTime && b instanceof JQX.Utilities.DateTime) {
                return a.equals(b);
            }
        });
    });
}());
//# sourceMappingURL=jqxElementsTestHelpers.js.map