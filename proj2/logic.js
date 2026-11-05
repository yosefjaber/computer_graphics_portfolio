// gl is the handle to the GPU
const gl = document.getElementById("c").getContext("webgl2");

// Vertex Shader runs once per vertex
const vs = `
    attribute vec3 aPos;
    attribute vec3 aCol;
    uniform mat4 uView;
    varying vec3 vCol;

    void main() {
        gl_Position = uView * vec4(aPos, 1.0);
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


const groups = {}
const idx = []
const verts = []

// add_mesh will add a new mesh to our scene by adding to the verts and idx
function addMesh(meshVerts, meshIdx) {
    const offset = verts.length / 6;
    for (let k = 0; k < meshVerts.length; k++) verts.push(meshVerts[k]);
    for (let k = 0; k < meshIdx.length; k++)   idx.push(meshIdx[k] + offset);
}

// adds a collection of meshes that share the same model matrix
// inputs is an array that is the groups [x, y, z, sx, sy, sz, rotX, rotY, rotZ]
function addGroup(meshVerts, meshIdx, inputs, groupName) {
    const start = idx.length;
    addMesh(meshVerts, meshIdx);
    groups[groupName] = ({ inputs, start, count: meshIdx.length });
}

function multiply(a, b) {   // a * b, row-major
    const o = [];
    for (let r = 0; r < 4; r++)
        for (let c = 0; c < 4; c++)
            o[r*4+c] = a[r*4]*b[c] + a[r*4+1]*b[4+c] + a[r*4+2]*b[8+c] + a[r*4+3]*b[12+c];
    return o;
}

function perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2)
    const nf = 1 / (near - far);
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
  gl.enable(gl.CULL_FACE);
  gl.clearColor(0.1, 0.1, 0.15, 1);
}

let uMVP = gl.getUniformLocation(prog, "uView");

// Builds a modelMatrix given your inputs
function buildModel(x, y, z, sx, sy, sz, rotX, rotY, rotZ) {
    return multiply(
        setPos(x, y, z),
        multiply(setRotation(rotX, rotY, rotZ), setScale(sx, sy, sz))
    );
}

function drawView(view) {
    const c = document.getElementById("c");
    const proj = perspective(Math.PI/2, c.width / c.height, 1, 100000);
    const projView = multiply(proj, view);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for (const g of Object.values(groups)) {
        const mvp = multiply(projView, buildModel(...g.inputs));
        gl.uniformMatrix4fv(uMVP, true, new Float32Array(mvp));

        // so we dont hit the 3 mil limit check if we are trying to do more than 3 mil on draw 3 mil at a time
        const MAX_INDICES = 3_000_000; // 3 mil indices per draw
        for (let offset = 0; offset < g.count; offset += MAX_INDICES) {
            const count = Math.min(MAX_INDICES, g.count - offset);
            //console.log("Drawing:", count, "indices; group total:", g.count);
            gl.drawElements(
                gl.TRIANGLES,
                count,
                gl.UNSIGNED_INT,
                (g.start + offset) * Uint32Array.BYTES_PER_ELEMENT
            );
        }

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
            obj.verts.push(parseFloat(token[1]))
            obj.verts.push(parseFloat(token[2]))
            obj.verts.push(parseFloat(token[3]))
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


// every p here is an array representing [x, y, z]
// t is a float from 0 to 1
function lerp(p0, p1, t) {
    return [
        p0[0] + (p1[0] - p0[0]) * t,
        p0[1] + (p1[1] - p0[1]) * t,
        p0[2] + (p1[2] - p0[2]) * t,
    ];
}

function fivePointBezierCurve(p0, p1, p2, p3, p4, t) {
    const a = lerp(p0, p1, t);
    const b = lerp(p1, p2, t);
    const c = lerp(p2, p3, t);
    const d = lerp(p3, p4, t);

    const e = lerp(a, b, t);
    const f = lerp(b, c, t);
    const g = lerp(c, d, t);

    const h = lerp(e, f, t);
    const i = lerp(f, g, t);

    return lerp(h, i, t);
}

function BezierCurveN(points, t) {
    // base case
    if(points.length <= 1) {
        return points[0];
    }

    let new_points = []

    for(let i = 0; i < points.length - 1; i++) {
        new_points.push(lerp(points[i], points[i+1], t))
    }
    
    return BezierCurveN(new_points, t)
}

// returns the position at time a, duration is a constant that will change how fast it moves
// axis = the axis the loop spins around: "z" for XY-plane loops, "x" for YZ, "y" for XZ
function posAndRotCurve(controlPoints, a, duration, axis = "z") {
    const s    = (a / duration) % 1;
    const pos  = BezierCurveN(controlPoints, s);
    const prev = BezierCurveN(controlPoints, Math.max(s - 0.001, 0));
    const next = BezierCurveN(controlPoints, Math.min(s + 0.001, 1));

    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const dz = next[2] - prev[2];

    let rot;
    if (axis === "z") {            // path in XY plane (your first plane)
        rot = [0, 0, Math.atan2(-dy, -dx)];
    } else if (axis === "x") {     // path in YZ plane (your second plane)
        rot = [Math.PI / 2, -Math.atan2(-dz, -dy), Math.PI / 2];
    } else {                       // "y": path in XZ plane
        rot = [0, Math.atan2(dz, -dx), 0];
    }
    return { pos, rot };
}

async function loadPixels(path) {
    const bmp = await createImageBitmap(await (await fetch(path, { cache: "no-store" })).blob());
    const ctx = new OffscreenCanvas(bmp.width, bmp.height).getContext("2d");
    ctx.drawImage(bmp, 0, 0);
    return ctx.getImageData(0, 0, bmp.width, bmp.height);   // { data, width, height }
}

// Will take in the groupName and the verts and translate the verts by x, y, and z
function addVertsToGroup(groupName, meshVerts, meshIdx, x, y, z) {
    const g = groups[groupName];
    const offset = verts.length / 6;

    for (let k = 0; k < meshVerts.length; k += 6) {
        verts.push(
            meshVerts[k] + x, meshVerts[k+1] + y, meshVerts[k+2] + z,
            meshVerts[k+3], meshVerts[k+4], meshVerts[k+5]
        );
    }

    for (let k = 0; k < meshIdx.length; k++) {
        idx.push(meshIdx[k] + offset);
    }

    g.count += meshIdx.length;
}
