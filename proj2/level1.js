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

let col = 50;
let row = 50;
let row_offset = 3;
let col_offset = 3;

for (let i = 0; i < row; i++) {
  for (let v = 0; v < col; v++) {
    let r = Math.random();
    let g = Math.random();
    let b = Math.random();
    let fun = Math.random();
    let fun2 = Math.random();
    let yScale = Math.random();
    let multiplier = 20;
    addCube( [
              -1 + (i * row_offset),-1,                        -1 + (v * col_offset), fun2,g,b,
               1 + (i * row_offset),-1,                        -1 + (v * col_offset), b,fun,g,
               1 + (i * row_offset), 1 + (yScale * multiplier),-1 + (v * col_offset), g,b,fun2,
              -1 + (i * row_offset), 1 + (yScale * multiplier),-1 + (v * col_offset), r,fun,b,
              -1 + (i * row_offset),-1,                         1 + (v * col_offset), fun2,r,g,
               1 + (i * row_offset),-1,                         1 + (v * col_offset), g,fun,fun2,
               1 + (i * row_offset), 1 + (yScale * multiplier), 1 + (v * col_offset), r,fun2,b,
              -1 + (i * row_offset), 1 + (yScale * multiplier), 1 + (v * col_offset), b,fun,g,
            ]
              , index_array)
  }
}

//addCube(attribute_array2, index_array)

upload();

let time = 0;

// Animation to rotate around 0,0 and keep the camera pointed to 0,0, starting at 50,0
const target = [row*3/2, 5, col*3/2];
const R = row * 5, H = row * 2.5;

function animate_scene(t) {
  const a = t * 0.001;
  const eye = [target[0] + R * Math.cos(a), H * Math.tan(a/3), target[2] + R * Math.sin(a)];
  drawView(lookAt(eye, target, [0, 1, 0]));
  requestAnimationFrame(animate_scene);
}
requestAnimationFrame(animate_scene);