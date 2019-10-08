//****************************************
// Linear Progress Bar Model
// National Instruments Copyright 2014
//****************************************
// NOTE:
// The C# Model exposes an IsSegmented property here which is non-configurable.
// In addition, jqxWidgets does not support something like that property at the present time.
// We may also want to expose the animationDuration property in here an in the associated C# ViewModel
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { ProgressBarModel } from './niProgressBarModel.js';
const _orientationEnum = Object.freeze({
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal'
});
export class LinearProgressBarModel extends ProgressBarModel {
    constructor(id) {
        super(id);
        this._orientation = LinearProgressBarModel.OrientationEnum.HORIZONTAL;
    }
    static get MODEL_KIND() {
        return 'niLinearProgressBar';
    }
    static get OrientationEnum() {
        return _orientationEnum;
    }
    get orientation() {
        return this._orientation;
    }
    set orientation(value) {
        this._orientation = value;
        this.notifyModelPropertyChanged('orientation');
    }
}
NIModelProvider.registerModel(LinearProgressBarModel);
//# sourceMappingURL=niLinearProgressBarModel.js.map