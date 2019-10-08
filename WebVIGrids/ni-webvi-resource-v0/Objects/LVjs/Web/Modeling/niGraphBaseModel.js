//****************************************
// Graph Base Model
// National Instruments Copyright 2014
//****************************************
import { VisualModel } from './niVisualModel.js';
const NIType = window.NIType;
const NITypeNames = window.NITypeNames;
export class GraphBaseModel extends VisualModel {
    constructor(id) {
        super(id);
        this.niType = new NIType({ name: NITypeNames.ARRAY, rank: 1, subtype: NITypeNames.DOUBLE });
        this._value = [];
        this._plotAreaMargin = '';
        this._metadataOverridesPlotNames = true;
        this._graphRef = '';
        this._activeCursor = 0;
        this._activeXScale = 0;
        this._activeYScale = 0;
        this._activePlot = 0;
    }
    static get ACTIVE_CURSOR_G_PROPERTY_NAME() {
        return 'ActiveCursor';
    }
    static get ACTIVE_PLOT_G_PROPERTY_NAME() {
        return 'ActivePlot';
    }
    static get ACTIVE_X_SCALE_G_PROPERTY_NAME() {
        return 'ActiveXScale';
    }
    static get ACTIVE_Y_SCALE_G_PROPERTY_NAME() {
        return 'ActiveYScale';
    }
    static get CURSOR_G_PROPERTY_NAME() {
        return 'Cursor';
    }
    static get PLOT_G_PROPERTY_NAME() {
        return "Plot";
    }
    static get X_SCALE_G_PROPERTY_NAME() {
        return "XScale";
    }
    static get Y_SCALE_G_PROPERTY_NAME() {
        return "YScale";
    }
    get activeCursor() {
        return this._activeCursor;
    }
    set activeCursor(value) {
        this._activeCursor = value;
    }
    get activePlot() {
        return this._activePlot;
    }
    set activePlot(value) {
        this._activePlot = value;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = (typeof value === 'string') ? JSON.parse(value) : value;
        this.notifyModelPropertyChanged('value');
    }
    get plotAreaMargin() {
        return this._plotAreaMargin;
    }
    set plotAreaMargin(value) {
        this._plotAreaMargin = value;
        this.notifyModelPropertyChanged('plotAreaMargin');
    }
    get metadataOverridesPlotNames() {
        return this._metadataOverridesPlotNames;
    }
    set metadataOverridesPlotNames(value) {
        this._metadataOverridesPlotNames = value;
        this.notifyModelPropertyChanged('metadataOverridesPlotNames');
    }
    get graphRef() {
        return this._graphRef;
    }
    set graphRef(value) {
        this._graphRef = value;
        this.notifyModelPropertyChanged('graphRef');
    }
    get activeXScale() {
        return this._activeXScale;
    }
    set activeXScale(value) {
        this._activeXScale = value;
    }
    get activeYScale() {
        return this._activeYScale;
    }
    set activeYScale(value) {
        this._activeYScale = value;
    }
    static get XSCALE_RUNTIME_ID() {
        return "XScale_RuntimeId";
    }
    static get YSCALE_RUNTIME_ID() {
        return "YScale_RuntimeId";
    }
    modelPropertyUsesNIType(propertyName) {
        return propertyName === 'value';
    }
    controlChanged(newValue) {
        const oldValue = this.value;
        this.value = newValue;
        super.controlChanged('value', newValue, oldValue);
    }
    gPropertyNIType(gPropertyName) {
        switch (gPropertyName) {
            case GraphBaseModel.ACTIVE_CURSOR_G_PROPERTY_NAME:
            case GraphBaseModel.ACTIVE_PLOT_G_PROPERTY_NAME:
            case GraphBaseModel.ACTIVE_X_SCALE_G_PROPERTY_NAME:
            case GraphBaseModel.ACTIVE_Y_SCALE_G_PROPERTY_NAME:
            case GraphBaseModel.XSCALE_RUNTIME_ID:
            case GraphBaseModel.YSCALE_RUNTIME_ID:
                return window.NITypes.INT32;
            default:
                return super.gPropertyNIType(gPropertyName);
        }
    }
}
//# sourceMappingURL=niGraphBaseModel.js.map