//****************************************
// ScaleLegend View Model
// National Instruments Copyright 2015
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { ScaleLegendModel } from "../Modeling/niScaleLegendModel.js";
import { VisualViewModel } from './niVisualViewModel.js';
export class ScaleLegendViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('graphRef');
        this.registerAutoSyncProperty('isInEditMode');
    }
    isFollower() {
        return true;
    }
}
NIModelProvider.registerViewModel(ScaleLegendViewModel, undefined, ScaleLegendModel, 'ni-scale-legend');
//# sourceMappingURL=niScaleLegendViewModel.js.map