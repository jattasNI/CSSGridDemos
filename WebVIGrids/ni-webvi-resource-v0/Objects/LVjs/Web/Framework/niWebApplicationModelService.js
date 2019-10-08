//****************************************
// NI LabVIEW Web Application Singleton
// National Instruments Copyright 2014
//****************************************
//********************************************************
// Service that manages the Web Application Models for the JavaScript Global Execution Context
//********************************************************
import { WebApplicationModel } from '../Modeling/niWebApplicationModel.js';
import { WebApplicationViewModel } from '../Designer/niWebApplicationViewModel.js';
const webApplicationViewModels = [];
export class WebApplicationModelsService {
    static register(element) {
        let i;
        for (i = 0; i < webApplicationViewModels.length; i++) {
            if (webApplicationViewModels[i].element === element) {
                throw new Error('ViewModel for web application element has already been created');
            }
        }
        // Create the Model
        const webAppModel = new WebApplicationModel();
        // Create the ViewModel
        const webAppViewModel = new WebApplicationViewModel(element, webAppModel);
        webAppViewModel.updateModelFromElement();
        // Complete Model - ViewModel - View binding
        webAppModel.registerListener(webAppViewModel);
        webAppViewModel.bindToView();
        webApplicationViewModels.push(webAppViewModel);
        return webAppViewModel;
    }
    // TODO mraj Do we need to verify any specific state before destroying? Does the Model Service need to notify the update service that we are stopping?
    static unregister(element) {
        let i;
        for (i = 0; i < webApplicationViewModels.length; i++) {
            if (webApplicationViewModels[i].element === element) {
                webApplicationViewModels[i].model.unregisterListener(webApplicationViewModels[i]);
                webApplicationViewModels.splice(i, 1);
                break;
            }
        }
    }
    static getModel(webAppElement) {
        let i;
        for (i = 0; i < webApplicationViewModels.length; i++) {
            if (webApplicationViewModels[i].element === webAppElement) {
                return webApplicationViewModels[i].model;
            }
        }
        return undefined;
    }
}
//# sourceMappingURL=niWebApplicationModelService.js.map