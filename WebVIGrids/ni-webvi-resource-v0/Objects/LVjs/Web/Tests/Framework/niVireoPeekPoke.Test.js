import { VireoPeeker as VIREO_PEEKER } from '../../Framework/niVireoPeeker.js';
import { VireoPoker as VIREO_POKER } from '../../Framework/niVireoPoker.js';
// The import path to vireoHelpers should be relative to the path under Object\LVjs\Web instead of the HtmlControls.Design\Web folder
// since thats where the product/test/rollup will use this file from.
import vireoHelpers from '../../../../../NodeApps/node_modules/@ni-private/webvi-deps/node_modules/vireo/source/core/vireo.loader.wasm32-unknown-emscripten.release.js';
describe('The Vireo api (#FailsCSP)', function () {
    'use strict';
    const NIComplex = window.NIComplex;
    describe('has access to vireo\'s memory', function () {
        const NITimestamp = window.NITimestamp;
        let vireo;
        const viName = '_%46unction%2Egvi';
        const viaCodePath = testHelpers.getPathRelativeToFixtures('VIA/peekpoketypes.via');
        const viaCode = testHelpers.fetchFixture(viaCodePath);
        const areTimestampsSimilar = function (timestamp1, timestamp2) {
            if (Array.isArray(timestamp1)) {
                for (let i = 0; i < timestamp1.length; i += 1) {
                    areTimestampsSimilar(timestamp1[i], timestamp2[i]);
                }
            }
            else {
                const nitimestamp1 = new NITimestamp(timestamp1);
                const nitimestamp2 = new NITimestamp(timestamp2);
                expect(nitimestamp1.valueOf()).toBeCloseTo(nitimestamp2.valueOf(), 3);
            }
        };
        // TODO : Should be removed after we migrate to jasmine 2.7 or higher.
        const makeAsync = function (done, fn) {
            fn().then(() => done()).catch((ex) => done.fail(ex));
        };
        beforeAll(function (done) {
            makeAsync(done, async function () {
                vireo = await vireoHelpers.createInstance({ wasmUrl: window.testHelpers.getWasmPath() });
                vireo.eggShell.loadVia(viaCode);
                await vireo.eggShell.executeSlicesUntilClumpsFinished();
            });
        });
        describe('can read', function () {
            describe('scalars of type', function () {
                it('Boolean', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_BooleanIn');
                    expect(actual).toBe(true);
                });
                it('String', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_StringIn');
                    expect(actual).toBe('Hello');
                });
                it('Double', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_NumericDoubleIn');
                    expect(actual).toBe(123.456);
                });
                it('Int32', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_Numeric32In');
                    expect(actual).toBe(-1073741824);
                });
                it('Int64', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_Numeric64In');
                    expect(actual).toBe('-1152921504606846976');
                });
                it('UInt64', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_NumericU64In');
                    expect(actual).toBe('18446744073709551615');
                });
                it('ComplexDouble', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_ComplexIn');
                    expect(actual).toBe('1337.73 - 9283.12i');
                });
                it('ComplexDoubleInf', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_ComplexInfIn');
                    expect(actual).toBe('Infinity - Infinityi');
                });
                it('ComplexDoubleNaN', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_ComplexNaNIn');
                    // There is a bug in nicomplex that causes (new NIComplex(NaN, NaN)).toString())
                    // to be represented as the string "NaN - NaNi" instead of "NaN + NaNi"
                    // https://github.com/ni-kismet/data-types/issues/44
                    expect(actual).toBe('NaN - NaNi');
                });
                it('Timestamp', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_TimestampIn');
                    const expected = '3564057536:7811758927381448193';
                    areTimestampsSimilar(actual, expected);
                });
                it('Enum8', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'enum8alphabet');
                    expect(actual).toBe(6);
                });
                it('Enum16', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'enum16numbers');
                    expect(actual).toBe(3);
                });
                it('Enum32', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'enum32colors');
                    expect(actual).toBe(2);
                });
            });
            describe('1D arrays of type', function () {
                it('Boolean', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_ArrayOfBoolean');
                    expect(actual).toEqual([true, true, false, true, false]);
                });
                it('String', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_ArrayOfString');
                    expect(actual).toEqual(['Lorem', 'ipsum', 'dolor', 'sit', 'amet']);
                });
                it('Double', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_ArrayOfDouble');
                    expect(actual).toEqual([1.2, 3.4, 5.6, 7.89, 1234.5678]);
                });
                it('Int32', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_ArrayOfInt32');
                    expect(actual).toEqual([-1000, -10, 42, 9876543, 123]);
                });
                it('Int64', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_ArrayOfInt64');
                    expect(actual).toEqual(['-8989', '9090', '36028797018963968', '-72057594037927936']);
                });
                it('ComplexDouble', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_ArrayOfComplexDouble');
                    expect(actual).toEqual(['0 + 0i', '10 - 10i', '5.045 - 5.67i', 'NaN - Infinityi']);
                });
                it('Timestamp', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_ArrayOfTimestamp');
                    const expected = ['3564057536:7811758927381448193', '3564057542:16691056759750171331'];
                    for (let i = 0; i < actual.length; i++) {
                        areTimestampsSimilar(actual[i], expected[i]);
                    }
                });
                it('Cluster', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_ArrayOfClusters');
                    // TODO: gleon fix timestamp loss of precision to uncomment timestamp values. see: https://nitalk.jiveon.com/thread/74202
                    expect(actual).toEqual([
                        { bool: true,
                            string: 'first',
                            double: 3.14159,
                            int32: 42,
                            int64: '72057594037927936',
                            complex: '3.4 - 5.9i',
                            time: '3564057536:7811757436464792000' },
                        { bool: false,
                            string: 'second',
                            double: 6.2831,
                            int32: 84,
                            int64: '72057594037927939',
                            complex: '4.567 + 0.5i',
                            time: '3564059871:7811757436464792000' },
                        { bool: true,
                            string: 'third',
                            double: 2.71828,
                            int32: 144,
                            int64: '-72057594037927942',
                            complex: 'NaN + 0.7071i',
                            time: '3566659871:7811757436464792000' } // '3566659871:7811758927381446667'},
                    ]);
                });
            });
            describe('NDim arrays of type', function () {
                it('Boolean', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_2DArrayOfBoolean');
                    const expected = [[true, false], [false, false], [true, true]];
                    expect(actual).toEqual(expected);
                });
                it('String', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_2DArrayOfString');
                    const expected = [['hello', 'world'], ['abcde', 'fg'], ['xyzzy', '']];
                    expect(actual).toEqual(expected);
                });
                it('Double', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_2DArrayOfDouble');
                    const expected = [[1.234, 2.345, 3.456], [-4.567, -5.678, -6.789]];
                    expect(actual).toEqual(expected);
                });
                it('Int32', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_3DArrayOfInt32');
                    const expected = [[[111, 112, 113], [121, 122, 123]], [[211, 212, 213], [221, 222, 223]]];
                    expect(actual).toEqual(expected);
                });
                it('Int64', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_2DArrayOfInt64');
                    const expected = [['9090'], ['36028797018963968'], ['-72057594037927936']];
                    expect(actual).toEqual(expected);
                });
                it('ComplexDouble', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_2DArrayOfComplex');
                    const expected = [['1.4142 + 0.7071i', '10 - 10i'], ['5.045 - 5.67i', '7.89 + 1234.5678i']];
                    expect(actual).toEqual(expected);
                });
                it('Timestamp', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_2DArrayOfTimestamp');
                    const expected = [['3564057536:7811758927381448193', '3564057542:16691056759750171331'],
                        ['3564059871:7811758927381448217', '3564057536:7811758927381448193'],
                        ['3566659871:7811758927381446667', '3566659871:7811758927381446667']];
                    areTimestampsSimilar(actual, expected);
                });
            });
            it('Cluster (with various scalars)', function () {
                const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_ClusterOfScalars');
                // TODO: gleon fix loss of precision, see: https://nitalk.jiveon.com/thread/74202
                // or use a different comparison method for lossy timestamps.
                const expected = { bool: true, string: 'first', double: 3.14159, int32: 42, int64: '-72057594037927936', uint64: '9223372041149743104', complex: '3.4 - 5.9i', time: '3564057536:7811757436464792000' }; // '3564057536:7811758927381448193'};
                expect(actual).toEqual(expected);
            });
            it('Cluster (with 1D arrays)', function () {
                const actual = VIREO_PEEKER.peek(vireo, viName, 'dataItem_ClusterOfArrays');
                const expected = {
                    booleans: [true, false, true],
                    strings: ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'],
                    doubles: [1.2, 3.4, 5.6, 7.89, 1234.5678],
                    int32s: [-1000, -10, 42, 9876543, 123],
                    int64s: ['-8989', '9090', '36028797018963968', '-72057594037927936'],
                    uint64s: ['9223372041149743104', '0', '9223376434901286912'],
                    complexes: ['0 + 0i', '10 - 10i', '5.045 - 5.67i'],
                    // TODO: gleon fix loss of precision, see: https://nitalk.jiveon.com/thread/74202
                    // or use a different comparison method for lossy timestamps.
                    // times: ['3564057536:7811758927381448193', '3564057542:16691056759750171331']
                    times: ['3564057536:7811757436464792000', '3564057542:16691052702569857000']
                };
                expect(actual).toEqual(expected);
            });
            describe('AnalogWaveform', function () {
                it('of Int8', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'wave_Int8');
                    const expected = { t0: '300:0', dt: 8.8, Y: [1, 2, -128, 127], channelName: undefined };
                    expect(actual).toEqual(expected);
                });
                it('of Int16', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'wave_Int16');
                    const expected = { t0: '300:0', dt: 8.8, Y: [1, 2, -32768, 32767], channelName: undefined };
                    expect(actual).toEqual(expected);
                });
                it('of Int32', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'wave_Int32');
                    const expected = { t0: '300:0', dt: 8.8, Y: [1, 2, -2147483648, 2147483647], channelName: undefined };
                    expect(actual).toEqual(expected);
                });
                it('of Int64', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'wave_Int64');
                    const expected = { t0: '300:0', dt: 8.8, Y: ['1', '2', '-9223372036854775808', '9223372036854775807'], channelName: undefined };
                    expect(actual).toEqual(expected);
                });
                it('of UInt8', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'wave_UInt8');
                    const expected = { t0: '300:0', dt: 8.8, Y: [1, 2, 0, 255], channelName: undefined };
                    expect(actual).toEqual(expected);
                });
                it('of UInt16', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'wave_UInt16');
                    const expected = { t0: '300:0', dt: 8.8, Y: [1, 2, 0, 65535], channelName: undefined };
                    expect(actual).toEqual(expected);
                });
                it('of UInt32', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'wave_UInt32');
                    const expected = { t0: '300:0', dt: 8.8, Y: [1, 2, 0, 4294967295], channelName: undefined };
                    expect(actual).toEqual(expected);
                });
                it('of UInt64', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'wave_UInt64');
                    const expected = { t0: '300:0', dt: 8.8, Y: ['1', '2', '0', '18446744073709551615'], channelName: undefined };
                    expect(actual).toEqual(expected);
                });
                it('of Single', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'wave_Single');
                    const expected = { t0: '300:0', dt: 8.8, Y: [-16777216, 16777216, NaN, -Infinity, Infinity], channelName: undefined };
                    expect(actual).toEqual(expected);
                });
                it('of Double', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'wave_Double');
                    const expected = { t0: '300:0', dt: 8.8, Y: [-9007199254740991, 9007199254740991, NaN, -Infinity, Infinity], channelName: undefined };
                    expect(actual).toEqual(expected);
                });
                it('of ComplexSingle', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'wave_ComplexSingle');
                    const expected = {
                        t0: '300:0',
                        dt: 8.8,
                        Y: [
                            (new NIComplex(-16777216, -16777216)).toString(),
                            (new NIComplex(16777216, 16777216)).toString(),
                            (new NIComplex(NaN, NaN)).toString(),
                            (new NIComplex(Infinity, Infinity)).toString(),
                            (new NIComplex(-Infinity, -Infinity)).toString()
                        ],
                        channelName: undefined
                    };
                    expect(actual).toEqual(expected);
                });
                it('of ComplexDouble', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'wave_ComplexDouble');
                    const expected = {
                        t0: '300:0',
                        dt: 8.8,
                        Y: [
                            (new NIComplex(-9007199254740991, -9007199254740991)).toString(),
                            (new NIComplex(9007199254740991, 9007199254740991)).toString(),
                            (new NIComplex(NaN, NaN)).toString(),
                            (new NIComplex(Infinity, Infinity)).toString(),
                            (new NIComplex(-Infinity, -Infinity)).toString()
                        ],
                        channelName: undefined
                    };
                    expect(actual).toEqual(expected);
                });
                it('with a channelName set', function () {
                    const actual = VIREO_PEEKER.peek(vireo, viName, 'wave_ChannelName');
                    const expected = { t0: '300:0', dt: 8.8, Y: [42], channelName: 'Hello World' };
                    expect(actual).toEqual(expected);
                });
            });
        });
        describe('can write', function () {
            describe('scalars of type', function () {
                it('Boolean', function () {
                    const variableName = 'dataItem_BooleanOut';
                    VIREO_POKER.poke(vireo, viName, variableName, true);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toBe(true);
                });
                it('String', function () {
                    const variableName = 'dataItem_StringOut';
                    VIREO_POKER.poke(vireo, viName, variableName, 'Hello World! :D');
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toBe('Hello World! :D');
                });
                it('Double', function () {
                    const variableName = 'dataItem_NumericDoubleOut';
                    VIREO_POKER.poke(vireo, viName, variableName, 1234.56789);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toBe(1234.56789);
                });
                it('Int32', function () {
                    const variableName = 'dataItem_Numeric32Out';
                    const valueToTest = -36963968;
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toBe(valueToTest);
                });
                it('Int64', function () {
                    const variableName = 'dataItem_Numeric64Out';
                    const valueToTest = '-36028797018963968';
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toBe(valueToTest);
                });
                it('ComplexDouble', function () {
                    const variableName = 'dataItem_ComplexOut';
                    const valueToTest = '15.789 - 3.1416i';
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toBe(valueToTest);
                });
                it('ComplexDoubleInf', function () {
                    const variableName = 'dataItem_ComplexOut';
                    const valueToTest = 'Infinity - Infinityi';
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toBe(valueToTest);
                });
                it('ComplexDoubleNaN', function () {
                    const variableName = 'dataItem_ComplexOut';
                    const valueToTest = 'NaN - NaNi';
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toBe(valueToTest);
                });
                it('Timestamp', function () {
                    const variableName = 'dataItem_TimestampOut';
                    const valueToTest = '3564057542:16691052702569857000';
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    areTimestampsSimilar(written, valueToTest);
                });
                it('Enum8', function () {
                    const variableName = 'enum8alphabet';
                    const valueToTest = 4;
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toBe(valueToTest);
                });
                it('Enum16', function () {
                    const variableName = 'enum16numbers';
                    const valueToTest = 4;
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toBe(valueToTest);
                });
                it('Enum32', function () {
                    const variableName = 'enum32colors';
                    const valueToTest = 4;
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toBe(valueToTest);
                });
            });
            describe('1D arrays of type', function () {
                it('Boolean', function () {
                    const variableName = 'dataItem_ArrayOfBoolean';
                    const valueToTest = [false, false, true, false, true];
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('String', function () {
                    const variableName = 'dataItem_ArrayOfString';
                    const valueToTest = 'And this bird you cannot change'.split(' ');
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('Double', function () {
                    const variableName = 'dataItem_ArrayOfDouble';
                    const valueToTest = [0.4111973450, 0.7498847177, 0.8094650401, 0.5809188834, 0.4504242667, 0.4247307408, 0.2302642939, 0.3274508043, 0.2481683847, 0.4577604581];
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('Int32', function () {
                    const variableName = 'dataItem_ArrayOfInt32';
                    const valueToTest = [552139, -396256, -292658, -795576, 248411, 873904, 994612, 724317, 79111, -849221];
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('Int64', function () {
                    const variableName = 'dataItem_ArrayOfInt64';
                    const valueToTest = ['18014398509481984', '36028797018963968', '72057594037927936', '144115188075855872', '288230376151711744',
                        '-18014398509481984', '-36028797018963968', '-72057594037927936', '-144115188075855872', '-288230376151711744'];
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('ComplexDouble', function () {
                    const variableName = 'dataItem_ArrayOfComplexDouble';
                    const valueToTest = ['0.917787 + 0.461898i',
                        '0.832868 - 0.20176365i',
                        '0.764301 + 0.2267764i',
                        '0.174925 - 0.0420786i',
                        'NaN + Infinityi'];
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('Timestamp', function () {
                    const variableName = 'dataItem_ArrayOfTimestamp';
                    const valueToTest = ['3564057536:7811758927381448193', '3564057542:16691056759750171331', '3564059871:7811758927381448217', '3566659871:7811758927381446667'];
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    areTimestampsSimilar(valueToTest, written);
                });
                it('Cluster', function () {
                    const variableName = 'dataItem_ArrayOfClusters';
                    // TODO: gleon fix loss of precision, see: https://nitalk.jiveon.com/thread/74202
                    // or use a different comparison method for lossy timestamps. To uncomment time values.
                    const valueToTest = [
                        { bool: false,
                            string: 'fourth',
                            double: 0.984109455233073,
                            int32: 477833920,
                            int64: '288230376151711744',
                            complex: '-0.0723484811 - 0.7807229436i',
                            time: '3566659871:7811757436464792000' },
                        { bool: true,
                            string: 'fifth',
                            double: -0.092421472285878,
                            int32: 811873854,
                            int64: '-144115188075855872',
                            complex: '0.8968598708 + 0.3077734236i',
                            time: '3564057536:7811757436464792000' },
                        { bool: false,
                            string: 'sixth',
                            double: 0.276945620332296,
                            int32: -1158099,
                            int64: '36028797018963968',
                            complex: '-0.6836525331 + 0.5363120632i',
                            time: '3564059871:7811757436464792000' } // '3564059871:7811758927381448217'}
                    ];
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
            });
            describe('NDim arrays of type', function () {
                it('Boolean', function () {
                    const variableName = 'dataItem_2DArrayOfBoolean';
                    const valueToTest = [[false, false, false], [false, true, false], [true, true, true]];
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('String', function () {
                    const variableName = 'dataItem_2DArrayOfString';
                    const valueToTest = [['HELLO', 'WORLD'], ['ABCDE', 'FG'], ['', '']];
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('Double', function () {
                    const variableName = 'dataItem_2DArrayOfDouble';
                    const valueToTest = [[1.234, 2.345, 3.456], [-4.567, -5.678, -6.789], [-0.411197, 0.749885, 0]];
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('Int32', function () {
                    const variableName = 'dataItem_3DArrayOfInt32';
                    const valueToTest = [[[989, 199, 100], [123987, -2938, 948]], [[-211, 212, -213], [2219, -2222, 2230]]];
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('Int64', function () {
                    const variableName = 'dataItem_2DArrayOfInt64';
                    const valueToTest = [['9090'], ['36028797018963968'], ['-72057594037927936']];
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('ComplexDouble', function () {
                    const variableName = 'dataItem_2DArrayOfComplex';
                    const valueToTest = [['9.4142 - 1000.7071i', '105 + 105i'], ['98.945 - 512.657i', '74.389 + 12.5678i']];
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('Timestamp', function () {
                    const variableName = 'dataItem_2DArrayOfTimestamp';
                    const valueToTest = [['4564057536:7811758927381448193', '1:4567'],
                        ['3564059871:7811758927381448217', '2:3456'],
                        ['2566659871:7811758927381446667', '3:1234']];
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    areTimestampsSimilar(written, valueToTest);
                });
            });
            it('Cluster (with various scalars)', function () {
                const variableName = 'dataItem_ClusterOfScalars';
                const valueToTest = { bool: false,
                    string: 'last',
                    double: 9.8696,
                    int32: 2147418112,
                    int64: '-1152921504606846976',
                    uint64: '10376293541461622784',
                    complex: '123.456 - 789.012i',
                    time: '3566659871:7811758927381446667' };
                VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                // Handle timestamps
                const expectedTime = valueToTest.time;
                delete valueToTest.time;
                const actualTime = written.time;
                delete written.time;
                areTimestampsSimilar(actualTime, expectedTime);
                expect(written).toEqual(valueToTest);
            });
            it('Cluster (with 1D arrays)', function () {
                const variableName = 'dataItem_ClusterOfArrays';
                const valueToTest = {
                    booleans: [false, true, false],
                    strings: 'And this bird you cannot change'.split(' '),
                    doubles: [1.2, 3.4, 5.6, 7.89, 1234.5678],
                    int32s: [552139, -396256, -292658, -795576, 248411, 873904, 994612, 724317, 79111, -849221],
                    int64s: ['18014398509481984', '72057594037927936', '144115188075855872', '-18014398509481984', '-36028797018963968', '-144115188075855872', '-288230376151711744'],
                    uint64s: ['0', '9223372041149743104', '9223376434901286912'],
                    complexes: ['0.917787 + 0.461898i', '0.832868 - 0.20176365i', '0.764301 + 0.2267764i', '0.174925 - 0.0420786i'],
                    times: ['3564057542:16691056759750171331', '3564057536:7811758927381448193']
                };
                VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                // Handle timestamp comparison
                const actualtimes = written.times;
                delete written.times;
                const expectedtimes = valueToTest.times;
                delete valueToTest.times;
                areTimestampsSimilar(actualtimes, expectedtimes);
                expect(written).toEqual(valueToTest);
            });
            describe('AnalogWaveform', function () {
                it('of Int8', function () {
                    const variableName = 'wave_Int8';
                    const valueToTest = { t0: '3456789:0', dt: 1234.5678, Y: [1, 2, 3], channelName: undefined };
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('of Int16', function () {
                    const variableName = 'wave_Int16';
                    const valueToTest = { t0: '3456789:0', dt: 1234.5678, Y: [1, 2, 3], channelName: undefined };
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('of Int32', function () {
                    const variableName = 'wave_Int32';
                    const valueToTest = { t0: '3456789:0', dt: 1234.5678, Y: [1, 2, 3], channelName: undefined };
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('of Int64', function () {
                    const variableName = 'wave_Int64';
                    const valueToTest = { t0: '3456789:0', dt: 1234.5678, Y: ['1', '2', '3'], channelName: undefined };
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('of UInt8', function () {
                    const variableName = 'wave_UInt8';
                    const valueToTest = { t0: '3456789:0', dt: 1234.5678, Y: [1, 2, 3], channelName: undefined };
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('of UInt16', function () {
                    const variableName = 'wave_UInt16';
                    const valueToTest = { t0: '3456789:0', dt: 1234.5678, Y: [1, 2, 3], channelName: undefined };
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('of UInt32', function () {
                    const variableName = 'wave_UInt32';
                    const valueToTest = { t0: '3456789:0', dt: 1234.5678, Y: [1, 2, 3], channelName: undefined };
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('of UInt64', function () {
                    const variableName = 'wave_UInt64';
                    const valueToTest = { t0: '3456789:0', dt: 1234.5678, Y: ['1', '2', '3'], channelName: undefined };
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('of Single', function () {
                    const variableName = 'wave_Single';
                    // The values in the array are double respresentation, when written to vireo as singles and read back as doubles
                    // there is precision loss and the values are set as not equal
                    // To prevent this issue use floating point values that have an exact representation to loss of precision
                    // does not effect the values being round-tripped
                    const valueToTest = { t0: '3456789:0', dt: 1234.5678, Y: [1, 2, 3, 2001 / 2, 1 / 16, 3 / 64], channelName: undefined };
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('of Double', function () {
                    const variableName = 'wave_Double';
                    const valueToTest = { t0: '3456789:0', dt: 1234.5678, Y: [5.5, 6.6, 7.7, 8.8, 9.9, 10.1, 11], channelName: undefined };
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('of ComplexSingle', function () {
                    const variableName = 'wave_ComplexSingle';
                    // The values in the array are double respresentation, when written to vireo as singles and read back as doubles
                    // there is precision loss and the values are set as not equal
                    // To prevent this issue use floating point values that have an exact representation to loss of precision
                    // does not effect the values being round-tripped
                    const valueToTest = {
                        t0: '300:0',
                        dt: 8.8,
                        Y: [
                            (new NIComplex(2001 / 2, 2001 / 2)).toString(),
                            (new NIComplex(3 / 64, 3 / 64)).toString(),
                            (new NIComplex(NaN, NaN)).toString(),
                            (new NIComplex(Infinity, Infinity)).toString(),
                            (new NIComplex(-Infinity, -Infinity)).toString()
                        ],
                        channelName: undefined
                    };
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('of ComplexDouble', function () {
                    const variableName = 'wave_ComplexDouble';
                    const valueToTest = {
                        t0: '300:0',
                        dt: 8.8,
                        Y: [
                            (new NIComplex(1.1, 1.1)).toString(),
                            (new NIComplex(2.2, 2.2)).toString(),
                            (new NIComplex(NaN, NaN)).toString(),
                            (new NIComplex(Infinity, Infinity)).toString(),
                            (new NIComplex(-Infinity, -Infinity)).toString()
                        ],
                        channelName: undefined
                    };
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('and update channel name', function () {
                    const variableName = 'wave_Double';
                    const valueToTest = { t0: '3456789:0', dt: 1234.5678, Y: [5.5, 6.6, 7.7, 8.8, 9.9, 10.1, 11], channelName: 'Iñtërnâtiônàlizætiøn☃💩' };
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                });
                it('and remove channel name', function () {
                    const variableName = 'wave_Double';
                    const valueToTest = { t0: '3456789:0', dt: 1234.5678, Y: [5.5, 6.6, 7.7, 8.8, 9.9, 10.1, 11], channelName: 'Iñtërnâtiônàlizætiøn☃💩' };
                    VIREO_POKER.poke(vireo, viName, variableName, valueToTest);
                    const written = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(written).toEqual(valueToTest);
                    const valueToUpdate = { t0: '3456789:0', dt: 1234.5678, Y: [5.5, 6.6, 7.7, 8.8, 9.9, 10.1, 11], channelName: undefined };
                    VIREO_POKER.poke(vireo, viName, variableName, valueToUpdate);
                    const writtenUpdate = VIREO_PEEKER.peek(vireo, viName, variableName);
                    expect(writtenUpdate).toEqual(valueToUpdate);
                });
            });
        });
    });
});
//# sourceMappingURL=niVireoPeekPoke.Test.js.map