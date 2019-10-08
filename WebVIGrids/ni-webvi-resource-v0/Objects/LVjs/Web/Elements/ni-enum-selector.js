//****************************************
// EnumSelector Prototype
// DOM Registration: No
// National Instruments Copyright 2015
//****************************************
import { NIElementRegistrationService } from '../Framework/niElementRegistrationService.js';
import { NumericValueSelector } from './ni-numeric-value-selector.js';
import { VisualComponent } from './ni-visual-component.js';
// Static Private Reference Aliases
const $ = NationalInstruments.Globals.jQuery;
// Static Private Variables
// None
// Static Private Functions
// None
// Public Prototype Methods
export class EnumSelector extends NumericValueSelector {
    createdCallback() {
        super.createdCallback();
        // Prevent internal JQX change events from bubbling up out of the control
        this.addEventListener('change', function (event) {
            event.stopImmediatePropagation();
        });
    }
    attachedCallback() {
        const firstCall = super.attachedCallback(), that = this;
        if (firstCall === true) {
            const dropDownChildElement = document.createElement('jqx-drop-down-list');
            this.innerHTML = '';
            const data = this.getSourceAndSelectedIndexFromSource();
            const selectedIndex = data.selectedIndex === -1 ? [0] : [data.selectedIndex];
            dropDownChildElement.setAttribute('data-source', JSON.stringify(data.source));
            dropDownChildElement.setAttribute('selected-indexes', JSON.stringify(selectedIndex));
            dropDownChildElement.setAttribute('drop-down-height', 'auto');
            dropDownChildElement.setAttribute('selection-mode', 'one');
            dropDownChildElement.disabled = this.disabled;
            if (this.readOnly === true) {
                dropDownChildElement.setAttribute('readonly', 'true');
            }
            dropDownChildElement.setAttribute('drop-down-open-mode', this.popupEnabled ? 'default' : 'none');
            dropDownChildElement.addEventListener('change', function (event) {
                const args = event.detail;
                if (args && !that._itemsUpdating) {
                    const displayValue = args.value;
                    that.selectChangedHandler(displayValue);
                }
            });
            // Attach after all attributes are set to prevent early value change events
            this.appendChild(dropDownChildElement);
            this.setDisabledIndexes(dropDownChildElement);
        }
        return firstCall;
    }
    forceResize(size) {
        super.forceResize(size);
        $(this.firstElementChild).width(size.width);
        $(this.firstElementChild).height(size.height);
    }
    propertyUpdated(propertyName) {
        super.propertyUpdated(propertyName);
        switch (propertyName) {
            case 'items':
            case 'value':
            case 'readOnly':
                this.propertyUpdatedHelper(propertyName, this.firstElementChild, false);
                if (this.itemsArray.length > 0 && this.value === -1) {
                    this.firstElementChild.selectedIndexes = [0];
                }
                break;
            case 'disabled':
                this.propertyUpdatedHelper(propertyName, this.firstElementChild, false);
                break;
            case 'disabledIndexes':
                this.propertyUpdatedHelper(propertyName, this.firstElementChild, false);
                break;
            default:
                break;
        }
    }
    /**
    * Calls focus on jqx-drop-down-list input element.
    */
    focus(...args) {
        return this.querySelector('jqx-drop-down-list').focus(...args);
    }
}
NIElementRegistrationService.registerElement(EnumSelector);
VisualComponent.defineElementInfo(EnumSelector.prototype, 'ni-enum-selector', 'HTMLNIEnumSelector');
//# sourceMappingURL=ni-enum-selector.js.map