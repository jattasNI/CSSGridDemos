//****************************************
// Data Grid Column
// DOM Registration: No
// National Instruments Copyright 2014
//****************************************
import { DataGrid } from './ni-data-grid.js';
import { INIDataGridColumn } from './ni-data-grid-column-interface.js';
import { NIElementRegistrationService } from '../Framework/niElementRegistrationService.js';
import { NIElementRegistrationWeightEnum } from '../Framework/niElementRegistrationWeightEnum.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { Visual } from './ni-visual.js';
import { VisualComponent } from './ni-visual-component.js';
// Static Public Variables
// None
// Static Private Reference Aliases
export class DataGridColumn extends Visual {
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    get [INIDataGridColumn.NIDatGridColumnSymbol]() {
        return true;
    }
    // Public Prototype Methods
    addAllProperties(targetPrototype) {
        super.addAllProperties(targetPrototype);
        const proto = DataGridColumn.prototype;
        proto.addProperty(targetPrototype, {
            propertyName: 'index',
            defaultValue: -1
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'header',
            defaultValue: ''
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'fieldName',
            defaultValue: ''
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'width',
            defaultValue: '50px'
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'pinned',
            defaultValue: false
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'aggregates',
            defaultValue: '{}'
        });
    }
    createdCallback() {
        super.createdCallback();
        // Public Instance Properties
        // None
        // Private Instance Properties
        this._parentDataGrid = undefined;
    }
    sendEventToParentDataGrid(name, propertyName) {
        let eventConfig;
        if (this._parentDataGrid !== undefined) {
            eventConfig = {
                cancelable: true,
                detail: {
                    element: this,
                    propertyName: propertyName
                }
            };
            this._parentDataGrid.dispatchEvent(new CustomEvent(name, eventConfig));
        }
    }
    attachedCallback() {
        const firstCall = super.attachedCallback();
        if (this.parentElement instanceof DataGrid) {
            this._parentDataGrid = this.parentElement;
            this.sendEventToParentDataGrid('ni-data-grid-column-attached');
        }
        else {
            NI_SUPPORT.error('Data Grid Column does not have a parent data grid ' + this);
            this._parentDataGrid = undefined;
        }
        return firstCall;
    }
    propertyUpdated(propertyName) {
        super.propertyUpdated(propertyName);
        this.sendEventToParentDataGrid('ni-data-grid-column-changed', propertyName);
    }
    detachedCallback() {
        super.detachedCallback();
        this.sendEventToParentDataGrid('ni-data-grid-column-detached');
        this._parentDataGrid = undefined;
    }
}
NIElementRegistrationService.registerElement(DataGridColumn, NIElementRegistrationWeightEnum.CONTAINER);
VisualComponent.defineElementInfo(DataGridColumn.prototype, 'ni-data-grid-column', 'HTMLNIDataGridColumn');
//# sourceMappingURL=ni-data-grid-column.js.map