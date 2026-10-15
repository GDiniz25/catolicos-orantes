"""
Refina o foco das imagens (tabela image_focus) procurando rostos.

O smartcrop (scripts/imagens-foco.mjs) acha a área com mais detalhe, mas numa pintura de corpo
inteiro isso costuma ser o meio da roupa. Aqui:
  1. procura rostos (OpenCV, cascatas frontal e de perfil); achou: o corte centraliza o rosto mais alto e maior;
  2. sem rosto e imagem em pé (retrato): o corte sobe para o terço de cima, onde fica a cabeça;
  3. sem rosto e imagem deitada: mantém o smartcrop.
Só processa as linhas com metodo = 'smartcrop' (ainda não refinadas).

Uso (no workflow): pip install opencv-python-headless numpy requests
  python3 scripts/imagens-rosto.py           (simulação: 10 imagens, não grava)
  python3 scripts/imagens-rosto.py --write
Lê VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY do .env.
"""
import os, sys, concurrent.futures as cf
import numpy as np, cv2, requests

GRAVAR = '--write' in sys.argv
env = {}
for linha in open('.env', encoding='utf-8'):
    if '=' in linha:
        k, v = linha.strip().split('=', 1)
        env[k] = v
URL = env.get('VITE_SUPABASE_URL') or 'https://dialdbrhpqrwilsisnkn.supabase.co'
KEY = env['SUPABASE_SERVICE_ROLE_KEY']
H = {'apikey': KEY, 'Authorization': f'Bearer {KEY}'}
UA = {'User-Agent': 'CatolicosOrantes/1.0 (contato@catolicosorantes.com.br)'}

linhas, de = [], 0
while True:
    r = requests.get(f'{URL}/rest/v1/image_focus?select=url,foco&metodo=eq.smartcrop&order=url',
                     headers={**H, 'Range': f'{de}-{de + 999}'}, timeout=60)
    r.raise_for_status()
    lote = r.json()
    linhas += lote
    if len(lote) < 1000:
        break
    de += 1000
print(f'{len(linhas)} imagens para refinar' + ('' if GRAVAR else ' (SIMULAÇÃO: 10, sem gravar)'))
if not GRAVAR:
    linhas = linhas[:10]

base = cv2.data.haarcascades
frontal = cv2.CascadeClassifier(base + 'haarcascade_frontalface_default.xml')
alt2 = cv2.CascadeClassifier(base + 'haarcascade_frontalface_alt2.xml')
perfil = cv2.CascadeClassifier(base + 'haarcascade_profileface.xml')

clamp = lambda v: max(0.0, min(1.0, v))


def rostos(cinza):
    h, w = cinza.shape
    minimo = max(18, int(min(w, h) * 0.04))
    achados = []
    for c, viz in ((alt2, 5), (frontal, 6), (perfil, 5)):
        for (x, y, fw, fh) in c.detectMultiScale(cinza, scaleFactor=1.08, minNeighbors=viz, minSize=(minimo, minimo)):
            achados.append((x, y, fw, fh))
    # perfil virado para o outro lado
    espelho = cv2.flip(cinza, 1)
    for (x, y, fw, fh) in perfil.detectMultiScale(espelho, scaleFactor=1.08, minNeighbors=5, minSize=(minimo, minimo)):
        achados.append((w - x - fw, y, fw, fh))
    return achados


def baixar(linha):
    try:
        r = requests.get(linha['url'], headers=UA, timeout=60)
        r.raise_for_status()
        return linha, r.content
    except Exception as e:
        return linha, e


def processar(linha, conteudo):
    url = linha['url']
    try:
        if isinstance(conteudo, Exception):
            raise conteudo
        img = cv2.imdecode(np.frombuffer(conteudo, np.uint8), cv2.IMREAD_GRAYSCALE)
        if img is None:
            raise ValueError('imagem ilegível')
        h0, w0 = img.shape
        esc = 800 / max(h0, w0)
        if esc < 1:
            img = cv2.resize(img, (int(w0 * esc), int(h0 * esc)), interpolation=cv2.INTER_AREA)
        img = cv2.equalizeHist(img)
        h, w = img.shape
        sx, sy = [float(p.strip('%')) / 100 for p in linha['foco'].split()]
        achados = rostos(img)
        if achados:
            # o maior rosto entre os de cima (pintura com várias figuras: a principal costuma ser maior)
            maior = max(fw * fh for (_, _, fw, fh) in achados)
            cand = [a for a in achados if a[2] * a[3] >= maior * 0.5]
            x, y, fw, fh = min(cand, key=lambda a: a[1])
            cx, cy = (x + fw / 2) / w, (y + fh / 2) / h
            hc = w * 9 / 16  # altura visível num quadro 16:9 de largura cheia
            py = clamp((cy * h - hc / 2) / (h - hc)) if h > hc + 1 else sy
            wc = h  # largura visível num quadro 1:1 de altura cheia
            px = clamp((cx * w - wc / 2) / (w - wc)) if w > wc + 1 else sx
            return url, f'{round(px * 100)}% {round(py * 100)}%', 'rosto'
        if h > w * 1.15:
            return url, f'{round(sx * 100)}% {round(min(sy, 0.2) * 100)}%', 'retrato'
        return url, linha['foco'], 'smartcrop-ok'
    except Exception as e:
        return url, None, f'erro: {e}'


cont = {}
cv2.setNumThreads(1)
# Baixa em paralelo; a detecção roda numa linha só (as cascatas do OpenCV não são seguras entre threads)
with cf.ThreadPoolExecutor(6) as ex:
    for url, foco, metodo in (processar(l, c) for l, c in ex.map(baixar, linhas)):
        cont[metodo.split(':')[0]] = cont.get(metodo.split(':')[0], 0) + 1
        if foco is None:
            print('  falha', url.rsplit('/', 1)[-1], metodo)
            continue
        if GRAVAR:
            requests.patch(f'{URL}/rest/v1/image_focus?url=eq.{requests.utils.quote(url, safe="")}',
                           headers={**H, 'Content-Type': 'application/json'}, json={'foco': foco, 'metodo': metodo}, timeout=60).raise_for_status()
        else:
            print(f'  {metodo:12} {foco:9} {url.rsplit("/", 1)[-1][:80]}')
print(cont)
