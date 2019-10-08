//****************************************
// Cartesian Graph Model
// National Instruments Copyright 2014
//****************************************
import { GraphBaseModel } from './niGraphBaseModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
export class CartesianGraphModel extends GraphBaseModel {
    static get MODEL_KIND() {
        return 'niCartesianGraph';
    }
}
NIModelProvider.registerModel(CartesianGraphModel);
//# sourceMappingURL=niCartesianGraphModel.js.map