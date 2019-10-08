//****************************************
// INIElement Interface
// National Instruments Copyright 2019
//****************************************
const NIElementSymbol = Symbol('NIElementSymbol');
export class INIElement {
    static get NIElementSymbol() {
        return NIElementSymbol;
    }
    static isNIElement(element) {
        return typeof element === 'object' &&
            element !== null &&
            element[NIElementSymbol] === true;
    }
}
//# sourceMappingURL=ni-element-interface.js.map