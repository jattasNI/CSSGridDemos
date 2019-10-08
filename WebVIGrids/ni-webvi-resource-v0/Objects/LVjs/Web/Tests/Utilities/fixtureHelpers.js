"use strict";
(function () {
    'use strict';
    const loadFile = function (filePath) {
        return window.fetch(filePath, {
            method: 'GET',
            mode: 'cors',
            redirect: 'follow'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('Request failed with status (' + response.status + ')');
            }
            return response.text();
        }).then(function (text) {
            return text;
        }).catch(function (reason) {
            throw new Error('Error retrieving source from url (' + filePath + ') possible reason: ' + reason);
        });
    };
    const loadFileSync = function (filePath) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', filePath, false);
        xhr.send(null);
        const isSuccessfulPhantomJSXHRResponse = xhr.status === 0 && typeof xhr.responseText === 'string' && xhr.responseText !== '';
        if (xhr.status === 200 || isSuccessfulPhantomJSXHRResponse) {
            return xhr.responseText;
        }
        else {
            throw new Error('Could not load file at path: ' + filePath);
        }
    };
    window.testHelpers = window.testHelpers || {};
    // Fixture hack #1
    // This is a complete and total hack to work with karma runner and chutzpah >.>
    // karma uses a web server to host files as http:// while while chutzpah uses file:// urls
    // The karma files based on the pattern matching path get loaded to, for example, http://localhost:8002/base/LabVIEW/Html.Controls.Design/Web/Tests/Fixtures/
    // Using karma proxies we map everything in Fixtures to http://localhost:8082/Fixtures
    // The fixtures pathstarts at http://localhost:8082, then based on the paths below tries to go up one directory (which you can't at root), and then goes into the Fixtures folder which happens to resolve to the proxied path
    // chutzpah uses file:// urls that resolve the full disk to the folder where the files run from
    // In the case of CSS tests that results to, for example, file:///E:/dev/r4/Bajor/Main/Binaries/WPF/NationalInstruments.LabVIEW/Debug/Resources/html_panel_root/Web/Tests/CSS/ because the CSS tests are run from that folder
    // combined with the path below that goes up one directory to the Tests folder and then into the actual Fixtures folder
    window.testHelpers.getPathRelativeToFixtures = function (path) {
        return '../Fixtures/' + path;
    };
    window.testHelpers.setupFixturePaths = function () {
        jasmine.getFixtures().fixturesPath = '../Fixtures';
        jasmine.getStyleFixtures().fixturesPath = '../Fixtures';
    };
    window.testHelpers.fetchFixture = function (path) {
        const fixture = loadFileSync(path);
        return fixture;
    };
    window.testHelpers.fetchJsonFixtureForElements = function () {
        return loadFile(testHelpers.getPathRelativeToFixtures('Elements/ControlSettings.json')).then(text => JSON.parse(text));
    };
}());
//# sourceMappingURL=fixtureHelpers.js.map