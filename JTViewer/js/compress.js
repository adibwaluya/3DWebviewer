
// Compressed Data Packet mk.2
class CDP2 { // Figure 150 (left side missing)
    constructor(jtDataReader, predictorType) {
        this.jtDataReader = jtDataReader;
        this.valueCount = 0;
        this.CODECType = 0;
        this.codeTextLength = 0;
        this.originalValues = 0;
        //this.iMaxSymbol = 0;
        //this.iMinSymbol = 0;
        this.iSymbol = 0;
        this.predictorType = 0;    // implemetation fehlt noch
        this.originalData = 0;
        this.originalValue = 0;
        // Constructors for Arithmetic
        this.probabilityContexts = null; // implemetation fehlt noch
        this.bitBuff = 0;
        this.OOBValues = []; // implemetation fehlt noch
        this.encodedData = [];
        this.decodedData = [];
        this.ovValues = [];
        this.values = [];
        this.probCxtEntries = [];
        // Constructors for Codec2
        this.iCurCodeText = 0;
        this.pcCodeTextLen = 0;
    }

    decodeBitlength(valCount, ctLength, encodedData) {
        var cBitsInMinSymbol, cBitsInMaxSymbol, iMaxSymbol, iMinSymbol, cNumCurBits = 0, nBits = 0, nTotalBits = 0, nSyms = 0, i = 0, localEncodes = [], cdp, arrayValues = [];
        var dataReader = new JTDataReader(); 

        while(i < encodedData.length){

            this.values.push(this.encodedData);
            dataReader.initFromArray(encodedData);
            var bitReader = new JTBitReader(dataReader, 0);                 // To read the bits of the specific data, bitReader will be implemented
            cdp = new CDP2(dataReader);                                     // will be required to implement a methode from class CDP2
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

    // Arithmetic decoder!!!
    ArithmeticCodec2(valCount, vOOBValues, ctLength, encodedData, probContx) {
        var paiOOBValues = vOOBValues,
            cSymbolsCurrCtx = probContx,
            uBitBuff = 0,
            nBitBuff = 0, 
            low = 0,           // Start of the current code range
            high = 0xffff,     // End of the current code range
            rescaledCode = 0,
            code = 0,          // Present input code value, for decoding only
            iSym = 0,
            inx = 0;

        _code = (_uBitBuff >>> 16);
        _uBitBuff <<= 16;
        nBitBuff -= 16;

        probContx = new ProbContext2(encodedData);
        
        for (i = 0; i < this.valueCount; ++i) {
            rescaledCode = (((code - low) + 1) * cSymbolsCurrCtx - 1) / ((high - low) + 1);

            probContx.lookUpEntryByCumCount(rescaledCode, cntxEntry);
            if (cntxEntry == iSym != /*CntxEntryBase2::CEBEscape*/) {
                this.ovValues.push(cntxEntry/*-> _val*/)
            }
            else {
                this.ovValues.push(vOOBValues./*value(++inx)*/);
            }
            // removeSymbolFromStream(pCntxEntry->_cCumCount, pCntxEntry->_cCumCount + pCntxEntry->_cCount, cSymbolsCurrCtx);

        }
        this.flushDecoder();
        return true;
    }

    _removeSymbolFromStream(uLowCt, uHighCt, uScale) {

        var uRange, _high, _low, _code;

        //First, the range is expanded to account for symbol removal
        uRange = (-high - _low) + 1;
        _high = _low + ((uRange * uHighCt) / uScale - 1);
        _low = _low + ((uRange * uLowCt) / uScale - 1);
        // If most signif digits match, the bits will be shifted out
        for (; ;)
            if (~(_high ^ _low) >>> 15) { }

            else if (((_low >>> 14) == 1) && ((_high >>> 14) == 2)) {
                _code ^ 0x4000;
                _low & 0x3fff;
                _high | 0x4000;
            }
            else {
                return true;
            }

        _low << 1;
        _high << 1;
        _high | 1;
        _code << 1;
        // originally ReadBit0(_code)
        getBits(_code);

    }

    read() {
        var i, vals2read = 0;
        this.valueCount = this.jtDataReader.getData32(0);
        this.CODECType = this.jtDataReader.getData8();
        if (this.CODECType < 4) {
            this.codeTextLength = this.jtDataReader.getData32(0).toString(16);
            vals2read = Math.ceil(this.codeTextLength / 32.);
            for (i = 0; i < vals2read; ++i) {
                this.encodedData.push(this.jtDataReader.getData32(0));
            }
            if (this.CODECType == 3) { // Arithmetic 
                var probCxtTableEntryCount, numberSymbolBits, numberOccurCountBits, numberValueBits, minValue;
                //var amc = new ArithmeticCodec2(this.valueCount, this.codeTextLength, this.encodedData, probCxT???);
                var bitReader = new JTBitReader(this.jtDataReader, 1);
                probCxtTableEntryCount = bitReader.getBits(16);
                numberSymbolBits = bitReader.getBits(6);
                numberOccurCountBits = bitReader.getBits(6);
                numberValueBits = bitReader.getBits(6);
                minValue = bitReader.getBits(32);
                for (var i = 0; i < probCxtTableEntryCount; i++)
                {
                    this.probCxtEntries.push(bitReader.getBits(numberSymbolBits));
                    this.probCxtEntries.push(bitReader.getBits(numberOccurCountBits));
                    this.probCxtEntries.push(bitReader.getBits(numberValueBits));
                }
                this.OOBValues = this.jtDataReader.getData32(0);

            } else if (this.CODECType == 1) { // BitLengthdecode
                this.decodedData = this.decodeBitlength(this.valueCount, this.codeTextLength, this.encodedData);
            } else if (this.CODECType == 0) { // NULL decoder
                for (i = 0; i < this.valueCount; ++i) {
                    this.decodedData.push(this.encodedData[i]);
                }
            }
            this.encodedData = [];

        } else {
            //Anything else but none/bitLength or Arithmitic: not yet implemented
        }
        
    }
    print() {
        var i;
        bodyAppend("p", "TopologicalCompressedRepData: faceDegrees: ");
        for (i = 0; i < this.values.length; ++i) {
            this.originalData = this.values[i].toString(16);
        }
        bodyAppend("p", "CDP Package: valueCount: " + this.valueCount + "; CODECType: " + this.CODECType + "; codeTextLength: " + this.codeTextLength + "; Original values: " + this.originalData);
        bodyAppend("p", "outVals: " + this.originalValue);        
    }
};

