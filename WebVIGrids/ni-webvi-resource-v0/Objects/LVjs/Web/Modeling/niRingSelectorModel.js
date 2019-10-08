//****************************************
// RingSelector Model
// National Instruments Copyright 2015
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { NumericValueSelectorModel } from './niNumericValueSelectorModel.js';
const NIType = window.NIType;
const NITypeNames = window.NITypeNames;
export class RingSelectorModel extends NumericValueSelectorModel {
    constructor(id) {
        super(id);
        this._allowUndefined = false;
        this._textAlignment = 'left';
        this._numericValueWidth = 40;
        this._itemsAndValuesRingSelectorType = new NIType({
            name: NITypeNames.ARRAY,
            rank: 1,
            subtype: {
                name: NITypeNames.CLUSTER,
                fields: ['String', 'Value'],
                subtype: [NITypeNames.STRING, this.niType.getName()]
            }
        });
    }
    static get ITEMS_AND_VALUES_G_PROPERTY_NAME() {
        return 'ItemsAndValues';
    }
    static get MODEL_KIND() {
        return 'niRingSelector';
    }
    get allowUndefined() {
        return this._allowUndefined;
    }
    set allowUndefined(value) {
        this._allowUndefined = value;
        this.notifyModelPropertyChanged('allowUndefined');
    }
    get textAlignment() {
        return this._textAlignment;
    }
    set textAlignment(value) {
        this._textAlignment = value;
        this.notifyModelPropertyChanged('textAlignment');
    }
    get numericValueWidth() {
        return this._numericValueWidth;
    }
    set numericValueWidth(value) {
        this._numericValueWidth = value;
        this.notifyModelPropertyChanged('numericValueWidth');
    }
    get itemsAndValuesRingSelectorType() {
        return this._itemsAndValuesRingSelectorType;
    }
    set itemsAndValuesRingSelectorType(value) {
        this._itemsAndValuesRingSelectorType = value;
    }
    gPropertyNIType(gPropertyName) {
        switch (gPropertyName) {
            case RingSelectorModel.ITEMS_AND_VALUES_G_PROPERTY_NAME:
                return this.itemsAndValuesRingSelectorType;
        }
        return super.gPropertyNIType(gPropertyName);
    }
}
NIModelProvider.registerModel(RingSelectorModel);
//# sourceMappingURL=niRingSelectorModel.js.map