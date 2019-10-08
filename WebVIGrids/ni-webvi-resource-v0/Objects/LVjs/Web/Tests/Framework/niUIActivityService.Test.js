//****************************************
// Tests for niUIActivityService file
// National Instruments Copyright 2014
//****************************************
import { UIActivityService } from '../../Framework/niUIActivityService.js';
describe('The niUIActivityService', function () {
    'use strict';
    let element1;
    // -------------------------------------------------
    // Testing functions
    // -------------------------------------------------
    const createElement = function (id) {
        const element = document.createElement('div');
        element.id = id;
        element.setAttribute('style', 'border: solid 1px black; height: 100px; width: 100px;');
        document.body.appendChild(element);
        return element;
    };
    const removeElement = function (id) {
        const element = document.getElementById(id);
        element.parentNode.removeChild(element);
    };
    beforeEach(function () {
        element1 = createElement('test1');
    });
    afterEach(function () {
        removeElement('test1');
        element1 = undefined;
    });
    it('prevents calling register without parameters', function () {
        const test = function () {
            UIActivityService.register();
        };
        expect(test).toThrow();
    });
    it('prevents calling register without a dom element', function () {
        const test = function () {
            UIActivityService.register({
                element: 'this is a string, not a DOM Element'
            });
        };
        expect(test).toThrow();
    });
    it('prevents calling register without a string id', function () {
        const test = function () {
            UIActivityService.register({
                element: element1,
                id: undefined //this is a number, not a string
            });
        };
        expect(test).toThrow();
    });
    it('prevents calling register without a string id', function () {
        const test = function () {
            UIActivityService.register({
                element: element1,
                id: element1.id //this is a number, not a string
            });
        };
        expect(test).toThrow();
    });
    it('prevents trying to unregister an activity id that has not yet been registered', function () {
        const test = function () {
            UIActivityService.unregister('happyHappyHamsterDanceTime');
        };
        expect(test).toThrow();
    });
    it('prevents starting the same non-atomic activity twice in a row', function () {
        let calls = 0;
        const jqel = $('#' + element1.id);
        UIActivityService.register({
            element: element1,
            id: element1.id,
            down: function () {
                calls = calls + 1;
            },
            up: function () { } // up registered to make non-atomic
        });
        jqel.simulate('mousedown');
        jqel.simulate('mousedown');
        expect(calls).toBe(1);
    });
    it('cancels an existing non-atomic activity if a new activity is started', function () {
        let element1Calls = 0;
        const jqel1 = $('#' + element1.id);
        const element2 = createElement('test2');
        let element2Calls = 0;
        const jqel2 = $('#' + element2.id);
        UIActivityService.register({
            element: element1,
            id: element1.id,
            up: function () {
                element1Calls = element1Calls + 1;
            }
        });
        UIActivityService.register({
            element: element2,
            id: element2.id,
            up: function () {
                element2Calls = element2Calls + 1;
            }
        });
        jqel1.simulate('mousedown');
        jqel2.simulate('mousedown');
        UIActivityService.unregister(element1.id);
        UIActivityService.unregister(element2.id);
        expect(element1Calls).toBe(1);
        expect(element2Calls).toBe(1);
        removeElement('test2');
    });
});
//# sourceMappingURL=niUIActivityService.Test.js.map