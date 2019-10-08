//****************************************
// NI View Model
// National Instruments Copyright 2014
//****************************************
import { LabVIEWPropertyError } from '../Framework/LabVIEWPropertyError.js';
import { NIModel } from '../Modeling/niModel.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { RenderEngine as RENDER_ENGINE } from '../Framework/niRenderEngine.js';
export class NIViewModel {
    // Constructor Function
    constructor(element, model) {
        if (!NI_SUPPORT.isElement(element)) {
            throw new Error(NI_SUPPORT.i18n('msg_INVALID_ELEMENT'));
        }
        if (model instanceof NIModel === false) {
            throw new Error(NI_SUPPORT.i18n('msg_INVALID_VI_MODEL'));
        }
        this._autoSyncPropertyMap = new Map();
        // Public Instance Properties
        NI_SUPPORT.defineConstReference(this, 'element', element);
        NI_SUPPORT.defineConstReference(this, 'model', model);
    }
    static get OPERATION_UNSUPPORTED_ON_CONTROL_ERROR_CODE() {
        return 1086;
    }
    bindToView() {
    }
    getOrAddRenderBuffer() {
        const renderBuffer = RENDER_ENGINE.getOrAddRenderBuffer(this.element);
        return renderBuffer;
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = this.getOrAddRenderBuffer();
        if (this._autoSyncPropertyMap.has(propertyName) && this._autoSyncPropertyMap.get(propertyName) === true) {
            renderBuffer.properties[propertyName] = this.model[propertyName];
        }
        return renderBuffer;
    }
    registerAutoSyncProperty(propertyName) {
        if (typeof propertyName !== 'string' || propertyName.length < 1) {
            throw new Error('A property name must be a string greater than or equal to one character long');
        }
        this._autoSyncPropertyMap.set(propertyName, true);
    }
    // Applies changes to the DOM Element
    applyElementChanges() {
        RENDER_ENGINE.enqueueDomUpdate(this.element);
    }
    updateModelFromElement() {
        this._autoSyncPropertyMap.forEach((autoSync, currProp, map) => {
            this.model[currProp] = this.element[currProp];
        });
    }
    applyModelToElement() {
        this._autoSyncPropertyMap.forEach((autoSync, currProp, map) => {
            this.element[currProp] = this.model[currProp];
        });
    }
    /**
        * Called by the update service to execute the given function on the ViewModel.  Override this any time you have a method
        * you want to call from C# and need to wait for the value.
        * @param {string}  functionName  The name of the function to call on this viewModel.
        * @param {Object[]}  args  Arguments to pass to the called function.
        * @returns the computed value from the given function, if any.
    */
    async invokeInternalControlFunction(functionName, args) {
        throw new Error(`Internal control function ${functionName} not implemented. Called with args: ${args.join(',')}`);
    }
    enableEvents() {
        return this.model.enableEvents();
    }
    /**
        * Set propertyValue on the provided property name.
        * @param {string}  gPropertyName  The property on which the set is called.
        *  See Framework/Constants/niGPropertyNameConstants.ts
        * @param {string}  gPropertyValue  The value that needs to be set for the property.
        * @throws {Error} if the property is not supported or in case of any error during setting of the property.
        */
    setGPropertyValue(gPropertyName, gPropertyValue) {
        throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_NOT_SUPPORTED', gPropertyName), NIViewModel.OPERATION_UNSUPPORTED_ON_CONTROL_ERROR_CODE);
    }
    /**
        * Returns true if gPropertyName uses asynchronous setGPropertyValue i.e, setGPropertyValueAsync.
        * @param {string}  gPropertyName  The property on which the set is called.
        *  See Framework/Constants/niGPropertyNameConstants.ts
        * @todo Idealy our setGPropertyValue should handle asynchronicity, this function should be removed once we make all our setGPropertyValue
        * to be async.
        */
    shouldUseAsyncSetGPropertyValue(gPropertyName) {
        return false;
    }
    /**
        * Asynchronous version of setGPropertyValue.
        * @param {string}  gPropertyName  The property on which the set is called.
        *  See Framework/Constants/niGPropertyNameConstants.ts
        * @param {string}  gPropertyValue  The value that needs to be set for the property.
        * @throws {Error} if the property is not supported or in case of any error during setting of the property.
        * @todo Idealy our setGPropertyValue should handle asynchronicity, this function should be removed once we make all our setGPropertyValue
        * to be async.
        */
    async setGPropertyValueAsync(gPropertyName, gPropertyValue) {
        throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_NOT_SUPPORTED', gPropertyName), NIViewModel.OPERATION_UNSUPPORTED_ON_CONTROL_ERROR_CODE);
    }
    /**
        * Get the property value identified by the parameter, gPropertyName.
        * @param {string} gPropertyName The property that needs to be read.
        *  See Framework/Constants/niGPropertyNameConstants.ts
        * @returns the property value or a promise whose resolve can return the desired property value.
        * @throws {Error} if the property is not supported or in case of any error during setting of the property.
        */
    getGPropertyValue(gPropertyName) {
        throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_PROPERTY_NOT_SUPPORTED', gPropertyName), NIViewModel.OPERATION_UNSUPPORTED_ON_CONTROL_ERROR_CODE);
    }
}
//# sourceMappingURL=niViewModel.js.map