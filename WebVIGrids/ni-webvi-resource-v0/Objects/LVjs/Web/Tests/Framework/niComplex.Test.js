"use strict";
//******************************************
// Tests for NIComplex data type
// National Instruments Copyright 2016
//******************************************
describe('A NIcomplex', function () {
    'use strict';
    const ComplexNumber = window.NIComplex;
    describe('An NIComplex', function () {
        it('can be constructed from a string "±a"', function () {
            let complexN = new ComplexNumber('+5');
            expect(complexN.realPart).toBe(5);
            expect(complexN.imaginaryPart).toBe(0);
            complexN = new ComplexNumber('-5');
            expect(complexN.realPart).toBe(-5);
            expect(complexN.imaginaryPart).toBe(0);
        });
        it('can be constructed from a string "±bi"', function () {
            let complexN = new ComplexNumber('+5i');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(5);
            complexN = new ComplexNumber('-5i');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(-5);
        });
        it('can be constructed from a string ±i"', function () {
            let complexN = new ComplexNumber('+i');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(1);
            complexN = new ComplexNumber('-i');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(-1);
            complexN = new ComplexNumber('i');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(1);
        });
        it('can be constructed from a string "±a±bi"', function () {
            let complexN = new ComplexNumber('+5+4i');
            expect(complexN.realPart).toBe(5);
            expect(complexN.imaginaryPart).toBe(4);
            complexN = new ComplexNumber('-5+4i');
            expect(complexN.realPart).toBe(-5);
            expect(complexN.imaginaryPart).toBe(4);
            complexN = new ComplexNumber('+5-4i');
            expect(complexN.realPart).toBe(5);
            expect(complexN.imaginaryPart).toBe(-4);
            complexN = new ComplexNumber('-5-4i');
            expect(complexN.realPart).toBe(-5);
            expect(complexN.imaginaryPart).toBe(-4);
            complexN = new ComplexNumber('-551152-442141i');
            expect(complexN.realPart).toBe(-551152);
            expect(complexN.imaginaryPart).toBe(-442141);
        });
        it('can be constructed from a string "±a±i"', function () {
            let complexN = new ComplexNumber('+5+i');
            expect(complexN.realPart).toBe(5);
            expect(complexN.imaginaryPart).toBe(1);
            complexN = new ComplexNumber('+5-i');
            expect(complexN.realPart).toBe(5);
            expect(complexN.imaginaryPart).toBe(-1);
            complexN = new ComplexNumber('-5+i');
            expect(complexN.realPart).toBe(-5);
            expect(complexN.imaginaryPart).toBe(1);
            complexN = new ComplexNumber('-5-i');
            expect(complexN.realPart).toBe(-5);
            expect(complexN.imaginaryPart).toBe(-1);
            complexN = new ComplexNumber('-5-i');
            expect(complexN.realPart).toBe(-5);
            expect(complexN.imaginaryPart).toBe(-1);
        });
        it('can be constructed from a string "±i±a"', function () {
            let complexN = new ComplexNumber('+i+5');
            expect(complexN.realPart).toBe(5);
            expect(complexN.imaginaryPart).toBe(1);
            complexN = new ComplexNumber('-i+5');
            expect(complexN.realPart).toBe(5);
            expect(complexN.imaginaryPart).toBe(-1);
            complexN = new ComplexNumber('+i-5');
            expect(complexN.realPart).toBe(-5);
            expect(complexN.imaginaryPart).toBe(1);
            complexN = new ComplexNumber('-i-5');
            expect(complexN.realPart).toBe(-5);
            expect(complexN.imaginaryPart).toBe(-1);
        });
        it('can be constructed from a string "±bi±a"', function () {
            let complexN = new ComplexNumber('+4i+5');
            expect(complexN.realPart).toBe(5);
            expect(complexN.imaginaryPart).toBe(4);
            complexN = new ComplexNumber('-4i+5');
            expect(complexN.realPart).toBe(5);
            expect(complexN.imaginaryPart).toBe(-4);
            complexN = new ComplexNumber('+4i-5');
            expect(complexN.realPart).toBe(-5);
            expect(complexN.imaginaryPart).toBe(4);
            complexN = new ComplexNumber('-4i-5');
            expect(complexN.realPart).toBe(-5);
            expect(complexN.imaginaryPart).toBe(-4);
        });
        it('can be constructed from a string "±ae±exp"', function () {
            let complexN = new ComplexNumber('+5e+2');
            expect(complexN.realPart).toBe(500);
            expect(complexN.imaginaryPart).toBe(0);
            complexN = new ComplexNumber('+5e-2');
            expect(complexN.realPart).toBe(0.05);
            expect(complexN.imaginaryPart).toBe(0);
            complexN = new ComplexNumber('-5e+2');
            expect(complexN.realPart).toBe(-500);
            expect(complexN.imaginaryPart).toBe(0);
            complexN = new ComplexNumber('-5e-2');
            expect(complexN.realPart).toBe(-0.05);
            expect(complexN.imaginaryPart).toBe(0);
        });
        it('can be constructed from a string "±be±expi"', function () {
            let complexN = new ComplexNumber('+5e+2i');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(500);
            complexN = new ComplexNumber('+5e-2i');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(0.05);
            complexN = new ComplexNumber('-5e+2i');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(-500);
            complexN = new ComplexNumber('-5e-2i');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(-0.05);
        });
        it('can be constructed from a string "±ae±exp±be±expi"', function () {
            let complexN = new ComplexNumber('+5e+2+4e-3i');
            expect(complexN.realPart).toBe(500);
            expect(complexN.imaginaryPart).toBe(0.004);
            complexN = new ComplexNumber('5e-2-4e+3i');
            expect(complexN.realPart).toBe(0.05);
            expect(complexN.imaginaryPart).toBe(-4000);
            complexN = new ComplexNumber('56e-10-4235e+14i');
            expect(complexN.realPart).toBe(56e-10);
            expect(complexN.imaginaryPart).toBe(-4235e+14);
        });
        it('can be constructed from a string "±aeexp±beexpi"', function () {
            let complexN = new ComplexNumber('+5e2+4e-3i');
            expect(complexN.realPart).toBe(500);
            expect(complexN.imaginaryPart).toBe(0.004);
            complexN = new ComplexNumber('5e-2-4e3i');
            expect(complexN.realPart).toBe(0.05);
            expect(complexN.imaginaryPart).toBe(-4000);
            complexN = new ComplexNumber('56e-10-4235e14i');
            expect(complexN.realPart).toBe(56e-10);
            expect(complexN.imaginaryPart).toBe(-4235e+14);
        });
        it('can be constructed from a string containing float numbers', function () {
            let complexN = new ComplexNumber('3.14+2.71i');
            expect(complexN.realPart).toBe(3.14);
            expect(complexN.imaginaryPart).toBe(2.71);
            complexN = new ComplexNumber('423.3214+242.5271i');
            expect(complexN.realPart).toBe(423.3214);
            expect(complexN.imaginaryPart).toBe(242.5271);
            complexN = new ComplexNumber('423.3214e-6+242.5271e+4i');
            expect(complexN.realPart).toBe(0.0004233214);
            expect(complexN.imaginaryPart).toBe(2425271);
        });
        it('can be constructed from a string ±.a', function () {
            let complexN = new ComplexNumber('+.23');
            expect(complexN.realPart).toBe(0.23);
            expect(complexN.imaginaryPart).toBe(0);
            complexN = new ComplexNumber('-.23');
            expect(complexN.realPart).toBe(-0.23);
            expect(complexN.imaginaryPart).toBe(0);
        });
        it('can be constructed from a string ±.bi', function () {
            let complexN = new ComplexNumber('.3i');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(0.3);
            complexN = new ComplexNumber('+.23i');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(0.23);
            complexN = new ComplexNumber('-.23i');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(-0.23);
        });
        it('can be constructed from a string ±.a±.bi', function () {
            let complexN = new ComplexNumber('+.23-.45i');
            expect(complexN.realPart).toBe(0.23);
            expect(complexN.imaginaryPart).toBe(-0.45);
            complexN = new ComplexNumber('-.23+.12i');
            expect(complexN.realPart).toBe(-0.23);
            expect(complexN.imaginaryPart).toBe(+0.12);
        });
        it('can be constructed from a string ±.ae±exp', function () {
            let complexN = new ComplexNumber('+.23e-3');
            expect(complexN.realPart).toBe(0.00023);
            expect(complexN.imaginaryPart).toBe(0);
            complexN = new ComplexNumber('-.23e+3');
            expect(complexN.realPart).toBe(-230);
            expect(complexN.imaginaryPart).toBe(0);
        });
        it('can be constructed from a string ±a.', function () {
            let complexN = new ComplexNumber('+23.');
            expect(complexN.realPart).toBe(23);
            expect(complexN.imaginaryPart).toBe(0);
            complexN = new ComplexNumber('-23.');
            expect(complexN.realPart).toBe(-23);
            expect(complexN.imaginaryPart).toBe(0);
        });
        it('can be constructed from a string ±b.i', function () {
            let complexN = new ComplexNumber('+23.i');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(23);
            complexN = new ComplexNumber('-23.i');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(-23);
        });
        it('can be constructed from a string ±b.±e±expi', function () {
            let complexN = new ComplexNumber('+23.e-2i');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(0.23);
            complexN = new ComplexNumber('-23.e+2i');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(-2300);
        });
        it('can be constructed from a string ±a.±e±exp', function () {
            let complexN = new ComplexNumber('+23.e-2');
            expect(complexN.realPart).toBe(0.23);
            expect(complexN.imaginaryPart).toBe(0);
            complexN = new ComplexNumber('-23.e+2');
            expect(complexN.realPart).toBe(-2300);
            expect(complexN.imaginaryPart).toBe(0);
        });
        it('can be constructed from a string containing spaces', function () {
            let complexN = new ComplexNumber(' 43  + 25i');
            expect(complexN.realPart).toBe(43);
            expect(complexN.imaginaryPart).toBe(25);
            complexN = new ComplexNumber(' 43 e - 3  + 25i');
            expect(complexN.realPart).toBe(0.043);
            expect(complexN.imaginaryPart).toBe(25);
        });
        it('can be constructed from scientific notation with e or E', function () {
            let complexN = new ComplexNumber('34E-4+2i');
            expect(complexN.realPart).toBe(0.0034);
            expect(complexN.imaginaryPart).toBe(2);
            complexN = new ComplexNumber('34e-4+2i');
            expect(complexN.realPart).toBe(0.0034);
            expect(complexN.imaginaryPart).toBe(2);
        });
        it('can be constructed from a string containing Infinity', function () {
            let complexN = new ComplexNumber('Infinity');
            expect(complexN.realPart).toBe(Infinity);
            expect(complexN.imaginaryPart).toBe(0);
            complexN = new ComplexNumber('-Infinity');
            expect(complexN.realPart).toBe(-Infinity);
            expect(complexN.imaginaryPart).toBe(0);
            complexN = new ComplexNumber('-Infinityi');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(-Infinity);
            complexN = new ComplexNumber('Infinity-Infinityi');
            expect(complexN.realPart).toBe(Infinity);
            expect(complexN.imaginaryPart).toBe(-Infinity);
            complexN = new ComplexNumber('Infinityi-Infinity');
            expect(complexN.realPart).toBe(-Infinity);
            expect(complexN.imaginaryPart).toBe(Infinity);
            complexN = new ComplexNumber('-Infinityi-Infinity');
            expect(complexN.realPart).toBe(-Infinity);
            expect(complexN.imaginaryPart).toBe(-Infinity);
            complexN = new ComplexNumber('Infinity-3i');
            expect(complexN.realPart).toBe(Infinity);
            expect(complexN.imaginaryPart).toBe(-3);
            complexN = new ComplexNumber('Infinityi-3');
            expect(complexN.realPart).toBe(-3);
            expect(complexN.imaginaryPart).toBe(Infinity);
            complexN = new ComplexNumber('+inf');
            expect(complexN.realPart).toBe(Infinity);
            expect(complexN.imaginaryPart).toBe(0);
            complexN = new ComplexNumber('+Inf');
            expect(complexN.realPart).toBe(Infinity);
            expect(complexN.imaginaryPart).toBe(0);
            complexN = new ComplexNumber('-inf');
            expect(complexN.realPart).toBe(-Infinity);
            expect(complexN.imaginaryPart).toBe(0);
            complexN = new ComplexNumber('-inf-infi');
            expect(complexN.realPart).toBe(-Infinity);
            expect(complexN.imaginaryPart).toBe(-Infinity);
            complexN = new ComplexNumber('-infinity-infi');
            expect(complexN.realPart).toBe(-Infinity);
            expect(complexN.imaginaryPart).toBe(-Infinity);
            complexN = new ComplexNumber('+infinity+Infinityi');
            expect(complexN.realPart).toBe(Infinity);
            expect(complexN.imaginaryPart).toBe(Infinity);
        });
        it('can be constructed from a string containing NaN', function () {
            let complexN = new ComplexNumber('NaN+3i');
            expect(complexN.realPart).toBeNaN();
            expect(complexN.imaginaryPart).toBe(3);
            complexN = new ComplexNumber('3+NaNi');
            expect(complexN.realPart).toBe(3);
            expect(complexN.imaginaryPart).toBeNaN();
            complexN = new ComplexNumber('-NaN');
            expect(complexN.realPart).toBeNaN();
            expect(complexN.imaginaryPart).toBe(0);
            complexN = new ComplexNumber('-NaNi');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBeNaN();
            complexN = new ComplexNumber('NaNi');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBeNaN();
            complexN = new ComplexNumber('NaN+NaNi');
            expect(complexN.realPart).toBeNaN();
            expect(complexN.imaginaryPart).toBeNaN();
            complexN = new ComplexNumber('-NaN-NaNi');
            expect(complexN.realPart).toBeNaN();
            expect(complexN.imaginaryPart).toBeNaN();
        });
        it('throws an error for invalid input', function () {
            expect(function () {
                return new ComplexNumber('12+13');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('12e-52+13e-32');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('12+13e-3');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('abc');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('abc+131i');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('152+abi');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('152agd');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('e');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('-a3i');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('ei-3');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('15e-');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('15e');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('15eee');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('e-3');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('e-3i');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('e-i');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('ie');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('-ie');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('-ei');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('-3ia');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('-3ie');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('35e-3ab');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('35as3e-4');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('');
            }).toThrow();
            expect(function () {
                return new ComplexNumber(' ');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('undefined');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('null');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('-.i');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('-.');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('.i');
            }).toThrow();
            expect(function () {
                return new ComplexNumber('.');
            }).toThrow();
            expect(function () {
                return new ComplexNumber({});
            }).toThrow();
        });
        it('can be constructed from numbers', function () {
            let complexN = new ComplexNumber(5, 4);
            expect(complexN.realPart).toBe(5);
            expect(complexN.imaginaryPart).toBe(4);
            complexN = new ComplexNumber(5);
            expect(complexN.realPart).toBe(5);
            expect(complexN.imaginaryPart).toBe(0);
        });
    });
    describe('An NIComplex', function () {
        it('has a toString method that returns the object as a string.', function () {
            const complexN = new ComplexNumber('5+4i');
            expect(complexN.toString()).toBe('5 + 4i');
        });
        it('has a toString method that returns a correct string when the imaginary part is negative.', function () {
            const complexN = new ComplexNumber('5-4i');
            expect(complexN.toString()).toBe('5 - 4i');
        });
    });
    describe('Parse from string', function () {
        it('can return an array of type [real, imaginary].', function () {
            const complexN = ComplexNumber.prototype.parseFromString('5+4i');
            expect(complexN[0]).toBe(5);
            expect(complexN[1]).toBe(4);
        });
    });
    describe('compare method', function () {
        it('works for all cases', function () {
            const testVector = [
                [new ComplexNumber('5 + 4i'), new ComplexNumber('5 + 4i'), 0],
                [new ComplexNumber('4 + 5i'), new ComplexNumber('5 + 4i'), 0],
                [new ComplexNumber('5 + 4i'), new ComplexNumber('3 + 4i'), 1],
                [new ComplexNumber('5 + 4i'), new ComplexNumber('4 + 3i'), 1],
                [new ComplexNumber('4 + 4i'), new ComplexNumber('5 + 4i'), -1],
                [new ComplexNumber('4 + 3i'), new ComplexNumber('4 + 4i'), -1]
            ];
            testVector.forEach(function (t) {
                expect(t[0].compare(t[1])).toBe(t[2]);
            });
        });
    });
    describe('input with SI prefixes', function () {
        it('works in regular cases', function () {
            let complexN = new ComplexNumber('5M+4ki');
            expect(complexN.realPart).toBe(5000000);
            expect(complexN.imaginaryPart).toBe(4000);
            complexN = new ComplexNumber('4ki+5M');
            expect(complexN.realPart).toBe(5000000);
            expect(complexN.imaginaryPart).toBe(4000);
            complexN = new ComplexNumber('-4ki-5M');
            expect(complexN.realPart).toBe(-5000000);
            expect(complexN.imaginaryPart).toBe(-4000);
            complexN = new ComplexNumber('5G-7i');
            expect(complexN.realPart).toBe(5000000000);
            expect(complexN.imaginaryPart).toBe(-7);
            complexN = new ComplexNumber('500000-700ki');
            expect(complexN.realPart).toBe(500000);
            expect(complexN.imaginaryPart).toBe(-700000);
            complexN = new ComplexNumber('33G');
            expect(complexN.realPart).toBe(33000000000);
            expect(complexN.imaginaryPart).toBe(0);
            complexN = new ComplexNumber('33Gi');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(33000000000);
            complexN = new ComplexNumber('-3ai');
            expect(complexN.realPart).toBe(0);
            expect(complexN.imaginaryPart).toBe(-3.0000000000000002e-18);
        });
        it('all prefixes are calculated as expected', function () {
            let complexN = new ComplexNumber('5Z');
            expect(complexN.realPart).toBe(5e+21);
            complexN = new ComplexNumber('5E');
            expect(complexN.realPart).toBe(5e+18);
            complexN = new ComplexNumber('5P');
            expect(complexN.realPart).toBe(5e+15);
            complexN = new ComplexNumber('5T');
            expect(complexN.realPart).toBe(5e+12);
            complexN = new ComplexNumber('5G');
            expect(complexN.realPart).toBe(5e+9);
            complexN = new ComplexNumber('5M');
            expect(complexN.realPart).toBe(5e+6);
            complexN = new ComplexNumber('5k');
            expect(complexN.realPart).toBe(5e+3);
            complexN = new ComplexNumber('5c');
            expect(complexN.realPart).toBe(5e-2);
            complexN = new ComplexNumber('5m');
            expect(complexN.realPart).toBe(5e-3);
            complexN = new ComplexNumber('5n');
            expect(complexN.realPart).toBe(5e-9);
            complexN = new ComplexNumber('5p');
            expect(complexN.realPart).toBe(5e-12);
            complexN = new ComplexNumber('5a');
            expect(complexN.realPart).toBe(5e-18);
            complexN = new ComplexNumber('5z');
            expect(complexN.realPart).toBe(5e-21);
        });
        it('works in special cases', function () {
            let complexN = new ComplexNumber('34E-4+2i');
            expect(complexN.realPart).toBe(0.0034);
            expect(complexN.imaginaryPart).toBe(2);
            complexN = new ComplexNumber('2+34Ei');
            expect(complexN.realPart).toBe(2);
            expect(complexN.imaginaryPart).toBe(34000000000000000000);
            complexN = new ComplexNumber('2+34E2i');
            expect(complexN.realPart).toBe(2);
            expect(complexN.imaginaryPart).toBe(3400);
            complexN = new ComplexNumber('34e+3+2Ei');
            expect(complexN.realPart).toBe(34000);
            expect(complexN.imaginaryPart).toBe(2000000000000000000);
        });
    });
});
//# sourceMappingURL=niComplex.Test.js.map