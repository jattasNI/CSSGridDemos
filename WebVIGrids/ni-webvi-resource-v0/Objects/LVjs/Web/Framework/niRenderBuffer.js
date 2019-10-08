//************************************************
// NI Render Buffer
// National Instruments Copyright 2016
//************************************************
// Use the RenderBuffer object to store changes that will be propagated to the DOM Element associated with view model
// Parameter behaviors:
// properties: Add properties to this object whose name is a property on the DOM Element and value is the new value for the DOM Element property
// cssClasses.toAdd: Append string names to this array of css classes to add to the element
// cssClasses.toRemove: Append string names to this array of css classes to remove from the element
// cssStyles: Add properties to this object whose values are the css style to update. (i.e. renderBuffer.cssStyle['border'] = 0; Reference the Element.css property for a list of styles to set)
// attributes: Add properties to this object whose name is a DOM attribute and whose string value is the string value to update the element DOM attribute (i.e. renderBuffer.attributes['data-mydata'] = "hello"  )
// postRender: Allows registering JS functions to make additional changes to a DOM Element, at the end of a RenderEngine frame update (after the other RenderBuffer DOM updates).
//             Add properties to this object with whose name is unique (can be based on the property names being updated), and whose value is a function to execute.
export class RenderBuffer {
    constructor() {
        this.properties = {};
        this.cssClasses = Object.freeze({ toAdd: [], toRemove: [] });
        this.cssStyles = {};
        this.attributes = {};
        this.postRender = {};
    }
    static get REMOVE_CUSTOM_PROPERTY_TOKEN() {
        return ''; // Used in niRenderEngine.js
    }
    reset() {
        this.properties = {};
        this.cssClasses = Object.freeze({ toAdd: [], toRemove: [] });
        this.cssStyles = {};
        this.attributes = {};
        this.postRender = {};
    }
    isEmpty() {
        if (Object.keys(this.properties).length > 0) {
            return false;
        }
        if (this.cssClasses.toAdd.length > 0) {
            return false;
        }
        if (this.cssClasses.toRemove.length > 0) {
            return false;
        }
        if (Object.keys(this.cssStyles).length > 0) {
            return false;
        }
        if (Object.keys(this.attributes).length > 0) {
            return false;
        }
        if (Object.keys(this.postRender).length > 0) {
            return false;
        }
        return true;
    }
}
//# sourceMappingURL=niRenderBuffer.js.map