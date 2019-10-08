//****************************************
// Graph Tools View Model
// National Instruments Copyright 2015
//****************************************
import { GraphToolsModel } from "../Modeling/niGraphToolsModel.js";
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualViewModel } from './niVisualViewModel.js';
export class GraphToolsViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('graphRef');
        this.registerAutoSyncProperty('isInEditMode');
        this.registerAutoSyncProperty('mode');
    }
    isFollower() {
        return true;
    }
}
NIModelProvider.registerViewModel(GraphToolsViewModel, undefined, GraphToolsModel, 'ni-graph-tools');
//# sourceMappingURL=niGraphToolsViewModel.js.map