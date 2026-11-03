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

let manipulate = [0,0,0,1,1,1,0,0,0]

addGroup(obj.verts, obj.idx, manipulate, "dontOpen");

upload();

function animate_scene(t) {
    const a = t * 0.001;
    const eye = [25, 20, 25]

    const viewMat = lookAt(eye, [3, 5, -3], [0,1,0])

    const curve = [[-5,0,-5], [10,5,-2], [4, 10,-1]];

    let inputs = posAndRotCurve(curve, a, 2)

    groups["dontOpen"].inputs = [...inputs[0], 1, 1, 1, inputs[1], inputs[2] + Math.PI/2, 0];
    drawView(viewMat);
    requestAnimationFrame(animate_scene);
}
requestAnimationFrame(animate_scene);

// drawView(lookAt([5,5,0], [0,0,0], [0,1,0]));