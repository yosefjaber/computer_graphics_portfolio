from PIL import Image

R, G, B, A = 255, 0, 0, 128
W, H = 1000, 1000

img = Image.new("RGBA", (W, H))

for row in range(H):
    for col in range(W):
        img.putpixel((col, row), ((col/1000 * 255), col, B, 125))

img.save("output.png")