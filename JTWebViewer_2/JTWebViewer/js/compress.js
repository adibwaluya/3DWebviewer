
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
        // Constructors for Codec2
        this.iCurCodeText = 0;
        this.pcCodeTextLen = 0;
    }

    decodeBitlength(valCount, ctLength, encodedData) {
        var cBitsInMinSymbol, cBitsInMaxSymbol, iMaxSymbol, iMinSymbol, cNumCurBits = 0, nBits = 0, nTotalBits = 0, nSyms = 0, i = 0, localEncodes = [], cdp, arrayExample = [];
        var dataReader = new JTDataReader();
        //HUGE REVISION
        while (i < encodedData.length) {
            this.values.push(this.encodedData);
            dataReader.initFromArray(encodedData);
            var bitReader = new JTBitReader(dataReader, 0);
            cdp = new CDP2(dataReader);
            var isVariable = bitReader.getBits(1);
            if (isVariable == 0) {
                // TODO: NOCHMAL ANGUCKEN!
                cBitsInMinSymbol = bitReader.getBits(6);
                cBitsInMaxSymbol = bitReader.getBits(6);
                iMinSymbol = bitReader.getBits(cBitsInMinSymbol);
                iMaxSymbol = bitReader.getBits(cBitsInMaxSymbol);
                cNumCurBits = cdp.nBitsinSymbol(iMaxSymbol - iMinSymbol);

                while (nBits < nTotalBits || nSyms < this.valueCount) {
                    this.iSymbol = 0;
                    this.iSymbol = bitReader.getBits(cNumCurBits);
                    this.iSymbol += iMinSymbol;
                    this.ovValues.push(this.iSymbol);
                    ++nSyms;
                }
                arrayExample.push(this.ovValues);
                this.originalValue = arrayExample.join(" ");
                this.ovValues = [];

            }
            //else if (encodedData.length > 1) {
            //    localEncodes.push(encodedData.length);
            //// not implemented yet
            //}
            localEncodes = [];
            ++i;
        }
    }

    nBitsinSymbol(iSym) {
        var i = 0, nBits = 0, cMaxCodeSpan = 0;
        if (iSym == 0) { return 0; }
        else {
            cMaxCodeSpan = Math.abs(iSym);
            for (i = 1, nBits = 0; i <= cMaxCodeSpan && nBits < 31; i += i, ++nBits) {

            }
            return nBits;
            nBits = 0;
        }
    }

//    // Arithmetic decoder!!!
//    ArithmeticCodec2(valCount, vOOBValues, ctLength, encodedData, probContx) {
//        var paiOOBValues = [],
//            pCntxEntry = [],
//            // cSymbolsCurrCtx = probContx,
//            uBitBuff = 0,
//            nBitBuff = 0,
//            low = 0,           // Start of the current code range
//            high = 0xffff,     // End of the current code range
//            rescaledCode = 0,
//            code = 0,          // Present input code value, for decoding only
//            iSym = 0,
//            inx = 0;

//        _code = (_uBitBuff >>> 16);
//        _uBitBuff <<= 16;
//        nBitBuff -= 16;

//        probContx = new ProbContext2(encodedData);
        
//        for (i = 0; i < this.valueCount; ++i) {
//            rescaledCode = (((code - low) + 1) * valCount - 1) / ((high - low) + 1);

//            probContx.lookUpEntryByCumCount(rescaledCode, cntxEntry);
//            if (cntxEntry == iSym != /*CntxEntryBase2::CEBEscape*/) {
//                this.ovValues.push(cntxEntry/*-> _val*/)
//            }
//            else {
//                this.ovValues.push(vOOBValues./*value(++inx)*/);
//            }
//            // removeSymbolFromStream(pCntxEntry->_cCumCount, pCntxEntry->_cCumCount + pCntxEntry->_cCount, cSymbolsCurrCtx);

//        }
//        this.flushDecoder();
//        return true;
//    }

//    _removeSymbolFromStream(uLowCt, uHighCt, uScale) {

//        var uRange, _high, _low, _code;

//        //First, the range is expanded to account for symbol removal
//        uRange = (-high - _low) + 1;
//        _high = _low + ((uRange * uHighCt) / uScale - 1);
//        _low = _low + ((uRange * uLowCt) / uScale - 1);
//        // If most signif digits match, the bits will be shifted out
//        for (; ;)
//            if (~(_high ^ _low) >>> 15) { }

//            else if (((_low >>> 14) == 1) && ((_high >>> 14) == 2)) {
//                _code ^ 0x4000;
//                _low & 0x3fff;
//                _high | 0x4000;
//            }
//            else {
//                return true;
//            }

//        _low << 1;
//        _high << 1;
//        _high | 1;
//        _code << 1;
//        // originally ReadBit0(_code)
//        getBits(_code);




//    }

   

//    getNextCodeText(uCodeText, nBits) {
        
//    }

        

//}


    
    

    read() {
        var i, vals2read = 0, partialData1 = [], partialData2 = [], partialData3 = [], totalData1 = [], totalData2 = [];
        this.valueCount = this.jtDataReader.getData32(0);
        this.CODECType = this.jtDataReader.getData8();
        if (this.CODECType < 4) {
            this.codeTextLength = this.jtDataReader.getData32(0)/*.toString(16)*/;
            //this.originalValues = this.jtDataReader.getData32(0).toString(16);
            vals2read = Math.ceil(this.codeTextLength / 32.);
            //if (this.codeTextLength <= 20) {
            //    for (i = 0; i < vals2read; ++i) {
            //        this.encodedData.push(this.jtDataReader.getData32(0));
            //    }
            //}
            //else if (20 < this.codeTextLength && this.codeTextLength <= 40) {
            //    for (i = 0; i < vals2read; ++i) {
            //        this.encodedData.push(this.jtDataReader.getData64(0));
            //    }
            //}
            //else if (40 < this.codeTextLength && this.codeTextLength <= 80) {
            //    for (i = 0; i < vals2read; ++i) {
            //        this.encodedData.push(this.jtDataReader.getData32(0));

            //        //partialData3.join(partialData2);


            //        //this.encodedData.push(this.jtDataReader.getData32(0));
            //    }
            //}
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
                for (i = 1; i < this.probCxtEntries.length; i + 3) {            // speicher das 2.Value von Entries in cCount
                    this.cCount.push(this.probCxtEntries[i]);
                }
                this.cCumCount[0] = 0;
                this.cCumCount[1] = this.cCount[0];
                for (i = 2; i < this.cCount.length; ++i) {                      // Summe der vorherigen Einträgen (cCumCount)
                    this.cCumCount.push(this.cCumCount[i - 1] + this.cCount[i - 1]);
                }

            } else if (this.CODECType == 1) { // BitLength
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
        //this.originalValue = this.ovValues



        
    }
    print() {
        var i;
        bodyAppend("p", "TopologicalCompressedRepData: faceDegrees: ");
        for (i = 0; i < this.values.length; ++i) {
            this.originalData = this.values[i].toString(16);
        }
        bodyAppend("p", "CDP Package: valueCount: " + this.valueCount + "; CODECType: " + this.CODECType + "; codeTextLength: " + this.codeTextLength + "; Original values: " + this.originalData);
        //for (i = 0; i < this.arrayExample.length; ++i) {
        //    //this.originalValue = this.arrayExample[i];
        //}
        bodyAppend("p", "outVals: " + this.originalValue);
        //bodyAppend("p", "decoded: " + this.decodedData);
        //bodyAppend("p", "Max Symbol: " + this.iMaxSymbol);
        
    }
};

