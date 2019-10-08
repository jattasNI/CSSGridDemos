//****************************************
// EnumSelector View Model
// National Instruments Copyright 2015
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../Framework/niCssProperties.js';
import { EnumSelector } from '../Elements/ni-enum-selector.js';
import { EnumSelectorModel } from '../Modeling/niEnumSelectorModel.js';
import { LabVIEWPropertyError } from '../Framework/LabVIEWPropertyError.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { NumericValueSelectorModel } from '../Modeling/niNumericValueSelectorModel.js';
import { NumericValueSelectorViewModel } from './niNumericValueSelectorViewModel.js';
import { TextAlignmentValueConverter as TEXTALIGN_VAL_CONVERTER } from '../Framework/ValueConverters/niTextAlignmentValueConverter.js';
import { NIViewModel as ViewModel } from './niViewModel.js';
export class EnumSelectorViewModel extends NumericValueSelectorViewModel {
    modelPropertyChanged(propertyName) {
        const that = this;
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'textAlignment':
                renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX] = TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(that.model.textAlignment);
                renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN] = that.model.textAlignment;
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        const elementStyle = window.getComputedStyle(this.element);
        this.model.textAlignment = elementStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
    }
    applyModelToElement() {
        super.applyModelToElement();
        const justifyContent = TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment);
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX, justifyContent);
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, this.model.textAlignment);
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case NumericValueSelectorModel.ITEMS_G_PROPERTY_NAME:
                throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_NOT_SUPPORTED', gPropertyName), ViewModel.OPERATION_UNSUPPORTED_ON_CONTROL_ERROR_CODE);
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        switch (gPropertyName) {
            case NumericValueSelectorModel.ITEMS_G_PROPERTY_NAME:
                throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_NOT_SUPPORTED', gPropertyName), ViewModel.OPERATION_UNSUPPORTED_ON_CONTROL_ERROR_CODE);
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
}
NIModelProvider.registerViewModel(EnumSelectorViewModel, EnumSelector, EnumSelectorModel);
//# sourceMappingURL=niEnumSelectorViewModel.js.map