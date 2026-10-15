/*!
 * Quadro "Liturgia de hoje" do Católicos Orantes (https://catolicosorantes.com.br/liturgia-para-sites)
 * Uso: <div data-co-liturgia><a href="https://catolicosorantes.com.br/liturgia-diaria">Liturgia diária de hoje</a> por <a href="https://catolicosorantes.com.br/">Católicos Orantes</a></div>
 *      <script src="https://catolicosorantes.com.br/widget/liturgia.js" async></script>
 * Opcional: data-tema="escuro". Sem dependências. Se algo falhar, o conteúdo original (os links) continua.
 */
(function () {
  'use strict';
  if (window.__coLiturgia) return;
  window.__coLiturgia = true;
  if (!window.fetch || !document.querySelectorAll) return;

  var SITE = 'https://catolicosorantes.com.br';
  var DADOS = SITE + '/widget/hoje.json';
  var LITURGIA = SITE + '/liturgia-diaria';

  var CSS =
    '.co-wl{box-sizing:border-box;display:block;width:100%;max-width:560px;margin:0;padding:18px 20px;border:1px solid #E4D9C8;border-radius:12px;background:#FFFDF9;color:#2F2A29;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;font-size:15px;line-height:1.5;text-align:left;overflow-wrap:break-word;word-wrap:break-word}' +
    '.co-wl *{box-sizing:border-box}' +
    '.co-wl .co-wl-rotulo{display:block;margin:0;padding:0;color:#99492A;font-size:13px;font-weight:700;letter-spacing:.02em;line-height:1.3}' +
    '.co-wl .co-wl-data{display:block;margin:2px 0 0;padding:0;color:#6B5F59;font-size:14px;line-height:1.4}' +
    '.co-wl .co-wl-celebracao{display:flex;align-items:flex-start;gap:10px;margin:12px 0 0;padding:0;color:#2F2A29;font-family:Georgia,"Times New Roman",serif;font-size:19px;font-weight:600;line-height:1.3}' +
    '.co-wl .co-wl-cor{display:inline-block;flex:0 0 auto;width:12px;height:12px;margin-top:.38em;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(0,0,0,.18)}' +
    '.co-wl .co-wl-cor-nome{display:block;margin:2px 0 0 22px;padding:0;color:#6B5F59;font-size:13px;line-height:1.4}' +
    '.co-wl .co-wl-lista{margin:14px 0 0;padding:12px 0 0;border-top:1px solid #EDE4D6}' +
    '.co-wl .co-wl-item{margin:0 0 10px;padding:0}' +
    '.co-wl .co-wl-item:last-child{margin-bottom:0}' +
    '.co-wl .co-wl-titulo{display:block;margin:0;padding:0;color:#6B5F59;font-size:13px;font-weight:600;line-height:1.4}' +
    '.co-wl .co-wl-valor{display:block;margin:1px 0 0;padding:0;color:#2F2A29;font-size:15px;line-height:1.5}' +
    '.co-wl .co-wl-refs{margin:1px 0 0;padding:0;list-style:none}' +
    '.co-wl .co-wl-refs li{margin:0;padding:0;list-style:none;color:#2F2A29;font-size:15px;line-height:1.5;background:none}' +
    '.co-wl .co-wl-refs li:before,.co-wl .co-wl-refs li:after{content:none}' +
    '.co-wl a{color:#99492A;text-decoration:underline;text-underline-offset:3px;font-weight:600;background:none;border:0;box-shadow:none}' +
    '.co-wl a:hover{text-decoration:none}' +
    '.co-wl a:focus-visible{outline:2px solid #99492A;outline-offset:2px;border-radius:2px}' +
    '.co-wl .co-wl-link{display:block;margin:14px 0 0;padding:10px 12px;border-radius:8px;background:#99492A;color:#FFFFFF;text-align:center;text-decoration:none;font-size:15px;line-height:1.35}' +
    '.co-wl .co-wl-link:hover{background:#B35A38;color:#FFFFFF;text-decoration:none}' +
    '.co-wl .co-wl-link:focus-visible{outline-color:#2F2A29}' +
    '.co-wl.co-wl-escuro{border-color:#3B3431;background:#1F1B1A;color:#F2EBE3}' +
    '.co-wl.co-wl-escuro .co-wl-rotulo{color:#E8A27F}' +
    '.co-wl.co-wl-escuro .co-wl-data,.co-wl.co-wl-escuro .co-wl-cor-nome,.co-wl.co-wl-escuro .co-wl-titulo{color:#BDB0A6}' +
    '.co-wl.co-wl-escuro .co-wl-celebracao,.co-wl.co-wl-escuro .co-wl-valor,.co-wl.co-wl-escuro .co-wl-refs li{color:#F2EBE3}' +
    '.co-wl.co-wl-escuro .co-wl-lista{border-top-color:#3B3431}' +
    '.co-wl.co-wl-escuro .co-wl-cor{box-shadow:inset 0 0 0 1px rgba(255,255,255,.25)}' +
    '.co-wl.co-wl-escuro a{color:#E8A27F}' +
    '.co-wl.co-wl-escuro a:focus-visible{outline-color:#E8A27F}' +
    '.co-wl.co-wl-escuro .co-wl-link{background:#E8A27F;color:#1F1B1A}' +
    '.co-wl.co-wl-escuro .co-wl-link:hover{background:#F0B697;color:#1F1B1A}' +
    '@media (max-width:360px){.co-wl{padding:14px 14px}.co-wl .co-wl-celebracao{font-size:17px}}';

  function estilo() {
    if (document.getElementById('co-wl-estilo')) return;
    var s = document.createElement('style');
    s.id = 'co-wl-estilo';
    s.appendChild(document.createTextNode(CSS));
    (document.head || document.documentElement).appendChild(s);
  }

  function el(tag, classe, texto) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto != null) e.appendChild(document.createTextNode(String(texto)));
    return e;
  }

  // Só aceita links do próprio Católicos Orantes
  function linkSeguro(u, padrao) {
    return typeof u === 'string' && u.indexOf(SITE + '/') === 0 ? u : padrao;
  }

  function maiuscula(t) {
    t = String(t || '');
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  function hexSeguro(h) {
    return typeof h === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(h) ? h : '#3F7A50';
  }

  function item(lista, titulo, conteudo) {
    var d = el('div', 'co-wl-item');
    d.appendChild(el('p', 'co-wl-titulo', titulo));
    d.appendChild(conteudo);
    lista.appendChild(d);
  }

  function cartao(dados, escuro) {
    var raiz = el('section', 'co-wl' + (escuro ? ' co-wl-escuro' : ''));
    raiz.setAttribute('aria-label', 'Liturgia de hoje');
    raiz.setAttribute('lang', 'pt-BR');

    raiz.appendChild(el('p', 'co-wl-rotulo', 'Liturgia de hoje'));
    if (dados.dataExtenso) raiz.appendChild(el('p', 'co-wl-data', maiuscula(dados.dataExtenso)));

    if (dados.celebracao) {
      var cel = el('p', 'co-wl-celebracao');
      var bola = el('span', 'co-wl-cor');
      bola.style.background = hexSeguro(dados.cor && dados.cor.hex);
      bola.setAttribute('aria-hidden', 'true');
      cel.appendChild(bola);
      cel.appendChild(el('span', null, dados.celebracao));
      raiz.appendChild(cel);
      if (dados.cor && dados.cor.nome) raiz.appendChild(el('p', 'co-wl-cor-nome', 'Cor litúrgica ' + dados.cor.nome));
    }

    var lista = el('div', 'co-wl-lista');
    var ev = dados.evangelho || null;
    var leituras = [];
    var todas = Object.prototype.toString.call(dados.leituras) === '[object Array]' ? dados.leituras : [];
    for (var i = 0; i < todas.length; i++) if (todas[i] && todas[i] !== ev) leituras.push(todas[i]);

    if (leituras.length) {
      var ul = el('ul', 'co-wl-refs');
      for (var j = 0; j < leituras.length; j++) ul.appendChild(el('li', null, leituras[j]));
      item(lista, leituras.length > 1 ? 'Leituras' : 'Leitura', ul);
    }
    if (ev) item(lista, 'Evangelho', el('p', 'co-wl-valor', ev));
    if (dados.santo && dados.santo.nome) {
      var p = el('p', 'co-wl-valor');
      var urlSanto = linkSeguro(dados.santo.url, null);
      if (urlSanto) {
        var a = el('a', null, dados.santo.nome);
        a.href = urlSanto;
        p.appendChild(a);
      } else {
        p.appendChild(document.createTextNode(dados.santo.nome));
      }
      item(lista, 'Santo do dia', p);
    }
    if (lista.firstChild) raiz.appendChild(lista);

    var link = el('a', 'co-wl-link', 'Leituras completas no Católicos Orantes');
    link.href = linkSeguro(dados.url, LITURGIA);
    raiz.appendChild(link);
    return raiz;
  }

  function preencher(dados) {
    if (!dados || typeof dados !== 'object' || !dados.data) return;
    var alvos = document.querySelectorAll('[data-co-liturgia]');
    if (!alvos.length) return;
    estilo();
    for (var i = 0; i < alvos.length; i++) {
      var alvo = alvos[i];
      if (alvo.getAttribute('data-co-pronto') === '1') continue;
      var tema = (alvo.getAttribute('data-tema') || '').toLowerCase();
      var novo = cartao(dados, tema === 'escuro' || tema === 'dark');
      while (alvo.firstChild) alvo.removeChild(alvo.firstChild);
      alvo.appendChild(novo);
      alvo.setAttribute('data-co-pronto', '1');
    }
  }

  function iniciar() {
    if (!document.querySelector('[data-co-liturgia]')) return;
    fetch(DADOS, { credentials: 'omit' })
      .then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then(preencher)
      .catch(function () {
        /* mantém o conteúdo original do elemento (link em HTML) */
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
