class JTDataReader {
    constructor() {
        this.jtFile = null;     // VORHER: new FileReader();
        this.position = 0;
        /*this.jtFile.readAsArrayBuffer(filename); */     /*Revised 02.01.2020*/
        this.isdone = true;
        this.bitsLeft = 0;
        /*this.jtFile.addEventListener('loadend', this.initArray.bind(this));*/   /*Revised 02.01.2020*/
    }

    // WARNING: HUGE REVISION (02.01.2020)
    initFromFile(filename) {
        this.jtFile = new FileReader();
        this.position = 0;
        this.jtFile.readAsArrayBuffer(filename);
        this.isdone = false;
        this.bitsLeft = 0;
        this.jtFile.addEventListener('load', this.initArray.bind(this));
    }

    // Read 8/16/32 bits of Data from Array
    initFromArray(dataArray) {
        var bs, j, k, dataLen = dataArray.length;

        this.data8Array = new Uint8Array(4 * dataLen);
        for (j = 0; j < dataLen; ++j) {
            for (k = 0; k < 4; ++k) {
                this.data8Array[j * 4 + k] = (dataArray[j] >>> (k * 8)) & 0xFF;
            }
        }
        this.position = 0;


    }
    // END REVISION

    // Save the whole hexadecimal datas in arrays
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
        var i, val = 0xFFFF;
        if (endi == 0) {
            val = 0;
            for (i = 0; i < amo; ++i) {
                val = val | (this.data8Array[this.position++] << (i * 8))
            }
        } else {
            val = 0;
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

    // Updated (New) Function (02.01.2020)
    getData64(endi) {
        return this.universalGetData(8, endi);
    }
};

// Read certain amount of Bits of Data
// TODO: This methode still need to be fixed and improved
class JTBitReader {
    constructor(jtDataReader, endian) {
        this.jtDataReader = jtDataReader;
        this.endian = endian;
        this.data = 0XFFFF
        this.data = jtDataReader.getData32(endian);
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
            this.data = this.jtDataReader.getData32(this.endian);
            this.bitsLeft = 32;
        }
        this.bitsLeft = this.bitsLeft - numBits;
        buildBits = buildBits | (this.data >>> (this.bitsLeft));
        this.data = this.data & (0xFFFFFFFF >>> (32 - this.bitsLeft));

        return buildBits;
    }
}