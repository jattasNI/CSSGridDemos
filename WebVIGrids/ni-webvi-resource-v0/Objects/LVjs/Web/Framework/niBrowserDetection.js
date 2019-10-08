"use strict";
//**********************************************************
// Detect outdated browsers and display a message to the user
// National Instruments Copyright 2016
//**********************************************************
(function () {
    'use strict';
    let element;
    if (window.navigator.userAgent.toLowerCase().indexOf('msie') !== -1) {
        element = document.getElementById('ni-outdated-browser-message');
        if (element !== null) {
            element.style.display = 'block';
        }
    }
}());
//# sourceMappingURL=niBrowserDetection.js.map