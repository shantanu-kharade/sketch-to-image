import cv2 as cv
from skimage.metrics import structural_similarity as ssim


# Calculate SSIM
first = cv.imread("test1.jpg")

#second = cv.imread("captured.png")
second = cv.imread("output_1.png")

# Resize both images to the same dimensions
first = cv.resize(first, (128, 128))
second = cv.resize(second, (128, 128))
first = cv.cvtColor(first, cv.COLOR_BGR2GRAY)
second = cv.cvtColor(second, cv.COLOR_BGR2GRAY)
s = ssim(first, second)

print(f"SSIM similarity score: {s}")