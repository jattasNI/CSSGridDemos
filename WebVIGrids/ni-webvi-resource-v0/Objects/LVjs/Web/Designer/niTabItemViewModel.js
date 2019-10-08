//****************************************
// TabItem View Model
// National Instruments Copyright 2014
//****************************************
import { LayoutControlViewModel } from './niLayoutControlViewModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { RenderEngine } from '../Framework/niRenderEngine.js';
import { TabItem } from '../Elements/ni-tab-item.js';
import { TabItemModel } from '../Modeling/niTabItemModel.js';
import { VisualModel } from '../Modeling/niVisualModel.js';
const getSelectableTabItemsCount = function (tabControlmodel) {
    let numberOfSelectableTabItems = 0;
    tabControlmodel.childModels.forEach(childModel => {
        if (childModel.enabled === true && childModel.visible === true) {
            numberOfSelectableTabItems++;
        }
    });
    return numberOfSelectableTabItems;
};
export class TabItemViewModel extends LayoutControlViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('header');
        this.registerAutoSyncProperty('tabPosition');
    }
    shouldElementUseModelWidth() {
        return false;
    }
    shouldElementUseModelHeight() {
        return false;
    }
    shouldElementUseModelPosition() {
        return false;
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'visible':
                // Require frame update since event handler needs updated element property.
                this.applyElementChanges();
                RenderEngine.waitForFrameUpdate().then(() => {
                    this.element.sendEventToParentTabControlOnVisibilityUpdate();
                });
                break;
        }
        return renderBuffer;
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        const model = this.model;
        switch (gPropertyName) {
            case TabItemModel.ENABLED_G_PROPERTY_NAME:
                {
                    //  Disabling the last selectable item is not allowed
                    if (!(gPropertyValue === false && getSelectableTabItemsCount(model.owner) === 1)) {
                        model.enabled = gPropertyValue;
                    }
                    break;
                }
            case VisualModel.VISIBLE_G_PROPERTY_NAME:
                {
                    // Hiding the last selectable item is not allowed
                    if (!(gPropertyValue === false && getSelectableTabItemsCount(model.owner) === 1)) {
                        model.visible = gPropertyValue;
                    }
                    break;
                }
            case TabItemModel.NAME_G_PROPERTY_NAME:
                model.header = gPropertyValue;
                break;
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        const model = this.model;
        switch (gPropertyName) {
            case TabItemModel.ENABLED_G_PROPERTY_NAME:
                return model.enabled;
            case VisualModel.VISIBLE_G_PROPERTY_NAME:
                return model.visible;
            case TabItemModel.NAME_G_PROPERTY_NAME:
                return model.header;
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
}
NIModelProvider.registerViewModel(TabItemViewModel, TabItem, TabItemModel);
//# sourceMappingURL=niTabItemViewModel.js.map