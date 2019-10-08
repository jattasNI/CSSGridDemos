//****************************************
// Layout Control
// DOM Registration: No
// National Instruments Copyright 2018
//****************************************
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { Visual } from './ni-visual.js';
const layoutsEnum = Object.freeze({
    ABSOLUTE: 'absolute',
    FLEXIBLE: 'flexible'
});
export class LayoutControl extends Visual {
    static get LayoutsEnum() {
        return layoutsEnum;
    }
    addAllProperties(targetPrototype) {
        super.addAllProperties(targetPrototype);
        const proto = LayoutControl.prototype;
        proto.addProperty(targetPrototype, {
            propertyName: 'layout',
            defaultValue: LAYOUTS_ENUM.ABSOLUTE
        });
    }
    propertyUpdated(propertyName) {
        super.propertyUpdated(propertyName);
        switch (propertyName) {
            case 'layout':
                this.updateLayoutForChildren();
                break;
            default:
                break;
        }
    }
    updateLayoutForChildren() {
        if (this.hasChildNodes()) {
            for (let i = 0; i < this.childNodes.length; ++i) {
                if (NI_SUPPORT.isElement(this.childNodes[i])) {
                    this.childNodes[i].layout = this.layout;
                }
            }
        }
    }
}
const LAYOUTS_ENUM = LayoutControl.LayoutsEnum;
//# sourceMappingURL=ni-layout-control.js.map