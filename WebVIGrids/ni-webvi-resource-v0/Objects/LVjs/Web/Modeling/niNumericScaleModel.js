//****************************************
// Numeric Scale Model
// National Instruments Copyright 2019
//****************************************
import { VisualModel } from './niVisualModel.js';
export class NumericScaleModel extends VisualModel {
    gPropertyNIType(gPropertyName) {
        switch (gPropertyName) {
            case VisualModel.VISIBLE_G_PROPERTY_NAME:
                return window.NITypes.BOOLEAN;
            default:
                return super.gPropertyNIType(gPropertyName);
        }
    }
}
//# sourceMappingURL=niNumericScaleModel.js.map