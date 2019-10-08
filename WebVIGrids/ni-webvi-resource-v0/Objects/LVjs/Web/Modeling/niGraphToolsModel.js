//****************************************
// Graph Tools Model
// National Instruments Copyright 2015
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualModel } from "./niVisualModel.js";
export class GraphToolsModel extends VisualModel {
    constructor(id) {
        super(id);
        this._graphRef = '';
        this._isInEditMode = false;
        this._model = 'pan';
        this._owningControlVisible = true;
    }
    static get MODEL_KIND() {
        return 'niGraphTools';
    }
    get graphRef() {
        return this._graphRef;
    }
    set graphRef(value) {
        this._graphRef = value;
        this.notifyModelPropertyChanged('graphRef');
    }
    get isInEditMode() {
        return this._isInEditMode;
    }
    set isInEditMode(value) {
        this._isInEditMode = value;
        this.notifyModelPropertyChanged('isInEditMode');
    }
    get mode() {
        return this._mode;
    }
    set mode(value) {
        this._mode = value;
        this.notifyModelPropertyChanged('mode');
    }
    get owningControlVisible() {
        return this._owningControlVisible;
    }
    set owningControlVisible(value) {
        this._owningControlVisible = value;
        this.notifyModelPropertyChanged('owningControlVisible');
    }
}
NIModelProvider.registerModel(GraphToolsModel);
//# sourceMappingURL=niGraphToolsModel.js.map