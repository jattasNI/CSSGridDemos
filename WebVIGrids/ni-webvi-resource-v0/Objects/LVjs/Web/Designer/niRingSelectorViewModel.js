//****************************************
// RingSelector View Model
// National Instruments Copyright 2015
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../Framework/niCssProperties.js';
import { LabVIEWPropertyError } from '../Framework/LabVIEWPropertyError.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { NumericValueSelectorViewModel } from './niNumericValueSelectorViewModel.js';
import { RingSelector } from '../Elements/ni-ring-selector.js';
import { RingSelectorModel } from '../Modeling/niRingSelectorModel.js';
import { TextAlignmentValueConverter as TEXTALIGN_VAL_CONVERTER } from '../Framework/ValueConverters/niTextAlignmentValueConverter.js';
import { VisualModel } from '../Modeling/niVisualModel.js';
// Static Private Variables
const numericValueWidthCssVariable = '--ni-numeric-value-width';
// Static Private Functions
const validateSelectors = function (itemsAndValuesMap) {
    const displayNameValues = [];
    const values = [];
    for (let i = 0; i < itemsAndValuesMap.length; i++) {
        displayNameValues[i] = itemsAndValuesMap[i].String;
        values[i] = itemsAndValuesMap[i].Value;
        if (displayNameValues[i] === "") {
            throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_EMPTY_DISPLAY_VALUE'), RingSelectorViewModel.DISPLAY_VALUES_MUST_NOT_BE_EMPTY_ERROR_CODE);
        }
    }
    if (displayNameValues.length !== new Set(displayNameValues).size) {
        throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_DUPLICATE_DISPLAY_NAME'), RingSelectorViewModel.DUPLICATE_DISPLAY_NAMES_NOT_ALLOWED_ERROR_CODE);
    }
    if (values.length !== new Set(values).size) {
        throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_DUPLICATE_DISPLAY_VALUE'), RingSelectorViewModel.DUPLICATE_VALUES_NOT_ALLOWED_ERROR_CODE);
    }
};
export class RingSelectorViewModel extends NumericValueSelectorViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('allowUndefined');
    }
    static get DISPLAY_VALUES_MUST_NOT_BE_EMPTY_ERROR_CODE() {
        return 363554;
    }
    static get DUPLICATE_VALUES_NOT_ALLOWED_ERROR_CODE() {
        return 363543;
    }
    static get DUPLICATE_DISPLAY_NAMES_NOT_ALLOWED_ERROR_CODE() {
        return 363544;
    }
    bindToView() {
        super.bindToView();
        this.bindFocusEventListener();
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'textAlignment':
                // TextAlignmentCssVariable is for drop down container whereas flexAlignmentCssVariable is for flex container inside drop down.
                renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX] = TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment);
                renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN] = this.model.textAlignment;
                break;
            case 'numericValueWidth':
                renderBuffer.cssStyles[numericValueWidthCssVariable] = this.model.numericValueWidth + "px";
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        const elementStyle = window.getComputedStyle(this.element);
        this.model.textAlignment = elementStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
        this.model.numericValueWidth = parseFloat(elementStyle.getPropertyValue(numericValueWidthCssVariable));
    }
    applyModelToElement() {
        super.applyModelToElement();
        const justifyContent = TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment);
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX, justifyContent);
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, this.model.textAlignment);
        this.element.style.setProperty(numericValueWidthCssVariable, this.model.numericValueWidth + "px");
    }
    getGPropertyValue(gPropertyName) {
        const model = this.model;
        switch (gPropertyName) {
            case RingSelectorModel.ITEMS_AND_VALUES_G_PROPERTY_NAME:
                return model.items.map((item) => {
                    const valueAndDisplayValue = {};
                    valueAndDisplayValue.String = item.displayValue;
                    valueAndDisplayValue.Value = item.value;
                    return valueAndDisplayValue;
                });
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        const model = this.model;
        switch (gPropertyName) {
            case VisualModel.VALUE_G_PROPERTY_NAME:
                model.value = gPropertyValue;
                break;
            case VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME:
                model.controlChanged(gPropertyValue);
                break;
            case RingSelectorModel.ITEMS_AND_VALUES_G_PROPERTY_NAME:
                validateSelectors(gPropertyValue);
                model.items = gPropertyValue.map((item) => {
                    const valueAndDisplayValue = {};
                    valueAndDisplayValue.displayValue = item.String;
                    valueAndDisplayValue.value = item.Value;
                    return valueAndDisplayValue;
                });
                break;
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
}
NIModelProvider.registerViewModel(RingSelectorViewModel, RingSelector, RingSelectorModel);
//# sourceMappingURL=niRingSelectorViewModel.js.map