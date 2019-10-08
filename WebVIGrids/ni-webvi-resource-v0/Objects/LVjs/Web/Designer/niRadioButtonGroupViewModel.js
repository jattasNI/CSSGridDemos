//****************************************
// RadioButtonGroupViewModel View Model
// National Instruments Copyright 2015
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../Framework/niCssProperties.js';
import { ColorValueConverters as ColorHelpers } from '../Framework/ValueConverters/niColorValueConverters.js';
import { LabVIEWPropertyError } from '../Framework/LabVIEWPropertyError.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { NumericValueSelectorModel } from '../Modeling/niNumericValueSelectorModel.js';
import { NumericValueSelectorViewModel } from './niNumericValueSelectorViewModel.js';
import { RadioButtonGroup } from '../Elements/ni-radio-button-group.js';
import { RadioButtonGroupModel } from '../Modeling/niRadioButtonGroupModel.js';
import { NIViewModel as ViewModel } from './niViewModel.js';
export class RadioButtonGroupViewModel extends NumericValueSelectorViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('orientation');
        this.registerAutoSyncProperty('selectedButtonBackground');
        this.registerAutoSyncProperty('unselectedButtonBackground');
        this.registerAutoSyncProperty('textColor');
    }
    static get GRADIENTS_NOT_SUPPORTED_ERROR_CODE() {
        return 1702;
    }
    modelPropertyChanged(propertyName) {
        const model = this.model;
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'textAlignment':
                renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN] = model.textAlignment;
                break;
            case 'selectedButtonBackground':
                renderBuffer.cssStyles[CSS_PROPERTIES.SELECTED_BACKGROUND] = model.selectedButtonBackground;
                break;
            case 'unselectedButtonBackground':
                renderBuffer.cssStyles[CSS_PROPERTIES.UNSELECTED_BACKGROUND] = model.unselectedButtonBackground;
                break;
            case 'textColor':
                renderBuffer.cssStyles[CSS_PROPERTIES.FOREGROUND_COLOR] = model.textColor;
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        const model = this.model;
        const element = this.element;
        super.updateModelFromElement();
        const style = window.getComputedStyle(element);
        model.textAlignment = style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
        model.selectedButtonBackground = style.getPropertyValue(CSS_PROPERTIES.SELECTED_BACKGROUND);
        model.unselectedButtonBackground = style.getPropertyValue(CSS_PROPERTIES.UNSELECTED_BACKGROUND);
        model.textColor = style.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR);
    }
    applyModelToElement() {
        const model = this.model;
        const element = this.element;
        super.applyModelToElement();
        element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, model.textAlignment);
        element.style.setProperty(CSS_PROPERTIES.SELECTED_BACKGROUND, model.selectedButtonBackground);
        element.style.setProperty(CSS_PROPERTIES.UNSELECTED_BACKGROUND, model.unselectedButtonBackground);
        element.style.setProperty(CSS_PROPERTIES.FOREGROUND_COLOR, model.textColor);
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        const model = this.model;
        switch (gPropertyName) {
            case NumericValueSelectorModel.ITEMS_G_PROPERTY_NAME:
            case NumericValueSelectorModel.DISABLED_INDEXES_G_PROPERTY_NAME:
                throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_NOT_SUPPORTED', gPropertyName), ViewModel.OPERATION_UNSUPPORTED_ON_CONTROL_ERROR_CODE);
            case RadioButtonGroupModel.SELECTED_COLOR_G_PROPERTY_NAME:
                model.selectedButtonBackground = ColorHelpers.integerToRGBA(gPropertyValue);
                break;
            case RadioButtonGroupModel.UNSELECTED_COLOR_G_PROPERTY_NAME:
                model.unselectedButtonBackground = ColorHelpers.integerToRGBA(gPropertyValue);
                break;
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        const model = this.model;
        switch (gPropertyName) {
            case NumericValueSelectorModel.ITEMS_G_PROPERTY_NAME:
            case NumericValueSelectorModel.DISABLED_INDEXES_G_PROPERTY_NAME:
                throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_NOT_SUPPORTED', gPropertyName), ViewModel.OPERATION_UNSUPPORTED_ON_CONTROL_ERROR_CODE);
            case RadioButtonGroupModel.SELECTED_COLOR_G_PROPERTY_NAME:
                {
                    const selectedColor = model.selectedButtonBackground;
                    if (ColorHelpers.isRGBAOrHexFormat(selectedColor)) {
                        return ColorHelpers.getIntegerValueForInputColor(selectedColor);
                    }
                    throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_WITH_GRADIENT_COLOR_NOT_SUPPORTED', gPropertyName), RadioButtonGroupViewModel.GRADIENTS_NOT_SUPPORTED_ERROR_CODE);
                }
            case RadioButtonGroupModel.UNSELECTED_COLOR_G_PROPERTY_NAME:
                {
                    const unselectedColor = model.unselectedButtonBackground;
                    if (ColorHelpers.isRGBAOrHexFormat(unselectedColor)) {
                        return ColorHelpers.getIntegerValueForInputColor(unselectedColor);
                    }
                    throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_WITH_GRADIENT_COLOR_NOT_SUPPORTED', gPropertyName), RadioButtonGroupViewModel.GRADIENTS_NOT_SUPPORTED_ERROR_CODE);
                }
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
}
NIModelProvider.registerViewModel(RadioButtonGroupViewModel, RadioButtonGroup, RadioButtonGroupModel);
//# sourceMappingURL=niRadioButtonGroupViewModel.js.map