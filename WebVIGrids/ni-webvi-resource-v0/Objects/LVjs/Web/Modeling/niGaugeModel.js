//****************************************
// Gauge Model
// National Instruments Copyright 2014
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { RadialNumericPointerModel } from './niRadialNumericPointerModel.js';
export class GaugeModel extends RadialNumericPointerModel {
    constructor(id) {
        super(id);
        this._analogDisplayType = 'needle';
        this._digitalDisplayVisible = false;
        this._digitalDisplayPosition = 'bottom';
    }
    static get MODEL_KIND() {
        return 'niGauge';
    }
    get analogDisplayType() {
        return this._analogDisplayType;
    }
    set analogDisplayType(value) {
        this._analogDisplayType = value;
        this.notifyModelPropertyChanged('analogDisplayType');
    }
    get digitalDisplayVisible() {
        return this._digitalDisplayVisible;
    }
    set digitalDisplayVisible(value) {
        this._digitalDisplayVisible = value;
        this.notifyModelPropertyChanged('digitalDisplayVisible');
    }
    get digitalDisplayPosition() {
        return this._digitalDisplayPosition;
    }
    set digitalDisplayPosition(value) {
        this._digitalDisplayPosition = value;
        this.notifyModelPropertyChanged('digitalDisplayPosition');
    }
}
NIModelProvider.registerModel(GaugeModel);
//# sourceMappingURL=niGaugeModel.js.map