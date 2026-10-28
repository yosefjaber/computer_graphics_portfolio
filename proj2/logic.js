// gl is the handle to the GPU
const gl = document.getElementById("c").getContext("webgl2");
gl.getExtension("OES_element_index_uint");

// Vertex Shader runs once per vertex
// attribute aPos - an attribute is different for every vertex 
//    this attribute is 
const vs = `
    attribute vec3 aPos;
    attribute vec3 aCol;
    uniform mat4 uMaster;
    uniform mat4 uView;
    varying vec3 vCol;

    void main() {
        gl_Position = uMaster * uView * vec4(aPos, 1.0);
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
const groups = []

// add_mesh will add a new mesh to our scene by adding to the verts and idx
function addMesh(cubeVerts, cubeIndices) {
    const offset = (verts.length / 6);  // vertices already stored (6 floats each)
    verts.push(...cubeVerts);
    for (const i of cubeIndices) {
        idx.push(i + offset);
    }
}

// adds a collection of meshes that share the same model matrix
// inputs is an array that is the groups [x, y, z, sx, sy, sz, rotX, rotY, rotZ]
function addGroup(verts, meshidx, inputs) {
    const start = idx.length;          // read BEFORE addMesh appends
    addMesh(verts, meshidx);
    groups.push({ inputs, start, count: idx.length });
}

function multiply(a, b) {   // a * b, row-major
    const o = [];
    for (let r = 0; r < 4; r++)
        for (let c = 0; c < 4; c++)
            o[r*4+c] = a[r*4]*b[c] + a[r*4+1]*b[4+c] + a[r*4+2]*b[8+c] + a[r*4+3]*b[12+c];
    return o;
}

function perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2), nf = 1 / (near - far);
    return [
        f/aspect, 0, 0,               0,
        0,        f, 0,               0,
        0,        0, (far+near)*nf,   2*far*near*nf,
        0,        0, -1,              0,
    ];
}

function normalize(v) { const l = Math.hypot(...v); return v.map(a => a / l); }
function cross(a, b) { return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }
function dot(a, b)   { return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]; }

function lookAt(eye, target, up) {
    const f = normalize([target[0]-eye[0], target[1]-eye[1], target[2]-eye[2]]);
    const s = normalize(cross(f, up));
    const u = cross(s, f);
    return [
         s[0],  s[1],  s[2], -dot(s, eye),
         u[0],  u[1],  u[2], -dot(u, eye),
        -f[0], -f[1], -f[2],  dot(f, eye),
         0,     0,     0,     1,
    ];
}

// Sets the position of a matrix
function setPos(x, y, z) {
    return [
        1, 0, 0, x,
        0, 1, 0, y,
        0, 0, 1, z,
        0, 0, 0, 1,
    ]
}

function setScale(sx, sy, sz) {
    return [
        sx, 0 , 0 , 0,
        0 , sy, 0 , 0,
        0 , 0 , sz, 0,
        0 , 0 , 0 , 1,
    ]
}

function setRotation(rx, ry, rz) {
    const cX = Math.cos(rx), sX = Math.sin(rx);
    const cY = Math.cos(ry), sY = Math.sin(ry);
    const cZ = Math.cos(rz), sZ = Math.sin(rz);

    const Rx = [
        1, 0,  0,  0,
        0, cX, -sX, 0,
        0, sX, cX, 0,
        0, 0,  0,  1,
    ];
    const Ry = [
         cY, 0, sY, 0,
         0,  1, 0,  0,
        -sY, 0, cY, 0,
         0,  0, 0,  1,
    ];
    const Rz = [
        cZ, -sZ, 0, 0,
        sZ,  cZ, 0, 0,
        0,   0,  1, 0,
        0,   0,  0, 1,
    ];
    return multiply(multiply(Rz, Ry), Rx);
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
const uView = gl.getUniformLocation(prog, "uView");

// Builds a modelMatrix given your inputs
function buildModel(x, y, z, sx, sy, sz, rotX, rotY, rotZ) {
    return multiply(
        setPos(x, y, z),
        multiply(setRotation(rotX, rotY, rotZ), setScale(sx, sy, sz))
    );
}

function drawView(view) {
    const c = document.getElementById("c");
    const proj = perspective(Math.PI/3, c.width / c.height, 1, 100000);
    gl.uniformMatrix4fv(uMaster, true, new Float32Array(multiply(proj, view)));

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for (const g of groups) {
        gl.uniformMatrix4fv(uView, true, new Float32Array(buildModel(...g.inputs)));
        gl.drawElements(gl.TRIANGLES, g.count, gl.UNSIGNED_INT, g.start * 4);  // offset is in bytes
    }
}

// Function that will convert obj text and return a obj with idx and verts
function parseObj(obj_text) {
    let obj = {idx: [], verts: []}

    let lines = obj_text.split("\n") // Make it into an array based of new lines
    for (let line of lines) {
        let token = line.split(" ") // Makes an array based for each "token" (i guess)
        if (token[0] == "v") { // Vertex line
            let r = Math.random()
            let g = Math.random()
            let b = Math.random()
            obj.verts.push(token[1])
            obj.verts.push(token[2])
            obj.verts.push(token[3])
            obj.verts.push(r,g,b)
        }

        if (token[0] == "f") { // Face line
            let i0 = token[1].split("/")[0] - 1
            let i1 = token[2].split("/")[0] - 1
            let i2 = token[3].split("/")[0] - 1

            obj.idx.push(...[i0, i1, i2]) // push the first triangle

            if (token[4] !== undefined) { // If it is a quad then make another triangle type shi
                let i3 = token[4].split("/")[0] - 1
                obj.idx.push(i0, i2, i3)
            }
        }

    }

    return obj
}
