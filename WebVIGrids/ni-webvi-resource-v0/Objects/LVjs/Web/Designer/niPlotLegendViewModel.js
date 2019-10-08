//****************************************
// PlotLegend View Model
// National Instruments Copyright 2015
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { PlotLegendModel } from '../Modeling/niPlotLegendModel.js';
import { VisualViewModel } from './niVisualViewModel.js';
export class PlotLegendViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('graphRef');
        this.registerAutoSyncProperty('isInEditMode');
    }
    userInteractionChanged(newState, operationKind) {
        if (newState === 'start') {
            // Brace yourself. The user is coming
            this.element.throttlePlotUpdates(true);
        }
        if (newState === 'end') {
            // End of the user interaction
            this.element.throttlePlotUpdates(false);
        }
        if (newState === 'atomicactioncomplete') {
            // the plots and renderers are in a consistent state, take the opportunity and display them.
            this.element.syncPlotLegendWithGraph();
        }
        super.userInteractionChanged(newState, operationKind);
    }
    isFollower() {
        return true;
    }
}
NIModelProvider.registerViewModel(PlotLegendViewModel, undefined, PlotLegendModel, 'ni-plot-legend');
//# sourceMappingURL=niPlotLegendViewModel.js.map