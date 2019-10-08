"use strict";
//******************************************
// Tests for NITimestamp data type
// National Instruments Copyright 2016
//******************************************
describe('A NITimestamp', function () {
    'use strict';
    const MAXINT64 = '9223372036854775808';
    const MAXUINT64MINUSONE = '18446744073709550000';
    const TS = window.NITimestamp;
    it('can be constructed from a string', function () {
        const ts = new TS('1:' + MAXUINT64MINUSONE); // the part after point is MAXINT64-1
        const ts1 = new TS('1:' + MAXINT64); // the part after point is MAXINT64-1
        expect(ts.seconds).toBe(1);
        expect(ts.fractions).toBe(0.9999999999999999); // largest double smaller than 1
        expect(ts1.seconds).toBe(1);
        expect(ts1.fractions).toBe(0.5);
    });
    it('can be constructed from a Date', function () {
        const epoch = new Date(Date.UTC(1904, 0, 1, 0, 0, 0));
        const ts = new TS(epoch); // the Labview Epoch
        expect(ts.seconds).toBe(0);
        expect(ts.fractions).toBe(0.0); // largest double smaller than 1
    });
    it('can be constructed from a pre-epoch Date', function () {
        const epoch = new Date(Date.UTC(0, 1, 1, 2, 3, 4, 5));
        const ts = new TS(epoch); // the Labview Epoch
        expect(ts.seconds).toBeLessThan(0);
        expect(ts.fractions).toBeGreaterThan(0);
    });
    it('can be constructed from a Number', function () {
        const ts = new TS(10.5);
        expect(ts.seconds).toBe(10);
        expect(ts.fractions).toBe(0.5); // largest double smaller than 1
    });
    it('can be constructed from a Timestamp', function () {
        const ts = new TS(10.5);
        const newTs = new TS(ts);
        expect(newTs.seconds).toBe(10);
        expect(newTs.fractions).toBe(0.5); // largest double smaller than 1
    });
    it('constructed with no params has a value of 0 seconds and a 0.0 fractional value', function () {
        const ts = new TS(); // the Labview Epoch
        expect(ts.seconds).toBe(0);
        expect(ts.fractions).toBe(0.0); // largest double smaller than 1
    });
    it('can be converted to a Date', function () {
        const ts = new TS(); // the Labview Epoch
        const d = ts.toDate();
        expect(d.valueOf()).toBe(-ts.epochDiffInSeconds * 1000);
    });
    it('valueOf returns the number of seconds in the timestamp', function () {
        const ts = new TS(1.5);
        expect(0 + ts).toEqual(1.5);
        expect(ts.valueOf()).toEqual(1.5);
    });
    describe('compare method', function () {
        it('works for all cases', function () {
            const testVector = [
                [new TS('1:1'), new TS('1:1'), 0],
                [new TS('1:0'), new TS('0:0'), 1],
                [new TS('0:0'), new TS('1:0'), -1],
                [new TS('1:4000'), new TS('1:2000'), 1],
                [new TS('1:2000'), new TS('1:4000'), -1]
            ];
            testVector.forEach(function (t) {
                expect(t[0].compare(t[1])).toBe(t[2]);
            });
        });
    });
    describe('add method', function () {
        it('works for all cases', function () {
            const testVector = [
                [1.1, 0, [1, 0.1]],
                [1.1, -0.1, [1, 0]],
                [0, -0.1, [-1, 0.9]],
                [1.1, -0.2, [0, 0.9]]
            ];
            testVector.forEach(function (t) {
                const ts = new TS(t[0]);
                ts.add(t[1]);
                expect(ts.seconds).toBe(t[2][0]);
                expect(ts.fractions).toBeCloseTo(t[2][1], 7);
            });
        });
    });
    describe('round trip', function () {
        it('works for all cases', function () {
            const testVector = [0, 0.5, 1.5, -1.5, -0.5];
            testVector.forEach(function (t) {
                const ts1 = new TS(t);
                const firstSerialization = ts1.toString();
                const ts2 = new TS(firstSerialization);
                const secondSerialization = ts2.toString();
                expect(firstSerialization).toBe(secondSerialization);
            });
        });
    });
});
//# sourceMappingURL=niTimestamp.Test.js.map