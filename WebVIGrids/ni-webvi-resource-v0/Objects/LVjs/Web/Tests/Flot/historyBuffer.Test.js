"use strict";
describe('A History Buffer', function () {
    'use strict';
    it('has a clear method', function () {
        const hb = new window.HistoryBuffer(10);
        hb.clear();
        expect(hb.capacity).toBe(10);
    });
    it('clear method clears the data', function () {
        const hb = new window.HistoryBuffer(10);
        hb.appendArray([1, 2, 3]);
        hb.clear();
        expect(hb.count).toBe(0);
    });
    it('has a capacity property', function () {
        const hb = new window.HistoryBuffer(10);
        expect(hb.capacity).toBe(10);
    });
    it('has a setCapacity method', function () {
        const hb = new window.HistoryBuffer(10);
        hb.setCapacity(20);
        expect(hb.capacity).toBe(20);
    });
    it('setCapacity method clears the data', function () {
        const hb = new window.HistoryBuffer(10);
        hb.appendArray([1, 2, 3]);
        hb.setCapacity(20);
        expect(hb.count).toBe(0);
    });
    it('has a width property', function () {
        const hb = new window.HistoryBuffer(10, 3);
        expect(hb.width).toBe(3);
    });
    it('has a setWidth method', function () {
        const hb = new window.HistoryBuffer(10, 1);
        hb.setWidth(2);
        expect(hb.width).toBe(2);
    });
    it('setWidth method clears the data', function () {
        const hb = new window.HistoryBuffer(10, 1);
        hb.appendArray([1, 2, 3]);
        hb.setWidth(2);
        expect(hb.count).toBe(0);
    });
    it('has an appendArray method', function () {
        const hb = new window.HistoryBuffer(10);
        hb.appendArray([1, 2, 3]);
        [1, 2, 3, undefined].forEach(function (exp, i) {
            expect(hb.get(i)).toBe(exp);
        });
    });
    it('appendArray method works with arrays bigger that the hb capacity', function () {
        const hb = new window.HistoryBuffer(3);
        hb.appendArray([1, 2, 3, 4]);
        [2, 3, 4].forEach(function (exp, i) {
            expect(hb.get(i + 1)).toBe(exp);
        });
    });
    it('appendArray method works for plots with two data series', function () {
        const hb = new window.HistoryBuffer(10, 2);
        hb.appendArray([[1, 1], [2, 2], [3, 3]]);
        [[1, 1], [2, 2], [3, 3], [undefined, undefined]].forEach(function (exp, i) {
            expect(hb.get(i)).toEqual(exp);
        });
    });
    it('has a toArray method', function () {
        const hb = new window.HistoryBuffer(10);
        hb.appendArray([1, 2, 3]);
        expect(hb.toArray()).toEqual([1, 2, 3]);
    });
    it('toArray method works for plots with two data series', function () {
        const hb = new window.HistoryBuffer(10, 2);
        hb.appendArray([[1, 2], [2, 3], [3, 4]]);
        expect(hb.toArray()).toEqual([[1, 2], [2, 3], [3, 4]]);
    });
    describe('onChange notification', function () {
        it('has an onChange method', function () {
            const hb = new window.HistoryBuffer(10, 1);
            expect(hb.registerOnChange).toEqual(jasmine.any(Function));
        });
        it('onChange is called on push', function () {
            const hb = new window.HistoryBuffer(10);
            const spy = jasmine.createSpy('onChange');
            const keyToRegister = 'key';
            hb.registerOnChange(keyToRegister, spy);
            hb.push(1);
            expect(spy).toHaveBeenCalled();
        });
        it('onChange is called on appendArray', function () {
            const hb = new window.HistoryBuffer(10);
            const spy = jasmine.createSpy('onChange');
            const keyToRegister = 'key';
            hb.registerOnChange(keyToRegister, spy);
            hb.appendArray([1, 2]);
            expect(spy).toHaveBeenCalled();
        });
        it('onChange is called on setCapacity', function () {
            const hb = new window.HistoryBuffer(10);
            const spy = jasmine.createSpy('onChange');
            const keyToRegister = 'key';
            hb.appendArray([1, 2]);
            hb.registerOnChange(keyToRegister, spy);
            hb.setCapacity(20);
            expect(spy).toHaveBeenCalled();
        });
        it('onChange is called on setWidth', function () {
            const hb = new window.HistoryBuffer(10);
            const spy = jasmine.createSpy('onChange');
            const keyToRegister = 'key';
            hb.appendArray([1, 2]);
            hb.registerOnChange(keyToRegister, spy);
            hb.setWidth(2);
            expect(spy).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=historyBuffer.Test.js.map