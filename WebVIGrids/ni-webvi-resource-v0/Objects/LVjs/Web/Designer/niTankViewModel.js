//****************************************
// Tank View Model
// National Instruments Copyright 2014
//****************************************
import { LinearNumericPointerViewModel } from './niLinearNumericPointerViewModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { TankModel } from '../Modeling/niTankModel.js';
export class TankViewModel extends LinearNumericPointerViewModel {
}
NIModelProvider.registerViewModel(TankViewModel, undefined, TankModel, 'jqx-tank');
//# sourceMappingURL=niTankViewModel.js.map