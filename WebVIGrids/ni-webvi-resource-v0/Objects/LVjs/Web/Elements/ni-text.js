//****************************************
// Text Prototype
// DOM Registration: No
// National Instruments Copyright 2015
//****************************************
import { NIElementRegistrationService } from '../Framework/niElementRegistrationService.js';
import { Visual } from './ni-visual.js';
import { VisualComponent } from './ni-visual-component.js';
// Static Public Variables
// None
// Static Private Reference Aliases
// var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
export class Text extends Visual {
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    addAllProperties(targetPrototype) {
        super.addAllProperties(targetPrototype);
        const proto = Text.prototype;
        proto.addProperty(targetPrototype, {
            propertyName: 'text',
            defaultValue: ''
        });
    }
    attachedCallback() {
        const firstCall = super.attachedCallback();
        let divTag;
        if (firstCall === true) {
            divTag = document.createElement('div');
            divTag.textContent = this.text;
            this.appendChild(divTag);
        }
        return firstCall;
    }
    propertyUpdated(propertyName) {
        super.propertyUpdated(propertyName);
        const divElement = this.firstElementChild;
        switch (propertyName) {
            case 'text':
                divElement.textContent = this.text;
                break;
            default:
                break;
        }
    }
}
NIElementRegistrationService.registerElement(Text);
VisualComponent.defineElementInfo(Text.prototype, 'ni-text', 'HTMLNIText');
//# sourceMappingURL=ni-text.js.map