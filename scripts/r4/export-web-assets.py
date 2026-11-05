"""Export original PNG presentation assets to WebP. Requires Pillow."""
from pathlib import Path
from PIL import Image
root = Path(__file__).resolve().parents[2] / "public" / "images" / "studio"
for source in sorted(root.glob("*.png")):
    with Image.open(source) as image:
        image.convert("RGBA").save(source.with_suffix(".webp"), quality=92, method=6)
print("Exported studio WebP assets.")
