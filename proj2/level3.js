const index_array =  [4,5,6, 4,6,7,
  0,3,2, 0,2,1,
  3,7,6, 3,6,2,
  0,1,5, 0,5,4,
  1,2,6, 1,6,5,
  0,4,7, 0,7,3,]

const attribute_array = [-1,-1,-1, 1,0,0,
   1,-1,-1, 0,1,0,
   1, 1,-1, 0,0,1,
  -1, 1,-1, 1,1,0,
  -1,-1, 1, 1,0,1,
   1,-1, 1, 0,1,1,
   1, 1, 1, 1,1,1,
  -1, 1, 1, 0.5,0.5,0.5]

// Make Floor

const img = await loadPixels("output.png");
console.log(img.width, img.height);

const W = img.width;
const H = img.height;

const rOffset = 3;          // spacing between pixel rows (z)
const cOffset = 3;          // spacing between pixel columns (x)
const heightScale = 1000;    // alpha (0-1) * this = terrain height

const master_attribute_array = [];
const master_index_array = [];

// ---- top surface: one vertex per pixel (x, y, z, r, g, b) ----
for (let r = 0; r < H; r++) {
  for (let c = 0; c < W; c++) {
    const i = (r * W + c) * 4;

    const red   = img.data[i]     / 255;
    const green = img.data[i + 1] / 255;
    const blue  = img.data[i + 2] / 255;
    const height = (img.data[i + 3] / 255) * heightScale;

    master_attribute_array.push(c * cOffset, height, r * rOffset, red, green, blue);
  }
}

// two triangles per grid cell (faces up)
for (let r = 0; r < H - 1; r++) {
  for (let c = 0; c < W - 1; c++) {
    const i00 = r * W + c;
    const i10 = i00 + 1;
    const i01 = i00 + W;
    const i11 = i01 + 1;

    master_index_array.push(
      i00, i01, i11,
      i00, i11, i10
    );
  }
}

// ---- bottom face (faces down) ----
const X = (W - 1) * cOffset;
const Z = (H - 1) * rOffset;

const offsetIdx = master_attribute_array.length / 6;
master_attribute_array.push(
  0, 0, 0,  0.25, 0.25, 0.25,   // +0 front-left
  X, 0, 0,  0.25, 0.25, 0.25,   // +1 front-right
  0, 0, Z,  0.25, 0.25, 0.25,   // +2 back-left
  X, 0, Z,  0.25, 0.25, 0.25    // +3 back-right
);
master_index_array.push(
  offsetIdx,     offsetIdx + 1, offsetIdx + 2,
  offsetIdx + 1, offsetIdx + 3, offsetIdx + 2
);

// ---- walls ----
function addWall(topIdx, flip) {
  // flat-bottom copy of each edge vertex (same x/z, y = 0)
  const bot = topIdx.map(t => {
    const x = master_attribute_array[t * 6];
    const z = master_attribute_array[t * 6 + 2];
    master_attribute_array.push(x, 0, z, 0.2, 0.2, 0.2);
    return master_attribute_array.length / 6 - 1;
  });

  for (let k = 0; k < topIdx.length - 1; k++) {
    const a = topIdx[k], b = topIdx[k + 1];
    const d = bot[k],    e = bot[k + 1];
    if (!flip) master_index_array.push(a, b, e,  a, e, d);
    else       master_index_array.push(a, e, b,  a, d, e);
  }
}

const range = n => Array.from({ length: n }, (_, k) => k);

addWall(range(W),                              false); // front (r = 0)
addWall(range(W).map(c => (H - 1) * W + c),    true);  // back  (r = H-1)
addWall(range(H).map(r => r * W),              true);  // left  (c = 0)
addWall(range(H).map(r => r * W + (W - 1)),    false); // right (c = W-1)

addGroup(master_attribute_array, master_index_array, [-450, -199, -600, .4,.4,.4, 0,0,0], "terrain");


// Make Soliders
let sv = [];
let si = [];

const solider_offset_x = 10;
const solider_offset_z = 10;



// How many soliders we want
// Left Side
let left_sv = []
let left_si = []
for(let i = 0; i < 20; i++) {
    let placed_sv = []
    for(let j = 0; j < solider.verts.length; j+=6) {
        placed_sv.push(...[solider.verts[j] + solider_offset_x * i, solider.verts[j+1], solider.verts[j+2], solider.verts[j+3], solider.verts[j+4], solider.verts[j+5]])
    }
    left_sv.push(...placed_sv)

    for (let k = 0; k < solider.idx.length; k++) {
        left_si.push(solider.idx[k] + i * (solider.verts.length / 6));
    }
}

addGroup(left_sv, left_si, [0,5,-10,2,2,2,0,0,0], "leftSoliders");

// Right Side
let right_sv = []
let right_si = []
for(let i = 0; i < 20; i++) {
    let placed_sv = []
    for(let j = 0; j < solider.verts.length; j+=6) {
        placed_sv.push(...[solider.verts[j] + solider_offset_x * i, solider.verts[j+1], solider.verts[j+2], solider.verts[j+3], solider.verts[j+4], solider.verts[j+5]])
    }
    left_sv.push(...placed_sv)

    for (let k = 0; k < solider.idx.length; k++) {
        left_si.push(solider.idx[k] + i * (solider.verts.length / 6));
    }
}

addGroup(left_sv, left_si, [380,5,10,2,2,2,0,Math.PI,0], "rightSoliders");




// Make Throne
addGroup(royalty.verts, royalty.idx, [-100,0,0,10,10,10,0,Math.PI/2,0], "Royalty")


// Make "Planes" (im crine)
addGroup(dontOpen.verts, dontOpen.idx, [600,100,0,10,10,10,0,0,0], "dontOpen")
addVertsToGroup("dontOpen", dontOpen.verts, dontOpen.idx, 0, -5, 10)
addVertsToGroup("dontOpen", dontOpen.verts, dontOpen.idx, 0, -5, -10)

// Make second set of planes
addGroup(dontOpen.verts, dontOpen.idx, [-450,40,0,10,10,10,0,0,0], "dontOpen2")
addVertsToGroup("dontOpen2", dontOpen.verts, dontOpen.idx, 0, -5, 10)
addVertsToGroup("dontOpen2", dontOpen.verts, dontOpen.idx, 0, -5, -10)

// When everything is added then upload
upload();

// Camera Movement
let eye = [600, 10, 0];
let lookAtPoint = [-100,10,0];
let aLastFrame = 0;
let deltaTime = 0;
const dontOpenControlPoints  = [[600,40,0], [-300,40,0], [150,300,0], [600,40,0], [-300,40,0]];
const dontOpenControlPoints2 = [[-400,40,-450], [-400,40,450], [-400,900,0], [-400,40,-450], [-400,40,450]];

function animate_scene(t) {
    const a = t * 0.001;
    deltaTime = a - aLastFrame;

    const { pos, rot } = posAndRotCurve(dontOpenControlPoints, a, 2, "z");
    groups["dontOpen"].inputs[0] = pos[0]; 
    groups["dontOpen"].inputs[1] = pos[1]; 
    groups["dontOpen"].inputs[2] = pos[2];
    groups["dontOpen"].inputs[6] = rot[0]; 
    groups["dontOpen"].inputs[7] = rot[1]; 
    groups["dontOpen"].inputs[8] = rot[2];

    const { pos: pos2, rot: rot2 } = posAndRotCurve(dontOpenControlPoints2, a, 1, "x");
    groups["dontOpen2"].inputs[0] = pos2[0];
    groups["dontOpen2"].inputs[1] = pos2[1];
    groups["dontOpen2"].inputs[2] = pos2[2];
    groups["dontOpen2"].inputs[6] = rot2[0];
    groups["dontOpen2"].inputs[7] = rot2[1];
    groups["dontOpen2"].inputs[8] = rot2[2];


    // Piecewise movement
    // First 12 seconds
    if (a < 13) {
        eye[0] -= deltaTime * 50
        drawView(lookAt(eye, lookAtPoint, [0,1,0]));
    }
    else if (a < 16) {
        drawView(lookAt(eye, lookAtPoint, [0,1,0]));
    }
    else if (a < 20) {
        lookAtPoint[1] += (25) * (deltaTime/4)
        drawView(lookAt(eye, lookAtPoint, [0,1,0]));
    }
    else {
        drawView(lookAt(eye, lookAtPoint, [0,1,0]));
    }


    aLastFrame = a;
    requestAnimationFrame(animate_scene);
}
requestAnimationFrame(animate_scene);
