import { DropDownValueConverter } from './niDropDownValueConverter.js';
import { JQXDateTimeValueConverter } from './niJQXDateTimeValueConverter.js';
import { JQXNumericValueConverter } from './niJQXNumericValueConverter.js';
import { JsonValueConverter } from './niJsonValueConverter.js';
import { ListBoxValueConverter } from './niListBoxValueConverter.js';
import { NumericValueConverter } from './niNumericValueConverter.js';
import { ValueConverter } from './niValueConverter.js';
const findConverterForElementName = function (elemName) {
    elemName = elemName.toLowerCase();
    switch (elemName) {
        // Numerics
        case 'jqx-numeric-text-box':
        case 'jqx-gauge':
        case 'jqx-tank':
        case 'jqx-slider':
            return JQXNumericValueConverter;
        case 'ni-ring-selector':
        case 'ni-enum-selector':
        case 'ni-radio-button-group':
            return NumericValueConverter;
        case 'jqx-drop-down-list':
            return DropDownValueConverter;
        case 'jqx-list-box':
            return ListBoxValueConverter;
        case 'ni-path-selector':
        case 'ni-cartesian-graph':
            return JsonValueConverter;
        case 'jqx-date-time-picker':
            return JQXDateTimeValueConverter;
        default:
            return ValueConverter;
    }
};
const getParametersForElement = function (element) {
    const elemName = element.tagName.toLowerCase();
    switch (elemName) {
        case 'jqx-numeric-text-box':
        case 'jqx-gauge':
        case 'jqx-tank':
        case 'jqx-slider':
            return JQXNumericValueConverter.convertJQXTypeToNI(element);
        case 'ni-ring-selector':
        case 'ni-enum-selector':
        case 'ni-radio-button-group':
            return new window.NIType(element.niType);
        case 'jqx-list-box':
            return ListBoxValueConverter.convertJQXToNISelectionMode(element.selectionMode);
        case 'jqx-date-time-picker':
            return element;
        default:
            return undefined;
    }
};
export class ElementValueConverter {
    static findValueConverter(element) {
        return findConverterForElementName(element.tagName);
    }
    static getConverterParameters(element) {
        return getParametersForElement(element);
    }
    static convert(element, value) {
        const elementName = element.tagName;
        const converter = findConverterForElementName(elementName);
        return converter.convert(value, getParametersForElement(element));
    }
    static convertBack(element, value) {
        const elementName = element.tagName;
        const converter = findConverterForElementName(elementName);
        return converter.convertBack(value, getParametersForElement(element));
    }
}
//# sourceMappingURL=niElementValueConverter.js.map