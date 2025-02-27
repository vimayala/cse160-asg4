// Cube.js
// Defines the Cube class
// Defines color and matrix
// Uses Ch 5 methods
class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = -2;
        this.initBuffers();
    }

    initBuffers() {
        // Define cube vertices
        this.vertices = new Float32Array([
            // Front face
            0.0, 0.0, 0.0,    1.0, 1.0, 0.0,    1.0, 0.0, 0.0,
            0.0, 0.0, 0.0,    0.0, 1.0, 0.0,    1.0, 1.0, 0.0,
            // Back face
            0.0, 0.0, 1.0,    1.0, 1.0, 1.0,    1.0, 0.0, 1.0,
            0.0, 0.0, 1.0,    0.0, 1.0, 1.0,    1.0, 1.0, 1.0,
            // Top face
            0.0, 1.0, 0.0,    0.0, 1.0, 1.0,    1.0, 1.0, 1.0,
            0.0, 1.0, 0.0,    1.0, 1.0, 1.0,    1.0, 1.0, 0.0,
            // Bottom face
            0.0, 0.0, 0.0,    0.0, 0.0, 1.0,    1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,    0.0, 0.0, 1.0,    1.0, 0.0, 1.0,
            // Right face
            1.0, 0.0, 0.0,    1.0, 1.0, 1.0,    1.0, 0.0, 1.0,
            1.0, 0.0, 0.0,    1.0, 1.0, 0.0,    1.0, 1.0, 1.0,
            // Left face
            0.0, 0.0, 0.0,    0.0, 1.0, 0.0,    0.0, 1.0, 1.0,
            0.0, 1.0, 1.0,    0.0, 0.0, 0.0,    0.0, 0.0, 1.0
        ]);
        
        // UV coordinates
        this.uvs = new Float32Array([
            0, 0,    1, 1,   1, 0,             0, 0,    0, 1,   1, 1, 
            1, 0,    0, 1,   0, 0,             1, 0,    1, 1,   0, 1, 
            0, 0,    0, 1,   1, 1,             0, 0,    1, 1,   1, 0, 
            0, 1,    0, 0,   1, 1,             1, 1,    0, 0,   1, 0, 
            0, 0,    1, 1,   1, 0,             0, 0,    0, 1,   1, 1, 
            1, 0,    1, 1,   0, 1,             0, 1,    1, 0,   0, 0  
        ]);
        
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        this.uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);


        // Asked ChatGPT to give me these to save time
        this.normals = new Float32Array([
            // Front face
            0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,
            // Back face
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
            // Top face (normal pointing up)
            0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,
            // Bottom face (normal pointing down)
            0.0, -1.0, 0.0,  0.0, -1.0, 0.0,  0.0, -1.0, 0.0,  0.0, -1.0, 0.0,  0.0, -1.0, 0.0,  0.0, -1.0, 0.0,
            // Right face
            1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,
            // Left face
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0
        ]);
        
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
        
        // Pass the normals to the shader
        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Normal);
        
    }

    render() {
        var rgba = this.color;

        // Pass color of the point
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
                
        // Pass texture number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass color of the point
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // drawTriangle3DUVNormal(
        //     [0, 0, 0,    1, 1, 0,    1, 0, 0],      // position
        //     [0,0,   1,1,    1,0],                   // uv
        //     [0,0,-1,    0,0,-1,     0,0,1]          // normal
        // );
        
        // Front of the Cube
        drawTriangle3DUVNormal(
            [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0],   // position
            [0, 0, 1, 1, 1, 0],                                 // uv
            [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0]      // normal
        );

        drawTriangle3DUVNormal(
            [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0],
            [0, 0, 0, 1, 1, 1],
            [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0]
        );

        // Back of the Cube
        drawTriangle3DUVNormal(
            [1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0],

            // [0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0],
            [1, 0, 0, 1, 0, 0],
            [0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0]
        );

        drawTriangle3DUVNormal(
            [1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0],

            // [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0],
            [1, 0, 1, 1, 0, 1],
            [0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0]
        );

        // Top of the Cube
        drawTriangle3DUVNormal(
            [0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0],
            [0, 0, 0, 1, 1, 1],
            [0.0, 1.0, 0.0, 0.0, 1.0, -1.0, 0.0, 1.0, -1.0]
        );

        drawTriangle3DUVNormal(
            [0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0],
            [0, 0, 1, 1, 1, 0],
            [0.0, 1.0, 0.0, 0.0, 1.0, -1.0, 0.0, 1.0, -1.0]
        );

        // Right of the Cube
        drawTriangle3DUVNormal(
            [1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0],
            [0, 0, 1, 1, 1, 0],
            [1.0, 0.0, 0.0, 1.0, 0.0, -1.0, 1.0, 0.0, -1.0]
        );

        drawTriangle3DUVNormal(
            [1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0],
            [0, 0, 0, 1, 1, 1],
            [1.0, 0.0, 0.0, 1.0, 0.0, -1.0, 1.0, 0.0, -1.0]
        );

        // gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);

        // Bottom of the Cube
        drawTriangle3DUVNormal(
            [0.0, 0.0, 0.0,  0.0, 0.0, 1.0,  1.0, 0.0, 0.0],
            [0, 0,  0, 1,  1, 0],
            [0.0, -1.0, 0.0,  0.0, -1.0, 0.0,  0.0, -1.0, 0.0]
        );

        drawTriangle3DUVNormal(
            [1.0, 0.0, 0.0,  0.0, 0.0, 1.0,  1.0, 0.0, 1.0],
            [1, 0,  0, 1,  1, 1],
            [0.0, -1.0, 0.0,  0.0, -1.0, 0.0,  0.0, -1.0, 0.0]
        );

        // // Left of the Cube
        // drawTriangle3DUVNormal(
        //     [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0],
        //     [1, 0, 1, 1, 0, 1],
        //     [-1.0, 0.0, 0.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0]
        // );

        // drawTriangle3DUVNormal(
        //     [0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0],
        //     [0, 1, 1, 0, 0, 0],
        //     [-1.0, 0.0, 0.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0]
        // );

        // Left Face
        drawTriangle3DUVNormal(
            [0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 1.0], 
            [0, 0,  0, 1,  1, 1],
            [-1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0]
        );

        drawTriangle3DUVNormal(
            [0.0, 1.0, 1.0,  0.0, 0.0, 0.0,  0.0, 0.0, 1.0], 
            [1, 1,  0, 0,  1, 0],  // Adjusted UVs
            [-1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0]
        );


        // gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(a_Position);
        
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        // gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(a_TexCoord);

        // gl.uniform1i(u_whichTexture, this.textureNum);

        // gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

    renderFast(){
        // var rgba = this.color;

        // // Pass color of the point
        // gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
                
        // // // Pass texture number
        // gl.uniform1i(u_whichTexture, this.textureNum);

        // // Pass color of the point
        // gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        // var allVerts = [];
        //  allVerts = allVerts.concat([0.0, 0.0, 0.0,    1.0, 1.0, 0.0,    1.0, 0.0, 0.0]);

        //  allVerts = allVerts.concat([0.0, 0.0, 0.0,    1.0, 1.0, 0.0,    1.0, 0.0, 0.0]);
        //  allVerts = allVerts.concat([0.0, 0.0, 0.0,    0.0, 1.0, 0.0,    1.0, 1.0, 0.0]);
        // // Back face
        //  allVerts = allVerts.concat([0.0, 0.0, 1.0,    1.0, 1.0, 1.0,    1.0, 0.0, 1.0]);
        //  allVerts = allVerts.concat([0.0, 0.0, 1.0,    0.0, 1.0, 1.0,    1.0, 1.0, 1.0]);
        // // Top
        //  allVerts = allVerts.concat([0.0, 1.0, 0.0,    0.0, 1.0, 1.0,    1.0, 1.0, 1.0]);
        //  allVerts = allVerts.concat([0.0, 1.0, 0.0,    1.0, 1.0, 1.0,    1.0, 1.0, 0.0]);
        // // Bottom
        //  allVerts = allVerts.concat([0.0, 0.0, 0.0,    0.0, 0.0, 1.0,    1.0, 0.0, 0.0]);
        //  allVerts = allVerts.concat([1.0, 0.0, 0.0,    0.0, 0.0, 1.0,    1.0, 0.0, 1.0]);
        //  // Right
        //  allVerts = allVerts.concat([1.0, 0.0, 0.0,    1.0, 1.0, 1.0,    1.0, 0.0, 1.0]);
        //  allVerts = allVerts.concat([1.0, 0.0, 0.0,    1.0, 1.0, 0.0,    1.0, 1.0, 1.0]);
        // // Left
        // allVerts = allVerts.concat([0.0, 0.0, 0.0,    0.0, 1.0, 0.0,    0.0, 1.0, 1.0]);
        // allVerts = allVerts.concat([0.0, 1.0, 1.0,    0.0, 0.0, 0.0,    0.0, 0.0, 1.0]);
        // drawTriangle3D(allVerts);

        var rgba = this.color;

        // Pass color of the point
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
                
        // Pass texture number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass model transformation
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Had to change it, calling drawTriangle3D wasn't working

        // Define cube vertices directly in a Float32Array
        var allVerts = new Float32Array([
            // Front face
            0.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 0.0, 0.0,
            0.0, 0.0, 0.0,   0.0, 1.0, 0.0,   1.0, 1.0, 0.0,
            // Back face
            0.0, 0.0, 1.0,   1.0, 1.0, 1.0,   1.0, 0.0, 1.0,
            0.0, 0.0, 1.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0,
            // Top face
            0.0, 1.0, 0.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0,
            0.0, 1.0, 0.0,   1.0, 1.0, 1.0,   1.0, 1.0, 0.0,
            // Bottom face
            0.0, 0.0, 0.0,   0.0, 0.0, 1.0,   1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,   0.0, 0.0, 1.0,   1.0, 0.0, 1.0,
            // Right face
            1.0, 0.0, 0.0,   1.0, 1.0, 1.0,   1.0, 0.0, 1.0,
            1.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 1.0, 1.0,
            // Left face
            0.0, 0.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 1.0,
            0.0, 1.0, 1.0,   0.0, 0.0, 0.0,   0.0, 0.0, 1.0
        ]);
        // Bind and update vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, allVerts, gl.DYNAMIC_DRAW);

        // Enable vertex attributes
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        // Draw the cube
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        
    }
}
