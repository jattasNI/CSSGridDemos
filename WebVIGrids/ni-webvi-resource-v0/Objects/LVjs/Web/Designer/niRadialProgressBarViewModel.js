//****************************************
// Radial Progress Bar View Model
// National Instruments Copyright 2014
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { ProgressBarViewModel } from './niProgressBarViewModel.js';
import { RadialProgressBarModel } from '../Modeling/niRadialProgressBarModel.js';
export class RadialProgressBarViewModel extends ProgressBarViewModel {
}
NIModelProvider.registerViewModel(RadialProgressBarViewModel, undefined, RadialProgressBarModel, 'jqx-circular-progress-bar');
//# sourceMappingURL=niRadialProgressBarViewModel.js.map