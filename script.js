/* Lucky Nhlanhla Mqedlana | Creative Portfolio : interactions (vanilla JS) */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- nav: burger, scrolled state, active link ---------- */
  var nav = $('#nav'), burger = $('.burger'), menu = $('#menu');
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
  }

  var links = $$('a[href^="#"]', menu || document).filter(function (a) { return a.getAttribute('href').length > 1 && !a.classList.contains('menu-cta'); });
  var targets = links.map(function (a) { return $(a.getAttribute('href')); });

  /* ---------- progress bar + back to top ---------- */
  var bar = document.createElement('div'); bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true');
  var top = document.createElement('button'); top.className = 'to-top'; top.type = 'button'; top.setAttribute('aria-label', 'Back to top'); top.innerHTML = '&uarr;';
  document.body.appendChild(bar); document.body.appendChild(top);
  top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  var ticking = false;
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
    if (nav) nav.classList.toggle('scrolled', y > 20);
    top.classList.toggle('show', y > 700);
    var mark = y + window.innerHeight * 0.35, cur = -1;
    targets.forEach(function (t, i) { if (t && t.offsetTop <= mark) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('active', i === cur); });
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- reveal on scroll ---------- */
  var items = $$('.reveal-item');
  items.forEach(function (el, i) { el.classList.add('reveal'); el.style.setProperty('--d', (i % 3) * 90 + 'ms'); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- stat counters ---------- */
  var counters = $$('[data-count]');
  function runCount(el) {
    var end = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = end + suffix; return; }
    var t0 = null;
    (function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / 1200);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else counters.forEach(runCount);

  /* ---------- hero character wave ---------- */
  var hc = $('.hero-char');
  if (hc) hc.addEventListener('click', function () {
    hc.classList.remove('wave'); void hc.offsetWidth; hc.classList.add('wave');
  });

  /* ---------- Corona day / night ---------- */
  $$('.daynight').forEach(function (box) {
    var btns = $$('.dn-btn', box), imgs = $$('.dn-img', box);
    function set(mode) {
      btns.forEach(function (b) {
        var on = b.getAttribute('data-mode') === mode;
        b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on));
      });
      imgs.forEach(function (im) { im.classList.toggle('on', im.getAttribute('data-mode') === mode); });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { set(b.getAttribute('data-mode')); }); });
    var init = btns.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; })[0] || btns[0];
    if (init) set(init.getAttribute('data-mode'));
  });

  /* ---------- mural filter chips ---------- */
  $$('.filters').forEach(function (bar) {
    var sec = bar.closest('section') || document;
    var figs = $$('.masonry figure', sec), chips = $$('.chip-btn', bar);
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var f = c.getAttribute('data-filter');
        chips.forEach(function (x) { x.classList.toggle('active', x === c); x.setAttribute('aria-pressed', String(x === c)); });
        figs.forEach(function (fig) {
          var show = f === 'all' || fig.getAttribute('data-cat') === f;
          fig.classList.toggle('is-hidden', !show);
          fig.classList.remove('pop-in');
          if (show) { void fig.offsetWidth; fig.classList.add('pop-in'); }
        });
      });
    });
    var first = chips.filter(function (c) { return c.getAttribute('data-filter') === 'all'; })[0];
    if (first) { first.classList.add('active'); first.setAttribute('aria-pressed', 'true'); }
  });

  /* ---------- typography sketch / final flips ---------- */
  $$('.flip').forEach(function (f) {
    f.addEventListener('click', function () {
      var on = !f.classList.contains('show');
      f.classList.toggle('show', on); f.setAttribute('aria-pressed', String(on));
    });
  });

  /* ---------- UI phone stack ---------- */
  var phonesBox = $('#phones');
  if (phonesBox) {
    var phones = $$('.phone', phonesBox), tabs = $$('.steps-nav button');
    var cur = 0;
    var showPhone = function (n) {
      cur = (n + phones.length) % phones.length;
      phones.forEach(function (p, i) {
        var d = i - cur;
        p.style.setProperty('--o', d);
        p.style.setProperty('--a', Math.abs(d));
        p.classList.toggle('active', i === cur);
      });
      tabs.forEach(function (t, i) {
        t.classList.toggle('active', i === cur);
        t.setAttribute('aria-selected', String(i === cur));
      });
    };
    phones.forEach(function (p, i) { p.addEventListener('click', function () { showPhone(i); }); });
    tabs.forEach(function (t) { t.addEventListener('click', function () { showPhone(parseInt(t.getAttribute('data-i'), 10) || 0); }); });
    showPhone(0);
  }

  /* ---------- copy to clipboard ---------- */
  var toast = $('.toast'), tt;
  function say(msg) {
    if (!toast) return;
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }
  $$('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy') || '';
      function ok() { say('Copied: ' + text); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, function () { fallback(text, ok); });
      else fallback(text, ok);
    });
  });
  function fallback(text, done) {
    var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta); done();
  }

  /* ---------- lightbox ---------- */
  var lb = document.createElement('div');
  lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Image viewer');
  lb.innerHTML = '<button class="lb-btn lb-close" type="button" aria-label="Close">&times;</button>' +
    '<button class="lb-btn lb-prev" type="button" aria-label="Previous image">&lsaquo;</button>' +
    '<img alt="">' +
    '<button class="lb-btn lb-next" type="button" aria-label="Next image">&rsaquo;</button>' +
    '<p class="lb-cap"></p>';
  document.body.appendChild(lb);
  var lbImg = $('img', lb), lbCap = $('.lb-cap', lb), set = [], idx = 0, lastFocus = null;

  function groupOf(img) { return img.closest('[data-group]') || img.closest('section') || img.closest('article') || document.body; }
  function capOf(img) {
    var fig = img.closest('figure'), fc = fig && fig.querySelector('figcaption');
    return (fc && fc.textContent.trim()) || img.alt || '';
  }
  function show(i) {
    idx = (i + set.length) % set.length;
    var im = set[idx];
    lbImg.src = im.currentSrc || im.src; lbImg.alt = im.alt || '';
    lbCap.textContent = capOf(im) + (set.length > 1 ? '  (' + (idx + 1) + '/' + set.length + ')' : '');
  }
  function openLb(img) {
    lastFocus = document.activeElement;
    set = $$('img.zoom', groupOf(img)).filter(function (x) { return x.offsetParent !== null; });
    var i = set.indexOf(img); if (i < 0) { set = [img]; i = 0; }
    var multi = set.length > 1;
    $('.lb-prev', lb).style.visibility = $('.lb-next', lb).style.visibility = multi ? 'visible' : 'hidden';
    show(i); lb.classList.add('open'); document.body.classList.add('no-scroll');
    $('.lb-close', lb).focus();
  }
  function closeLb() {
    lb.classList.remove('open'); document.body.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    var img = e.target.closest && e.target.closest('img.zoom');
    if (img && !img.closest('.flip')) openLb(img);
  });
  $('.lb-close', lb).addEventListener('click', closeLb);
  $('.lb-prev', lb).addEventListener('click', function () { show(idx - 1); });
  $('.lb-next', lb).addEventListener('click', function () { show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenu(); }
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });
  var tx = null;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
  });

  /* make zoom images keyboard reachable */
  $$('img.zoom').forEach(function (im) {
    if (im.closest('.flip')) return;
    im.setAttribute('tabindex', '0'); im.setAttribute('role', 'button');
    im.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(im); } });
  });
})();
