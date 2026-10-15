#!/usr/bin/env python3
import json, re, sys, os
lote = sys.argv[1]
os.chdir(os.path.dirname(os.path.abspath(__file__)))
plano = json.load(open('_plano.json'))[lote]
arq = f'lote-{lote}.json'
if not os.path.exists(arq): print('arquivo nao existe'); sys.exit(1)
sai = json.load(open(arq, encoding='utf-8'))
slugs = set(l.strip() for l in open('_slugs-site.txt') if l.strip())
cats = {'/'+c for c in ['como-rezar-o-terco','santos-e-oracoes','milagres-eucaristicos','catecismo','liturgia-das-horas','novenas','sacramentos','devocoes-marianas','calendario-liturgico','exame-de-consciencia','oracoes-do-dia-a-dia','documentos-da-igreja','ladainhas','duvidas-da-fe','vida-espiritual','primeiros-passos','liturgia-diaria','santo-do-dia','versiculo-do-dia']}
allowed = {'p','h2','h3','ul','ol','li','strong','em','a','table','thead','tbody','tr','th','td','blockquote','br'}
errs = []
feitos = {a['slug'] for a in sai}
for p in plano:
    if p['slug'] not in feitos: errs.append(f"FALTA: {p['slug']}")
cat_por_slug = {p['slug']: p['category'] for p in plano}
for s in sai:
    sl = s.get('slug'); c = s.get('content', '')
    for f in ('slug','category','title','meta_description','excerpt','image_alt','content'):
        if not s.get(f): errs.append(f'{sl}: campo {f} vazio')
    if sl not in cat_por_slug: errs.append(f'{sl}: slug fora do plano'); continue
    if s['category'] != cat_por_slug[sl]: errs.append(f'{sl}: categoria errada')
    m = re.search(r'<h2>Perguntas frequentes</h2>(.*?)(?=<h2>|$)', c, re.S)
    if not m: errs.append(f'{sl}: sem FAQ')
    else:
        n = len(re.findall(r'<h3>', m.group(1)))
        if not 3 <= n <= 4: errs.append(f'{sl}: FAQ com {n} h3')
    if '<h2>Fontes</h2>' not in c: errs.append(f'{sl}: sem Fontes')
    if '<h2>Para aprofundar</h2>' not in c: errs.append(f'{sl}: sem Para aprofundar')
    if 'não substituem o acompanhamento de um sacerdote' not in c: errs.append(f'{sl}: sem frase final')
    for f in ('title','meta_description','excerpt','content','image_alt'):
        if '—' in s.get(f,'') or '–' in s.get(f,''): errs.append(f'{sl}: travessao em {f}')
    if len(s['title']) > 60: errs.append(f'{sl}: title {len(s["title"])}')
    if not 120 <= len(s['meta_description']) <= 155: errs.append(f'{sl}: meta {len(s["meta_description"])}')
    if len(s['excerpt']) > 160: errs.append(f'{sl}: excerpt {len(s["excerpt"])}')
    for h in re.findall(r'href="([^"]+)"', c):
        if h.startswith('/') and h.split('#')[0] not in slugs and h not in cats: errs.append(f'{sl}: href invalido {h}')
        if h.startswith('http') and 'vatican.va' not in h: errs.append(f'{sl}: href externo {h}')
    tags = set(t.lower() for t in re.findall(r'<([a-zA-Z0-9]+)', c))
    if tags - allowed: errs.append(f'{sl}: tags nao permitidas {tags - allowed}')
    if 'style=' in c or 'class=' in c: errs.append(f'{sl}: style/class')
    h2s = re.findall(r'<h2>(.*?)</h2>', c)
    if sum(1 for h in h2s if h.strip().endswith('?')) < 2: errs.append(f'{sl}: menos de 2 h2 pergunta')
    fp = re.search(r'<p>(.*?)</p>', c, re.S)
    if not fp or '<strong>' not in fp.group(1): errs.append(f'{sl}: primeiro p sem strong')
    texto = re.sub(r'<[^>]+>', ' ', c)
    n = len(texto.split())
    if n < 1000: errs.append(f'{sl}: so {n} palavras')
    for t in ('p','h2','h3','li','ul','ol','strong','em','a','blockquote','table','tr','td','th'):
        o = len(re.findall(rf'<{t}[ >]', c)); cl = c.count(f'</{t}>')
        if o != cl: errs.append(f'{sl}: tag <{t}> desbalanceada {o}/{cl}')
    for proib in ('poderosa', 'infalível', 'infalivel', 'garantid', 'mergulh', 'jornada'):
        if proib in texto.lower() and not (proib.startswith('infal') and 'infalibilidade' in texto.lower()): errs.append(f'{sl}: palavra a evitar "{proib}"')
print('\n'.join(errs) if errs else 'VALIDACAO OK')
print(f'{len(sai)} de {len(plano)} artigos')
sys.exit(1 if errs else 0)
