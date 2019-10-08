//****************************************
// Front Panel View Model
// National Instruments Copyright 2018
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../Framework/niCssProperties.js';
import { ColorValueConverters as ColorHelpers } from '../Framework/ValueConverters/niColorValueConverters.js';
import { EditorInteractionStates } from '../Framework/niEditorInteractionStates.js';
import { FrontPanelModel } from '../Modeling/niFrontPanelModel.js';
import { LabVIEWPropertyError } from '../Framework/LabVIEWPropertyError.js';
import { LayoutControlViewModel } from './niLayoutControlViewModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
const USER_INTERACTION_STATE_ENUM = EditorInteractionStates.UserInteractionState;
const INTERACTIVE_OPERATION_KIND_ENUM = EditorInteractionStates.InteractiveOperationKind;
let busyElement;
export class FrontPanelViewModel extends LayoutControlViewModel {
    static get GRADIENTS_NOT_SUPPORTED_ERROR_CODE() {
        return 1702;
    }
    userInteractionChanged(newState, operationKind) {
        const isMoveOrCreate = operationKind === INTERACTIVE_OPERATION_KIND_ENUM.MOVE ||
            operationKind === INTERACTIVE_OPERATION_KIND_ENUM.CREATE;
        if (newState === USER_INTERACTION_STATE_ENUM.START) {
            if (isMoveOrCreate) {
                this.element.classList.add('ni-descendant-drag-active');
            }
        }
        else if (newState === USER_INTERACTION_STATE_ENUM.END) {
            if (isMoveOrCreate) {
                this.element.classList.remove('ni-descendant-drag-active');
            }
        }
    }
    bindToView() {
        super.bindToView();
        const that = this;
        window.addEventListener('online', function (e) {
            that.model.controlEventOccurred(FrontPanelModel.ONLINE_STATUS_CHANGED_EVENT_NAME, { "Connected?": true });
        });
        window.addEventListener('offline', function (e) {
            that.model.controlEventOccurred(FrontPanelModel.ONLINE_STATUS_CHANGED_EVENT_NAME, { "Connected?": false });
        });
    }
    async invokeInternalControlFunction(functionName, args) {
        switch (functionName) {
            case 'setBusy':
                return this.setBusy();
            case 'unsetBusy':
                return this.unsetBusy();
            default:
                super.invokeInternalControlFunction(functionName, args);
        }
    }
    /**
     * Sets the busy state on the panel. If the panel is already in busy state, it is a no-op.
     */
    setBusy() {
        if (document.body.contains(busyElement)) {
            return;
        }
        if (busyElement === undefined) {
            busyElement = document.createElement('dialog');
            // Prevent the dialog from being cancelled by pressing the escape key
            busyElement.addEventListener('cancel', (evt) => evt.preventDefault());
            busyElement.classList.add('ni-busy-state');
            window.dialogPolyfill.registerDialog(busyElement);
        }
        // Append as direct child of body due to limitations of the polyfill: https://github.com/GoogleChrome/dialog-polyfill#limitations
        document.body.appendChild(busyElement);
        busyElement.showModal();
    }
    /**
     * Unsets the busy state on the panel. If the panel is not in busy state, it is a no-op.
     */
    unsetBusy() {
        if (busyElement === undefined || !document.body.contains(busyElement)) {
            return;
        }
        busyElement.close();
        busyElement.remove();
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'maxWidth':
                renderBuffer.cssStyles[CSS_PROPERTIES.MAX_WIDTH] = this.model.maxWidth;
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        const model = this.model, element = this.element;
        const style = window.getComputedStyle(element);
        model.maxWidth = style.getPropertyValue(CSS_PROPERTIES.MAX_WIDTH);
    }
    applyModelToElement() {
        super.applyModelToElement();
        const model = this.model, element = this.element;
        element.style.setProperty(CSS_PROPERTIES.MAX_WIDTH, model.maxWidth);
    }
    shouldElementUseModelHeight() {
        return !this.model.isFlexibleLayoutRoot();
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        const model = this.model;
        switch (gPropertyName) {
            case FrontPanelModel.BACKGROUND_COLOR_G_PROPERTY_NAME:
                model.background = ColorHelpers.integerToRGBA(gPropertyValue);
                break;
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        const model = this.model;
        switch (gPropertyName) {
            case FrontPanelModel.BACKGROUND_COLOR_G_PROPERTY_NAME:
                {
                    const background = model.background;
                    if (ColorHelpers.isRGBAOrHexFormat(background)) {
                        return ColorHelpers.getIntegerValueForInputColor(background);
                    }
                    throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_WITH_GRADIENT_COLOR_NOT_SUPPORTED', gPropertyName), FrontPanelViewModel.GRADIENTS_NOT_SUPPORTED_ERROR_CODE);
                }
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
}
NIModelProvider.registerViewModel(FrontPanelViewModel, undefined, FrontPanelModel, 'ni-front-panel');
//# sourceMappingURL=niFrontPanelViewModel.js.map