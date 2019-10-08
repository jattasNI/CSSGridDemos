//****************************************
// Layout Control View Model
// National Instruments Copyright 2018
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../Framework/niCssProperties.js';
import { VisualViewModel } from './niVisualViewModel.js';
export class LayoutControlViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('layout');
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'minHeight':
                this.model.requestSendControlBounds();
                renderBuffer.cssStyles[CSS_PROPERTIES.MIN_HEIGHT] = this.model.minHeight;
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        const style = window.getComputedStyle(this.element);
        this.model.minHeight = style.getPropertyValue(CSS_PROPERTIES.MIN_HEIGHT);
    }
    applyModelToElement() {
        super.applyModelToElement();
        this.element.style.setProperty(CSS_PROPERTIES.MIN_HEIGHT, this.model.minHeight);
    }
}
//# sourceMappingURL=niLayoutControlViewModel.js.map