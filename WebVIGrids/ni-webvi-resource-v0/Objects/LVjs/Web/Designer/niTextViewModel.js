//****************************************
// Text View Model
// National Instruments Copyright 2014
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../Framework/niCssProperties.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { Text } from '../Elements/ni-text.js';
import { TextModel } from '../Modeling/niTextModel.js';
import { VisualViewModel } from './niVisualViewModel.js';
export class TextViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('text');
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'text':
                this.model.requestSendControlBounds();
                break;
            case 'textAlignment':
                renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN] = this.model.textAlignment;
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        const model = this.model, element = this.element;
        const style = window.getComputedStyle(element);
        model.textAlignment = style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
        model.defaultValue = element.text;
    }
    applyModelToElement() {
        super.applyModelToElement();
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, this.model.textAlignment);
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        const model = this.model;
        switch (gPropertyName) {
            case TextModel.TEXT_G_PROPERTY_NAME:
                model.text = gPropertyValue;
                break;
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        const model = this.model;
        switch (gPropertyName) {
            case TextModel.TEXT_G_PROPERTY_NAME:
                return model.text;
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
}
NIModelProvider.registerViewModel(TextViewModel, Text, TextModel);
//# sourceMappingURL=niTextViewModel.js.map