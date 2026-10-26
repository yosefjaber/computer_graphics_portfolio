// gl is the handle to the GPU
const gl = document.getElementById("c").getContext("webgl");
gl.getExtension("OES_element_index_uint");

// Vertex Shader runs once per vertex
// attribute aPos - an attribute is different for every vertex 
//    this attribute is 
const vs = `
    attribute vec3 aPos;
    attribute vec3 aCol;
    uniform mat4 uMaster;
    varying vec3 vCol;

    void main() {
        gl_Position = uMaster * vec4(aPos, 1.0);
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

function shader(type, src) { // used to create and compile vertex shader and fragment shader
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

function multiply(a, b) {   // returns a * b (b applied first)
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++)
      o[c*4+r] = a[r]*b[c*4] + a[4+r]*b[c*4+1] + a[8+r]*b[c*4+2] + a[12+r]*b[c*4+3];
  return o;
}

let yaw = 0, pitch = 0;
const m = new Float32Array([
  1, 0, 0, 0, 
  0, 1, 0, 0,
  0, 0, 1, 0, 
  0, 0, 0, 1,
]);

function translate(x, y, z) { return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]); }
function scale(s)           { return new Float32Array([s,0,0,0, 0,s,0,0, 0,0,s,0, 0,0,0,1]); }
function rotateY(a) { const c=Math.cos(a), s=Math.sin(a); return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]); }
function rotateX(a) { const c=Math.cos(a), s=Math.sin(a); return new Float32Array([1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]); }
function rotateZ(a) { const c=Math.cos(a), s=Math.sin(a); return new Float32Array([c,-s,0,0, s,c,0,0, 0,0,1,0, 0,0,0,1]); }
function perspective(fov, aspect, near, far) {
  const f = 1 / Math.tan(fov / 2), nf = 1 / (near - far);
  return new Float32Array([
    f/aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far+near)*nf, -1,
    0, 0, 2*far*near*nf, 0,
  ]);
}

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

const uMaster = gl.getUniformLocation(prog, "uMaster");

// every frame or key press
let camX = 0, camY = 0, camZ = 20;
let scl = 1;
let rotX = 0, rotY = 0, rotZ = 0;

function draw() {
  let m = translate(-camX, -camY, -camZ);
  m = multiply(rotateY(rotY), m);
  m = multiply(rotateX(rotX), m);
  m = multiply(rotateZ(rotZ), m);
  const c = document.getElementById("c");
  m = multiply(perspective(Math.PI/3, c.width / c.height, 0.1, 10000), m);

  gl.uniformMatrix4fv(uMaster, false, m);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_INT, 0);
}
