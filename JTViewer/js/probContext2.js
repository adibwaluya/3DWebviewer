class ProbContext2 {
    constructor(jtDataReader) {
        opCntxEntry = null;
        this.entries = 0;
        this.seqSearchLen = 4;
        this.ii = 0;

    }



    lookupEntryByCumCount(iCount) {
        var nEntries = _vEntries.length(), seqSearchLen = 4, ii = 0;
      
        // For short lists, do sequential search
        if (nEntries <= (seqSearchLen * 2)) {
            ii = 0;
            while ((iCount >= (vEntries.value(ii)._cCumCount + vEntries.value(ii)._cCount)) && (ii < nEntries)) {
                ii++;
            }
            if (ii >= nEntries) {
                //assert(0 && "Bad probability table");
            }
            return _vEntries.valueP(ii);
        }
        // For long lists, do a short sequential searches through most likely
        // elements, then do a binary search through the rest.
        else {
            for (ii = 0; ii < seqSearchLen; ii++) {
                if (iCount < (vEntries.value(ii)._cCumCount + vEntries.value(ii)._cCount)) {
                    return _vEntries.valueP(ii);
                }
            }
            Int32 low = ii, high = nEntries - 1, mid;
            while (1) {
                if (high < low) {
                    break;
                }
                mid = low + ((high - low) >> 1);
                if (iCount < _vEntries.value(mid)._cCumCount) {
                    high = mid - 1;
                    continue;
                }
                if (iCount >= (vEntries.value(mid)._cCumCount + vEntries.value(mid)._cCount)) {
                    low = mid + 1;
                    continue;
                }
                return _vEntries.valueP(mid);
            }
            assert(0 && "Bad probability table");
        }
        return NULL;
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