//**********************************************************
// Service that handles registration of ni-elements
// National Instruments Copyright 2019
//**********************************************************
import { NIElement } from '../Elements/ni-element.js';
import { NIElementRegistrationWeightEnum } from './niElementRegistrationWeightEnum.js';
const weightedRegisteredElements = [[]];
/** This class provides the methods to define custom elements for ni-element based elements */
export class NIElementRegistrationService {
    /**
     * Registers the ni-element based element with the registration service
     * @param {NIElement} element - The element to register.
     * @param {NIElementRegistrationWeightEnum} weight - The weight of element to register. If no weight is passed then default value is taken as NIElementRegistrationWeightEnum.LEAF.
     */
    static registerElement(element, weight) {
        if (weight === undefined) {
            weight = NIElementRegistrationWeightEnum.LEAF;
        }
        if (weightedRegisteredElements[weight] === undefined) {
            weightedRegisteredElements[weight] = [];
        }
        weightedRegisteredElements[weight].push(element);
    }
    /** Defines custom elements for all the registered elements. This must be called once after we are done loading all the files. */
    static completeRegistration() {
        weightedRegisteredElements.forEach((registeredElements) => {
            registeredElements.forEach((element) => {
                NIElement._finalizeObservedAttributes(element);
                window.customElements.define(element.prototype.elementInfo.tagName, element);
            });
        });
        NIElement.notifyElementsRegistered();
    }
}
//# sourceMappingURL=niElementRegistrationService.js.map