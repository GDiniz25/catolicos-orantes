/**
 * Imagens dos artigos a partir de arte sacra em domínio público no Wikimedia Commons.
 * Aqui ficam: as regras que transformam o título do artigo em buscas e a consulta ao Commons.
 */

export const UA = 'CatolicosOrantes/1.0 (https://catolicosorantes.com.br; contato@catolicosorantes.com.br)';
const API = 'https://commons.wikimedia.org/w/api.php';

export const norm = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, "'");

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Assunto do artigo: o que vem antes dos dois-pontos, sem "Novena a", "Ladainha de" etc. */
export function assunto(titulo) {
  let s = (titulo || '').split(/[:?]/)[0].trim();
  s = s.replace(/^(novena|ladainha|oração|oracao|consagração|consagracao|tríduo|triduo|terço|terco)\s+(a|ao|à|aos|às|de|do|da|dos|das)\s+/i, '');
  return s.trim();
}

/** Nomes que aparecem nos títulos → busca em inglês/latim, como os arquivos costumam estar no Commons */
const DICIONARIO = [
  [/preciosissimo sangue/, ['Precious Blood of Christ painting', 'Crucifixion painting']],
  [/maos ensanguentadas/, ['Wounds of Christ painting', 'Crucifixion painting']],
  [/santa barbara/, ['Saint Barbara painting']],
  [/catarina de alexandria/, ['Catherine of Alexandria painting']],
  [/edith stein|teresa benedita da cruz/, ['Edith Stein']],
  [/santa ines/, ['Saint Agnes painting']],
  [/ambrosio/, ['Saint Ambrose painting']],
  [/santo andre/, ['Saint Andrew painting']],
  [/atanasio/, ['Athanasius of Alexandria icon']],
  [/toribio/, ['Toribio de Mogrovejo']],
  [/martires do brasil|cunhau|urucu/, ['Martyrs of Natal Brazil', 'martyrdom painting']],
  [/bartolomeu/, ['Saint Bartholomew painting']],
  [/basilio/, ['Basil the Great icon']],
  [/camilo de lelis/, ['Camillus de Lellis painting']],
  [/cosme|damiao/, ['Saints Cosmas and Damian painting']],
  [/felipe apostolo|filipe apostolo/, ['Saint Philip the Apostle painting']],
  [/filipe neri/, ['Philip Neri painting']],
  [/francisco de sales/, ['Francis de Sales painting']],
  [/crisostomo/, ['John Chrysostom icon']],
  [/joao de deus/, ['John of God painting']],
  [/martin de porres|martinho de porres|martinho de lima/, ['Martin de Porres painting']],
  [/oscar romero/, ['Óscar Romero']],
  [/roberto belarmino/, ['Robert Bellarmine painting']],
  [/tiago maior|sao tiago/, ['Saint James the Greater painting']],
  [/^sao paulo$|sao paulo apostolo|apostolo paulo|conversao de sao paulo/, ['Conversion of Saint Paul painting', 'Saint Paul painting']],
  [/jose de anchieta/, ['José de Anchieta']],
  [/josemaria/, ['Josemaría Escrivá']],
  [/sao jose|sao jose|^jose\b/, ['Saint Joseph Christ Child painting', 'Saint Joseph painting']],
  [/teresinha|teresa de lisieux|menino jesus e da sagrada face/, ['Thérèse of Lisieux photograph', 'Thérèse de Lisieux']],
  [/teresa de avila|teresa de jesus/, ['Teresa of Ávila painting']],
  [/teresa de calcuta/, ['Mother Teresa']],
  [/francisco de assis/, ['Saint Francis of Assisi painting']],
  [/francisco xavier/, ['Francis Xavier painting']],
  [/agostinho/, ['Saint Augustine painting']],
  [/monica/, ['Saint Monica painting']],
  [/tomas de aquino/, ['Thomas Aquinas painting']],
  [/rita de cassia|santa rita/, ['Saint Rita of Cascia painting']],
  [/sao bento|bento de nursia|medalha de sao bento/, ['Saint Benedict of Nursia painting']],
  [/joao paulo ii/, ['Pope John Paul II']],
  [/joao xxiii/, ['Pope John XXIII']],
  [/paulo vi/, ['Pope Paul VI']],
  [/pio x\b/, ['Pope Pius X']],
  [/carlo acutis/, ['Carlo Acutis']],
  [/faustina/, ['Faustina Kowalska']],
  [/padre pio|pio de pietrelcina/, ['Padre Pio']],
  [/miguel arcanjo/, ['Saint Michael archangel painting Guido Reni', 'Saint Michael archangel painting']],
  [/gabriel arcanjo/, ['Archangel Gabriel painting']],
  [/rafael arcanjo/, ['Raphael archangel Tobias painting']],
  [/anjo da guarda|anjos/, ['Guardian angel painting']],
  [/antonio de padua|santo antonio/, ['Saint Anthony of Padua painting']],
  [/inacio de loyola/, ['Ignatius of Loyola painting']],
  [/domingos de gusmao|sao domingos/, ['Saint Dominic painting']],
  [/clara de assis|santa clara/, ['Saint Clare of Assisi painting']],
  [/catarina de sena/, ['Catherine of Siena painting']],
  [/joana d'?arc/, ['Joan of Arc painting']],
  [/joao batista/, ['John the Baptist painting']],
  [/joao evangelista|apostolo joao/, ['John the Evangelist painting']],
  [/judas tadeu/, ['Saint Jude Thaddeus painting']],
  [/expedito/, ['Saint Expeditus painting']],
  [/sao jorge/, ['Saint George and the Dragon painting']],
  [/sebastiao/, ['Saint Sebastian painting']],
  [/luzia/, ['Saint Lucy painting']],
  [/cecilia/, ['Saint Cecilia painting']],
  [/ana e joaquim|sant'?ana|santa ana/, ['Saint Anne painting']],
  [/cristovao/, ['Saint Christopher painting']],
  [/vicente de paulo/, ['Vincent de Paul painting']],
  [/joao bosco|dom bosco/, ['John Bosco photograph']],
  [/luis gonzaga/, ['Aloysius Gonzaga painting']],
  [/maximiliano kolbe/, ['Maximilian Kolbe']],
  [/gianna/, ['Gianna Beretta Molla']],
  [/frei galvao/, ['Frei Galvão']],
  [/nha chica/, ['Nhá Chica']],
  [/irma dulce|dulce dos pobres/, ['Irmã Dulce']],
  [/madre paulina/, ['Madre Paulina']],
  [/abraao/, ['Abraham painting']],
  [/moises/, ['Moses painting']],
  [/rei davi|\bdavi\b/, ['King David painting']],
  [/elias/, ['Elijah prophet painting']],
  [/maria madalena/, ['Mary Magdalene painting']],
  [/estevao/, ['Saint Stephen painting']],
  [/bernadete/, ['Bernadette Soubirous photograph']],
  [/vianney|cura d'?ars/, ['Jean-Marie Vianney']],
  [/afonso.*ligorio/, ['Alphonsus Liguori painting']],
  [/filomena/, ['Saint Philomena painting']],
  [/margarida maria/, ['Margaret Mary Alacoque painting']],
  [/edwiges/, ['Saint Hedwig of Silesia']],
  [/benedito/, ['Benedict the Moor']],
  [/rosa de lima/, ['Rose of Lima painting']],
  [/juan diego/, ['Juan Diego']],
  [/carlos borromeu/, ['Charles Borromeo painting']],
  [/sao pedro|apostolo pedro/, ['Saint Peter painting']],
  [/sao lucas/, ['Saint Luke painting']],
  [/sao marcos/, ['Saint Mark painting']],
  [/sao mateus/, ['Calling of Saint Matthew Caravaggio']],
  [/sao tome/, ['Incredulity of Saint Thomas Caravaggio']],
  [/sao jeronimo/, ['Saint Jerome painting']],
  [/sao bernardo/, ['Bernard of Clairvaux painting']],
  [/sao boaventura/, ['Bonaventure painting']],
  [/sao patricio/, ['Saint Patrick']],
  [/sao valentim/, ['Saint Valentine']],
  [/sao cipriano/, ['Saint Cyprian']],
  [/sao bras/, ['Saint Blaise painting']],
  [/sao roque/, ['Saint Roch painting']],
  [/sao lourenco/, ['Saint Lawrence painting']],
  [/sao martinho/, ['Saint Martin and the Beggar painting']],
  [/nicolau/, ['Saint Nicholas painting']],
  [/escolastica/, ['Saint Scholastica painting']],
  [/gertrudes/, ['Saint Gertrude painting']],
  [/brigida/, ['Bridget of Sweden painting']],
  [/hildegarda/, ['Hildegard of Bingen']],
];

/** Temas (Nossa Senhora, Cristo, sacramentos, liturgia) → buscas */
const TEMAS = [
  [/temperament/, ['Four Temperaments painting', 'Four Temperaments engraving']],
  [/niceia|in unitate fidei/, ['First Council of Nicaea icon', 'Council of Nicaea painting']],
  [/nome leao|escolheu o nome/, ['Pope Leo XIII', 'Rerum novarum']],
  [/dilexi/, ['Saint Lawrence distributing alms painting', 'Works of Mercy painting']],
  [/leao xiv|magnifica humanitas/, ['Saint Peter enthroned painting', "Saint Peter's Basilica painting"]],
  [/sobre a morte/, ['Death of Saint Joseph painting', 'Last Judgment painting']],
  [/crucifixo/, ['Crucifixion painting Velázquez', 'Crucifixion painting']],
  [/terco precisa/, ['Madonna of the Rosary painting', 'rosary painting']],
  [/benzer|bencaos/, ['Christ blessing the children painting', 'Christ blessing painting']],
  [/sacramentais|medalhas/, ['Saint Benedict of Nursia painting', 'Madonna of the Rosary painting']],
  [/liturgia da palavra/, ['Christ reading in the synagogue painting', 'Saint Jerome writing painting']],
  [/virtude da (fe|esperanca|caridade)/, ['Theological Virtues Raphael', 'Charity painting allegory']],
  [/prudencia|justica|fortaleza|temperanca/, ['Cardinal Virtues Raphael', 'Virtues allegory painting']],
  [/soberba|avareza|luxuria|\bira\b|gula|inveja|preguica|acedia|acidia/, ['Seven Deadly Sins Bosch', 'Seven Deadly Sins painting']],
  [/luto|falecid|cremacao|exequias|setimo dia/, ['Lamentation of Christ painting', 'Entombment of Christ painting', 'Pieta painting']],
  [/namoro|noivado|outra religiao/, ['Tobias and Sarah painting', 'Marriage of the Virgin Raphael']],
  [/vocacao|vida consagrada/, ['Calling of Saint Matthew Caravaggio', 'nuns praying painting']],
  [/vestes liturgicas|objetos da missa|objetos liturgicos|gestos na missa/, ['Mass of Saint Gregory painting', 'priest celebrating Mass painting']],
  [/criancas|filhos|adolescentes|igreja domestica|oracao em familia/, ['Holy Family painting', 'children praying painting']],
  [/ansiedade|paz interior/, ['Christ calming the storm painting']],
  [/viajar|viagem/, ['Tobias and the Angel painting']],
  [/emprego|trabalho/, ['Saint Joseph the carpenter painting']],
  [/casa nova/, ['House of Nazareth painting', 'Holy Family painting']],
  [/gratidao/, ['Healing of the ten lepers painting']],
  [/aparecida/, ['Nossa Senhora Aparecida', 'Our Lady of Aparecida']],
  [/fatima/, ['Our Lady of Fátima', 'Fátima 1917']],
  [/lourdes/, ['Our Lady of Lourdes', 'Lourdes grotto apparition']],
  [/guadalupe/, ['Virgin of Guadalupe']],
  [/desatadora/, ['Maria Knotenlöserin Schmidtner', 'Mary Untier of Knots']],
  [/medalha milagrosa/, ['Miraculous Medal Catherine Labouré']],
  [/carmo|escapulario/, ['Our Lady of Mount Carmel painting']],
  [/imaculada conceicao|imaculado coracao|imaculada/, ['Immaculate Conception Murillo', 'Immaculate Conception painting']],
  [/assuncao/, ['Assumption of the Virgin painting']],
  [/sete dores|dolorosa|nossa senhora das dores/, ['Mater Dolorosa painting']],
  [/perpetuo socorro/, ['Our Lady of Perpetual Help icon']],
  [/montfort/, ['Louis de Montfort']],
  [/aparicoes/, ['Marian apparition painting']],
  [/angelus/, ['The Angelus Millet']],
  [/ave maria|anunciacao|saudacao angelica/, ['Annunciation painting']],
  [/visitacao|magnificat/, ['Visitation painting']],
  [/salve rainha|rainha|coroacao/, ['Coronation of the Virgin painting']],
  [/misterios gozosos/, ['Nativity painting']],
  [/misterios dolorosos|agonia/, ['Agony in the Garden painting']],
  [/misterios gloriosos/, ['Resurrection of Christ painting']],
  [/misterios luminosos|transfiguracao/, ['Transfiguration painting Raphael', 'Transfiguration painting']],
  [/rosario|terco|coroa/, ['Madonna of the Rosary painting', 'Madonna of the Rosary Caravaggio']],
  [/pai nosso/, ['Sermon on the Mount Carl Bloch', 'Sermon on the Mount painting']],
  [/sagrado coracao/, ['Sacred Heart of Jesus Batoni', 'Sacred Heart of Jesus painting']],
  [/divina misericordia|misericordia/, ['Divine Mercy Kazimirowski', 'Return of the Prodigal Son Rembrandt']],
  [/cristo rei/, ['Christ Pantocrator icon']],
  [/trindade/, ['Holy Trinity painting']],
  [/espirito santo|pentecostes|crisma|confirmacao|dons do espirito/, ['Pentecost painting']],
  [/via sacra|via-sacra/, ['Stations of the Cross painting', 'Christ carrying the cross painting']],
  [/paixao|sexta-feira santa|crucifixao|cruz/, ['Crucifixion painting Velázquez', 'Crucifixion painting']],
  [/triduo pascal|semana santa|ramos/, ['Entry into Jerusalem painting']],
  [/ressurreicao|pascoa/, ['Resurrection of Christ painting']],
  [/natal|nascimento de jesus|presepio/, ['Nativity painting']],
  [/epifania|reis magos/, ['Adoration of the Magi painting']],
  [/quaresma|cinzas|jejum|abstinencia/, ['Christ in the Wilderness Kramskoi']],
  [/advento/, ['Annunciation painting']],
  [/ascensao/, ['Ascension of Christ painting']],
  [/primeira comunhao/, ['First Communion painting']],
  [/uncao/, ['Poussin Extreme Unction']],
  [/confiss|confess|reconcilia|penitencia|contricao|pecado|exame de consciencia|indulgencia/, ['Return of the Prodigal Son Rembrandt', 'Poussin Penance']],
  [/ordem|sacerdot|vocacao|diacono|padre|presbiter/, ['Delivery of the Keys Perugino', 'Poussin Ordination']],
  [/matrimonio|casamento|noivo|namoro|familia/, ['Marriage of the Virgin Raphael', 'Wedding at Cana painting']],
  [/batismo de jesus|batismo do senhor/, ['Baptism of Christ painting']],
  [/batismo|padrinhos|batizar/, ['Baptism of Christ painting', 'Poussin Baptism']],
  [/todos os santos|comunhao dos santos/, ['All Saints painting']],
  [/lanciano/, ['Lanciano eucharistic miracle']],
  [/bolsena|orvieto/, ['Mass of Bolsena Raphael']],
  [/milagre eucaristico|milagres eucaristicos/, ['Mass of Bolsena Raphael', 'Mass of Saint Gregory painting']],
  [/eucaristia|\bmissa\b|comunhao|comung|ultima ceia|santissimo|adoracao|transubstancia|corpus christi|hostia|sacrario/, ['Last Supper painting', 'Institution of the Eucharist painting']],
  [/purgatorio/, ['Purgatory painting']],
  [/inferno|juizo final|novissimos|ceu|morte|finados/, ['Last Judgment painting']],
  [/criacao|adao/, ['Creation of Adam Michelangelo']],
  [/biblia|escritura|palavra de deus|revelacao|dei verbum|lectio/, ['Saint Jerome writing painting', 'Saint Jerome Caravaggio']],
  [/papa|infalibilidade|sucessao apostolica|igreja catolica|magisterio/, ['Delivery of the Keys Perugino']],
  [/concilio/, ['Council of Trent painting']],
  [/imagens|veneracao|icone/, ['Saint Luke painting the Virgin']],
  [/laudes|vesperas|completas|liturgia das horas|hora media|oficio/, ['Book of Hours illumination', 'monks choir painting']],
];

const PADRAO_CATEGORIA = {
  'como-rezar-o-terco': ['Madonna of the Rosary painting'],
  'santos-e-oracoes': [],
  'milagres-eucaristicos': ['Mass of Bolsena Raphael'],
  catecismo: ['Christ teaching painting'],
  'liturgia-das-horas': ['Book of Hours illumination'],
  novenas: ['Praying Hands Dürer'],
  sacramentos: ['Poussin Seven Sacraments'],
  'devocoes-marianas': ['Madonna painting Murillo'],
  'calendario-liturgico': ['Book of Hours calendar illumination'],
  'exame-de-consciencia': ['Return of the Prodigal Son Rembrandt'],
  'oracoes-do-dia-a-dia': ['Praying Hands Dürer'],
  'documentos-da-igreja': ['Saint Peter enthroned painting'],
  ladainhas: ['Praying Hands Dürer'],
  'duvidas-da-fe': ['Christ teaching painting'],
  'vida-espiritual': ['Saint in prayer painting'],
  'primeiros-passos': ['Return of the Prodigal Son Rembrandt'],
  casamento: ['Marriage of the Virgin painting', 'Wedding at Cana painting'],
};

/** Outras buscas para temas muito usados: aumentam o número de pinturas diferentes */
const VARIANTES = {
  'Return of the Prodigal Son Rembrandt': ['Return of the Prodigal Son painting', 'Prodigal Son Murillo', 'Penitent Magdalene painting', 'Tears of Saint Peter painting', 'Repentance of Saint Peter painting'],
  'Christ teaching painting': ['Christ among the Doctors painting', 'Sermon on the Mount painting', 'Christ and the disciples painting', 'Christ blessing painting', 'Jesus teaching in the temple painting'],
  'Last Supper painting': ['Institution of the Eucharist painting', 'Communion of the Apostles painting', 'Supper at Emmaus painting', 'Adoration of the Eucharist painting'],
  'Saint Peter enthroned painting': ['Pope portrait painting', 'Council of Trent painting', 'Saint Peter painting', 'Doctors of the Church painting'],
  'Delivery of the Keys Perugino': ['Christ giving the keys to Saint Peter painting', 'Saint Peter painting', 'Pentecost painting'],
  'Praying Hands Dürer': ['woman praying painting', 'man praying painting', 'prayer painting 19th century', 'Angelus Millet'],
  'Mass of Bolsena Raphael': ['Mass of Saint Gregory painting', 'Miracle of the Host painting', 'Eucharistic adoration painting', 'monstrance painting'],
  'Madonna of the Rosary painting': ['Our Lady of the Rosary painting', 'Virgin of the Rosary Murillo', 'rosary painting'],
  'Book of Hours illumination': ['monks choir painting', 'monks praying painting', 'breviary illumination'],
  'Christ in the Wilderness Kramskoi': ['Temptation of Christ painting', 'Christ in the desert painting'],
  'Poussin Seven Sacraments': ['sacrament painting', 'Baptism of Christ painting', 'Communion of the Apostles painting'],
};

/** Lista de buscas para um artigo, da mais específica para a mais geral (sem repetir) */
export function buscasPara(artigo) {
  const t = norm(artigo.title);
  const a = norm(assunto(artigo.title));
  const out = [];
  const add = (qs) => qs.forEach((q) => !out.includes(q) && out.push(q));
  // 1) nome de santo no assunto (ou no título)
  for (const [re, qs] of DICIONARIO) if (re.test(a)) { add(qs); break; }
  if (!out.length) for (const [re, qs] of DICIONARIO) if (re.test(t)) { add(qs); break; }
  // 2) tema
  for (const [re, qs] of TEMAS) if (re.test(a) || re.test(t)) { add(qs); break; }
  // 3) assunto literal (útil para santos fora do dicionário)
  if (['santos-e-oracoes', 'novenas', 'ladainhas', 'devocoes-marianas'].includes(artigo.category)) add([`${assunto(artigo.title)} painting`]);
  // 4) padrão da categoria
  add(PADRAO_CATEGORIA[artigo.category] || []);
  // variantes dos temas genéricos, para não faltar pintura diferente
  for (const q of [...out]) if (VARIANTES[q]) add(VARIANTES[q]);
  return out.slice(0, 7);
}

const limpa = (html) =>
  (html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const RUIM = /\b(stamp|selo|coin|moeda|map|logo|signature|seal|banknote|postage|diagram|coat of arms|brasao|svg)\b/i;

/** Busca no Commons e devolve só imagens em domínio público (PD ou CC0), grandes o bastante */
export async function buscarCommons(q, limite = 50) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    generator: 'search',
    gsrnamespace: '6',
    gsrsearch: `${q} filetype:bitmap`,
    gsrlimit: String(limite),
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: '1280',
    iiextmetadatafilter: 'LicenseShortName|License|Artist|ObjectName|DateTimeOriginal|ImageDescription',
  });
  for (let tentativa = 0; tentativa < 4; tentativa++) {
    const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } });
    if (res.status === 429 || res.status >= 500) {
      await sleep(2000 * (tentativa + 1));
      continue;
    }
    if (!res.ok) throw new Error(`Commons respondeu ${res.status}`);
    const json = await res.json();
    const pages = json?.query?.pages ?? [];
    return pages
      .sort((x, y) => (x.index ?? 0) - (y.index ?? 0))
      .map((p) => {
        const ii = p.imageinfo?.[0];
        if (!ii) return null;
        const md = ii.extmetadata || {};
        const lic = `${md.LicenseShortName?.value || ''} ${md.License?.value || ''}`;
        const dominioPublico = /public domain|^\s*pd\b|\bpd-|\bpdm\b|cc0|cc-zero/i.test(lic);
        if (!dominioPublico) return null;
        if (!/image\/(jpeg|png|tiff)/.test(ii.mime)) return null;
        if (ii.width < 1000 || ii.height < 650) return null;
        const r = ii.width / ii.height;
        if (r < 0.55 || r > 2.4) return null;
        const titulo = p.title.replace(/^File:/, '');
        if (RUIM.test(titulo)) return null;
        return {
          arquivo: titulo,
          pagina: ii.descriptionurl,
          url: ii.thumburl || ii.url,
          miniatura: (ii.thumburl || ii.url).replace(/\/1280px-/, '/500px-'),
          largura: ii.width,
          altura: ii.height,
          artista: limpa(md.Artist?.value).slice(0, 120),
          obra: limpa(md.ObjectName?.value).slice(0, 160),
          data: limpa(md.DateTimeOriginal?.value).slice(0, 40),
          licenca: limpa(md.LicenseShortName?.value) || 'Domínio público',
          busca: q,
        };
      })
      .filter(Boolean);
  }
  return [];
}

/** Texto de crédito exibido abaixo da imagem */
/** Tira os marcadores do Wikidata (label QS:..., title QS:..., date QS:...) que vêm no texto do Commons */
const semWikidata = (t = '') =>
  t
    .replace(/\s*(title|label) QS:[^,]+,([a-z-]+:)?("[^"]*"|"[^",]*)/g, '')
    .replace(/\s*date QS:.*$/, '')
    .replace(/\s*(title|label) QS:[A-Za-z0-9]*,?/g, '')
    .replace(/^(English|French|German|Swedish|Dutch|Italian|Spanish|Polish|Portuguese|Latin|Czech|Catalan): /, '')
    .replace(/\s+/g, ' ')
    .trim();

export function credito(c) {
  const partes = [semWikidata(c.obra) || c.arquivo.replace(/\.[a-z]+$/i, ''), semWikidata(c.artista), semWikidata(c.data)].filter(Boolean);
  if (c.licenca && !/dom[ií]nio p[uú]blico|public domain|^\s*pd\b|\bpd-|\bpdm\b|cc0|cc-zero/i.test(c.licenca)) {
    const titulo = semWikidata(c.obra) || c.arquivo.replace(/\.[a-z]+$/i, '');
    const autor = semWikidata(c.artista) || 'autor no Wikimedia Commons';
    return `${titulo}. Foto: ${autor}, licença ${c.licenca}, via Wikimedia Commons.`;
  }
  return `${partes.join(', ')}. Domínio público, via Wikimedia Commons.`;
}

/** Texto alternativo em português, ligado ao assunto do artigo */
export function textoAlt(artigo, c) {
  const a = assunto(artigo.title);
  const artista = semWikidata(c.artista).replace(/(Unknown author|Unknown|Anonymous)/gi, '').trim();
  return artista ? `${a} em obra de ${artista}` : `${a}, arte sacra em domínio público`;
}


export async function infoCommons(titulo) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', formatversion: '2', titles: titulo, prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1600',
    iiextmetadatafilter: 'LicenseShortName|License|Artist|ObjectName|DateTimeOriginal',
  });
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers: { 'User-Agent': UA } });
  const p = (await res.json())?.query?.pages?.[0];
  const ii = p?.imageinfo?.[0];
  if (!ii) throw new Error('arquivo não encontrado no Commons');
  const md = ii.extmetadata || {};
  const lic = `${md.LicenseShortName?.value || ''} ${md.License?.value || ''}`;
  const dominioPublico = /public domain|^\s*pd\b|\bpd-|\bpdm\b|cc0|cc-zero/i.test(lic);
  // Fotos reais (relíquias, santuários) costumam ser CC BY ou CC BY-SA: aceitas, com autor e licença no crédito.
  // Nunca NC (uso não comercial) nem ND (sem derivadas).
  const livreComAtribuicao = /\bcc[- ]by(-sa)?[- ]\d/i.test(lic) && !/\b(nc|nd)\b/i.test(lic);
  if (!dominioPublico && !livreComAtribuicao) throw new Error(`licença não permitida (${md.LicenseShortName?.value || 'desconhecida'})`);
  return {
    licenca: dominioPublico ? '' : limpa(md.LicenseShortName?.value),
    arquivo: p.title.replace(/^File:/, ''),
    url: ii.thumburl || ii.url,
    artista: limpa(md.Artist?.value).slice(0, 120),
    obra: limpa(md.ObjectName?.value).slice(0, 160),
    data: limpa(md.DateTimeOriginal?.value).slice(0, 40),
  };
}


/**
 * Baixa a pintura do Commons, envia para article-images/arte/<nome>.jpg e apaga as versões
 * menores antigas (-q60-*.webp), para o imagens:variantes gerar de novo a partir da pintura nova.
 * Devolve a URL pública com ?v= para furar o cache.
 */
export async function enviarPintura(db, info, nome) {
  const BUCKET = 'article-images';
  const res = await fetch(info.url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  let tipo = res.headers.get('content-type') || 'image/jpeg';
  let buf = Buffer.from(await res.arrayBuffer());
  // PNG grande passa do limite de 5 MB do bucket: converte para JPEG (fundo branco se tiver transparência)
  if (tipo.includes('png') || buf.length > 4_500_000) {
    const { default: sharp } = await import('sharp');
    buf = await sharp(buf).flatten({ background: '#ffffff' }).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
    tipo = 'image/jpeg';
  }
  const ext = tipo.includes('png') ? 'png' : 'jpg';
  const caminho = `arte/${nome}.${ext}`;
  const up = await db.storage.from(BUCKET).upload(caminho, buf, { contentType: tipo, upsert: true, cacheControl: '31536000' });
  if (up.error) throw new Error(`upload: ${up.error.message}`);
  const velhas = ['240', '480', '640', '960'].map((w) => `arte/${nome}-q60-${w}.webp`);
  await db.storage.from(BUCKET).remove(velhas);
  return `${db.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl}?v=${Date.now().toString(36)}`;
}
