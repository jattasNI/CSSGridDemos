//****************************************
// INIArrayViewer Interface
// National Instruments Copyright 2019
//****************************************
const NIArrayViewerSymbol = Symbol('NIArrayViewerSymbol');
export class INIArrayViewer {
    static get NIArrayViewerSymbol() {
        return NIArrayViewerSymbol;
    }
    static isNIArrayViewer(element) {
        return typeof element === 'object' &&
            element !== null &&
            element[NIArrayViewerSymbol] === true;
    }
}
//# sourceMappingURL=ni-array-viewer-interface.js.map