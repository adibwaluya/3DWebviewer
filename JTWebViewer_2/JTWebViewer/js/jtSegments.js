class jtSegments {
    constructor(jtDataReader) {
        this.jtDataReader = jtDataReader;
        this.segID = "";
        this.segmentType = 0;
        this.segmentlength = 0;
        this.elementLength = 0;
        // Element header
        this.objectTypeID = "";
        this.objectBaseType = 0;
        this.objectID = 0;
        // TriStripSetShapeLODElement
        this.baseVersionNumber = 0;
        this.versionNumber = 0;
        this.vertexBindings = 0;
        // TopoMeshTopologicalCompressedLODData
        // TopoMeshLODData
        this.topoVersionNumber = 0;
        this.vertexRecordsObjectID = 0;
        this.scndTopoVersionNumber = 0;
        // Compressed Data Package Mk 2
        // WARNING: HUGE REVISION!
        //this.jtDataReader = jtDataReader;
        //this.valueCount = 0;
        //this.CODECType = 0;
        //this.codeTextLength = 0;
        //this.originalValues = 0;
        //this.predictorType = 0;    // not implemented yet
        //this.probabilityContexts = null; // not implemented yet
        //this.OOBValues = []; // not implemented yet
        //this.encodedData = [];
        //this.decodedData = []; 
    }

    //decodeBitlength(valCount, ctLength, encodedData) {
    //    var cBitsInMinSymbol, cBitsInMaxSymbol;
    //    var dataReader = new JTDataReader();
    //    dataReader.initFromArray(encodedData);
    //    var bitReader = new JTBitReader(dataReader, 0);
    //    var isVariable = bitReader.getBits(1);

    //    if (isVariable == 0) {
    //        cBitsInMinSymbol = bitReader.getBits(6);
    //        cBitsInMaxSymbol = bitReader.getBits(6);
    //        // just for testing
    //        bodyAppend("p", "cBitsInMinSymbol: " + cBitsInMinSymbol.toString(2));
    //        bodyAppend("p", "cBitsInMaxSymbol: " + cBitsInMaxSymbol.toString(2));

    //        //...
    //    } else {
    //        // not implemented yet
    //    }
    //}

    read() {
        var segIDs = [], objectTypeIDs = [], i, vals2read = 0;

        // Read the 16 bytes of each segment IDs of Segment Header
        for (i = 0; i < 16; ++i) {
            segIDs.push(this.jtDataReader.getData8().toString(16));
        }
        this.segID = segIDs.join("");
        this.segmentType = this.jtDataReader.getData32(0);
        this.segmentlength = this.jtDataReader.getData32(0).toString(16);

        // revised/added codes starting here (02.01.2020)
        this.elementLength = this.jtDataReader.getData32(0).toString(16);

        // Element Header
        for (i = 0; i < 16; ++i) {
            objectTypeIDs.push(this.jtDataReader.getData8().toString(16));
        }
        this.objectTypeID = objectTypeIDs.join("");
        this.objectBaseType = this.jtDataReader.getData8();
        this.objectID = this.jtDataReader.getData32();

        // In TriStripSetShapeLODElement
        this.baseVersionNumber = this.jtDataReader.getData16(0);
        this.versionNumber = this.jtDataReader.getData16(0);
        this.vertexBindings = this.jtDataReader.getData64(0).toString(16);

        // TopoMeshTopologicalCompressedLODData
        // TopoMeshLODData
        this.topoVersionNumber = this.jtDataReader.getData16(0);
        this.vertexRecordsObjectID = this.jtDataReader.getData32(0).toString(16);
        this.scndTopoVersionNumber = this.jtDataReader.getData16(0);

        // CDP2
        // WARNING: HUGE REVISION!
        //this.valueCount = this.jtDataReader.getData32(0).toString(16);
        //this.CODECType = this.jtDataReader.getData8();
        //this.codeTextLength = this.jtDataReader.getData32(0).toString(16);
        //this.originalValues = this.jtDataReader.getData32(0).toString(16);
        
        //if (this.CODECType < 4) {
        //    this.codeTextLength = this.jtDataReader.getData32(0);
        //    vals2read = Math.ceil(this.codeTextLength / 32.);
        //    for (i = 0; i < vals2read; ++i) {
        //        this.encodedData.push(this.jtDataReader.getData32(0));
        //    }
        //    if (this.CODECType == 3) { // Arithmetic 
        //        // read prob context
        //        // read oob Values
        //        // decode
        //    } else if (this.CODECType == 1) { // BitLength
        //        this.decodedData = this.decodeBitlength(this.valueCount, this.codeTextLength, this.encodedData);
        //    } else if (this.CODECType == 0) { // NULL decoder
        //        for (i = 0; i < this.valueCount; ++i) {
        //            this.decodedData.push(this.encodedData[i]);
        //        }
        //    }
        //} else {
        //    //Anything else but none/bitLength or Arithmetic: not yet implemented
        //}

    }

    print() {
        bodyAppend("p", "LOD Segment");
        bodyAppend("p", "SegID: " + this.segID);
        bodyAppend("p", "Segment Type: " + this.segmentType);       // Segment type 6 for shape
        bodyAppend("p", "Segment Length: " + this.segmentlength);   // Printed as decimal

        // revised/added codes
        bodyAppend("p", "Element Length: " + this.elementLength);

        // Element Header
        bodyAppend("p", "Element Header: " + "ObjectTypeID: " + this.objectTypeID + "; ObjectBaseType: " + this.objectBaseType + "; Object ID: " + this.objectID);

        // In TriStripSetShapeLODElement
        bodyAppend("p", "In TriStripSetShapeLODElement");
        bodyAppend("p", "Vertex Shape LOD Data V9: " + "BaseVersionNumber: " + this.baseVersionNumber + "; VersionNumber: " + this.versionNumber + "; VertexBindings: " + this.vertexBindings);

        // TopoMeshTopologicalCompressedLODData
        // TopoMeshLODData
        bodyAppend("p", "TopoMeshTopologicalCompressedLODData (TopoMeshLODData (VersionNumber: " + this.topoVersionNumber + "; VertexRecordsObjectID: " + this.vertexRecordsObjectID + ")); VersionNumber: " + this.scndTopoVersionNumber);

        // CDP2
        // WARNING: HUGE REVISION!
        //bodyAppend("p", "TopologicalCompressedRepData: Face Degrees: ");
        //bodyAppend("p", "CDP Package: valueCount: " + this.valueCount + "; CODECType: " + this.CODECType + "; codeTextLength: " + this.codeTextLength + "; Original Values: " + this.originalValues);
        //bodyAppend("p", "decoded: " + this.decodedData);
    }
}