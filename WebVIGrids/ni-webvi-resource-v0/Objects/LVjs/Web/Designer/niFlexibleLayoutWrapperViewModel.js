//****************************************
// Flexible Layout Wrapper View Model
// National Instruments Copyright 2018
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../Framework/niCssProperties.js';
import { FlexibleLayoutWrapperModel } from '../Modeling/niFlexibleLayoutWrapperModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { JQXNumericValueConverter as NUM_VAL_CONVERTER } from '../Framework/ValueConverters/niJQXNumericValueConverter.js';
import { VisualViewModel } from './niVisualViewModel.js';
export class FlexibleLayoutWrapperViewModel extends VisualViewModel {
    modelPropertyChanged(propertyName) {
        const model = this.model;
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'flexGrow':
                renderBuffer.cssStyles[CSS_PROPERTIES.FLEX_GROW] = NUM_VAL_CONVERTER.convert(model.flexGrow);
                this.model.requestSendControlBounds();
                break;
        }
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        const style = window.getComputedStyle(this.element);
        this.model.flexGrow = style.getPropertyValue(CSS_PROPERTIES.FLEX_GROW);
    }
    applyModelToElement() {
        const element = this.element;
        const model = this.model;
        super.applyModelToElement();
        element.style.setProperty(CSS_PROPERTIES.FLEX_GROW, model.flexGrow);
    }
    shouldElementUseModelHeight() {
        return false;
    }
    shouldElementUseModelWidth() {
        return false;
    }
    shouldElementUseModelPosition() {
        return false;
    }
}
NIModelProvider.registerViewModel(FlexibleLayoutWrapperViewModel, undefined, FlexibleLayoutWrapperModel, 'ni-flexible-layout-wrapper');
//# sourceMappingURL=niFlexibleLayoutWrapperViewModel.js.map