//****************************************
// CartesianAxis View Model
// National Instruments Copyright 2014
//****************************************
import { CartesianAxisModel, FIT_INDICES as FitIndicesEnum, FIT_TYPES as FitTypesEnum } from '../Modeling/niCartesianAxisModel.js';
import { LabVIEWPropertyError } from '../Framework/LabVIEWPropertyError.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { VisualViewModel } from './niVisualViewModel.js';
// Represents the milliseconds to offset the JS time epoch to make it align with the LV time epoch.
// Matches the 'NITimeEpochOffsetFromJSEpoch' constant in CartesianAxisHtmlGenerator.cs.
const niTimeEpochOffsetFromJSEpoch = -2082844800000;
export const SCALE_INDICES = Object.freeze({
    LINEAR_SCALE: 0,
    LOG_SCALE: 1
});
const numberOfValidFitTypes = 4;
export class CartesianAxisViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('label');
        this.registerAutoSyncProperty('show');
        this.registerAutoSyncProperty('showLabel');
        this.registerAutoSyncProperty('axisPosition');
        this.registerAutoSyncProperty('autoScale');
        this.registerAutoSyncProperty('logScale');
        this.registerAutoSyncProperty('minimum');
        this.registerAutoSyncProperty('maximum');
        this.registerAutoSyncProperty('format');
        this.registerAutoSyncProperty('showTickLabels');
        this.registerAutoSyncProperty('gridLines');
        this.registerAutoSyncProperty('showTicks');
        this.registerAutoSyncProperty('showMinorTicks');
    }
    static get MINIMUM_MUST_BE_LESS_THAN_MAXIMUM_ERROR_CODE() {
        return 363531;
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        const model = this.model;
        switch (gPropertyName) {
            case CartesianAxisModel.MAPPING_G_PROPERTY_NAME:
                {
                    const isLogScaleType = (gPropertyValue !== SCALE_INDICES.LINEAR_SCALE);
                    // If we are changing from linear to logarithmic
                    if (isLogScaleType && !model.logScale) {
                        if (model.maximum <= 0.1) {
                            const lowestMaximumForLogScaleType = 10;
                            model.maximum = lowestMaximumForLogScaleType;
                        }
                        if (model.minimum <= 0) {
                            const lowestMinimumForLogScaleType = 0.1;
                            model.minimum = lowestMinimumForLogScaleType;
                        }
                    }
                    model.logScale = isLogScaleType;
                    break;
                }
            case CartesianAxisModel.RANGE_G_PROPERTY_NAME:
                {
                    if (gPropertyValue.Maximum > gPropertyValue.Minimum) {
                        let maxRange = gPropertyValue.Maximum;
                        let minRange = gPropertyValue.Minimum;
                        if (model.logScale) {
                            const lowestMinimumForLogScaleType = 0.1;
                            maxRange = gPropertyValue.Maximum <= 0 ? model.maximum : maxRange;
                            minRange = gPropertyValue.Minimum <= 0 ? lowestMinimumForLogScaleType : minRange;
                        }
                        model.maximum = maxRange;
                        model.minimum = minRange;
                    }
                    else {
                        throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_MIN_MUST_BE_LESS_THAN_MAX', gPropertyValue.Minimum, gPropertyValue.Maximum), CartesianAxisViewModel.MINIMUM_MUST_BE_LESS_THAN_MAXIMUM_ERROR_CODE);
                    }
                    break;
                }
            case CartesianAxisModel.FIT_TYPE_G_PROPERTY_NAME:
                {
                    model.autoScale = (gPropertyValue < 0 || gPropertyValue >= numberOfValidFitTypes) ? FitTypesEnum[FitIndicesEnum.none] : FitTypesEnum[gPropertyValue];
                    break;
                }
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        const model = this.model;
        switch (gPropertyName) {
            case CartesianAxisModel.MAPPING_G_PROPERTY_NAME:
                return model.logScale ? SCALE_INDICES.LOG_SCALE : SCALE_INDICES.LINEAR_SCALE;
            case CartesianAxisModel.RANGE_G_PROPERTY_NAME:
                return {
                    Maximum: model.maximum,
                    Minimum: model.minimum
                };
            case CartesianAxisModel.FIT_TYPE_G_PROPERTY_NAME:
                {
                    const fitTypeIndex = FitTypesEnum.indexOf(model.autoScale);
                    if (fitTypeIndex >= 0 && fitTypeIndex < numberOfValidFitTypes) {
                        return fitTypeIndex;
                    }
                    else if (fitTypeIndex === FitIndicesEnum.growexact) {
                        return FitIndicesEnum.growloose;
                    }
                    else {
                        return FitIndicesEnum.none;
                    }
                }
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
    applyModelToElement() {
        super.applyModelToElement();
        this.element.timeFormatEpoch = niTimeEpochOffsetFromJSEpoch;
    }
}
NIModelProvider.registerViewModel(CartesianAxisViewModel, undefined, CartesianAxisModel, 'ni-cartesian-axis');
//# sourceMappingURL=niCartesianAxisViewModel.js.map