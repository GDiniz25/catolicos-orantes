// Grava em image_focus os focos revisados à mão (aplicar.json: [[url, foco], ...]) com metodo = 'manual'.
import fs from 'node:fs';
const URL = process.env.SB_URL, KEY = process.env.SB_SERVICE;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' };
const linhas = JSON.parse(fs.readFileSync('aplicar.json', 'utf8'));
let ok = 0, erro = 0;
for (const [url, foco] of linhas) {
  const r = await fetch(`${URL}/rest/v1/image_focus?url=eq.${encodeURIComponent(url)}`, { method: 'PATCH', headers: H, body: JSON.stringify({ foco, metodo: 'manual' }) });
  if (r.ok) ok++; else { erro++; console.log(url, r.status, await r.text()); }
  await new Promise((s) => setTimeout(s, 40));
}
console.log(`${ok} gravados, ${erro} erros`);
