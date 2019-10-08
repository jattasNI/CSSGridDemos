//****************************************
// Web Application States
// National Instruments Copyright 2019
//****************************************
const SERVICE_STATE_ENUM = Object.freeze({
    UNINITIALIZED: 'UNINITIALIZED',
    READY: 'READY',
    ERROR: 'ERROR'
});
// Keep in sync with serializer in HtmlVIDOMModel.cs
const PANEL_ENGINE_ENUM = Object.freeze({
    NATIVE: 'NATIVE',
    VIREO: 'VIREO'
});
// Keep in sync with serializer in DOMModel.cs
const PANEL_LOCATION_ENUM = Object.freeze({
    IDE_EDIT: 'IDE_EDIT',
    IDE_RUN: 'IDE_RUN',
    BROWSER: 'BROWSER'
});
export class WebApplicationStates {
    static get ServiceStateEnum() {
        return SERVICE_STATE_ENUM;
    }
    static get PanelEngineEnum() {
        return PANEL_ENGINE_ENUM;
    }
    static get PanelLocationEnum() {
        return PANEL_LOCATION_ENUM;
    }
}
//# sourceMappingURL=niWebApplicationStates.js.map