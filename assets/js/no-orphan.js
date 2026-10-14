// Keep the last two words of titles and headings together, so no single word sits alone on
// the last line. Used by the article layout and the slide view (window.noOrphans(root)).
(function () {
  var SELECTOR = 'h1.post-title, .post-content h1, .post-content h2, .post-content h3, .post-content h4, ' +
                 '.post-list-item h2, .cat-card h2, .post-nav-title, .deck-title';
  var MAX_PAIR = 24;   // not rendered yet (slides build): longer pairs could overflow narrow phones
  var SPACE = function (c) { return /\s/.test(c); };
  var SPACE_OR_HYPHEN = function (c) { return /\s/.test(c) || c === '-'; };

  // Wrap the last two words (split by isSep) in a no-wrap span. A plain &nbsp; is not enough:
  // WebKit still breaks when the last word sits inside a <span>. Returns true if it stays.
  function wrapLastPair(el, isSep, rendered) {
    var text = el.textContent.trim(), parts = text.split(/\s+/);
    if (isSep === SPACE_OR_HYPHEN) parts = text.split(/[\s-]+/);
    if (parts.length < 2 || (!rendered && parts.slice(-2).join(' ').length > MAX_PAIR)) return false;

    var texts = [], walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), t;
    while ((t = walker.nextNode())) texts.push(t);
    var seenWord = false;
    for (var i = texts.length - 1; i >= 0; i--) {
      var s = texts[i].textContent;
      for (var j = s.length - 1; j >= 0; j--) {
        if (!isSep(s[j])) { seenWord = true; continue; }
        if (!seenWord) continue;
        // s[j] separates the last word from the one before it; find where that one starts.
        var k = j;
        while (k > 0 && SPACE(s[k - 1])) k--;
        while (k > 0 && !isSep(s[k - 1])) k--;
        var range = document.createRange();
        range.setStart(texts[i], k);
        range.setEnd(el, el.childNodes.length);
        var keep = document.createElement('span');
        keep.className = 'no-orphan';
        keep.style.whiteSpace = 'nowrap';
        keep.appendChild(range.extractContents());
        el.appendChild(keep);
        if (rendered && keep.offsetWidth > el.clientWidth) {   // wider than the heading: undo
          while (keep.firstChild) el.insertBefore(keep.firstChild, keep);
          keep.remove();
          el.normalize();
          return false;
        }
        return true;
      }
    }
    return false;
  }

  function glue(el) {
    if (el.querySelector('.no-orphan') || el.textContent.trim().split(/\s+/).length < 3) return;
    var rendered = el.clientWidth > 0;
    // Whole words first; if that pair can't fit, keep the part after the last hyphen with the
    // word before it ("server-" / "side vulnerabilities").
    if (!wrapLastPair(el, SPACE, rendered)) wrapLastPair(el, SPACE_OR_HYPHEN, rendered);
  }

  window.noOrphans = function (root) {
    if (root.matches && root.matches(SELECTOR)) glue(root);
    root.querySelectorAll(SELECTOR).forEach(glue);
  };
  window.noOrphans(document);
})();
