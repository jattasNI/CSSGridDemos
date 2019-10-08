//***************************************
// Storing jQuery globals in NI namespace
// National Instruments Copyright 2016
//***************************************
'use strict';
(function () {
    NationalInstruments.Globals = {};
    NationalInstruments.Globals.jQuery = $.noConflict(true);
}());
//# sourceMappingURL=niGlobals.jQuery.js.map