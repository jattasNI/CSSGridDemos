//****************************************
// Label View Model
// National Instruments Copyright 2015
//****************************************
import { LabVIEWPropertyError } from '../Framework/LabVIEWPropertyError.js';
import { Label } from '../Elements/ni-label.js';
import { LabelModel } from '../Modeling/niLabelModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { NIViewModel as ViewModel } from './niViewModel.js';
import { VisualModel } from '../Modeling/niVisualModel.js';
import { VisualViewModel } from './niVisualViewModel.js';
export class LabelViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('text');
    }
    static get LOCKED_LABEL_POSITION_ERROR_CODE() {
        return 363558;
    }
    static get LOCKED_LABEL_SIZE_ERROR_CODE() {
        return 363559;
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'text':
                this.model.requestSendControlBounds();
                break;
            case 'labelAlignment':
                this.model.requestSendControlBounds();
                break;
        }
        return renderBuffer;
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        const model = this.model;
        switch (gPropertyName) {
            case LabelModel.TEXT_G_PROPERTY_NAME:
                model.text = gPropertyValue;
                break;
            case VisualModel.POSITION_G_PROPERTY_NAME:
                throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_CANNOT_BE_SET', gPropertyName), LabelViewModel.LOCKED_LABEL_POSITION_ERROR_CODE);
            case VisualModel.SIZE_G_PROPERTY_NAME:
                throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_CANNOT_BE_SET', gPropertyName), LabelViewModel.LOCKED_LABEL_SIZE_ERROR_CODE);
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        const model = this.model;
        switch (gPropertyName) {
            case LabelModel.TEXT_G_PROPERTY_NAME:
                return model.text;
            case VisualModel.SIZE_G_PROPERTY_NAME:
                // CAR:718175
                throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_CANNOT_BE_GET', gPropertyName), ViewModel.OPERATION_UNSUPPORTED_ON_CONTROL_ERROR_CODE);
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
    isFollower() {
        return true;
    }
}
NIModelProvider.registerViewModel(LabelViewModel, Label, LabelModel);
//# sourceMappingURL=niLabelViewModel.js.map