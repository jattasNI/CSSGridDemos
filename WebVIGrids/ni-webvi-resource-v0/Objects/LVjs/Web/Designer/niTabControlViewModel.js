//****************************************
// Tab Control View Model
// National Instruments Copyright 2014
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../Framework/niCssProperties.js';
import { LabVIEWPropertyError } from '../Framework/LabVIEWPropertyError.js';
import { LayoutControlViewModel } from './niLayoutControlViewModel.js';
import { MathHelpers } from '../Framework/MathHelpers/MathHelpers.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { TabControl } from '../Elements/ni-tab-control.js';
import { TabControlModel } from '../Modeling/niTabControlModel.js';
import { NIViewModel as ViewModel } from './niViewModel.js';
import { VisualModel } from '../Modeling/niVisualModel.js';
export class TabControlViewModel extends LayoutControlViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('tabStripPlacement');
        this.registerAutoSyncProperty('tabSelectorHidden');
    }
    static get INVALID_ACTIVE_TAB_ERROR_CODE() {
        return 363555;
    }
    bindToView() {
        super.bindToView();
        const that = this;
        that.element.addEventListener('selected-index-changed', function (event) {
            if (event.target === that.element) {
                const newValue = event.detail.selectedIndex;
                that.model.controlChanged(newValue);
                that.model.requestSendControlBounds();
            }
        });
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'selectedIndex':
                renderBuffer.properties.selectedIndexNonSignaling = this.model.selectedIndex;
                break;
            case 'inactiveBackground':
                renderBuffer.cssStyles[CSS_PROPERTIES.INACTIVE_BACKGROUND] = this.model.inactiveBackground;
                break;
            case 'inactiveForeground':
                renderBuffer.cssStyles[CSS_PROPERTIES.INACTIVE_FOREGROUND_COLOR] = this.model.inactiveForeground;
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        const model = this.model, element = this.element;
        const elementStyle = window.getComputedStyle(element);
        model.selectedIndex = element.selectedIndex;
        model.defaultValue = element.selectedIndex;
        model.inactiveBackground = elementStyle.getPropertyValue(CSS_PROPERTIES.INACTIVE_BACKGROUND);
        model.inactiveForeground = elementStyle.getPropertyValue(CSS_PROPERTIES.INACTIVE_FOREGROUND_COLOR);
    }
    applyModelToElement() {
        super.applyModelToElement();
        const element = this.element, model = this.model;
        element.selectedIndex = model.selectedIndex;
        element.style.setProperty(CSS_PROPERTIES.INACTIVE_BACKGROUND, model.inactiveBackground);
        element.style.setProperty(CSS_PROPERTIES.INACTIVE_FOREGROUND_COLOR, model.inactiveForeground);
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        const model = this.model;
        switch (gPropertyName) {
            case VisualModel.VALUE_G_PROPERTY_NAME:
                model.selectedIndex = clampForValue(gPropertyValue, model.childModels.length);
                break;
            case VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME:
                model.controlChanged(clampForValue(gPropertyValue, model.childModels.length));
                break;
            case TabControlModel.ACTIVE_TAB_G_PROPERTY_NAME:
                {
                    if (gPropertyValue < 0 || gPropertyValue >= model.childModels.length) {
                        throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', gPropertyName, model.childModels.length - 1), TabControlViewModel.INVALID_ACTIVE_TAB_ERROR_CODE);
                    }
                    else {
                        model.activeTab = gPropertyValue;
                    }
                    break;
                }
            case TabControlModel.TAB_G_PROPERTY_NAME:
                throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_CANNOT_BE_SET', gPropertyName), ViewModel.OPERATION_UNSUPPORTED_ON_CONTROL_ERROR_CODE);
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        const model = this.model;
        switch (gPropertyName) {
            case VisualModel.VALUE_G_PROPERTY_NAME:
                return model.selectedIndex;
            case TabControlModel.ACTIVE_TAB_G_PROPERTY_NAME:
                return model.activeTab;
            case TabControlModel.TAB_G_PROPERTY_NAME:
                {
                    const activeTabModel = model.childModels[model.activeTab];
                    return activeTabModel.rootOwner.getControlViewModel(activeTabModel.niControlId);
                }
            case TabControlModel.ACTIVE_TAB_RUNTIME_ID:
                return model.childModels[model.activeTab].niControlId;
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
}
const clampForValue = function (gPropertyValue, itemLength) {
    return MathHelpers.clamp(gPropertyValue, 0, itemLength - 1);
};
NIModelProvider.registerViewModel(TabControlViewModel, TabControl, TabControlModel);
//# sourceMappingURL=niTabControlViewModel.js.map