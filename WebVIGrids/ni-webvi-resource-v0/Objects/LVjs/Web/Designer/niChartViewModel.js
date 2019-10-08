//****************************************
// Chart View Model
// National Instruments Copyright 2015
//****************************************
import { ChartModel } from "../Modeling/niChartModel.js";
import { GraphBaseViewModel } from './niGraphBaseViewModel.js';
import { LabVIEWPropertyError } from '../Framework/LabVIEWPropertyError.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { VisualModel } from "../Modeling/niVisualModel.js";
export class ChartViewModel extends GraphBaseViewModel {
    static get CHART_PROXY_DOES_NOT_SUPPORT_VALUE_PROPERTY_ERROR_CODE() {
        return 363540;
    }
    static get CHART_DOES_NOT_SUPPORT_VALUE_SIGNALING_ERROR_CODE() {
        return 363541;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        this.model.historySize = this.element.bufferSize;
        this.model.value = this.element.value;
        this.model.defaultValue = this.element.value;
        /* the history buffer is owned by the chart model. In the case the chart is created by loading it from the HTML document,
        here is the only place we can make sure that the element is informed which history buffer to use. */
        this.element.setHistoryBuffer(this.model.historyBuffer); // make sure the history buffer is shared between element and model
    }
    applyModelToElement() {
        super.applyModelToElement();
        this.element.setHistoryBuffer(this.model.historyBuffer);
        this.element.value = this.model.value;
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case VisualModel.VALUE_G_PROPERTY_NAME:
                throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_NOT_SUPPORTED', gPropertyName), ChartViewModel.CHART_PROXY_DOES_NOT_SUPPORT_VALUE_PROPERTY_ERROR_CODE);
            case VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME:
                throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_NOT_SUPPORTED', gPropertyName), ChartViewModel.CHART_DOES_NOT_SUPPORT_VALUE_SIGNALING_ERROR_CODE);
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        switch (gPropertyName) {
            case VisualModel.VALUE_G_PROPERTY_NAME:
                throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_NOT_SUPPORTED', gPropertyName), ChartViewModel.CHART_PROXY_DOES_NOT_SUPPORT_VALUE_PROPERTY_ERROR_CODE);
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
}
NIModelProvider.registerViewModel(ChartViewModel, undefined, ChartModel, 'ni-chart');
//# sourceMappingURL=niChartViewModel.js.map