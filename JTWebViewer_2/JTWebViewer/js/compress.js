
// Compressed Data Packet mk.2
class CDP2 { // Figure 150 (left side missing)
    constructor(jtDataReader, predictorType) {
        this.jtDataReader = jtDataReader;
        this.valueCount = 0;
        this.CODECType = 0;
        this.codeTextLength = 0;
        this.originalValues = 0;
        this.iMaxSymbol = 0;
        this.iMinSymbol = 0;
        this.predictorType = 0;    // implemetation fehlt noch
        this.originalData = 0;
        this.probabilityContexts = null; // implemetation fehlt noch
        this.OOBValues = []; // implemetation fehlt noch
        this.encodedData = [];
        this.decodedData = [];
    }

    decodeBitlength(valCount, ctLength, encodedData) {
        var cBitsInMinSymbol, cBitsInMaxSymbol, cNumCurBits = 0;
        var dataReader = new JTDataReader();
        dataReader.initFromArray(encodedData);
        var bitReader = new JTBitReader(dataReader, 0);
        var isVariable = bitReader.getBits(1);
        if (isVariable == 0) {
            // TODO: NOCHMAL ANGUCKEN!
            cBitsInMinSymbol = bitReader.getBits(6);
            cBitsInMaxSymbol = bitReader.getBits(6);
            //this.iMinSymbol = cBitsInMinSymbol;
            //this.iMaxSymbol = 
            
            //cNumCurBits = (iMaxSymbol - iMinSymbol);
            // just for testing
            //bodyAppend("p", "cBitsInMinSymbol: " + this.iMinSymbol.toString(16));
            //bodyAppend("p", "cBitsInMaxSymbol: " + this.iMaxSymbol.toString(16));
            //bodyAppend("p", "Min Symbol: " + iMinSymbol.toString(16));

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
            this.codeTextLength = this.jtDataReader.getData32(0).toString(16);
            //this.originalValues = this.jtDataReader.getData32(0).toString(16);
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
        var i;
        bodyAppend("p", "TopologicalCompressedRepData: faceDegrees: ");
        for (i = 0; i < this.encodedData.length; ++i) {
            this.originalData = this.encodedData[i].toString(16);
        }
        bodyAppend("p", "CDP Package: valueCount: " + this.valueCount + "; CODECType: " + this.CODECType + "; codeTextLength: " + this.codeTextLength + "; Original values: " + this.originalData);
        
        //bodyAppend("p", "decoded: " + this.decodedData);
        //bodyAppend("p", "Max Symbol: " + this.iMaxSymbol);
        
    }
};

