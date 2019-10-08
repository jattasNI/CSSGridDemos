//****************************************
// Boolean Power Switch View Model
// National Instruments Copyright 2015
//****************************************
import { BooleanPowerButtonModel } from '../Modeling/niBooleanPowerButtonModel.js';
import { BooleanSwitchViewModel } from './niBooleanSwitchViewModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
class BooleanPowerButtonViewModel extends BooleanSwitchViewModel {
}
NIModelProvider.registerViewModel(BooleanPowerButtonViewModel, undefined, BooleanPowerButtonModel, 'jqx-power-button');
//# sourceMappingURL=niBooleanPowerButtonViewModel.js.map