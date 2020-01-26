class vertexCoordinateArray {
    constructor(jtDataReader) {
        this.jtDataReader = jtDataReader;
        this.hash = 0;
        this.vertexBindings = 0;
        this.quanti = 0;
        this.numberOfTopoVertices = 0;
        this.numberOfVertexAtt = 0;
        // Compressed Vertex Coordinate Array
        this.UniqueVertexCount;
        this.numOfComponents = 0;
        this.Xmin;
        this.Xmax;
        this.numOfBitsX;
        this.Ymin;
        this.Ymax;
        this.numOfBitsY;
        this.Zmin;
        this.Zmax;
        this.numOfBitsZ;
    }

    read() {
        this.hash = this.jtDataReader.getData32(0);
        this.vertexBindings = this.jtDataReader.getData64(0);
        this.quanti = this.jtDataReader.getData32(0);
        this.numberOfTopoVertices = this.jtDataReader.getData32(0);
        this.numberOfVertexAtt = this.jtDataReader.getData32(0);
        this.UniqueVertexCount = this.jtDataReader.getData32(0);
        this.numOfComponents = this.jtDataReader.getData8();
        this.Xmin = this.jtDataReader.getData32(0);
        this.Xmax = this.jtDataReader.getData32(0);
        this.numOfBitsX = this.jtDataReader.getData8();
        this.Ymin = this.jtDataReader.getData32(0);
        this.Ymax = this.jtDataReader.getData32(0);
        this.numOfBitsY = this.jtDataReader.getData8();
        this.Zmin = this.jtDataReader.getData32(0);
        this.Zmax = this.jtDataReader.getData32(0);
        this.numOfBitsZ = this.jtDataReader.getData8();
    }


}