/* Fusionne qbank/*.json dans questions.js avec validation et dédoublonnage. */
const fs = require('fs');
const path = require('path');
const ROOT = '/home/user/Generations';

const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, ' ').trim();

// banque d'origine figée (150 cartes) : la fusion est ainsi rejouable à l'identique
const base = JSON.parse(fs.readFileSync(path.join(ROOT, 'qbank', 'base.json'), 'utf8'));
const seen = new Set(base.map(q => norm(q.q)));

const GENSET = new Set(['BOOMER', 'X', 'Y', 'Z', 'ALPHA']);
const THEMES = ['objets', 'tele', 'musique', 'cinema', 'jeuxvideo', 'technologie', 'pubs', 'mode', 'evenements', 'langage'];

const merged = [...base];
const report = {};
const rejects = [];

for (const t of THEMES) {
  const f = path.join(ROOT, 'qbank', t + '.json');
  if (!fs.existsSync(f)) { report[t] = 'FICHIER MANQUANT'; continue; }
  let arr;
  try { arr = JSON.parse(fs.readFileSync(f, 'utf8')); }
  catch (e) { report[t] = 'JSON INVALIDE: ' + e.message.slice(0, 80); continue; }
  let ok = 0, bad = 0, dup = 0;
  for (const q of arr) {
    const reasons = [];
    if (q.t !== t) reasons.push('slug');
    if (!GENSET.has(q.g)) reasons.push('gen');
    if (!(q.d === 1 || q.d === 2)) reasons.push('diff');
    if (typeof q.y !== 'string' || !q.y) reasons.push('year');
    if (typeof q.q !== 'string' || q.q.length < 12 || q.q.length > 130) reasons.push('qlen');
    if (!Array.isArray(q.o) || ![2, 4].includes(q.o.length) ||
        q.o.some(o => typeof o !== 'string' || !o || o.length > 45) ||
        new Set(q.o.map(norm)).size !== q.o.length) reasons.push('options');
    if (typeof q.f !== 'string' || q.f.length < 8 || q.f.length > 140) reasons.push('fact');
    if (reasons.length) { bad++; rejects.push(t + ' [' + reasons.join(',') + '] ' + String(q.q).slice(0, 60)); continue; }
    const key = norm(q.q);
    if (seen.has(key)) { dup++; continue; }
    seen.add(key);
    merged.push({ t: q.t, g: q.g, y: q.y, d: q.d, q: q.q.trim(), o: q.o.map(s => s.trim()), a: 0, f: q.f.trim() });
    ok++;
  }
  report[t] = `${ok} ok, ${bad} rejetées, ${dup} doublons`;
}

// stats
const stats = {};
for (const q of merged) {
  const k = q.g + ' d' + (q.d || 1);
  stats[k] = (stats[k] || 0) + 1;
}

fs.writeFileSync(path.join(ROOT, 'questions.js'),
  '/* GÉNÉRATIONS — banque de questions. Générée par merge-qbank.js, ne pas éditer à la main. */\n' +
  'window.QBANK=' + JSON.stringify(merged) + ';\n');

console.log('=== RAPPORT ===');
for (const [k, v] of Object.entries(report)) console.log(k.padEnd(12), v);
console.log('TOTAL:', merged.length, 'questions');
console.log('par génération/difficulté:', JSON.stringify(stats));
const byTheme = {};
for (const q of merged) byTheme[q.t || 'origine'] = (byTheme[q.t || 'origine'] || 0) + 1;
console.log('par thème:', JSON.stringify(byTheme));

// contrôle des fuites : un mot de l'énoncé présent dans la bonne réponse
// et absent de toutes les autres options révèle la solution
const STOP = new Set(('le la les un une des du de d au aux et ou a en dans sur pour par avec sans son sa ses ' +
  'leur leurs ce cet cette qui que quoi dont est sont etait etaient plus tres tout tous toute toutes premier ' +
  'premiere premiers quel quelle quels quelles comment combien pourquoi annee annees jeu film serie chanson ' +
  'groupe marque console appareil objet emission machine nom mot type sorte facon maniere vrai faux avant ' +
  'apres quand ete etre avait avaient faire fait devait pouvait signifie designe appelait appelle nomme ' +
  'celebre connu populaire monde france francais francaise ' +
  'chez entre sous vers contre pendant comme aussi meme chaque quelque quelques quelqu chose choses ' +
  'gens autre autres encore toujours jamais bien beaucoup petit petite grand grande nouveau nouvelle ' +
  'vieux vieille deux trois surtout alors donc mais puis cela ceux celles selon leurs notre votre').split(' '));
const words = s => [...new Set(norm(s).split(' '))].filter(w => w.length >= 4 && !STOP.has(w));
const leaks = [];
for (const q of merged) {
  if (q.o.length === 2) continue;
  const nq = ' ' + norm(q.q);
  const others = new Set(q.o.filter((_, i) => i !== q.a).flatMap(o => words(o)));
  const give = words(q.o[q.a]).filter(w => !others.has(w) && nq.includes(' ' + w));
  if (give.length) leaks.push(`[${q.t || 'origine'}] ${q.q}\n   → ${q.o[q.a]}  (${give.join(',')})`);
}
console.log('fuites de réponse:', leaks.length, leaks.length ? '⚠' : '✓');
if (leaks.length) fs.writeFileSync('/tmp/claude-0/-home-user-Generations/d989b581-6134-52cd-8477-21cf74dd5f85/scratchpad/leaks.txt', leaks.join('\n'));
if (rejects.length) {
  fs.writeFileSync('/tmp/claude-0/-home-user-Generations/d989b581-6134-52cd-8477-21cf74dd5f85/scratchpad/rejects.txt', rejects.join('\n'));
  console.log(rejects.length, 'rejets détaillés dans rejects.txt');
}
