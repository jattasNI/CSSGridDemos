//****************************************
// Url Image View Model
// National Instruments Copyright 2015
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { UrlImage } from '../Elements/ni-url-image.js';
import { UrlImageModel } from '../Modeling/niUrlImageModel.js';
import { VisualModel } from '../Modeling/niVisualModel.js';
import { VisualViewModel } from './niVisualViewModel.js';
export class UrlImageViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('alternate');
        this.registerAutoSyncProperty('stretch');
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'source':
                renderBuffer.properties.sourceNonSignaling = this.model.source;
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        this.model.defaultValue = this.element.source;
        this.model.source = this.element.source;
    }
    applyModelToElement() {
        super.applyModelToElement();
        this.element.sourceNonSignaling = this.model.source;
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        const model = this.model;
        switch (gPropertyName) {
            case VisualModel.VALUE_G_PROPERTY_NAME:
                model.source = gPropertyValue;
                break;
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        const model = this.model;
        switch (gPropertyName) {
            case VisualModel.VALUE_G_PROPERTY_NAME:
                return model.source;
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
}
NIModelProvider.registerViewModel(UrlImageViewModel, UrlImage, UrlImageModel);
//# sourceMappingURL=niUrlImageViewModel.js.map