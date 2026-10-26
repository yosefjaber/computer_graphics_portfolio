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

let col = 150;
let row = 150;
let row_offset = 3;
let col_offset = 3;
let x = 130
let y = 130
let z = 250

camX = 

for (let i = 0; i < row; i++) {
  for (let v = 0; v < col; v++) {
    let r = Math.random();
    let g = Math.random();
    let b = Math.random();
    let yScale = Math.random();
    let multiplier = 100;
    addCube( [-1 + (i * row_offset) - x,-1 + (v * col_offset) - y,-1 - z, r,g,b,
               1 + (i * row_offset) - x,-1 + (v * col_offset) - y,-1 - z , r,g,b,
               1 + (i * row_offset) - x, 1 + (v * col_offset) - y,-1 - z , r,g,b,
              -1 + (i * row_offset) - x, 1 + (v * col_offset) - y,-1 - z , r,g,b,
              -1 + (i * row_offset) - x,-1 + (v * col_offset) - y,(1 * (yScale * multiplier)) - z , r,g,b,
               1 + (i * row_offset) - x,-1 + (v * col_offset) - y,(1 * (yScale * multiplier)) - z, r,g,b,
               1 + (i * row_offset) - x, 1 + (v * col_offset) - y,(1 * (yScale * multiplier)) - z, r,g,b,
              -1 + (i * row_offset) - x, 1 + (v * col_offset) - y,(1 * (yScale * multiplier)) - z, r,g,b,] , index_array)
  }
}

upload();
draw();

addEventListener("keydown", e => {
    if (e.key === "ArrowLeft")  rotY   -= 0.1;
    if (e.key === "ArrowRight") rotY   += 0.1;
    if (e.key === "ArrowUp")    rotX -= 0.1;
    if (e.key === "ArrowDown")  rotX += 0.1;

    if (e.code === "KeyZ")    rotZ -= 0.1;
    if (e.code === "KeyC")  rotZ += 0.1;

    const f = 7.5;
    if (e.code === "KeyW") { camX += Math.sin(rotY) * f; camZ -= Math.cos(rotY) * f; }
    if (e.code === "KeyS") { camX -= Math.sin(rotY) * f; camZ += Math.cos(rotY) * f; }

    if (e.code === "KeyD") { camX += Math.cos(rotY) * f; camZ += Math.sin(rotY) * f; }
    if (e.code === "KeyA") { camX -= Math.cos(rotY) * f; camZ -= Math.sin(rotY) * f; }

    if (e.code === "KeyQ") camY += f;
    if (e.code === "KeyE") camY -= f;

    draw();
});

let time = 0;

function animate_scene(t) {

  rotZ = t * .001
  time = t * 0.001;

  camX = Math.cos(time) * 50;
  camY = Math.sin(time) * 50;

  draw();
  requestAnimationFrame(animate_scene);

  console.log(camX, rotX, camY, rotY)
}
//requestAnimationFrame(animate_scene);