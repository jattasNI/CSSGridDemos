//****************************************
// Flexible Layout Component View Model
// National Instruments Copyright 2018
//****************************************
import { FlexibleLayoutComponentModel } from '../Modeling/niFlexibleLayoutComponentModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualViewModel } from './niVisualViewModel.js';
export class FlexibleLayoutComponentViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('layoutPattern');
    }
    shouldApplyDraggingStyleWithChild() {
        return true;
    }
    shouldElementUseModelHeight() {
        return false;
    }
    shouldElementUseModelWidth() {
        return false;
    }
}
NIModelProvider.registerViewModel(FlexibleLayoutComponentViewModel, undefined, FlexibleLayoutComponentModel, 'ni-flexible-layout-component');
//# sourceMappingURL=niFlexibleLayoutComponentViewModel.js.map