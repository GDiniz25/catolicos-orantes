import os
ns={};exec(open('/tmp/claude-0/-home-claude/ea23e928-e04e-5f54-a90c-7293828e4fa2/scratchpad/ig/dados.py').read(),ns)
sp={};exec(open('/home/claude/insta-wt/insta/spec.py').read(),sp)
S=sp['S'];P=ns['P'];D=ns['DIAS']
TAGS={'fe':'#igrejacatolica #fecatolica #catolicos #oracao #santos','rel':'#namorosanto #namorocatolico #catolicos #castidade #fecatolica','app':'#catolicos #namorocatolico #fecatolica #comunidadecatolica #oracao'}
OUT='/home/claude/insta-wt/insta/saida'
porDia={}
for p in P:
    s=S.get((p['dia'],p['hora']))
    if not s: print('sem spec',p['dia'],p['hora']); continue
    porDia.setdefault(p['dia'],[]).append((p,s))
for dia,itens in porDia.items():
    d=D[dia]; pasta=os.path.join(OUT,s and itens[0][1]['arquivo'][:5])
    os.makedirs(pasta,exist_ok=True)
    linhas=[f"{d['sem']}, {d['d']}: {d['tema']}",d['nota'],'']
    for p,s in sorted(itens,key=lambda x:x[0]['hora']):
        linhas+=['='*60,f"{p['hora']}  {p['fmt'].upper()}  ->  {s['arquivo']}",f"Título: {p['titulo']}",'']
        if p['legenda']:
            linhas+=['LEGENDA (copie daqui):','',p['legenda'],'',p['cta'],'',TAGS[p['pilar']],'']
        else:
            linhas+=['Stories: siga a ordem dos arquivos story-01 a story-05. Onde houver moldura tracejada, coloque o adesivo do Instagram indicado.','']
    open(os.path.join(pasta,'LEGENDAS.txt'),'w').write('\n'.join(linhas))
print('ok',len(porDia))
