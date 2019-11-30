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

        fr.readAsBinaryString(file);
    }

    function receivedText() {

        showResultVersion(fr, "Text");
        showResultFileHeader(fr, "File Header");


        fr = new FileReader();


        fr.readAsBinaryString(file);
    }




    function receivedTOC() {
        showResultTOC(fr, "TOC");
        fr = new FileReader();
        fr.onload = showTOC;
        fr.readAsBinaryString(file);
    }



}

function showResultVersion(fr, label) {

    var markup, a, h, bo, e, toc, segid, result, n, aByte, byteStr, maxbytes, secondResult, byteOrder, strInt, secondMarkup, m, item;


    a = [];

    a[0] = 80; a[1] = 81; a[2] = 85; a[3] = 89; a[4] = 105;
    result = fr.result;

    a.forEach(myFunction);
    item = 0;

    function myFunction(item, index) {
        markup = [];
        if (item == 80) { n = 0; } else { n = a[index - 1]; }
        for (n; n < item; n++) { //result.length; ++n) {

            aByte = result.charCodeAt(n);
            byteStr = aByte.toString(16);           // radix. Hexadecimal numbers (base 16) specifies the base for representing numeric values
            if (byteStr.length < 2) {               // with this methode, character from bytestr should be precisely determined

                byteStr = "0" + byteStr;
            }

            markup.push(byteStr);
        }
        if (item == 80) { n = 0; } else { n = a[index - 1]; }
        bodyAppend("p", label + " (" + "  " + result.substr(n, item) + "):");     // display the label (Version, Byte Order, etc.)
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

    var markup, a, result, n, aByte, byteStr, byteOrder, EntryTOC;

    //markup = [];
    //EntryTOC = returnTOCEntrys(fr);
    result = fr.result;
    EntryTOC = 7;

    a = [];
    a.length = EntryTOC * 4;
    for (n = 0; n < a.length; n++) {

        if (n % 4 == 0) {
            var x = 125 + 28 * (n - 3 * n / 4);
            var y = 129 + 28 * (n - 3 * n / 4);
            var z = 133 + 28 * (n - 3 * n / 4);
            var omega = 137 + 28 * (n - 3 * n / 4); a[n] = x; a[n + 1] = y; a[n + 2] = z; a[n + 3] = omega;
        }


    }


    //maxbytes = result.length;

    //if (result.length > 32) maxbytes = 32;
    a.forEach(myFunction);
    item = 0;


    function myFunction(item, index) {
        markup = [];
        if (item == 125) { n = 109; } else { n = a[index - 1]; }
        for (n; n < item; n++) { //result.length; ++n) {

            aByte = result.charCodeAt(n);
            byteStr = aByte.toString(16);           // radix. Hexadecimal numbers (base 16) specifies the base for representing numeric values
            if (byteStr.length < 2) {               // with this methode, character from bytestr should be precisely determined

                byteStr = "0" + byteStr;
            }

            markup.push(byteStr);
        }
        if (item == 125) { n = 109; } else { n = a[index - 1]; }
        bodyAppend("p", label + " (" + "  " + result.substr(n, item) + "):");     // display the label (Version, Byte Order, etc.)
        bodyAppend("pre", markup.join(" "));

    }


}



function bodyAppend(tagName, innerHTML) {

    var elm;

    elm = document.createElement(tagName);
    elm.innerHTML = innerHTML;
    document.body.appendChild(elm);
}

