//****************************************
// INIDataGridColumn Interface
// National Instruments Copyright 2019
//****************************************
const NIDatGridColumnSymbol = Symbol('NIDatGridColumnSymbol');
export class INIDataGridColumn {
    static get NIDatGridColumnSymbol() {
        return NIDatGridColumnSymbol;
    }
    static isNIDataGridColumn(element) {
        return typeof element === 'object' &&
            element !== null &&
            element[NIDatGridColumnSymbol] === true;
    }
}
//# sourceMappingURL=ni-data-grid-column-interface.js.map