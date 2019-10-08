//****************************************
// Selector Model
// National Instruments Copyright 2015
//****************************************
import { VisualModel } from './niVisualModel.js';
const NIType = window.NIType;
const NITypeNames = window.NITypeNames;
const stringArrayNIType = new NIType({ name: NITypeNames.ARRAY, rank: 1, subtype: { name: NITypeNames.STRING } });
export class SelectorModel extends VisualModel {
    constructor(id) {
        super(id);
        this._source = [];
    }
    static get ITEMS_G_PROPERTY_NAME() {
        return 'Items';
    }
    get source() {
        return this._source;
    }
    set source(value) {
        this._source = value;
        this.notifyModelPropertyChanged('source');
    }
    gPropertyNIType(gPropertyName) {
        switch (gPropertyName) {
            case SelectorModel.ITEMS_G_PROPERTY_NAME:
                return stringArrayNIType;
        }
        return super.gPropertyNIType(gPropertyName);
    }
}
//# sourceMappingURL=niSelectorModel.js.map