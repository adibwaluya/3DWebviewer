// Load JT-Data to web browser
var streamReader;
//var TOC;
var i, x,
    segmentGUID = [],
    segmentOffsets = [],
    segmentlengths = [],
    segmentAttributes = [],
    lodPosition = [];
    //elementlenght = [];

// To analyze the positions of determined segment type (type 6 = Shape) in the data 
// Redirect only to position/segment offset that has type 6 (Shape)
function getPosition() {
    var i;
    for (i = 0; i < segmentAttributes.length; ++i) {    // total of data that has type 6
        if (segmentAttributes[i] == 6000000) {        // 6000000 in hexa (type 6)
            streamReader.position = segmentOffsets[i];
            lodPosition.push(streamReader.position);    // Store the positions in array
        }
    }
    streamReader.position = 0;
}


// Load JT-File
function loadFile() {
    var input, file, fr, blob;

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
        streamReader = new JTDataReader();
        streamReader.initFromFile(input.files[0]);
    }

}

function printHex(inVal) {
    return "0x" + inVal.toString(16);
}

function int2float(expo, mant) {
    var i, sum = 1;
    for (i = 1; i != 23; i++) {
        sum += mant & (1 << (23 - i)) * Math.pow(2, -i);
    }
    return Math.pow(-1, (expo & 256)) * Math.pow(2, ((expo & 255) - 127)) * sum;
}

// Show file in Webbrowser
function showFile() {
    var i, fileHeader, filetoc, fileSegment, topoCompressedRepData, arithEx, compressPosition = 0, vertexCoorArr;
    fileHeader = new jtHeader(streamReader);
    fileHeader.read();
    fileHeader.print();

    filetoc = new jtTOC(streamReader);
    filetoc.read();
    filetoc.print();

    fileSegment = new jtSegments(streamReader);
    topoCompressedRepData = new CDP2(streamReader);
    getPosition();
    coordinates = new CDP2(streamReader);
    arithEx = new CDP2(streamReader);
    vertexCoorArr = new vertexCoordinateArray(streamReader);
    for (var ii = 0; ii < lodPosition.length; ++ii) {
        streamReader.position = lodPosition[ii];
        fileSegment.read();
        fileSegment.print();
        compressPosition = streamReader.position + 150;
        
        while (streamReader.position < compressPosition)
        {
            topoCompressedRepData.read();           
            topoCompressedRepData.print();
        }
        streamReader.position = 1854;
        vertexCoorArr.read();
        var i = 0;
        do {
            i += 1;
            coordinates.read();
           coordinates.print();
        } 
      while (i < 7);
        
        compressPosition = 0;
    }
 

}

function bodyAppend(tagName, innerHTML) {
    var elm;

    elm = document.createElement(tagName);
    elm.innerHTML = innerHTML;
    document.body.appendChild(elm);
}
