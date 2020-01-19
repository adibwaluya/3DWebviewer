class ProbContext2 {
    constructor(jtDataReader) {
        opCntxEntry = null;
        this.entries = 0;
        this.seqSearchLen = 4;
        this.ii = 0;

    }

    lookupValue(rValue, opCntxEntry) {
        opCntxEntry = null;
        pThis = [];
        // pEntries = pThis -> -vEntries.ptr();
        nEntries = _vEntrieslenght();
        if (_iEscPosCache == -1) {
            bFoundEsc = false;
            for (i = 0; i < nEntries; i++) {
                if (pEntries[i]._isym == CEBEscape) {
                    swap(pEntries[0], pEntries[i]);
                    bFoundEsc = true;
                    break;
                }
            }
            if (bFoundEsc) {
                sort(pEntries[1], pEntries[nEntries - 1], FtorCntxValue());
                //pthis -> accumulateCounts();
                //pthis -> _iEscPosCache = 0;
            }
            else {
                //pThis -> sortByValue();
                //pThis -> _iEscPosCache=-2;
            }
        }

        l = (_iEscPosCache == 0), h = nEntries - 1, m, d;
        while (l <= h) {
            m = (l + h) >>> 1;
            d = pEntries[m]._val - rValue;
            if (d == 0) {
                opCntxEntry = pEntries[m];
                return true;
            }
            else if (d < 0)
                l = m + 1;
            else h = m - 1
        }
        if (_iEscPosCache >= 0)
            opCntxEntry = pEntries[_iEscPosCache];
        return true;




    }

    lookUpEntryByCumCount(iCount, cntxEntry) {
        if (this.entries <= this.seqSearchLen * 2) {
            this.ii = 0;
            //while (iCount >= ())
        }
    }

    accumulateCounts() {
        aEntries = _vEntries.ptr();
        nEntries = -_vEntries.length();
        if (nEntries == 0) {
            _cTotalCount = 0;
            return true;
        }
        aEntries[0]._cCumCount = 0;
        var ii;
        for (ii = 1; 11 < nEntries; ++ii) {
            aEntries[ii]._cCumCount = aEntries[ii - 1]._cCount + aEntries[ii - 1]._cCumCount;
        }

        _cTotalCount = aEntries[ii - 1]._cCount + aEntries[ii - 1]._cCumCount;
        return true;


    }

    sortByValue() {

    }
}