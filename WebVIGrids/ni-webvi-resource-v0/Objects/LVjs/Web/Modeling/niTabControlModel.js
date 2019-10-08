//****************************************
// Boolean Button Model
// National Instruments Copyright 2014
//****************************************
import { LayoutControlModel } from './niLayoutControlModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
const NITypes = window.NITypes;
export class TabControlModel extends LayoutControlModel {
    constructor(id) {
        super(id);
        this.niType = NITypes.INT32;
        this._tabSelectorHidden = false;
        this._tabStripPlacement = 'top';
        this._selectedIndex = 0;
        this._activeTab = 0;
        this._inactiveBackground = '#d9dee1';
        this._inactiveForeground = '#000000';
    }
    static get ACTIVE_TAB_G_PROPERTY_NAME() {
        return 'ActiveTab';
    }
    static get TAB_G_PROPERTY_NAME() {
        return "Tab";
    }
    static get ACTIVE_TAB_RUNTIME_ID() {
        return "ActiveTab_RuntimeId";
    }
    static get MODEL_KIND() {
        return 'niTabControl';
    }
    get tabSelectorHidden() {
        return this._tabSelectorHidden;
    }
    set tabSelectorHidden(value) {
        this._tabSelectorHidden = value;
        this.notifyModelPropertyChanged('tabSelectorHidden');
    }
    get tabStripPlacement() {
        return this._tabStripPlacement;
    }
    set tabStripPlacement(value) {
        this._tabStripPlacement = value;
        this.notifyModelPropertyChanged('tabStripPlacement');
    }
    get selectedIndex() {
        return this._selectedIndex;
    }
    set selectedIndex(value) {
        this._selectedIndex = value;
        this.notifyModelPropertyChanged('selectedIndex');
    }
    get activeTab() {
        return this._activeTab;
    }
    set activeTab(value) {
        this._activeTab = value;
    }
    get inactiveBackground() {
        return this._inactiveBackground;
    }
    set inactiveBackground(value) {
        this._inactiveBackground = value;
        this.notifyModelPropertyChanged('inactiveBackground');
    }
    get inactiveForeground() {
        return this._inactiveForeground;
    }
    set inactiveForeground(value) {
        this._inactiveForeground = value;
        this.notifyModelPropertyChanged('inactiveForeground');
    }
    modelPropertyUsesNIType(propertyName) {
        return propertyName === 'selectedIndex';
    }
    controlChanged(newValue) {
        const oldValue = this.selectedIndex;
        this.selectedIndex = newValue;
        super.controlChanged('selectedIndex', newValue, oldValue);
    }
    gPropertyNIType(gPropertyName) {
        switch (gPropertyName) {
            case TabControlModel.ACTIVE_TAB_G_PROPERTY_NAME:
            case TabControlModel.ACTIVE_TAB_RUNTIME_ID:
                return NITypes.INT32;
        }
        return super.gPropertyNIType(gPropertyName);
    }
}
NIModelProvider.registerModel(TabControlModel);
//# sourceMappingURL=niTabControlModel.js.map