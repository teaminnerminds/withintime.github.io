/* ============================================================
   WITHIN TIME - Shared site utilities
   Namespace: window.WithinTime
   ============================================================ */
(function () {
  const WT = {};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  WT.reduceMotion = reduceMotion;
  document.documentElement.classList.add('js');

  function store(key, value) {
    try {
      if (value === undefined) return sessionStorage.getItem(key);
      sessionStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  /* ---------- Drifting dust: time flows left to right ---------- */
  WT.initDust = function () {
    const canvas = document.getElementById('dust');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, motes = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function init() {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, (w * h) / 14000));
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        vx: 0.08 + Math.random() * 0.35, vy: -0.05 - Math.random() * 0.12,
        t: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.18 ? 'crimson' : 'violet'
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        if (!reduceMotion) { m.x += m.vx; m.y += m.vy; m.t += 0.015; }
        if (m.x > w + 10) m.x = -10;
        if (m.y < -10) m.y = h + 10;
        const a = 0.25 + Math.sin(m.t) * 0.2;
        ctx.fillStyle = m.hue === 'crimson' ? `rgba(255,110,120,${a})` : `rgba(210,190,255,${a})`;
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fill();
        if (m.r > 1.3 && !reduceMotion) {
          ctx.fillStyle = `rgba(210,190,255,${a * 0.25})`;
          ctx.beginPath(); ctx.arc(m.x - m.vx * 14, m.y - m.vy * 14, m.r * 0.8, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (!reduceMotion) requestAnimationFrame(frame);
    }

    init(); frame();
    window.addEventListener('resize', init);
  };

  /* ---------- Moon phase: waxes from crescent to full as you scroll ---------- */
  WT.initMoon = function (opts) {
    const moon = document.querySelector('.sky-moon');
    const shadow = document.getElementById('moonShadow');
    if (!moon || !shadow) return;
    const fixed = opts && typeof opts.phase === 'number' ? opts.phase : null;

    function setPhase(p) {
      // Shadow disc slides off to the upper right, uncovering the moon
      shadow.setAttribute('cx', 128 + p * 150);
      shadow.setAttribute('cy', 72 - p * 90);
    }
    if (fixed !== null) { setPhase(fixed); return; }

    let ticking = false;
    function update() {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / (max * 0.82)) : 0;
      setPhase(p);
      moon.style.transform = `translateY(${window.scrollY * -0.04}px) rotate(${p * 24}deg)`;
    }
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  };

  WT.setBloodMoon = function (on) {
    const moon = document.querySelector('.sky-moon');
    if (moon) moon.classList.toggle('blood', on);
  };

  /* ---------- HUD: "days remain" counts down with scroll ---------- */
  WT.initDaysCounter = function (total) {
    const hud = document.querySelector('.hud-days');
    if (!hud) return;
    const num = hud.querySelector('strong');
    const fill = hud.querySelector('.hud-fill');
    let ticking = false;
    function update() {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      num.textContent = String(Math.round(total * (1 - p))).padStart(3, '0');
      if (fill) fill.style.height = (p * 100) + '%';
      hud.classList.toggle('show', window.scrollY > window.innerHeight * 0.6);
    }
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  };

  /* ---------- Afterimage headings + scroll reveals ---------- */
  WT.initEcho = function (root) {
    (root || document).querySelectorAll('.echo:not([data-text])').forEach(el => {
      const copy = el.cloneNode(true);
      copy.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
      el.setAttribute('data-text', copy.textContent.trim());
      el.innerHTML = `<span class="echo-main">${el.innerHTML}</span>`;
    });
  };

  WT.initReveals = function (root) {
    const els = (root || document).querySelectorAll('.echo:not(.in), .rv:not(.in), .rv-x:not(.in)');
    if (!('IntersectionObserver' in window) || reduceMotion) { els.forEach(el => el.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('in'), delay * 1000);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    els.forEach(el => io.observe(el));
  };

  /* ---------- Section tint: the sky shifts colour per section ---------- */
  WT.initTints = function () {
    if (typeof ScrollTrigger === 'undefined') return;
    document.querySelectorAll('[data-tint]').forEach(sec => {
      const apply = () => gsap.to(document.documentElement, { '--tint': sec.dataset.tint, duration: 1.4, ease: 'power2.out' });
      ScrollTrigger.create({ trigger: sec, start: 'top 55%', end: 'bottom 55%', onEnter: apply, onEnterBack: apply });
    });
  };

  /* ---------- Top bar + mobile nav ---------- */
  WT.initNav = function (sectionIds) {
    const bar = document.querySelector('.topbar');
    const toggle = document.querySelector('.menu-toggle');
    const mobile = document.querySelector('.mobile-nav');
    if (bar) {
      const onScroll = () => bar.classList.toggle('scrolled', window.scrollY > 40);
      window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }
    if (toggle && mobile) {
      toggle.addEventListener('click', () => {
        const open = !mobile.classList.contains('open');
        toggle.classList.toggle('open', open); mobile.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open);
        document.body.classList.toggle('locked', open);
      });
      mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        toggle.classList.remove('open'); mobile.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('locked');
      }));
    }
    if (!sectionIds || typeof ScrollTrigger === 'undefined') return;
    const links = document.querySelectorAll('.nav a[href^="#"]');
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const set = () => links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      ScrollTrigger.create({ trigger: el, start: 'top 50%', end: 'bottom 50%', onEnter: set, onEnterBack: set,
        onLeaveBack: () => { if (id === sectionIds[0]) links.forEach(l => l.classList.remove('active')); } });
    });
  };

  /* ---------- Image slots: <figure class="slot" data-img="..." data-label="..."> ---------- */
  const SLOT_ICON = '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/></svg>';
  WT.setSlot = function (slot, src, label) {
    slot.classList.remove('filled');
    slot.querySelectorAll('img, .slot-empty').forEach(n => n.remove());
    const text = label || slot.dataset.label || 'Screenshot';
    const empty = document.createElement('div');
    empty.className = 'slot-empty';
    empty.innerHTML = `${SLOT_ICON}<small>Image slot</small><span>${text}</span>`;
    slot.appendChild(empty);
    if (!src) return;
    const img = new Image();
    img.alt = text; img.loading = 'lazy'; img.decoding = 'async';
    img.onload = () => slot.classList.add('filled');
    slot.prepend(img);
    WT.loadFirst(img, src);
  };
  /* A path without an extension tries .webp, .png then .jpg, so a screenshot
     can be dropped in as any of those formats without touching the HTML. */
  WT.candidates = function (src) {
    return /\.[a-z0-9]{3,4}$/i.test(src) ? [src] : ['webp', 'png', 'jpg', 'jpeg'].map(ext => `${src}.${ext}`);
  };
  WT.loadFirst = function (img, src) {
    const list = WT.candidates(src);
    let i = 0;
    img.onerror = () => { if (++i < list.length) img.src = list[i]; };
    img.src = list[0];
  };
  WT.initBackdrops = function () {
    document.querySelectorAll('[data-bg]').forEach(el => {
      const probe = new Image();
      probe.onload = () => { el.style.backgroundImage = `url('${probe.src}')`; el.classList.add('loaded'); };
      WT.loadFirst(probe, el.dataset.bg);
    });
  };

  WT.initSlots = function (root) {
    (root || document).querySelectorAll('.slot').forEach(s => WT.setSlot(s, s.dataset.img, s.dataset.label));
  };

  /* ---------- Count-up numbers ---------- */
  WT.initCounters = function () {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      if (reduceMotion || typeof gsap === 'undefined') { el.textContent = target + suffix; return; }
      const obj = { v: 0 };
      el.textContent = '0' + suffix;
      ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => {
        gsap.to(obj, { v: target, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; } });
      } });
    });
  };

  WT.scrollToSection = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (typeof gsap === 'undefined' || typeof ScrollToPlugin === 'undefined' || reduceMotion) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    gsap.to(window, { duration: 1.2, scrollTo: { y: el, offsetY: 0 }, ease: 'power4.inOut' });
  };

  /* ---------- Ambient OST widget with a tiny visualiser ---------- */
  WT.initAmbientAudio = function (trackSrc) {
    const widget = document.querySelector('.audio-widget');
    if (!widget) return;
    const canvas = widget.querySelector('canvas');
    const cctx = canvas ? canvas.getContext('2d') : null;
    const label = widget.querySelector('.audio-label b');
    const audio = new Audio(trackSrc);
    audio.loop = true; audio.volume = 0.35;
    let audioCtx, analyser, data, playing = false;

    function idle() {
      if (!cctx) return;
      cctx.clearRect(0, 0, canvas.width, canvas.height);
      cctx.fillStyle = 'rgba(239,234,247,0.35)';
      for (let i = 0; i < 8; i++) cctx.fillRect(i * 5, canvas.height - 3, 3, 3);
    }
    function setup() {
      if (audioCtx) return;
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser(); analyser.fftSize = 32;
      source.connect(analyser); analyser.connect(audioCtx.destination);
      data = new Uint8Array(analyser.frequencyBinCount);
    }
    function draw() {
      if (!playing || !cctx) return;
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(data);
      cctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 8; i++) {
        const v = data[i + 1] / 255;
        const hgt = Math.max(3, v * canvas.height);
        cctx.fillStyle = i % 2 ? '#e8283c' : '#b45cf0';
        cctx.fillRect(i * 5, canvas.height - hgt, 3, hgt);
      }
    }
    idle();
    const compact = () => widget.classList.toggle('compact', window.scrollY > window.innerHeight * 0.5);
    window.addEventListener('scroll', compact, { passive: true }); compact();
    widget.addEventListener('click', () => {
      setup();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      if (playing) {
        audio.pause(); playing = false; widget.classList.remove('playing');
        widget.setAttribute('aria-pressed', 'false');
        if (label) label.textContent = 'Play theme'; idle();
      } else {
        audio.play().catch(() => {});
        playing = true; widget.classList.add('playing');
        widget.setAttribute('aria-pressed', 'true');
        if (label) label.textContent = 'Re;Start'; draw();
      }
    });
  };

  /* ---------- Loader: crescent moonrise, then an iris opens ---------- */
  WT.initLoader = function (onDone) {
    const el = document.getElementById('loader');
    const finish = () => { if (el) el.classList.add('done'); document.body.classList.remove('locked'); if (onDone) onDone(); };
    if (!el || typeof gsap === 'undefined') { finish(); return; }

    const seen = store('wt-loader-seen');
    if (reduceMotion || seen) { finish(); return; }
    store('wt-loader-seen', '1');
    document.body.classList.add('locked');

    const text = el.querySelector('.loader-text');
    if (text) text.innerHTML = text.textContent.split('').map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('');
    const pctEl = el.querySelector('.loader-pct');
    const counter = { v: 0 };

    const tl = gsap.timeline({ onComplete: finish });
    tl.to('.lm-ring', { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
      .to(counter, { v: 100, duration: 2.1, ease: 'power1.inOut', onUpdate: () => {
        if (pctEl) pctEl.textContent = String(Math.round(counter.v)).padStart(3, '0');
      } }, 0)
      .to('.loader-bar', { width: '100%', duration: 2.1, ease: 'power1.inOut' }, 0)
      .fromTo('.lm-echo', { opacity: 0.5, x: -40 }, { opacity: 0, x: 0, duration: 0.8, ease: 'power3.out', immediateRender: false }, 0.9)
      .to('.lm-fill', { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.95)
      .to('.loader-text span', { opacity: 1, duration: 0.05, stagger: 0.03 }, 1.0)
      .to({}, { duration: 0.35 })
      .to('.loader-moon, .loader-text, .loader-meta, .loader-skip', { opacity: 0, duration: 0.35 }, 'exit')
      .to(el, { '--r': Math.hypot(window.innerWidth, window.innerHeight) + 'px', duration: 1.0, ease: 'power3.in' }, 'exit');

    const skip = () => { tl.progress(1); };
    // Safety net: never leave the visitor stuck behind the loader
    setTimeout(skip, 6000);
    el.querySelector('.loader-skip')?.addEventListener('click', skip);
    el.addEventListener('click', skip, { once: true });
  };

  window.WithinTime = WT;
})();
