"use strict";
//****************************************
// Tests for UrlImageViewModel class
// National Instruments Copyright 2015
//****************************************
describe('A UrlImageViewModel', function () {
    'use strict';
    let controlId;
    let viModel, frontPanelControls, controlModel, controlElement, urlImageViewSettings, urlImageViewUpdateSettings;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.urlImageViewSettings.niControlId;
            urlImageViewSettings = fixture.urlImageViewSettings;
            urlImageViewUpdateSettings = fixture.urlImageViewUpdateSettings;
            Object.freeze(urlImageViewSettings);
            Object.freeze(urlImageViewUpdateSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page.', function (done) {
        $(document.body).append('<ni-url-image ni-control-id="' + controlId + '"></ni-url-image>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('dynamically updates properties triggering ModelPropertyChanged', function () {
        let viewModel, internalControl;
        // Can't directly check if background image loaded, so instead verify the computed image source is valid
        // urlString format should be 'url(some_url)'
        const testCSSBackgroundUrlString = function (urlString, successCB) {
            const backgroundImageUrl = urlString.match(/url\(['"]?(.*?)['"]?\)/i)[1];
            expect(typeof backgroundImageUrl).toBe('string');
            const testImage = new Image();
            testImage.addEventListener('load', function () {
                successCB();
            });
            testImage.src = backgroundImageUrl;
        };
        beforeEach(function (done) {
            controlElement = webAppHelper.createNIElement(urlImageViewSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('verifies initial values', function () {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
        });
        it('updates multiple properties', function (done) {
            webAppHelper.dispatchMessage(controlId, urlImageViewUpdateSettings);
            const fakeDone = function () { };
            testHelpers.runAsync(fakeDone, function () {
                internalControl = controlElement.firstElementChild;
                expect(internalControl.title).toEqual(urlImageViewUpdateSettings.alternate);
                testCSSBackgroundUrlString(internalControl.style.backgroundImage, function () {
                    done();
                });
            });
        });
        it('handles unknown properties', function (done) {
            const localUrlImageViewUpdateSettings = Object.assign({}, urlImageViewUpdateSettings);
            const unknownSettings = localUrlImageViewUpdateSettings;
            unknownSettings.unknown = 'unknown';
            const sendUnknownProperties = function () {
                webAppHelper.dispatchMessage(controlId, unknownSettings);
            };
            expect(sendUnknownProperties).toThrow();
            const fakeDone = function () { };
            testHelpers.runAsync(fakeDone, function () {
                internalControl = controlElement.firstElementChild;
                expect(internalControl.title).toEqual(localUrlImageViewUpdateSettings.alternate);
                testCSSBackgroundUrlString(internalControl.style.backgroundImage, function () {
                    done();
                });
            });
        });
    });
});
//# sourceMappingURL=niUrlImageViewModel.Test.js.map