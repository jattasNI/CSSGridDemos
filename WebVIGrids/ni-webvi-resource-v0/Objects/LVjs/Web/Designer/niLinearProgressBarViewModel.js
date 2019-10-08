//****************************************
// Linear Progress Bar View Model
// National Instruments Copyright 2014
//****************************************
import { LinearProgressBarModel } from '../Modeling/niLinearProgressBarModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { ProgressBarViewModel } from './niProgressBarViewModel.js';
export class LinearProgressBarViewModel extends ProgressBarViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('orientation');
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'orientation':
                renderBuffer.properties.orientation = this.model.orientation;
                if (this.model.orientation === 'vertical') {
                    renderBuffer.properties.inverted = true;
                }
                else {
                    renderBuffer.properties.inverted = false;
                }
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        this.model.orientation = this.element.orientation;
    }
    applyModelToElement() {
        super.applyModelToElement();
        this.element.orientation = this.model.orientation;
        if (this.model.orientation === 'vertical') {
            this.element.inverted = true;
        }
        else {
            this.element.inverted = false;
        }
    }
}
NIModelProvider.registerViewModel(LinearProgressBarViewModel, undefined, LinearProgressBarModel, 'jqx-progress-bar');
//# sourceMappingURL=niLinearProgressBarViewModel.js.map