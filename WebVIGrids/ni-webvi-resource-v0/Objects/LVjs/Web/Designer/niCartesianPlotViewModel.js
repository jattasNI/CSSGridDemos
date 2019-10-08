//****************************************
// CartesianPlot View Model
// National Instruments Copyright 2014
//****************************************
import { CartesianPlotModel } from "../Modeling/niCartesianPlotModel.js";
import { ColorValueConverters as ColorHelpers } from '../Framework/ValueConverters/niColorValueConverters.js';
import { GraphBaseViewModel } from './niGraphBaseViewModel.js';
import { LabVIEWPropertyError } from '../Framework/LabVIEWPropertyError.js';
import { MathHelpers } from '../Framework/MathHelpers/MathHelpers.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { PlotRendererModel } from "../Modeling/niPlotRendererModel.js";
import { RenderEngine } from '../Framework/niRenderEngine.js';
import { VisualModel } from "../Modeling/niVisualModel.js";
import { VisualViewModel } from './niVisualViewModel.js';
export class CartesianPlotViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('label');
        this.registerAutoSyncProperty('show');
        this.registerAutoSyncProperty('xaxis');
        this.registerAutoSyncProperty('yaxis');
        this.registerAutoSyncProperty('enableHover');
        this.registerAutoSyncProperty('hoverFormat');
    }
    static get X_AXIS_INDEX_OUT_OF_BOUNDS_ERROR_CODE() {
        return 363551;
    }
    static get Y_AXIS_INDEX_OUT_OF_BOUNDS_ERROR_CODE() {
        return 363552;
    }
    async getGPropertyValue(gPropertyName) {
        const model = this.model;
        const graphBaseModel = model.owner;
        const axisPositions = GraphBaseViewModel.getAxisPositions();
        const plotRendererModel = model.childModels[0];
        switch (gPropertyName) {
            case CartesianPlotModel.BAR_WIDTH_G_PROPERTY_NAME:
                return plotRendererModel.barWidth;
            case CartesianPlotModel.COLOR_G_PROPERTY_NAME:
                return ColorHelpers.rgbaToInteger(plotRendererModel.lineStroke);
            case CartesianPlotModel.NAME_G_PROPERTY_NAME:
                // In case we just updated the plot name via waveform metadata, wait for
                // frame update for new name value to propogate to view and back to model.
                await RenderEngine.waitForFrameUpdate();
                return model.label;
            case CartesianPlotModel.LINE_WIDTH_G_PROPERTY_NAME:
                return plotRendererModel.lineWidth;
            case CartesianPlotModel.LINE_STYLE_G_PROPERTY_NAME:
                {
                    const lineStyleOptions = PlotRendererModel.LINE_STYLE_OPTIONS;
                    return lineStyleOptions.indexOf(plotRendererModel.lineStyle);
                }
            case CartesianPlotModel.FILL_STYLE_G_PROPERTY_NAME:
                {
                    const fillStyleOptions = PlotRendererModel.FILL_STYLE_OPTIONS;
                    return fillStyleOptions.indexOf(plotRendererModel.areaBaseLine);
                }
            case CartesianPlotModel.POINT_SHAPE_G_PROPERTY_NAME:
                {
                    const pointShapeOptions = PlotRendererModel.POINT_SHAPE_OPTIONS;
                    return pointShapeOptions.indexOf(plotRendererModel.pointShape);
                }
            case VisualModel.VISIBLE_G_PROPERTY_NAME:
                {
                    return model.show;
                }
            case CartesianPlotModel.X_AXIS_INDEX_G_PROPERTY_NAME:
                {
                    const cartesianAxisModels = GraphBaseViewModel.getChildAxisModelsWithGivenAxisPositions(graphBaseModel, axisPositions.XAxisBottom, axisPositions.XAxisTop);
                    return cartesianAxisModels.findIndex(function (cartesianAxisModel) {
                        return cartesianAxisModel.niControlId === model.xaxis;
                    });
                }
            case CartesianPlotModel.Y_AXIS_INDEX_G_PROPERTY_NAME:
                {
                    const cartesianAxisModels = GraphBaseViewModel.getChildAxisModelsWithGivenAxisPositions(graphBaseModel, axisPositions.YAxisLeft, axisPositions.YAxisRight);
                    return cartesianAxisModels.findIndex(function (cartesianAxisModel) {
                        return cartesianAxisModel.niControlId === model.yaxis;
                    });
                }
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        const model = this.model;
        const graphBaseModel = model.owner;
        const axisPositions = GraphBaseViewModel.getAxisPositions();
        const plotRendererModel = model.childModels[0];
        switch (gPropertyName) {
            case CartesianPlotModel.BAR_WIDTH_G_PROPERTY_NAME:
                plotRendererModel.barWidth = gPropertyValue < 0 ? 0 : gPropertyValue;
                break;
            case CartesianPlotModel.COLOR_G_PROPERTY_NAME:
                plotRendererModel.lineStroke = ColorHelpers.integerToRGBA(gPropertyValue);
                break;
            case CartesianPlotModel.NAME_G_PROPERTY_NAME:
                model.label = gPropertyValue;
                break;
            case CartesianPlotModel.LINE_WIDTH_G_PROPERTY_NAME:
                {
                    const min = PlotRendererModel.MIN_LINE_WIDTH;
                    const max = PlotRendererModel.MAX_LINE_WIDTH;
                    plotRendererModel.lineWidth = MathHelpers.clamp(gPropertyValue, min, max);
                    break;
                }
            case CartesianPlotModel.LINE_STYLE_G_PROPERTY_NAME:
                {
                    const lineStyleOptions = PlotRendererModel.LINE_STYLE_OPTIONS;
                    plotRendererModel.lineStyle = lineStyleOptions[MathHelpers.clamp(gPropertyValue, 0, lineStyleOptions.length - 1)];
                    break;
                }
            case CartesianPlotModel.FILL_STYLE_G_PROPERTY_NAME:
                {
                    const fillStyleOptions = PlotRendererModel.FILL_STYLE_OPTIONS;
                    // The first option in fillStyleOptions is none, and whenever the value is out of bound, it clamps to valid value other then none,
                    // that's why areaBaseLine gets clamped from 1 to the number of options.
                    plotRendererModel.areaBaseLine = fillStyleOptions[MathHelpers.clamp(gPropertyValue, 1, fillStyleOptions.length - 1)];
                    break;
                }
            case CartesianPlotModel.POINT_SHAPE_G_PROPERTY_NAME:
                {
                    const pointShapeOptions = PlotRendererModel.POINT_SHAPE_OPTIONS;
                    plotRendererModel.pointShape = pointShapeOptions[MathHelpers.clamp(gPropertyValue, 0, pointShapeOptions.length - 1)];
                    break;
                }
            case VisualModel.VISIBLE_G_PROPERTY_NAME:
                {
                    model.show = gPropertyValue;
                    break;
                }
            case CartesianPlotModel.X_AXIS_INDEX_G_PROPERTY_NAME:
                {
                    const cartesianAxisModels = GraphBaseViewModel.getChildAxisModelsWithGivenAxisPositions(graphBaseModel, axisPositions.XAxisBottom, axisPositions.XAxisTop);
                    const cartesianAxisModelsLength = cartesianAxisModels.length;
                    const activeXScaleIsInBounds = GraphBaseViewModel.isActiveScaleIndexInBounds(cartesianAxisModelsLength, gPropertyValue);
                    if (activeXScaleIsInBounds) {
                        model.xaxis = cartesianAxisModels[gPropertyValue].niControlId;
                    }
                    else {
                        throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', gPropertyName, cartesianAxisModelsLength - 1), CartesianPlotViewModel.X_AXIS_INDEX_OUT_OF_BOUNDS_ERROR_CODE);
                    }
                    break;
                }
            case CartesianPlotModel.Y_AXIS_INDEX_G_PROPERTY_NAME:
                {
                    const cartesianAxisModels = GraphBaseViewModel.getChildAxisModelsWithGivenAxisPositions(graphBaseModel, axisPositions.YAxisLeft, axisPositions.YAxisRight);
                    const cartesianAxisModelsLength = cartesianAxisModels.length;
                    const activeYScaleIsInBounds = GraphBaseViewModel.isActiveScaleIndexInBounds(cartesianAxisModelsLength, gPropertyValue);
                    if (activeYScaleIsInBounds) {
                        model.yaxis = cartesianAxisModels[gPropertyValue].niControlId;
                    }
                    else {
                        throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_OUT_OF_RANGE', gPropertyName, cartesianAxisModelsLength - 1), CartesianPlotViewModel.Y_AXIS_INDEX_OUT_OF_BOUNDS_ERROR_CODE);
                    }
                    break;
                }
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    bindToView() {
        super.bindToView();
        const that = this;
        const plotElement = that.element;
        const graphElement = plotElement.parentElement;
        graphElement.addEventListener('ni-cartesian-plot-changed', function (event) {
            if (event.detail.element === plotElement && that.model.label !== plotElement.label) {
                // if plot element label has been updated via waveform metadata, update model
                that.model.label = plotElement.label;
            }
        });
    }
}
NIModelProvider.registerViewModel(CartesianPlotViewModel, undefined, CartesianPlotModel, 'ni-cartesian-plot');
//# sourceMappingURL=niCartesianPlotViewModel.js.map