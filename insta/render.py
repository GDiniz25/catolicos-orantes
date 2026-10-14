# -*- coding: utf-8 -*-
"""Gera as peças do Instagram (imagens, carrosséis, stories e reels) a partir de spec.py."""
import os, sys, subprocess, shutil, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

BASE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(BASE, "img")
OUT = os.path.join(BASE, "saida")
TMP = os.path.join(BASE, "tmp")
LORA = "/usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf"
LORA_I = "/usr/share/fonts/truetype/google-fonts/Lora-Italic-Variable.ttf"
INTER = "/usr/share/fonts/opentype/inter/Inter-Medium.otf"
INTER_B = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"

# Paleta: verde litúrgico profundo, dourado de iluminura, marfim
VERDE = (24, 46, 36)
VERDE_ESC = (14, 28, 22)
OURO = (214, 178, 94)
MARFIM = (246, 241, 230)
SITE = "catolicosorantes.com.br"

ns = {}
exec(open(os.path.join(BASE, "spec.py"), encoding="utf-8").read(), ns)
S = ns["S"]

def fonte(caminho, tam, var=None):
    f = ImageFont.truetype(caminho, tam)
    if var:
        try: f.set_variation_by_name(var)
        except Exception: pass
    return f

def quebra(txt, f, larg, draw):
    linhas = []
    for par in txt.split("\n"):
        if not par.strip():
            linhas.append("")
            continue
        atual = ""
        for w in par.split(" "):
            t = (atual + " " + w).strip()
            if draw.textlength(t, font=f) <= larg: atual = t
            else:
                if atual: linhas.append(atual)
                atual = w
        linhas.append(atual)
    return linhas

def bloco(draw, txt, f, larg, cx, y, cor, entre=1.25, alinh="c", sombra=True):
    """Escreve texto quebrado, centralizado em cx (ou alinhado à esquerda em cx). Devolve y final."""
    linhas = quebra(txt, f, larg, draw)
    asc, desc = f.getmetrics()
    lh = int((asc + desc) * entre)
    for ln in linhas:
        if ln == "":
            y += lh // 2
            continue
        w = draw.textlength(ln, font=f)
        x = cx - w / 2 if alinh == "c" else cx
        if sombra:
            draw.text((x + 2, y + 3), ln, font=f, fill=(0, 0, 0, 150))
        draw.text((x, y), ln, font=f, fill=cor)
        y += lh
    return y

def altura(draw, txt, f, larg, entre=1.25):
    linhas = quebra(txt, f, larg, draw)
    asc, desc = f.getmetrics()
    lh = int((asc + desc) * entre)
    return sum(lh // 2 if l == "" else lh for l in linhas)

def ajusta(draw, txt, caminho, var, tam, larg, alt_max, minimo=40):
    while tam > minimo:
        f = fonte(caminho, tam, var)
        if altura(draw, txt, f, larg) <= alt_max: return f
        tam -= 4
    return fonte(caminho, minimo, var)

LARGAS = set()

def fundo(nome, W, H, escala=1.0, centro=0.36):
    """Pintura cobrindo o quadro. Obras muito largas entram inteiras sobre fundo desfocado."""
    if nome is None:
        return Image.new("RGB", (W, H), (8, 8, 8))
    im = Image.open(os.path.join(IMG, nome + ".jpg")).convert("RGB")
    W2, H2 = int(W * escala), int(H * escala)
    r_img = im.width / im.height
    r_q = W2 / H2
    if r_img > r_q * 1.45:
        bg = cobre(im, W2, H2).filter(ImageFilter.GaussianBlur(40))
        bg = ImageEnhance.Brightness(bg).enhance(0.45)
        nw = W2
        nh = int(nw / r_img)
        fg = im.resize((nw, nh), Image.LANCZOS)
        bg.paste(fg, (0, int(H2 * centro - nh / 2)))
        LARGAS.add(nome)
        return bg
    return cobre(im, W2, H2)

def cobre(im, W, H, foco_y=0.35):
    r = max(W / im.width, H / im.height)
    nw, nh = int(im.width * r + 0.5), int(im.height * r + 0.5)
    im = im.resize((nw, nh), Image.LANCZOS)
    x = (nw - W) // 2
    y = int((nh - H) * foco_y)
    return im.crop((x, y, x + W, y + H))

def gradiente(W, H, ini=0.35, fim=1.0, alfa_max=235, cor=VERDE_ESC):
    g = Image.new("L", (1, H))
    for y in range(H):
        t = (y / H - ini) / (fim - ini)
        t = max(0, min(1, t))
        g.putpixel((0, y), int(alfa_max * (t ** 1.2)))
    g = g.resize((W, H))
    camada = Image.new("RGBA", (W, H), cor + (0,))
    camada.putalpha(g)
    return camada

def escurece(im, a=110, cor=VERDE_ESC):
    c = Image.new("RGBA", im.size, cor + (a,))
    return Image.alpha_composite(im.convert("RGBA"), c)

def assinatura(draw, W, y, cor=MARFIM):
    f = fonte(INTER_B, 26)
    w = draw.textlength(SITE, font=f)
    draw.line((W / 2 - w / 2 - 60, y + 16, W / 2 - w / 2 - 18, y + 16), fill=OURO, width=2)
    draw.line((W / 2 + w / 2 + 18, y + 16, W / 2 + w / 2 + 60, y + 16), fill=OURO, width=2)
    draw.text((W / 2 - w / 2, y), SITE, font=f, fill=cor)

def cruz(draw, cx, cy, s=22, cor=OURO, w=4):
    draw.line((cx, cy - s, cx, cy + s), fill=cor, width=w)
    draw.line((cx - s * 0.62, cy - s * 0.35, cx + s * 0.62, cy - s * 0.35), fill=cor, width=w)

# ---------------- IMAGEM (4:5) ----------------
def peca_imagem(p, destino):
    W, H = 1080, 1350
    base = fundo(p["img"], W, H).convert("RGBA")
    base = Image.alpha_composite(base, gradiente(W, H, 0.30, 0.95, 245))
    d = ImageDraw.Draw(base)
    cruz(d, W / 2, 820)
    f = ajusta(d, p["titulo"], LORA, "Bold", 76, 920, 300)
    y = 870
    y = bloco(d, p["titulo"], f, 920, W / 2, y, MARFIM)
    fs = fonte(INTER, 32)
    bloco(d, p["sub"], fs, 900, W / 2, y + 24, OURO, entre=1.35)
    assinatura(d, W, H - 70)
    base.convert("RGB").save(destino, quality=92)

# ---------------- CARROSSEL (4:5) ----------------
def peca_carrossel(p, pasta):
    W, H = 1080, 1350
    n = len(p["slides"])
    arquivos = []
    for i, txt in enumerate(p["slides"]):
        if i == 0:
            base = fundo(p["img"], W, H).convert("RGBA")
            base = Image.alpha_composite(base, gradiente(W, H, 0.25, 0.92, 245))
            d = ImageDraw.Draw(base)
            f = ajusta(d, txt, LORA, "Bold", 84, 940, 420)
            h = altura(d, txt, f, 940)
            y = H - 230 - h
            cruz(d, W / 2, y - 60)
            bloco(d, txt, f, 940, W / 2, y, MARFIM)
            fs = fonte(INTER_B, 28)
            dica = "Arraste para o lado"
            d.text((W / 2 - d.textlength(dica, font=fs) / 2, H - 150), dica, font=fs, fill=OURO)
            assinatura(d, W, H - 80)
        else:
            base = Image.new("RGBA", (W, H), VERDE + (255,))
            faixa = cobre(Image.open(os.path.join(IMG, p["img"] + ".jpg")).convert("RGB"), W, 420, foco_y=0.15 + 0.12 * (i % 5))
            faixa = escurece(faixa, 60)
            base.paste(faixa, (0, 0))
            base = Image.alpha_composite(base, gradiente(W, H, 0.20, 0.33, 255, VERDE))
            d = ImageDraw.Draw(base)
            fc = fonte(INTER_B, 26)
            cont = f"{i + 1}/{n}"
            d.text((W - 70 - d.textlength(cont, font=fc), 470), cont, font=fc, fill=OURO)
            d.line((80, 520, 200, 520), fill=OURO, width=3)
            partes = txt.split("\n\n")
            principal = partes[0]
            fonte_ref = "\n\n".join(partes[1:]) if len(partes) > 1 else ""
            f = ajusta(d, principal, LORA, "SemiBold", 66, 920, 520)
            y = bloco(d, principal, f, 920, 80, 570, MARFIM, alinh="e", sombra=False)
            if fonte_ref:
                fr = fonte(INTER, 32)
                bloco(d, fonte_ref, fr, 920, 80, y + 30, OURO, alinh="e", sombra=False)
            if i == n - 1:
                fz = fonte(INTER_B, 30)
                msg = "Salve este post e envie para alguém"
                d.text((80, H - 190), msg, font=fz, fill=OURO)
            assinatura(d, W, H - 80)
        nome = os.path.join(pasta, f"slide-{i + 1:02d}.jpg")
        base.convert("RGB").save(nome, quality=92)
        arquivos.append(nome)
    return arquivos

# ---------------- STORIES (9:16) ----------------
def peca_stories(p, pasta):
    W, H = 1080, 1920
    for i, (titulo, adesivo) in enumerate(p["quadros"]):
        base = fundo(p["img"], W, H).convert("RGB").filter(ImageFilter.GaussianBlur(6))
        base = escurece(base, 150)
        d = ImageDraw.Draw(base)
        cruz(d, W / 2, 470)
        f = ajusta(d, titulo, LORA, "Bold", 82, 900, 420)
        y = bloco(d, titulo, f, 900, W / 2, 540, MARFIM)
        if adesivo:
            caixa_y = max(y + 70, 1000)
            ft = fonte(INTER_B, 34)
            linhas = quebra(adesivo, ft, 760, d)
            ch = 70 + len(linhas) * 48
            x0, x1 = 120, W - 120
            # moldura tracejada: lugar do adesivo do Instagram
            for x in range(x0, x1, 28):
                d.line((x, caixa_y, min(x + 14, x1), caixa_y), fill=OURO, width=3)
                d.line((x, caixa_y + ch, min(x + 14, x1), caixa_y + ch), fill=OURO, width=3)
            for yy in range(caixa_y, caixa_y + ch, 28):
                d.line((x0, yy, x0, min(yy + 14, caixa_y + ch)), fill=OURO, width=3)
                d.line((x1, yy, x1, min(yy + 14, caixa_y + ch)), fill=OURO, width=3)
            yy = caixa_y + 35
            for ln in linhas:
                d.text((W / 2 - d.textlength(ln, font=ft) / 2, yy), ln, font=ft, fill=OURO)
                yy += 48
        assinatura(d, W, H - 330)
        base.convert("RGB").save(os.path.join(pasta, f"story-{i + 1:02d}.jpg"), quality=92)

# ---------------- REELS (9:16, vídeo) ----------------
def quadro_texto(txt, estilo, W=1080, H=1920, cy=0.44):
    """PNG transparente com o texto da cena."""
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if estilo == "preto":
        f = ajusta(d, txt, LORA, "SemiBold", 70, 900, 700)
        h = altura(d, txt, f, 900)
        bloco(d, txt, f, 900, W / 2, int(H * 0.40 - h / 2), MARFIM, sombra=False)
        return im
    if estilo == "gancho":
        f = ajusta(d, txt, LORA, "Bold", 92, 920, 640)
    elif estilo == "oracao":
        f = ajusta(d, txt, LORA_I, "Bold", 74, 900, 700)
    elif estilo == "final":
        f = ajusta(d, txt, LORA, "Bold", 72, 920, 640)
    else:
        f = ajusta(d, txt, LORA, "SemiBold", 74, 920, 640)
    h = altura(d, txt, f, 920)
    y0 = int(H * cy - h / 2)
    # véu atrás do texto para leitura
    veu = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    vd = ImageDraw.Draw(veu)
    vd.rounded_rectangle((60, y0 - 70, W - 60, y0 + h + 60), radius=28, fill=VERDE_ESC + (170,))
    veu = veu.filter(ImageFilter.GaussianBlur(18))
    im = Image.alpha_composite(im, veu)
    d = ImageDraw.Draw(im)
    if estilo == "oracao":
        cruz(d, W / 2, y0 - 30, s=18)
    bloco(d, txt, f, 920, W / 2, y0, MARFIM)
    if estilo == "final":
        assinatura(d, W, y0 + h + 90)
    return im

def duracao(txt):
    palavras = len(txt.split())
    return round(max(2.6, 1.3 + palavras * 0.36), 2)

def peca_reel(p, destino_mp4, destino_capa):
    W, H = 1080, 1920
    os.makedirs(TMP, exist_ok=True)
    clips = []
    for k, (img, txt, estilo) in enumerate(p["cenas"]):
        dur = duracao(txt)
        bg = fundo(img, W, H, escala=1.0, centro=0.27) if img else Image.new("RGB", (W, H), (8, 8, 8))
        larga = img in LARGAS
        if img:
            bg = Image.alpha_composite(bg.convert("RGBA"), Image.new("RGBA", (W, H), (0, 0, 0, 60))).convert("RGB")
        bgp = os.path.join(TMP, f"bg{k}.jpg"); bg.save(bgp, quality=94)
        tx = quadro_texto(txt, estilo, cy=0.62 if larga else 0.44)
        txp = os.path.join(TMP, f"tx{k}.png"); tx.save(txp)
        if k == 0:
            capa = Image.alpha_composite(bg.convert("RGBA"), tx).convert("RGB")
            capa.save(destino_capa, quality=92)
        cp = os.path.join(TMP, f"c{k}.mp4")
        fr = int(dur * 30)
        zoom = "zoompan=z='1+0.06*on/{fr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={fr}:s=1080x1920:fps=30".format(fr=fr) if img else "fps=30"
        filtro = (f"[0:v]scale=1080:1920,{zoom},format=yuv420p[b];"
                  f"[1:v]format=rgba,fade=t=in:st=0.15:d=0.45:alpha=1[t];"
                  f"[b][t]overlay=0:0,fade=t=in:st=0:d=0.25,fade=t=out:st={dur - 0.3}:d=0.3,format=yuv420p[v]")
        cmd = ["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-t", str(dur), "-i", bgp,
               "-loop", "1", "-t", str(dur), "-i", txp,
               "-f", "lavfi", "-t", str(dur), "-i", "anullsrc=r=44100:cl=stereo",
               "-filter_complex", filtro, "-map", "[v]", "-map", "2:a",
               "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-r", "30", "-t", str(dur),
               "-c:a", "aac", "-b:a", "96k", "-shortest", cp]
        subprocess.run(cmd, check=True)
        clips.append(cp)
    lista = os.path.join(TMP, "lista.txt")
    with open(lista, "w") as fh:
        for c in clips: fh.write(f"file '{c}'\n")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lista,
                    "-c", "copy", "-movflags", "+faststart", destino_mp4], check=True)
    for f in os.listdir(TMP): os.remove(os.path.join(TMP, f))

def main(filtro=None):
    os.makedirs(OUT, exist_ok=True)
    for chave, p in sorted(S.items(), key=lambda kv: (kv[0][0], kv[0][1])):
        if filtro and filtro not in p["arquivo"]: continue
        dia_pasta = os.path.join(OUT, p["arquivo"][:5])
        os.makedirs(dia_pasta, exist_ok=True)
        if p["fmt"] == "imagem":
            peca_imagem(p, os.path.join(dia_pasta, p["arquivo"] + ".jpg"))
        elif p["fmt"] == "carrossel":
            pasta = os.path.join(dia_pasta, p["arquivo"]); os.makedirs(pasta, exist_ok=True)
            peca_carrossel(p, pasta)
        elif p["fmt"] == "stories":
            pasta = os.path.join(dia_pasta, p["arquivo"]); os.makedirs(pasta, exist_ok=True)
            peca_stories(p, pasta)
        elif p["fmt"] == "reel":
            peca_reel(p, os.path.join(dia_pasta, p["arquivo"] + ".mp4"), os.path.join(dia_pasta, p["arquivo"] + "_capa.jpg"))
        print("ok", p["arquivo"], flush=True)

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else None)
