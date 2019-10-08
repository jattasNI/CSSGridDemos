//******************************************
// Tests for Virutal Instrument Reference service class
// National Instruments Copyright 2014
//******************************************
import { TestUpdateService } from '../../Framework/niTestUpdateService.js';
import { WebApplicationModel } from '../../Modeling/niWebApplicationModel.js';
import { VIReferenceService as viReferenceService } from '../../Framework/niVIReferenceService.js';
import { WebApplicationModelsService as webApplicationModelsService } from '../../Framework/niWebApplicationModelService.js';
describe('A VIReferenceService', function () {
    'use strict';
    let webAppElement1;
    let viRick;
    let viMorty;
    let webAppElement2;
    let viMrMeeseeks;
    beforeEach(function (done) {
        let remainingWebApps = 2;
        webAppElement1 = document.createElement('ni-web-application');
        webAppElement1.testMode = true;
        webAppElement1.disableAutoStart = true;
        viRick = document.createElement('ni-virtual-instrument');
        viRick.viName = 'Wubba lubba dub dub.gvi';
        viRick.viRef = 'Rick';
        viMorty = document.createElement('ni-virtual-instrument');
        viMorty.viName = 'One True Morty.gvi';
        viMorty.viRef = 'Morty';
        webAppElement1.appendChild(viRick);
        webAppElement1.appendChild(viMorty);
        webAppElement1.addEventListener('service-state-changed', function runningListener(evt) {
            if (evt.detail.serviceState === TestUpdateService.StateEnum.READY) {
                webAppElement1.removeEventListener('service-state-changed', runningListener);
                remainingWebApps--;
                if (remainingWebApps === 0) {
                    done();
                }
            }
        });
        webAppElement2 = document.createElement('ni-web-application');
        webAppElement2.testMode = true;
        webAppElement2.disableAutoStart = true;
        viMrMeeseeks = document.createElement('ni-virtual-instrument');
        viMrMeeseeks.viName = 'Look at me.gvi';
        viMrMeeseeks.viRef = 'Meeseeks';
        webAppElement2.appendChild(viMrMeeseeks);
        webAppElement2.addEventListener('service-state-changed', function runningListener2(evt) {
            if (evt.detail.serviceState === TestUpdateService.StateEnum.READY) {
                webAppElement2.removeEventListener('service-state-changed', runningListener2);
                remainingWebApps--;
                if (remainingWebApps === 0) {
                    done();
                }
            }
        });
        document.body.appendChild(webAppElement1);
        document.body.appendChild(webAppElement2);
    });
    afterEach(function () {
        document.body.removeChild(webAppElement1);
        document.body.removeChild(webAppElement2);
        webAppElement1 = undefined;
        viRick = undefined;
        viMorty = undefined;
        // TODO mraj should wait until web app unregisters?
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('is defined', function () {
        expect(viReferenceService).toBeDefined();
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('can get VIs by the VI reference', function () {
        const rickNameByRef = viReferenceService.getVIModelByVIRef('Rick').viName;
        expect(rickNameByRef).toBe('Wubba lubba dub dub.gvi');
        const mortyNameByRef = viReferenceService.getVIModelByVIRef('Morty').viName;
        expect(mortyNameByRef).toBe('One True Morty.gvi');
        const meeseeksNameByRef = viReferenceService.getVIModelByVIRef('Meeseeks').viName;
        expect(meeseeksNameByRef).toBe('Look at me.gvi');
    });
    it('can get all the VI models for a specific web app model', function () {
        const webAppModel1 = webApplicationModelsService.getModel(webAppElement1);
        const viModels1 = webAppModel1.getVirtualInstrumentModelsProvider().getVIModels();
        expect(Object.keys(viModels1).length).toBe(2);
        expect(viModels1['Wubba lubba dub dub.gvi']).toBeDefined();
        expect(viModels1['One True Morty.gvi']).toBeDefined();
        const webAppModel2 = webApplicationModelsService.getModel(webAppElement2);
        const viModels2 = webAppModel2.getVirtualInstrumentModelsProvider().getVIModels();
        expect(Object.keys(viModels2).length).toBe(1);
        expect(viModels2['Look at me.gvi']).toBeDefined();
    });
    it('can get the web app model for a VI reference', function () {
        const webAppModelForRick = viReferenceService.getWebAppModelByVIRef('Rick');
        const webAppModelForMorty = viReferenceService.getWebAppModelByVIRef('Morty');
        const webAppModelForMeeseeks = viReferenceService.getWebAppModelByVIRef('Meeseeks');
        expect(webAppModelForRick).toBeDefined();
        expect(webAppModelForMorty).toBeDefined();
        expect(webAppModelForMeeseeks).toBeDefined();
        expect(webAppModelForRick instanceof WebApplicationModel).toBe(true);
        expect(webAppModelForMorty instanceof WebApplicationModel).toBe(true);
        expect(webAppModelForMeeseeks instanceof WebApplicationModel).toBe(true);
    });
});
//# sourceMappingURL=niVIReferenceService.Test.js.map