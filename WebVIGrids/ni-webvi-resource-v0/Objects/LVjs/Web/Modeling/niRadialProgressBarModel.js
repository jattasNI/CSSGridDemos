//****************************************
// Radial Progress Bar Model
// National Instruments Copyright 2014
//****************************************
// NOTE:
// The C# Model exposes an IsSegmented property here which is non-configurable.
// In addition, jqxWidgets does not support something like that property at the present time.
// We may also want to expose the animationDuration property in here an in the associated C# ViewModel
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { ProgressBarModel } from './niProgressBarModel.js';
export class RadialProgressBarModel extends ProgressBarModel {
    static get MODEL_KIND() {
        return 'niRadialProgressBar';
    }
}
NIModelProvider.registerModel(RadialProgressBarModel);
//# sourceMappingURL=niRadialProgressBarModel.js.map