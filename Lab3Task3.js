// CS3110 Lab3 Task 3 
// This will creat a Triangles with different colors and rotate on the X-Axis   

/**
 * main() function: Entry point of the WebGL program. 
 * Initializes WebGL context, shaders, event listeners, and draws the initial triangle.
 */

  
  /**
   * initVertexBuffers(gl, a_Position, vertices): Initializes vertex buffers for a given set of vertices.
   * Creates, binds, and fills a buffer with vertex data, then sets up the attribute pointer for a_Position.
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {number} a_Position - The location of the a_Position attribute in the shader program.
   * @param {Float32Array} vertices - The array of vertex coordinates.
   */

  /**
   * drawTriangle(gl, a_Position, level, modelMatrix, u_ModelMatrix): Draws a Sierpinski triangle.
   * Clears the canvas, applies transformations, and initiates the recursive subdivision process.
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {number} a_Position - The location of the a_Position attribute in the shader program.
   * @param {number} level - The level of subdivision (recursion depth).
   * @param {Matrix4} modelMatrix - The Matrix4 object for model transformations.
   * @param {WebGLUniformLocation} u_ModelMatrix - The location of the u_ModelMatrix uniform in the shader program.
   */
  
  /**
   * breakDownTriangle(gl, a_Position, vertices, level): Recursively subdivides a triangle into smaller triangles.
   * Calculates midpoints, creates new triangles, and continues subdivision until the base case is reached.
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {number} a_Position - The location of the a_Position attribute in the shader program.
   * @param {Float32Array} vertices - The array of vertex coordinates for the current triangle.
   * @param {number} level - The current level of subdivision.
   */
  
  /**
   * animate(gl, a_Position, level, modelMatrix, u_ModelMatrix): Updates the rotation angle and redraws the triangle.
   * Called repeatedly by requestAnimationFrame to create the animation.
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {number} a_Position - The location of the a_Position attribute in the shader program.
   * @param {number} level - The level of subdivision (recursion depth).
   * @param {Matrix4} modelMatrix - The Matrix4 object for model transformations.
   * @param {WebGLUniformLocation} u_ModelMatrix - The location of the u_ModelMatrix uniform in the shader program.
   */


  var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  '}\n';

var FSHADER_SOURCE =
  'precision mediump float;\n'+
  //'uniform float u_Width;\n'+
  //'uniform float u_Height;\n'+
  'void main() {\n' +
  ' gl_FragColor = vec4(gl_FragCoord.x/1000.0, 1.0, gl_FragCoord.y/550.0, 1.0);\n'+
  '}\n';


  var currentLevel = 0;
  var rotationAngle = 0;  // Store the current rotation angle
  var rotating = false;  //// Flag to control animation state



  function main() {
      
    // Get the canvas element and WebGL rendering context
    var canvas = document.getElementById('webgl');
      var gl = getWebGLContext(canvas);
      if (!gl) {
          console.log('Failed to get the rendering context for WebGL');
          return;
      }
  
      // Initialize shaders
      if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
          console.log('Failed to initialize shaders.');
          return;
      }
  
     // Get the storage location of the 'a_Position' attribute in the shader
      var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
      if (a_Position < 0) {
          console.log('Failed to get the storage location of a_Position');
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
  
      // Event listener for increasing subdivision level
      document.getElementById('levelUp').addEventListener('click', () => {
          currentLevel = Math.min(currentLevel + 1, 6); // Limit to 6 levels
          drawTriangle(gl, a_Position, currentLevel, modelMatrix, u_ModelMatrix);
      });
  
      // Event listener for decreasing subdivision level
      document.getElementById('levelDown').addEventListener('click', () => {
          currentLevel = Math.max(currentLevel - 1, 0);
          drawTriangle(gl, a_Position, currentLevel, modelMatrix, u_ModelMatrix);
      });

     // Event listener for toggling rotation   
     document.getElementById('rotate').addEventListener('click', () => {
        rotating = !rotating; // Toggle rotation state
        if (rotating) {
        animate(gl, a_Position, currentLevel, modelMatrix, u_ModelMatrix);  // Start the animation
    }
  });

        // Set the clear color to black
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
    
        // Draw the initial triangle
      drawTriangle(gl, a_Position, currentLevel, modelMatrix, u_ModelMatrix);
  }
  
  function initVertexBuffers(gl, a_Position, vertices) {
      var n = vertices.length / 2; // Number of vertices
    
        // Create a buffer object
      var vertexBuffer = gl.createBuffer();
      
        // Bind the buffer object to target
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      
      // Writedata into the buffer object
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
      // Assign the buffer object to the a_Position variable
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
      // Enable the assignment to a_Position variable
      gl.enableVertexAttribArray(a_Position);
  

      gl.drawArrays(gl.TRIANGLES, 0, n);
  }
  
  function drawTriangle(gl, a_Position, level, modelMatrix,u_ModelMatrix) {
        // Clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT);
        // Set the identity matrix
        modelMatrix.setIdentity();
      // Rotate the model
       modelMatrix.rotate(rotationAngle, 1,0,0); 
      
       // Pass the model matrix to the vertex shader
       gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
      
      // Define the initial vertices of the triangle
      var initialVertices = new Float32Array([-0.9, -0.9, 0.9, -0.9, 0.0, 0.9]);
      
      // Start recursive subdivision
      breakDownTriangle(gl, a_Position, initialVertices, level);
  }
  
  function breakDownTriangle(gl, a_Position, vertices, level) {
      if (level === 0) {
          // Base case: If level is 0, draw the triangle
          initVertexBuffers(gl, a_Position, vertices); 
          return;
      }
  
      // Get the vertices of the triangle. From the base case  
      var x1 = vertices[0], y1 = vertices[1];
      var x2 = vertices[2], y2 = vertices[3];
      var x3 = vertices[4], y3 = vertices[5];
  
    // Calculate the midpoints of each side
      var x12 = (x1 + x2) / 2, y12 = (y1 + y2) / 2;
      var x23 = (x2 + x3) / 2, y23 = (y2 + y3) / 2;
      var x31 = (x3 + x1) / 2, y31 = (y3 + y1) / 2;
  
      // Create three new triangles
      var triangle1 = [x1, y1, x12, y12, x31, y31];
      var triangle2 = [x12, y12, x2, y2, x23, y23];
      var triangle3 = [x31, y31, x23, y23, x3, y3];
  
       // Recursively break down the new triangles
      breakDownTriangle(gl, a_Position, triangle1, level - 1);
      breakDownTriangle(gl, a_Position, triangle2, level - 1);
      breakDownTriangle(gl, a_Position, triangle3, level - 1);
  }
  
  function animate(gl, a_Position, level, modelMatrix, u_ModelMatrix) {
    if (!rotating) {
        return;// Stop animation if rotating is false
    }

    rotationAngle = (rotationAngle + 20) % 360;  // Increment the rotation angle
    drawTriangle(gl, a_Position, level, modelMatrix, u_ModelMatrix);  /// Redraw the triangle


    requestAnimationFrame(function() { 
        animate(gl, a_Position, level, modelMatrix, u_ModelMatrix); 
      })
}


