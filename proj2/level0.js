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