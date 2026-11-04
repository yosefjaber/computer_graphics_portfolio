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
addGroup(attribute_array, index_array, [0,0,0,450,1,100,0,0,0], "Floor")

// Make Soliders
let sv = [];
let si = [];

const solider_offset_x = 10;   // spacing between soldiers in a row
const solider_offset_z = 10;   // distance between the two rows
const soldiersPerRow = 10;


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

    const { pos: pos2, rot: rot2 } = posAndRotCurve(dontOpenControlPoints2, a, 3, "x");
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
