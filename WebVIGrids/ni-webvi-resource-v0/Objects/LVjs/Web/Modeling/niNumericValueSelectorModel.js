//****************************************
// NumericValueSelector Model
// National Instruments Copyright 2015
//****************************************
import { VisualModel } from './niVisualModel.js';
const NITypes = window.NITypes;
const NIType = window.NIType;
const NITypeNames = window.NITypeNames;
const stringArrayNIType = new NIType({ name: NITypeNames.ARRAY, rank: 1, subtype: { name: NITypeNames.STRING } });
const int32ArrayNIType = new NIType({ name: NITypeNames.ARRAY, rank: 1, subtype: { name: NITypeNames.INT32 } });
export class NumericValueSelectorModel extends VisualModel {
    constructor(id) {
        super(id);
        this.niType = NITypes.INT32;
        this._value = 0;
        this._items = [];
        this._popupEnabled = false;
        this._disabledIndexes = [];
    }
    static get DISABLED_INDEXES_G_PROPERTY_NAME() {
        return 'DisabledIndexes';
    }
    static get ITEMS_G_PROPERTY_NAME() {
        return 'Items';
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.notifyModelPropertyChanged('value');
    }
    get items() {
        return this._items;
    }
    set items(value) {
        this._items = value;
        this.notifyModelPropertyChanged('items');
    }
    get popupEnabled() {
        return this._popupEnabled;
    }
    set popupEnabled(value) {
        this._popupEnabled = value;
        this.notifyModelPropertyChanged('popupEnabled');
    }
    get disabledIndexes() {
        return this._disabledIndexes;
    }
    set disabledIndexes(value) {
        this._disabledIndexes = value;
        this.notifyModelPropertyChanged('disabledIndexes');
    }
    modelPropertyUsesNIType(propertyName) {
        return propertyName === 'value';
    }
    controlChanged(newValue) {
        const oldValue = this.value;
        this.value = newValue;
        super.controlChanged('value', newValue, oldValue);
    }
    gPropertyNIType(gPropertyName) {
        switch (gPropertyName) {
            case NumericValueSelectorModel.DISABLED_INDEXES_G_PROPERTY_NAME:
                return int32ArrayNIType;
            case NumericValueSelectorModel.ITEMS_G_PROPERTY_NAME:
                return stringArrayNIType;
        }
        return super.gPropertyNIType(gPropertyName);
    }
}
//# sourceMappingURL=niNumericValueSelectorModel.js.map