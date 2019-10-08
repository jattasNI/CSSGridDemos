//****************************************
// Data Grid Column View Model
// National Instruments Copyright 2015
//****************************************
import { DataGridColumn } from '../Elements/ni-data-grid-column.js';
import { DataGridColumnModel } from '../Modeling/niDataGridColumnModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualComponentViewModel } from './niVisualComponentViewModel.js';
export class DataGridColumnViewModel extends VisualComponentViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('index');
        this.registerAutoSyncProperty('header');
        this.registerAutoSyncProperty('width');
        this.registerAutoSyncProperty('fieldName');
        this.registerAutoSyncProperty('pinned');
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'aggregates':
                renderBuffer.properties.aggregates = JSON.stringify(this.model.aggregates);
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        this.model.aggregates = JSON.parse(this.element.aggregates);
    }
    applyModelToElement() {
        super.applyModelToElement();
        this.element.aggregates = JSON.stringify(this.model.aggregates);
    }
}
NIModelProvider.registerViewModel(DataGridColumnViewModel, DataGridColumn, DataGridColumnModel);
//# sourceMappingURL=niDataGridColumnViewModel.js.map