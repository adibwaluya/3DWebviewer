
// Compressed Data Packet mk.2
class CDP2 { // Figure 150 (left side missing)
    constructor(jtDataReader, predictorType) {
        this.jtDataReader = jtDataReader;
        this.valueCount = 0;
        this.CODECType = 0;
        this.codeTextLength = 0;
        this.originalValues = 0;
        this.iSymbol = 0;
        this.predictorType = 0;    
        this.originalData = 0;
        this.originalValue = 0;
        this.probabilityContexts = null; 
        this.OOBValues = []; 
        this.encodedData = [];
        this.decodedData = [];
        this.ovValues = [];
    }

    decodeBitlength(valCount, ctLength, encodedData) {
        var cBitsInMinSymbol, cBitsInMaxSymbol, iMaxSymbol, iMinSymbol, cNumCurBits = 0, nBits = 0, nTotalBits = 0, nSyms = 0, i = 0, localEncodes = [], cdp, arrayValues = [];
        var dataReader = new JTDataReader(); 
        while(i < encodedData.length){

            // if array encodedData only has 1 element, that first and the only element will be read
            if (encodedData.length == 1) {
            localEncodes.push(encodedData[i]);
            }

            // if array encodedData has more than 1 element, always the element in the next index will be read
            else if (encodedData.length > 1) {
            localEncodes.push(encodedData[i+1]);        // STILL NEEDS TO BE IMPROVED SOON!
            }   

            dataReader.initFromArray(localEncodes);
            var bitReader = new JTBitReader(dataReader, 0);     // To read the bits of the specific data, bitReader will be implemented
            cdp = new CDP2(dataReader);                 // will be required to implement a methode from class CDP2
            var isVariable = bitReader.getBits(1);

            if (isVariable == 0) {
                // TODO: NOCHMAL ANGUCKEN!
                cBitsInMinSymbol = bitReader.getBits(6);                    // the minimum value in unsigned bits
                cBitsInMaxSymbol = bitReader.getBits(6);                    // the maximum value in unsigned bits
                iMinSymbol = bitReader.getBits(cBitsInMinSymbol);           // minimum value will be converted from unsigned to signed bits
                iMaxSymbol = bitReader.getBits(cBitsInMaxSymbol);           
                cNumCurBits = cdp.nBitsinSymbol(iMaxSymbol - iMinSymbol);   // the bits will be converted to symbol (number)

                // While loop is implemented to show the decoded values
                while (nBits < nTotalBits || nSyms < this.valueCount) {
                    this.iSymbol = 0;
                    this.iSymbol = bitReader.getBits(cNumCurBits);
                    this.iSymbol += iMinSymbol;
                    this.ovValues.push(this.iSymbol);
                    ++nSyms;
                }
                arrayValues.push(this.ovValues);
                this.originalValue = arrayValues.join(" ");
                this.ovValues = [];
            }

            else{
            //// not implemented yet
            }
            localEncodes = [];
            ++i;
        }
    }

    // Function to convert number of bits into symbol
    nBitsinSymbol(iSym) {
        var i = 0, nBits = 0, cMaxCodeSpan = 0;
        if (iSym == 0) { return 0; }
        else {
            cMaxCodeSpan = Math.abs(iSym);
            for (i = 1, nBits = 0; i <= cMaxCodeSpan && nBits < 31; i+=i, ++nBits) {
                // Empty, only return nBits 
            }
            return nBits;
            nBits = 0;
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
            } else if (this.CODECType == 1) { // BitLengthdecode
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
        bodyAppend("p", "outVals: " + this.originalValue);        
    }
};

