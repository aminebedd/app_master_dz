import json, os, urllib.request
from PIL import Image, ImageDraw

D = json.loads(open("ids.json", encoding="utf8").read())
os.makedirs("raw", exist_ok=True)
files = []
for q, urls in D.items():
    for i, u in enumerate(urls[:5]):
        fn = f"raw/{q}-{i}.jpg"
        if not os.path.exists(fn):
            try:
                req = urllib.request.Request(u + "?w=600&q=80&fm=jpg&fit=crop&ar=1:1", headers={"User-Agent": "Mozilla/5.0"})
                open(fn, "wb").write(urllib.request.urlopen(req, timeout=20).read())
            except Exception as e:
                print("fail", fn, e)
                continue
        files.append(fn)
cols = 10
S = Image.new("RGB", (200 * cols, 200 * ((len(files) + cols - 1) // cols)), "white")
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((200, 200))
    S.paste(im, ((i % cols) * 200, (i // cols) * 200))
    ImageDraw.Draw(S).text(((i % cols) * 200 + 4, (i // cols) * 200 + 4), os.path.basename(f)[:-4], fill="red")
S.save("sheet.jpg")
