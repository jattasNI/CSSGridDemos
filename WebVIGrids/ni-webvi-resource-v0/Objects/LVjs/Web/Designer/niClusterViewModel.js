//****************************************
// Cluster View Model
// National Instruments Copyright 2014
//****************************************
import { Cluster } from '../Elements/ni-cluster.js';
import { ClusterModel } from '../Modeling/niClusterModel.js';
import { EditorInteractionStates as INTERACTIVE_OPERATION_KIND_ENUM } from '../Framework/niEditorInteractionStates.js';
import { LayoutControlViewModel } from './niLayoutControlViewModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { RenderEngine } from '../Framework/niRenderEngine.js';
import { VisualModel } from '../Modeling/niVisualModel.js';
export class ClusterViewModel extends LayoutControlViewModel {
    // Public Prototype Methods
    bindToView() {
        super.bindToView();
        const that = this;
        that.element.addEventListener('value-changed', function (evt) {
            let newValue, oldValue;
            if (evt.target === that.element) {
                newValue = evt.detail.newValue;
                oldValue = evt.detail.oldValue;
                that.model.controlChanged(newValue, oldValue);
            }
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
    userInteractionChanged(newState, operationKind) {
        super.userInteractionChanged(newState, operationKind);
        const isMoveOrCreate = operationKind === INTERACTIVE_OPERATION_KIND_ENUM.MOVE ||
            operationKind === INTERACTIVE_OPERATION_KIND_ENUM.CREATE;
        if (isMoveOrCreate) {
            const renderBuffer = RenderEngine.getOrAddRenderBuffer(this.element);
            const modelBounds = this.getModelBounds();
            this.setWidthAndHeightToRenderBuffer(modelBounds, renderBuffer);
            this.setPositionToRenderBuffer(modelBounds, renderBuffer);
        }
    }
}
NIModelProvider.registerViewModel(ClusterViewModel, Cluster, ClusterModel);
//# sourceMappingURL=niClusterViewModel.js.map