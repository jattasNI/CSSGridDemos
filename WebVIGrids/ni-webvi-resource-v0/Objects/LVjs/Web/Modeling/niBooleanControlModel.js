//****************************************
// Boolean Control Model
// National Instruments Copyright 2014
//****************************************
import { VisualModel } from './niVisualModel.js';
const NITypes = window.NITypes;
const NIType = window.NIType;
const NITypeNames = window.NITypeNames;
const _clickModeEnum = Object.freeze({
    PRESS: 'press',
    RELEASE: 'release'
});
const stringArrayNIType = new NIType({ name: NITypeNames.ARRAY, rank: 1, subtype: { name: NITypeNames.STRING } });
export class BooleanControlModel extends VisualModel {
    constructor(id) {
        super(id);
        this.niType = NITypes.BOOLEAN;
        this._value = false;
        this._contentVisible = false;
        this._content = 'Button';
        this._clickMode = BooleanControlModel.ClickModeEnum.RELEASE;
        this._momentary = false;
    }
    static get TRUE_COLOR_G_PROPERTY_NAME() {
        return 'TrueColor';
    }
    static get FALSE_COLOR_G_PROPERTY_NAME() {
        return 'FalseColor';
    }
    static get TEXT_G_PROPERTY_NAME() {
        return "Text";
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.notifyModelPropertyChanged('value');
    }
    get contentVisible() {
        return this._contentVisible;
    }
    set contentVisible(value) {
        this._contentVisible = value;
        this.notifyModelPropertyChanged('contentVisible');
    }
    get content() {
        return this._content;
    }
    set content(value) {
        this._content = value;
        this.notifyModelPropertyChanged('content');
    }
    get clickMode() {
        return this._clickMode;
    }
    set clickMode(value) {
        this._clickMode = value;
        this.notifyModelPropertyChanged('clickMode');
    }
    get momentary() {
        return this._momentary;
    }
    set momentary(value) {
        this._momentary = value;
        this.notifyModelPropertyChanged('momentary');
    }
    static get ClickModeEnum() {
        return _clickModeEnum;
    }
    modelPropertyUsesNIType(propertyName) {
        return propertyName === 'value';
    }
    gPropertyNIType(gPropertyName) {
        switch (gPropertyName) {
            case BooleanControlModel.TRUE_COLOR_G_PROPERTY_NAME:
            case BooleanControlModel.FALSE_COLOR_G_PROPERTY_NAME:
                return NITypes.UINT32;
            case BooleanControlModel.TEXT_G_PROPERTY_NAME:
                return stringArrayNIType;
        }
        return super.gPropertyNIType(gPropertyName);
    }
    controlChanged(newValue) {
        const oldValue = this.value;
        this.value = newValue;
        super.controlChanged('value', newValue, oldValue);
    }
}
//# sourceMappingURL=niBooleanControlModel.js.map