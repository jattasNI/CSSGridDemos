/**
 * Custom Property error thrown by G property methods.
 * National Instruments Copyright 2019
 */
/**
 * Custom error class to be instantiated for throwing specific errors from G Property methods.
 * @class LabVIEWPropertyError
 * @extends Error
 */
export class LabVIEWPropertyError extends Error {
    /**
     * Creates a LabVIEW property custom error.
     * @param {string} message - Message to be displayed when error is thrown.
     * @param {number} code - Error code.
     */
    constructor(message, code) {
        super(message);
        this.name = 'LVPropertyError';
        this.code = code;
    }
}
//# sourceMappingURL=LabVIEWPropertyError.js.map