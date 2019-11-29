// Fügen Sie Ihren Code hier ein.
function loadFile() {

    var input, file, fr;

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

    else {

        file = input.files[0];
        fr = new FileReader();
        fr.addEventListener("load", receivedText);
        fr.addEventListener("load", receivedTOC);
        //fr.onload = receivedText; 
        fr.readAsBinaryString(file);
    }

    function receivedText() {

        showResultVersion(fr, "Text");
        showResultFileHeader(fr, "File Header");
        fr = new FileReader();
        //fr.onload = receivedBinary;
        //fr.onload = showFileHeader;
        fr.readAsBinaryString(file);
    }

    function receivedTOC() {
        //showResultTOC(fr, "TOC");
        fr = new FileReader();
        fr.onload = showTOC;
        fr.readAsBinaryString(file);
    }


    /*
    function receivedBinary() {
        showResult(fr, "Binary");
    }
    */

    function showFileHeader() {
        showResultFileHeader(fr, "File Header");

    }

    function showTOC() {
        showResultTOC(fr, "Table of Content");
    }
}

function showResultVersion(fr, label) {

    var markup, result, n, aByte, byteStr, maxbytes, secondResult, byteOrder, strInt, secondMarkup;

    markup = [];
    result = fr.result;
    maxbytes = result.length;

    if (result.length > 32) maxbytes = 32;
    for (n = 0; n < maxbytes; ++n) { //result.length; ++n) {

        aByte = result.charCodeAt(n);
        byteStr = aByte.toString(16);           // radix. Hexadecimal numbers (base 16) specifies the base for representing numeric values
        if (byteStr.length < 2) {               // with this methode, character from bytestr should be precisely determined

            byteStr = "0" + byteStr;
        }

        markup.push(byteStr);
    }


    //bodyAppend("p", label + " (" + result.length + "  " + result.substr(0, 32) + "):");
    bodyAppend("p", label + " (" + "  " + result.substr(0, 32) + "):");     // display the label (Version, Byte Order, etc.)
    bodyAppend("pre", markup.join(" "));    // display the hexadecimal number which represents a certain piece of data structure 


}

function showResultFileHeader(fr, mark) {

    showByteOrder(fr, "Byte Order");
    showEmptyField(fr, "Empty Field");
    showTOCOffset(fr, "TOC Offset");
    showLSGSegID(fr, "LSG Segment ID")

    function showByteOrder(fr, label) {

        var markup, result, n, aByte, byteStr, maxbytesByteOrder;

        markup = [];
        result = fr.result;
        maxbytesByteOrder = result.length;

        if (result.length > 81) maxbytesByteOrder = 81;         // posisi datanya dimana persis (contoh: byteorder di 81)
        for (n = 80; n < maxbytesByteOrder; ++n) { //result.length; ++n) {      // n = maxbytes - 1

            aByte = result.charCodeAt(n);
            byteStr = aByte.toString(16);
            if (byteStr.length < 2) {

                byteStr = "0" + byteStr;
            }

            markup.push(byteStr);
        }

        //bodyAppend("p", label + ": " + result.substr(80, 81));
        bodyAppend("p", label + ": ");
        bodyAppend("pre", markup.join(" "));

    }

    function showEmptyField(fr, label) {

        var markup, result, n, aByte, byteStr, maxbytesEmptyField;

        markup = [];
        result = fr.result;
        maxbytesEmptyField = result.length;

        if (result.length > 85) maxbytesEmptyField = 85;
        for (n = 81; n < maxbytesEmptyField; ++n) { //result.length; ++n) {

            aByte = result.charCodeAt(n);           // charCodeAt: returns the Unicode value of the character at the specified index in a string (e.g. v = 86)
            byteStr = aByte.toString(16);
            if (byteStr.length < 2) {

                byteStr = "0" + byteStr;
            }

            markup.push(byteStr);
        }

        //bodyAppend("p", label + ": " + result.substr(82, 86));
        bodyAppend("p", label + ": ");
        bodyAppend("pre", markup.join(" "));

    }

    function showTOCOffset(fr, label) {

        var markup, result, n, aByte, byteStr, maxbytesTOCOffset;

        markup = [];
        result = fr.result;
        maxbytesTOCOffset = result.length;

        if (result.length > 89) maxbytesTOCOffset = 89;
        for (n = 85; n < maxbytesTOCOffset; ++n) { //result.length; ++n) {

            aByte = result.charCodeAt(n);           // charCodeAt: returns the Unicode value of the character at the specified index in a string (e.g. v = 86)
            byteStr = aByte.toString(16);
            if (byteStr.length < 2) {

                byteStr = "0" + byteStr;
            }

            markup.push(byteStr);
        }

        //bodyAppend("p", label + ": " + result.substr(86, 90));
        bodyAppend("p", label + ": ");
        bodyAppend("pre", markup.join(" "));

    }

    function showLSGSegID(fr, label) {

        var markup, result, n, aByte, byteStr, maxbytesLSG;

        markup = [];
        result = fr.result;
        maxbytesLSG = result.length;

        if (result.length > 105) maxbytesLSG = 105;
        for (n = 89; n < maxbytesLSG; ++n) { //result.length; ++n) {

            aByte = result.charCodeAt(n);
            byteStr = aByte.toString(16);
            if (byteStr.length < 2) {

                byteStr = "0" + byteStr;
            }

            markup.push(byteStr);
        }

        //bodyAppend("p", label + ": " + result.substr(90, 106));
        bodyAppend("p", label + ": ");
        bodyAppend("pre", markup.join(" "));

    }


}

function showResultTOC(fr, mark) {

    showEntryCount(fr, "Entry Count");
    showSegID(fr, "Seg ID");
    showSegmentOffset(fr, "Segment Offset");
    showSegmentLength(fr, "Segment Length");
    showSegmentAttributes(fr, "Segment Attribute");

    function showEntryCount(fr, label) {

        var markup, result, n, aByte, byteStr, maxbytesEntryCount;

        markup = [];
        result = fr.result;
        maxbytesEntryCount = result.length;

        if (result.length > 109) maxbytesEntryCount = 109;         // posisi datanya dimana persis (contoh: byteorder di 81)
        for (n = 105; n < maxbytesEntryCount; ++n) { //result.length; ++n) {      // n = maxbytes - 1

            aByte = result.charCodeAt(n);
            byteStr = aByte.toString(16);
            if (byteStr.length < 2) {

                byteStr = "0" + byteStr;
            }

            markup.push(byteStr);
        }

        //bodyAppend("p", label + ": " + result.substr(106, 110));
        bodyAppend("p", label + ": ");
        bodyAppend("pre", markup.join(" "));

    }

    function showSegID(fr, label) {

        var markup, result, n, aByte, byteStr, maxbytesSegID;

        markup = [];
        result = fr.result;
        maxbytesSegID = result.length;

        if (result.length > 125) maxbytesSegID = 125;
        for (n = 109; n < maxbytesSegID; ++n) { //result.length; ++n) {

            aByte = result.charCodeAt(n);
            byteStr = aByte.toString(16);
            if (byteStr.length < 2) {

                byteStr = "0" + byteStr;
            }

            markup.push(byteStr);
        }

        //bodyAppend("p", label + ": " + result.substr(110, 126));
        bodyAppend("p", label + ": ");
        bodyAppend("pre", markup.join(" "));

    }

    function showSegmentOffset(fr, label) {

        var markup, result, n, aByte, byteStr, maxbytesSegmentOffset;

        markup = [];
        result = fr.result;
        maxbytesSegmentOffset = result.length;

        if (result.length > 129) maxbytesSegmentOffset = 129;
        for (n = 125; n < maxbytesSegmentOffset; ++n) { //result.length; ++n) {

            aByte = result.charCodeAt(n);
            byteStr = aByte.toString(16);
            if (byteStr.length < 2) {

                byteStr = "0" + byteStr;
            }

            markup.push(byteStr);
        }

        //bodyAppend("p", label + ": " + result.substr(126, 130));
        bodyAppend("p", label + ": ");
        bodyAppend("pre", markup.join(" "));

    }

    function showSegmentLength(fr, label) {

        var markup, result, n, aByte, byteStr, maxbytesSegmentLength;

        markup = [];
        result = fr.result;
        maxbytesSegmentLength = result.length;

        if (result.length > 133) maxbytesSegmentLength = 133;
        for (n = 129; n < maxbytesSegmentLength; ++n) { //result.length; ++n) {

            aByte = result.charCodeAt(n);
            byteStr = aByte.toString(16);
            if (byteStr.length < 2) {

                byteStr = "0" + byteStr;
            }

            markup.push(byteStr);
        }

        //bodyAppend("p", label + ": " + result.substr(130, 134));
        bodyAppend("p", label + ": ");
        bodyAppend("pre", markup.join(" "));

    }

    function showSegmentAttributes(fr, label) {

        var markup, result, n, aByte, byteStr, maxbytesSegmentAttributes;

        markup = [];
        result = fr.result;
        maxbytesSegmentAttributes = result.length;

        if (result.length > 137) maxbytesSegmentAttributes = 137;
        for (n = 133; n < maxbytesSegmentAttributes; ++n) { //result.length; ++n) {

            aByte = result.charCodeAt(n);
            byteStr = aByte.toString(16);
            if (byteStr.length < 2) {

                byteStr = "0" + byteStr;
            }

            markup.push(byteStr);
        }

        //bodyAppend("p", label + ": " + result.substr(130, 134));
        bodyAppend("p", label + ": ");
        bodyAppend("pre", markup.join(" "));

    }







}


const changeEndianness = (string) => {
    const result = [];
    let len = string.length - 2;
    while (len >= 0) {
        result.push(string.substr(len, 2));
    }

    return result.join('');
}


function bodyAppend(tagName, innerHTML) {

    var elm;

    elm = document.createElement(tagName);
    elm.innerHTML = innerHTML;
    document.body.appendChild(elm);
}

/*
function BitLenghtCodecDecode(nValues, Vecu vCodeText, nBitsCodeText, Veci &ovValues) {
    nBits = 0; //number of codec Bits decoded so far
    nTotalBits = 0; //
    nTotalBits = 0, // Total number of codetext bits expected
        nValBits = 0, // Number of accumulated value bits
        iSymbol; // Decoded symbol value
    uVal = 0; // Current chunk of codetext bits
    cNumCurBits = 0; // Current field width in bits
    cBitsInMinSymbol; // Number of bits in the minimum symbol
    iMinSymbol = 0; // The minimum symbol value. Used as bias.
    iMaxSymbol = 0; // The maximum symbol value. Used as bias.
    nSyms = 0; // Number of symbols read so far
	* paiValues; // Pointer into ovValues where we write decoded values



    // Get codetext from the driver and loop over it until it's gone!
    ovValues.setLength(nValues);
    paiValues = ovValues.ptr();
    _iCurCodeText = 0;
    _pvCodeText = (Vecu *) & vCodeText;
    _pcCodeTextLen = & nBitsCodeText;



}
*/