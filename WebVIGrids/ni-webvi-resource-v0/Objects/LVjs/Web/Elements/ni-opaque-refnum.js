//**************************************
// OpaqueRefnum Control Prototype
// DOM Registration: No
// National Instruments Copyright 2014
//**************************************
import { NIElementRegistrationService } from '../Framework/niElementRegistrationService.js';
import { Visual } from './ni-visual.js';
import { VisualComponent } from './ni-visual-component.js';
// Static Private Reference Aliases
// var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
export class OpaqueRefnum extends Visual {
}
NIElementRegistrationService.registerElement(OpaqueRefnum);
VisualComponent.defineElementInfo(OpaqueRefnum.prototype, 'ni-opaque-refnum', 'HTMLNIOpaqueRefnum');
//# sourceMappingURL=ni-opaque-refnum.js.map