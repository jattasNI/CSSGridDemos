// Problem this file is trying to solve:
// Because we load internationalization language files asynchronously before registering the elements, we need to wait for the elements to be ready before running tests
// Jasmine's recommendation is to modify boot.js: http://jasmine.github.io/2.4/boot.html
// We can't do this because chutzpah and karma both modify boot.js, so we would have to take on that maintainence burdern
// Another option is to make every test gauruntee the elements are loaded by adding the following to every describe block:
//beforeAll(function (done) {
//    NationalInstruments.HtmlVI.Elements.addNIEventListener('attached', function () {
//        done();
//    });
//});
// This is undesireable because it is easy to forget, highly duplicative, and a burder to maintain. But it does use well-supported APIs which is desireable
// The following is probably a hack modifying internal state of jasmine to add an extra step to the implicit top-level test suite, avoiding the need for either above solution
import { NIElement } from '../../Elements/ni-element.js';
import { NI_SUPPORT } from '../../Framework/niSupport.js';
(function () {
    'use strict';
    // Possible to use jasmine.getEnv().topSuite().beforeAll({fn:function(){}}): http://stackoverflow.com/questions/17317839/how-to-reuse-beforeeach-aftereach-in-jasmine-js/30210205#30210205
    // Figured out following way to manipulate topSuite from here: https://github.com/jasmine/jasmine/issues/811
    jasmine.getEnv().beforeAll(function (done) {
        NI_SUPPORT.debugVerbose('Waiting for element registration.');
        NIElement.addNIEventListener('attached', function () {
            NI_SUPPORT.debugVerbose('Elements appear to be registered.');
            done();
        });
    });
}());
//# sourceMappingURL=jasmineStartupInterceptor.js.map