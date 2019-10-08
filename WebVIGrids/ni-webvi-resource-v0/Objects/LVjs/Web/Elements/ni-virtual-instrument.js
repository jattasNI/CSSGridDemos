//****************************************
// Virtual Instrument Prototype
// DOM Registration: HTMLNIVirtualInstrument
// National Instruments Copyright 2014
//****************************************
import { NIElement } from './ni-element.js';
import { NIElementRegistrationService } from '../Framework/niElementRegistrationService.js';
import { NIElementRegistrationWeightEnum } from '../Framework/niElementRegistrationWeightEnum.js';
import { VIReferenceService as viReferenceService } from '../Framework/niVIReferenceService.js';
export class VirtualInstrument extends NIElement {
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    addAllProperties(targetPrototype) {
        super.addAllProperties(targetPrototype);
        const proto = VirtualInstrument.prototype;
        proto.addProperty(targetPrototype, {
            propertyName: 'viName',
            defaultValue: ''
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'viRef',
            defaultValue: ''
        });
    }
    attachedCallback() {
        const firstCall = super.attachedCallback();
        viReferenceService.registerVIElement(this);
        return firstCall;
    }
    detachedCallback() {
        viReferenceService.unregisterVIElement(this);
    }
}
NIElementRegistrationService.registerElement(VirtualInstrument, NIElementRegistrationWeightEnum.VI);
NIElement.defineElementInfo(VirtualInstrument.prototype, 'ni-virtual-instrument', 'HTMLNIVirtualInstrument');
//# sourceMappingURL=ni-virtual-instrument.js.map