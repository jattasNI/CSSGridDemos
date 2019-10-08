//****************************************
// Boolean Button Model
// National Instruments Copyright 2014
//****************************************
import { BooleanControlModel } from './niBooleanControlModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
export class BooleanButtonModel extends BooleanControlModel {
    constructor(id) {
        super(id);
        this._trueBackground = '';
        this._trueForeground = '';
        this._falseBackground = '';
        this._falseForeground = '';
    }
    static get MODEL_KIND() {
        return 'niBooleanButton';
    }
    get trueBackground() {
        return this._trueBackground;
    }
    set trueBackground(value) {
        this._trueBackground = value;
        this.notifyModelPropertyChanged('trueBackground');
    }
    get trueForeground() {
        return this._trueForeground;
    }
    set trueForeground(value) {
        this._trueForeground = value;
        this.notifyModelPropertyChanged('trueForeground');
    }
    get falseBackground() {
        return this._falseBackground;
    }
    set falseBackground(value) {
        this._falseBackground = value;
        this.notifyModelPropertyChanged('falseBackground');
    }
    get falseForeground() {
        return this._falseForeground;
    }
    set falseForeground(value) {
        this._falseForeground = value;
        this.notifyModelPropertyChanged('falseForeground');
    }
}
NIModelProvider.registerModel(BooleanButtonModel);
//# sourceMappingURL=niBooleanButtonModel.js.map