//****************************************
// Boolean Switch View Model
// National Instruments Copyright 2015
//****************************************
import { BooleanContentControlViewModel } from './niBooleanContentControlViewModel.js';
import { BooleanControlModel } from '../Modeling/niBooleanControlModel.js';
import { BooleanSwitchModel } from '../Modeling/niBooleanSwitchModel.js';
import { CssProperties as CSS_PROPERTIES } from '../Framework/niCssProperties.js';
import { LabVIEWPropertyError } from '../Framework/LabVIEWPropertyError.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { RenderBuffer as RENDER_BUFFER } from '../Framework/niRenderBuffer.js';
import { TextAlignmentValueConverter as TEXTALIGN_VAL_CONVERTER } from '../Framework/ValueConverters/niTextAlignmentValueConverter.js';
export class BooleanSwitchViewModel extends BooleanContentControlViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('orientation');
    }
    static get PROPERTY_NOT_SUPPORTED_ERROR_CODE() {
        return 1703;
    }
    bindToView() {
        super.bindToView();
        const that = this;
        that.element.addEventListener('change', function (e) {
            if (that.computeReadOnlyForElement() || e.detail.changeType === 'api') {
                return;
            }
            const newValue = e.detail.value;
            if (that.model.value !== newValue) {
                that.model.controlChanged(newValue);
            }
        });
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'falseContentVisibility':
                renderBuffer.cssStyles[CSS_PROPERTIES.FALSE_CONTENT_DISPLAY] = this.model.falseContentVisibility ? RENDER_BUFFER.REMOVE_CUSTOM_PROPERTY_TOKEN : 'none';
                break;
            case 'textAlignment':
                renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX] = TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment);
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        const style = window.getComputedStyle(this.element);
        this.model.falseContentVisibility = style.getPropertyValue(CSS_PROPERTIES.FALSE_CONTENT_DISPLAY) !== 'none';
        this.model.textAlignment = TEXTALIGN_VAL_CONVERTER.convertFlexAlignmentToTextAlignment(style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX));
    }
    applyModelToElement() {
        super.applyModelToElement();
        if (!this.model.falseContentVisibility) {
            this.element.style.setProperty(CSS_PROPERTIES.FALSE_CONTENT_DISPLAY, 'none');
        }
        this.element.switchMode = 'click';
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX, TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment));
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case BooleanControlModel.TRUE_COLOR_G_PROPERTY_NAME:
            case BooleanControlModel.FALSE_COLOR_G_PROPERTY_NAME:
                // no-op to match desktop behavior.
                break;
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        switch (gPropertyName) {
            case BooleanControlModel.TRUE_COLOR_G_PROPERTY_NAME:
            case BooleanControlModel.FALSE_COLOR_G_PROPERTY_NAME:
                throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_CANNOT_BE_GET', gPropertyName), BooleanSwitchViewModel.PROPERTY_NOT_SUPPORTED_ERROR_CODE);
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
}
NIModelProvider.registerViewModel(BooleanSwitchViewModel, undefined, BooleanSwitchModel, 'jqx-switch-button');
//# sourceMappingURL=niBooleanSwitchViewModel.js.map