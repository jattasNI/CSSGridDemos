//****************************************
// INITabItem Interface
// National Instruments Copyright 2019
//****************************************
const NITabItemSymbol = Symbol('NITabItemSymbol');
export class INITabItem {
    static get NITabItemSymbol() {
        return NITabItemSymbol;
    }
    static isNITabItem(element) {
        return typeof element === 'object' &&
            element !== null &&
            element[NITabItemSymbol] === true;
    }
}
//# sourceMappingURL=ni-tab-item-interface.js.map