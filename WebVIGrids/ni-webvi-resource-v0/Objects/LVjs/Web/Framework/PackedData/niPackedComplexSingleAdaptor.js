import { NationalInstruments as NIFlatBuffers } from "./PackedDataValues_generated.js";
/**
 * Adaptor for ComplexSingle type
 */
export class NIPackedComplexSingleAdaptor {
    /**
     * Packs a ComplexSingle value into a flat buffer
     * @static
     * @param {flatbuffers.Builder} builder the builder to use for packing the data value
     * @param {string} complexDataToPack the array value to pack
     * @param {NIType} niType the data type of the array
     * @returns {number} the buffer offset of the packed array value
     * @memberof NIPackedArrayDataAdaptor
     */
    static PackDataValue(builder, complexDataToPack, niType) {
        complexDataToPack = new window.NIComplex(complexDataToPack);
        NIFlatBuffers.PackedData.PackedComplexFloat32Value.startPackedComplexFloat32Value(builder);
        NIFlatBuffers.PackedData.PackedComplexFloat32Value.addImaginary(builder, complexDataToPack.imaginaryPart);
        NIFlatBuffers.PackedData.PackedComplexFloat32Value.addReal(builder, complexDataToPack.realPart);
        return NIFlatBuffers.PackedData.PackedComplexFloat32Value.endPackedComplexFloat32Value(builder);
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
     * Gets the type of this array as an NIType
     * @returns The NIType
     */
    getType() {
        return this.niType;
    }
    /**
     * Unpacks this complex into into a standard JavaScript object
     * @returns the unpacked JS NIComplex object in string format
     */
    unpack() {
        const complexValue = new NIFlatBuffers.PackedData.PackedComplexFloat32Value();
        complexValue.__init(this.packedData.bb_pos, this.packedData.bb);
        return new window.NIComplex(complexValue.real(), complexValue.imaginary()).toString();
    }
}
//# sourceMappingURL=niPackedComplexSingleAdaptor.js.map