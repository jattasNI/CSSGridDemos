//****************************************
// Tab Item Prototype
// DOM Registration: HTMLNITabItem
// National Instruments Copyright 2014
//****************************************
import { INITabItem } from './ni-tab-item-interface.js';
import { LayoutControl } from './ni-layout-control.js';
import { NIElementRegistrationService } from '../Framework/niElementRegistrationService.js';
import { NIElementRegistrationWeightEnum } from '../Framework/niElementRegistrationWeightEnum.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { TabControl } from './ni-tab-control.js';
import { VisualComponent } from './ni-visual-component.js';
export class TabItem extends LayoutControl {
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    get [INITabItem.NITabItemSymbol]() {
        return true;
    }
    // Public Prototype Methods
    addAllProperties(targetPrototype) {
        super.addAllProperties(targetPrototype);
        const proto = TabItem.prototype;
        proto.addProperty(targetPrototype, {
            propertyName: 'tabPosition',
            defaultValue: -1
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'header',
            defaultValue: 'TabItem'
        });
    }
    createdCallback() {
        super.createdCallback();
        // Public Instance Properties
        // None
        // Private Instance Properties
        this._parentTabControl = undefined;
    }
    sendEventToParentTabControl(name) {
        let eventConfig;
        if (this._parentTabControl !== undefined) {
            eventConfig = {
                bubbles: true,
                cancelable: true,
                detail: {
                    element: this
                }
            };
            this._parentTabControl.dispatchEvent(new CustomEvent(name, eventConfig));
        }
    }
    attachedCallback() {
        const firstCall = super.attachedCallback();
        if (this.parentElement instanceof TabControl) {
            if (firstCall === true) {
                this.updateDisableStateForChild();
            }
            this._parentTabControl = this.parentElement;
            this.sendEventToParentTabControl('ni-tab-item-attached');
        }
        else {
            NI_SUPPORT.error('Tab Item does not have a parent Tab Control ' + this);
            this._parentTabControl = undefined;
        }
        return firstCall;
    }
    forceResizeChildren() {
        const children = this.children;
        if (!children) {
            return;
        }
        for (let i = 0; i < children.length; i++) {
            if (NI_SUPPORT.isElement(children[i])) {
                if (typeof children[i].forceResizeChildren === 'function') {
                    children[i].forceResizeChildren();
                }
            }
        }
    }
    propertyUpdated(propertyName) {
        super.propertyUpdated(propertyName);
        switch (propertyName) {
            case 'header':
                this.sendEventToParentTabControl('ni-tab-item-header-updated');
                break;
            case 'tabPosition':
                this.sendEventToParentTabControl('ni-tab-item-position-updated');
                break;
            case 'disabled':
                {
                    const disabledStateForChild = (this.disabled === true) ? true : this._parentTabControl.disabled;
                    this.updateDisableStateForChild(disabledStateForChild);
                    this.sendEventToParentTabControl('ni-tab-item-disabled-updated');
                    break;
                }
            default:
                break;
        }
    }
    updateDisableStateForChild(disabledState) {
        // child node of tab item is layout panel
        if (this.hasChildNodes() && NI_SUPPORT.isElement(this.childNodes[0])) {
            if (disabledState !== undefined && this.childNodes[0].disabled !== disabledState) {
                this.childNodes[0].disabled = disabledState;
            }
        }
    }
    sendEventToParentTabControlOnVisibilityUpdate() {
        this.sendEventToParentTabControl('ni-tab-item-visibility-updated');
    }
    detachedCallback() {
        super.detachedCallback();
        this.sendEventToParentTabControl('ni-tab-item-detached');
        this._parentTabControl = undefined;
    }
}
NIElementRegistrationService.registerElement(TabItem, NIElementRegistrationWeightEnum.CONTAINER);
VisualComponent.defineElementInfo(TabItem.prototype, 'ni-tab-item', 'HTMLNITabItem');
//# sourceMappingURL=ni-tab-item.js.map