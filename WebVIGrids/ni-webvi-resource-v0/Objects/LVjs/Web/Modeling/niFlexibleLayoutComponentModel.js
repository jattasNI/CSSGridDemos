//****************************************
// Flexible Layout Component Model
// National Instruments Copyright 2018
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualModel } from './niVisualModel.js';
export class FlexibleLayoutComponentModel extends VisualModel {
    constructor(id) {
        super(id);
        this._layoutPattern = '';
    }
    static get MODEL_KIND() {
        return 'niFlexibleLayoutComponent';
    }
    get layoutPattern() {
        return this._layoutPattern;
    }
    set layoutPattern(value) {
        this._layoutPattern = value;
        this.notifyModelPropertyChanged('layoutPattern');
    }
    isFlexibleLayout() {
        return true;
    }
}
NIModelProvider.registerModel(FlexibleLayoutComponentModel);
//# sourceMappingURL=niFlexibleLayoutComponentModel.js.map