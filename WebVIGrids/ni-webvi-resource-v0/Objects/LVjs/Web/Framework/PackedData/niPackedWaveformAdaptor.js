import { NIArrayUnpacker, NIPackedArrayDataAdaptor } from "./niPackedArrayAdaptor.js";
import { NationalInstruments as NIFlatBuffers } from "./PackedDataValues_generated.js";
import { NIPackedDataAdaptors } from "./niPackedDataAdaptors.js";
import { NIPackedTimestampAdaptor } from "./niPackedTimestampAdaptor.js";
/**
 * Adaptor for Waveform type
 */
export class NIPackedWaveformAdaptor {
    /**
     * Creates an instance adaptor class.
     * @param packedData the packed data to wrap
     * @param niType The type ofthe packed data
     */
    constructor(packedData, niType, options) {
        this.niType = niType;
        this.packedData = packedData;
        this.options = options;
    }
    /**
     * Packs a Waveform value into a flat buffer
     * @static
     * @param {flatbuffers.Builder} builder the builder to use for packing the data value
     * @param {NIWaveform} waveformDataToPack the Waveform value to pack
     * @param {NIType} niType the data type of the array
     * @returns {number} the buffer offset of the packed Waveform value
     * @memberof NIPackedWaveformAdaptor
     */
    static PackDataValue(builder, waveformDataToPack, niType) {
        const t0Offset = NIPackedTimestampAdaptor.PackDataValue(builder, waveformDataToPack.t0);
        const yOffset = NIPackedArrayDataAdaptor.PackDataValue(builder, waveformDataToPack.Y, niType.getSubtype().makeArray(1));
        const attributesOffset = NIPackedWaveformAdaptor.PackChannelNameAttribute(builder, waveformDataToPack.channelName);
        // TODO US 181345 - NIPackedVariantDataAdaptor.PackDataValue(builder, waveformDataToPack.attributes);
        return NIFlatBuffers.PackedData.PackedWaveformValue.createPackedWaveformValue(builder, t0Offset, waveformDataToPack.dt, yOffset, attributesOffset);
    }
    static PackChannelNameAttribute(builder, channelName) {
        if (typeof channelName === "string") {
            return NIPackedWaveformAdaptor.PackVariant(builder, null, window.NITypes.VOID, [NIPackedWaveformAdaptor.channelNameAttributeName], [channelName]);
        }
    }
    static PackVariant(builder, data, dataType, attributeNames, attributeValues) {
        const dataValueOffset = NIPackedDataAdaptors.PackDataValue(builder, data, dataType, false, 0);
        let dataOffset = 0;
        if (dataValueOffset !== 0) {
            NIFlatBuffers.PackedData.PackedDataValue.startPackedDataValue(builder);
            NIFlatBuffers.PackedData.PackedDataValue.addValue(builder, dataValueOffset);
            dataOffset = NIFlatBuffers.PackedData.PackedDataValue.endPackedDataValue(builder);
        }
        const typeOffset = NIPackedDataAdaptors.PackDataType(builder, dataType);
        const attributeNameOffsets = attributeNames.map((name) => builder.createString(name));
        const attributeNamesOffset = NIFlatBuffers.PackedData.PackedVariantValue.createAttributeNamesVector(builder, attributeNameOffsets);
        // only support string attributes for now
        const attributeValueOffsets = attributeValues.map((value) => NIPackedWaveformAdaptor.PackVariant(builder, value, window.NITypes.STRING, [], []));
        const attributeValuesOffset = NIFlatBuffers.PackedData.PackedVariantValue.createAttributeValuesVector(builder, attributeValueOffsets);
        NIFlatBuffers.PackedData.PackedVariantValue.startPackedVariantValue(builder);
        NIFlatBuffers.PackedData.PackedVariantValue.addData(builder, dataOffset);
        NIFlatBuffers.PackedData.PackedVariantValue.addDataType(builder, typeOffset);
        NIFlatBuffers.PackedData.PackedVariantValue.addAttributeNames(builder, attributeNamesOffset);
        NIFlatBuffers.PackedData.PackedVariantValue.addAttributeValues(builder, attributeValuesOffset);
        return NIFlatBuffers.PackedData.PackedVariantValue.endPackedVariantValue(builder);
    }
    /**
     * Gets the type of this Waveform as an NIType
     * @returns The NIType
     */
    getType() {
        return this.niType;
    }
    /**
     * Unpacks this waveform into into a standard JavaScript object
     * @returns the unpacked JS NIWaveform object
     */
    unpack() {
        const waveformValue = new NIFlatBuffers.PackedData.PackedWaveformValue();
        waveformValue.__init(this.packedData.bb_pos, this.packedData.bb);
        const niWaveform = new window.NIAnalogWaveform();
        niWaveform.dt = waveformValue.dt();
        niWaveform.t0 = NIPackedTimestampAdaptor.UnpackFromData(waveformValue.t0());
        const yUnpacker = new NIArrayUnpacker(waveformValue.y(), this.niType.getSubtype().makeArray(1), this.options);
        niWaveform.Y = yUnpacker.unpack();
        // Only unpack channel name attribute
        // TODO: complete attribute unpacking (US 181345)
        const attributes = waveformValue.attributes();
        if (attributes !== null) {
            for (let i = 0; i < attributes.attributeNamesLength(); i++) {
                if (attributes.attributeNames(i) === NIPackedWaveformAdaptor.channelNameAttributeName) {
                    const attributeValue = attributes.attributeValues(i);
                    const dataType = NITypeUtils.ToNIType(attributeValue.dataType());
                    if (dataType.isString()) {
                        niWaveform.channelName = attributeValue.data(new NIFlatBuffers.PackedData.PackedStringValue()).value();
                    }
                }
            }
        }
        return niWaveform;
    }
}
NIPackedWaveformAdaptor.channelNameAttributeName = "NI_ChannelName";
//# sourceMappingURL=niPackedWaveformAdaptor.js.map