"use strict";
//******************************************
// Tests for ni-plot-legend elements
// National Instruments Copyright 2019
//******************************************
describe('The ni-plot-legend element', function () {
    'use strict';
    let graphId, cartesianGraphSettings, plotLegendSettings, plotSettings1, plotSettings2, plotRendererSettings1, plotRendererSettings2;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    // TODO should be removed after we migrate to jasmine >= 2.7 and the `it` blocks support async functions natively
    const makeAsync = function (done, fn) {
        fn().then(() => done()).catch((ex) => done.fail(ex));
    };
    beforeAll(function (done) {
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            graphId = fixture.cartesianGraphSettings2.niControlId;
            cartesianGraphSettings = fixture.cartesianGraphSettings2;
            // plot settings
            plotSettings1 = fixture.cartesianGraphPlot1Settings;
            plotSettings1.show = true;
            plotSettings2 = fixture.cartesianGraphPlot2Settings;
            // Plot renderer settings
            plotRendererSettings1 = fixture.cartesianGraphRenderer1Settings;
            plotRendererSettings2 = fixture.cartesianGraphRenderer2Settings;
            // Plot legend settings
            plotLegendSettings = fixture.plotLegendSettings;
            plotLegendSettings.graphRef = graphId;
            cartesianGraphSettings.followerIds = [plotLegendSettings.niControlId];
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeEach(function (done) {
        Object.freeze(cartesianGraphSettings);
        webAppHelper.createNIElement(cartesianGraphSettings);
        webAppHelper.createNIElement(plotSettings1, graphId);
        webAppHelper.createNIElement(plotRendererSettings1, plotSettings1.niControlId);
        webAppHelper.createNIElement(plotSettings2, graphId);
        webAppHelper.createNIElement(plotRendererSettings2, plotSettings2.niControlId);
        webAppHelper.createNIElement(plotLegendSettings);
        makeAsync(done, async function () {
            await testHelpers.waitAsync();
        });
    });
    afterEach(function () {
        webAppHelper.removeNIElement(plotRendererSettings2.niControlId);
        webAppHelper.removeNIElement(plotSettings2.niControlId);
        webAppHelper.removeNIElement(plotRendererSettings1.niControlId);
        webAppHelper.removeNIElement(plotSettings1.niControlId);
        webAppHelper.removeNIElement(plotLegendSettings.niControlId);
        webAppHelper.removeNIElement(graphId);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    // Almost all tests for the plot legend (and other graph elements) are in the webcharts repos. This test
    // is an exception because it tests for an issue that was particular to the version of jqx-elements that we
    // maintain in the ASW repo. This test can be removed when we no longer use legacy JQX elements in the legends.
    it('can show a plot legend entry with hover values enabled', function (done) {
        makeAsync(done, async function () {
            const expanderMasterRow = document.querySelector('ni-plot-legend div[id=expander1] > div.ni-master-row');
            // expand plot legend entry with the "enableHover" option enabled
            $(expanderMasterRow).simulate('click');
            // wait for jqxCheckbox to be created and initialized to true
            await testHelpers.waitForAsync(() => document.querySelector('ni-plot-legend span.jqx-checkbox-check-checked') !== null);
        });
    });
});
//# sourceMappingURL=ni-plot-legend.Test.js.map