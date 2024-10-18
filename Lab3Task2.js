// CS3110 Lab3 Task 2 
// This will creat a spiral with different colors  


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
  ' gl_FragColor = vec4(gl_FragCoord.x/750.0, 1.0, gl_FragCoord.y/1550.0, 1.0);\n'+
  '}\n';


  var numSegments = 50000;



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
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  var modelMatrix = new Matrix4();
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  gl.clearColor(0.0,0.0, 0.0, 0.0);

  var currentAngle = 0.0;
  var angleIncrement = 30.0; 
  var revolutions = 1;

  // --- Event listeners for buttons ---
  document.getElementById('revolutionsUp').addEventListener('click', () => {
    revolutions = Math.min(revolutions + 1, 20); 
  });
  document.getElementById('revolutionsDown').addEventListener('click', () => {
    revolutions = Math.max(revolutions - 1, 1); 
  });

  var tick = function() {
    currentAngle = animate(currentAngle, angleIncrement); 
    draw(gl, a_Position, u_ModelMatrix, modelMatrix, currentAngle, revolutions);
    requestAnimationFrame(tick); 
  }
  tick(); 
}


function initVertexBuffers(gl, numSegments, revolutions, a_Position) {
  var vertices = drawSpiral(numSegments, revolutions);
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the vertex buffer object');
    return -1; 
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); 

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  return numSegments;
}

function drawSpiral(numSegments, revolutions) {
  var vertices = [];
  for (let i = 0; i < numSegments; i++) {
    var theta = i / numSegments * Math.PI * 2 * revolutions * .75;
    var radius = i / numSegments * 0.65;
    var x = radius * Math.cos(theta);
    var y = radius * Math.sin(theta);
    vertices.push(x, y); 
  }
  return new Float32Array(vertices);
}

function draw(gl, a_Position, u_ModelMatrix, modelMatrix, currentAngle, revolutions) {
  gl.clear(gl.COLOR_BUFFER_BIT);
  var n = initVertexBuffers(gl, numSegments, revolutions); 
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }
   modelMatrix.setRotate(currentAngle, 0, 0, 1); 
   gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.LINE_STRIP, 0, n);
}

var g_last = Date.now();
function animate(angle, angleIncrement) {
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  var newAngle = angle + (angleIncrement * elapsed) / 1000.0;
  return newAngle %= 360;
}


























































// var VSHADER_SOURCE =
//     'attribute vec4 a_Position;\n' +
//     'attribute vec4 a_Color;\n' +
//     'uniform mat4 u_ModelMatrix;\n' +
//     'varying vec4 v_Color;\n' +
//     'void main() {\n' +
//     '  gl_Position = u_ModelMatrix * a_Position;\n' +
//     '  v_Color = a_Color;\n' +
//     '}\n';

// var FSHADER_SOURCE =
//     'precision mediump float;\n' +
//     'varying vec4 v_Color;\n' +
//     'void main() {\n' +
//     '  gl_FragColor = v_Color;\n' +
//     '}\n';

// function main() {
//     var canvas = document.getElementById('webgl');
//     var gl = canvas.getContext('webgl');
//     if (!gl) {
//         console.log('Failed to get the rendering context for WebGL');
//         return;
//     }

//     if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//         console.log('Failed to initialize shaders.');
//         return;
//     }

//     var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//     var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
//     if (a_Position < 0 || a_Color < 0) {
//         console.log('Failed to get the storage location of a_Position or a_Color');
//         return;
//     }

//     var modelMatrix = new Matrix4();
    
//     var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
//     if (!u_ModelMatrix) {
//         console.log('Failed to get the storage location of u_ModelMatrix');
//         return;
//     }

//     gl.clearColor(0, 0, 0, 0);

//     var currentAngle = 0;
//     var angleIncrement = 1.0; // Adjust for rotation speed
//     var revolutions = 5; // Starting number of revolutions for the spiral

//     // --- Event listeners for buttons ---
//     document.getElementById('revolutionsUp').addEventListener('click', () => {
//         revolutions = Math.min(revolutions + 1, 10); // Increase revolutions, max 10
//     });
//     document.getElementById('revolutionsDown').addEventListener('click', () => {
//         revolutions = Math.max(revolutions - 1, 1); // Decrease revolutions, min 1
//     });






// initVertexBuffers(gl, a_Position, a_Color, u_ModelMatrix, modelMatrix);

// }


// function initVertexBuffers(gl, a_Position, a_Color, u_ModelMatrix, modelMatrix) {
//     var numSegments = 100;
   
//     var vertices = drawSpiral(numSegments,vertices,colors);
//     console.log(vertices);
    
   
//    var vertexCount = vertices.length / 2; // Since each vertex has x, y
//     colors = new Float32Array(vertexCount * 4); // RGBA color for each vertex

//     for (var i = 0; i < vertexCount; i++) {
//         colors[i * 4] = 0.0;    // R (black)
//         colors[i * 4 + 1] = 0.0; // G (black)
//         colors[i * 4 + 2] = 0.0; // B (black)
//         colors[i * 4 + 3] = 1.0; // A (fully opaque)
//     }

//     var vertexBuffer = gl.createBuffer();
//     if (!vertexBuffer) {
//         console.log('Failed to create the vertex buffer object');
//         return;
//     }
//     gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//     gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(a_Position);

//     var colorBuffer = gl.createBuffer();
//     if (!colorBuffer) {
//         console.log('Failed to create the color buffer object');
//         return;
//     }
//     gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
//     gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(a_Color);

//     modelMatrix.rotate(angle, 0, 0, 1); // Rotate around Y-axis
//     gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
//     gl.drawArrays(gl.LINE_STRIP, 0, numSegments);
// }

// function drawSpiral(numSegments) {
//     var vertices = [];

//     for (let i = 0; i < numSegments; i++) {
//         var theta = i / numSegments * Math.PI * 2 * revolutions;
//         var radius = i / numSegments;
//         var x = radius * Math.cos(theta);
//         var y = radius * Math.sin(theta);
//         vertices.push(x, y, 0);

//         return new Float32Array(vertices);
//     }



// }






    // function render() {
    //     gl.clear(gl.COLOR_BUFFER_BIT);
    //     currentAngle += angleIncrement;

    //     // --- Draw the spiral ---
    //     drawSpiral(gl, u_ModelMatrix, modelMatrix, currentAngle, revolutions);

    //     requestAnimationFrame(render);
    // }

    // render();

 // --- Draw the spiral ---
//  drawSpiral(gl, u_ModelMatrix, modelMatrix, currentAngle, revolutions, a_Color, a_Position);





























// var VSHADER_SOURCE =
//     'attribute vec4 a_Position;\n' +
//     'attribute vec4 a_Color;\n' +
//     'uniform mat4 u_ModelMatrix;\n' +
//     'varying vec4 v_Color;\n' +
//     'void main() {\n' +
//     '  gl_Position = u_ModelMatrix * a_Position;\n' +
//     '  v_Color = a_Color;\n' +
//     '}\n';

// var FSHADER_SOURCE =
//     'precision mediump float;\n' +
//     'varying vec4 v_Color;\n' +
//     'void main() {\n' +
//     '  gl_FragColor = v_Color;\n' +
//     '}\n';

// function main() {
//     var canvas = document.getElementById('webgl');
//     var gl = canvas.getContext('webgl');
//     if (!gl) {
//         console.log('Failed to get the rendering context for WebGL');
//         return;
//     }

//     if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//         console.log('Failed to initialize shaders.');
//         return;
//     }

//     var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//     var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
//     if (a_Position < 0 || a_Color < 0) {
//         console.log('Failed to get the storage location of a_Position or a_Color');
//         return;
//     }

//     var n = initVertexBuffers(gl, a_Position, a_Color);
//     if (n < 0) {
//         console.log('Failed to set the positions of the vertices');
//         return;
//     }

//     var modelMatrix = new Matrix4();
//     var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
//     if (!u_ModelMatrix) {
//         console.log('Failed to get the storage location of u_ModelMatrix');
//         return;
//     }

//     gl.clearColor(0, 0, 0, 1);

//     var currentAngle = 0;
//     var angleIncrement = 3.0; // Adjust for rotation speed
//     var level = 1; // Starting level

//     // --- Event listeners for buttons ---
//     document.getElementById('levelUp').addEventListener('click', () => {
//         level = Math.min(level + 1, 6); // Increase level, max 6
//     });
//     document.getElementById('levelDown').addEventListener('click', () => {
//         level = Math.max(level - 1, 1); // Decrease level, min 1
//     });


//     function render() {
//         gl.clear(gl.COLOR_BUFFER_BIT);
    
//         currentAngle += angleIncrement;
//         modelMatrix.setRotate(currentAngle, 0, 0, 1); // Rotate all spirals
    
//         // Draw all spirals
//         for (let i = 0; i < spirals.length; i++) {
//           gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
//           var n = spirals[i].numVertices;
//           gl.bindBuffer(gl.ARRAY_BUFFER, spirals[i].buffer);
    
//           const FSIZE = Float32Array.BYTES_PER_ELEMENT;
//           gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
//           gl.enableVertexAttribArray(a_Position);
    
//           gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
//           gl.enableVertexAttribArray(a_Color);
    
//           gl.drawArrays(gl.LINE_STRIP,   
//      0, n);
//         }

// }


// function initVertexBuffers(gl, a_Position, a_Color) {
//     var numPoints = 1000; 
//     var startRadius = 0.1 
//     var distance = 0.1 

//     const vertices = [];
//     const maxAngle = 20 * Math.PI; // Adjust for spiral length
  
//     for (let i = 0; i <= numPoints; i++) {
//       const angle = (maxAngle * i) / numPoints;
//       const radius = startRadius + distance * angle;
//       const x = radius * Math.cos(angle);
//       const y = radius * Math.sin(angle);
  
//       vertices.push(x, y); 

//       return vertices;
//     }

//      var buffer = gl.createBuffer();
//     if (!buffer) {
//         console.log('Failed to create the buffer object');
//         return -1;
//     }

//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, interleavedData, gl.STATIC_DRAW);

//     const FSIZE = interleavedData.BYTES_PER_ELEMENT;

//     gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
//     gl.enableVertexAttribArray(a_Position);

//     gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
//     gl.enableVertexAttribArray(a_Color);

//     return numPoints + 1;
// }

// }