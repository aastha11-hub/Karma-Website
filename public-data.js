(() => {
  'use strict';

  const apiBase = String(window.KARMA_API_BASE || '').replace(/\/+$/, '');
  const apiUrl = `${apiBase}/api.php?action=bootstrap`;

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[char]);

  const safeUrl = value => {
    const url = String(value || '').trim();
    if (/^https?:\/\//i.test(url) || /^\/?uploads\//i.test(url)) return url;
    return '#';
  };

  function initiativeCard(item) {
    const hasPhotos = Array.isArray(item.gallery) && item.gallery.length > 0;
    return `<article class="if-card">
      <div class="if-img"><img src="${escapeHtml(safeUrl(item.img))}" alt="${escapeHtml(item.name)}" loading="lazy"><div class="if-over"></div></div>
      <div class="if-body">
        <h4>${escapeHtml(item.name)}</h4>
        <p>${escapeHtml(item.desc)}</p>
        <button class="if-link karma-init-open" type="button" data-id="${escapeHtml(item.id)}">${hasPhotos ? `View ${item.gallery.length} Photos` : 'View Initiative'} →</button>
      </div>
    </article>`;
  }

  function openInitiative(item) {
    let modal = document.getElementById('karmaInitiativeModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'karmaInitiativeModal';
      modal.innerHTML = '<div class="karma-modal-card"><button class="karma-modal-close" type="button" aria-label="Close">×</button><div class="karma-modal-content"></div></div>';
      document.body.appendChild(modal);
      modal.addEventListener('click', event => {
        if (event.target === modal || event.target.closest('.karma-modal-close')) modal.classList.remove('open');
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') modal.classList.remove('open');
      });
    }
    const photos = (item.gallery || []).map((photo, index) =>
      `<img src="${escapeHtml(safeUrl(photo))}" alt="${escapeHtml(item.name)} photo ${index + 1}" loading="lazy">`
    ).join('');
    const external = '';
    modal.querySelector('.karma-modal-content').innerHTML = `
      <img class="karma-modal-hero" src="${escapeHtml(safeUrl(item.img))}" alt="${escapeHtml(item.name)}">
      <h2>${escapeHtml(item.name)}</h2>
      <p>${escapeHtml(item.desc)}</p>
      ${photos ? `<div class="karma-modal-gallery">${photos}</div>` : '<p class="karma-no-photos">More photos will be added soon.</p>'}
      ${external}`;
    modal.classList.add('open');
  }

  function renderInitiatives(data) {
    const grid = document.querySelector('.init-full-grid');
    if (grid && data.initiatives.length) {
      grid.innerHTML = data.initiatives.map(initiativeCard).join('');
      grid.addEventListener('click', event => {
        const button = event.target.closest('.karma-init-open');
        if (!button) return;
        const item = data.initiatives.find(record => record.id === button.dataset.id);
        if (item) openInitiative(item);
      });
    }

    const homeGrid = document.querySelector('.ig4');
    if (homeGrid && data.initiatives.length) {
      homeGrid.innerHTML = data.initiatives.slice(0, 8).map(item => `
        <a class="ic" href="initiatives.html">
          <div class="ic-img"><img src="${escapeHtml(safeUrl(item.img))}" alt="${escapeHtml(item.name)}" loading="lazy"><div class="ic-ov"></div></div>
          <div class="ic-label">${escapeHtml(item.name)}</div>
        </a>`).join('');
      const countButton = Array.from(document.querySelectorAll('a.btn-b')).find(link => link.href.includes('initiatives.html'));
      if (countButton) countButton.textContent = `See All ${data.initiatives.length} Initiatives`;
      const section = homeGrid.closest('section');
      const description = section?.querySelector('.sdesc');
      if (description) description.textContent = `${data.initiatives.length} active programs empowering communities across Gujarat and beyond.`;
    }
  }

  function renderGallery(data) {
    const grid = document.querySelector('.gal-masonry');
    if (!grid) return;
    const general = (data.gallery || []).map(photo => ({
      img: photo.img,
      caption: photo.caption || photo.category || 'Karma Foundation'
    }));
    const initiativePhotos = (data.initiatives || []).flatMap(item =>
      (item.gallery || []).map(photo => ({ img: photo, caption: item.name }))
    );
    const photos = [...general, ...initiativePhotos];
    if (!photos.length) return;
    grid.innerHTML = photos.map(photo => `
      <div class="gal-item">
        <img src="${escapeHtml(safeUrl(photo.img))}" alt="${escapeHtml(photo.caption)}" loading="lazy">
        <div class="ov"><span>${escapeHtml(photo.caption)}</span></div>
      </div>`).join('');
  }

  function renderTeam(data) {
    const team = data.team || [];
    if (!team.length) return;
    const trustees = team.filter(item => item.type === 'trustee');
    const core = team.filter(item => item.type !== 'trustee');
    const trusteeGrid = document.querySelector('.trustee-grid');
    if (trusteeGrid && trustees.length) {
      trusteeGrid.innerHTML = trustees.map(item => `
        <div class="t-card">
          <div class="t-photo"><img src="${escapeHtml(safeUrl(item.img))}" alt="${escapeHtml(item.name)}" loading="lazy"></div>
          <div class="t-body"><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.quote || item.role)}</p></div>
        </div>`).join('');
    }
    const coreGrid = document.querySelector('.core-grid');
    if (coreGrid && core.length) {
      coreGrid.innerHTML = core.map(item => `
        <div class="c-card">
          <div class="c-photo"><img src="${escapeHtml(safeUrl(item.img))}" alt="${escapeHtml(item.name)}" loading="lazy"></div>
          <div class="c-body"><h4>${escapeHtml(item.name)}</h4><span>${escapeHtml(item.role)}</span></div>
        </div>`).join('');
    }
  }

  function renderEvents(data) {
    const events = data.events || [];
    const firstCard = document.querySelector('.event-card');
    if (!firstCard || !events.length) return;
    const parent = firstCard.parentElement;
    parent.querySelectorAll('.event-card').forEach(card => card.remove());
    const html = events.map(item => {
      const date = item.date ? new Date(`${item.date}T00:00:00`) : null;
      const day = date && !Number.isNaN(date.valueOf()) ? date.getDate() : '';
      const month = date && !Number.isNaN(date.valueOf()) ? date.toLocaleString('en', { month: 'short' }) : '';
      return `<div class="event-card">
        <div class="ev-date"><div class="day">${escapeHtml(day)}</div><div class="mo">${escapeHtml(month)}</div></div>
        <div class="ev-img"><img src="${escapeHtml(safeUrl(item.img))}" alt="${escapeHtml(item.title)}" loading="lazy"></div>
        <div class="ev-body"><div class="ev-meta">${escapeHtml(item.time)}${item.location ? ` / ${escapeHtml(item.location)}` : ''}</div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.desc)}</p></div>
      </div>`;
    }).join('');
    parent.insertAdjacentHTML('beforeend', html);
  }

  function renderNews(data) {
    const news = data.news || [];
    const grid = document.querySelector('.news-grid');
    if (!grid || !news.length) return;
    grid.innerHTML = news.map(item => {
      const date = item.date ? new Date(`${item.date}T00:00:00`) : null;
      const label = date && !Number.isNaN(date.valueOf())
        ? date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : '';
      return `<a class="n-card" href="${escapeHtml(safeUrl(item.link))}" target="_blank" rel="noopener">
        <div class="n-img"><img src="${escapeHtml(safeUrl(item.img))}" alt="${escapeHtml(item.title)}" loading="lazy"><span class="n-date">${escapeHtml(label)}</span></div>
        <div class="n-body"><h4>${escapeHtml(item.title)}</h4><span class="n-more">Read More →</span></div>
      </a>`;
    }).join('');
  }

  function renderStats(data) {
    const stats = data.stats || {};
    const values = [
      [stats.meals, stats.mealsLabel],
      [stats.women, stats.womenLabel],
      [stats.interns, stats.internsLabel],
      [stats.intl, stats.intlLabel]
    ];
    const cards = Array.from(document.querySelectorAll('.stats .stat'));
    cards.forEach((card, index) => {
      const [number, label] = values[index] || [];
      const numberEl = card.querySelector('.stat-num');
      const labelEl = card.querySelector('.stat-label');
      if (numberEl && number !== undefined && number !== '') {
        const finalText = `${Number(number).toLocaleString('en-IN')}+`;
        numberEl.dataset.t = String(number);
        numberEl.textContent = finalText;
        // The original page has its own counter animation. Re-apply the
        // database value after that animation finishes to avoid a load race.
        setTimeout(() => { numberEl.textContent = finalText; }, 1800);
      }
      if (labelEl && label) labelEl.textContent = label;
    });
  }

  function renderHomepage(data) {
    const aboutImage = data.homepage?.aboutImage;
    const image = document.querySelector('.ha-imgbox > img');
    if (image && aboutImage) image.src = safeUrl(aboutImage);
  }

  function partnerCard(item, withName = false) {
    const content = `<img src="${escapeHtml(safeUrl(item.logo))}" alt="${escapeHtml(item.name)}" loading="lazy">${withName ? `<span>${escapeHtml(item.name)}</span>` : ''}`;
    return safeUrl(item.website) !== '#'
      ? `<a class="pl" href="${escapeHtml(safeUrl(item.website))}" target="_blank" rel="noopener" title="${escapeHtml(item.name)}">${content}</a>`
      : `<div class="pl" title="${escapeHtml(item.name)}">${content}</div>`;
  }

  function renderPartners(data) {
    const partners = data.partners || [];
    if (!partners.length) return;
    const track = document.querySelector('.ptrack');
    if (track) {
      const cards = partners.map(item => partnerCard(item, true)).join('');
      track.innerHTML = cards + cards;
    }
    const grid = document.querySelector('.partners-full-grid');
    if (grid) grid.innerHTML = partners.map(item => partnerCard(item, true)).join('');
  }

  function renderContact(data) {
    const contact = data.contactInfo || {};
    const phoneHref = contact.phone ? `tel:${String(contact.phone).replace(/[^\d+]/g, '')}` : '';
    const emailHref = contact.email ? `mailto:${contact.email}` : '';

    if (phoneHref) {
      document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.href = phoneHref;
        link.textContent = link.textContent.includes('📞') ? `📞 ${contact.phone}` : contact.phone;
      });
    }
    if (emailHref) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.href = emailHref;
        link.textContent = link.textContent.includes('✉') ? `✉️ ${contact.email}` : contact.email;
      });
    }
    if (contact.razorpay) {
      document.querySelectorAll('.donate-btn,.mob-donate').forEach(link => link.href = contact.razorpay);
    }
    if (contact.volunteer) {
      document.querySelectorAll('a[href*="become-a-volunteer"]').forEach(link => link.href = contact.volunteer);
    }
    if (contact.address) {
      const office = document.querySelector('.c-i-text strong');
      if (office && office.textContent.trim() === 'Our Office') {
        const address = office.parentElement.querySelector('span');
        if (address) address.textContent = contact.address;
      }
      document.querySelectorAll('.fc a[href="contact.html"]').forEach(link => {
        if (link.textContent.includes('Ahmedabad') || link.textContent.includes('Floor')) link.textContent = contact.address;
      });
    }
    if (contact.tagline) {
      document.querySelectorAll('.fb-tag').forEach(el => el.textContent = `✦ ${contact.tagline}`);
    }
  }

  const styles = document.createElement('style');
  styles.textContent = `
    .karma-init-open{background:none;border:0;padding:0;cursor:pointer;font:inherit}
    #karmaInitiativeModal{position:fixed;inset:0;z-index:10000;background:rgba(10,20,38,.78);display:none;align-items:center;justify-content:center;padding:22px;overflow:auto}
    #karmaInitiativeModal.open{display:flex}
    .karma-modal-card{position:relative;background:#fff;width:min(940px,100%);max-height:92vh;overflow:auto;border-radius:20px;box-shadow:0 28px 90px rgba(0,0,0,.3)}
    .karma-modal-content{padding:26px}.karma-modal-content h2{margin:20px 0 8px}.karma-modal-content p{line-height:1.7;color:#596273}
    .karma-modal-close{position:absolute;right:14px;top:14px;width:40px;height:40px;border:0;border-radius:50%;background:#fff;font-size:25px;cursor:pointer;box-shadow:0 5px 20px rgba(0,0,0,.18)}
    .karma-modal-hero{width:100%;height:min(42vw,390px);object-fit:cover;border-radius:14px}
    .karma-modal-gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-top:22px}
    .karma-modal-gallery img{width:100%;height:180px;object-fit:cover;border-radius:10px}
    .karma-modal-link{display:inline-block;margin-top:22px;color:#e56c23;font-weight:700}.karma-no-photos{font-style:italic}
    .partners-full-grid .pl{height:92px;flex-direction:column;gap:7px;text-decoration:none;color:#172033}
    .partners-strip .pl{height:78px;flex-direction:column;gap:5px;text-decoration:none;color:#172033}
    .partners-strip .pl span{font-size:.65rem;font-weight:700;text-align:center;line-height:1.05}
    .partners-full-grid .pl span{font-size:.7rem;font-weight:700;text-align:center;line-height:1.1}
    .partners-full-grid .pl img{max-height:46px}
  `;
  document.head.appendChild(styles);

  fetch(apiUrl)
    .then(response => response.json())
    .then(payload => {
      if (!payload.ok) throw new Error(payload.error || 'Could not load website content.');
      renderInitiatives(payload.data);
      renderGallery(payload.data);
      renderTeam(payload.data);
      renderEvents(payload.data);
      renderNews(payload.data);
      renderStats(payload.data);
      renderHomepage(payload.data);
      renderPartners(payload.data);
      renderContact(payload.data);
    })
    .catch(error => console.warn('Karma content API:', error.message));
})();
