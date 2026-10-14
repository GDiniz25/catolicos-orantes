# -*- coding: utf-8 -*-
"""Gera as peças do Instagram a partir de spec.py.
Direção visual "galeria": a pintura aparece sempre inteira, com moldura fina dourada, sobre uma extensão
desfocada e escurecida dela mesma. O texto fica no campo escuro, fora da pintura, para leitura com contraste alto."""
import os, sys, subprocess, json
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

BASE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(BASE, "img")
OUT = os.path.join(BASE, "saida")
TMP = os.path.join(BASE, "tmp")
LORA = "/usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf"
LORA_I = "/usr/share/fonts/truetype/google-fonts/Lora-Italic-Variable.ttf"
INTER = "/usr/share/fonts/opentype/inter/Inter-Medium.otf"
INTER_B = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"

TINTA = (12, 22, 17)          # verde quase preto, base do campo escuro
OURO = (218, 184, 102)
MARFIM = (247, 242, 232)
CINZA = (196, 200, 190)
SITE = "catolicosorantes.com.br"

ns = {"__file__": os.path.join(BASE, "spec.py")}
exec(open(os.path.join(BASE, "spec.py"), encoding="utf-8").read(), ns)
S = ns["S"]
cr = {}
exec(open(os.path.join(BASE, "creditos.py"), encoding="utf-8").read(), cr)
CRED = cr["CRED"]
_cache = {}

def abre(nome):
    if nome not in _cache:
        _cache[nome] = Image.open(os.path.join(IMG, nome + ".jpg")).convert("RGB")
    return _cache[nome]

def fonte(caminho, tam, var=None):
    f = ImageFont.truetype(caminho, tam)
    if var:
        try: f.set_variation_by_name(var)
        except Exception: pass
    return f

def quebra(txt, f, larg, d):
    linhas = []
    for par in txt.split("\n"):
        if not par.strip():
            linhas.append(""); continue
        atual = ""
        for w in par.split(" "):
            t = (atual + " " + w).strip()
            if d.textlength(t, font=f) <= larg: atual = t
            else:
                if atual: linhas.append(atual)
                atual = w
        linhas.append(atual)
    # evita palavra sozinha na última linha
    if len(linhas) >= 2 and linhas[-1] and len(linhas[-1].split()) == 1 and linhas[-2] and len(linhas[-2].split()) > 2:
        ult = linhas[-2].split()
        linhas[-2] = " ".join(ult[:-1]); linhas[-1] = ult[-1] + " " + linhas[-1]
    return linhas

def lh(f, entre): a, b = f.getmetrics(); return int((a + b) * entre)

def altura(d, txt, f, larg, entre=1.22):
    L = quebra(txt, f, larg, d); h = lh(f, entre)
    return sum(h // 2 if l == "" else h for l in L)

def escreve(d, txt, f, larg, cx, y, cor, entre=1.22):
    h = lh(f, entre)
    for ln in quebra(txt, f, larg, d):
        if ln == "": y += h // 2; continue
        d.text((cx - d.textlength(ln, font=f) / 2, y), ln, font=f, fill=cor)
        y += h
    return y

def ajusta(d, txt, caminho, var, tam, larg, alt_max, minimo=34, entre=1.22):
    while tam > minimo:
        f = fonte(caminho, tam, var)
        if altura(d, txt, f, larg, entre) <= alt_max: return f
        tam -= 2
    return fonte(caminho, minimo, var)

def campo(nome, W, H):
    """Fundo: a própria pintura ampliada, desfocada e escurecida (tom verde-escuro)."""
    im = abre(nome)
    r = max(W / im.width, H / im.height)
    bg = im.resize((int(im.width * r) + 1, int(im.height * r) + 1), Image.LANCZOS)
    x = (bg.width - W) // 2; y = (bg.height - H) // 2
    bg = bg.crop((x, y, x + W, y + H)).filter(ImageFilter.GaussianBlur(48))
    bg = ImageEnhance.Brightness(bg).enhance(0.58)
    tinta = Image.new("RGB", (W, H), TINTA)
    bg = Image.blend(bg, tinta, 0.32)
    vin = Image.new("L", (W, H), 0); ImageDraw.Draw(vin).ellipse((-W * 0.3, -H * 0.15, W * 1.3, H * 1.15), fill=255)
    vin = vin.filter(ImageFilter.GaussianBlur(160))
    return Image.composite(bg, Image.blend(bg, tinta, 0.6), vin)

def pintura(canvas, nome, caixa):
    """Cola a pintura inteira dentro da caixa (x, y, w, h), centralizada, com sombra e moldura dourada fina."""
    x, y, w, h = caixa
    im = abre(nome)
    r = min(w / im.width, h / im.height)
    nw, nh = int(im.width * r), int(im.height * r)
    px, py = int(x + (w - nw) / 2), int(y + (h - nh) / 2)
    sombra = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(sombra).rectangle((px + 6, py + 14, px + nw + 6, py + nh + 14), fill=(0, 0, 0, 170))
    sombra = sombra.filter(ImageFilter.GaussianBlur(22))
    base = Image.alpha_composite(canvas.convert("RGBA"), sombra)
    base.paste(im.resize((nw, nh), Image.LANCZOS), (px, py))
    d = ImageDraw.Draw(base)
    d.rectangle((px - 8, py - 8, px + nw + 7, py + nh + 7), outline=OURO + (255,), width=2)
    return base, (px, py, nw, nh)

def credito(d, nome, cx, y, larg):
    c = CRED.get(nome, "")
    if not c: return y
    f = fonte(INTER, 19)
    t = c + ". Domínio público."
    while d.textlength(t, font=f) > larg and len(t) > 10: t = t[:-6] + "..."
    d.text((cx - d.textlength(t, font=f) / 2, y), t, font=f, fill=CINZA)
    return y + 26

def assinatura(d, W, y):
    f = fonte(INTER_B, 25)
    w = d.textlength(SITE, font=f)
    d.line((W / 2 - w / 2 - 58, y + 15, W / 2 - w / 2 - 18, y + 15), fill=OURO, width=2)
    d.line((W / 2 + w / 2 + 18, y + 15, W / 2 + w / 2 + 58, y + 15), fill=OURO, width=2)
    d.text((W / 2 - w / 2, y), SITE, font=f, fill=MARFIM)

def cruz(d, cx, cy, s=16, cor=OURO, w=3):
    d.line((cx, cy - s, cx, cy + s), fill=cor, width=w)
    d.line((cx - s * 0.62, cy - s * 0.35, cx + s * 0.62, cy - s * 0.35), fill=cor, width=w)

def composicao(W, H, nome, blocos, topo, base_lim, caixa_max_h, margem=70, gap=46):
    """Monta pintura + blocos de texto como um grupo centralizado verticalmente entre topo e base_lim.
    blocos: lista de (texto, caminho_fonte, variação, tam, cor, larg, alt_max)."""
    canvas = campo(nome, W, H)
    tmp = ImageDraw.Draw(canvas)
    fontes, alts = [], []
    for (txt, cam, var, tam, cor, larg, amax) in blocos:
        f = ajusta(tmp, txt, cam, var, tam, larg, amax)
        fontes.append(f); alts.append(altura(tmp, txt, f, larg))
    texto_h = sum(alts) + 22 * (len(blocos) - 1)
    disponivel = base_lim - topo - texto_h - gap - 30
    caixa_h = max(260, min(caixa_max_h, disponivel))
    im = abre(nome)
    r = min((W - 2 * margem) / im.width, caixa_h / im.height)
    nh = int(im.height * r)
    grupo = nh + 30 + gap + texto_h
    y0 = topo + max(0, (base_lim - topo - grupo) / 2)
    canvas, (px, py, pw, ph) = pintura(canvas, nome, (margem, int(y0), W - 2 * margem, nh))
    d = ImageDraw.Draw(canvas)
    y = credito(d, nome, W / 2, py + ph + 16, W - 2 * margem)
    y += gap
    for (txt, cam, var, tam, cor, larg, amax), f in zip(blocos, fontes):
        y = escreve(d, txt, f, larg, W / 2, y, cor) + 22
    return canvas, d, y, (px, py, pw, ph)

# ---------------- IMAGEM (4:5) ----------------
def peca_imagem(p, destino):
    W, H = 1080, 1350
    blocos = [(p["titulo"], LORA, "Bold", 64, MARFIM, 940, 260), (p["sub"], INTER, None, 30, OURO, 900, 140)]
    canvas, d, y, _ = composicao(W, H, p["img"], blocos, 60, H - 110, 800)
    assinatura(d, W, H - 72)
    canvas.convert("RGB").save(destino, quality=93)

# ---------------- CARROSSEL (4:5) ----------------
def peca_carrossel(p, pasta):
    W, H = 1080, 1350
    n = len(p["slides"])
    imgs = p.get("imgs") or [p["img"]]
    for i, txt in enumerate(p["slides"]):
        nome = imgs[i % len(imgs)]
        partes = txt.split("\n\n")
        principal, ref = partes[0], "\n\n".join(partes[1:])
        if i == 0:
            blocos = [(principal, LORA, "Bold", 70, MARFIM, 940, 330)]
            canvas, d, y, _ = composicao(W, H, nome, blocos, 60, H - 150, 760)
            fs = fonte(INTER_B, 26); dica = "Arraste para o lado"
            d.text((W / 2 - d.textlength(dica, font=fs) / 2, H - 128), dica, font=fs, fill=OURO)
        else:
            blocos = [(principal, LORA, "SemiBold", 56, MARFIM, 920, 420)]
            if ref: blocos.append((ref, INTER, None, 30, OURO, 900, 160))
            if i == n - 1:
                blocos.append(("Salve este post e envie para alguém.", INTER_B, None, 28, OURO, 900, 80))
            canvas, d, y, _ = composicao(W, H, nome, blocos, 80, H - 110, 560)
            fc = fonte(INTER_B, 24); cont = f"{i + 1}/{n}"
            d.text((W - 60 - d.textlength(cont, font=fc), 26), cont, font=fc, fill=OURO)
        assinatura(d, W, H - 72)
        canvas.convert("RGB").save(os.path.join(pasta, f"slide-{i + 1:02d}.jpg"), quality=93)

# ---------------- STORIES (9:16) ----------------
def peca_stories(p, pasta):
    W, H = 1080, 1920
    for i, q in enumerate(p["quadros"]):
        titulo, sub = q[0], q[1]
        blocos = [(titulo, LORA, "Bold", 72, MARFIM, 920, 360)]
        if sub: blocos.append((sub, INTER, None, 34, OURO, 900, 200))
        # topo livre para a barra do Instagram; base livre para o adesivo e a caixa de resposta
        canvas, d, y, _ = composicao(W, H, p["img"], blocos, 230, 1480, 900)
        assinatura(d, W, H - 250)
        canvas.convert("RGB").save(os.path.join(pasta, f"story-{i + 1:02d}.jpg"), quality=93)

# ---------------- REELS (9:16, vídeo com trilha) ----------------
ESTILO = {
    "gancho": (LORA, "Bold", 74), "frase": (LORA, "SemiBold", 62), "oracao": (LORA_I, "SemiBold", 60),
    "final": (LORA, "Bold", 62), "preto": (LORA, "SemiBold", 64),
}

def quadro(nome, txt, estilo, W=1080, H=1920):
    cam, var, tam = ESTILO[estilo]
    blocos = [(txt, cam, var, tam, MARFIM, 920, 470)]
    # zona segura: abaixo da barra superior e acima da legenda e dos botões do Reels
    canvas, d, y, rect = composicao(W, H, nome, blocos, 200, 1530, 860)
    return canvas, rect

def duracao(txt):
    return round(max(2.8, 1.4 + len(txt.split()) * 0.38), 2)

TRILHA = {"oracao": "silencio", "rel": "esperanca", "fe": "luz"}

def peca_reel(p, destino_mp4, destino_capa):
    W, H = 1080, 1920
    os.makedirs(TMP, exist_ok=True)
    cenas = list(p["cenas"])
    # cena sem imagem usa a pintura da cena seguinte (a imagem aparece sempre)
    for k in range(len(cenas) - 1, -1, -1):
        if cenas[k][0] is None:
            prox = next((c[0] for c in cenas[k + 1:] if c[0]), None) or next(c[0] for c in cenas if c[0])
            cenas[k] = (prox, cenas[k][1], cenas[k][2] if cenas[k][2] != "preto" else "gancho")
    clips, total = [], 0.0
    for k, (img, txt, estilo) in enumerate(cenas):
        dur = duracao(txt)
        canvas, _ = quadro(img, txt, estilo)
        fp = os.path.join(TMP, f"q{k}.png"); canvas.convert("RGB").save(fp)
        if k == 0: canvas.convert("RGB").save(destino_capa, quality=93)
        fr = int(dur * 30)
        cp = os.path.join(TMP, f"c{k}.mp4")
        filtro = (f"scale=1188:2112,zoompan=z='1+0.025*on/{fr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={fr}:s=1080x1920:fps=30,"
                  f"fade=t=in:st=0:d=0.35,fade=t=out:st={dur - 0.35}:d=0.35,format=yuv420p")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", fp, "-vf", filtro, "-t", str(dur),
                        "-c:v", "libx264", "-preset", "medium", "-crf", "22", "-r", "30", cp], check=True)
        clips.append(cp); total += dur
    lista = os.path.join(TMP, "lista.txt")
    with open(lista, "w") as fh:
        for c in clips: fh.write(f"file '{c}'\n")
    mudo = os.path.join(TMP, "mudo.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lista, "-c", "copy", mudo], check=True)
    trilha = os.path.join(BASE, "audio", p.get("trilha", "luz") + ".m4a")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mudo, "-i", trilha,
                    "-filter_complex", f"[1:a]atrim=0:{total},afade=t=in:st=0:d=1.2,afade=t=out:st={max(0, total - 2)}:d=2[a]",
                    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k",
                    "-movflags", "+faststart", "-shortest", destino_mp4], check=True)
    for f in os.listdir(TMP): os.remove(os.path.join(TMP, f))

def trilha_de(p):
    estilos = [c[2] for c in p["cenas"]]
    if "novena" in p["arquivo"] or "festa" in p["arquivo"] or estilos.count("oracao") >= 2: return "silencio"
    return p.get("trilha") or ("esperanca" if any(k in p["arquivo"] for k in ("namor", "casal", "conjuge", "apaixone", "amor", "construir", "comunidade", "cristo-ama", "conto")) else "luz")

def main(filtro=None):
    os.makedirs(OUT, exist_ok=True)
    for chave, p in sorted(S.items(), key=lambda kv: (kv[0][0], kv[0][1])):
        if filtro and filtro not in p["arquivo"]: continue
        dia = os.path.join(OUT, p["arquivo"][:5]); os.makedirs(dia, exist_ok=True)
        if p["fmt"] == "imagem":
            peca_imagem(p, os.path.join(dia, p["arquivo"] + ".jpg"))
        elif p["fmt"] in ("carrossel", "stories"):
            pasta = os.path.join(dia, p["arquivo"]); os.makedirs(pasta, exist_ok=True)
            (peca_carrossel if p["fmt"] == "carrossel" else peca_stories)(p, pasta)
        else:
            p["trilha"] = trilha_de(p)
            peca_reel(p, os.path.join(dia, p["arquivo"] + ".mp4"), os.path.join(dia, p["arquivo"] + "_capa.jpg"))
        print("ok", p["arquivo"], flush=True)

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else None)
