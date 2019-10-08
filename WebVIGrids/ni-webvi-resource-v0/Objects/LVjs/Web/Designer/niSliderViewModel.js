//****************************************
// Slider View Model
// National Instruments Copyright 2014
//****************************************
import { LinearNumericPointerViewModel } from './niLinearNumericPointerViewModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { SliderModel } from '../Modeling/niSliderModel.js';
export class SliderViewModel extends LinearNumericPointerViewModel {
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'showTooltip':
                renderBuffer.properties.showTooltip = this.model.showTooltip;
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        this.model.showTooltip = this.element.showTooltip;
        this.model.mechanicalAction = this.element.mechanicalAction;
    }
    applyModelToElement() {
        super.applyModelToElement();
        this.element.showTooltip = this.model.showTooltip;
        this.element.mechanicalAction = this.model.mechanicalAction;
    }
}
NIModelProvider.registerViewModel(SliderViewModel, undefined, SliderModel, 'jqx-slider');
//# sourceMappingURL=niSliderViewModel.js.map