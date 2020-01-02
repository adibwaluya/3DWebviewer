class jtHeader {
    constructor(jtDataReader) {
        this.jtDataReader = jtDataReader;
        this.versionString = "";
        this.byteOrder = 0;
        this.emptyField = 0;
        this.tocOffset = 0;
        this.LSGSegmentID = "";
    }
    read() {
        var i, rawData = [], rawDataGUID = [];

        // Read the first 80 bytes of data and save them in array rawDataGUID
        for (i = 0; i < 80; ++i) {
            rawData.push(String.fromCharCode(this.jtDataReader.getData8()));
        }

        // Read other elements of File Header
        this.versionString = rawData.join("").trim();
        this.byteOrder = this.jtDataReader.getData8();
        this.emptyField = this.jtDataReader.getData32(0);
        this.tocOffset = this.jtDataReader.getData32(0).toString(16);
        // Read the 16 bytes of GUID
        for (i = 0; i < 16; ++i) {
            rawDataGUID.push(this.jtDataReader.getData8().toString(16));
        }
        this.LSGSegmentID = rawDataGUID.join("");
    }

    // Print in browser
    print() {
        bodyAppend("p", "versionString: " + this.versionString);
        bodyAppend("p", "byteOrder: " + this.byteOrder);
        bodyAppend("p", "emptyField: " + this.emptyField);
        bodyAppend("p", "tocOffset: " + this.tocOffset);
        bodyAppend("p", "LSGSegmentID: " + this.LSGSegmentID);
    }
}