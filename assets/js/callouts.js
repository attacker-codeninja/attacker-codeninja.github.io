// callouts.js - Obsidian-style callouts for posts.
//
//   > [!tip] Optional title          a callout (any markdown inside: lists, tables, code, checklists)
//   > [!danger]- Title               foldable, starts closed
//   > [!danger]+ Title               foldable, starts open
//   > > [!note] Nested               a callout inside a callout (any depth)
//   > [!toggle] Title                a plain click-to-open toggle without the coloured card
//   > [!tip|side] Title              metadata after "|" becomes a class (co-m-side); our CSS styles it.
//                                    Consecutive |side callouts sit next to each other in one row.
//
// Also: code blocks get a data-lang label, task-list checkboxes become clickable (state kept in
// this browser only). Slides call window.makeCallouts() on the post they load.
(function () {
  // look: [icon, default title, corner art]
  const TYPES = {
    note: ['✎', 'Note', '📌'], info: ['i', 'Info', '💡'], tip: ['✦', 'Tip', '📈'], protip: ['♛', 'Pro Tip', '🚀'],
    success: ['✓', 'Success', '✅'], warning: ['!', 'Warning', '🚧'], danger: ['☠', 'Danger', '🚨'],
    important: ['★', 'Important', '⭐'], question: ['?', 'Question', '💭'], example: ['⚗', 'Example', ''],
    code: ['</>', 'Code', ''], steps: ['☰', 'Steps', '🏁'], checklist: ['☑', 'Checklist', '📋'],
    idea: ['✺', 'Idea', '🧠'], definition: ['¶', 'Definition', ''], quote: ['❝', 'Quote', '🪶'],
    link: ['⛓', 'Link', '🌐'], progress: ['◎', 'Progress', '🏔️'], defense: ['⛨', 'Defense', '🛡️'],
    interview: ['Q', 'Interview Q&A', '🎯'], recall: ['↻', 'Active Recall', '🧠'], mnemonic: ['※', 'Mnemonic', '🔑'],
    abstract: ['≡', 'Abstract', '🗂️'], failure: ['✗', 'Failure', '💥'], bug: ['⚑', 'Bug', '🐛'],
    toggle: ['', 'Details', '']
  };
  // Obsidian / GitHub type names that share a look; they keep their own default title.
  const ALIAS = {
    summary: 'abstract', tldr: 'abstract', todo: 'checklist', hint: 'tip', check: 'success', done: 'success',
    help: 'question', faq: 'question', caution: 'warning', attention: 'warning', fail: 'failure', missing: 'failure',
    error: 'danger', cite: 'quote'
  };
  const TITLE = { tldr: 'TL;DR', faq: 'FAQ', todo: 'To-do' };
  const MARK = /^\s*\[!([\w-]+)(?:\|([^\]\n]*))?\]([+-]?)[ \t]*/;

  const store = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked: state just isn't kept */ } }
  };
  const el = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  // Cut the title off the first paragraph: everything up to its first line break.
  function takeTitle(p) {
    const title = document.createDocumentFragment();
    while (p.firstChild) {
      const n = p.firstChild;
      if (n.nodeType === 3) {
        const i = n.data.indexOf('\n');
        if (i >= 0) { title.append(n.data.slice(0, i)); n.data = n.data.slice(i + 1); break; }
      } else if (n.nodeName === 'BR') { n.remove(); break; }
      title.append(n);
    }
    if (!p.textContent.trim() && !p.querySelector('img,input,code')) p.remove();
    return title;
  }

  // kramdown reads a "[!tip|side]" line (plus following lines with "|") as a table: turn it back into a paragraph.
  function untable(bq) {
    const t = bq.firstElementChild;
    if (!t || t.tagName !== 'TABLE' || t.tHead || !/^\s*\[![\w-]+$/.test(t.rows[0].cells[0].textContent)) return;
    const p = el('p');
    p.innerHTML = [...t.rows].map((r, i) => {
      const cells = [...r.cells].map(c => c.innerHTML);
      return i ? cells.join(' | ') : cells[0] + '|' + cells.slice(1).join(' | ');
    }).join('\n');
    t.replaceWith(p);
  }

  function toCallout(bq) {
    untable(bq);
    const p = bq.firstElementChild;
    if (!p || p.tagName !== 'P' || !p.firstChild || p.firstChild.nodeType !== 3) return;
    const m = p.firstChild.data.match(MARK);
    if (!m) return;
    const type = m[1].toLowerCase(), meta = (m[2] || '').toLowerCase().split(/[\s|]+/).filter(Boolean), fold = m[3];
    const look = TYPES[type] ? type : (ALIAS[type] || 'note');
    const [icon, defTitle, art] = TYPES[look];
    p.firstChild.data = p.firstChild.data.slice(m[0].length);

    const title = takeTitle(p);
    const foldable = fold !== '' || look === 'toggle';
    const box = el(foldable ? 'details' : 'div', 'co co-' + look);
    if (foldable) box.open = fold === '+';   // "-" and a bare [!toggle] start closed
    else box.setAttribute('role', 'note');
    meta.forEach(w => box.classList.add('co-m-' + w.replace(/[^\w-]/g, '')));

    const head = el(foldable ? 'summary' : 'div', 'co-h');
    if (icon) { const i = el('span', 'co-i'); i.textContent = icon; i.setAttribute('aria-hidden', 'true'); head.append(i); }
    const t = el('span', 'co-t');
    if (title.textContent.trim()) t.append(title);
    else t.textContent = TITLE[type] || (TYPES[type] ? defTitle : cap(type));
    head.append(t);
    box.append(head);

    const body = el('div', 'co-b');
    while (bq.firstChild) body.append(bq.firstChild);
    if (body.textContent.trim() || body.querySelector('img,table,pre,input')) box.append(body);
    else box.classList.add('co-empty');

    if (look === 'link') body.querySelectorAll('p').forEach(q => {   // a paragraph that is only a link becomes a link card
      const a = q.querySelector('a');
      if (a && q.children.length === 1 && q.textContent.trim() === a.textContent.trim()) {
        q.classList.add('lnk');
        const u = el('span', 'lnk-url'); u.textContent = a.href.replace(/^https?:\/\//, ''); a.append(u);
      }
    });

    if (art) { const a = el('span', 'co-art'); a.textContent = art; a.setAttribute('aria-hidden', 'true'); box.append(a); }
    else box.classList.add('co-noart');
    bq.replaceWith(box);
  }

  window.makeCallouts = function (root, key) {
    root.querySelectorAll('blockquote').forEach(toCallout);   // document order: outer first, nested ones after
    root.querySelectorAll('.co-m-side').forEach(c => {   // 2+ side-by-side callouts in a row share one layout box
      if (c.parentNode.classList.contains('co-row')) return;
      const run = [c];
      for (let n = c.nextElementSibling; n && n.classList.contains('co-m-side'); n = n.nextElementSibling) run.push(n);
      if (run.length < 2) return;
      const row = el('div', 'co-row');
      c.before(row); row.append(...run);
    });
    root.querySelectorAll('div.highlighter-rouge[class*="language-"]').forEach(d => {
      const lang = (d.className.match(/language-([\w+#-]+)/) || [])[1];
      if (lang && lang !== 'plaintext') d.dataset.lang = lang;
    });
    root.querySelectorAll('input.task-list-item-checkbox').forEach((c, i) => {
      c.removeAttribute('disabled');
      c.dataset.key = 'chk:' + key + ':' + i;
      const saved = store.get(c.dataset.key);
      if (saved != null) c.defaultChecked = saved === '1';
    });
  };

  document.addEventListener('change', e => {
    const c = e.target;
    if (c.matches && c.matches('input.task-list-item-checkbox[data-key]')) store.set(c.dataset.key, c.checked ? '1' : '0');
  });

  // Print shows folded content too, then restores what was closed.
  let closed = [];
  window.addEventListener('beforeprint', () => { closed = [...document.querySelectorAll('details.co:not([open])')]; closed.forEach(d => { d.open = true; }); });
  window.addEventListener('afterprint', () => { closed.forEach(d => { d.open = false; }); closed = []; });

  document.querySelectorAll('.post-content').forEach(r => window.makeCallouts(r, location.pathname));
})();
