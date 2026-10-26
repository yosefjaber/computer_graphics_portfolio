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

addCube(attribute_array, index_array);                          // x = 0
addCube(offset(attribute_array, 3, 6, 0), index_array);         // x = +3
addCube(offset(attribute_array, -3, 6, 0), index_array);        // x = -3

addCube(offset(attribute_array, 3, 6, 1), index_array);         // y =  +3
addCube(offset(attribute_array, -3, 6, 1), index_array);        // y = -3

upload();
draw();