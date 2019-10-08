//****************************************
// TextAlignment Value Convertor
// National Instruments Copyright 2018
//****************************************
export class TextAlignmentValueConverter {
    static convertTextAlignmentToFlexAlignment(textAlignment) {
        let justifyContent = "flex-start";
        switch (textAlignment) {
            case "center":
                justifyContent = "center";
                break;
            case "right":
                justifyContent = "flex-end";
                break;
            case "left":
                justifyContent = "flex-start";
                break;
        }
        return justifyContent;
    }
    static convertFlexAlignmentToTextAlignment(justifyContent) {
        let textAlignment = "left";
        switch (justifyContent) {
            case "center":
                textAlignment = "center";
                break;
            case "flex-end":
                textAlignment = "right";
                break;
            case "flex-start":
                textAlignment = "left";
                break;
        }
        return textAlignment;
    }
}
//# sourceMappingURL=niTextAlignmentValueConverter.js.map