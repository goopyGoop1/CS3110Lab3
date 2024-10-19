// CS3110 Lab3 Task 1 
// This will create the nested squares and diamonds parrertn on a scale from 1-6 

/**
 * main() function: Entry point of the WebGL program. 
 * Initializes WebGL context, shaders, buffers, event listeners, and starts the rendering loop.
 */ 

/**
   * render() function: The main rendering loop. 
   * Clears the canvas, updates the rotation angle, draws the shapes, and requests the next animation frame.
   */
/**
 * drawSquare(gl, u_ModelMatrix, modelMatrix, angle, scale): Draws a square.
 * Sets the rotation and scale of the model matrix and draws a line loop for the square.
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {WebGLUniformLocation} u_ModelMatrix - The location of the u_ModelMatrix uniform in the shader program.
 * @param {Matrix4} modelMatrix - The Matrix4 object for model transformations.
 * @param {number} angle - The rotation angle in degrees.
 * @param {number} scale - The scaling factor.
 */

/**
 * drawDiamond(gl, u_ModelMatrix, modelMatrix, angle, scale): Draws a diamond.
 * Sets the rotation and scale of the model matrix and draws a line loop for the diamond.
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {WebGLUniformLocation} u_ModelMatrix - The location of the u_ModelMatrix uniform in the shader program.
 * @param {Matrix4} modelMatrix - The Matrix4 object for model transformations.
 * @param {number} angle - The rotation angle in degrees.
 * @param {number} scale - The scaling factor

/**
 * initVertexBuffers(gl, a_Position, a_Color): Creates and initializes vertex buffers.
 * Defines vertices for both the square and diamond with interleaved position and color data.
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {number} a_Position - The location of the a_Position attribute in the shader program.
 * @param {number} a_Color - The location of the a_Color attribute in the shader program.
 * @returns {number} - The number of vertices.
 */


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

    var currentAngle = 0;
    var angleIncrement = 3.0; // Adjust for rotation speed
    var level = 1; // Starting level

    function main() {
    
     // Get the canvas element and WebGL rendering context
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

     // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

     // Get the storage location of the 'a_Position & a_Color' attribute in the shader
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Position < 0 || a_Color < 0) {
        console.log('Failed to get the storage location of a_Position or a_Color');
        return;
    }


    // Initialize vertex buffers with vertex positions and colors
    var n = initVertexBuffers(gl, a_Position, a_Color);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // Create a Matrix4 object for transformations
    var modelMatrix = new Matrix4();
    
    // Get the storage location of the 'u_ModelMatrix' uniform in the shader
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    // Set the clear color to black "canvas"
    gl.clearColor(0, 0, 0, 1);
   


    // Increase the level when the 'levelUp' button is clicked
    document.getElementById('levelUp').addEventListener('click', () => {
        level = Math.min(level + 1, 6); // Increase level, max 6
    });
    
    
     // Decrease the level when the 'levelDown' button is clicked
    document.getElementById('levelDown').addEventListener('click', () => {
        level = Math.max(level - 1, 1); // Decrease level, min 1
    });

  function render() {
    // Clear the color buffer
    gl.clear(gl.COLOR_BUFFER_BIT);

     // Update the rotation angle
    currentAngle += angleIncrement;

    // --- Draw the shapes based on the current level ---
    for (let i = 0; i < level; i++) {
        var angle = currentAngle + (45 * i);
        var scale = Math.pow(0.5, i);  // Used to scale down by half at each level 

        
         // Draw a Shapes with the calculated angle and scale
        drawSquare(gl, u_ModelMatrix, modelMatrix, angle, scale);
        drawDiamond(gl, u_ModelMatrix, modelMatrix, angle, scale); 
    }
 // Request the next animation frame to continue the loop
    requestAnimationFrame(render);
}
 // Start the rendering loop
render();
}

function drawSquare(gl, u_ModelMatrix, modelMatrix, angle, scale) {
    modelMatrix.setRotate(angle, 0, 0, 1); // Set the rotation of the model matrix
    modelMatrix.scale(scale, scale, 1);   // Set the scale of the model matrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);  // Pass the model matrix to the vertex shader
    gl.drawArrays(gl.LINE_LOOP, 0, 4);  // Draw the square as a line loop. Start a 0 and go for 4 4
}

function drawDiamond(gl, u_ModelMatrix, modelMatrix, angle, scale) {
    modelMatrix.setRotate(angle, 0, 0, 1);
    modelMatrix.scale(scale, scale, 1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.LINE_LOOP, 4, 4); // Draw the diamond as a line loop (using different vertex offset)
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

