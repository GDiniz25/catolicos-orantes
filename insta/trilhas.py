# Canto gregoriano de cada reel: (arquivo em canto/, início em segundos)
TRILHAS = {
 "15-10_07h_reel_so-deus-basta": ("ut_queant", 0.3),
 "15-10_19h30_reel_rezar-pelo-futuro-conjuge": ("ubi_caritas", 0.3),
 "16-10_07h_reel_sagrado-coracao": ("veni_creator", 1.6),
 "16-10_19h30_reel_nao-se-apaixone": ("ubi_caritas", 0.3),
 "17-10_07h_reel_sou-trigo-de-deus": ("kyrie", 0.2),
 "17-10_19h30_reel_sabado-com-maria": ("salve_regina", 4.2),
 "18-10_07h_reel_dai-a-cesar": ("ut_queant", 0.3),
 "18-10_19h30_reel_casal-na-missa": ("ubi_caritas", 0.3),
 "19-10_19h30_reel_amor-verdadeiro": ("ubi_caritas", 0.3),
 "20-10_12h_reel_terco-em-60s": ("ave_maria", 0.2),
 "21-10_12h_reel_sao-jose-futuro-namoro": ("ut_queant", 0.3),
 "22-10_10h_reel_nao-tenhais-medo": ("veni_creator", 1.6),
 "23-10_12h_reel_faz-anos-sem-confessar": ("kyrie", 0.2),
 "24-10_19h30_reel_maria-discerniu": ("ave_maria", 0.2),
 "25-10_10h_reel_frei-galvao": ("salve_regina", 4.2),
 "25-10_19h30_reel_comunidade": ("ubi_caritas", 0.3),
 "26-10_12h_reel_causa-impossivel": ("veni_sancte", 96.3),
 "27-10_19h30_reel_quem-quer-construir": ("ubi_caritas", 0.3),
 "28-10_06h30_reel_festa-sao-judas": ("veni_sancte", 3.8),
 "28-10_19h30_reel_como-cristo-ama-a-igreja": ("ubi_caritas", 0.3),
 "29-10_07h_reel_melhor-que-conto-de-fadas": ("ubi_caritas", 0.3),
 "29-10_19h30_reel_descubra-seu-santo": ("veni_creator", 1.6),
}
# novena: sempre Veni Sancte Spiritus
for d in range(19, 28):
    TRILHAS[f"{d}-10_06h30_reel_novena-sao-judas-dia-{d - 18}"] = ("veni_sancte", 3.8)

CREDITO = {
 "ut_queant": "Ut queant laxis (hino de São João Batista), canto gregoriano. Domínio público, via Wikimedia Commons.",
 "ubi_caritas": "Ubi caritas, canto gregoriano. CC BY-SA 3.0, via Wikimedia Commons.",
 "veni_creator": "Veni Creator Spiritus, canto gregoriano. Domínio público, via Wikimedia Commons.",
 "kyrie": "Kyrie eleison, Schola Gregoriana. CC BY-SA 3.0, via Wikimedia Commons.",
 "salve_regina": "Salve Regina, Les Petits Chanteurs de Passy. CC BY-SA 3.0, via Wikimedia Commons.",
 "ave_maria": "Ave Maria, Schola Gregoriana. CC BY-SA 3.0, via Wikimedia Commons.",
 "veni_sancte": "Veni Sancte Spiritus, canto gregoriano. Domínio público, via Wikimedia Commons.",
}
