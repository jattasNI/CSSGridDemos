//******************************************
// Tests for NIBoundsUpdateEventService
// National Instruments Copyright 2018
//******************************************
import { NIBoundsUpdateEventService } from '../../Framework/niBoundsUpdateEventService.js';
describe('A Bounds Update Event Service', function () {
    'use strict';
    let service, callback, frontPanelEl, frontPanelWrapperEl;
    const createElement = function (width, height, left, top, position, display, margin) {
        const element = document.createElement('div');
        element.style.width = width;
        element.style.height = height;
        element.style.left = left;
        element.style.top = top;
        element.style.position = position;
        element.style.display = display;
        element.style.margin = margin;
        return element;
    };
    beforeEach(function () {
        frontPanelWrapperEl = createElement('auto', 'auto', 'auto', 'auto', 'absolute');
        document.body.appendChild(frontPanelWrapperEl);
        frontPanelEl = createElement('1024px', '768px', '50px', '50px', 'absolute');
        frontPanelWrapperEl.appendChild(frontPanelEl);
        const dummyFrontPanelModel = {
            isFlexibleLayoutRoot: function () {
                return true;
            },
            niControlId: 'FP'
        };
        const dummyFrontPanelViewModel = {
            element: frontPanelEl,
            model: dummyFrontPanelModel
        };
        service = new NIBoundsUpdateEventService(dummyFrontPanelViewModel, (eventDataJson) => {
            if (callback) {
                callback(eventDataJson);
            }
        });
    });
    afterEach(function () {
        document.body.removeChild(frontPanelWrapperEl);
    });
    it('constructs correctly', function () {
        expect(service).toBeDefined();
        expect(service.onElementAdded).toBeDefined();
        expect(service.onElementRemoved).toBeDefined();
        expect(service.requestSendElementBounds).toBeDefined();
    });
    describe('calling onElementAdded', function () {
        it('with no parameters throws', function () {
            const callOnElementAdded = function () {
                service.onElementAdded();
            };
            expect(callOnElementAdded).toThrow();
        });
        it('with valid Element does not throw, bounds are sent', function (done) {
            const el = createElement('10px', '20px', '30px', '40px', 'absolute');
            frontPanelEl.appendChild(el);
            const callOnElementAdded = function () {
                service.onElementAdded(el, '1');
            };
            callback = function (eventDataJson) {
                // assert bounds are sent when new element is registered
                done();
            };
            expect(callOnElementAdded).not.toThrow();
        });
    });
    describe('calling onElementRemoved', function () {
        it('with no parameters throws', function () {
            const callOnElementRemoved = function () {
                service.onElementRemoved();
            };
            expect(callOnElementRemoved).toThrow();
        });
        it('with unregistered controlId does not throw', function () {
            const callOnElementRemoved = function () {
                service.onElementRemoved('1');
            };
            expect(callOnElementRemoved).not.toThrow();
        });
        it('with valid registered controlId does not throw, bounds are sent', function (done) {
            const elA = createElement('10px', '20px', '30px', '40px', 'absolute');
            frontPanelEl.appendChild(elA);
            service.onElementAdded(elA, 'A');
            const elB = createElement('1px', '2px', '3px', '4px', 'absolute');
            elA.appendChild(elB);
            service.onElementAdded(elB, 'B');
            const callOnElementRemoved = function () {
                service.onElementRemoved('B');
            };
            callback = function () {
                // assert bounds are sent when element is unregistered
                done();
            };
            expect(callOnElementRemoved).not.toThrow();
        });
    });
    describe('calling requestSendElementBounds', function () {
        it('with no registered elements does not throw', function () {
            const callRequestSendElementBounds = function () {
                service.requestSendElementBounds();
            };
            expect(callRequestSendElementBounds).not.toThrow();
        });
        it('with registered absolute elements sends correct bounds', function (done) {
            // set up two absolute positioned elements, one nested in another
            const elA = createElement('10px', '20px', '30px', '40px', 'absolute');
            frontPanelEl.appendChild(elA);
            service.onElementAdded(elA, 'A');
            const elB = createElement('1px', '2px', '3px', '4px', 'absolute');
            elA.appendChild(elB);
            service.onElementAdded(elB, 'B');
            const callRequestSendElementBounds = function () {
                service.requestSendElementBounds();
            };
            callback = function (eventDataJson) {
                const eventData = JSON.parse(eventDataJson);
                const expectedData = {
                    FP: {
                        width: 1024,
                        height: 768,
                        left: 50,
                        right: 1074,
                        top: 50,
                        bottom: 818
                    },
                    A: {
                        width: 10,
                        height: 20,
                        left: 30,
                        right: 40,
                        top: 40,
                        bottom: 60
                    },
                    B: {
                        width: 1,
                        height: 2,
                        left: 3,
                        right: 4,
                        top: 4,
                        bottom: 6
                    }
                };
                for (const element in expectedData) {
                    for (const property in expectedData[element]) {
                        expect(expectedData[element][property]).toBeCloseTo(eventData[element][property], 1);
                    }
                }
                done();
            };
            expect(callRequestSendElementBounds).not.toThrow();
        });
        it('with registered flex elements sends correct bounds', function (done) {
            // set up two static flex elements, one nested in another
            const elA = createElement('10px', '20px', null, null, null, 'flex', '5px');
            frontPanelEl.appendChild(elA);
            service.onElementAdded(elA, 'A');
            const elB = createElement('1px', '2px', null, null, null, 'flex', '1px');
            elA.appendChild(elB);
            service.onElementAdded(elB, 'B');
            const callRequestSendElementBounds = function () {
                service.requestSendElementBounds();
            };
            callback = function (eventDataJson) {
                const eventData = JSON.parse(eventDataJson);
                const expectedData = {
                    FP: {
                        width: 1024,
                        height: 768,
                        left: 50,
                        right: 1074,
                        top: 50,
                        bottom: 818
                    },
                    A: {
                        width: 10,
                        height: 20,
                        left: 5,
                        right: 15,
                        top: 5,
                        bottom: 25
                    },
                    B: {
                        width: 1,
                        height: 2,
                        left: 1,
                        right: 2,
                        top: 1,
                        bottom: 3
                    }
                };
                for (const element in expectedData) {
                    for (const property in expectedData[element]) {
                        expect(expectedData[element][property]).toBeCloseTo(eventData[element][property], 1);
                    }
                }
                done();
            };
            expect(callRequestSendElementBounds).not.toThrow();
        });
    });
});
//# sourceMappingURL=niBoundsUpdateEventService.Test.js.map