index_array =  [4,5,6, 4,6,7,
  0,3,2, 0,2,1,
  3,7,6, 3,6,2,
  0,1,5, 0,5,4,
  1,2,6, 1,6,5,
  0,4,7, 0,7,3,]

attribute_array = [-1,-1,-1, 1,0,0,
   1,-1,-1, 0,1,0,
   1, 1,-1, 0,0,1,
  -1, 1,-1, 1,1,0,
  -1,-1, 1, 1,0,1,
   1,-1, 1, 0,1,1,
   1, 1, 1, 1,1,1,
  -1, 1, 1, 0.5,0.5,0.5]


function offset(list, amount, skip, starting) {
  const out = [...list];
  for (let i = starting; i < out.length; i += skip) {
    out[i] += amount;
  }
  return out;
}

addCube(attribute_array, index_array);

upload();

function animate_scene(t) {
  const a = t * 0.001;
  eye = [Math.sin(a) * 5, 5, Math.cos(a) * 5]
  drawView(lookAt(eye, [0,0,0], [0,1,0]));
  requestAnimationFrame(animate_scene);
}
requestAnimationFrame(animate_scene);

// drawView(lookAt([5,5,0], [0,0,0], [0,1,0]));