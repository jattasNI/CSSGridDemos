//****************************************
// PlotRenderer View Model
// National Instruments Copyright 2014
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { PlotRendererModel } from "../Modeling/niPlotRendererModel.js";
import { VisualComponentViewModel } from './niVisualComponentViewModel.js';
export class PlotRendererViewModel extends VisualComponentViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('lineWidth');
        this.registerAutoSyncProperty('lineStyle');
        this.registerAutoSyncProperty('pointShape');
        this.registerAutoSyncProperty('pointSize');
        this.registerAutoSyncProperty('pointColor');
        this.registerAutoSyncProperty('lineStroke');
        this.registerAutoSyncProperty('areaFill');
        this.registerAutoSyncProperty('barFill');
        this.registerAutoSyncProperty('barWidth');
        this.registerAutoSyncProperty('areaBaseLine');
        this.registerAutoSyncProperty('barBaseLine');
    }
}
NIModelProvider.registerViewModel(PlotRendererViewModel, undefined, PlotRendererModel, 'ni-cartesian-plot-renderer');
//# sourceMappingURL=niPlotRendererViewModel.js.map