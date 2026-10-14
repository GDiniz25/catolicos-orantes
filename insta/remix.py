import os, subprocess, glob
ns = {}; exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "trilhas.py")).read(), ns)
T = ns["TRILHAS"]; BASE = os.path.dirname(os.path.abspath(__file__))
for mp4 in sorted(glob.glob(os.path.join(BASE, "saida", "*", "*.mp4"))):
    nome = os.path.basename(mp4)[:-4]
    if nome not in T: print("SEM TRILHA", nome); continue
    canto, ini = T[nome]
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4], capture_output=True, text=True).stdout)
    tmp = mp4 + ".tmp.mp4"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp4, "-stream_loop", "-1", "-ss", str(ini), "-i", os.path.join(BASE, "canto", canto + ".ogg"),
        "-filter_complex", f"[1:a]atrim=0:{dur},asetpts=N/SR/TB,loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.8,afade=t=out:st={max(0, dur - 2)}:d=2,aresample=44100[a]",
        "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", "-t", str(dur), tmp], check=True)
    os.replace(tmp, mp4)
    print("ok", nome, canto)
