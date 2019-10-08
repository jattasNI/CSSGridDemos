//****************************************
// Flexible Layout Wrapper Model
// National Instruments Copyright 2018
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualModel } from './niVisualModel.js';
export class FlexibleLayoutWrapperModel extends VisualModel {
    constructor(id) {
        super(id);
        this._flexGrow = 1.0;
    }
    static get MODEL_KIND() {
        return 'niFlexibleLayoutWrapper';
    }
    get flexGrow() {
        return this._flexGrow;
    }
    set flexGrow(value) {
        this._flexGrow = value;
        this.notifyModelPropertyChanged('flexGrow');
    }
}
NIModelProvider.registerModel(FlexibleLayoutWrapperModel);
//# sourceMappingURL=niFlexibleLayoutWrapperModel.js.map