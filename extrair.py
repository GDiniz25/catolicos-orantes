"""Baixa os painéis do catálogo de milagres eucarísticos (miracolieucaristici.org, versão pr),
extrai as imagens embutidas e faz OCR em português. Uso interno como fonte de fatos."""
import re, base64, os, subprocess, html, urllib.request, concurrent.futures as cf
B = 'https://www.miracolieucaristici.org/pr/Liste/'
UA = {'User-Agent': 'Mozilla/5.0 (CatolicosOrantes pesquisa)'}
def get(u):
    return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=120).read()
lista = get(B + 'list.html').decode('utf-8', 'replace')
itens = []
for m in re.finditer(r'href="(scheda[^"]*?\?nat=([^&"]+)&(?:amp;)?wh=([^"&]+))"[^>]*>(.*?)</a>', lista, re.S):
    nome = re.sub(r'<[^>]+>', ' ', html.unescape(m.group(4)))
    nome = re.sub(r'\s+', ' ', nome).strip()
    itens.append((m.group(2), m.group(3), nome, B + html.unescape(m.group(1))))
os.makedirs('catalogo', exist_ok=True)
vistos = set()
uniq = [i for i in itens if not ((i[0], i[1]) in vistos or vistos.add((i[0], i[1])))]
with open('catalogo/lista.tsv', 'w') as f:
    for nat, wh, nome, url in uniq:
        f.write(f'{nat}\t{wh}\t{nome}\t{url}\n')
print(len(uniq), 'itens')
def fazer(it):
    nat, wh, nome, url = it
    try:
        h = get(f'https://www.miracolieucaristici.org/pr/{nat}/{wh}.html').decode('latin-1')
        imgs = re.findall(r'data:image/(?:jpeg|jpg|png);base64,([A-Za-z0-9+/=\s]+)', h)
        textos = []
        for k, b in enumerate(imgs):
            p = f'/tmp/{nat}_{wh}_{k}.jpg'
            open(p, 'wb').write(base64.b64decode(re.sub(r'\s', '', b)))
            # converte para PNG em escala de cinza e limita o tamanho (alguns JPEG CMYK ou enormes falham no tesseract)
            q = p.replace('.jpg', '.png')
            from PIL import Image
            Image.MAX_IMAGE_PIXELS = None
            try:
                im = Image.open(p).convert('L')
                im.thumbnail((3200, 3200))
                im.save(q)
                conv_err = f'{im.size}'
            except Exception as e:
                conv_err = str(e)
            r = subprocess.run(['tesseract', q if os.path.exists(q) else p, '-', '-l', 'por+ita', '--psm', '3'], capture_output=True, text=True)
            out = r.stdout
            if len(out.strip()) < 50:
                out += f'\n[OCR VAZIO] bytes: {os.path.getsize(p)} conv: {conv_err[:200]} tess: {r.stderr.strip()[:300]}'
            textos.append(out)
        if not imgs:
            textos.append('SEM IMAGEM EMBUTIDA. Links de imagem: ' + ' '.join(re.findall(r'src="([^"]+)"', h)[:10]))
        open(f'catalogo/{nat}__{wh}.txt', 'w').write(f'# {nome}\n# {url}\n\n' + '\n\n=====\n\n'.join(textos))
        return nat, wh, len(imgs), sum(len(t) for t in textos)
    except Exception as e:
        return nat, wh, -1, str(e)
with cf.ThreadPoolExecutor(6) as ex:
    for r in ex.map(fazer, uniq):
        print(*r)
