#!/usr/bin/env python3
"""Valida dados/nomes.json, dados/exames.json e dados/temperamento.json."""
import json, os, re, sys, unicodedata

BASE = os.path.dirname(os.path.abspath(__file__))
SLUGS = set(l.strip() for l in open(os.path.join(BASE, '_slugs-site.txt'), encoding='utf-8') if l.strip())
TAGS_OK = {'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'blockquote', 'br'}
VAZIAS = {'br'}
erros = []


def erro(msg):
    erros.append(msg)


def carregar(nome):
    try:
        with open(os.path.join(BASE, 'dados', nome), encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        erro(f'{nome}: JSON nao carrega ({e})')
        return None


def strings(obj, caminho=''):
    if isinstance(obj, str):
        yield caminho, obj
    elif isinstance(obj, dict):
        for k, v in obj.items():
            yield from strings(v, f'{caminho}.{k}')
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from strings(v, f'{caminho}[{i}]')


def links(obj, caminho=''):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in ('link', 'artigo') and isinstance(v, str):
                yield f'{caminho}.{k}', v
            yield from links(v, f'{caminho}.{k}')
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from links(v, f'{caminho}[{i}]')


def palavras(html):
    return len(re.sub(r'<[^>]+>', ' ', html).split())


def checar_html(arq, caminho, s):
    if '<' not in s and '>' not in s:
        return
    pilha = []
    for m in re.finditer(r'<(/?)([a-zA-Z0-9]+)([^>]*)>', s):
        fecha, tag, attrs = m.group(1), m.group(2).lower(), m.group(3)
        if tag not in TAGS_OK:
            erro(f'{arq}{caminho}: tag nao permitida <{tag}>')
            continue
        if tag == 'a' and not fecha:
            if not re.fullmatch(r'\s+href="[^"]+"(\s+target="_blank"\s+rel="noopener noreferrer")?\s*', attrs):
                erro(f'{arq}{caminho}: atributos invalidos em <a{attrs}>')
        elif attrs.strip() and attrs.strip() != '/':
            erro(f'{arq}{caminho}: atributos em <{tag}{attrs}>')
        if tag in VAZIAS:
            continue
        if fecha:
            if not pilha or pilha[-1] != tag:
                erro(f'{arq}{caminho}: </{tag}> sem abertura correspondente')
                return
            pilha.pop()
        else:
            pilha.append(tag)
    if pilha:
        erro(f'{arq}{caminho}: tags abertas sem fechar {pilha}')
    resto = re.sub(r'<(/?)([a-zA-Z0-9]+)([^>]*)>', '', s)
    if '<' in resto or '>' in resto:
        erro(f'{arq}{caminho}: sinal < ou > solto')


def checar_comum(arq, dados):
    for cam, s in strings(dados):
        if '—' in s or '–' in s:
            erro(f'{arq}{cam}: travessao')
        checar_html(arq, cam, s)
        for h in re.findall(r'href="([^"]+)"', s):
            if h.startswith('http'):
                if 'vatican.va' not in h:
                    erro(f'{arq}{cam}: link externo nao permitido {h}')
            elif h.split('#')[0] not in SLUGS:
                erro(f'{arq}{cam}: href fora de _slugs-site.txt {h}')
    for cam, l in links(dados):
        if l not in SLUGS:
            erro(f'{arq}{cam}: link fora de _slugs-site.txt {l}')


def slug_ok(s):
    return bool(re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', s or ''))


def sem_acento(s):
    return unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()


# nomes.json
nomes = carregar('nomes.json')
if nomes is not None:
    checar_comum('nomes.json', nomes)
    if not isinstance(nomes, list):
        erro('nomes.json: deve ser array')
    else:
        if len(nomes) != 80:
            erro(f'nomes.json: {len(nomes)} nomes (esperado 80)')
        vistos = set()
        for i, n in enumerate(nomes):
            r = n.get('slug', f'#{i}')
            for c in ('nome', 'slug', 'genero', 'origem', 'santos', 'texto'):
                if not n.get(c):
                    erro(f'nomes {r}: campo {c} ausente ou vazio')
            if 'significado' not in n:
                erro(f'nomes {r}: campo significado ausente')
            elif n['significado'] is not None and not (isinstance(n['significado'], str) and n['significado'].strip()):
                erro(f'nomes {r}: significado deve ser texto ou null')
            if n.get('genero') not in ('m', 'f'):
                erro(f'nomes {r}: genero invalido')
            if not slug_ok(n.get('slug')):
                erro(f'nomes {r}: slug invalido')
            if n.get('slug') in vistos:
                erro(f'nomes {r}: slug repetido')
            vistos.add(n.get('slug'))
            santos = n.get('santos') or []
            if not 1 <= len(santos) <= 3:
                erro(f'nomes {r}: {len(santos)} santos (1 a 3)')
            for s in santos:
                if not s.get('nome') or not s.get('festa'):
                    erro(f'nomes {r}: santo sem nome ou festa')
                if 'link' in s and not s['link']:
                    erro(f'nomes {r}: link vazio')
            w = palavras(n.get('texto', ''))
            if not 100 <= w <= 180:
                erro(f'nomes {r}: texto com {w} palavras (100 a 180)')
        ordem = [sem_acento(n.get('nome', '')) for n in nomes]
        if ordem != sorted(ordem):
            erro('nomes.json: fora de ordem alfabetica')

# exames.json
exames = carregar('exames.json')
if exames is not None:
    checar_comum('exames.json', exames)
    esperadas = {'casados', 'jovens', 'criancas', 'primeira-confissao'}
    if not isinstance(exames, dict) or set(exames) != esperadas:
        erro(f'exames.json: chaves devem ser {sorted(esperadas)}')
    else:
        for k in sorted(esperadas):
            e = exames[k]
            if not slug_ok(k):
                erro(f'exames {k}: chave invalida')
            for c in ('titulo', 'descricao', 'intro', 'secoes', 'conselhos'):
                if not e.get(c):
                    erro(f'exames {k}: campo {c} ausente ou vazio')
            d = len(e.get('descricao', ''))
            if not 120 <= d <= 155:
                erro(f'exames {k}: descricao com {d} caracteres')
            w = palavras(e.get('intro', ''))
            if not 120 <= w <= 200:
                erro(f'exames {k}: intro com {w} palavras')
            w = palavras(e.get('conselhos', ''))
            if not 80 <= w <= 150:
                erro(f'exames {k}: conselhos com {w} palavras')
            for s in e.get('secoes', []):
                if not s.get('titulo'):
                    erro(f'exames {k}: secao sem titulo')
                p = s.get('perguntas') or []
                if not 4 <= len(p) <= 8:
                    erro(f'exames {k}: secao "{s.get("titulo")}" com {len(p)} perguntas')
                for q in p:
                    if not q.strip().endswith('?'):
                        erro(f'exames {k}: pergunta sem "?": {q}')
            if len(e.get('secoes', [])) < 8:
                erro(f'exames {k}: poucas secoes')
    if isinstance(exames, dict) and len(exames) != 4:
        erro(f'exames.json: {len(exames)} perfis (esperado 4)')

# temperamento.json
temp = carregar('temperamento.json')
if temp is not None:
    checar_comum('temperamento.json', temp)
    tipos = ['colerico', 'sanguineo', 'melancolico', 'fleumatico']
    af = temp.get('afirmacoes') or []
    if len(af) != 32:
        erro(f'temperamento: {len(af)} afirmacoes (esperado 32)')
    for t in tipos:
        n = sum(1 for a in af if a.get('temperamento') == t)
        if n != 8:
            erro(f'temperamento: {t} com {n} afirmacoes (esperado 8)')
    for a in af:
        if not a.get('texto') or a.get('temperamento') not in tipos:
            erro(f'temperamento: afirmacao invalida {a}')
    textos = [a.get('texto') for a in af]
    if len(set(textos)) != len(textos):
        erro('temperamento: afirmacoes repetidas')
    for i in range(1, len(af)):
        if af[i].get('temperamento') == af[i - 1].get('temperamento'):
            erro(f'temperamento: afirmacoes {i} e {i+1} do mesmo tipo seguidas (nao misturadas)')
    res = temp.get('resultados') or {}
    if set(res) != set(tipos):
        erro('temperamento: resultados devem ter as 4 chaves')
    for t in tipos:
        r = res.get(t, {})
        for c in ('nome', 'resumo', 'forcas', 'desafios', 'virtude_chave', 'conselhos', 'oracao', 'artigo'):
            if not r.get(c):
                erro(f'temperamento {t}: campo {c} ausente ou vazio')
        if len(r.get('conselhos', [])) != 5:
            erro(f'temperamento {t}: {len(r.get("conselhos", []))} conselhos (esperado 5)')
        if 'autoconhecimento' not in r.get('resumo', ''):
            erro(f'temperamento {t}: resumo nao diz que e ferramenta de autoconhecimento')
        if not r.get('oracao', '').startswith('Sugestão de oração:'):
            erro(f'temperamento {t}: oracao sem "Sugestão de oração:"')

if erros:
    print('\n'.join(erros))
    print(f'FALHOU: {len(erros)} erro(s)')
    sys.exit(1)
print('VALIDACAO OK')
print(f'nomes: {len(nomes)} | exames: {len(exames)} perfis, '
      f'{sum(len(s["perguntas"]) for e in exames.values() for s in e["secoes"])} perguntas | '
      f'temperamento: {len(temp["afirmacoes"])} afirmacoes')
