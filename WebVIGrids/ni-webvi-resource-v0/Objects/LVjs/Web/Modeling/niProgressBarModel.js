//****************************************
// Progress Bar Model
// National Instruments Copyright 2014
//****************************************
import { VisualModel } from './niVisualModel.js';
const NITypes = window.NITypes;
export class ProgressBarModel extends VisualModel {
    constructor(id) {
        super(id);
        this.niType = NITypes.DOUBLE;
        this._minimum = 0;
        this._maximum = 10;
        this._value = 0;
        this._indeterminate = false;
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
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.notifyModelPropertyChanged('value');
    }
    get indeterminate() {
        return this._indeterminate;
    }
    set indeterminate(value) {
        this._indeterminate = value;
        this.notifyModelPropertyChanged('indeterminate');
    }
    modelPropertyUsesNIType(propertyName) {
        return propertyName === 'value';
    }
    controlChanged(newValue) {
        const oldValue = this.value;
        this.value = newValue;
        super.controlChanged('value', newValue, oldValue);
    }
}
//# sourceMappingURL=niProgressBarModel.js.map