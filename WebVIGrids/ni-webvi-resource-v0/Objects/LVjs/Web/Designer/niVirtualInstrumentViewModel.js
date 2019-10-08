//****************************************
// Virtual Instrument View Model
// National Instruments Copyright 2014
//****************************************
import { EditorInteractionStates } from '../Framework/niEditorInteractionStates.js';
import { NIViewModel } from './niViewModel.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { VirtualInstrument } from '../Elements/ni-virtual-instrument.js';
import { VirtualInstrumentModel } from '../Modeling/niVirtualInstrumentModel.js';
import { VisualComponentModel } from '../Modeling/niVisualComponentModel.js';
import { VisualComponentViewModel } from './niVisualComponentViewModel.js';
import { VisualViewModel } from './niVisualViewModel.js';
// Static Private Variables
const USER_INTERACTION_STATE_ENUM = EditorInteractionStates.UserInteractionState;
const INTERACTIVE_OPERATION_KIND_ENUM = EditorInteractionStates.InteractiveOperationKind;
export class VirtualInstrumentViewModel extends NIViewModel {
    constructor(element, model) {
        super(element, model);
        if (this.model instanceof VirtualInstrumentModel === false) {
            throw new Error(NI_SUPPORT.i18n('msg_INVALID_VI_MODEL'));
        }
        if (this.element instanceof VirtualInstrument === false) {
            throw new Error(NI_SUPPORT.i18n('msg_INVALID_ELEMENT'));
        }
        // Public Instance Properties
        // None
        // Private Instance Properties
        this._userInteracting = {};
    }
    // NOTE: SHOULD NOT BE CALLED DIRECTLY, USED BY niElementExtensions
    // This is called after niVirtualInstrumentModel.addFrontPanelControlModel, so the Model and ViewModel are already created
    addFrontPanelControlViewModel(controlViewModel) {
        if (controlViewModel instanceof VisualComponentViewModel === false) {
            throw new Error('Only Visual Component ViewModels can be registered to a Virtual Instrument View Model');
        }
        const parentModel = controlViewModel.model.getOwner();
        if (parentModel instanceof VisualComponentModel) {
            this.model.getControlViewModel(parentModel.niControlId).onChildViewModelAdded(controlViewModel);
        }
        // Check our cache of controls in a user interaction, and notify the new view model if necessary.
        // This happens when reparenting controls, we only get a interaction start at the beginning of a drag operation.
        if (controlViewModel instanceof VisualViewModel) {
            if (this.isUserInteracting(controlViewModel.model.niControlId)) {
                controlViewModel.userInteractionChanged(USER_INTERACTION_STATE_ENUM.START, INTERACTIVE_OPERATION_KIND_ENUM.MOVE);
            }
        }
    }
    // NOTE: SHOULD NOT BE CALLED DIRECTLY, USED BY niElementExtensions
    removeFrontPanelControlViewModel(controlViewModel) {
        let parentViewModel;
        if (controlViewModel instanceof VisualComponentViewModel === false) {
            throw new Error('Only Visual Component ViewModels can be registered to a Virtual Instrument View Model');
        }
        const parentModel = controlViewModel.model.getOwner();
        if (parentModel instanceof VisualComponentModel) {
            parentViewModel = this.model.getControlViewModel(parentModel.niControlId);
            if (parentViewModel instanceof VisualComponentViewModel) {
                this.model.getControlViewModel(parentModel.niControlId).onChildViewModelRemoved(controlViewModel);
            }
        }
    }
    attachElementToModelAndViewModel(element) {
        const controlModelViewModel = this.model.addFrontPanelControlModel(element);
        this.addFrontPanelControlViewModel(controlModelViewModel.controlViewModel);
        return controlModelViewModel;
    }
    detachElementFromModelAndViewModel(element) {
        const elementViewModel = this.model.getControlViewModel(element.niControlId);
        this.removeFrontPanelControlViewModel(elementViewModel);
        this.model.removeFrontPanelControl(element);
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        this.model.viName = this.element.viName;
        this.model.viRef = this.element.viRef;
    }
    // Called from userInteractionChanged in niEditorUpdateService.
    // We're keeping this state here instead of in the control view models, because
    // 'user interacting' operations (drag, etc.) can last longer than the control
    // view model does, in the reparenting case.
    // We're assuming that control IDs don't change during a user interaction /
    // transacted event on a control.
    setUserInteracting(niControlId) {
        this._userInteracting[niControlId] = true;
    }
    // Called from userInteractionChanged in niEditorUpdateService
    clearUserInteracting(niControlId) {
        this._userInteracting[niControlId] = undefined;
    }
    isUserInteracting(niControlId) {
        return this._userInteracting[niControlId] === true;
    }
}
//# sourceMappingURL=niVirtualInstrumentViewModel.js.map