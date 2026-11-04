let index_array =  [4,5,6, 4,6,7,
  0,3,2, 0,2,1,
  3,7,6, 3,6,2,
  0,1,5, 0,5,4,
  1,2,6, 1,6,5,
  0,4,7, 0,7,3,]

let attribute_array = [-1,-1,-1, 1,0,0,
   1,-1,-1, 0,1,0,
   1, 1,-1, 0,0,1,
  -1, 1,-1, 1,1,0,
  -1,-1, 1, 1,0,1,
   1,-1, 1, 0,1,1,
   1, 1, 1, 1,1,1,
  -1, 1, 1, 0.5,0.5,0.5]

let manipulate = [0,-1,0,1,1,1,0,0,0]

addGroup(royalty.verts, royalty.idx, manipulate, "royalty");

upload();

let eye = [0,0,0]
function animate_scene(t) {
  const a = t * 0.001;
  eye = [Math.sin(a) * 5, Math.tan(a/4), Math.cos(a) * 5]
  drawView(lookAt(eye, [0,0,0], [0,1,0]));
  requestAnimationFrame(animate_scene);
}
requestAnimationFrame(animate_scene);