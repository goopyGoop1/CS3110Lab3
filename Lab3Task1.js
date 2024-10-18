// CS3110 Lab3 Task 1 
// This will create the nested squares and diamonds parrertn on a scale from 1-6 

var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_ModelMatrix * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

function main() {
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Position < 0 || a_Color < 0) {
        console.log('Failed to get the storage location of a_Position or a_Color');
        return;
    }

    var n = initVertexBuffers(gl, a_Position, a_Color);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    var modelMatrix = new Matrix4();
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    gl.clearColor(0, 0, 0, 1);

    var currentAngle = 0;
    var angleIncrement = 3.0; // Adjust for rotation speed
    var level = 1; // Starting level

    // --- Event listeners for buttons ---
    document.getElementById('levelUp').addEventListener('click', () => {
        level = Math.min(level + 1, 6); // Increase level, max 6
    });
    document.getElementById('levelDown').addEventListener('click', () => {
        level = Math.max(level - 1, 1); // Decrease level, min 1
    });

  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    currentAngle += angleIncrement;

    // --- Draw the shapes based on the current level ---
    for (let i = 0; i < level; i++) {
        var angle = currentAngle + (45 * i);
        var scale = Math.pow(0.5, i);  // Adjust scaling factor as needed

        drawSquare(gl, u_ModelMatrix, modelMatrix, angle, scale);
        drawDiamond(gl, u_ModelMatrix, modelMatrix, angle, scale); // Offset diamond by 45 degrees
    }

    requestAnimationFrame(render);
}

render();
}

function drawSquare(gl, u_ModelMatrix, modelMatrix, angle, scale) {
    modelMatrix.setRotate(angle, 0, 0, 1);
    modelMatrix.scale(scale, scale, 1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.LINE_LOOP, 0, 4);
}

function drawDiamond(gl, u_ModelMatrix, modelMatrix, angle, scale) {
    modelMatrix.setRotate(angle, 0, 0, 1);
    modelMatrix.scale(scale, scale, 1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.LINE_LOOP, 4, 4); // Use a different offset for diamond vertices
}

function initVertexBuffers(gl, a_Position, a_Color) {
    // Interleaved data for both square and diamond
    var interleavedData = new Float32Array([
        // Square vertices
        0.90, 0.90, 1.0, 0.0, 0.0, 1.0, // Top-right (Red)
        -0.90, 0.90, 0.0, 1.0, 0.0, 1.0, // Top-left (Green)
        -0.90, -0.90, 0.0, 0.0, 1.0, 1.0, // Bottom-left (Blue)
        0.90, -0.90, 1.0, 1.0, 0.0, 1.0,  // Bottom-right (Yellow)

        // Diamond vertices
        -0.90, 0.0, 1.0, 0.0, 0.0, 1.0, // Top
        0.0, -0.90, 0.0, 1.0, 0.0, 1.0, // Left
        0.90, 0.0, 0.0, 0.0, 1.0, 1.0, // Bottom
        0.0, 0.90, 1.0, 1.0, 0.0, 1.0  // Right
    ]);

    var n = 8; // The total number of vertices

    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, interleavedData, gl.STATIC_DRAW);

    const FSIZE = interleavedData.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);

    return n;
}

