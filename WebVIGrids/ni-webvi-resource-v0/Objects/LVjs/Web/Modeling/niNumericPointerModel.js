//****************************************
// Numeric Pointer Model
// National Instruments Copyright 2014
//****************************************
import { NumericControlModel } from './niNumericControlModel.js';
import { NumericScaleModel } from './niNumericScaleModel.js';
export class NumericPointerModel extends NumericControlModel {
    constructor(id) {
        super(id);
        this._scaleVisible = true;
        this._majorTicksVisible = true;
        this._minorTicksVisible = true;
        this._labelsVisible = true;
        this._coercionMode = false;
        this._rangeDivisionsMode = 'auto';
        this._mechanicalAction = 'switchWhileDragging';
        this._numericScaleModel = undefined;
    }
    static get SCALE_G_PROPERTY_NAME() {
        return 'Scale';
    }
    static get SCALE_RUNTIME_ID() {
        return "NumericScale_RuntimeId";
    }
    get scaleModel() {
        return this._numericScaleModel;
    }
    get scaleVisible() {
        return this._scaleVisible;
    }
    set scaleVisible(value) {
        this._scaleVisible = value;
        this.notifyModelPropertyChanged('scaleVisible');
    }
    get majorTicksVisible() {
        return this._majorTicksVisible;
    }
    set majorTicksVisible(value) {
        this._majorTicksVisible = value;
        this.notifyModelPropertyChanged('majorTicksVisible');
    }
    get minorTicksVisible() {
        return this._minorTicksVisible;
    }
    set minorTicksVisible(value) {
        this._minorTicksVisible = value;
        this.notifyModelPropertyChanged('minorTicksVisible');
    }
    get labelsVisible() {
        return this._labelsVisible;
    }
    set labelsVisible(value) {
        this._labelsVisible = value;
        this.notifyModelPropertyChanged('labelsVisible');
    }
    get coercionMode() {
        return this._coercionMode;
    }
    set coercionMode(value) {
        this._coercionMode = value;
        this.notifyModelPropertyChanged('coercionMode');
    }
    get rangeDivisionsMode() {
        return this._rangeDivisionsMode;
    }
    set rangeDivisionsMode(value) {
        this._rangeDivisionsMode = value;
        this.notifyModelPropertyChanged('rangeDivisionsMode');
    }
    get mechanicalAction() {
        return this._mechanicalAction;
    }
    set mechanicalAction(value) {
        this._mechanicalAction = value;
        this.notifyModelPropertyChanged('mechanicalAction');
    }
    gPropertyNIType(gPropertyName) {
        if (gPropertyName === NumericPointerModel.SCALE_RUNTIME_ID) {
            return window.NITypes.INT32;
        }
        return super.gPropertyNIType(gPropertyName);
    }
    createNumericScaleModel(niControlId) {
        this._numericScaleModel = new NumericScaleModel(niControlId);
    }
    getNumericScaleModel() {
        return this._numericScaleModel;
    }
}
//# sourceMappingURL=niNumericPointerModel.js.map