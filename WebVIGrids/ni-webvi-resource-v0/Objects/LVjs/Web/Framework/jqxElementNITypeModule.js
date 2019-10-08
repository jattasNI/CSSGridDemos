/**
 * Extends any control based on JQXElement to have an niType property.
 * Could apply to things other than JQX Numerics, e.g. their new data grid,
 * or our controls that derive from JQXElement.
 * National Instruments Copyright 2019
 */
import { JQXNumericValueConverter } from './ValueConverters/niJQXNumericValueConverter.js';
const numericTextBoxName = 'jqx-numeric-text-box';
const sliderName = 'jqx-slider';
const tankName = 'jqx-tank';
const gaugeName = 'jqx-gauge';
export class JQXElementNITypeModule {
    static get moduleName() {
        return 'JQXElementNITypeModule';
    }
    static get properties() {
        const properties = {
            'niType': {
                value: 'Double',
                type: 'string',
                observer: 'niTypePropertyUpdated'
            }
        };
        return properties;
    }
    static getNITypeString(niType) {
        if (!niType.isAggregateType()) {
            return niType.getName();
        }
        return niType.toShortJSON();
    }
    niTypePropertyUpdated(oldTypeString, newTypeString) {
        if (!NationalInstruments.JQXElement.isJQXElementSubPart(this.ownerElement)) {
            this.updateNIType(new window.NIType(newTypeString));
        }
    }
    updateNIType(newType) {
        // Derived classes implement this to map the given NIType instance to properties on the element.
        // This is called both for the initial value of the ni-type (when the element is ready/ attached
        // on the page), and if the element's niType property is updated.
    }
    ready() {
        if (!NationalInstruments.JQXElement.isJQXElementSubPart(this.ownerElement)) {
            this.updateNIType(new window.NIType(this.ownerElement.niType));
        }
    }
}
export class JQXNumericNITypeModule extends JQXElementNITypeModule {
    static get moduleName() {
        return 'JQXNumericNITypeModule';
    }
    constructor(typePropertyName) {
        super();
        this.typePropertyName = typePropertyName;
    }
    updateNIType(newType) {
        this.ownerElement[this.typePropertyName] =
            JQXNumericValueConverter.convertNITypeToJQX(newType);
        if (newType.isInteger()) {
            this.ownerElement.wordLength = newType.getName().toLowerCase();
        }
    }
}
export class JQXNumericPointerNITypeModule extends JQXNumericNITypeModule {
    static get moduleName() {
        return 'JQXNumericPointerNITypeModule';
    }
    constructor() {
        super('scaleType');
    }
    // Functions which local to the module class, only those can be accessed via the element.
    // We are accessing this observer function via element in "jqxElement.js". Hence this override.
    niTypePropertyUpdated(oldTypeString, newTypeString) {
        super.niTypePropertyUpdated(oldTypeString, newTypeString);
    }
}
export class JQXNumericTextBoxNITypeModule extends JQXNumericNITypeModule {
    static get moduleName() {
        return 'JQXNumericTextBoxNITypeModule';
    }
    constructor() {
        super('inputFormat');
    }
    // Functions which local to the module class, only those can be accessed via the element.
    // We are accessing this observer function via element in "jqxElement.js". Hence this override.
    niTypePropertyUpdated(oldTypeString, newTypeString) {
        super.niTypePropertyUpdated(oldTypeString, newTypeString);
    }
}
window.JQX.Elements.whenRegistered(numericTextBoxName, function (proto) {
    proto.addModule(JQXNumericTextBoxNITypeModule);
});
window.JQX.Elements.whenRegistered(sliderName, function (proto) {
    proto.addModule(JQXNumericPointerNITypeModule);
});
window.JQX.Elements.whenRegistered(tankName, function (proto) {
    proto.addModule(JQXNumericPointerNITypeModule);
});
window.JQX.Elements.whenRegistered(gaugeName, function (proto) {
    proto.addModule(JQXNumericPointerNITypeModule);
});
//# sourceMappingURL=jqxElementNITypeModule.js.map