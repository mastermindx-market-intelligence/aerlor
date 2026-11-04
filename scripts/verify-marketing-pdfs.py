"""Render and inspect actual PDF bytes. Requires pdftoppm, PyMuPDF and Pillow."""
from pathlib import Path
import json
import subprocess
import fitz
from PIL import Image, ImageOps, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1]
out = root / 'test-results' / 'pdf-review'
out.mkdir(parents=True, exist_ok=True)
manifest = json.loads((root / 'marketing' / 'document-manifest.json').read_text())
results = []
thumbs = []
for item in manifest['documents']:
    path = root / 'public' / 'documents' / item['file']
    doc = fitz.open(path)
    assert len(doc) == item['pages'], (item['file'], len(doc), item['pages'])
    prefix = out / path.stem
    subprocess.run(['pdftoppm', '-r', '65', '-png', str(path), str(prefix)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    pages = []
    for index, page in enumerate(doc):
        text = page.get_text()
        assert len(text.strip()) > 120, (item['file'], index + 1, 'unexpected empty page')
        assert '\ufffd' not in text, (item['file'], index + 1, 'replacement character')
        assert '/Users/' not in text and 'file://' not in text, 'Local path must not appear in a PDF'
        outside = []
        for block in page.get_text('dict')['blocks']:
            for line in block.get('lines', []):
                for span in line.get('spans', []):
                    rect = fitz.Rect(span['bbox'])
                    if rect.x0 < -1 or rect.y0 < -1 or rect.x1 > page.rect.width + 1 or rect.y1 > page.rect.height + 1:
                        outside.append(span['text'])
        assert not outside, (item['file'], index + 1, outside)
        candidates = [out / f'{path.stem}-{index + 1}.png', out / f'{path.stem}-{index + 1:02d}.png']
        image_path = next(p for p in candidates if p.exists())
        image = Image.open(image_path).convert('RGB')
        thumb = ImageOps.contain(image, (290, 411))
        tile = Image.new('RGB', (310, 450), '#ffffff')
        tile.paste(thumb, ((310 - thumb.width) // 2, 6))
        draw = ImageDraw.Draw(tile)
        label = path.stem.replace('aerlor-', '').replace('-specification-brief', '')
        draw.text((10, 422), f'{label[:39]} / {index + 1}', fill='#222222')
        thumbs.append(tile)
        pages.append({'page': index + 1, 'textCharacters': len(text), 'outOfBoundsText': 0, 'rendered': True})
    results.append({'file': item['file'], 'pages': len(doc), 'layoutSourceCheck': item['layoutCheck'], 'pdfInspection': pages})
    doc.close()
for start in range(0, len(thumbs), 12):
    sheet = Image.new('RGB', (1240, 1350), '#d9d5cc')
    for j, thumb in enumerate(thumbs[start:start + 12]):
        sheet.paste(thumb, ((j % 4) * 310, (j // 4) * 450))
    sheet.save(out / f'contact-sheet-{start // 12 + 1}.jpg', quality=90)
report = {'documents': len(results), 'pages': sum(x['pages'] for x in results), 'renderer': 'pdftoppm', 'textInspection': 'PyMuPDF', 'status': 'rendered-and-machine-checked', 'visualReviewRequired': True, 'results': results}
(out / 'receipt.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({'documents': report['documents'], 'pages': report['pages'], 'status': report['status'], 'contactSheets': (len(thumbs) + 11) // 12}, indent=2))
