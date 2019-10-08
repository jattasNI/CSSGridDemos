import { NationalInstruments as NIFlatBuffers } from "./PackedDataValues_generated.js";
import { NIPackedArrayDataAdaptor } from "./niPackedArrayAdaptor.js";
import { NIPackedClusterDataAdaptor } from "./niPackedClusterDataAdaptor.js";
import { NIPackedComplexDoubleAdaptor } from "./niPackedComplexDoubleAdaptor.js";
import { NIPackedComplexSingleAdaptor } from "./niPackedComplexSingleAdaptor.js";
import { NIPackedLongDataAdaptor } from "./niPackedLongDataAdaptor.js";
import { NIPackedTimestampAdaptor } from "./niPackedTimestampAdaptor.js";
import { NIPackedValueAdaptor } from "./niPackedValueAdaptor.js";
import { NIPackedWaveformAdaptor } from "./niPackedWaveformAdaptor.js";
import { PackedGenericClusterValue } from "./niPackedClusterValue.js";
const NITypeNames = window.NITypeNames;
/**
 * Helper class to get a data adaptor for flattend data given the niType of the data
 */
export class NIPackedDataAdaptors {
    /**
     * Packs an object into a shared memory packed data value
     * @static
     * @param {any} dataToPack data value to pack
     * @param {NIType} niType NIType of the object to pack
     * @returns {string} shared memory ID of the buffer which holds the packed value
     * @memberof NIPackedDataAdaptors
     */
    static PackDataIntoSharedMemory(dataToPack, niType) {
        const packedData = NIPackedDataAdaptors.PackData(dataToPack, niType);
        const transferBuffer = browserMessaging.getSharedData("", packedData.length);
        new Uint8Array(transferBuffer).set(packedData);
        return browserMessaging.getSharedDataId(transferBuffer);
    }
    /**
     * Packs an object into a packed data value
     * @static
     * @param {any} dataToPack data value to pack
     * @param {NIType} niType NIType of the object to pack
     * @returns {Uint8Array} Buffer containing the packed data value
     * @memberof NIPackedDataAdaptors
     */
    static PackData(dataToPack, niType) {
        const builder = new flatbuffers.Builder(1024);
        const dataOffset = NIPackedDataAdaptors.PackDataValue(builder, dataToPack, niType, false, 0);
        if (dataOffset !== 0) {
            NIFlatBuffers.PackedData.PackedDataValue.startPackedDataValue(builder);
            NIFlatBuffers.PackedData.PackedDataValue.addValue(builder, dataOffset);
            const dataValue = NIFlatBuffers.PackedData.PackedDataValue.endPackedDataValue(builder);
            builder.finish(dataValue);
            return builder.asUint8Array();
        }
    }
    /**
     * Packs a single value using the provided flat buffer builder
     * @static
     * @param {flatbuffers.Builder} builder the builder to use to pack the data value
     * @param {*} dataToPack the value to pack
     * @param {NIType} niType the NIType of the data value
     * @param {boolean} packInline true to pack the value inline as a field if possible
     * @param {number} fieldOffset the field offset of the inlined packed value
     * @returns {number} flat buffer offset of the data value if it was not packed inline
     * @memberof NIPackedDataAdaptors
     */
    static PackDataValue(builder, dataToPack, niType, packInline, fieldOffset) {
        let dataOffset = 0;
        switch (niType.getName()) {
            case NITypeNames.BOOLEAN:
                if (packInline) {
                    builder.addFieldInt8(fieldOffset, Number(dataToPack), Number(false));
                }
                else {
                    NIFlatBuffers.PackedData.PackedBooleanValue.startPackedBooleanValue(builder);
                    NIFlatBuffers.PackedData.PackedBooleanValue.addValue(builder, dataToPack);
                    dataOffset = NIFlatBuffers.PackedData.PackedBooleanValue.endPackedBooleanValue(builder);
                }
                break;
            case NITypeNames.UINT8:
                if (packInline) {
                    builder.addFieldInt8(fieldOffset, dataToPack, 0);
                }
                else {
                    NIFlatBuffers.PackedData.PackedUInt8Value.startPackedUInt8Value(builder);
                    NIFlatBuffers.PackedData.PackedUInt8Value.addValue(builder, dataToPack);
                    dataOffset = NIFlatBuffers.PackedData.PackedUInt8Value.endPackedUInt8Value(builder);
                }
                break;
            case NITypeNames.UINT16:
                if (packInline) {
                    builder.addFieldInt16(fieldOffset, dataToPack, 0);
                }
                else {
                    NIFlatBuffers.PackedData.PackedUInt16Value.startPackedUInt16Value(builder);
                    NIFlatBuffers.PackedData.PackedUInt16Value.addValue(builder, dataToPack);
                    dataOffset = NIFlatBuffers.PackedData.PackedUInt16Value.endPackedUInt16Value(builder);
                }
                break;
            case NITypeNames.UINT32:
                if (packInline) {
                    builder.addFieldInt32(fieldOffset, dataToPack, 0);
                }
                else {
                    NIFlatBuffers.PackedData.PackedUInt32Value.startPackedUInt32Value(builder);
                    NIFlatBuffers.PackedData.PackedUInt32Value.addValue(builder, dataToPack);
                    dataOffset = NIFlatBuffers.PackedData.PackedUInt32Value.endPackedUInt32Value(builder);
                }
                break;
            case NITypeNames.UINT64:
                dataOffset = NIPackedLongDataAdaptor.PackDataValue(builder, dataToPack, packInline, fieldOffset);
                break;
            case NITypeNames.INT8:
                if (packInline) {
                    builder.addFieldInt8(fieldOffset, dataToPack, 0);
                }
                else {
                    NIFlatBuffers.PackedData.PackedInt8Value.startPackedInt8Value(builder);
                    NIFlatBuffers.PackedData.PackedInt8Value.addValue(builder, dataToPack);
                    dataOffset = NIFlatBuffers.PackedData.PackedInt8Value.endPackedInt8Value(builder);
                }
                break;
            case NITypeNames.INT16:
                if (packInline) {
                    builder.addFieldInt16(fieldOffset, dataToPack, 0);
                }
                else {
                    NIFlatBuffers.PackedData.PackedInt16Value.startPackedInt16Value(builder);
                    NIFlatBuffers.PackedData.PackedInt16Value.addValue(builder, dataToPack);
                    dataOffset = NIFlatBuffers.PackedData.PackedInt16Value.endPackedInt16Value(builder);
                }
                break;
            case NITypeNames.INT32:
                if (packInline) {
                    builder.addFieldInt32(fieldOffset, dataToPack, 0);
                }
                else {
                    NIFlatBuffers.PackedData.PackedInt32Value.startPackedInt32Value(builder);
                    NIFlatBuffers.PackedData.PackedInt32Value.addValue(builder, dataToPack);
                    dataOffset = NIFlatBuffers.PackedData.PackedInt32Value.endPackedInt32Value(builder);
                }
                break;
            case NITypeNames.INT64:
                dataOffset = NIPackedLongDataAdaptor.PackDataValue(builder, dataToPack, packInline, fieldOffset);
                break;
            case NITypeNames.SINGLE:
                if (packInline) {
                    builder.addFieldFloat32(fieldOffset, dataToPack, 0);
                }
                else {
                    NIFlatBuffers.PackedData.PackedFloat32Value.startPackedFloat32Value(builder);
                    NIFlatBuffers.PackedData.PackedFloat32Value.addValue(builder, dataToPack);
                    dataOffset = NIFlatBuffers.PackedData.PackedFloat32Value.endPackedFloat32Value(builder);
                }
                break;
            case NITypeNames.DOUBLE:
                if (packInline) {
                    builder.addFieldFloat64(fieldOffset, dataToPack, 0);
                }
                else {
                    NIFlatBuffers.PackedData.PackedFloat64Value.startPackedFloat64Value(builder);
                    NIFlatBuffers.PackedData.PackedFloat64Value.addValue(builder, dataToPack);
                    dataOffset = NIFlatBuffers.PackedData.PackedFloat64Value.endPackedFloat64Value(builder);
                }
                break;
            case NITypeNames.STRING: {
                const stringOffset = builder.createString(dataToPack);
                if (packInline) {
                    dataOffset = stringOffset;
                }
                else {
                    NIFlatBuffers.PackedData.PackedStringValue.startPackedStringValue(builder);
                    NIFlatBuffers.PackedData.PackedStringValue.addValue(builder, stringOffset);
                    dataOffset = NIFlatBuffers.PackedData.PackedStringValue.endPackedStringValue(builder);
                }
                break;
            }
            case NITypeNames.ARRAY:
                dataOffset = NIPackedArrayDataAdaptor.PackDataValue(builder, dataToPack, niType);
                break;
            case NITypeNames.CLUSTER:
                dataOffset = NIPackedClusterDataAdaptor.PackDataValue(builder, dataToPack, niType);
                break;
            case NITypeNames.COMPLEXSINGLE:
                dataOffset = NIPackedComplexSingleAdaptor.PackDataValue(builder, dataToPack, niType);
                break;
            case NITypeNames.COMPLEXDOUBLE:
                dataOffset = NIPackedComplexDoubleAdaptor.PackDataValue(builder, dataToPack, niType);
                break;
            case NITypeNames.TIMESTAMP:
                dataOffset = NIPackedTimestampAdaptor.PackDataValue(builder, dataToPack);
                break;
            case NITypeNames.ANALOGWAVEFORM:
                dataOffset = NIPackedWaveformAdaptor.PackDataValue(builder, dataToPack, niType);
                break;
            // TODO: implement remaining types
            // case NITypeNames.PATH:
            // case NITypeNames.ENUM:
            // case NITypeNames.DIGITALWAVEFORM:
        }
        return dataOffset;
    }
    /**
     * Gets a data adaptor for the root object in the packed data
     * @param packedData the array containing the packed data
     * @param niType The NIType of the packed data
     * @returns INIPackedDataAdaptor for the root object in the packed data
     */
    static GetDataAdaptorFromRoot(packedData, niType, options) {
        const buffer = new flatbuffers.ByteBuffer(packedData);
        switch (niType.getName()) {
            case NITypeNames.BOOLEAN:
                return new NIPackedValueAdaptor(NIFlatBuffers.PackedData.PackedBooleanValue.getRootAsPackedBooleanValue(buffer), niType, options);
            case NITypeNames.UINT8:
                return new NIPackedValueAdaptor(NIFlatBuffers.PackedData.PackedUInt8Value.getRootAsPackedUInt8Value(buffer), niType, options);
            case NITypeNames.UINT16:
                return new NIPackedValueAdaptor(NIFlatBuffers.PackedData.PackedUInt16Value.getRootAsPackedUInt16Value(buffer), niType, options);
            case NITypeNames.UINT32:
                return new NIPackedValueAdaptor(NIFlatBuffers.PackedData.PackedUInt32Value.getRootAsPackedUInt32Value(buffer), niType, niType, options);
            case NITypeNames.UINT64:
                return new NIPackedLongDataAdaptor(NIFlatBuffers.PackedData.PackedUInt64Value.getRootAsPackedUInt64Value(buffer), niType, niType, options);
            case NITypeNames.INT8:
                return new NIPackedValueAdaptor(NIFlatBuffers.PackedData.PackedInt8Value.getRootAsPackedInt8Value(buffer), niType, options);
            case NITypeNames.INT16:
                return new NIPackedValueAdaptor(NIFlatBuffers.PackedData.PackedInt16Value.getRootAsPackedInt16Value(buffer), niType, options);
            case NITypeNames.INT32:
                return new NIPackedValueAdaptor(NIFlatBuffers.PackedData.PackedInt32Value.getRootAsPackedInt32Value(buffer), niType, options);
            case NITypeNames.INT64:
                return new NIPackedLongDataAdaptor(NIFlatBuffers.PackedData.PackedInt64Value.getRootAsPackedInt64Value(buffer), niType, options);
            case NITypeNames.SINGLE:
                return new NIPackedValueAdaptor(NIFlatBuffers.PackedData.PackedFloat32Value.getRootAsPackedFloat32Value(buffer), niType, options);
            case NITypeNames.DOUBLE:
                return new NIPackedValueAdaptor(NIFlatBuffers.PackedData.PackedFloat64Value.getRootAsPackedFloat64Value(buffer), niType, options);
            case NITypeNames.STRING:
                return new NIPackedValueAdaptor(NIFlatBuffers.PackedData.PackedStringValue.getRootAsPackedStringValue(buffer), niType, options);
            case NITypeNames.CLUSTER:
                return new NIPackedClusterDataAdaptor(PackedGenericClusterValue.getRootAsPackedCluster(buffer), niType, options);
            case NITypeNames.ARRAY:
                return new NIPackedArrayDataAdaptor(NIFlatBuffers.PackedData.PackedArrayValue.getRootAsPackedArrayValue(buffer), niType, options);
            case NITypeNames.COMPLEXSINGLE:
                return new NIPackedComplexSingleAdaptor(NIFlatBuffers.PackedData.PackedComplexFloat32Value.getRootAsPackedComplexFloat32Value(buffer), niType, options);
            case NITypeNames.COMPLEXDOUBLE:
                return new NIPackedComplexDoubleAdaptor(NIFlatBuffers.PackedData.PackedComplexFloat64Value.getRootAsPackedComplexFloat64Value(buffer), niType, options);
            case NITypeNames.TIMESTAMP:
                return new NIPackedTimestampAdaptor(NIFlatBuffers.PackedData.PackedTimestampValue.getRootAsPackedTimestampValue(buffer), niType, options);
            case NITypeNames.ANALOGWAVEFORM:
                return new NIPackedWaveformAdaptor(NIFlatBuffers.PackedData.PackedWaveformValue.getRootAsPackedWaveformValue(buffer), niType, options);
            // TODO: implement remaining types
            // case NITypeNames.PATH:
            // case NITypeNames.ENUM:
            // case NITypeNames.DIGITALWAVEFORM:
        }
        return undefined;
    }
    /**
     * Gets a data adaptor from the provided packedData and niType
     * @param packedData the array containing the packed data
     * @param niType The NIType of the packed data
     * @returns INIPackedDataAdaptor for the root object in the packed data
     */
    static GetDataAdaptorFromPackedValue(packedData, niType, options) {
        const buffer = new flatbuffers.ByteBuffer(packedData);
        const packedDataValue = NIFlatBuffers.PackedData.PackedDataValue.getRootAsPackedDataValue(buffer);
        return this.GetDataAdaptorFromIndex(packedDataValue.value({}), niType, options);
    }
    /**
     * Gets a type specific data adaptor from a data element buffer reference
     * @param dataElement The packed data value to get a data adaptor for
     * @param niType The NIType of the data
     * @returns The data adaptor for the packed data
     */
    static GetDataAdaptorFromIndex(dataElement, niType, options) {
        switch (niType.getName()) {
            case NITypeNames.BOOLEAN:
                return new NIPackedValueAdaptor(new NIFlatBuffers.PackedData.PackedBooleanValue().__init(dataElement.bb_pos, dataElement.bb), niType, options);
            case NITypeNames.UINT8:
                return new NIPackedValueAdaptor(new NIFlatBuffers.PackedData.PackedUInt8Value().__init(dataElement.bb_pos, dataElement.bb), niType, options);
            case NITypeNames.UINT16:
                return new NIPackedValueAdaptor(new NIFlatBuffers.PackedData.PackedUInt16Value().__init(dataElement.bb_pos, dataElement.bb), niType, options);
            case NITypeNames.UINT32:
                return new NIPackedValueAdaptor(new NIFlatBuffers.PackedData.PackedUInt32Value().__init(dataElement.bb_pos, dataElement.bb), niType, options);
            case NITypeNames.UINT64:
                return new NIPackedLongDataAdaptor(new NIFlatBuffers.PackedData.PackedUInt64Value().__init(dataElement.bb_pos, dataElement.bb), niType, options);
            case NITypeNames.INT8:
                return new NIPackedValueAdaptor(new NIFlatBuffers.PackedData.PackedInt8Value().__init(dataElement.bb_pos, dataElement.bb), niType, options);
            case NITypeNames.INT16:
                return new NIPackedValueAdaptor(new NIFlatBuffers.PackedData.PackedInt16Value().__init(dataElement.bb_pos, dataElement.bb), niType, options);
            case NITypeNames.INT32:
                return new NIPackedValueAdaptor(new NIFlatBuffers.PackedData.PackedInt32Value().__init(dataElement.bb_pos, dataElement.bb), niType, options);
            case NITypeNames.INT64:
                return new NIPackedLongDataAdaptor(new NIFlatBuffers.PackedData.PackedInt64Value().__init(dataElement.bb_pos, dataElement.bb), niType, options);
            case NITypeNames.SINGLE:
                return new NIPackedValueAdaptor(new NIFlatBuffers.PackedData.PackedFloat32Value().__init(dataElement.bb_pos, dataElement.bb), niType, options);
            case NITypeNames.DOUBLE:
                return new NIPackedValueAdaptor(new NIFlatBuffers.PackedData.PackedFloat64Value().__init(dataElement.bb_pos, dataElement.bb), niType, options);
            case NITypeNames.STRING:
                return new NIPackedValueAdaptor(new NIFlatBuffers.PackedData.PackedStringValue().__init(dataElement.bb_pos, dataElement.bb), niType, options);
            case NITypeNames.CLUSTER:
                return new NIPackedClusterDataAdaptor(new PackedGenericClusterValue(dataElement.bb_pos, dataElement.bb), niType, options);
            case NITypeNames.ARRAY:
                return new NIPackedArrayDataAdaptor(new NIFlatBuffers.PackedData.PackedArrayValue().__init(dataElement.bb_pos, dataElement.bb), niType, options);
            case NITypeNames.COMPLEXSINGLE:
                return new NIPackedComplexSingleAdaptor(new NIFlatBuffers.PackedData.PackedComplexFloat32Value().__init(dataElement.bb_pos, dataElement.bb), niType, options);
            case NITypeNames.COMPLEXDOUBLE:
                return new NIPackedComplexDoubleAdaptor(new NIFlatBuffers.PackedData.PackedComplexFloat64Value().__init(dataElement.bb_pos, dataElement.bb), niType, options);
            case NITypeNames.TIMESTAMP:
                return new NIPackedTimestampAdaptor(new NIFlatBuffers.PackedData.PackedTimestampValue().__init(dataElement.bb_pos, dataElement.bb), niType, options);
            case NITypeNames.ANALOGWAVEFORM:
                return new NIPackedWaveformAdaptor(new NIFlatBuffers.PackedData.PackedWaveformValue().__init(dataElement.bb_pos, dataElement.bb), niType, options);
            // TODO: implement remaining types
            // case NITypeNames.PATH:
            // case NITypeNames.ENUM:
            // case NITypeNames.DIGITALWAVEFORM:
        }
        return undefined;
    }
    /**
     * Packs a single type using the provided flat buffer builder
     * @static
     * @param {flatbuffers.Builder} builder the builder to use to pack the data value
     * @param {NIType} niType the NIType to be packed
     * @param {number} fieldOffset the field offset of the inlined packed value
     * @returns {number} flat buffer offset of the data value if it was not packed inline
     * @memberof NIPackedDataAdaptors
     */
    static PackDataType(builder, niType) {
        let typeOffset = 0;
        switch (niType.getName()) {
            // TODO: implement remaining types (feature 86050)
            case NITypeNames.ARRAY:
                throw new Error("Pack array type not implemented.");
            //     typeOffset = NIFlatBuffers.PackedData.NIPackedArrayDataAdaptor.PackDataType(builder, niType);
            //     break;
            case NITypeNames.CLUSTER:
                throw new Error("Pack cluster type not implemented.");
            //     typeOffset = NIFlatBuffers.PackedData.NIPackedClusterDataAdaptor.PackDataType(builder, niType);
            //     break;
            case NITypeNames.ANALOGWAVEFORM:
            case NITypeNames.DIGITALWAVEFORM:
                throw new Error("Pack waveform type not implemented.");
            default: {
                const scalarType = this.ToFlatBufferScalarType(niType);
                const scalarTypeOffset = NIFlatBuffers.PackedData.PackedScalarType.createPackedScalarType(builder, scalarType, 0);
                typeOffset = NIFlatBuffers.PackedData.PackedDataType.createPackedDataType(builder, NIFlatBuffers.PackedData.AnyPackedType.PackedScalarType, scalarTypeOffset);
            }
        }
        return typeOffset;
    }
    /**
     * Converts NIType to flatbuffer type
     * @param {NIType} niType the NIType to be packed
     */
    static ToFlatBufferScalarType(niType) {
        switch (niType.getName()) {
            case NITypeNames.BOOLEAN:
                return NIFlatBuffers.PackedData.AnyValue.PackedBooleanValue;
            case NITypeNames.UINT8:
                return NIFlatBuffers.PackedData.AnyValue.PackedUInt8Value;
            case NITypeNames.UINT16:
                return NIFlatBuffers.PackedData.AnyValue.PackedUInt16Value;
            case NITypeNames.UINT32:
                return NIFlatBuffers.PackedData.AnyValue.PackedUInt32Value;
            case NITypeNames.UINT64:
                return NIFlatBuffers.PackedData.AnyValue.PackedUInt64Value;
            case NITypeNames.INT8:
                return NIFlatBuffers.PackedData.AnyValue.PackedInt8Value;
            case NITypeNames.INT16:
                return NIFlatBuffers.PackedData.AnyValue.PackedInt16Value;
            case NITypeNames.INT32:
                return NIFlatBuffers.PackedData.AnyValue.PackedInt32Value;
            case NITypeNames.INT64:
                return NIFlatBuffers.PackedData.AnyValue.PackedInt64Value;
            case NITypeNames.SINGLE:
                return NIFlatBuffers.PackedData.AnyValue.PackedFloat32Value;
            case NITypeNames.DOUBLE:
                return NIFlatBuffers.PackedData.AnyValue.PackedFloat64Value;
            case NITypeNames.STRING:
                return NIFlatBuffers.PackedData.AnyValue.PackedStringValue;
            // TODO: implement remaining types (feature 86050)
            // case NITypeNames.PATH:
            // case NITypeNames.ENUM:
        }
        return NIFlatBuffers.PackedData.AnyValue.NONE;
    }
}
//# sourceMappingURL=niPackedDataAdaptors.js.map