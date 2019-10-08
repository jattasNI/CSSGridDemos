//****************************************
// ListBox Model
// National Instruments Copyright 2015
//****************************************
import { NIListBox } from '../Framework/niListBoxSelectionMode.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { SelectorModel } from './niSelectorModel.js';
const SELECTION_MODE_ENUM = NIListBox.SelectionModeEnum;
const NITypes = window.NITypes;
export class ListBoxModel extends SelectorModel {
    constructor(id) {
        super(id);
        this.niType = NITypes.INT32;
        this._selectionMode = SELECTION_MODE_ENUM.ONE;
        this._selectedIndexes = -1;
    }
    static get TOP_VISIBLE_ROW_G_PROPERTY_NAME() {
        return "TopVisibleRow";
    }
    static get MODEL_KIND() {
        return 'niListBox';
    }
    get selectionMode() {
        return this._selectionMode;
    }
    set selectionMode(value) {
        this._selectionMode = value;
        this.notifyModelPropertyChanged('selectionMode');
    }
    get selectedIndexes() {
        return this._selectedIndexes;
    }
    set selectedIndexes(value) {
        this._selectedIndexes = value;
        this.notifyModelPropertyChanged('selectedIndexes');
    }
    modelPropertyUsesNIType(propertyName) {
        return propertyName === 'selectedIndexes';
    }
    controlChanged(newValue) {
        const oldValue = this.selectedIndexes;
        this.selectedIndexes = newValue;
        super.controlChanged('selectedIndexes', newValue, oldValue);
    }
    gPropertyNIType(gPropertyName) {
        switch (gPropertyName) {
            case ListBoxModel.TOP_VISIBLE_ROW_G_PROPERTY_NAME:
                return NITypes.UINT32;
        }
        return super.gPropertyNIType(gPropertyName);
    }
}
NIModelProvider.registerModel(ListBoxModel);
//# sourceMappingURL=niListBoxModel.js.map