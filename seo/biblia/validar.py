#!/usr/bin/env python3
"""Valida um arquivo de reflexões bíblicas: python3 validar.py src/data/biblia-reflexoes/mateus-1.json [LIVRO INICIO FIM]"""
import json, re, sys, os, unicodedata
arq = sys.argv[1]
raiz = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
slugs = set(l.strip() for l in open(os.path.join(raiz, 'seo/novos/_slugs-site.txt')) if l.strip())
src = open(os.path.join(raiz, 'src/data/biblia.ts'), encoding='utf-8').read()
livros = re.findall(r"\['([^']+)', '([^']+)', (\d+)\]", src)
def slug(n): return re.sub(r'[^a-z0-9]+', '-', unicodedata.normalize('NFD', n.lower()).encode('ascii', 'ignore').decode()).strip('-')
caps = {slug(n): int(c) for _, n, c in livros}
nome = {slug(n): n for _, n, c in livros}
allowed = {'p','h2','h3','ul','ol','li','strong','em','a','blockquote','br'}
errs = []
dados = json.load(open(arq, encoding='utf-8'))
vistos = set()
for d in dados:
    lv, cp = d.get('livro'), d.get('cap')
    k = f'{lv} {cp}'
    if lv not in caps: errs.append(f'{k}: livro desconhecido'); continue
    if not isinstance(cp, int) or not 1 <= cp <= caps[lv]: errs.append(f'{k}: capitulo invalido'); continue
    if (lv, cp) in vistos: errs.append(f'{k}: repetido')
    vistos.add((lv, cp))
    for f in ('titulo', 'meta', 'html', 'faq'):
        if not d.get(f): errs.append(f'{k}: campo {f} vazio')
    t, m, h = d.get('titulo', ''), d.get('meta', ''), d.get('html', '')
    ref = f'{nome[lv]} {cp}'
    if not t.startswith(ref): errs.append(f'{k}: titulo deve comecar com "{ref}"')
    if len(t) > 60: errs.append(f'{k}: titulo {len(t)}')
    if not 120 <= len(m) <= 155: errs.append(f'{k}: meta {len(m)}')
    if ref not in m: errs.append(f'{k}: meta sem "{ref}"')
    faq = d.get('faq') or []
    if len(faq) != 3 or any(not q.get('q') or not q.get('a') for q in faq): errs.append(f'{k}: faq precisa de 3 perguntas')
    for txt in [t, m, h] + [q.get('q','') + q.get('a','') for q in faq]:
        if '—' in txt or '–' in txt or ' · ' in txt: errs.append(f'{k}: travessao ou ponto medio'); break
    fp = re.search(r'<p>(.*?)</p>', h, re.S)
    if not h.startswith('<p>') or not fp or '<strong>' not in fp.group(1): errs.append(f'{k}: primeiro paragrafo sem strong')
    for sec in (f'<h2>Contexto de {ref}</h2>', f'<h2>Explicação de {ref}</h2>', '<h2>Reflexão para hoje</h2>', f'<h2>Para rezar com {ref}</h2>', '<h2>Fontes</h2>'):
        if sec not in h: errs.append(f'{k}: falta secao {sec}')
    if not re.search(r'<h2>O que .*?\?</h2>', h): errs.append(f'{k}: falta h2 "O que ... ensina ...?"')
    exp = re.search(r'<h2>Explicação de .*?</h2>(.*?)<h2>', h, re.S)
    if exp and len(re.findall(r'<h3>', exp.group(1))) < 2: errs.append(f'{k}: explicacao com menos de 2 blocos h3')
    if 'Sugestão de oração' not in h: errs.append(f'{k}: sem "Sugestão de oração"')
    tags = set(x.lower() for x in re.findall(r'<([a-zA-Z0-9]+)', h))
    if tags - allowed: errs.append(f'{k}: tags nao permitidas {tags - allowed}')
    if 'style=' in h or 'class=' in h: errs.append(f'{k}: style/class')
    for t2 in ('p','h2','h3','li','ul','ol','strong','em','a','blockquote'):
        if len(re.findall(rf'<{t2}[ >]', h)) != h.count(f'</{t2}>'): errs.append(f'{k}: tag <{t2}> desbalanceada')
    for href in re.findall(r'href="([^"]+)"', h):
        if href.startswith('/biblia/'):
            p = href.strip('/').split('/')
            if len(p) not in (2, 3) or p[1] not in caps or (len(p) == 3 and not (p[2].isdigit() and 1 <= int(p[2]) <= caps[p[1]])): errs.append(f'{k}: link biblia invalido {href}')
        elif href.startswith('/'):
            if href.split('#')[0] not in slugs: errs.append(f'{k}: link interno fora da lista {href}')
        elif 'vatican.va' not in href: errs.append(f'{k}: link externo {href}')
    texto = re.sub(r'<[^>]+>', ' ', h)
    n = len(texto.split())
    if n < 700: errs.append(f'{k}: so {n} palavras')
    if n > 1800: errs.append(f'{k}: {n} palavras (maximo 1800)')
    for proib in ('poderosa', 'mergulh', 'jornada', 'neste artigo'):
        if proib in texto.lower(): errs.append(f'{k}: palavra a evitar "{proib}"')
    aspas = re.findall(r'[“"]([^”"]{120,})[”"]', texto)
    if aspas: errs.append(f'{k}: citacao longa entre aspas ({len(aspas)}): resuma ou parafraseie')
if len(sys.argv) >= 5:
    lv, a, b = sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
    falta = [c for c in range(a, b + 1) if (lv, c) not in vistos]
    if falta: errs.append(f'faltam capitulos: {falta}')
print('\n'.join(errs) if errs else 'VALIDACAO OK')
print(f'{len(dados)} capitulos no arquivo')
sys.exit(1 if errs else 0)
