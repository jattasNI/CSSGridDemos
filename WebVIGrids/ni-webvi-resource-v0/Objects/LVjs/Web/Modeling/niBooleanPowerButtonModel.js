//****************************************
// Boolean Power Button Model
// National Instruments Copyright 2015
//****************************************
import { BooleanSwitchModel } from './niBooleanSwitchModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
export class BooleanPowerButtonModel extends BooleanSwitchModel {
    static get MODEL_KIND() {
        return 'niBooleanPowerButton';
    }
}
NIModelProvider.registerModel(BooleanPowerButtonModel);
//# sourceMappingURL=niBooleanPowerButtonModel.js.map