#!/usr/bin/env python3
"""Valida dados/consagracao.json e dados/via-sacra.json conforme _DADOS.md e _REGRAS.md."""
import json, os, re, sys
from html.parser import HTMLParser

BASE = os.path.dirname(os.path.abspath(__file__))
SLUGS = {l.strip() for l in open(os.path.join(BASE, '_slugs-site.txt'), encoding='utf-8') if l.strip()}
ALLOWED = {'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'blockquote', 'br'}
VOID = {'br'}
PROIBIDAS = ('poderosa', 'infalível', 'infalivel', 'garantid', 'mergulh', 'jornada', 'neste artigo')
errs = []


class Checker(HTMLParser):
    def __init__(self, ctx):
        super().__init__(convert_charrefs=True)
        self.ctx, self.stack = ctx, []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag not in ALLOWED:
            errs.append(f'{self.ctx}: tag nao permitida <{tag}>')
        for k in a:
            if k in ('style', 'class', 'id'):
                errs.append(f'{self.ctx}: atributo {k} proibido')
        if tag == 'a':
            h = a.get('href', '')
            if not h:
                errs.append(f'{self.ctx}: <a> sem href')
            elif h.startswith('/'):
                if h.split('#')[0] not in SLUGS:
                    errs.append(f'{self.ctx}: href interno fora da lista: {h}')
            elif h.startswith('http'):
                if 'vatican.va' not in h:
                    errs.append(f'{self.ctx}: href externo nao permitido: {h}')
                if a.get('target') != '_blank' or a.get('rel') != 'noopener noreferrer':
                    errs.append(f'{self.ctx}: link externo sem target/rel: {h}')
            else:
                errs.append(f'{self.ctx}: href estranho: {h}')
        if tag not in VOID:
            self.stack.append(tag)

    def handle_startendtag(self, tag, attrs):
        if tag not in ALLOWED:
            errs.append(f'{self.ctx}: tag nao permitida <{tag}/>')

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack or self.stack[-1] != tag:
            errs.append(f'{self.ctx}: fechamento </{tag}> desbalanceado (pilha {self.stack})')
            if tag in self.stack:
                while self.stack and self.stack.pop() != tag:
                    pass
        else:
            self.stack.pop()


def check_html(ctx, s, must_start_p=True):
    if not isinstance(s, str) or not s.strip():
        errs.append(f'{ctx}: HTML vazio'); return
    if must_start_p and not s.lstrip().startswith(('<p>', '<ul>', '<ol>')):
        errs.append(f'{ctx}: HTML deve comecar com bloco <p>')
    c = Checker(ctx); c.feed(s); c.close()
    if c.stack:
        errs.append(f'{ctx}: tags nao fechadas {c.stack}')
    # texto solto fora de bloco
    fora = re.sub(r'<(p|ul|ol|blockquote)>.*?</\1>', '', s, flags=re.S).strip()
    if fora:
        errs.append(f'{ctx}: texto fora de bloco: {fora[:60]}')


def plain(ctx, s, maxlen=None):
    if not isinstance(s, str) or not s.strip():
        errs.append(f'{ctx}: texto vazio'); return
    if re.search(r'<[a-zA-Z/]', s):
        errs.append(f'{ctx}: campo de texto simples contem HTML')
    if maxlen and len(s) > maxlen:
        errs.append(f'{ctx}: {len(s)} caracteres (max {maxlen})')


def words(s):
    return len(re.sub(r'<[^>]+>', ' ', s).split())


def sentences(s):
    return len([x for x in re.split(r'(?<=[.!?])\s+', s.strip()) if x])


def walk(ctx, o):
    if isinstance(o, dict):
        for k, v in o.items(): walk(f'{ctx}.{k}', v)
    elif isinstance(o, list):
        for i, v in enumerate(o): walk(f'{ctx}[{i}]', v)
    elif isinstance(o, str):
        if '—' in o or '–' in o:
            errs.append(f'{ctx}: travessao')
        low = re.sub(r'<[^>]+>', ' ', o).lower()
        for p in PROIBIDAS:
            if p in low:
                errs.append(f'{ctx}: palavra a evitar "{p}"')


def load(nome):
    p = os.path.join(BASE, 'dados', nome)
    try:
        return json.load(open(p, encoding='utf-8'))
    except Exception as e:
        errs.append(f'{nome}: JSON nao carrega ({e})'); return None


# ---------- consagracao.json ----------
c = load('consagracao.json')
if c is not None:
    walk('consagracao', c)
    for k in ('etapas', 'dias', 'dia_consagracao', 'aviso'):
        if k not in c: errs.append(f'consagracao: falta chave {k}')
    ORACOES = {
        'preliminar': (["Veni Creator Spiritus", "Ave Maris Stella", "Magnificat", "Glória ao Pai"], (1, 12)),
        'semana1': (["Ladainha do Espírito Santo", "Ladainha de Nossa Senhora", "Ave Maris Stella"], (13, 19)),
        'semana2': (["Ladainha do Espírito Santo", "Ladainha de Nossa Senhora", "Ave Maris Stella", "Oração a Maria de São Luís de Montfort"], (20, 26)),
        'semana3': (["Ladainha do Espírito Santo", "Ave Maris Stella", "Ladainha do Santíssimo Nome de Jesus", "Oração a Jesus de São Luís de Montfort", "Ó Jesus que viveis em Maria"], (27, 33)),
    }
    et = c.get('etapas', [])
    if [e.get('id') for e in et] != list(ORACOES):
        errs.append(f'consagracao: etapas devem ser {list(ORACOES)}, veio {[e.get("id") for e in et]}')
    cobertos = []
    for e in et:
        ctx = f'etapa {e.get("id")}'
        plain(ctx + '.nome', e.get('nome'))
        exp = ORACOES.get(e.get('id'))
        if exp:
            if e.get('oracoes') != exp[0]: errs.append(f'{ctx}: oracoes diferentes do esquema')
            if tuple(e.get('dias', [])) != exp[1]: errs.append(f'{ctx}: dias {e.get("dias")} esperado {list(exp[1])}')
        a, b = e.get('dias', [0, -1])
        cobertos += list(range(a, b + 1))
        check_html(ctx + '.texto', e.get('texto'))
        w = words(e.get('texto', ''))
        if not 60 <= w <= 250: errs.append(f'{ctx}.texto: {w} palavras (60 a 250)')
    if sorted(cobertos) != list(range(1, 34)):
        errs.append('consagracao: etapas nao cobrem 1 a 33 sem sobreposicao')
    dias = c.get('dias', [])
    if [d.get('dia') for d in dias] != list(range(1, 34)):
        errs.append(f'consagracao: dias devem ser 1..33 em ordem (veio {len(dias)})')
    temas = set()
    for d in dias:
        ctx = f'dia {d.get("dia")}'
        plain(ctx + '.tema', d.get('tema'), 80)
        if d.get('tema') in temas: errs.append(f'{ctx}: tema repetido')
        temas.add(d.get('tema'))
        plain(ctx + '.leitura', d.get('leitura'), 160)
        check_html(ctx + '.meditacao', d.get('meditacao'))
        w = words(d.get('meditacao', ''))
        if not 120 <= w <= 200: errs.append(f'{ctx}.meditacao: {w} palavras (120 a 200)')
        plain(ctx + '.proposito', d.get('proposito'), 200)
        if d.get('proposito') and sentences(d['proposito']) != 1:
            errs.append(f'{ctx}.proposito: deve ser uma frase')
    dc = c.get('dia_consagracao', {})
    check_html('dia_consagracao.texto', dc.get('texto'))
    t = dc.get('texto', '')
    for termo in ('onfiss', 'omunh', 'ato de consagração', 'oferta'):
        if termo not in t: errs.append(f'dia_consagracao: nao menciona "{termo}"')
    if '/devocoes-marianas/a-consagracao-a-nossa-senhora-segundo-sao-luis-de-montfort' not in t:
        errs.append('dia_consagracao: sem link para o artigo de Montfort')
    if c.get('aviso') != '<p>As orações indicadas para cada etapa seguem o esquema mais difundido; edições do Tratado podem trazer pequenas variações.</p>':
        errs.append('consagracao: aviso diferente do texto pedido')

# ---------- via-sacra.json ----------
v = load('via-sacra.json')
if v is not None:
    walk('via-sacra', v)
    for k in ('estacoes', 'abertura', 'encerramento'):
        if k not in v: errs.append(f'via-sacra: falta chave {k}')
    est = v.get('estacoes', [])
    if [e.get('n') for e in est] != list(range(1, 15)):
        errs.append(f'via-sacra: estacoes devem ser 1..14 (veio {len(est)})')
    tradicao = {3, 6, 7, 9}
    for e in est:
        ctx = f'estacao {e.get("n")}'
        plain(ctx + '.titulo', e.get('titulo'), 80)
        plain(ctx + '.leitura', e.get('leitura'), 160)
        if e.get('n') in tradicao and 'tradição' not in e.get('leitura', ''):
            errs.append(f'{ctx}: leitura deve indicar que vem da tradição')
        check_html(ctx + '.meditacao', e.get('meditacao'))
        w = words(e.get('meditacao', ''))
        if not 90 <= w <= 150: errs.append(f'{ctx}.meditacao: {w} palavras (90 a 150)')
        o = e.get('oracao', '')
        plain(ctx + '.oracao', o, 260)
        if not o.startswith('Sugestão de oração: '):
            errs.append(f'{ctx}.oracao: deve comecar com "Sugestão de oração: "')
        else:
            n = sentences(o[len('Sugestão de oração: '):])
            if not 1 <= n <= 2: errs.append(f'{ctx}.oracao: {n} frases (1 a 2)')
    for k in ('abertura', 'encerramento'):
        check_html(f'via-sacra.{k}', v.get(k))
    tits = ' | '.join(e.get('titulo', '') for e in est)
    for t in ('Verônica', 'primeira vez', 'segunda vez', 'terceira vez'):
        if t not in tits: errs.append(f'via-sacra: falta estação com "{t}"')

print('\n'.join(errs) if errs else 'VALIDACAO OK')
sys.exit(1 if errs else 0)
