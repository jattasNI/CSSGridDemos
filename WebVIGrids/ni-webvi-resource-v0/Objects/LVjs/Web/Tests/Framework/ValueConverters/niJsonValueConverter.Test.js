import { JsonValueConverter } from '../../../Framework/ValueConverters/niJsonValueConverter.js';
describe('A Json value converter', function () {
    'use strict';
    let jsonValueConverter;
    beforeEach(function () {
        jsonValueConverter = JsonValueConverter;
    });
    it('converts a json object to string', function () {
        const obj = { numberValue: 5 };
        const convertedVal = jsonValueConverter.convert(obj);
        const expectedVal = '{"numberValue":5}';
        expect(expectedVal).toEqual(convertedVal);
    });
    it('convertsBack a json-encoded string to a json object', function () {
        const jsonString = '{"stringValue":"1231242315255"}';
        const convertedBackVal = jsonValueConverter.convertBack(jsonString);
        const expectedBackVal = { stringValue: '1231242315255' };
        expect(expectedBackVal).toEqual(convertedBackVal);
    });
});
//# sourceMappingURL=niJsonValueConverter.Test.js.map