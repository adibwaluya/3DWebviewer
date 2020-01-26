x_Points = [20, 20, 0, 0];
y_Points = [20, 20, 0, 0];
z_Points = [0, 20, 20, 0]; 
    
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
        this.cCumCount = [];
        this.cCount = [];
        this.totalCount = [];
        this.opcntxEntry = null;
        this.currcCount;
        this.currcCumCount;
        this.high = 0xffff;
        this.low = 0;       // Start of the current code range
        this.code;
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
    ArithmeticCodec2(valCount, ctLength, encodedData, probEntries, cCount, cCumCount, vOOBValues) {
        var uBitBuff = encodedData,
            nBitBuff = ctLength, 
            low = 0,           // Start of the current code range
            high = 0xffff,     // End of the current code range
            rescaledCode = 0,
            code = 0,          // Present input code value, for decoding only
            iSym = 0,
            currTotalCount = valCount;

        this.code = (uBitBuff >>> 16);
        uBitBuff <<= 16;
        nBitBuff -= 16;
        
        for (i = 0; i < valCount; ++i) {
            rescaledCode = (((this.code - this.low) + 1) * valCount - 1) / ((this.high - this.low) + 1);
            rescaledCode = Math.round(rescaledCode);
            this.lookupEntryByCumCount(rescaledCode, probEntries, cCount, cCumCount);


            if (this.currcCount != -2) {
                this.ovValues.push(this.opcntxEntry)
            }
            else {
                this.ovValues.push(vOOBValues);
            }

            this.removeSymbolFromStream(this.currcCount, (this.currcCumCount + this.currcCount), currTotalCount);
           
        }
        //this.flushDecoder();
        return true;
    }

    lookupEntryByCumCount(iCount, probEntries, cCount, cCumCount) {
        var nEntries = probEntries.length / 3;
        var seqSearchLen = 4, ii = 0;


        // For short lists, do sequential search
        if (nEntries <= (seqSearchLen * 2)) {
            ii = 0;
            while (iCount >= (cCumCount[ii] + cCount[ii]) && (ii < nEntries)) {
                ii++;
            }
            if (ii >= nEntries) {
                //assert(0 && "Bad probability table");
            }
            this.opcntxEntry = probEntries[ii + ii * 3];
            this.currcCount = cCount[ii];
            this.currcCumCount = cCumCount[ii];
        }
        // For long lists, do a short sequential searches through most likely
        // elements, then do a binary search through the rest.
        else {
            for (ii = 0; ii < seqSearchLen; ii++) {
                if (iCount < (cCumCount[ii] + cCount[ii])) {
                    this.opcntxEntry = probEntries[ii + ii * 3];
                    this.currcCount = cCount[ii];
                    this.currcCumCount = cCumCount[ii];
                    return true;
                }
            }

            this.low = ii, this.high = nEntries - 1;

            while (1) {
                if (this.high < this.low) {
                    break;
                }
                mid = this.low + ((this.high - this.low) >> 1);
                if (iCount < cCumCount[mid]) {
                    this.high = mid - 1;
                    continue;
                }
                if (iCount >= (cCumCount[mid] + cCount[mid])) {
                    this.low = mid + 1;
                    continue;
                }
                this.opcntxEntry = probEntries[mid + ii * 3];
                return true;
            }

            //assert(0 && "Bad probability table");
        }
        return true;
    }

    removeSymbolFromStream(uLowCt, uHighCt, uScale)
    {
        var uRange;

            //First, the range is expanded to account for symbol removal
        uRange = (this.high - this.low) + 1;
        this.high = this.low + ((uRange * uHighCt) / uScale - 1);
        this.low = this.low + ((uRange * uLowCt) / uScale - 1);
        // If most signif digits match, the bits will be shifted out
        for (; ;) {
            var x = this.high - this.low;
            var y = x >>> 15;
            // If the most signif digits match, the bits will be shifted out.
            if (y == 1)
            { 
            
                if (((this.low >>> 14) == 1) && ((this.high >>> 14) == 2)) {
                    this.code ^= 0x4000;
                    this.low &= 0x3fff;
                    this.high |= 0x4000;
                }

                // Else, if underflow is threatening, shift out the 2nd most signif digit.
                //else if ((_low & 0x4000) && !(_high & 0x4000))
                // If high=10xx and low=01xx
                else {
                    return true;
                }
            }
            //else if (((this.low >>> 14) == 1) && ((this.high >>> 14) == 2)) {
            //    this.code ^ 0x4000;
            //    this.low & 0x3fff;
            //    this.high | 0x4000;
            //}
            //else {
            //    return true;
            //}

           
            this.low <<= 1;
            this.low &= 65535;

            this.high <<= 1;
            this.high &= 65535; 
            this.high |= 1;
           
            this.code <<= 1;
            this.code &= 65535;
            this.code;
        }
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
                for (i = 1; i < this.probCxtEntries.length; i = i + 3) {            // speicher das 2.Value von Entries in cCount
                    this.cCount.push(this.probCxtEntries[i]);
                }
                this.cCumCount[0] = 0;
                this.cCumCount[1] = this.cCount[0];
                for (i = 2; i < this.cCount.length; ++i) {                          // Summe der vorherigen Einträgen in cCount (cCumCount)
                    this.cCumCount.push(this.cCumCount[i - 1] + this.cCount[i - 1]);
                }
                this.decodedData = this.ArithmeticCodec2(this.valueCount, this.codeTextLength, this.encodedData, this.probCxtEntries, this.cCount, this.cCumCount, this.OOBValues);

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

        showCoordinates = coordinateArrays.push(this.originalValue);
        if (showCoordinates > 9) {
            realCoordinates.push(this.originalValue);
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

