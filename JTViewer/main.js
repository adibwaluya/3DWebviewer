// Load JT-Datei to web browser
var streamReader;
//var TOC;
var i, x,
    segmentGUID = [], 
    segmentOffsets = [], 
    segmentlengths = [], 
    segmentAttributes = [], 
    lodPosition = [];

class JTDataReader {
    constructor(filename) {
        this.jtFile = new FileReader();
        this.position = 0;
        this.jtFile.readAsArrayBuffer(filename);
        this.isdone = false;
        this.bitsLeft = 0;
        this.jtFile.addEventListener('load', this.initArray.bind(this));
    }
    
    // Read 8/16/32 bits of Data from Array
    initArray() {
        this.data8Array = new Uint8Array(this.jtFile.result);
        this.isdone = true;
    }

    // Read each character (1 Btye) of hexadecimal and save it in an Array as decimal
    getData8() {
        return this.data8Array[this.position++];
    }

    // Methode to implement Endianness (big or little endian)
    // Parameter amo is the amount of bytes
    // Parameter endi is used to determine whether "big" or "little" endian will be implemented
    // endi = 0 --> little endian, endi = 1 --> big endian
    universalGetData(amo, endi) {
        var i, val = 0;
        if (endi == 0) {
            for (i = 0; i < amo; ++i) {
                val = val | (this.data8Array[this.position++] << (i * 8))
            }
        } else {
            for (i = (amo - 1); i >= 0; --i) {
                val = val | (this.data8Array[this.position++] << (i * 8))
            }
        }
        return val;
    }

    // Read 2 bytes of Data
    getData16(endi) {
        return this.universalGetData(2, endi);
    }

    // Read 4 bytes of Data
    getData32(endi) {
        return this.universalGetData(4, endi);
    }
};

// Read certain amount of Bits of Data
// TODO: This methode still need to be fixed and improved
class JTBitReader {
    constructor(jtDataReader) {
        this.jtDataReader = jtDataReader;
        this.data = jtDataReader.getData32(1); 
        this.old = this.data;
        this.bitsLeft = 32;
    }

    getBits(numBits) {
        var buildBits = 0;

        if (this.bitsLeft < numBits) {
            if (this.bitsLeft != 0) {
                numBits = numBits - this.bitsLeft;
                buildBits = this.data << (numBits);
            }
            this.data = this.jtDataReader.getData32(1);
            this.bitsLeft = 32;
        }
        this.bitsLeft = this.bitsLeft - numBits;
        buildBits = buildBits | (this.data >>> (this.bitsLeft));
        this.data = this.data & (0xFFFFFFFF >>> (32 - this.bitsLeft));

        return buildBits;
    }
}

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
        this.tocOffset = this.jtDataReader.getData32(0);
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

// To analyze the positions of determined segment type (type 6 = Shape) in the data 
// Redirect only to position/segment offset that has type 6 (Shape)
function getPosition() {
    var i;
    for (i = 0; i < segmentAttributes.length; ++i) {    // total of data that has type 6
        if (segmentAttributes[i] == 6000000) {        // 6000000 in hexa (type 6)
            streamReader.position = segmentOffsets[i];
            lodPosition.push(streamReader.position);    // Store the positions in array
        }
    }
    streamReader.position = 0;
}

class jtSegments {
    constructor(jtDataReader) {
        this.jtDataReader = jtDataReader;
        this.segID = "";
        this.segmentType = 0;
        this.segmentlength = 0;
    }

    read() {
        var segIDs = [];

        // Read the 16 bytes of each segment IDs of Segment Header
        for (i = 0; i < 16; ++i) {
            segIDs.push(this.jtDataReader.getData8().toString(16));
        }
        this.segID = segIDs.join("");
        this.segmentType = this.jtDataReader.getData32(0);
        this.segmentlength = this.jtDataReader.getData32(0);
    }

    print() {
        bodyAppend("p", "LOD Segment");
        bodyAppend("p", "SegID: " + this.segID);
        bodyAppend("p", "Segment Type: " + this.segmentType);       // Segment type 6 for shape
        bodyAppend("p", "Segment Length: " + this.segmentlength);   // Printed as decimal
    }
}

// Compressed Data Packet mk.2
// Still need to be fixed and improved
class CDP2 { // Figure 150 (left side missing)
    constructor(jtDataReader, predictorType) {
        this.jtDataReader = jtDataReader;
        this.valueCount = 0;
        this.CODECType = 0;
        this.codeTextLength = 0;
        this.predictorType = 0;    // not implemented yet
        this.probabilityContexts = null; // not implemented yet
        this.OOBValues = []; // not implemented yet
        this.encodedData = [];
        this.decodedData = [];
    }

    decodeBitlength(valCount, ctLength, encodedData) {
        var cBitsInMinSymbol, cBitsInMaxSymbol;
        var dataReader = new JTDataReader();
        dataReader.initFromArray(encodedData);
        var bitReader = new JTBitReader(dataReader, 0);
        var isVariable = bitReader.getBits(1);

        if (isVariable == 0) {
            cBitsInMinSymbol = bitReader.getBits(6);
            cBitsInMaxSymbol = bitReader.getBits(6);
            // just for testing
            bodyAppend("p", "cBitsInMinSymbol: " + cBitsInMinSymbol.toString(2));
            bodyAppend("p", "cBitsInMaxSymbol: " + cBitsInMaxSymbol.toString(2));

            //...
        } else {
            // not implemented yet
        }
    }

    read() {
        var i, vals2read = 0;
        this.valueCount = this.jtDataReader.getData32(0);
        this.CODECType = this.jtDataReader.getData8();

        if (this.CODECType < 4) {
            this.codeTextLength = this.jtDataReader.getData32(0);
            vals2read = Math.ceil(this.codeTextLength / 32.);
            for (i = 0; i < vals2read; ++i) {
                this.encodedData.push(this.jtDataReader.getData32(0));
            }
            if (this.CODECType == 3) { // Arithmetic 
                // read prob context
                // read oob Values
                // decode
            } else if (this.CODECType == 1) { // BitLength
                this.decodedData = this.decodeBitlength(this.valueCount, this.codeTextLength, this.encodedData);
            } else if (this.CODECType == 0) { // NULL decoder
                for (i = 0; i < this.valueCount; ++i) {
                    this.decodedData.push(this.encodedData[i]);
                }
            }
        } else {
            //Anything else but none/bitLength or Arithmitic: not yet implemented
        }
    }
    print() {
        bodyAppend("p", "versionString: " + this.versionString);
        bodyAppend("p", "byteOrder: " + this.byteOrder);
        bodyAppend("p", "emptyField: " + this.emptyField);
        bodyAppend("p", "tocOffset: " + this.tocOffset);
        bodyAppend("p", "LSGSegmentID: " + this.LSGSegmentID);
    }
};

// Load JT-File
function loadFile() {
    var input, file, fr, blob;

    if (typeof window.FileReader !== 'function') {
        bodyAppend("p", "The file API isn't supported on this browser yet.");
        return;
    }

    input = document.getElementById('fileinput');
    if (!input) {
        bodyAppend("p", "Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
        bodyAppend("p", "This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        bodyAppend("p", "Please select a file before clicking 'Load'");
    }
    else  {
        streamReader = new JTDataReader(input.files[0]);
    }
    
}

function printHex(inVal) {
    return "0x" + inVal.toString(16);
}

function int2float(expo, mant) {
    var i, sum = 1;
    for (i = 1; i != 23; i++) {
        sum += mant & (1 << (23 - i)) * Math.pow(2, -i);
    }
    return Math.pow(-1, (expo & 256)) * Math.pow(2, ((expo & 255) - 127)) * sum;
}

// Show file in Webbrowser
function showFile() {
    var i, fileHeader, filetoc;
    fileHeader = new jtHeader(streamReader);
    fileHeader.read();
    fileHeader.print();
    
    filetoc = new jtTOC(streamReader);
    filetoc.read();
    filetoc.print();

    fileSegment = new jtSegments(streamReader);
    getPosition();
    for (i = 0; i < lodPosition.length; ++i) {
        streamReader.position = lodPosition[i];
        //return lodPosition[i];
        fileSegment.read();
        fileSegment.print();
    }
}

function bodyAppend(tagName, innerHTML) {
    var elm;

    elm = document.createElement(tagName);
    elm.innerHTML = innerHTML;
    document.body.appendChild(elm);
}
