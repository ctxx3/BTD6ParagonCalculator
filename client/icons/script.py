import os
from PIL import Image
import glob

# Create output directory "compressed" if it doesn't exist
output_dir = "compressed"
#os.makedirs(output_dir, exist_ok=True)

# Loop through all .webp files in the current directory
for filepath in glob.glob("*.webp"):
    with Image.open(filepath) as img:
        print(f"Processing {filepath}...")
        orig_width, orig_height = img.size
        new_width = 128
        new_height = round(orig_height * new_width / orig_width)
        resized_img = img.resize((new_width, new_height), Image.LANCZOS)
        # Save the resized image to the compressed folder with the same filename
        resized_img.save(os.path.join(output_dir, os.path.basename(filepath)), format="WEBP")