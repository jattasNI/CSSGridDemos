//****************************************
// EnumSelector Model
// National Instruments Copyright 2015
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { NumericValueSelectorModel } from './niNumericValueSelectorModel.js';
export class EnumSelectorModel extends NumericValueSelectorModel {
    constructor(id) {
        super(id);
        this._textAlignment = 'left';
    }
    static get MODEL_KIND() {
        return 'niEnumSelector';
    }
    get textAlignment() {
        return this._textAlignment;
    }
    set textAlignment(value) {
        this._textAlignment = value;
        this.notifyModelPropertyChanged('textAlignment');
    }
}
NIModelProvider.registerModel(EnumSelectorModel);
//# sourceMappingURL=niEnumSelectorModel.js.map