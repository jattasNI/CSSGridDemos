//****************************************
// Flexible Layout Container Model
// National Instruments Copyright 2018
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualModel } from './niVisualModel.js';
export class FlexibleLayoutContainerModel extends VisualModel {
    constructor(id) {
        super(id);
        this._direction = 'row';
        this._horizontalContentAlignment = 'flex-start';
        this._verticalContentAlignment = 'flex-start';
    }
    static get MODEL_KIND() {
        return 'niFlexibleLayoutContainer';
    }
    get direction() {
        return this._direction;
    }
    set direction(value) {
        this._direction = value;
        this.notifyModelPropertyChanged('direction');
    }
    get horizontalContentAlignment() {
        return this._horizontalContentAlignment;
    }
    set horizontalContentAlignment(value) {
        this._horizontalContentAlignment = value;
        this.notifyModelPropertyChanged('horizontalContentAlignment');
    }
    get verticalContentAlignment() {
        return this._verticalContentAlignment;
    }
    set verticalContentAlignment(value) {
        this._verticalContentAlignment = value;
        this.notifyModelPropertyChanged('verticalContentAlignment');
    }
}
NIModelProvider.registerModel(FlexibleLayoutContainerModel);
//# sourceMappingURL=niFlexibleLayoutContainerModel.js.map