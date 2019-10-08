//****************************************
// CursorLegend View Model
// National Instruments Copyright 2015
//****************************************
import { CursorLegendModel } from "../Modeling/niCursorLegendModel.js";
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualViewModel } from './niVisualViewModel.js';
export class CursorLegendViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('graphRef');
        this.registerAutoSyncProperty('isInEditMode');
    }
    isFollower() {
        return true;
    }
}
NIModelProvider.registerViewModel(CursorLegendViewModel, undefined, CursorLegendModel, 'ni-cursor-legend');
//# sourceMappingURL=niCursorLegendViewModel.js.map