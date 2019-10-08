//****************************************
// Chart Graph Model
// National Instruments Copyright 2014
//****************************************
import { GraphBaseModel } from './niGraphBaseModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
export class IntensityGraphModel extends GraphBaseModel {
    static get MODEL_KIND() {
        return 'niIntensityGraph';
    }
}
NIModelProvider.registerModel(IntensityGraphModel);
//# sourceMappingURL=niIntensityGraphModel.js.map