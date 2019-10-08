//****************************************
// IRootModel Interface
// Interface to be implemented by Models which would be the ancestor of all other Models on the panel.
// National Instruments Copyright 2019
//****************************************
const NIRootModelSymbol = Symbol('NIRootModelSymbol');
export class IRootModel {
    static get NIRootModelSymbol() {
        return NIRootModelSymbol;
    }
    static isRootModel(model) {
        return typeof model === 'object' &&
            model !== null &&
            model[NIRootModelSymbol] === true;
    }
}
//# sourceMappingURL=niRootModel.js.map