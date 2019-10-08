//****************************************
// Flexible Layout Container View Model
// National Instruments Copyright 2018
//****************************************
import { FlexibleLayoutContainerModel } from '../Modeling/niFlexibleLayoutContainerModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualViewModel } from './niVisualViewModel.js';
export class FlexibleLayoutContainerViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('direction');
        this.registerAutoSyncProperty('horizontalContentAlignment');
        this.registerAutoSyncProperty('verticalContentAlignment');
    }
    modelPropertyChanged(propertyName) {
        super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'direction':
            case 'horizontalContentAlignment':
            case 'verticalContentAlignment':
                this.model.requestSendControlBounds();
                break;
        }
    }
    shouldElementUseModelHeight() {
        return false;
    }
    shouldElementUseModelWidth() {
        return false;
    }
}
NIModelProvider.registerViewModel(FlexibleLayoutContainerViewModel, undefined, FlexibleLayoutContainerModel, 'ni-flexible-layout-container');
//# sourceMappingURL=niFlexibleLayoutContainerViewModel.js.map