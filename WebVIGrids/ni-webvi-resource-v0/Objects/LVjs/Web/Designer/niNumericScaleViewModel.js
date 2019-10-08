//****************************************
// NumericScale View Model
// National Instruments Copyright 2014
//****************************************
import { VisualModel } from '../Modeling/niVisualModel.js';
import { VisualViewModel } from './niVisualViewModel.js';
export class NumericScaleViewModel extends VisualViewModel {
    constructor(owningNumericPointerElement, owningNumericPointerModel) {
        super(owningNumericPointerElement, owningNumericPointerModel.scaleModel);
        this.owningNumericPointerModel = owningNumericPointerModel;
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case VisualModel.VISIBLE_G_PROPERTY_NAME:
                this.owningNumericPointerModel.scaleVisible = gPropertyValue;
                break;
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        switch (gPropertyName) {
            case VisualModel.VISIBLE_G_PROPERTY_NAME:
                return this.owningNumericPointerModel.scaleVisible;
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
}
//# sourceMappingURL=niNumericScaleViewModel.js.map