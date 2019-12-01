// Load JT-Datei to web browser
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
        fr.readAsBinaryString(file);
    }

    // required so that both Version and File Header could be read as binary string and later shown in browser
    function receivedText() {

        showResultVersion(fr, "Text");
        showResultFileHeader(fr, "File Header");
        fr = new FileReader();
        fr.readAsBinaryString(file);
    }

    // required so that the Table of Contents could be read as binary string and later shown in browser
    function receivedTOC() {

        showResultTOC(fr, "TOC");
        fr = new FileReader();
        fr.onload = showTOC;
        fr.readAsBinaryString(file);
    }

}

function showResultVersion(fr, label) {

    var markup, a, result, n, aByte, byteStr;

    a = [];

    a[0] = 80; a[1] = 81; a[2] = 85; a[3] = 89; a[4] = 105;     // Byte position of each File Header Elements
    result = fr.result;

    a.forEach(myFunction);      // this is implemented so that the repetitive function could be avoided
    item = 0;

    function myFunction(item, index) {
        markup = [];
        if (item == 80) { n = 0; } else { n = a[index - 1]; }       // Byte Order position is at byte 80 and will be set as the first index
        for (n; n < item; n++) {

            aByte = result.charCodeAt(n);
            byteStr = aByte.toString(16);           // Radix. Hexadecimal numbers (base 16) specifies the base for representing numeric values
            if (byteStr.length < 2) {               // with this methode, character from bytestr should be precisely determined whether it's a string or other data type

                byteStr = "0" + byteStr;            // if it's not a character, the value will be 0, hence the length will be 1 (< 2)
            }

            markup.push(byteStr);
        }

        // This If-statement will be implemented to show the label of each data structure of File Header
        if (item == 80) {
            bodyAppend("p", label + " (" + "  " + result.substr(0, 80) + "):");
        }
        else if (item == 81) {
            bodyAppend("p", "Byte Order");
        }
        else if (item == 85) {
            bodyAppend("p", "Empty Field");
        }
        else if (item == 89) {
            bodyAppend("p", "TOC Offset");
        }
        else if (item = 105) {
            bodyAppend("p", "LSG Segment ID");
        }

        bodyAppend("pre", markup.join(" "));
    }
}

//function returnTOCEntrys(fr) 
//{
//    var result, aByte, byteStr, myNum;
//    result = fr.result;
//    b = [];


//    for (n = 105; n < 109; n++)
//    {
//        aByte = result.charCodeAt(n);
//        byteStr = aByte.toString(16);           // radix. Hexadecimal numbers (base 16) specifies the base for representing numeric values
//        if (byteStr.length < 2) {               // with this methode, character from bytestr should be precisely determined

//            byteStr = "0" + byteStr;
//        }
//        b.push(byteStr);
//        function toHexString(b) {
//            return Array.prototype.map.call(b, function (byte) {
//                return ('0' + (byte & 0xFF).toString(16)).slice(-2);
//            }).join('');
//        }



//    }

//    return  myNum = parseInt(toHexString(b), 16);
//    //return console.log(TOCENTRY);


//}

function showResultTOC(fr, label) {

    var markup, a, result, n, aByte, byteStr, EntryTOC;

    //markup = [];
    //EntryTOC = returnTOCEntrys(fr);
    result = fr.result;
    EntryTOC = 7;
    a = [];
    a.length = EntryTOC * 4;        // multiple by 4 because Table of Contents consist of 4 elements with an exact position of byte
    for (n = 0; n < a.length; n++) {

        if (n % 4 == 0) {
            var w = 125 + 28 * (n - 3 * n / 4);     // exact position for Segment ID
            var x = 129 + 28 * (n - 3 * n / 4);     // exact position for Segment Offset
            var y = 133 + 28 * (n - 3 * n / 4);     // exact position for Segment Length
            var z = 137 + 28 * (n - 3 * n / 4); a[n] = w; a[n + 1] = x; a[n + 2] = y; a[n + 3] = z;     // exact position for Segment Attributes
        }
    }

    /*
     * JT Data could have few or many Entry Counts (depends on the geometry and the number is never precise)
     * To avoid repetitive function, forEach would be implemented
    */
    a.forEach(myFunction);
    item = 0;
    function myFunction(item, index) {
        markup = [];
        if (item == 125) { n = 109; } else { n = a[index - 1]; }       // Segment ID position of the first Entry Count is from byte 109 until 125
        for (n; n < item; n++) { //result.length; ++n) {

            aByte = result.charCodeAt(n);
            byteStr = aByte.toString(16);
            if (byteStr.length < 2) {

                byteStr = "0" + byteStr;
            }

            markup.push(byteStr);
        }

        // This If-statement will be implemented to show the label of each data structure of Table Of Contents, also to avoid repetitive function
        if (item == 125 + 28 * a.indexOf(item) / 4) {
            bodyAppend("p", "Segment ID");
        }
        else if (item == 129 + 28 * ((a.indexOf(item) - 1) / 4)) {
            bodyAppend("p", "Segment Offset");
        }
        else if (item == 133 + 28 * ((a.indexOf(item) - 2) / 4)) {
            bodyAppend("p", "Segmenth Length");
        }
        else if (item == 137 + 28 * ((a.indexOf(item) - 3) / 4)) {
            bodyAppend("p", "Segment Attributes");
        }

        bodyAppend("pre", markup.join(" "));

    }

}

// Save the information of any JT Data element so that it could be shown in browser
function bodyAppend(tagName, innerHTML) {

    var elm;
    elm = document.createElement(tagName);
    elm.innerHTML = innerHTML;
    document.body.appendChild(elm);
}

