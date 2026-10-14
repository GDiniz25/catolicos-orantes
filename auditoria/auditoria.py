#!/usr/bin/env python3
"""Folhas de contato para revisar imagens (atuais e candidatas do Wikimedia Commons)."""
import json, os, io, sys, time, urllib.request, urllib.parse
from PIL import Image, ImageDraw, ImageFont

UA = 'CatolicosOrantes/1.0 (https://catolicosorantes.com.br; contato@catolicosorantes.com.br)'
FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
FONTB = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 17)
OUT = 'auditoria/saida'
os.makedirs(OUT, exist_ok=True)

def get(url, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                return r.read()
        except Exception as e:
            err = e; time.sleep(1.5 * (i + 1))
    raise err

def thumb(data, w, h):
    im = Image.open(io.BytesIO(data)).convert('RGB')
    W, H = im.size
    im.thumbnail((w, h))
    return im, W, H

def folha(itens, nome, cols=5, w=300, h=220):
    """itens: lista de (rotulo1, rotulo2, bytes|None)"""
    rows = (len(itens) + cols - 1) // cols
    cw, ch = w + 10, h + 54
    sheet = Image.new('RGB', (cols * cw + 10, rows * ch + 10), (245, 241, 234))
    d = ImageDraw.Draw(sheet)
    for i, (r1, r2, data) in enumerate(itens):
        x = 10 + (i % cols) * cw; y = 10 + (i // cols) * ch
        d.rectangle([x, y, x + w, y + h], fill=(225, 220, 210))
        info = ''
        if data:
            try:
                im, W, H = thumb(data, w, h)
                sheet.paste(im, (x + (w - im.width) // 2, y + (h - im.height) // 2))
                info = f' {W}x{H}'
            except Exception:
                d.text((x + 8, y + 8), 'ERRO AO ABRIR', fill=(180, 0, 0), font=FONTB)
        else:
            d.text((x + 8, y + 8), 'SEM IMAGEM', fill=(180, 0, 0), font=FONTB)
        d.text((x, y + h + 4), f'{r1}{info}'[:34], fill=(20, 20, 20), font=FONTB)
        d.text((x, y + h + 26), r2[:38], fill=(60, 60, 60), font=FONT)
    sheet.save(os.path.join(OUT, nome), quality=80)

def atual():
    lista = json.load(open('auditoria/atual.json'))
    por = 20
    for p in range(0, len(lista), por):
        itens = []
        for idx, rot, url in lista[p:p + por]:
            data = None
            if url and url.startswith('http'):
                try: data = get(url)
                except Exception: data = None
            itens.append((str(idx), rot, data))
        folha(itens, f'atual-{p // por:02d}.jpg')
        print('folha', p // por)

def commons_busca(q, limite=12):
    params = {'action': 'query', 'format': 'json', 'formatversion': '2', 'generator': 'search', 'gsrnamespace': '6',
              'gsrlimit': str(limite), 'gsrsearch': q + ' filetype:bitmap', 'prop': 'imageinfo',
              'iiprop': 'url|size|extmetadata', 'iiurlwidth': '400',
              'iiextmetadatafilter': 'LicenseShortName|License|Artist|DateTimeOriginal|ObjectName'}
    j = json.loads(get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)))
    out = []
    for pg in sorted(j.get('query', {}).get('pages', []), key=lambda x: x.get('index', 0)):
        ii = (pg.get('imageinfo') or [{}])[0]
        md = ii.get('extmetadata', {})
        lic = (md.get('LicenseShortName', {}).get('value', '') + ' ' + md.get('License', {}).get('value', '')).lower()
        if not any(k in lic for k in ('public domain', 'pd', 'cc0', 'cc-zero')): continue
        if ii.get('width', 0) < 900: continue
        out.append({'arquivo': pg['title'][5:], 'w': ii['width'], 'h': ii['height'], 'thumb': ii.get('thumburl'),
                    'artista': md.get('Artist', {}).get('value', '')[:80]})
    return out

def buscas():
    import re
    pedidos = json.load(open('auditoria/buscas.json'))
    resultado = {}
    for ped in pedidos:
        vistos, cands = set(), []
        for q in ped['q']:
            try:
                for c in commons_busca(q):
                    if c['arquivo'] in vistos: continue
                    vistos.add(c['arquivo']); cands.append(c)
            except Exception as e:
                print('erro', q, e)
            time.sleep(0.3)
        cands = cands[:ped.get('n', 10)]
        resultado[ped['id']] = cands
    json.dump(resultado, open(os.path.join(OUT, 'buscas.json'), 'w'), ensure_ascii=False, indent=1)
    # folhas: um bloco por pedido, até 10 candidatas
    ids = list(resultado)
    for p in range(0, len(ids), 2):
        itens = []
        for pid in ids[p:p + 2]:
            cs = resultado[pid]
            for k in range(10):
                if k < len(cs):
                    c = cs[k]
                    try: data = get(c['thumb'])
                    except Exception: data = None
                    itens.append((f'{pid[:14]} #{k}', re.sub(r'<[^>]+>', '', c['artista']) or c['arquivo'], data))
                else:
                    itens.append((f'{pid[:14]} #{k}', '-', None))
        folha(itens, f'busca-{p // 2:03d}.jpg')
        print('busca folha', p // 2)

if __name__ == '__main__':
    modo = sys.argv[1]
    {'atual': atual, 'buscas': buscas}[modo]()
