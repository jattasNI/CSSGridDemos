//****************************************
// NI LabVIEW VI Ref Service Singleton
// National Instruments Copyright 2014
// Service that manages vis and controls that register using a vi-ref identifier
//****************************************
import { VirtualInstrument } from '../Elements/ni-virtual-instrument.js';
import { VirtualInstrumentModel } from '../Modeling/niVirtualInstrumentModel.js';
import { VirtualInstrumentViewModel } from '../Designer/niVirtualInstrumentViewModel.js';
import { WebApplication } from '../Elements/ni-web-application.js';
import { WebApplicationModel } from '../Modeling/niWebApplicationModel.js';
import { WebApplicationModelsService as webApplicationModelsService } from './niWebApplicationModelService.js';
const viRefToVIModel = {};
const viRefToVIViewModel = {};
const viRefToWebAppModel = {};
export class VIReferenceService {
    static registerVIElement(viElement) {
        if (viElement instanceof VirtualInstrument === false) {
            throw new Error('The viReferenceService only registers ni-virtual-instrument elements');
        }
        if (viRefToVIModel[viElement.viRef] !== undefined) {
            throw new Error('A virtual instrument with the following vi-ref has already been defined: ' + viElement.viRef);
        }
        if (viRefToWebAppModel[viElement.viRef] !== undefined) {
            throw new Error('A web application containing the following vi-ref has already been defined: ' + viElement.viRef);
        }
        const webAppElement = viElement.parentElement;
        if (webAppElement instanceof WebApplication === false) {
            throw new Error('Virtual Instrument Elements must be direct children of Web Application Elements for registration to complete');
        }
        const webAppModel = webApplicationModelsService.getModel(webAppElement);
        if (webAppModel === undefined) {
            throw new Error('Web Application View Model has not been created yet');
        }
        // Create the Model
        const viModel = new VirtualInstrumentModel(undefined, webAppModel);
        // Create the ViewModel
        const viViewModel = new VirtualInstrumentViewModel(viElement, viModel);
        viViewModel.updateModelFromElement();
        // Complete Model - ViewModel binding
        viModel.registerListener(viViewModel);
        if (webAppModel.getVirtualInstrumentModelsProvider().getVIModels()[viModel.viName] !== undefined) {
            throw new Error('Web applications cannot have multiple VIs with the same name');
        }
        webAppModel.attachVIModel(viModel);
        viRefToVIModel[viModel.viRef] = viModel;
        viRefToVIViewModel[viModel.viRef] = viViewModel;
        viRefToWebAppModel[viModel.viRef] = webAppModel;
    }
    static unregisterVIElement(viElement) {
        const viModel = viRefToVIModel[viElement.viRef];
        const viViewModel = viRefToVIViewModel[viElement.viRef];
        const owningWebAppModel = viRefToWebAppModel[viElement.viRef];
        if (viModel instanceof VirtualInstrumentModel === false ||
            viViewModel instanceof VirtualInstrumentViewModel === false ||
            owningWebAppModel instanceof WebApplicationModel === false) {
            throw new Error('ni-virtual-instrument with vi-ref (' + viElement.viRef + ') and vi-name (' + viElement.viName + ') was not properly registered and cannot be unregistered');
        }
        const viModelsMap = owningWebAppModel.getVirtualInstrumentModelsProvider().getVIModels();
        if (viModelsMap === undefined || viModelsMap[viModel.viName] instanceof VirtualInstrumentModel === false) {
            throw new Error('ni-virtual-instrument with vi-ref (' + viElement.viRef + ') and vi-name (' + viElement.viName + ') was not properly registered and cannot be unregistered');
        }
        viModel.unregisterListener(viViewModel);
        viModel.detachFromWebApp();
        owningWebAppModel.detachVIModel(viModel);
        viRefToVIModel[viElement.viRef] = undefined;
        viRefToVIViewModel[viElement.viRef] = undefined;
        viRefToWebAppModel[viElement.viRef] = undefined;
    }
    static getVIModelByVIRef(viRefString) {
        if (viRefToVIModel[viRefString] === undefined) {
            throw new Error('Cannot find the VI');
        }
        return viRefToVIModel[viRefString];
    }
    static getVIViewModelByVIRef(viRefString) {
        if (viRefToVIViewModel[viRefString] === undefined) {
            throw new Error('Cannot find the VI');
        }
        return viRefToVIViewModel[viRefString];
    }
    static getWebAppModelByVIRef(viRefString) {
        if (viRefToWebAppModel[viRefString] === undefined) {
            throw new Error('Cannot find the web app');
        }
        return viRefToWebAppModel[viRefString];
    }
}
//# sourceMappingURL=niVIReferenceService.js.map