//****************************************
// Cluster Model
// National Instruments Copyright 2014
//****************************************
import { LayoutControlModel } from './niLayoutControlModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
const NIType = window.NIType;
export class ClusterModel extends LayoutControlModel {
    constructor(id) {
        super(id);
        this.niType = new NIType({ name: 'Cluster', fields: [] });
        this._value = {};
    }
    static get MODEL_KIND() {
        return 'niCluster';
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.notifyModelPropertyChanged('value');
    }
    addChildModel(child) {
        child.suppressControlChanged = true;
        super.addChildModel(child);
    }
    modelPropertyUsesNIType(propertyName) {
        return propertyName === 'value';
    }
    controlChanged(newValue, oldValue) {
        this.value = newValue;
        super.controlChanged('value', newValue, oldValue);
    }
}
NIModelProvider.registerModel(ClusterModel);
//# sourceMappingURL=niClusterModel.js.map