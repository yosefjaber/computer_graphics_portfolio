from PIL import Image
import random
import math
import noise  
import numpy as np  
from PIL import Image  
import matplotlib.pyplot as plt  

R, G, B, A = 255, 0, 0, 128
W, H = 1000, 1000
perlin = True

img = Image.new("RGBA", (W, H))

# Adapted from:
# Py4U, "Python Random Map Generation with Perlin Noise"
# https://www.py4u.org/blog/python-random-map-generation-with-perlin-noise/
def generate_perlin_noise(width, height, scale=10.0, octaves=3, persistence=0.5, lacunarity=2.0):  
    """  
    Generate a 2D Perlin Noise grid.  
    
    Parameters:  
        width (int): Width of the grid.  
        height (int): Height of the grid.  
        scale (float): Controls "zoom" (smaller = more detail, larger = bigger features).  
        octaves (int): Number of noise layers (more = more complexity).  
        persistence (float): How much each octave contributes (0.0-1.0; lower = less detail).  
        lacunarity (float): How much octave frequency increases (usually >1; higher = more detail).  
    Returns:  
        2D numpy array of noise values (range: ~-1 to 1).  
    """  
    # Create empty grid  
    noise_grid = np.zeros((height, width))  
    
    # Generate noise for each (x, y) coordinate  
    for y in range(height):  
        for x in range(width):  
            # Scale coordinates to control "zoom"  
            nx = x / scale  
            ny = y / scale  
            # Generate Perlin Noise value  
            noise_value = noise.pnoise2(  
                nx, ny,  
                octaves=octaves,  
                persistence=persistence,  
                lacunarity=lacunarity,  
                repeatx=1024, repeaty=1024,  # Tileable noise (optional)  
                base=42  # Seed (change for different maps)  
            )  
            noise_grid[y][x] = (noise_value  + 1) / 2
    
    return noise_grid 

if perlin: alpha2 = generate_perlin_noise(width = W, height = H, scale=150, octaves=5).tolist()

for row in range(H):
    for col in range(W):

        cs = math.cos(((row * col))/1000)

        # Should be between 0 - 255
        red   = (((math.sin(col/100 + row/20) + 1) / 2) * random.random() * 255)
        green = (((math.cos(col/151 + row/10) + 1) / 2) * 255)
        blue  = (((math.sin(col/4 + row/30) + 1) / 2) * random.random() * 255)
        if perlin: 
            alpha = alpha2[row][col] * 255
        else:
            alpha = (255/4) * ((math.cos((col - H/2) / 50) + 1) + (math.cos((row - W/2) / 50) + 1)) + 3

        img.putpixel((col, row), (int(red), int(green), int(blue), int(alpha)))

img.save("output.png")