//****************************************
// Tank Model
// National Instruments Copyright 2014
//****************************************
import { LinearNumericPointerModel } from './niLinearNumericPointerModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
export class TankModel extends LinearNumericPointerModel {
    static get MODEL_KIND() {
        return 'niTank';
    }
}
NIModelProvider.registerModel(TankModel);
//# sourceMappingURL=niTankModel.js.map