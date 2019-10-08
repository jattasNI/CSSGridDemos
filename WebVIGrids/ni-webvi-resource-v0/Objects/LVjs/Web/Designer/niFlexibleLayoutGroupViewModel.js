//****************************************
// Flexible Layout Group View Model
// National Instruments Copyright 2018
//****************************************
import { FlexibleLayoutGroupModel } from '../Modeling/niFlexibleLayoutGroupModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualViewModel } from './niVisualViewModel.js';
export class FlexibleLayoutGroupViewModel extends VisualViewModel {
    shouldElementUseModelHeight() {
        return false;
    }
    shouldElementUseModelWidth() {
        return false;
    }
}
NIModelProvider.registerViewModel(FlexibleLayoutGroupViewModel, undefined, FlexibleLayoutGroupModel, 'ni-flexible-layout-group');
//# sourceMappingURL=niFlexibleLayoutGroupViewModel.js.map