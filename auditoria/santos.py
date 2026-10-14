#!/usr/bin/env python3
"""Para cada santo sem artigo: procura no Wikidata, pega a imagem (P18) e confere a licença no Commons."""
import json, re, time, urllib.parse, sys
sys.path.insert(0, 'auditoria')
from auditoria import get, folha, OUT
import os

def wd(params):
    return json.loads(get('https://www.wikidata.org/w/api.php?' + urllib.parse.urlencode({**params, 'format': 'json'})))

SANTO = re.compile(r'saint|santo|santa|são|beato|beata|blessed|martyr|mártir|bishop|bispo|pope|papa|abbot|abade|monk|nun|religious|religios|priest|presbítero|sacerdote|virgin|virgem|hermit|eremita|apostle|apóstolo|prophet|profeta|patriarch|deacon|diácono|missionary|missionário|doctor of the church', re.I)

def variantes(nome):
    n = re.sub(r'^(SS?\.|S\.|São|Santo|Santa|Sto\.|Sta\.|B\.|Beato|Beata|Bem-aventurad[oa]|Santos|Santas)\s+', '', nome.strip())
    partes = [p.strip() for p in n.split(',')]
    base = partes[0]
    desc = ' '.join(partes[1:])
    vs = [base]
    m = re.search(r'\bde ([A-ZÁÉÍÓÚÂÊÔÃÕ][\wáéíóúâêôãõç-]+(?: [A-ZÁÉÍÓÚÂÊÔÃÕ][\wáéíóúâêôãõç-]+)*)', desc)
    if m and ' de ' not in base: vs.insert(0, f'{base} de {m.group(1)}')
    return vs

def candidato(nome):
    for q in variantes(nome):
        for lang in ('pt', 'en'):
            try:
                r = wd({'action': 'wbsearchentities', 'search': q, 'language': lang, 'uselang': 'pt', 'type': 'item', 'limit': '7'})
            except Exception:
                continue
            ids = [x['id'] for x in r.get('search', [])]
            if not ids: continue
            ents = wd({'action': 'wbgetentities', 'ids': '|'.join(ids), 'props': 'claims|descriptions|labels', 'languages': 'pt|en'}).get('entities', {})
            for i in ids:
                e = ents.get(i, {})
                cl = e.get('claims', {})
                desc = ' '.join(d.get('value', '') for d in e.get('descriptions', {}).values())
                human = any(c.get('mainsnak', {}).get('datavalue', {}).get('value', {}).get('id') == 'Q5' for c in cl.get('P31', []))
                santo = 'P411' in cl or 'P841' in cl or SANTO.search(desc)
                if not (human and santo): continue
                if 'P18' not in cl: continue
                arq = cl['P18'][0]['mainsnak']['datavalue']['value']
                lab = (e.get('labels', {}).get('pt') or e.get('labels', {}).get('en') or {}).get('value', '')
                return {'qid': i, 'arquivo': arq, 'rotulo': lab, 'desc': desc[:90]}
            time.sleep(0.1)
    return None

def licenca(arq):
    params = {'action': 'query', 'format': 'json', 'formatversion': '2', 'titles': 'File:' + arq, 'prop': 'imageinfo',
              'iiprop': 'url|size|extmetadata', 'iiurlwidth': '300', 'iiextmetadatafilter': 'LicenseShortName|License|DateTimeOriginal'}
    p = json.loads(get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)))['query']['pages'][0]
    ii = (p.get('imageinfo') or [{}])[0]
    md = ii.get('extmetadata', {})
    lic = (md.get('LicenseShortName', {}).get('value', '') + ' ' + md.get('License', {}).get('value', '')).lower()
    ok = any(k in lic for k in ('public domain', 'pd', 'cc0', 'cc-zero'))
    return ok, ii.get('thumburl'), ii.get('width', 0), ii.get('height', 0)

lista = json.load(open('auditoria/santos.json'))
res = {}
for sid, nome in lista:
    try:
        c = candidato(nome)
        if c:
            ok, th, w, h = licenca(c['arquivo'])
            if ok and w >= 400:
                c.update({'thumb': th, 'w': w, 'h': h}); res[sid] = c
    except Exception as e:
        print('erro', nome, e)
    time.sleep(0.1)
json.dump(res, open(os.path.join(OUT, 'santos.json'), 'w'), ensure_ascii=False, indent=0)
print('com imagem:', len(res), 'de', len(lista))
nomes = dict(lista)
ids = list(res)
for p in range(0, len(ids), 20):
    itens = []
    for k, sid in enumerate(ids[p:p + 20]):
        c = res[sid]
        try: data = get(c['thumb'])
        except Exception: data = None
        itens.append((f'{p + k} {nomes[sid][:22]}', c['rotulo'][:38], data))
    folha(itens, f'santos-{p // 20:02d}.jpg')
