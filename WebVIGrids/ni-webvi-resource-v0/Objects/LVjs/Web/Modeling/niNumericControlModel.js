//****************************************
// Numeric Control Model
// National Instruments Copyright 2014
//****************************************
import { VisualModel } from './niVisualModel.js';
const NITypes = window.NITypes;
const NI_TYPE_PROPERTIES = {
    'value': true,
    'interval': true,
    'minimum': true,
    'maximum': true
};
export class NumericControlModel extends VisualModel {
    constructor(id) {
        super(id);
        this.niType = NITypes.DOUBLE;
        this._minimum = 0;
        this._maximum = 10;
        this._interval = 1;
        this._value = 0;
        this._significantDigits = 2;
        this._precisionDigits = -1;
        this._format = 'floating point';
    }
    static get MAXIMUM_G_PROPERTY_NAME() {
        return 'Maximum';
    }
    static get MINIMUM_G_PROPERTY_NAME() {
        return 'Minimum';
    }
    static get INTERVAL_G_PROPERTY_NAME() {
        return 'Interval';
    }
    get minimum() {
        return this._minimum;
    }
    set minimum(value) {
        this._minimum = value;
        this.notifyModelPropertyChanged('minimum');
    }
    get maximum() {
        return this._maximum;
    }
    set maximum(value) {
        this._maximum = value;
        this.notifyModelPropertyChanged('maximum');
    }
    get interval() {
        return this._interval;
    }
    set interval(value) {
        this._interval = value;
        this.notifyModelPropertyChanged('interval');
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.notifyModelPropertyChanged('value');
    }
    get significantDigits() {
        return this._significantDigits;
    }
    set significantDigits(value) {
        this._significantDigits = value;
        this.notifyModelPropertyChanged('significantDigits');
    }
    get precisionDigits() {
        return this._precisionDigits;
    }
    set precisionDigits(value) {
        this._precisionDigits = value;
        this.notifyModelPropertyChanged('precisionDigits');
    }
    get format() {
        return this._format;
    }
    set format(value) {
        this._format = value;
        this.notifyModelPropertyChanged('format');
    }
    modelPropertyUsesNIType(propertyName) {
        return NI_TYPE_PROPERTIES[propertyName] === true;
    }
    controlChanged(newValue) {
        const oldValue = this.value;
        this.value = newValue;
        super.controlChanged('value', newValue, oldValue);
    }
    gPropertyNIType(gPropertyName) {
        switch (gPropertyName) {
            case NumericControlModel.MINIMUM_G_PROPERTY_NAME:
            case NumericControlModel.MAXIMUM_G_PROPERTY_NAME:
            case NumericControlModel.INTERVAL_G_PROPERTY_NAME:
                return this.niType;
        }
        return super.gPropertyNIType(gPropertyName);
    }
}
//# sourceMappingURL=niNumericControlModel.js.map