import { NationalInstruments as NIFlatBuffers } from "./PackedDataValues_generated.js";
import { NIPackedLongUtils } from "./niPackedLongUtils.js";
/**
 * Adaptor for Long type
 */
export class NIPackedLongDataAdaptor {
    /**
     * Packs a Long value into a flat buffer
     * @static
     * @param {flatbuffers.Builder} builder the builder to use for packing the data value
     * @param {string} dataToPack the long value to pack
     * @param {boolean} packInline true to pack the value inline as a field if possible
     * @param {number} fieldOffset the field offset of the inlined packed value
     * @memberof NIPackedLongDataAdaptor
     */
    static PackDataValue(builder, dataToPack, packInline, fieldOffset) {
        dataToPack = NIPackedLongUtils.CreateFlatbuffersLong(dataToPack);
        if (packInline) {
            builder.addFieldInt64(fieldOffset, dataToPack, 0);
        }
        else {
            NIFlatBuffers.PackedData.PackedInt64Value.startPackedInt64Value(builder);
            NIFlatBuffers.PackedData.PackedInt64Value.addValue(builder, dataToPack);
            return NIFlatBuffers.PackedData.PackedInt64Value.endPackedInt64Value(builder);
        }
    }
    /**
     * Creates an instance adaptor class.
     * @param packedData the packed data to wrap
     * @param niType The type ofthe packed data
     */
    constructor(packedData, niType, options) {
        this.niType = niType;
        this.packedData = packedData;
    }
    /**
     * Gets the type of long as an NIType
     * @returns The NIType
     */
    getType() {
        return this.niType;
    }
    /**
     * Unpacks this long into into a standard JavaScript object
     * @returns the unpacked long in string format
     */
    unpack() {
        const longvalue = this.packedData.value();
        return new window.JQX.Utilities.BigNumber(longvalue.low, longvalue.high).toString();
    }
}
//# sourceMappingURL=niPackedLongDataAdaptor.js.map