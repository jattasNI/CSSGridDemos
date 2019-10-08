"use strict";
//******************************************
// Tests for Analog Waveform data type
// National Instruments Copyright 2014
//******************************************
describe('An Analog Waveform', function () {
    'use strict';
    it('can be created empty', function () {
        const aw = new window.NIAnalogWaveform();
        expect(aw.t0).toEqual(new window.NITimestamp());
        expect(aw.dt).toBe(0);
        expect(aw.Y).toEqual([]);
        expect(aw.channelName).toBe(undefined);
    });
    it('can be constructed from a JSON string', function () {
        const jsonstring = '{"t0":"0:0", "dt":3.6, "Y":[1, 2, 3], "channelName":"name"}';
        const aw = new window.NIAnalogWaveform(jsonstring);
        expect(aw.t0 instanceof window.NITimestamp).toBe(true);
        expect(aw.dt).toBe(3.6);
        expect(aw.Y).toEqual([1, 2, 3]);
        expect(aw.channelName).toBe('name');
    });
    it('throws when passed an invalid JSON string', function () {
        const jsonstring = '{"t0":"0:0", "dt":3.6, "Y":[1, 2, 3], "channelName":"name"';
        expect(function () {
            return new window.NIAnalogWaveform(jsonstring);
        }).toThrow();
    });
    it('can be constructed from a JSON object', function () {
        const jsonObj = {
            t0: '0:0',
            dt: 3.6,
            Y: [1, 2, 3],
            channelName: 'name'
        };
        const aw = new window.NIAnalogWaveform(jsonObj);
        expect(aw.t0 instanceof window.NITimestamp).toBe(true);
        expect(aw.dt).toBe(3.6);
        expect(aw.Y).toEqual([1, 2, 3]);
        expect(aw.channelName).toBe('name');
    });
    it('can be constructed from an incomplete JSON object', function () {
        const jsonObj = {
            Y: [1, 2, 3]
        };
        const aw = new window.NIAnalogWaveform(jsonObj);
        expect(aw.t0 instanceof window.NITimestamp).toBe(true);
        expect(aw.dt).toBe(0);
        expect(aw.Y).toEqual([1, 2, 3]);
        expect(aw.channelName).toBe(undefined);
    });
    describe('appendArray method', function () {
        it('can append an array to the waveform', function () {
            const aw = new window.NIAnalogWaveform();
            aw.appendArray([1, 2, 3]);
            expect(aw.Y).toEqual([1, 2, 3]);
        });
    });
    describe('appendWaveform method', function () {
        it('can append a waveform to the waveform', function () {
            const aw = new window.NIAnalogWaveform({
                t0: '0:0',
                dt: 3,
                Y: [1, 2, 3]
            });
            const toAppend = new window.NIAnalogWaveform({
                t0: '9:0',
                dt: 3,
                Y: [4, 5, 6]
            });
            aw.appendWaveform(toAppend);
            expect(aw.Y).toEqual([1, 2, 3, 4, 5, 6]);
            expect(aw.dt).toEqual(3);
            expect(aw.t0.toString()).toEqual('0:0');
        });
        describe('replaces the waveform with new one if', function () {
            it('sampling interval is not identical', function () {
                const aw = new window.NIAnalogWaveform({
                    t0: '0:0',
                    dt: 2,
                    Y: [1, 2, 3]
                });
                const toAppend = new window.NIAnalogWaveform({
                    t0: '6:0',
                    dt: 3,
                    Y: [4, 5, 6]
                });
                aw.appendWaveform(toAppend);
                expect(aw).toEqual(toAppend);
            });
            it('the waveform to append it is not strictly following the current one', function () {
                const aw = new window.NIAnalogWaveform({
                    t0: '0:0',
                    dt: 3,
                    Y: [1, 2, 3]
                });
                const toAppend = new window.NIAnalogWaveform({
                    t0: '6:0',
                    dt: 3,
                    Y: [4, 5, 6]
                });
                aw.appendWaveform(toAppend);
                expect(aw).toEqual(toAppend);
            });
        });
    });
    describe('toTimeAndValueArray', function () {
        it('works for an empty waveform', function () {
            const aw = new window.NIAnalogWaveform();
            expect(aw.toTimeAndValueArray()).toEqual([]);
        });
        it('works for a simple waveform', function () {
            const aw = new window.NIAnalogWaveform({
                t0: '0:0',
                dt: 10,
                Y: [0, 1, 2]
            });
            const ExpectedT0 = 60052752000;
            expect(aw.toTimeAndValueArray()).toEqual([[ExpectedT0, 0], [ExpectedT0 + 10, 1], [ExpectedT0 + 20, 2]]);
        });
    });
});
//# sourceMappingURL=niAnalogWaveform.Test.js.map