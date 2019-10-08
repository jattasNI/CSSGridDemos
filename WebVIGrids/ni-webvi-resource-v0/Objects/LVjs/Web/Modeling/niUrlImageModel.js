//****************************************
// Url Image Model
// National Instruments Copyright 2014
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { StretchEnum as STRETCH_ENUM } from '../Elements/ni-url-image.js';
import { VisualModel } from './niVisualModel.js';
const NITypes = window.NITypes;
export class UrlImageModel extends VisualModel {
    constructor(id) {
        super(id);
        this.niType = NITypes.STRING;
        this._source = '';
        this._alternate = '';
        this._stretch = STRETCH_ENUM.UNIFORM;
    }
    static get MODEL_KIND() {
        return 'niUrlImage';
    }
    get source() {
        return this._source;
    }
    set source(value) {
        this._source = value;
        this.notifyModelPropertyChanged('source');
    }
    get alternate() {
        return this._alternate;
    }
    set alternate(value) {
        this._alternate = value;
        this.notifyModelPropertyChanged('alternate');
    }
    get stretch() {
        return this._stretch;
    }
    set stretch(value) {
        this._stretch = value;
        this.notifyModelPropertyChanged('stretch');
    }
    modelPropertyUsesNIType(propertyName) {
        return propertyName === 'source';
    }
}
NIModelProvider.registerModel(UrlImageModel);
//# sourceMappingURL=niUrlImageModel.js.map