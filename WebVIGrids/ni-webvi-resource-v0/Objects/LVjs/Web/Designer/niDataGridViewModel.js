//****************************************
// Data Grid View Model
// National Instruments Copyright 2015
//****************************************
import { DataGrid } from '../Elements/ni-data-grid.js';
import { DataGridModel } from '../Modeling/niDataGridModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualModel } from '../Modeling/niVisualModel.js';
import { VisualViewModel } from './niVisualViewModel.js';
export class DataGridViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('rowHeaderVisible');
        this.registerAutoSyncProperty('columnHeaderVisible');
        this.registerAutoSyncProperty('showAddRowsToolBar');
        this.registerAutoSyncProperty('allowSorting');
        this.registerAutoSyncProperty('allowPaging');
        this.registerAutoSyncProperty('allowFiltering');
        this.registerAutoSyncProperty('allowGrouping');
        this.registerAutoSyncProperty('rowHeight');
        this.registerAutoSyncProperty('altRowColors');
        this.registerAutoSyncProperty('altRowStart');
        this.registerAutoSyncProperty('altRowStep');
        this.registerAutoSyncProperty('isInEditMode');
        this.registerAutoSyncProperty('selectedColumn');
    }
    bindToView() {
        super.bindToView();
        const that = this;
        that.enableResizeHack();
        that.bindFocusEventListener();
        that.element.addEventListener('value-changed', function (event) {
            let newValue, oldValue;
            if (event.currentTarget === event.target) { // our value changed event bubbles - here we only care about the data grid, not the template controls
                newValue = event.detail.newValue;
                oldValue = event.detail.oldValue;
                that.model.controlChanged(newValue, oldValue);
            }
        });
        that.element.addEventListener('selected-column-changed', function (event) {
            that.model.internalControlEventOccurred('DataGridSelectedIndexChanged', event.detail.selectedColumn);
        });
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'value':
                renderBuffer.properties.valueNonSignaling = this.model.value;
                break;
            case 'niType':
                renderBuffer.properties.niType = this.model.getNITypeString();
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        this.model.niType = new window.NIType(this.element.niType);
        this.model.value = this.element.value;
    }
    applyModelToElement() {
        super.applyModelToElement();
        this.element.niType = this.model.getNITypeString();
        this.element.valueNonSignaling = this.model.value;
    }
    async invokeInternalControlFunction(functionName, args) {
        switch (functionName) {
            case 'getColumnWidths':
                return this.element.getColumnWidths();
        }
        super.invokeInternalControlFunction(functionName, args);
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        const model = this.model;
        switch (gPropertyName) {
            case VisualModel.VALUE_G_PROPERTY_NAME:
                model.value = gPropertyValue;
                break;
            case VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME:
                {
                    const oldValue = model.value;
                    model.controlChanged(gPropertyValue, oldValue);
                    break;
                }
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        const model = this.model;
        switch (gPropertyName) {
            case VisualModel.VALUE_G_PROPERTY_NAME:
                return model.value;
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
}
NIModelProvider.registerViewModel(DataGridViewModel, DataGrid, DataGridModel);
//# sourceMappingURL=niDataGridViewModel.js.map