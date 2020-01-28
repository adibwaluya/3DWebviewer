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
       }

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
        //this.elementLength = this.jtDataReader.getData32(0).toString(16);
        this.elementLength = this.jtDataReader.getData16(1);
        this.elementLength += this.jtDataReader.getData16(1);

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

    }
}