//****************************************
// Boolean Control View Model
// National Instruments Copyright 2014
//****************************************
import { BooleanControlModel } from '../Modeling/niBooleanControlModel.js';
import { BooleanControlViewModel } from './niBooleanControlViewModel.js';
import { CssProperties as CSS_PROPERTIES } from '../Framework/niCssProperties.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { RenderBuffer as RENDER_BUFFER } from '../Framework/niRenderBuffer.js';
export class BooleanContentControlViewModel extends BooleanControlViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('trueContent');
        this.registerAutoSyncProperty('falseContent');
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'contentVisible':
                renderBuffer.cssStyles[CSS_PROPERTIES.CONTENT_DISPLAY] = this.model.contentVisible ? RENDER_BUFFER.REMOVE_CUSTOM_PROPERTY_TOKEN : 'none';
                break;
            case 'value':
                renderBuffer.properties.checked = this.model.value;
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        const style = window.getComputedStyle(this.element);
        this.model.contentVisible = style.getPropertyValue(CSS_PROPERTIES.CONTENT_DISPLAY) !== 'none';
        this.model.value = this.element.checked;
    }
    applyModelToElement() {
        super.applyModelToElement();
        if (!this.model.contentVisible) {
            this.element.style.setProperty(CSS_PROPERTIES.CONTENT_DISPLAY, 'none');
        }
        this.element.checked = this.model.value;
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        const model = this.model;
        switch (gPropertyName) {
            case BooleanControlModel.TEXT_G_PROPERTY_NAME: {
                const indexOfTrueContent = 0;
                // if condition will leave the true/false Content unchanged in empty array situation.
                if (gPropertyValue.length > indexOfTrueContent) {
                    model.trueContent = NI_SUPPORT.escapeHtml(gPropertyValue[indexOfTrueContent]);
                }
                const indexOfFalseContent = 1;
                if (gPropertyValue.length > indexOfFalseContent) {
                    model.falseContent = NI_SUPPORT.escapeHtml(gPropertyValue[indexOfFalseContent]);
                }
                break;
            }
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        const model = this.model;
        switch (gPropertyName) {
            case BooleanControlModel.TEXT_G_PROPERTY_NAME:
                return [NI_SUPPORT.unescapeHtml(model.trueContent), NI_SUPPORT.unescapeHtml(model.falseContent)];
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
}
//# sourceMappingURL=niBooleanContentControlViewModel.js.map