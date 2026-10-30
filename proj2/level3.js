async function loadPixels(path) {
    const bmp = await createImageBitmap(await (await fetch(path, { cache: "no-store" })).blob());
    const ctx = new OffscreenCanvas(bmp.width, bmp.height).getContext("2d");
    ctx.drawImage(bmp, 0, 0);
    return ctx.getImageData(0, 0, bmp.width, bmp.height);   // { data, width, height }
}

const img = await loadPixels("output.png");
console.log(img.width, img.height);

const red = img.data[(10 * img.width + 5) * 4];   // red value of pixel (5, 10)

let col = img.width;
let row = img.height;
let rOffset = 3
let cOffset = 3

let master_attribute_array = []
let master_index_array = []
let index_array =  [4,5,6, 4,6,7,
  0,3,2, 0,2,1,
  3,7,6, 3,6,2,
  0,1,5, 0,5,4,
  1,2,6, 1,6,5,
  0,4,7, 0,7,3,]

for(let r = 0; r < img.height; r++) {
    for(let c = 0; c < img.width; c++) {

        // Must be between 0 - 1
        let red = img.data[((r * img.width + c) * 4)] / 255;
        let green = img.data[((r * img.width + c) * 4) + 1] / 255;
        let blue = img.data[((r * img.width + c) * 4) + 2] / 255;

        // Can be anything run wild
        let alpha = ((img.data[(r * img.width + c) * 4 + 3]) / 255) * 1000;

        master_attribute_array.push(...[
            -1 + (c * cOffset),  alpha - 1, -1 + (r * rOffset), red, green, blue,
             1 + (c * cOffset),  alpha - 1, -1 + (r * rOffset), red, green, blue,
             1 + (c * cOffset),  alpha    , -1 + (r * rOffset), red, green, blue,
            -1 + (c * cOffset),  alpha    , -1 + (r * rOffset), red, green, blue,
            -1 + (c * cOffset),  alpha - 1,  1 + (r * rOffset), red, green, blue,
             1 + (c * cOffset),  alpha - 1,  1 + (r * rOffset), red, green, blue,
             1 + (c * cOffset),  alpha    ,  1 + (r * rOffset), red, green, blue,
            -1 + (c * cOffset),  alpha    ,  1 + (r * rOffset), red, green, blue,
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
  groups[0].inputs = [0,0,0,1,1,1,0,0,0]
  requestAnimationFrame(animate_scene);
}
requestAnimationFrame(animate_scene);
