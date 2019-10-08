"use strict";
describe('A Flot chart', function () {
    'use strict';
    const $ = NationalInstruments.Globals.jQuery;
    let plot;
    let placeholder;
    beforeEach(function () {
        const fixture = setFixtures('<div id="demo-container" style="width: 800px;height: 600px">').find('#demo-container').get(0);
        placeholder = $('<div id="placeholder" style="width: 100%;height: 100%">');
        placeholder.appendTo(fixture);
    });
    afterEach(function () {
        if (plot) {
            plot.shutdown();
        }
    });
    it('allows to specify a historyBuffer when creating the plot', function () {
        const hb = new window.HistoryBuffer(10, 1);
        hb.push(33);
        plot = $.plot(placeholder, [[]], {
            series: {
                historyBuffer: hb
            }
        });
        expect(plot.getData()[0].datapoints.points).toEqual([0, 33]);
    });
    it('keeps track of the total number of elements introduced in the buffer', function () {
        const hb = new window.HistoryBuffer(1, 1);
        hb.push(33);
        hb.push(34);
        plot = $.plot(placeholder, [[]], {
            series: {
                historyBuffer: hb
            }
        });
        expect(plot.getData()[0].datapoints.points).toEqual([1, 34]);
    });
});
//# sourceMappingURL=charting.Test.js.map