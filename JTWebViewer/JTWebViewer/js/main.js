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
        fr.onload = receivedText;
        fr.readAsText(file);
    }

    function receivedText() {

        showResult(fr, "Text");
        fr = new FileReader();
        fr.onload = receivedBinary;
        fr.readAsBinaryString(file);
    }

    function receivedBinary() {
        showResult(fr, "Binary");
    }
}



function showResult(fr, label) {

    var markup, result, n, aByte, byteStr, maxbytes, secondResult, byteInt, swap, byteOrder, m;

    markup = [];
    result = fr.result;
    maxbytes = result.length;

    if (result.length > 32) maxbytes = 32;
    for (n = 0; n < maxbytes; ++n) { //result.length; ++n) {

        aByte = result.charCodeAt(n);
        byteStr = aByte.toString(16);
        if (byteStr.length < 2) {

            byteStr = "0" + byteStr;
        }

        markup.push(byteStr);
    }

    bodyAppend("p", label + " (" + result.length + "  " + result.substr(0, 32) + "):");
    bodyAppend("pre", markup.join(" "));

    secondResult = fr.secondResult;
    byteOrder = secondResult.length;

    if (secondResult.length > 81) byteOrder = 81;
    for (n = 80; n < byteOrder + 1; ++n) {
        aByte = secondResult.charCodeAt(n);
        byteInt = aByte.byteArrayToInt();
        //byteInt = byteStr.parseInt(32);
        if (byteInt < 2) {

            byteInt = "0" + byteInt;
        }

        markup.push(byteInt);
    }

    bodyAppend("bo", secondResult.substr(80, 82));

    //if (result.length > 81) maxbytes = 81;
    //for (n = 80; n < maxbytes; ++n) {

    //    aByte = result.charCodeAt(n);
    //    byteStr = aByte.toString(16);
    //    if (byteStr.length < 2) {
    //        byteStr = "0" + byteStr;
    //    }
    //    swap = changeEndianness(byteStr);

    //    markup.push(swap);
    //}


    //bodyAppend("bo", result.substr(80, 82));
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