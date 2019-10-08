//****************************************
// ListBox View Model
// National Instruments Copyright 2015
//****************************************
import { ListBoxValueConverter as LISTBOX_VAL_CONVERTER } from '../Framework/ValueConverters/niListBoxValueConverter.js';
import { LabVIEWPropertyError } from '../Framework/LabVIEWPropertyError.js';
import { ListBoxModel } from '../Modeling/niListBoxModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { SelectorViewModel } from './niSelectorViewModel.js';
import { VisualModel } from '../Modeling/niVisualModel.js';
import { VisualViewModel } from './niVisualViewModel.js';
// Private Static Functions
const createSelectionPostRender = function (element, selectionMode, selectedIndexes) {
    return function () {
        element._niUpdatingSelection = true;
        element.selectionMode = selectionMode;
        element.selectedIndexes = selectedIndexes;
        element._niUpdatingSelection = false;
    };
};
const createSourcePostRender = function (element, source, selectedIndexes) {
    return function () {
        element._niUpdatingSelection = true;
        element.dataSource = source;
        element.selectedIndexes = selectedIndexes;
        element._niUpdatingSelection = false;
    };
};
export class ListBoxViewModel extends SelectorViewModel {
    getReadOnlyPropertyName() {
        return 'readonly';
    }
    bindToView() {
        super.bindToView();
        const that = this;
        that.enableResizeHack();
        that.element.addEventListener('change', function () {
            if (that.element._niUpdatingSelection || that.model.readOnly === true) {
                return;
            }
            const newValue = LISTBOX_VAL_CONVERTER.convertBack(that.element.selectedIndexes, that.model.selectionMode);
            that.model.controlChanged(newValue);
        });
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'selectionMode':
            case 'selectedIndexes':
                {
                    const selectionMode = LISTBOX_VAL_CONVERTER.convertNIToJQXSelectionMode(this.model.selectionMode);
                    const selectedIndexes = LISTBOX_VAL_CONVERTER.convert(this.model.selectedIndexes, this.model.selectionMode);
                    renderBuffer.postRender.selection = createSelectionPostRender(this.element, selectionMode, selectedIndexes);
                }
                break;
            case 'niType':
                renderBuffer.properties.niType = this.model.getNITypeString();
                break;
            case 'source':
                {
                    const selectedIndexes = LISTBOX_VAL_CONVERTER.convert(this.model.selectedIndexes, this.model.selectionMode);
                    renderBuffer.postRender.source = createSourcePostRender(this.element, this.model.source, selectedIndexes);
                }
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        this.model.selectionMode = LISTBOX_VAL_CONVERTER.convertJQXToNISelectionMode(this.element.selectionMode);
        const selectedIndexes = LISTBOX_VAL_CONVERTER.convertBack(this.element.selectedIndexes, this.model.selectionMode);
        const niType = this.element.getAttribute('ni-type');
        this.model.niType = new window.NIType(niType);
        this.model.selectedIndexes = selectedIndexes;
        this.model.defaultValue = selectedIndexes;
        let source = this.element.dataSource;
        if (typeof source === 'string') {
            source = JSON.parse(source);
        }
        this.model.source = source;
    }
    applyModelToElement() {
        super.applyModelToElement();
        this.element.niType = this.model.getNITypeString();
        this.element.selectionMode = LISTBOX_VAL_CONVERTER.convertNIToJQXSelectionMode(this.model.selectionMode);
        this.element.selectedIndexes = LISTBOX_VAL_CONVERTER.convert(this.model.selectedIndexes, this.model.selectionMode);
        this.element.dataSource = this.model.source;
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        const model = this.model;
        switch (gPropertyName) {
            case VisualModel.VALUE_G_PROPERTY_NAME:
                model.selectedIndexes = gPropertyValue;
                break;
            case VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME:
                model.controlChanged(gPropertyValue);
                break;
            case ListBoxModel.TOP_VISIBLE_ROW_G_PROPERTY_NAME:
                {
                    const numberOfItemsInListBox = this.element.items.length;
                    if (gPropertyValue >= 0 && gPropertyValue < numberOfItemsInListBox) {
                        this.element.topVisibleIndex = gPropertyValue;
                    }
                    else {
                        throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', gPropertyName, numberOfItemsInListBox - 1), VisualViewModel.INVALID_PROPERTY_VALUE_ERROR_CODE);
                    }
                }
                break;
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        const model = this.model;
        switch (gPropertyName) {
            case VisualModel.VALUE_G_PROPERTY_NAME:
                return model.selectedIndexes;
            case ListBoxModel.TOP_VISIBLE_ROW_G_PROPERTY_NAME:
                return this.element.topVisibleIndex;
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
}
NIModelProvider.registerViewModel(ListBoxViewModel, undefined, ListBoxModel, 'jqx-list-box');
//# sourceMappingURL=niListBoxViewModel.js.map