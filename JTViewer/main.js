// Load JT-Datei to web browser
var streamReader;
//var TOC;
var i, x, iSeg, segmentIDs = [],  segmentGUID = [], guidSegIDS = [], segmentOffsets = [], segmentlenghts = [], segmentAttributes = [], lodPositions = [], lodPosition = [];

function readGUID(jtDataReader) {
    var i, rawDataGUID = [];
    for (i = 0; i < 16; ++i) {
        rawDataGUID.push(jtDataReader.getData8().toString(16));
    }
    return rawDataGUID.join("");
}

class JTDataReader {
    constructor(filename) {
        this.jtFile = new FileReader();
        this.position = 0;
        this.jtFile.readAsArrayBuffer(filename);
        this.isdone = false;
        this.bitsLeft = 0;
        this.jtFile.addEventListener('loadend', this.initArray.bind(this));
    }
    initArray() {
        this.data8Array = new Uint8Array(this.jtFile.result);
        this.isdone = true;
    }

    getData8() {
        return this.data8Array[this.position++];
    }

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

    getData16(endi) {
        return this.universalGetData(2, endi);
    }

    getData32(endi) {
        return this.universalGetData(4, endi);
    }
};


//bodyAppend("p", "rrrrbuildBits: " + buildBits.toString(2) + "; bitsLeft: " + this.bitsLeft+ ";  data: " +this.data.toString(2) + " (" + this.data.toString(16) + ")");

class JTBitReader {
    constructor(jtDataReader) {
        this.jtDataReader = jtDataReader;
        this.data = jtDataReader.getData32(1); //normaly 1
        this.old = this.data;
        this.bitsLeft = 32;
    }
    //getBits(numBits) {
    //    var buildBits = 0;

    //    if (this.bitsLeft < numBits) {
    //        if (this.bitsLeft != 0) {
    //            numBits = numBits - this.bitsLeft;
    //            buildBits = this.data << (numBits);
    //        }
    //        this.data = this.jtDataReader.getData32(1);
    //        this.bitsLeft = 32;
    //    }
    //    this.bitsLeft = this.bitsLeft - numBits;
    //    buildBits = buildBits | (this.data >>> (this.bitsLeft));
    //    this.data = this.data & (0xFFFFFFFF >>> (32 - this.bitsLeft));

    //    return buildBits;
    //}

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
// 
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
        for (i = 0; i < 80; ++i) {
            rawData.push(String.fromCharCode(this.jtDataReader.getData8()));
        }

        this.versionString = rawData.join("").trim();
        this.byteOrder = this.jtDataReader.getData8();
        this.emptyField = this.jtDataReader.getData32(0);
        this.tocOffset = this.jtDataReader.getData32(0);
        for (i = 0; i < 16; ++i) {
            rawDataGUID.push(this.jtDataReader.getData8().toString(16));
        }
        this.LSGSegmentID = rawDataGUID.join("");
    }
    print() {
        bodyAppend("p", "versionString: " + this.versionString);
        bodyAppend("p", "byteOrder: " + this.byteOrder);
        bodyAppend("p", "emptyField: " + this.emptyField);
        bodyAppend("p", "tocOffset: " + this.tocOffset);
        bodyAppend("p", "LSGSegmentID: " + this.LSGSegmentID);
    }
};


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
        for (i = 0; i < 16; ++i) {
            segmentGUID.push(this.jtDataReader.getData8().toString(16));
        }
        this.guidSegID = segmentGUID.join("");     // guidSegIDs speichert die Arrays von Array segmentGUID (ARRAY VON ARRAY)
        this.segmentOffset = this.jtDataReader.getData32(0);
        segmentOffsets.push(this.segmentOffset);
        this.segmentlength = this.jtDataReader.getData32(0);
        this.segmentAttribute = this.jtDataReader.getData32(0);
        segmentAttributes.push(this.segmentAttribute);
    }


    print() {
        bodyAppend("p", "guidSegID: " + this.guidSegID);
        bodyAppend("p", "  segmentOffset: " + this.segmentOffset);
        bodyAppend("p", "  segmentlength: " + this.segmentlength);
        bodyAppend("p", "  segmentAttribute: " + this.segmentAttribute);
    }


}

class jtTOC {

    constructor(jtDataReader) {
        this.jtDataReader = jtDataReader;
        this.entryCount = 0;
        this.tocEntries = [];
    }
    read() {
        var oneEntry;
        this.entryCount = this.jtDataReader.getData32(0);

        for (x = 0; x < this.entryCount; ++x) {
            oneEntry = new jtTOCEntry(this.jtDataReader);
            oneEntry.read();
            this.tocEntries.push(oneEntry);
        }
    }


    print() {
        var x;
        bodyAppend("p", "EntryCount:" + this.entryCount);
        for (x = 0; x < this.entryCount; ++x) {
            this.tocEntries[x].print();
        }
    }
}


function getPosition() {
    var i, curPosition;
    for (i = 0; i < segmentAttributes.length; ++i) {
        if (segmentAttributes[i] == 100663296) {
            streamReader.position = segmentOffsets[i];
            lodPosition.push(streamReader.position);
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

    getLength() {
        var i;
        for (i = 0; i < segmentAttributes.length; ++i) {
            if (segmentAttributes[i] == 100663296) {
                this.segmentlength = segmentlenghts[i];
            }

        }
    }

    read() {
        var segIDs = [];
        for (i = 0; i < 16; ++i) {
            segIDs.push(this.jtDataReader.getData8().toString(16));
        }
        //this.segID = segmentIDs.push(segIDs.join(""));
        this.segID = segIDs.join("");
        this.segmentType = this.jtDataReader.getData32(0);
        this.segmentlength = this.jtDataReader.getData32(0);
    }

    print() {
        var x;
        bodyAppend("p", "LOD Segment");
        bodyAppend("p", "SegID: " + this.segID);
        bodyAppend("p", "Segment Type: " + this.segmentType);
        bodyAppend("p", "Segment Length: " + this.segmentlength);
        //for (x = 0; x < guidSegIDS.length; ++x) {
        //    bodyAppend("p", "SegID: " + segmentIDs[x]);
        //}
    }
}


class bitLenghtDecoder {
    constructor(jtDataReader) {
        this.jtDataReader = jtDataReader;
        //this.bits = JTBitReader;
        this.nbits = 0;
        this.ntotalbits = 0;
        this.facedegree = 0;
    }
    read() {
        
        this.facedegree = this.jtDataReader.getData32(0).toString(16);
        

    }

    print() {
        bodyAppend("p", "minBits: " + this.facedegree);
    }

}


// Compressed Data Packet mk.2
class CDP2 { // Figure 150 (left side missing)
    constructor(jtDataReader, predictorType) {
        this.jtDataReader = jtDataReader;
        this.valueCount = 0;
        this.CODECType = 0;
        this.codeTextLength = 0;
        this.predictorType = 0;    // implemetation fehlt noch
        this.probabilityContexts = null; // implemetation fehlt noch
        this.OOBValues = []; // implemetation fehlt noch
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

function showFile() {
    var filetitle, i, byteOrder, innerloop, fileHeader, bits, filetoc, kartoffel;
    var jj =0 ;
    var kk = 0.5;
    bodyAppend("p", int2float(126, 0));
    fileHeader = new jtHeader(streamReader);
    fileHeader.read();
    fileHeader.print();
     // just for testing 
    
    //bodyAppend("p", "bits: " + bits.old.toString(2) + "  (" + bits.old.toString(16) + ")  caution: leading 0 are not printed...");
    //bodyAppend("p", "16 bits: " + bits.getBits(16).toString(2));
    //bodyAppend("p", "6 bits: " + bits.getBits(6).toString(2));
    //bodyAppend("p", "6 bits: " + bits.getBits(6).toString(2));
    //bodyAppend("p", "6 bits(2 from next i32): " + bits.getBits(6).toString(2));
    //bodyAppend("p", "32 Bits:" + bits.getBits(32).toString(2));
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
    

    

    //getPosition();
    //streamReader.position = 1678;
    //potato = new bitLenghtDecoder(streamReader);
    //potato.read();
    
    //potato.print();

    /*Important shits
     * bits = new JTBitReader(streamReader);
       jj = bits.getBits(8).toString(16);


    bodyAppend("p", "6 Bits: " + jj);
     * */
    
    //kartoffel = new jtSegments(streamReader);
    //kartoffel.getLength();
    //kartoffel.read();
    //kartoffel.print()


    //streamReader.position = 1944;
    //streamReader.position =
}

function bodyAppend(tagName, innerHTML) {
    var elm;

    elm = document.createElement(tagName);
    elm.innerHTML = innerHTML;
    document.body.appendChild(elm);
}
