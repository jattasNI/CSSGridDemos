//**************************************
// Tests for Render Engine
// National Instrumets Copyright 2014
//**************************************
import { RenderEngine } from '../../Framework/niRenderEngine.js';
describe('A Render Engine', function () {
    'use strict';
    const renderEngine = RenderEngine;
    let testElement;
    beforeEach(function () {
        testElement = document.createElement('ni-test');
    });
    afterEach(function () {
        renderEngine.removeRenderBuffer(testElement);
    });
    describe('handles new RenderBuffers by', function () {
        let renderBuffer, renderBuffer2;
        it('creating a defined RenderBuffer', function () {
            renderBuffer = renderEngine.getOrAddRenderBuffer(testElement);
            expect(renderBuffer).toBeDefined();
        });
        it('returning the same RenderBuffer if already added', function () {
            renderBuffer = renderEngine.getOrAddRenderBuffer(testElement);
            renderBuffer2 = renderEngine.getOrAddRenderBuffer(testElement);
            expect(renderBuffer2).toBeDefined();
            expect(renderBuffer).toBe(renderBuffer2);
        });
        it('throwing error if is not a ni-element', function () {
            const getOrAddInvalidOperation = function () {
                const divElement = document.createElement('div');
                renderEngine.getOrAddRenderBuffer(divElement);
            };
            expect(getOrAddInvalidOperation).toThrow();
        });
    });
    describe('handles RenderBuffers removals by', function () {
        it('returning an added RenderBuffer', function () {
            const renderBuffer = renderEngine.getOrAddRenderBuffer(testElement);
            const renderBuffer2 = renderEngine.removeRenderBuffer(testElement);
            expect(renderBuffer).toBeDefined();
            expect(renderBuffer2).toBeDefined();
            expect(renderBuffer).toBe(renderBuffer2);
        });
        it('returning undefined buffer if element is not associated to a renderBuffer', function () {
            const emptyBuffer = renderEngine.removeRenderBuffer(testElement);
            expect(emptyBuffer).toBeUndefined();
        });
        it('throwing an error if is not a ni-element', function () {
            const removeInvalidOp = function () {
                const divElement = document.createElement('div');
                renderEngine.removeRenderBuffer(divElement);
            };
            expect(removeInvalidOp).toThrow();
        });
    });
    describe('enqueues an element', function () {
        const dummyElement = document.createElement('ni-test');
        const enqueueOperation = function () {
            renderEngine.enqueueDomUpdate(dummyElement);
        };
        it('and throws if render buffer was not added first', function () {
            expect(enqueueOperation).toThrow();
        });
        it('and throws if element is not a ni-element', function () {
            const enqueueInvalidOp = function () {
                const divElement = document.createElement('div');
                renderEngine.enqueueDomUpdate(divElement);
            };
            expect(enqueueInvalidOp).toThrow();
        });
        it('and does not request a frame if render buffer is empty', function () {
            expect(renderEngine.isFrameRequested()).toBe(false);
            const renderBuffer = renderEngine.getOrAddRenderBuffer(dummyElement);
            expect(renderBuffer.isEmpty()).toBe(true);
            expect(enqueueOperation).not.toThrow();
            expect(renderEngine.isFrameRequested()).toBe(false);
        });
        it('and requests a frame if render buffer was added first', function () {
            expect(renderEngine.isFrameRequested()).toBe(false);
            const renderBuffer = renderEngine.getOrAddRenderBuffer(dummyElement);
            renderBuffer.properties.booleanProp = true;
            expect(enqueueOperation).not.toThrow();
            expect(renderEngine.isFrameRequested()).toBe(true);
        });
        it('and values are propagated async to element', function (done) {
            dummyElement.booleanProp = false;
            const renderBuffer = renderEngine.getOrAddRenderBuffer(dummyElement);
            renderBuffer.properties.booleanProp = true;
            expect(enqueueOperation).not.toThrow();
            testHelpers.runAsync(done, function () {
                expect(renderBuffer.isEmpty()).toBe(true);
                expect(renderEngine.isFrameRequested()).toBe(false);
                expect(dummyElement.booleanProp).toBe(true);
            });
        });
        it('and postRender is called async a single time only', function (done) {
            const spy = jasmine.createSpy('spy');
            const renderBuffer = renderEngine.getOrAddRenderBuffer(dummyElement);
            renderBuffer.postRender.myFunc = spy;
            enqueueOperation();
            testHelpers.runMultipleAsync(done, function () {
                expect(spy).toHaveBeenCalled();
                expect(spy.calls.count()).toBe(1);
                enqueueOperation();
            }, function () {
                expect(spy.calls.count()).toBe(1);
            });
        });
        it('and a new function can be set to postRender', function (done) {
            const spy1 = jasmine.createSpy('spy1');
            const spy2 = jasmine.createSpy('spy2');
            const renderBuffer = renderEngine.getOrAddRenderBuffer(dummyElement);
            renderBuffer.postRender.myFunc = spy1;
            enqueueOperation();
            testHelpers.runMultipleAsync(done, function () {
                expect(spy1).toHaveBeenCalled();
                renderBuffer.postRender.myFunc = spy2;
                enqueueOperation();
            }, function () {
                expect(spy1.calls.count()).toBe(1);
                expect(spy2).toHaveBeenCalled();
            });
        });
        it('and postRender supports multiple independently-named functions', function (done) {
            const spy1 = jasmine.createSpy('spy1');
            const spy2 = jasmine.createSpy('spy2');
            const renderBuffer = renderEngine.getOrAddRenderBuffer(dummyElement);
            renderBuffer.postRender.myFunc1 = spy1;
            renderBuffer.postRender.myFunc2 = spy2;
            enqueueOperation();
            testHelpers.runAsync(done, function () {
                expect(spy1).toHaveBeenCalled();
                expect(spy1.calls.count()).toBe(1);
                expect(spy2).toHaveBeenCalled();
                expect(spy2.calls.count()).toBe(1);
            });
        });
        it('and values are propagated async to lots of elements on next frame', function (done) {
            const elements = [];
            let element;
            let renderBuffer;
            const numberOfElements = 42; // Sounds like a fun number.
            let i = 0;
            for (i = 0; i < numberOfElements; i++) {
                element = document.createElement('ni-test');
                renderBuffer = renderEngine.getOrAddRenderBuffer(element);
                renderBuffer.properties.booleanProp = true;
                elements.push(element);
                renderEngine.enqueueDomUpdate(element);
            }
            testHelpers.runAsync(done, function () {
                const unmodifiedElements = elements.filter(function (e) {
                    return e.booleanProp === false; // Return elements not affected.
                });
                expect(unmodifiedElements.length).toBe(0);
                expect(renderEngine.isFrameRequested()).toBe(false);
            });
        });
    });
    describe('sets inline style for an element', function () {
        it('and updates CSS variable for an element', function (done) {
            const dummyElement = document.createElement('ni-test');
            const renderBuffer = renderEngine.getOrAddRenderBuffer(dummyElement);
            const cssVariable = '--test-style-color';
            renderBuffer.cssStyles[cssVariable] = '#010203';
            renderEngine.enqueueDomUpdate(dummyElement);
            testHelpers.runAsync(done, function () {
                expect(dummyElement.style.getPropertyValue(cssVariable)).toBe('#010203');
            });
        });
    });
});
//# sourceMappingURL=niRenderEngine.Test.js.map