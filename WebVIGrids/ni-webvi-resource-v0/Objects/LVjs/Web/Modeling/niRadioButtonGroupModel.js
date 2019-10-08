//****************************************
// RadioButtonGroupModel Model
// National Instruments Copyright 2015
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { NumericValueSelectorModel } from './niNumericValueSelectorModel.js';
import { ORIENTATION_ENUM } from '../Elements/ni-radio-button-group.js';
const NITypes = window.NITypes;
export class RadioButtonGroupModel extends NumericValueSelectorModel {
    constructor(id) {
        super(id);
        this._orientation = ORIENTATION_ENUM.VERTICAL;
        this._textAlignment = 'left';
        this._selectedButtonBackground = '';
        this._unselectedButtonBackground = '';
        this._textColor = '';
    }
    static get SELECTED_COLOR_G_PROPERTY_NAME() {
        return 'SelectedColor';
    }
    static get UNSELECTED_COLOR_G_PROPERTY_NAME() {
        return 'UnselectedColor';
    }
    static get MODEL_KIND() {
        return 'niRadioButtonGroup';
    }
    get orientation() {
        return this._orientation;
    }
    set orientation(value) {
        this._orientation = value;
        this.notifyModelPropertyChanged('orientation');
    }
    get textAlignment() {
        return this._textAlignment;
    }
    set textAlignment(value) {
        this._textAlignment = value;
        this.notifyModelPropertyChanged('textAlignment');
    }
    get selectedButtonBackground() {
        return this._selectedButtonBackground;
    }
    set selectedButtonBackground(value) {
        this._selectedButtonBackground = value;
        this.notifyModelPropertyChanged('selectedButtonBackground');
    }
    get unselectedButtonBackground() {
        return this._unselectedButtonBackground;
    }
    set unselectedButtonBackground(value) {
        this._unselectedButtonBackground = value;
        this.notifyModelPropertyChanged('unselectedButtonBackground');
    }
    get textColor() {
        return this._textColor;
    }
    set textColor(value) {
        this._textColor = value;
        this.notifyModelPropertyChanged('textColor');
    }
    gPropertyNIType(gPropertyName) {
        switch (gPropertyName) {
            case RadioButtonGroupModel.SELECTED_COLOR_G_PROPERTY_NAME:
            case RadioButtonGroupModel.UNSELECTED_COLOR_G_PROPERTY_NAME:
                return NITypes.UINT32;
        }
        return super.gPropertyNIType(gPropertyName);
    }
}
NIModelProvider.registerModel(RadioButtonGroupModel);
//# sourceMappingURL=niRadioButtonGroupModel.js.map