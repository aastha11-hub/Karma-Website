/* ═══════════════════════════════════════════════════════
   KARMA FOUNDATION — F1 EDITION 🏎️
   Interactive Engine v2.0
═══════════════════════════════════════════════════════ */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer   = window.matchMedia('(pointer: fine)').matches;
  const isMobile      = window.innerWidth <= 768;

  /* ── INTRO (RACE START SEQUENCE) ── */
  let introSeen = false;
  try { introSeen = sessionStorage.getItem('karma-intro-seen') === '1'; } catch {}

  if (!reducedMotion && !introSeen) {
    const intro = document.createElement('div');
    intro.className = 'karma-intro';
    const introLogo = document.querySelector('.nav-logo')?.cloneNode();
    intro.innerHTML = '<div class="karma-intro-inner"></div>';
    const inner = intro.querySelector('.karma-intro-inner');
    if (introLogo) inner.appendChild(introLogo);
    inner.insertAdjacentHTML('beforeend', `
      <span class="karma-intro-line"></span>
      <span class="karma-intro-text">Triggering Infinite Positivity</span>
      <div class="karma-intro-lights">
        <div class="karma-intro-light"></div>
        <div class="karma-intro-light"></div>
        <div class="karma-intro-light"></div>
        <div class="karma-intro-light"></div>
        <div class="karma-intro-light"></div>
      </div>
    `);
    document.body.appendChild(intro);
    try { sessionStorage.setItem('karma-intro-seen', '1'); } catch {}
    // Lights go out = GO!
    setTimeout(() => intro.classList.add('leave'), 2100);
    setTimeout(() => intro.remove(), 2750);
  }

  /* ── DRS PROGRESS BAR ── */
  const progress = document.createElement('div');
  progress.className = 'karma-progress';
  document.body.appendChild(progress);

  /* ── PAGE TRANSITION ── */
  const transition = document.createElement('div');
  transition.className = 'karma-transition';
  document.body.appendChild(transition);

  /* ── BACK TO TOP (CHECKERED) ── */
  const topButton = document.createElement('button');
  topButton.className = 'karma-top';
  topButton.type = 'button';
  topButton.setAttribute('aria-label', 'Back to top');
  topButton.innerHTML = '&#8593;';
  topButton.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  );
  document.body.appendChild(topButton);

  /* ── SCROLL UI UPDATES ── */
  const nav = document.querySelector('nav');
  const updateScrollUI = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    topButton.classList.toggle('show', window.scrollY > 520);
    nav?.classList.toggle('karma-scrolled', window.scrollY > 16);
  };
  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', updateScrollUI, { passive: true });

  /* ── SCROLL REVEAL ── */
  const revealSelector = [
    'section .sec-header', 'section .ha-wrap', '.stat',
    '.ic', '.nc', '.tc', '.val-card', '.if-card', '.event-card',
    '.n-card', '.t-card', '.c-card', '.gal-item', '.aw', '.c-i',
    '.contact-form', '.map-box', '.partners-full-grid .pl', '.cta .container > *'
  ].join(',');

  const revealItems = [...document.querySelectorAll(revealSelector)];
  revealItems.forEach((item, i) => {
    item.classList.add('karma-reveal');
    item.style.setProperty('--karma-delay', `${(i % 4) * 70}ms`);
  });

  if (!reducedMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('reveal-ready');
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('karma-visible');
        obs.unobserve(e.target);
      });
    }, { threshold: .1, rootMargin: '0px 0px -30px' });
    revealItems.forEach(item => revealObs.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('karma-visible'));
  }

  /* ── 3D TILT + POINTER GLOW (DESKTOP ONLY) ── */
  const interactiveCards = document.querySelectorAll(
    '.ic, .nc, .tc, .val-card, .if-card, .event-card, .n-card, .t-card, .c-card, .aw'
  );

  if (finePointer && !reducedMotion && !isMobile) {
    interactiveCards.forEach(card => {
      card.classList.add('karma-tilt');
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.setProperty('--card-x', `${(x + .5) * 100}%`);
        card.style.setProperty('--card-y', `${(y + .5) * 100}%`);
        card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateY(-6px) scale(1.02)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });

    /* Ambient pointer glow */
    window.addEventListener('pointermove', e => {
      document.documentElement.style.setProperty('--karma-pointer-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--karma-pointer-y', `${e.clientY}px`);
    }, { passive: true });

    /* ── CUSTOM CURSOR ── */
    const dot  = document.createElement('span');
    const ring = document.createElement('span');
    dot.className  = 'karma-cursor-dot';
    ring.className = 'karma-cursor-ring';
    document.body.append(dot, ring);
    document.body.classList.add('karma-cursor-on');

    let ringX = -100, ringY = -100, pX = -100, pY = -100;
    window.addEventListener('pointermove', e => {
      pX = e.clientX; pY = e.clientY;
      dot.style.cssText = `left:${pX}px;top:${pY}px;opacity:1`;
      ring.style.opacity = '1';
    }, { passive: true });

    const animCursor = () => {
      ringX += (pX - ringX) * .15;
      ringY += (pY - ringY) * .15;
      ring.style.left = `${ringX}px`;
      ring.style.top  = `${ringY}px`;
      requestAnimationFrame(animCursor);
    };
    animCursor();

    document.querySelectorAll('a, button, .gal-item').forEach(el => {
      el.addEventListener('pointerenter', () => ring.classList.add('active'));
      el.addEventListener('pointerleave', () => ring.classList.remove('active'));
    });

    /* ── HERO PARALLAX ── */
    const hero = document.querySelector('.hero');
    hero?.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - .5) * 16;
      const y = ((e.clientY - r.top) / r.height - .5) * 11;
      hero.style.setProperty('--hero-x', `${x}px`);
      hero.style.setProperty('--hero-y', `${y}px`);
    });
    hero?.addEventListener('pointerleave', () => {
      hero.style.setProperty('--hero-x', '0px');
      hero.style.setProperty('--hero-y', '0px');
    });

    /* ── MAGNETIC BUTTONS ── */
    document.querySelectorAll('.btn-o, .btn-b, .btn-outline, .btn-wh, .btn-wh-s, .nav-donate').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top  - r.height / 2;
        btn.style.transform = `translate(${x * .13}px, ${y * .17}px)`;
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ── SPARK CANVAS (RACING SPARKS ON HERO) ── */
  const heroEl = document.querySelector('.hero');
  if (heroEl && !reducedMotion && !isMobile) {
    const canvas = document.createElement('canvas');
    canvas.className = 'karma-spark-canvas';
    heroEl.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let sparks = [];
    let cW = 0, cH = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      cW = heroEl.clientWidth;
      cH = heroEl.clientHeight;
      canvas.width  = cW * ratio;
      canvas.height = cH * ratio;
      canvas.style.width  = `${cW}px`;
      canvas.style.height = `${cH}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      // More sparks, more F1 energy
      sparks = Array.from({ length: Math.min(65, Math.round(cW / 22)) }, (_, i) => ({
        x: Math.random() * cW,
        y: Math.random() * cH,
        length: 4 + Math.random() * 14,
        speed: .15 + Math.random() * .55,
        alpha: .15 + Math.random() * .6,
        color: i % 4 === 0 ? '255,69,0' : i % 4 === 1 ? '224,120,32' : i % 4 === 2 ? '255,179,71' : '255,255,255',
        angle: -Math.PI/2 + (Math.random() - .5) * .4, // mostly upward with slight variance
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, cW, cH);
      sparks.forEach(s => {
        s.x += Math.cos(s.angle) * s.speed * .35;
        s.y += Math.sin(s.angle) * s.speed;
        if (s.y < -25) {
          s.y = cH + 20;
          s.x = Math.random() * cW;
        }
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        const ex = s.x + Math.cos(s.angle) * s.length * .45;
        const ey = s.y + Math.sin(s.angle) * s.length;
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(${s.color},${s.alpha})`;
        ctx.lineWidth = s.speed > .4 ? 1.5 : 1;
        ctx.stroke();
      });
      requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize, { passive: true });
  }

  /* ── WORD-BY-WORD ANIMATION ── */
  document.querySelectorAll('.page-banner h1, .slide h1').forEach(title => {
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) {
      if (walker.currentNode.nodeValue.trim()) textNodes.push(walker.currentNode);
    }
    let idx = 0;
    textNodes.forEach(node => {
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(part => {
        if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
        const span = document.createElement('span');
        span.className = 'karma-word';
        span.style.setProperty('--word-delay', `${180 + idx * 60}ms`);
        span.textContent = part;
        frag.appendChild(span);
        idx++;
      });
      node.replaceWith(frag);
    });
  });

  /* ── SECTION TITLE ANIMATED UNDERLINE ── */
  document.querySelectorAll('h2.st').forEach(title => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) {
        title.classList.add('karma-title-live');
        obs.disconnect();
      }
    }, { threshold: .4 });
    obs.observe(title);
  });

  /* ── IMPACT FAB (PIT STOP) ── */
  const impact = document.createElement('div');
  impact.className = 'karma-impact';
  impact.innerHTML = `
    <button type="button" class="karma-impact-toggle" aria-label="Open impact actions" aria-expanded="false">
      <span>+</span><strong>Make an Impact</strong>
    </button>
    <div class="karma-impact-menu">
      <a href="https://pages.razorpay.com/karma-foundation" target="_blank">🤝 Donate Now</a>
      <a href="https://karmafoundation.co/become-a-volunteer/" target="_blank">🙌 Become a Volunteer</a>
      <a href="tel:+919898400312">📞 Call the Foundation</a>
    </div>`;
  document.body.appendChild(impact);

  const impactToggle = impact.querySelector('.karma-impact-toggle');
  impactToggle.addEventListener('click', () => {
    const open = impact.classList.toggle('open');
    impactToggle.setAttribute('aria-expanded', String(open));
    impactToggle.setAttribute('aria-label', open ? 'Close impact actions' : 'Open impact actions');
  });

  /* ── RIPPLE EFFECT ── */
  document.querySelectorAll('.btn-o, .btn-b, .btn-outline, .btn-wh, .btn-wh-s, .nav-donate, .mob-donate, .f-submit').forEach(btn => {
    btn.addEventListener('pointerdown', e => {
      const r = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'karma-ripple';
      ripple.style.cssText = `left:${e.clientX - r.left}px;top:${e.clientY - r.top}px`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  /* ── PAGE TRANSITIONS ── */
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (
        e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey ||
        link.target === '_blank' || !href || href.startsWith('#') ||
        href.startsWith('mailto:') || href.startsWith('tel:') ||
        !/\.html(?:$|[?#])/.test(href)
      ) return;
      e.preventDefault();
      transition.classList.add('go');
      setTimeout(() => { window.location.href = link.href; }, reducedMotion ? 0 : 420);
    });
  });

  /* ── GALLERY LIGHTBOX WITH KEYBOARD NAV ── */
  const galleryItems = document.querySelectorAll('.gal-item');
  if (galleryItems.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'karma-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Gallery image preview');
    lightbox.innerHTML = `
      <button type="button" aria-label="Close image preview">&#10005;</button>
      <button type="button" class="karma-lightbox-nav karma-lightbox-prev" aria-label="Previous image">&#8249;</button>
      <img alt="">
      <button type="button" class="karma-lightbox-nav karma-lightbox-next" aria-label="Next image">&#8250;</button>
      <span class="karma-lightbox-count"></span>`;
    document.body.appendChild(lightbox);

    const preview = lightbox.querySelector('img');
    const counter = lightbox.querySelector('.karma-lightbox-count');
    const images  = [...galleryItems].map(g => g.querySelector('img')).filter(Boolean);
    let activeIdx = 0;

    const showImg = idx => {
      activeIdx = (idx + images.length) % images.length;
      const img = images[activeIdx];
      preview.src = img.currentSrc || img.src;
      preview.alt = img.alt || 'Karma Foundation gallery image';
      counter.textContent = `${String(activeIdx + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
    };
    const close = () => { lightbox.classList.remove('open'); document.body.style.overflow = ''; };

    galleryItems.forEach((item, i) => {
      item.tabIndex = 0;
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', 'Open image preview');
      const open = () => { showImg(i); lightbox.classList.add('open'); document.body.style.overflow = 'hidden'; };
      item.addEventListener('click', open);
      item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });

    lightbox.querySelector('button').addEventListener('click', close);
    lightbox.querySelector('.karma-lightbox-prev').addEventListener('click', () => showImg(activeIdx - 1));
    lightbox.querySelector('.karma-lightbox-next').addEventListener('click', () => showImg(activeIdx + 1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')      close();
      if (e.key === 'ArrowLeft')   showImg(activeIdx - 1);
      if (e.key === 'ArrowRight')  showImg(activeIdx + 1);
    });
  }

  /* ── STAT COUNTER ANIMATION (RACE TACHOMETER STYLE) ── */
  // Override default counter with easeOut + overshoot feel
  const counters = document.querySelectorAll('.counter');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const counterObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.t, 10);
        const suffix = el.dataset.s || '';
        let start = null;
        const duration = 1600;
        const easeOut = t => 1 - Math.pow(1 - t, 3);

        const tick = ts => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / duration, 1);
          const current = Math.floor(easeOut(progress) * target);
          el.textContent = current.toLocaleString('en-IN') + suffix;
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString('en-IN') + suffix;
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: .5 });
    counters.forEach(el => counterObs.observe(el));
  }

  /* ── HERO SLIDE AUTO-ADVANCE WITH TRANSITION ── */
  // Note: Hero slide logic is in index.html; this just enhances it
  // We add a speed-glow to dots on change
  const dots = document.querySelectorAll('.dot');
  const originalGoSlide = window.goSlide;
  if (originalGoSlide) {
    window.goSlide = n => {
      originalGoSlide(n);
      dots.forEach((d, i) => d.classList.toggle('active', i === n));
    };
  }

  /* ── SECTION ENTRY: G-FORCE EFFECT ON BADGES ── */
  if (!reducedMotion) {
    document.querySelectorAll('.badge').forEach((badge, i) => {
      badge.style.opacity = '0';
      badge.style.transform = 'translateX(-30px) skewX(-5deg)';
      badge.style.transition = `opacity .5s ${i * 80}ms ease, transform .5s ${i * 80}ms cubic-bezier(.2, .8, .2, 1)`;
      const obs = new IntersectionObserver(entries => {
        if (entries[0]?.isIntersecting) {
          badge.style.opacity = '1';
          badge.style.transform = 'translateX(0) skewX(0)';
          obs.disconnect();
        }
      }, { threshold: .5 });
      obs.observe(badge);
    });
  }

})();
