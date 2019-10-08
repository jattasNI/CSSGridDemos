//****************************************
// Layout Panel Model
// National Instruments Copyright 2014
//****************************************
import { LayoutControlModel } from './niLayoutControlModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
export class LayoutPanelModel extends LayoutControlModel {
    static get MODEL_KIND() {
        return 'niLayoutPanel';
    }
}
NIModelProvider.registerModel(LayoutPanelModel);
//# sourceMappingURL=niLayoutPanelModel.js.map