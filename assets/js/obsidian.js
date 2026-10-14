// obsidian.js - Obsidian syntax in blog posts. GitHub Pages runs no custom plugins, so this works in
// the browser on the page Jekyll built. Write the post, push, and the page handles:
//   ==highlight==          %%hidden comment%% (also over several paragraphs)       #tag
//   text ^block-id         (the marker is hidden)
//   [[Post title]], [[Post title|text]], [[Post title#Heading]]  -> link to that post; anything that
//                          is not a post title stays exactly as written (e.g. JavaScript's [[Prototype]])
//   [[#Heading]]           -> link to a heading on this page
//   ![[x.png]], ![[folder/x.svg|300]]  -> image from /assets/img/ (SVG inline: animations + theme colour)
//   ```mermaid             -> diagram in the theme's colours (Mermaid loads only on pages that have one)
// Code blocks are coloured only when they name a language (plain text is never guessed).
// Slides call window.mdExtras(root) and window.mdDiagrams(root) on the post they load.
(function () {
  const DATA = (() => {
    try { return JSON.parse(document.getElementById('site-data').textContent); } catch (e) { return { img: '/assets/img/', posts: [] }; }
  })();
  const MERMAID = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js';
  const IMG = /\.(png|jpe?g|gif|webp|avif|apng|bmp|svg)$/i;
  const SKIP = 'pre, code, script, style, textarea, a, .mermaid-box';
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const slug = t => t.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
  const findPost = name => {
    const n = name.trim().toLowerCase();
    return DATA.posts.find(p => p.t.toLowerCase() === n || (p.f || '').toLowerCase() === n);
  };

  function textNodes(root) {
    const out = [];
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT,
      { acceptNode: n => n.parentElement.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    for (let n; (n = w.nextNode());) out.push(n);
    return out;
  }

  // kramdown reads a short paragraph with "|" in it ([[Note|text]], ![[x.png|300]]) as a header-less table.
  // Such a table has a cell where the "|" cut a [[...]] in two: make it a paragraph again.
  const cutLink = c => (c.textContent.match(/\[\[/g) || []).length > (c.textContent.match(/\]\]/g) || []).length;
  function untable(root) {
    root.querySelectorAll('table').forEach(t => {
      if (t.tHead || !t.rows.length || ![...t.querySelectorAll('td')].some(cutLink)) return;
      const p = el('p');
      p.innerHTML = [...t.rows].map(r => [...r.cells].map(c => c.innerHTML).join('|')).join('\n');
      t.replaceWith(p);
    });
  }

  // %%...%%: remove everything between each pair of markers, even across paragraphs.
  function dropComments(root) {
    const marks = [];
    textNodes(root).forEach(n => { for (let i = n.data.indexOf('%%'); i >= 0; i = n.data.indexOf('%%', i + 2)) marks.push([n, i]); });
    if (marks.length < 2) return;
    const pairs = [];
    for (let k = 0; k + 1 < marks.length; k += 2) pairs.push([marks[k], marks[k + 1]]);
    pairs.reverse().forEach(([a, b]) => {
      const r = document.createRange();
      r.setStart(a[0], a[1]); r.setEnd(b[0], b[1] + 2); r.deleteContents();
    });
    root.querySelectorAll('p, li').forEach(p => { if (!p.textContent.trim() && !p.children.length) p.remove(); });
  }

  // One pass over each text node: ==mark==, [[links]], ![[images]], #tags, ^block-ids.
  const INLINE = /==([^\s=](?:[^=\n]*?[^\s=])?)==|(!?)\[\[([^\]\n]+)\]\]|(^|\s)#([A-Za-z_][\w/-]*)|[ \t]\^[\w-]+[ \t]*$/g;
  function build(m) {
    if (m[1]) return el('mark', null, m[1]);
    if (m[3]) {
      const [target, ...opts] = m[3].split('|').map(s => s.trim());
      if (m[2]) {   // ![[image]]
        if (!IMG.test(target)) return null;
        const width = opts.find(o => /^\d+(x\d+)?$/.test(o));
        const src = DATA.img + target.split('/').map(encodeURIComponent).join('/');
        const img = el('img'); img.src = src; img.alt = opts.find(o => !/^\d+(x\d+)?$/.test(o)) || target.replace(/^.*\/|\.\w+$/g, '');
        if (width) img.setAttribute('width', width.split('x')[0]);
        return img;
      }
      const [page, head] = target.split('#');
      const text = opts[0] || (page ? page + (head ? ' › ' + head : '') : head);
      if (!page && head) { const a = el('a', null, text); a.href = '#' + slug(head); return a; }
      const post = findPost(page);
      if (!post) return null;   // not a post title: leave the text as written
      const a = el('a', null, text); a.href = post.u + (head ? '#' + slug(head) : ''); return a;
    }
    if (m[5]) return el('span', 'md-tag', '#' + m[5]);
    return document.createTextNode('');   // ^block-id
  }
  function inline(n) {
    const s = n.data;
    let m, last = 0, frag = null;
    INLINE.lastIndex = 0;
    while ((m = INLINE.exec(s))) {
      const node = build(m);
      if (!node) continue;
      const start = m.index + (m[4] || '').length;   // keep the space before a #tag
      frag = frag || document.createDocumentFragment();
      frag.append(s.slice(last, start), node);
      last = m.index + m[0].length;
    }
    if (frag) { frag.append(s.slice(last)); n.replaceWith(frag); }
  }

  // Same-site SVG images become inline SVG, so their animations run and currentColor follows the theme.
  async function inlineSvgs(root) {
    const imgs = [...root.querySelectorAll('img')].filter(i => /\.svg(\?|#|$)/i.test(i.getAttribute('src') || '') && new URL(i.src, location.href).origin === location.origin);
    await Promise.all(imgs.map(async img => {
      try {
        const res = await fetch(img.src);
        if (!res.ok) return;
        const box = el('span', 'md-svg');
        box.innerHTML = (await res.text()).replace(/<\?xml[\s\S]*?\?>|<!DOCTYPE[^>]*>/gi, '');
        const svg = box.querySelector('svg');
        if (!svg) return;
        svg.querySelectorAll('script').forEach(s => s.remove());
        box.setAttribute('role', 'img'); if (img.alt) box.setAttribute('aria-label', img.alt);
        if (img.getAttribute('width')) box.style.width = img.getAttribute('width') + 'px';
        img.replaceWith(box);
      } catch (e) { /* keep the plain image */ }
    }));
  }

  // Code: colour only blocks that name a known language.
  window.mdCode = function (root) {
    if (!window.hljs) return;
    hljs.configure({ ignoreUnescapedHTML: true });
    root.querySelectorAll('pre code').forEach(c => {
      if (c.closest('.mermaid-box') || c.dataset.highlighted) return;
      const lang = ((c.className.match(/language-([\w+#-]+)/) || (c.closest('[class*="language-"]') || { className: '' }).className.match(/language-([\w+#-]+)/)) || [])[1];
      if (!lang || lang === 'plaintext' || !hljs.getLanguage(lang)) return;
      c.classList.add('language-' + lang);
      hljs.highlightElement(c);
    });
  };

  // Text syntax + mermaid boxes; resolves once same-site SVGs are inline.
  window.mdExtras = function (root) {
    untable(root);
    dropComments(root);
    textNodes(root).forEach(inline);
    root.querySelectorAll('code.language-mermaid, div.language-mermaid code').forEach(code => {
      const host = code.closest('div.highlighter-rouge') || code.closest('pre') || code;
      const box = el('div', 'mermaid-box'), pre = el('pre', 'mermaid', code.textContent);
      pre.dataset.src = code.textContent;
      box.append(pre); host.replaceWith(box);
    });
    return inlineSvgs(root);
  };

  // ---------- Mermaid, drawn in the current theme's colours ----------
  let loading = null;
  const loadMermaid = () => loading || (loading = new Promise((ok, bad) => {
    if (window.mermaid) { ok(); return; }
    const s = document.createElement('script');
    s.src = MERMAID;
    s.onload = () => { mermaid.initialize({ startOnLoad: false }); ok(); };
    s.onerror = () => bad(new Error('Mermaid did not load (offline?)'));
    document.head.append(s);
  }));
  const scale = (fills, label) => Object.assign({}, ...fills.map((c, i) => ({ ['cScale' + i]: c, ['cScaleLabel' + i]: label, ['pie' + (i + 1)]: c })));
  function look() {
    if (document.documentElement.dataset.theme === 'notebook') return Object.assign({ fontFamily: 'Nunito, system-ui, sans-serif', background: '#fffdf6',
      primaryColor: '#fff6b3', primaryBorderColor: '#1f2933', primaryTextColor: '#1f2933', secondaryColor: '#d4ecff', tertiaryColor: '#dff7e3', lineColor: '#1f2933',
      textColor: '#1f2933', noteBkgColor: '#fff176', noteBorderColor: '#1f2933', edgeLabelBackground: '#fffdf6', pieStrokeColor: '#1f2933', pieOuterStrokeColor: '#1f2933' },
      scale(['#fff176', '#b3e5fc', '#b9f6ca', '#ffb3d1', '#ffd59e', '#d1c4e9', '#c8e6c9', '#ffe0b2', '#bbdefb', '#f8bbd0', '#dcedc8', '#e1bee7'], '#1f2933'));
    return Object.assign({ darkMode: true, fontFamily: '"IBM Plex Sans", system-ui, sans-serif', background: '#121821',
      primaryColor: '#1f2a38', primaryBorderColor: '#E8B04B', primaryTextColor: '#E7ECF2', secondaryColor: '#1d3045', tertiaryColor: '#16202c', lineColor: '#8B96A5',
      textColor: '#E7ECF2', noteBkgColor: '#2a2414', noteBorderColor: '#E8B04B', edgeLabelBackground: '#121821', pieStrokeColor: '#0A0E14', pieOuterStrokeColor: '#232C39' },
      scale(['#2c5d8f', '#1f7a5a', '#8a6420', '#6b3a85', '#8f3a40', '#1f6f7f', '#5a6b1f', '#45489c', '#7a4f2a', '#2f6e6e', '#7a3f6b', '#3d5f8f'], '#E7ECF2'));
  }
  window.mdDiagrams = async function (root) {
    const nodes = [...root.querySelectorAll('pre.mermaid')];
    if (!nodes.length) return;
    try { await loadMermaid(); } catch (e) { console.warn('obsidian.js:', e.message); return; }
    nodes.forEach(n => { n.removeAttribute('data-processed'); n.textContent = n.dataset.src; });
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'base', themeVariables: look() });
    await document.fonts.ready;
    try { await mermaid.run({ nodes, suppressErrors: true }); } catch (e) { console.warn('obsidian.js: diagram failed', e); }
  };

  // Article pages: runs before callouts.js (loaded after this file).
  document.querySelectorAll('.post-content').forEach(root => {
    window.mdExtras(root);
    window.mdDiagrams(root);
    document.addEventListener('themechange', () => window.mdDiagrams(root));
  });
})();
