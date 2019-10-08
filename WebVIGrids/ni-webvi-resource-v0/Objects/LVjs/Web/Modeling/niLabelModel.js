//****************************************
// Label Model
// National Instruments Copyright 2015
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualModel } from './niVisualModel.js';
const NITypes = window.NITypes;
export class LabelModel extends VisualModel {
    constructor(id) {
        super(id);
        this._text = '';
        this._owningControlVisible = true;
    }
    static get TEXT_G_PROPERTY_NAME() {
        return "Text";
    }
    static get MODEL_KIND() {
        return 'niLabel';
    }
    get text() {
        return this._text;
    }
    set text(value) {
        this._text = value;
        this.notifyModelPropertyChanged('text');
    }
    get owningControlVisible() {
        return this._owningControlVisible;
    }
    set owningControlVisible(value) {
        this._owningControlVisible = value;
        this.notifyModelPropertyChanged('owningControlVisible');
    }
    gPropertyNIType(gPropertyName) {
        switch (gPropertyName) {
            case LabelModel.TEXT_G_PROPERTY_NAME:
                return NITypes.STRING;
        }
        return super.gPropertyNIType(gPropertyName);
    }
}
NIModelProvider.registerModel(LabelModel);
//# sourceMappingURL=niLabelModel.js.map