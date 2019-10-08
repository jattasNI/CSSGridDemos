//****************************************
// Slider Model
// National Instruments Copyright 2014
//****************************************
import { LinearNumericPointerModel } from './niLinearNumericPointerModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
export class SliderModel extends LinearNumericPointerModel {
    constructor(id) {
        super(id);
        this._showTooltip = true;
        this._mechanicalAction = 'switchWhileDragging';
    }
    static get MODEL_KIND() {
        return 'niSlider';
    }
    get showTooltip() {
        return this._showTooltip;
    }
    set showTooltip(value) {
        this._showTooltip = value;
        this.notifyModelPropertyChanged('showTooltip');
    }
    get mechanicalAction() {
        return this._mechanicalAction;
    }
    set mechanicalAction(value) {
        this._mechanicalAction = value;
        this.notifyModelPropertyChanged('mechanicalAction');
    }
}
NIModelProvider.registerModel(SliderModel);
//# sourceMappingURL=niSliderModel.js.map