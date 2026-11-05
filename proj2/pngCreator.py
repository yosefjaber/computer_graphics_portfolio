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
            noise_grid[y][x] = (noise_value  + 1) / 2 # Final value will be between 0 and 1
    
    return noise_grid 

if perlin: alpha2 = generate_perlin_noise(width = W, height = H, scale=200, octaves=2).tolist()

snow_start = 0.65
mid_point = (0.4)
def lerp(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))

DEEP    = (0, 30, 140)
SHALLOW = (0, 140, 220)
GRASS   = (40, 160, 60)
ROCK    = (120, 110, 100)
SNOW    = (255, 255, 255)

for row in range(H):
    for col in range(W):

        a = alpha2[row][col]   # must be 0..1

        if a > snow_start:
            red, green, blue = SNOW
        elif a > mid_point:
            t = (a - mid_point) / (snow_start - mid_point)   # 0 at mid_point, 1 at snow_start
            red, green, blue = lerp(GRASS, ROCK, t)
        else:
            t = a / mid_point                                # 0 at bottom, 1 at mid_point
            red, green, blue = lerp(DEEP, SHALLOW, t)


        if perlin: 
            alpha = alpha2[row][col] * 255
        else:
            alpha = (255/4) * ((math.cos((col - H/2) / 50) + 1) + (math.cos((row - W/2) / 50) + 1)) + 3

        img.putpixel((col, row), (int(red), int(green), int(blue), int(alpha)))

img.save("output.png")