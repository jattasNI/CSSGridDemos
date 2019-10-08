//****************************************
// Tab Item Model
// National Instruments Copyright 2014
//****************************************
import { LayoutControlModel } from './niLayoutControlModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
const NITypes = window.NITypes;
export class TabItemModel extends LayoutControlModel {
    constructor(id) {
        super(id);
        this._header = 0;
        this._tabPosition = 0;
        this._background = ''; // Override base default of white. We want tab item background to be inherited from ni-tab-control.
    }
    static get ENABLED_G_PROPERTY_NAME() {
        return 'Enabled';
    }
    static get NAME_G_PROPERTY_NAME() {
        return "Name";
    }
    static get MODEL_KIND() {
        return 'niTabItem';
    }
    get header() {
        return this._header;
    }
    set header(value) {
        this._header = value;
        this.notifyModelPropertyChanged('header');
    }
    get tabPosition() {
        return this._tabPosition;
    }
    set tabPosition(value) {
        this._tabPosition = value;
        this.notifyModelPropertyChanged('tabPosition');
    }
    gPropertyNIType(gPropertyName) {
        switch (gPropertyName) {
            case TabItemModel.ENABLED_G_PROPERTY_NAME:
                return NITypes.BOOLEAN;
            case TabItemModel.NAME_G_PROPERTY_NAME:
                return NITypes.STRING;
        }
        return super.gPropertyNIType(gPropertyName);
    }
}
NIModelProvider.registerModel(TabItemModel);
//# sourceMappingURL=niTabItemModel.js.map