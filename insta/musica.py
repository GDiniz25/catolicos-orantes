# Trilhas instrumentais originais (sintetizadas aqui, sem direitos de terceiros): pads suaves com sinos.
import numpy as np, subprocess, os, wave
SR = 44100
def nota(n):  # n = número MIDI
    return 440.0 * 2 ** ((n - 69) / 12)
def env(N, a, r):
    e = np.ones(N); A = int(a * SR); R = int(r * SR)
    e[:A] = np.linspace(0, 1, A); e[-R:] *= np.linspace(1, 0, R); return e
def pad(freqs, dur):
    N = int(dur * SR); t = np.arange(N) / SR; s = np.zeros(N)
    for f in freqs:
        vib = 1 + 0.003 * np.sin(2 * np.pi * 4.7 * t + f)
        for h, amp in ((1, 1.0), (2, 0.35), (3, 0.12), (4, 0.05)):
            s += amp * np.sin(2 * np.pi * f * h * vib * t + np.random.rand() * 6)
            s += amp * 0.5 * np.sin(2 * np.pi * f * h * 1.003 * t)
    return s / len(freqs) * env(N, 1.8, 2.2)
def sino(f, dur=3.0):
    N = int(dur * SR); t = np.arange(N) / SR
    s = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.76 * t) + 0.15 * np.sin(2 * np.pi * f * 5.4 * t)
    return s * np.exp(-t * 1.6) * env(N, 0.005, 0.3)
def faixa(nome, prog, total=80, tempo=5.0, seed=1):
    np.random.seed(seed)
    N = int(total * SR); out = np.zeros(N + SR * 8)
    i = 0; t0 = 0.0
    while t0 < total:
        acorde = prog[i % len(prog)]
        freqs = [nota(m) for m in acorde]
        p = pad(freqs, tempo + 2.2); a = int(t0 * SR)
        out[a:a + len(p)] += 0.55 * p
        b = pad([nota(acorde[0] - 12)], tempo + 2.2); out[a:a + len(b)] += 0.35 * b
        for k in range(2):
            if np.random.rand() < 0.75:
                m = acorde[np.random.randint(len(acorde))] + 24
                s = sino(nota(m)); c = int((t0 + k * tempo / 2 + 0.3) * SR)
                out[c:c + len(s)] += 0.10 * s
        t0 += tempo; i += 1
    out = out[:N]
    out /= np.max(np.abs(out)) + 1e-9
    raw = f"/tmp/{nome}.wav"
    with wave.open(raw, "w") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((out * 0.8 * 32767).astype(np.int16).tobytes())
    dest = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audio", nome + ".m4a")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af",
        "aecho=0.8:0.75:70|140|280|520:0.35|0.25|0.18|0.1,lowpass=f=5200,highpass=f=60,pan=stereo|c0=c0|c1=c0,loudnorm=I=-19:TP=-2",
        "-ar", "44100", "-c:a", "aac", "-b:a", "160k", dest], check=True)
    print(dest)
D = 50  # Ré
faixa("luz", [[62, 66, 69, 74], [59, 62, 66, 71], [55, 59, 62, 67], [57, 61, 64, 69]], seed=3)            # D Bm G A
faixa("silencio", [[57, 60, 64, 69], [53, 57, 60, 65], [48, 52, 55, 60], [55, 59, 62, 67]], tempo=6.0, seed=7)  # Am F C G
faixa("esperanca", [[53, 57, 60, 65], [48, 52, 55, 60], [50, 53, 57, 62], [46, 50, 53, 58]], seed=11)      # F C Dm Bb
