"use strict";
describe('A Flot graph', function () {
    'use strict';
    const $ = NationalInstruments.Globals.jQuery;
    let plot;
    let placeholder;
    const siTickFormatter = function (num, axis) {
        return window.NINumericFormatters.prototype.toSiNotation(num, axis.tickDecimals);
    };
    const decFixedTickFormatter = function (num, axis) {
        return window.NINumericFormatters.prototype.toDecFixedNotation(num, axis.tickDecimals);
    };
    const decPrecisionTickFormatter = function (num, axis) {
        return window.NINumericFormatters.prototype.toDecPrecisionNotation(num, axis.tickDecimals);
    };
    beforeEach(function () {
        const fixture = setFixtures('<div id="demo-container" style="width: 800px;height: 600px">')
            .find('#demo-container')
            .get(0);
        placeholder = $('<div id="placeholder" style="width: 100%;height: 100%">');
        placeholder.appendTo(fixture);
    });
    it('should generate SI formatted ticks for log axis', function () {
        const expectedTicks = [
            {
                v: 1e-26,
                label: '0'
            },
            {
                v: 1e-24,
                label: '1y'
            },
            {
                v: 1e-19,
                label: '100z'
            },
            {
                v: 1e-14,
                label: '10f'
            },
            {
                v: 1e-9,
                label: '1n'
            },
            {
                v: 0.0001,
                label: '100μ'
            },
            {
                v: 10,
                label: '10'
            },
            {
                v: 1000000,
                label: '1M'
            },
            {
                v: 100000000000,
                label: '100G'
            },
            {
                v: 10000000000000000,
                label: '10P'
            },
            {
                v: 1e21,
                label: '1Z'
            },
            {
                v: 1e26,
                label: '100Y'
            },
            {
                v: 1e26,
                label: '100Y'
            }
        ];
        plot = $.plot(placeholder, [[[]]], {
            xaxes: [{
                    min: 1e-26,
                    max: 1e26,
                    mode: 'log',
                    show: true,
                    tickFormatter: siTickFormatter,
                    tickDecimals: null,
                    autoScale: 'none',
                    showTickLabels: 'all'
                }],
            grid: {
                show: true,
                borderWidth: 1
            }
        });
        plot.setupGrid();
        const axes = plot.getAxes();
        const generatedTicks = axes.xaxis.ticks;
        //because the float repr. of 1e-24 depends on the browser(see expectedTicks), we test only the labels
        generatedTicks.forEach(function (element, index) {
            expect(element.label).toEqual(expectedTicks[index].label);
        });
    });
    it('should generate DecFixed formatted ticks for log axis', function () {
        const expectedTicks = [
            {
                v: 0.0001,
                label: '0.0001'
            },
            {
                v: 0.0001,
                label: '0.0001'
            },
            {
                v: 0.0010,
                label: '0.0010'
            },
            {
                v: 0.01,
                label: '0.0100'
            },
            {
                v: 0.1,
                label: '0.1000'
            },
            {
                v: 1,
                label: '1.0000'
            },
            {
                v: 1,
                label: '1.0000'
            }
        ];
        plot = $.plot(placeholder, [[[]]], {
            xaxes: [{
                    min: 0.0001,
                    max: 1,
                    mode: 'log',
                    show: true,
                    tickFormatter: decFixedTickFormatter,
                    tickDecimals: 4,
                    autoScale: 'none',
                    showTickLabels: 'all'
                }],
            grid: {
                show: true,
                borderWidth: 1
            }
        });
        plot.setupGrid();
        const axes = plot.getAxes();
        const generatedTicks = axes.xaxis.ticks;
        expect(generatedTicks.length).toBe(expectedTicks.length);
        generatedTicks.forEach(function (element, index) {
            expect(element.label).toEqual(expectedTicks[index].label);
        });
    });
    it('should generate DecPrecision formatted ticks for log axis', function () {
        const expectedTicks = [
            {
                v: 1,
                label: '1'
            },
            {
                v: 1,
                label: '1'
            },
            {
                v: 10,
                label: '10'
            },
            {
                v: 100,
                label: '100'
            },
            {
                v: 2000,
                label: '1E+3'
            },
            {
                v: 50000,
                label: '1E+4'
            },
            {
                v: 200000,
                label: '1E+5'
            },
            {
                v: 1000000,
                label: '1E+6'
            },
            {
                v: 1000000,
                label: '1E+6'
            }
        ];
        plot = $.plot(placeholder, [[[]]], {
            xaxes: [{
                    min: 1,
                    max: 1000000,
                    mode: 'log',
                    show: true,
                    tickFormatter: decPrecisionTickFormatter,
                    tickDecimals: 3,
                    autoScale: 'none',
                    showTickLabels: 'all'
                }],
            grid: {
                show: true,
                borderWidth: 1
            }
        });
        plot.setupGrid();
        const axes = plot.getAxes();
        const generatedTicks = axes.xaxis.ticks;
        expect(generatedTicks.length).toBe(expectedTicks.length);
        generatedTicks.forEach(function (element, index) {
            expect(element.label).toEqual(expectedTicks[index].label);
        });
    });
    it('should generate SI formatted ticks for linear axis', function () {
        const expectedTicks = [
            {
                v: 0,
                label: '0'
            },
            {
                v: 0,
                label: '0'
            },
            {
                v: 1e12,
                label: '1T'
            },
            {
                v: 2e12,
                label: '2T'
            },
            {
                v: 3e12,
                label: '3T'
            },
            {
                v: 4e12,
                label: '4T'
            },
            {
                v: 5e12,
                label: '5T'
            },
            {
                v: 6e12,
                label: '6T'
            },
            {
                v: 7e12,
                label: '7T'
            },
            {
                v: 8e12,
                label: '8T'
            },
            {
                v: 9e12,
                label: '9T'
            },
            {
                v: 1e13,
                label: '10T'
            },
            {
                v: 1e13,
                label: '10T'
            }
        ];
        plot = $.plot(placeholder, [[[]]], {
            xaxes: [{
                    min: 0,
                    max: 1e13,
                    mode: null,
                    show: true,
                    tickFormatter: siTickFormatter,
                    tickDecimals: null,
                    autoScale: 'none',
                    showTickLabels: 'all'
                }],
            grid: {
                show: true,
                borderWidth: 1
            }
        });
        plot.setupGrid();
        const axes = plot.getAxes();
        const generatedTicks = axes.xaxis.ticks;
        generatedTicks.forEach(function (element, index) {
            expect(element.label).toEqual(expectedTicks[index].label);
        });
    });
    it('should generate DecFixed formatted ticks for linear axis', function () {
        const expectedTicks = [
            {
                v: -1,
                label: '-1.00'
            },
            {
                v: -1,
                label: '-1.00'
            },
            {
                v: -0.75,
                label: '-0.75'
            },
            {
                v: -0.5,
                label: '-0.50'
            },
            {
                v: -0.25,
                label: '-0.25'
            },
            {
                v: 0,
                label: '0.00'
            },
            {
                v: 0.25,
                label: '0.25'
            },
            {
                v: 0.5,
                label: '0.50'
            },
            {
                v: 0.75,
                label: '0.75'
            },
            {
                v: 1,
                label: '1.00'
            },
            {
                v: 1,
                label: '1.00'
            }
        ];
        plot = $.plot(placeholder, [[[]]], {
            xaxes: [{
                    min: -1,
                    max: 1,
                    mode: null,
                    show: true,
                    tickFormatter: decFixedTickFormatter,
                    tickDecimals: 2,
                    autoScale: 'none',
                    showTickLabels: 'all'
                }],
            grid: {
                show: true,
                borderWidth: 1
            }
        });
        plot.setupGrid();
        const axes = plot.getAxes();
        const generatedTicks = axes.xaxis.ticks;
        generatedTicks.forEach(function (element, index) {
            expect(element.label).toEqual(expectedTicks[index].label);
        });
    });
    it('should generate DecPrecision formatted ticks for linear axis', function () {
        const expectedTicks = [
            {
                v: -1e13,
                label: '-1E+13'
            },
            {
                v: -1e13,
                label: '-1E+13'
            },
            {
                v: -7.5e13,
                label: '-7.5E+12'
            },
            {
                v: -5e12,
                label: '-5E+12'
            },
            {
                v: -2.5e12,
                label: '-2.5E+12'
            },
            {
                v: 0,
                label: '0'
            },
            {
                v: 2.5e12,
                label: '2.5E+12'
            },
            {
                v: 5e12,
                label: '5E+12'
            },
            {
                v: 7.5e12,
                label: '7.5E+12'
            },
            {
                v: 1e13,
                label: '1E+13'
            },
            {
                v: 1e13,
                label: '1E+13'
            }
        ];
        plot = $.plot(placeholder, [[[]]], {
            xaxes: [{
                    min: -1e13,
                    max: 1e13,
                    mode: null,
                    show: true,
                    tickFormatter: decPrecisionTickFormatter,
                    tickDecimals: 3,
                    autoScale: 'none',
                    showTickLabels: 'all'
                }],
            grid: {
                show: true,
                borderWidth: 1
            }
        });
        plot.setupGrid();
        const axes = plot.getAxes();
        const generatedTicks = axes.xaxis.ticks;
        generatedTicks.forEach(function (element, index) {
            expect(element.label).toEqual(expectedTicks[index].label);
        });
    });
});
//# sourceMappingURL=flot.Test.js.map