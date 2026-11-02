from PIL import Image
import random
import math

R, G, B, A = 255, 0, 0, 128
W, H = 1000, 1000

img = Image.new("RGBA", (W, H))

for row in range(H):
    for col in range(W):

        cs = math.cos(((row * col))/1000)

        # Should be between 0 - 255
        red   = (((math.sin(col/100 + row/20) + 1) / 2) * random.random() * 255)
        green = (((math.cos(col/151 + row/10) + 1) / 2) * 255)
        blue  = (((math.sin(col/4 + row/30) + 1) / 2) * random.random() * 255)
        alpha = (255/4) * ((math.cos((col - H/2) / 50) + 1) + (math.cos((row - W/2) / 50) + 1))

        img.putpixel((col, row), (int(red), int(green), int(blue), int(alpha)))

img.save("output.png")