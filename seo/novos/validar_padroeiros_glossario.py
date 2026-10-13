#!/usr/bin/env python3
"""Valida dados/padroeiros.json e dados/glossario.json."""
import json, re, sys, os, unicodedata
from html.parser import HTMLParser

BASE = os.path.dirname(os.path.abspath(__file__))
SLUGS = set(l.strip() for l in open(os.path.join(BASE, '_slugs-site.txt'), encoding='utf-8') if l.strip())
ALLOWED = {'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'blockquote', 'br'}
VOID = {'br'}
SLUG_RE = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
erros = []


def err(ctx, msg):
    erros.append(f'{ctx}: {msg}')


class Checker(HTMLParser):
    def __init__(self, ctx):
        super().__init__(convert_charrefs=True)
        self.ctx, self.stack, self.text = ctx, [], []

    def handle_starttag(self, tag, attrs):
        if tag not in ALLOWED:
            err(self.ctx, f'tag proibida <{tag}>')
        a = dict(attrs)
        for k in a:
            if tag != 'a' or k not in ('href', 'target', 'rel'):
                err(self.ctx, f'atributo proibido {k} em <{tag}>')
        if tag == 'a':
            check_href(self.ctx, a.get('href'), a)
        if tag not in VOID:
            self.stack.append(tag)

    def handle_startendtag(self, tag, attrs):
        if tag not in VOID:
            err(self.ctx, f'<{tag}/> auto fechada')
        if tag not in ALLOWED:
            err(self.ctx, f'tag proibida <{tag}>')

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack or self.stack[-1] != tag:
            err(self.ctx, f'fechamento desbalanceado </{tag}> (pilha {self.stack})')
            if tag in self.stack:
                while self.stack and self.stack.pop() != tag:
                    pass
        else:
            self.stack.pop()

    def handle_data(self, d):
        self.text.append(d)


def check_href(ctx, href, attrs):
    if not href:
        err(ctx, 'link sem href')
        return
    if href.startswith('/'):
        if href not in SLUGS:
            err(ctx, f'link interno fora da lista: {href}')
    elif href.startswith('https://'):
        if attrs.get('target') != '_blank' or attrs.get('rel') != 'noopener noreferrer':
            err(ctx, f'link externo sem target/rel: {href}')
    else:
        err(ctx, f'href invalido: {href}')


def check_html(ctx, html):
    if not isinstance(html, str) or not html.strip():
        err(ctx, 'HTML vazio')
        return ''
    if not html.lstrip().startswith('<'):
        err(ctx, 'HTML deve comecar com tag')
    c = Checker(ctx)
    c.feed(html)
    c.close()
    if c.stack:
        err(ctx, f'tags nao fechadas: {c.stack}')
    # texto solto fora de bloco
    solto = re.sub(r'<(p|ul|ol|blockquote)>.*?</\1>', '', html, flags=re.S).strip()
    if solto:
        err(ctx, f'texto fora de <p>/<ul>/<ol>/<blockquote>: {solto[:60]!r}')
    return ' '.join(c.text)


def words(t):
    return len(re.findall(r'\w+(?:[-\']\w+)*', t))


def sentences(t):
    t = re.sub(r'\b(ex|n|cap|S|Sto|Sta|Pe|Dom|Mons|cf)\.', r'\1', t)
    return len([s for s in re.split(r'(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ"])', t.strip()) if s.strip()])


def walk_dash(ctx, obj):
    if isinstance(obj, str):
        if '—' in obj or '–' in obj:
            err(ctx, 'travessao encontrado')
    elif isinstance(obj, dict):
        for k, v in obj.items():
            walk_dash(f'{ctx}.{k}', v)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            walk_dash(f'{ctx}[{i}]', v)


def load(name):
    p = os.path.join(BASE, 'dados', name)
    try:
        with open(p, encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        err(name, f'JSON nao carrega: {e}')
        return None


def check_slug(ctx, slug, seen):
    if not isinstance(slug, str) or not SLUG_RE.match(slug):
        err(ctx, f'slug invalido: {slug!r}')
    if slug in seen:
        err(ctx, f'slug duplicado: {slug}')
    seen.add(slug)


def check_link_field(ctx, link):
    if link is None:
        return
    if not isinstance(link, str) or link not in SLUGS:
        err(ctx, f'link fora da lista: {link}')


PAD_KEYS = ('slug', 'titulo', 'grupo', 'santos', 'resumo', 'texto', 'invocacao')

pad = load('padroeiros.json')
if pad is not None:
    if not isinstance(pad, list):
        err('padroeiros', 'nao e array')
    else:
        seen = set()
        for i, it in enumerate(pad):
            ctx = f'padroeiros[{i}] {it.get("slug")}'
            walk_dash(ctx, it)
            for k in PAD_KEYS:
                if not it.get(k):
                    err(ctx, f'campo obrigatorio ausente: {k}')
            extra = set(it) - set(PAD_KEYS)
            if extra:
                err(ctx, f'campos extras: {extra}')
            check_slug(ctx, it.get('slug'), seen)
            if it.get('grupo') not in ('profissao', 'causa', 'lugar'):
                err(ctx, f'grupo invalido {it.get("grupo")}')
            for j, s in enumerate(it.get('santos') or []):
                if not s.get('nome'):
                    err(ctx, f'santo {j} sem nome')
                if set(s) - {'nome', 'festa', 'link'}:
                    err(ctx, f'santo {j} campos extras')
                check_link_field(f'{ctx} santo {j}', s.get('link'))
            r = it.get('resumo') or ''
            if len(r) > 160:
                err(ctx, f'resumo com {len(r)} caracteres (max 160)')
            if '<' in r or '<' in (it.get('invocacao') or ''):
                err(ctx, 'HTML em resumo/invocacao')
            txt = check_html(ctx + ' texto', it.get('texto'))
            w = words(txt)
            if not 200 <= w <= 320:
                err(ctx, f'texto com {w} palavras (200 a 320)')
        ordem = {'profissao': 0, 'causa': 1, 'lugar': 2}
        grupos = [it.get('grupo') for it in pad]
        if grupos != sorted(grupos, key=lambda g: ordem.get(g, 9)):
            err('padroeiros', 'grupos fora da ordem da lista')

glo = load('glossario.json')
if glo is not None:
    if not isinstance(glo, list):
        err('glossario', 'nao e array')
    else:
        if not 120 <= len(glo) <= 140:
            err('glossario', f'{len(glo)} termos (120 a 140)')
        seen, termos = set(), set()
        for i, it in enumerate(glo):
            ctx = f'glossario[{i}] {it.get("slug")}'
            walk_dash(ctx, it)
            for k in ('termo', 'slug', 'definicao'):
                if not it.get(k):
                    err(ctx, f'campo obrigatorio ausente: {k}')
            if set(it) - {'termo', 'slug', 'definicao', 'link'}:
                err(ctx, 'campos extras')
            check_slug(ctx, it.get('slug'), seen)
            t = (it.get('termo') or '').lower()
            if t in termos:
                err(ctx, 'termo duplicado')
            termos.add(t)
            check_link_field(ctx, it.get('link'))
            d = it.get('definicao') or ''
            if '<' in d:
                err(ctx, 'definicao com HTML')
            n = sentences(d)
            if not 2 <= n <= 4:
                err(ctx, f'definicao com {n} frases (2 a 4)')
            if len(d) > 600:
                err(ctx, f'definicao longa ({len(d)} caracteres)')
        key = lambda x: unicodedata.normalize('NFD', x.get('termo', '').lower()).encode('ascii', 'ignore').decode()
        if [key(x) for x in glo] != sorted(key(x) for x in glo):
            err('glossario', 'fora de ordem alfabetica')

if erros:
    print('\n'.join(erros))
    print(f'FALHOU: {len(erros)} erro(s)')
    sys.exit(1)
print(f'VALIDACAO OK: padroeiros={len(pad)} glossario={len(glo)}')
