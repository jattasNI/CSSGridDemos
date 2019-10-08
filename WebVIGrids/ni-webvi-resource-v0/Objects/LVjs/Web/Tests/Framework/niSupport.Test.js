//****************************************
// Tests for niSupport file
// National Instruments Copyright 2014
//****************************************
import { NI_SUPPORT } from '../../Framework/niSupport.js';
describe('The niSupport', function () {
    'use strict';
    it('verifies that verbose flags are not enabled', function () {
        expect(NI_SUPPORT.VERBOSE).toBe(false);
        expect(NI_SUPPORT.VERBOSE_INFO).toBe(false);
        expect(NI_SUPPORT.SYNCHRONIZE_RENDER_BUFFER).toBe(false);
    });
});
//# sourceMappingURL=niSupport.Test.js.map