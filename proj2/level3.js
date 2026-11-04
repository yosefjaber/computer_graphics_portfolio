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

// const img = await loadPixels("output.png");
// console.log(img.width, img.height);

// const red = img.data[(10 * img.width + 5) * 4];   // red value of pixel (5, 10)

// let col = img.width;
// let row = img.height;
// let rOffset = 3
// let cOffset = 3

// let master_attribute_array = []
// let master_index_array = []
// let index_array =  [4,5,6, 4,6,7,
//   0,3,2, 0,2,1,
//   3,7,6, 3,6,2,
//   0,1,5, 0,5,4,
//   1,2,6, 1,6,5,
//   0,4,7, 0,7,3,]

// for(let r = 0; r < img.height; r++) {
//     for(let c = 0; c < img.width; c++) {

//         // Must be between 0 - 1
//         let red = img.data[((r * img.width + c) * 4)] / 255;
//         let green = img.data[((r * img.width + c) * 4) + 1] / 255;
//         let blue = img.data[((r * img.width + c) * 4) + 2] / 255;

//         // Can be anything run wild
//         let alpha = ((img.data[(r * img.width + c) * 4 + 3]) / 255) * 1000;

//         master_attribute_array.push(...[
//             -1 + (c * cOffset),  0    , -1 + (r * rOffset), red, green, blue,
//              1 + (c * cOffset),  0    , -1 + (r * rOffset), red, green, blue,
//              1 + (c * cOffset),  alpha, -1 + (r * rOffset), red, green, blue,
//             -1 + (c * cOffset),  alpha, -1 + (r * rOffset), red, green, blue,
//             -1 + (c * cOffset),  0    ,  1 + (r * rOffset), red, green, blue,
//              1 + (c * cOffset),  0    ,  1 + (r * rOffset), red, green, blue,
//              1 + (c * cOffset),  alpha,  1 + (r * rOffset), red, green, blue,
//             -1 + (c * cOffset),  alpha,  1 + (r * rOffset), red, green, blue,
//         ])

//         master_index_array.push(...index_array.map(n => n + master_attribute_array.length/6 - 8))
//     }
// }
// addGroup(master_attribute_array, master_index_array, [0,0,0,1,1,1,0,0,0], "terrain")

// upload();

// let time = 0;

// // Animation to rotate around 0,0 and keep the camera pointed to 0,0, starting at 50,0
// const target = [row*3/2, 5, col*3/2];
// const R = row * 5, H = row * 2.5;

// function animate_scene(t) {
//   const a = t * 0.001;
//   const eye = [target[0] + R * Math.cos(a), H * Math.tan(a/3), target[2] + R * Math.sin(a)];
//   drawView(lookAt(eye, target, [0, 1, 0]));
//   requestAnimationFrame(animate_scene);
// }
// requestAnimationFrame(animate_scene);



// Make Floor
addGroup(attribute_array, index_array, [0,0,0,400,1,100,0,0,0], "Floor")

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

upload();

let eye = [500, 10, 0];
function animate_scene(t) {
    const a = t * 0.001;

    drawView(lookAt([eye[0] - (a*50), eye[1], eye[2]], [-100, 0, 0], [0,1,0]));
    requestAnimationFrame(animate_scene);
}
requestAnimationFrame(animate_scene);



// let manipulate = [0,0,0,1,1,1,0,0,0]

// //addGroup(obj.verts, obj.idx, manipulate, "dontOpen");

// upload();

// function animate_scene(t) {
//     const a = t * 0.001;
//     const eye = [25, 20000, 25]

//     const viewMat = lookAt(eye, [0, 0, -3], [0,1,0])

//     const curve = [[0,0,0], [1000,500,-200], [400, 1000,-100]];

//     let inputs = posAndRotCurve(curve, a, 2);

//     //groups["dontOpen"].inputs = [...inputs[0], 10000, 10000, 10000, inputs[1], inputs[2] + Math.PI/2, 0];
//     drawView(viewMat);
//     requestAnimationFrame(animate_scene);
// }
// requestAnimationFrame(animate_scene);

// // drawView(lookAt([5,5,0], [0,0,0], [0,1,0]));