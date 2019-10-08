//****************************************
// Tree Value Convertor
// National Instruments Copyright 2019
//****************************************
import { TreeStates } from '../../Framework/niTreeStates.js';
const TreeSelectionMode = TreeStates.SelectionModeEnum;
export class TreeValueConverter {
    /**
    * Converts the TreeStates.SelectionModeEnum enum to the jqx equivalent value (Main difference is case).
    * @param {TreeSelectionMode} The enum to convert.
    */
    static convertNIToJQXSelectionMode(selectionMode) {
        switch (selectionMode) {
            case TreeSelectionMode.SINGLE:
                return 'singlerow';
            case TreeSelectionMode.MULTIPLE:
                return 'multiplerows';
            case TreeSelectionMode.CUSTOM:
                return 'custom';
        }
    }
    /**
    * Converts the jqx selection mode string to the equivalent TreeSelectionMode enum (Main difference is case).
    * @param {string} The jqx string value to convert to an Enum.
    */
    static convertJQXToNISelectionMode(selectionMode) {
        switch (selectionMode) {
            case 'singlerow':
                return TreeSelectionMode.SINGLE;
            case 'multiplerows':
                return TreeSelectionMode.MULTIPLE;
            case 'custom':
                return TreeSelectionMode.CUSTOM;
        }
    }
}
//# sourceMappingURL=niTreeValueConverter.js.map