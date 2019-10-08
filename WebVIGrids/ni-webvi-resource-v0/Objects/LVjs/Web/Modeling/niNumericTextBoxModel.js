//****************************************
// Numeric TextBox Model
// National Instruments Copyright 2014
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { NumericControlModel } from './niNumericControlModel.js';
export class NumericTextBoxModel extends NumericControlModel {
    constructor(id) {
        super(id);
        this._radixVisible = false;
        this._popupEnabled = false;
        this._spinButtons = false;
        this._spinButtonsPosition = 'right';
        this._textAlignment = 'right';
    }
    static get MODEL_KIND() {
        return 'niNumericTextBox';
    }
    get radixVisible() {
        return this._radixVisible;
    }
    set radixVisible(value) {
        this._radixVisible = value;
        this.notifyModelPropertyChanged('radixVisible');
    }
    get popupEnabled() {
        return this._popupEnabled;
    }
    set popupEnabled(value) {
        this._popupEnabled = value;
        this.notifyModelPropertyChanged('popupEnabled');
    }
    get spinButtons() {
        return this._spinButtons;
    }
    set spinButtons(value) {
        this._spinButtons = value;
        this.notifyModelPropertyChanged('spinButtons');
    }
    get spinButtonsPosition() {
        return this._spinButtonsPosition;
    }
    set spinButtonsPosition(value) {
        this._spinButtonsPosition = value;
        this.notifyModelPropertyChanged('spinButtonsPosition');
    }
    get textAlignment() {
        return this._textAlignment;
    }
    set textAlignment(value) {
        this._textAlignment = value;
        this.notifyModelPropertyChanged('textAlignment');
    }
}
NIModelProvider.registerModel(NumericTextBoxModel);
//# sourceMappingURL=niNumericTextBoxModel.js.map