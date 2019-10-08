//****************************************
// Flexible Layout Group Model
// National Instruments Copyright 2018
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualModel } from './niVisualModel.js';
export class FlexibleLayoutGroupModel extends VisualModel {
    static get MODEL_KIND() {
        return 'niFlexibleLayoutGroup';
    }
}
NIModelProvider.registerModel(FlexibleLayoutGroupModel);
//# sourceMappingURL=niFlexibleLayoutGroupModel.js.map