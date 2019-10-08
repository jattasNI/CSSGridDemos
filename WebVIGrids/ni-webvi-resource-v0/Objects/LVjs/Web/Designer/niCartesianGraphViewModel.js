//****************************************
// CartesianGraph View Model
// National Instruments Copyright 2015
//****************************************
import { CartesianGraphModel } from "../Modeling/niCartesianGraphModel.js";
import { GraphBaseViewModel } from './niGraphBaseViewModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
export class CartesianGraphViewModel extends GraphBaseViewModel {
    // Public Prototype Methods
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
        this.model.value = this.element.value;
        this.model.defaultValue = this.element.value;
        this.model.plotAreaMargin = this.element.plotAreaMargin;
    }
    applyModelToElement() {
        super.applyModelToElement();
        this.element.value = this.model.value;
        this.element.plotAreaMargin = this.model.plotAreaMargin;
    }
}
NIModelProvider.registerViewModel(CartesianGraphViewModel, null, CartesianGraphModel, 'ni-cartesian-graph');
//# sourceMappingURL=niCartesianGraphViewModel.js.map