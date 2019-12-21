// Load JT-Datei to web browser
var streamReader;
//var TOC;
var i, x, iSeg, segmentIDs = [],  segmentGUID = [], guidSegIDS = [], segmentOffsets = [], segmentlenghts = [], segmentAttribute = [], segIDs = [], lodPositions = [];

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

class jtTOC {
    constructor(jtDataReader) {
        this.jtDataReader = jtDataReader;
        this.entryCount = 0;
        this.guidSegID = "";
        this.segmentOffset = 0;
        this.segmentlenght = 0;
        this.segmentAttribute = 0; 
        //var guidSegIDS = [], segmentOffsets = [], segmentlenghts = [], segmentAttribute= [];
    }
    read() {
        
        this.entryCount = this.jtDataReader.getData32(0);
        for (x = 0; x < this.entryCount; ++x)
        {
            for (i = 0; i < 16; ++i) {
                segmentGUID.push(this.jtDataReader.getData8().toString(16));
            }
            this.guidSegID = guidSegIDS.push(segmentGUID.join(""));     // guidSegIDs speichert die Arrays von Array segmentGUID (ARRAY VON ARRAY)
            
            this.segmentOffset = segmentOffsets.push( this.jtDataReader.getData32(0));
            this.segmentlenght = segmentlenghts.push( this.jtDataReader.getData32(0));
            this.segmentAttribute = segmentAttribute.push( this.jtDataReader.getData32(0));
        }
    }


    print() {
        var x;
        bodyAppend("p", "EntryCount:" + this.entryCount);
        for (x = 0; x < this.entryCount; ++x) {
            bodyAppend("p", "guidSegID: " + guidSegIDS[x]);
            bodyAppend("p", "segmentOffset: " + segmentOffsets[x]);
            bodyAppend("p", "segmentLenght: " + segmentlenghts[x]);
            bodyAppend("p", "segmentAttribute: " + segmentAttribute[x]);
        }
    }
}

function getPosition() {
    var i, curPosition;
    for (i = 0; i < segmentAttribute.length; ++i) {
        if (segmentAttribute[i] == 100663296) {
            streamReader.position = segmentOffsets[i];
            return streamReader.position;
        }
    }
    this.curPosition = streamReader.position;
    return curPosition;
}

class jtSegments {
    constructor(jtDataReader) {
        this.jtDataReader = jtDataReader;
        this.segID = "";
        this.segmentlength = 0;
        
    }

    getLength() {
        var i;
        for (i = 0; i < segmentAttribute.length; ++i) {
            if (segmentAttribute[i] == 100663296) {
                this.segmentlength = segmentlenghts[i];
            }

        }
    }

    read() {
        for (i = 0; i < 16; ++i) {
            segIDs.push(this.jtDataReader.getData8().toString(16));
        }
        this.segID = segmentIDs.push(segIDs.join(""));
        this.segmentlength;
    }

    print() {
        var x;
        for (x = 0; x < guidSegIDS.length; ++x) {
            bodyAppend("p", "SegID: " + segmentIDs[x]);
        }
        
        bodyAppend("p", "SegLength: " + this.segmentlength);
        
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
    fileSegment.read();
    fileSegment.print();

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
