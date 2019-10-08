//****************************************
// String Control Prototype
// DOM Registration: No
// National Instruments Copyright 2015
//****************************************
import { NIElementRegistrationService } from '../Framework/niElementRegistrationService.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { StringDisplayModeConstants } from '../Framework/Constants/niStringDisplayModeConstants.js';
import { Visual } from './ni-visual.js';
import { VisualComponent } from './ni-visual-component.js';
import { StringDisplayModeConverter as stringDisplayModeConverter } from '../Framework/ValueConverters/niStringDisplayModeConverter.js';
const textDisplayMode = StringDisplayModeConstants.TextDisplayMode;
const getTextBasedOnEscapedDisplayModeForChildElement = function (text, escapedDisplayMode) {
    return (escapedDisplayMode === textDisplayMode.ESCAPED) ? stringDisplayModeConverter.toEscapedDisplayMode(text) : text;
};
const getTextBasedOnEscapedDisplayModeForElement = function (text, escapedDisplayMode) {
    return (escapedDisplayMode === textDisplayMode.ESCAPED) ? stringDisplayModeConverter.toDefaultDisplayMode(text) : text;
};
export class StringControl extends Visual {
    addAllProperties(targetPrototype) {
        super.addAllProperties(targetPrototype);
        const proto = StringControl.prototype;
        proto.addProperty(targetPrototype, {
            propertyName: 'text',
            defaultValue: '',
            fireEvent: true,
            addNonSignalingProperty: true
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'acceptsReturn',
            defaultValue: false
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'typeToReplace',
            defaultValue: false
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'wordWrap',
            defaultValue: false
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'escapedDisplayMode',
            defaultValue: textDisplayMode.DEFAULT
        });
        NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'text', 'text', 'textNonSignaling', 'text-changed');
    }
    attachedCallback() {
        const firstCall = super.attachedCallback();
        let childElement;
        const that = this;
        /* TODO mraj should this state be cleared on each attach as is now? */
        let editingContent = false;
        if (firstCall === true) {
            childElement = document.createElement('textarea');
            childElement.classList.add('ni-text-field');
            childElement.value = getTextBasedOnEscapedDisplayModeForElement(this.text, this.escapedDisplayMode);
            childElement.readOnly = this.readOnly;
            childElement.disabled = this.disabled;
            childElement.wrap = this.wordWrap ? 'soft' : 'off';
            childElement.addEventListener('change', function () {
                const newVal = getTextBasedOnEscapedDisplayModeForElement(childElement.value, that.escapedDisplayMode);
                if (that.text !== newVal) {
                    that.text = newVal;
                }
            });
            childElement.addEventListener('click', function () {
                if (that.typeToReplace && !editingContent) {
                    editingContent = true;
                    childElement.focus();
                    childElement.select();
                }
            });
            childElement.addEventListener('blur', function () {
                const newVal = getTextBasedOnEscapedDisplayModeForElement(childElement.value, that.escapedDisplayMode);
                editingContent = false;
                if (that.text !== newVal) {
                    that.text = newVal;
                }
            });
            childElement.addEventListener('keydown', function (evt) {
                if ((that.acceptsReturn === false || evt.ctrlKey === true) && evt.keyCode === 13) {
                    childElement.blur();
                    // TODO mraj is this trying to stop propagation? we should use stopPropagation or preventDefault instead
                    return false;
                }
            });
            this.innerHTML = '';
            this.appendChild(childElement);
        }
        return firstCall;
    }
    propertyUpdated(propertyName) {
        super.propertyUpdated(propertyName);
        const childElement = this.firstElementChild;
        switch (propertyName) {
            case 'readOnly':
                childElement.readOnly = this.readOnly;
                break;
            case 'text':
                childElement.value = getTextBasedOnEscapedDisplayModeForChildElement(this.text, this.escapedDisplayMode);
                break;
            case 'wordWrap':
                childElement.wrap = this.wordWrap ? 'soft' : 'off';
                break;
            case 'disabled':
                childElement.disabled = this.disabled;
                break;
            case 'escapedDisplayMode':
                childElement.value = getTextBasedOnEscapedDisplayModeForChildElement(this.text, this.escapedDisplayMode);
                break;
        }
    }
    /**
    * Calls focus on internal input element.
    */
    focus(...args) {
        return this.querySelector('textarea').focus(...args);
    }
}
NIElementRegistrationService.registerElement(StringControl);
VisualComponent.defineElementInfo(StringControl.prototype, 'ni-string-control', 'HTMLNIStringControl');
//# sourceMappingURL=ni-string-control.js.map