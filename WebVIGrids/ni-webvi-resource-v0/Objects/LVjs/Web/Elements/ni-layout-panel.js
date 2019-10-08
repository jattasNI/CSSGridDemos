//****************************************
// Layout Panel Prototype
// DOM Registration: HTMLNILayoutPanel
// National Instruments Copyright 2014
//****************************************
import { LayoutControl } from './ni-layout-control.js';
import { NIElementRegistrationService } from '../Framework/niElementRegistrationService.js';
import { NIElementRegistrationWeightEnum } from '../Framework/niElementRegistrationWeightEnum.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { VisualComponent } from './ni-visual-component.js';
export class LayoutPanel extends LayoutControl {
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    forceResizeChildren() {
        const children = this.children;
        for (let i = 0; i < children.length; i++) {
            if (NI_SUPPORT.isElement(children[i])) {
                if (typeof children[i].forceResize === 'function') {
                    if (children[i]._latestSize) {
                        children[i].forceResize(children[i]._latestSize);
                    }
                }
            }
        }
    }
    attachedCallback() {
        const firstCall = super.attachedCallback();
        if (firstCall === true) {
            this.updateDisableStateForChildren();
        }
        return firstCall;
    }
    propertyUpdated(propertyName) {
        super.propertyUpdated(propertyName);
        switch (propertyName) {
            case 'disabled':
                this.updateDisableStateForChildren();
                break;
            default:
                break;
        }
    }
    updateDisableStateForChildren() {
        if (this.hasChildNodes()) {
            for (let i = 0; i < this.childNodes.length; ++i) {
                if (NI_SUPPORT.isElement(this.childNodes[i])) {
                    this.childNodes[i].disabled = this.disabled;
                }
            }
        }
    }
}
NIElementRegistrationService.registerElement(LayoutPanel, NIElementRegistrationWeightEnum.CONTAINER);
VisualComponent.defineElementInfo(LayoutPanel.prototype, 'ni-layout-panel', 'HTMLNILayoutPanel');
//# sourceMappingURL=ni-layout-panel.js.map