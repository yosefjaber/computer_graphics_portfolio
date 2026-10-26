// gl is the handle to the GPU
const gl = document.getElementById("c").getContext("webgl");
gl.getExtension("OES_element_index_uint");

// Vertex Shader runs once per vertex
// attribute aPos - an attribute is different for every vertex 
//    this attribute is 
const vs = `
    attribute vec3 aPos;
    attribute vec3 aCol;
    uniform vec2 uView;
    varying vec3 vCol;
    
    void main() {
        float a = uView.x, b = uView.y;
        vec3 p = aPos;
        p = vec3(cos(a)*p.x + sin(a)*p.z, p.y, -sin(a)*p.x + cos(a)*p.z);
        p = vec3(p.x, cos(b)*p.y - sin(b)*p.z, sin(b)*p.y + cos(b)*p.z);
        gl_Position = vec4(p * 0.1, 1.0);
        vCol = aCol;
    }`;


// This is the fragment shader, it runs once per pixel covered by the triangle
const fs = `
    precision mediump float; // Sets the default float precision
    varying vec3 vCol; // Already interpolated from our vertex shader

    void main() { 
        gl_FragColor = vec4(vCol, 1.0); 
    }
`; //gl_FragColor must be set or else the color will be garbage

function shader(type, src) { // Used to create and compile vertex shader and fragment shader
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

// All the goofy steps you need to set up the vertex and fragment shader
const prog = gl.createProgram();
gl.attachShader(prog, shader(gl.VERTEX_SHADER, vs));
gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, fs));
gl.linkProgram(prog);
gl.useProgram(prog);


// x, y, z, r, g, b
// First three points are the position last three points are the color
const verts = []
const idx = [] // Keeps track of what indecies for a triangle 

// add_cube will add a new cube to our scene by adding to the verts and idx
function addCube(cubeVerts, cubeIndices) {
    const offset = (verts.length / 6);  // vertices already stored (6 floats each)
    verts.push(...cubeVerts);
    for (const i of cubeIndices) {
        idx.push(i + offset);
    }
}

let yaw = 0.6, pitch = 0.5;

// Do all the rendering shenanigans in one function 
function upload() {   // call once, after all addCube calls
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(idx), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 24, 0);

  const aCol = gl.getAttribLocation(prog, "aCol");
  gl.enableVertexAttribArray(aCol);
  gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, 24, 12);

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.1, 0.1, 0.15, 1);
}

const uView = gl.getUniformLocation(prog, "uView");

function draw() {     // call whenever the view changes
  gl.uniform2f(uView, yaw, pitch);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_INT, 0);
}

addEventListener("keydown", e => {
  if (e.key === "ArrowLeft")  yaw   -= 0.1;
  if (e.key === "ArrowRight") yaw   += 0.1;
  if (e.key === "ArrowUp")    pitch -= 0.1;
  if (e.key === "ArrowDown")  pitch += 0.1;
  draw();
});

// Will take in a 3d array representing where to translate the cubes
function translation(offset) {
    for(let i = 0; i < verts.length; i+=6) {
        verts[i] += offset[0]   // x
        verts[i+1] += offset[1] // y
        verts[i+2] += offset[2] // z
    }
}
