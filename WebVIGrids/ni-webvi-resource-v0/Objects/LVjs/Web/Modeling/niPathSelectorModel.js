//****************************************
// Path Selector Control Model
// National Instruments Copyright 2015
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { PATH_TYPE_ENUM } from '../Elements/ni-path-selector.js';
import { VisualModel } from './niVisualModel.js';
const NITypes = window.NITypes;
export class PathSelectorModel extends VisualModel {
    constructor(id) {
        super(id);
        this.niType = NITypes.PATH;
        this._path = { components: [], type: PATH_TYPE_ENUM.ABSOLUTE };
        this._format = 'windows';
        this._popupEnabled = false;
        this._textAlignment = 'left';
    }
    static get MODEL_KIND() {
        return 'niPathSelector';
    }
    get path() {
        return this._path;
    }
    set path(value) {
        this._path = value;
        this.notifyModelPropertyChanged('path');
    }
    get format() {
        return this._format;
    }
    set format(value) {
        this._format = value;
        this.notifyModelPropertyChanged('format');
    }
    get popupEnabled() {
        return this._popupEnabled;
    }
    set popupEnabled(value) {
        this._popupEnabled = value;
        this.notifyModelPropertyChanged('popupEnabled');
    }
    get textAlignment() {
        return this._textAlignment;
    }
    set textAlignment(value) {
        this._textAlignment = value;
        this.notifyModelPropertyChanged('textAlignment');
    }
    modelPropertyUsesNIType(propertyName) {
        return propertyName === 'path';
    }
    controlChanged(newValue) {
        const oldValue = this.path;
        this.path = newValue;
        super.controlChanged('path', newValue, oldValue);
    }
}
NIModelProvider.registerModel(PathSelectorModel);
//# sourceMappingURL=niPathSelectorModel.js.map