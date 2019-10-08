//****************************************
// GraphBase View Model
// National Instruments Copyright 2016
//****************************************
import { CartesianAxisModel } from "../Modeling/niCartesianAxisModel.js";
import { CursorModel } from "../Modeling/niCursorModel.js";
import { GraphBaseModel } from "../Modeling/niGraphBaseModel.js";
import { LabVIEWPropertyError } from '../Framework/LabVIEWPropertyError.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { CartesianPlotModel as PlotModel } from "../Modeling/niCartesianPlotModel.js";
import { RenderEngine } from '../Framework/niRenderEngine.js';
import { NIViewModel as ViewModel } from './niViewModel.js';
import { VisualModel } from "../Modeling/niVisualModel.js";
import { VisualViewModel } from './niVisualViewModel.js';
const axisPositions = Object.freeze({
    XAxisBottom: 'bottom',
    XAxisTop: 'top',
    YAxisLeft: 'left',
    YAxisRight: 'right'
});
// Static Private Functions
const getActiveCartesianAxisViewModel = function (model, cartesianAxisModels, activeAxisIndex) {
    const rootModel = model.getRoot();
    return rootModel.controlViewModels[cartesianAxisModels[activeAxisIndex].niControlId];
};
export class GraphBaseViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('graphRef');
        this.registerAutoSyncProperty('metadataOverridesPlotNames');
    }
    static get ACTIVE_PLOT_NOT_VALID_ERROR_CODE() {
        return 363532;
    }
    static get X_SCALE_NOT_VALID_ERROR_CODE() {
        return 363534;
    }
    static get NO_CURSOR_FOR_CURRENT_ACTIVE_CURSOR_VALUE_ERROR_CODE() {
        return 363539;
    }
    static get NO_PLOT_FOR_CURRENT_ACTIVE_PLOT_ERROR_CODE() {
        return 363533;
    }
    // Static Public Functions
    static getAxisPositions() {
        return axisPositions;
    }
    static getChildAxisModelsWithGivenAxisPositions(model, ...axisPositionsOfXOrY) {
        return model.childModels.filter(childModel => (childModel instanceof CartesianAxisModel &&
            (axisPositionsOfXOrY.find(function (x) {
                return x === childModel.axisPosition;
            }))));
    }
    static isActiveScaleIndexInBounds(numberOfCartesianAxisModels, activeScaleIndex) {
        if (activeScaleIndex >= 0 && activeScaleIndex < numberOfCartesianAxisModels) {
            return true;
        }
        return false;
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'plotAreaMargin':
                renderBuffer.properties.plotAreaMargin = this.model.plotAreaMargin;
                break;
            case 'niType':
                renderBuffer.properties.niType = this.model.getNITypeString();
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        if (this.element.niType) {
            this.model.niType = new window.NIType(this.element.niType);
        }
    }
    applyModelToElement() {
        super.applyModelToElement(this);
        this.element.niType = this.model.getNITypeString();
    }
    bindToView() {
        const that = this;
        const insideGraphBaseEventName = 'InsideGraphBase';
        that.element.addEventListener('mouseenter', function () {
            that.model.internalControlEventOccurred(insideGraphBaseEventName, true);
        });
        that.element.addEventListener('mouseleave', function () {
            that.model.internalControlEventOccurred(insideGraphBaseEventName, false);
        });
    }
    getPlots() {
        return this.model.childModels.filter(x => (x instanceof PlotModel));
    }
    shouldUseAsyncSetGPropertyValue(gPropertyName) {
        switch (gPropertyName) {
            case GraphBaseModel.ACTIVE_PLOT_G_PROPERTY_NAME:
                return true;
            default:
                return super.shouldUseAsyncSetGPropertyValue(gPropertyName);
        }
    }
    async setGPropertyValueAsync(gPropertyName, gPropertyValue) {
        const model = this.model;
        const that = this;
        let plotChildLength;
        switch (gPropertyName) {
            case GraphBaseModel.ACTIVE_PLOT_G_PROPERTY_NAME:
                // Wait for a frame for exisiting value changes that are pending in the render buffer for a graph to be serviced.
                // Assumes that value changes applied to the graph are consumed immediately and new plots are created synchronously.
                await RenderEngine.waitForFrameUpdate();
                plotChildLength = that.getPlots().length;
                if (gPropertyValue >= 0 && gPropertyValue < plotChildLength) {
                    model.activePlot = gPropertyValue;
                }
                else {
                    throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_PLOT_SET_INDEX_OUT_OF_BOUNDS', gPropertyValue, plotChildLength - 1), GraphBaseViewModel.ACTIVE_PLOT_NOT_VALID_ERROR_CODE);
                }
                break;
            default:
                await super.setGPropertyValueAsync(gPropertyName, gPropertyValue);
        }
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        const model = this.model;
        switch (gPropertyName) {
            case GraphBaseModel.ACTIVE_CURSOR_G_PROPERTY_NAME: {
                const cursorChildModels = model.childModels.filter(x => (x instanceof CursorModel));
                const cursorChildModelsLength = cursorChildModels.length;
                if (gPropertyValue >= 0 && gPropertyValue < cursorChildModelsLength) {
                    model.activeCursor = gPropertyValue;
                }
                else {
                    throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_CURSOR_SET_INDEX_OUT_OF_BOUNDS', gPropertyValue, cursorChildModelsLength - 1), VisualViewModel.INVALID_PROPERTY_VALUE_ERROR_CODE);
                }
                break;
            }
            case VisualModel.VALUE_G_PROPERTY_NAME:
                model.value = gPropertyValue;
                break;
            case VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME:
                model.controlChanged(gPropertyValue);
                break;
            case GraphBaseModel.ACTIVE_X_SCALE_G_PROPERTY_NAME: {
                const cartesianAxisModels = GraphBaseViewModel.getChildAxisModelsWithGivenAxisPositions(model, axisPositions.XAxisBottom, axisPositions.XAxisTop);
                const cartesianAxisModelsLength = cartesianAxisModels.length;
                const activeXScaleIsInBounds = GraphBaseViewModel.isActiveScaleIndexInBounds(cartesianAxisModelsLength, gPropertyValue);
                if (activeXScaleIsInBounds) {
                    model.activeXScale = gPropertyValue;
                }
                else {
                    throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', gPropertyName, cartesianAxisModelsLength - 1), GraphBaseViewModel.X_SCALE_NOT_VALID_ERROR_CODE);
                }
                break;
            }
            case GraphBaseModel.ACTIVE_Y_SCALE_G_PROPERTY_NAME: {
                const cartesianAxisModels = GraphBaseViewModel.getChildAxisModelsWithGivenAxisPositions(model, axisPositions.YAxisLeft, axisPositions.YAxisRight);
                const cartesianAxisModelsLength = cartesianAxisModels.length;
                const activeYScaleIsInBounds = GraphBaseViewModel.isActiveScaleIndexInBounds(cartesianAxisModelsLength, gPropertyValue);
                if (activeYScaleIsInBounds) {
                    model.activeYScale = gPropertyValue;
                }
                else {
                    throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', gPropertyName, cartesianAxisModelsLength - 1), GraphBaseViewModel.X_SCALE_NOT_VALID_ERROR_CODE);
                }
                break;
            }
            case GraphBaseModel.X_SCALE_G_PROPERTY_NAME:
                throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_CANNOT_BE_SET', gPropertyName), ViewModel.OPERATION_UNSUPPORTED_ON_CONTROL_ERROR_CODE);
            case GraphBaseModel.Y_SCALE_G_PROPERTY_NAME:
                throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_CANNOT_BE_SET', gPropertyName), ViewModel.OPERATION_UNSUPPORTED_ON_CONTROL_ERROR_CODE);
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        const model = this.model;
        const viModel = model.getRoot();
        switch (gPropertyName) {
            case GraphBaseModel.CURSOR_G_PROPERTY_NAME: {
                const cursorChildModels = model.childModels.filter(x => (x instanceof CursorModel));
                if (model.activeCursor >= 0 && model.activeCursor < cursorChildModels.length) {
                    return viModel.controlViewModels[cursorChildModels[model.activeCursor].niControlId];
                }
                else {
                    throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_CURSOR_GET_INDEX_OUT_OF_BOUNDS', model.activeCursor, cursorChildModels.length), GraphBaseViewModel.NO_CURSOR_FOR_CURRENT_ACTIVE_CURSOR_VALUE_ERROR_CODE);
                }
            }
            case GraphBaseModel.PLOT_G_PROPERTY_NAME: {
                const plotChildModels = this.getPlots();
                if (model.activePlot >= plotChildModels.length || model.activePlot < 0) {
                    throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_PLOT_GET_INDEX_OUT_OF_BOUNDS', model.activePlot, plotChildModels.length - 1), GraphBaseViewModel.NO_PLOT_FOR_CURRENT_ACTIVE_PLOT_ERROR_CODE);
                }
                return viModel.controlViewModels[plotChildModels[model.activePlot].niControlId];
            }
            case GraphBaseModel.ACTIVE_CURSOR_G_PROPERTY_NAME:
                return model.activeCursor;
            case GraphBaseModel.ACTIVE_PLOT_G_PROPERTY_NAME:
                return model.activePlot;
            case VisualModel.VALUE_G_PROPERTY_NAME:
                return model.value;
            case GraphBaseModel.ACTIVE_X_SCALE_G_PROPERTY_NAME:
                return model.activeXScale;
            case GraphBaseModel.ACTIVE_Y_SCALE_G_PROPERTY_NAME:
                return model.activeYScale;
            case GraphBaseModel.X_SCALE_G_PROPERTY_NAME: {
                const cartesianAxisModels = GraphBaseViewModel.getChildAxisModelsWithGivenAxisPositions(model, axisPositions.XAxisBottom, axisPositions.XAxisTop);
                return getActiveCartesianAxisViewModel(model, cartesianAxisModels, model.activeXScale);
            }
            case GraphBaseModel.Y_SCALE_G_PROPERTY_NAME: {
                const cartesianAxisModels = GraphBaseViewModel.getChildAxisModelsWithGivenAxisPositions(model, axisPositions.YAxisLeft, axisPositions.YAxisRight);
                return getActiveCartesianAxisViewModel(model, cartesianAxisModels, model.activeYScale);
            }
            case GraphBaseModel.XSCALE_RUNTIME_ID: {
                const cartesianAxisModels = GraphBaseViewModel.getChildAxisModelsWithGivenAxisPositions(model, axisPositions.XAxisBottom, axisPositions.XAxisTop);
                return cartesianAxisModels[model.activeXScale].niControlId;
            }
            case GraphBaseModel.YSCALE_RUNTIME_ID: {
                const cartesianAxisModels = GraphBaseViewModel.getChildAxisModelsWithGivenAxisPositions(model, axisPositions.YAxisLeft, axisPositions.YAxisRight);
                return cartesianAxisModels[model.activeYScale].niControlId;
            }
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
}
//# sourceMappingURL=niGraphBaseViewModel.js.map