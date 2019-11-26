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
        bodyAppend("p", "This browser doesn't seem to support the 'files' property of file inputs");
    }

    else if (!input.files[0]) {
        bodyAppend("p", "Please select file before clicking 'Load'");
    }

    else {
        file = input.files[0];
        fr = new FileReader;
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

function showResult(fr, label) {                        // file reader and label as parameter
    var markup,
        result,
        n,
        aByte,
        byteStr,
        maxbytesVersion;
    //secondResult,
    //secondMarkup,
    //maxbytesFinalFive,
    //maxbytesByteOrder;
    //uuid,
    //identifier;

    markup = [];    // defines an empty object
    result = fr.result; // result from the file reader

    // defining the first 32 hexadecimal
    maxbytesVersion = result.length;
    if (result.length > 130) maxbytesVersion = 130;

    for (n = 0; n < maxbytesVersion; ++n) {
        aByte = result.charCodeAt(n);
        byteStr = aByte.toString(16);   // radix. Hexadecimal numbers (base 16) specifies the base for representing numeric values
        if (byteStr.length < 2) {
            byteStr = "0" + byteStr;
        }

        markup.push(byteStr);
    }

    //bodyAppend("p", label + " (" + result.length + "  " + result.substr(0, 130) + "):");
    bodyAppend("p", result.substr(0, 130));
    bodyAppend("pre", markup.join(" "));
    bodyAppend("bo", result.substr(81, 82));

    // Methode only for testing, but ain't workin yet
    /*
    secondResult = fr.secondResult;

    maxbytesByteOrder = secondResult.length;
    if (secondResult.length > 81) maxbytesByteOrder = 81;

    for (n = 80; n < maxbytesByteOrder; ++n) {
        aByte = secondResult.charCodeAt(n);
        byteStr = aByte.toString(16);
        if (byteStr.length < 2) {
            byteStr = "0" + byteStr;
        }

        markup.push(byteStr);

    }

    bodyAppend("test", secondResult.length + secondResult(81, 82));
    */

}
/* Do we even need this for fstream?
http = require('http');
fs = require('fs');

http.createServer(function (req, res) {
    var filename = __dirname + req.url;

    var readStream = fs.createdReadStream(filename);

    readStream.on('error', function (err) {
        res.end(err);
    });
}).listen(8080);
*/

/*
 *if (result.length > 145) maxbytesByteOrder = 145;

for (n = 145; maxbytesByteOrder < 145; ++n) {
    aByte = result.charCodeAt(n);
    byteStr = aByte.toString(16);
    if (byteStr.length < 2) {
        byteStr = "0" + byteStr;
    }

    markup.push(byteStr);
}
 * 
 * */




//bodyAppend("bo", "(" + secondResult.substr(80, 82));



/* 
function myFileHeader(fr, label) {
    var jtVersion,
        jtByteOrder = 0,
        jtFileAttributes = 0,
        jtTOCOffset = 0,
        generateGUID = createGUID(),
        fs,
        myReadStream,
        readMe,
        markup,
        result;

    var http = require('http');
    var fs = require('fs');

    http.createServer(function (req, res) {
        var filename = 
    });
    result = fr.result;
    jtVersion = result.length;

   


    /*
     myFileHeader(myReadStream.on('data', function (chunk) {


    }));
     */


function createGUID() {
    var dt = new Date().getTime();
    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);

    });

    return guid;
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
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