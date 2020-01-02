// The result of the implementation of this class is 1 entry
class jtTOCEntry {
    constructor(jtDataReader) {
        this.jtDataReader = jtDataReader;
        this.guidSegID = "";
        this.segmentOffset = 0;
        this.segmentlength = 0;
        this.segmentAttribute = 0;
    }
    read() {
        var i, segmentGUID = [];

        // Read the 16 bytes of GUID
        for (i = 0; i < 16; ++i) {
            segmentGUID.push(this.jtDataReader.getData8().toString(16));
        }
        this.guidSegID = segmentGUID.join("");
        this.segmentOffset = this.jtDataReader.getData32(0);
        segmentOffsets.push(this.segmentOffset);                // Each segment offset will be stored in array 
        this.segmentlength = this.jtDataReader.getData32(0);
        this.segmentAttribute = this.jtDataReader.getData32(0).toString(16);
        segmentAttributes.push(this.segmentAttribute);          // Each segment attributes will be stored in array
    }

    print() {
        bodyAppend("p", "guidSegID: " + this.guidSegID);
        bodyAppend("p", "  segmentOffset: " + this.segmentOffset);
        bodyAppend("p", "  segmentlength: " + this.segmentlength);
        bodyAppend("p", "  segmentAttribute: " + this.segmentAttribute);
    }
}

// Shows the whole entries of jtTOCEntry
class jtTOC {
    constructor(jtDataReader) {
        this.jtDataReader = jtDataReader;
        this.entryCount = 0;
        this.tocEntries = [];
    }

    read() {
        var oneEntry;
        this.entryCount = this.jtDataReader.getData32(0);
        // Read how many entries exist and store them in array tocEntries
        for (x = 0; x < this.entryCount; ++x) {
            oneEntry = new jtTOCEntry(this.jtDataReader);
            oneEntry.read();
            this.tocEntries.push(oneEntry);
        }
    }

    // Print the total of entry counts and the whole data of each entry
    print() {
        var x;
        bodyAppend("p", "EntryCount:" + this.entryCount);
        for (x = 0; x < this.entryCount; ++x) {
            this.tocEntries[x].print();
        }
    }
}