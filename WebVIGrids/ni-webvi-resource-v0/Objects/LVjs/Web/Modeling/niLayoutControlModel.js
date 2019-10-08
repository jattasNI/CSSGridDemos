//****************************************
// Layout Control Model
// National Instruments Copyright 2018
//****************************************
import { LayoutControl } from '../Elements/ni-layout-control.js';
import { VisualModel } from './niVisualModel.js';
export class LayoutControlModel extends VisualModel {
    constructor(id) {
        super(id);
        this._layout = LAYOUTS_ENUM.ABSOLUTE;
        this._minHeight = '0px';
    }
    get layout() {
        return this._layout;
    }
    set layout(value) {
        this._layout = value;
        this.notifyModelPropertyChanged('layout');
    }
    get minHeight() {
        return this._minHeight;
    }
    set minHeight(value) {
        this._minHeight = value;
        this.notifyModelPropertyChanged('minHeight');
    }
    isAbsoluteLayoutRoot() {
        return this.layout === LAYOUTS_ENUM.ABSOLUTE;
    }
    isFlexibleLayoutRoot() {
        return this.layout === LAYOUTS_ENUM.FLEXIBLE;
    }
}
const LAYOUTS_ENUM = LayoutControl.LayoutsEnum;
//# sourceMappingURL=niLayoutControlModel.js.map