//****************************************
// OpaqueRefnum Model
// National Instruments Copyright 2014
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualModel } from './niVisualModel.js';
export class OpaqueRefnumModel extends VisualModel {
    static get MODEL_KIND() {
        return 'niOpaqueRefnum';
    }
}
NIModelProvider.registerModel(OpaqueRefnumModel);
//# sourceMappingURL=niOpaqueRefnumModel.js.map