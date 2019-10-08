//****************************************
// Radial Numeric Pointer Model
// National Instruments Copyright 2014
//****************************************
import { NumericPointerModel } from './niNumericPointerModel.js';
export class RadialNumericPointerModel extends NumericPointerModel {
    constructor(id) {
        super(id);
        this._scaleArc = {
            startAngle: 0,
            sweepAngle: 180
        };
    }
    get scaleArc() {
        return this._scaleArc;
    }
    set scaleArc(value) {
        this._scaleArc = value;
        this.notifyModelPropertyChanged('scaleArc');
    }
}
//# sourceMappingURL=niRadialNumericPointerModel.js.map