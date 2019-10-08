//****************************************
// ColorScale View Model
// National Instruments Copyright 2014
//****************************************
import { ColorScaleModel } from '../Modeling/niColorScaleModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualViewModel } from './niVisualViewModel.js';
export class ColorScaleViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('axisPosition');
        this.registerAutoSyncProperty('autoScale');
        this.registerAutoSyncProperty('label');
        this.registerAutoSyncProperty('show');
        this.registerAutoSyncProperty('showLabel');
        this.registerAutoSyncProperty('highColor');
        this.registerAutoSyncProperty('lowColor');
        this.registerAutoSyncProperty('markers');
    }
}
NIModelProvider.registerViewModel(ColorScaleViewModel, undefined, ColorScaleModel, 'ni-color-scale');
//# sourceMappingURL=niColorScaleViewModel.js.map