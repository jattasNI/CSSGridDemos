//***************************************
// Storing globals in NI namespace
// National Instruments Copyright 2016
//***************************************
import { NI_SUPPORT } from './niSupport.js';
(function () {
    // National Instruments global namespace
    window.NationalInstruments = window.NationalInstruments || {};
    // Namespace for HtmlVI feature
    window.NationalInstruments.HtmlVI = {};
    // Namespace for HtmlVI Elements feature
    window.NationalInstruments.HtmlVI.Elements = {};
    // Namespace for JQXElements
    window.NationalInstruments.JQXElement = {};
    window.NationalInstruments.HtmlVI.NISupport = NI_SUPPORT;
}());
//# sourceMappingURL=niGlobals.js.map