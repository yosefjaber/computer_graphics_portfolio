index_array =  [4,5,6, 4,6,7,
  0,3,2, 0,2,1,
  3,7,6, 3,6,2,
  0,1,5, 0,5,4,
  1,2,6, 1,6,5,
  0,4,7, 0,7,3,]

attribute_array = [-1,-1,-1, 1,0,0,
   1,-1,-1, 0,1,0,
   1, 1,-1, 0,0,1, // Front
  -1, 1,-1, 1,1,0, // Front
  -1,-1, 1, 1,0,1,
   1,-1, 1, 0,1,1,
   1, 1, 1, 1,1,1, // Front
  -1, 1, 1, 0.5,0.5,0.5] // Front

attribute_array2 = [-1,14,-1, 1,0,0,
   1,14,-1, 0,1,0,
   1, 16,-1, 0,0,1, // Front
  -1, 16,-1, 1,1,0, // Front
  -1,14, 1, 1,0,1,
   1,14, 1, 0,1,1,
   1,16, 1, 1,1,1, // Front
  -1,16, 1, 0.5,0.5,0.5] // Front

let col = 100;
let row = 100;
let row_offset = 3;
let col_offset = 3;

let master_attribute_array = []
let master_index_array = []

for (let i = 0; i < row; i++) {
  for (let v = 0; v < col; v++) {
    let r = Math.random();
    let g = Math.random();
    let b = Math.random();
    let fun = Math.random();
    let fun2 = Math.random();
    let yScale = Math.random();
    let multiplier = 20;

    master_attribute_array.push(...[
              -1 + (i * row_offset),-1,                        -1 + (v * col_offset), fun2,g,b,
               1 + (i * row_offset),-1,                        -1 + (v * col_offset), b,fun,g,
               1 + (i * row_offset), 1 + (yScale * multiplier),-1 + (v * col_offset), g,b,fun2,
              -1 + (i * row_offset), 1 + (yScale * multiplier),-1 + (v * col_offset), r,fun,b,
              -1 + (i * row_offset),-1,                         1 + (v * col_offset), fun2,r,g,
               1 + (i * row_offset),-1,                         1 + (v * col_offset), g,fun,fun2,
               1 + (i * row_offset), 1 + (yScale * multiplier), 1 + (v * col_offset), r,fun2,b,
              -1 + (i * row_offset), 1 + (yScale * multiplier), 1 + (v * col_offset), b,fun,g,
            ])

    master_index_array.push(...index_array.map(n => n + master_attribute_array.length/6 - 8))
  }
}
addGroup(master_attribute_array, master_index_array, [0,0,0,1,1,1,0,0,0])

upload();

let time = 0;

// Animation to rotate around 0,0 and keep the camera pointed to 0,0, starting at 50,0
const target = [row*3/2, 5, col*3/2];
const R = row * 5, H = row * 2.5;

function animate_scene(t) {
  const a = t * 0.001;
  const eye = [target[0] + R * Math.cos(a), H * Math.tan(a/3), target[2] + R * Math.sin(a)];
  drawView(lookAt(eye, target, [0, 1, 0]));
  groups[0].inputs = [0,a*10,0,1,1,1,0,0,0]
  requestAnimationFrame(animate_scene);
}
requestAnimationFrame(animate_scene);