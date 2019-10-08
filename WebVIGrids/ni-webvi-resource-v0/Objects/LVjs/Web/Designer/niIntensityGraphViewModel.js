//****************************************
// IntensityGraph View Model
// National Instruments Copyright 2015
//****************************************
import { GraphBaseViewModel } from './niGraphBaseViewModel.js';
import { IntensityGraphModel } from '../Modeling/niIntensityGraphModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
export class IntensityGraphViewModel extends GraphBaseViewModel {
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        const that = this;
        switch (propertyName) {
            case 'value':
                renderBuffer.postRender.value = function () {
                    that.element.setData(that.model.value);
                };
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        const element = this.element, model = this.model;
        model.value = element.value;
        model.defaultValue = element.value;
    }
    applyModelToElement() {
        super.applyModelToElement();
        const element = this.element, model = this.model;
        element.value = model.value;
    }
}
NIModelProvider.registerViewModel(IntensityGraphViewModel, undefined, IntensityGraphModel, 'ni-intensity-graph');
//# sourceMappingURL=niIntensityGraphViewModel.js.map