//****************************************
// Hyperlink View Model
// National Instruments Copyright 2015
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../Framework/niCssProperties.js';
import { HyperlinkModel } from '../Modeling/niHyperlinkModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualModel } from '../Modeling/niVisualModel.js';
import { VisualViewModel } from './niVisualViewModel.js';
export class HyperlinkViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('content');
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'href':
                renderBuffer.properties.href = this.model.href;
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
        model.defaultValue = element.href;
        model.href = element.href;
        const style = window.getComputedStyle(this.element);
        this.model.textAlignment = style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
    }
    applyModelToElement() {
        super.applyModelToElement();
        this.element.href = this.model.href;
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, this.model.textAlignment);
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        const model = this.model;
        switch (gPropertyName) {
            case VisualModel.VALUE_G_PROPERTY_NAME:
                model.href = gPropertyValue;
                break;
            case VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME:
                model.controlChanged(gPropertyValue);
                break;
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        const model = this.model;
        switch (gPropertyName) {
            case VisualModel.VALUE_G_PROPERTY_NAME:
                return model.href;
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
}
NIModelProvider.registerViewModel(HyperlinkViewModel, undefined, HyperlinkModel, 'ni-hyperlink');
//# sourceMappingURL=niHyperlinkViewModel.js.map