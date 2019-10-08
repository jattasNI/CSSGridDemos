//****************************************
// Front Panel Custom Element
// DOM Registration: No
// National Instruments Copyright 2018
//****************************************
import { LayoutControl } from './ni-layout-control.js';
import { NIElementRegistrationService } from '../Framework/niElementRegistrationService.js';
import { NIElementRegistrationWeightEnum } from '../Framework/niElementRegistrationWeightEnum.js';
import { VisualComponent } from './ni-visual-component.js';
export class FrontPanel extends LayoutControl {
}
NIElementRegistrationService.registerElement(FrontPanel, NIElementRegistrationWeightEnum.CONTAINER);
VisualComponent.defineElementInfo(FrontPanel.prototype, 'ni-front-panel', 'HTMLNIFrontPanel');
//# sourceMappingURL=ni-front-panel.js.map