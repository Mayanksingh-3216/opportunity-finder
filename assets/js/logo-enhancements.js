/* Extracted from the original Opportunity Finder demo: logo enhancement layer.
   Application logic and data are kept in the same order as the original page. */

(() => {
  'use strict';
  if (window.__opportunityFinderLogoLayerInstalled) return;
  window.__opportunityFinderLogoLayerInstalled = true;

  const palette = [
    ['#e8f1ff','#245fc8'],['#e6f8f0','#087b5b'],['#fff1df','#a95e0b'],
    ['#f1eaff','#6e42bc'],['#ffebef','#b83254'],['#e3f7fa','#087a90'],
    ['#eef5df','#557c18'],['#fff4cc','#8c6800']
  ];
  const brands = [
    {re:/india\s*post|postman|postal|grameen\s*dak|\bgds\b/,label:'POST',emoji:'📮',domain:'indiapost.gov.in'},
    {re:/railway|railways|\brrb\b|loco\s*pilot|train\s*manager|group\s*d\s*(rail|202)/,label:'RRB',emoji:'🚆',domain:'rrbcdg.gov.in'},
    {re:/upsc|ias\s*officer|ips\s*officer|civil\s*services|civil\s*service|\bifs\b/,label:'UPSC',emoji:'🏛️',domain:'upsc.gov.in'},
    {re:/staff\s*selection|\bssc\b|\bmts\b|\bchsl\b|\bcgl\b|stenographer|constable\s*gd/,label:'SSC',emoji:'📋',domain:'ssc.gov.in'},
    {re:/agniveer.*navy|indian\s*navy|naval\s*officer|navy\s*entry/,label:'NAVY',emoji:'⚓',domain:'joinindiannavy.gov.in'},
    {re:/agniveervayu|air\s*force|indian\s*air\s*force/,label:'IAF',emoji:'✈️',domain:'careerindianairforce.cdac.in'},
    {re:/indian\s*army|agniveer|armed\s*forces|military|defence|defense|\bnda\b|\bcds\b|\bcapf\b/,label:'DEF',emoji:'🛡️',domain:'joinindianarmy.nic.in'},
    {re:/police|sub\s*inspector|\bsi\b|head\s*constable|paramilitary|border\s*security|\bbsf\b|\bcrpf\b|\bcisf\b/,label:'POLICE',emoji:'👮',domain:''},
    {re:/ibps|bank\s*po|bank\s*clerk|banking|reserve\s*bank|\brbi\b|\bsbi\b/,label:'BANK',emoji:'🏦',domain:'ibps.in'},
    {re:/neet|mbbs|doctor|medical|nursing|\bnurse\b|pharmac|clinical|hospital|ayushman/,label:'HEALTH',emoji:'🩺',domain:'neet.nta.nic.in'},
    {re:/\bjee\b|engineering|engineer|polytechnic|\bdiploma\b|\biti\b|technician|mechanic|electrician|fitter|welder/,label:'TECH',emoji:'⚙️',domain:''},
    {re:/teacher|teaching|\bb\.ed\b|lecturer|professor|education|school\s*teacher/,label:'EDU',emoji:'🎓',domain:'ncte.gov.in'},
    {re:/scholarship|nmmss|yasasvi|national\s*scholarship|student\s*aid|fellowship/,label:'SCHOLAR',emoji:'🎓',domain:'scholarships.gov.in'},
    {re:/pm-kisan|pmkisan|kisan|farmer|agriculture|agri\s*scheme/,label:'FARM',emoji:'🌾',domain:'pmkisan.gov.in'},
    {re:/ayushman|pmjay|health\s*cover|health\s*insurance/,label:'HEALTH',emoji:'➕',domain:'nha.gov.in'},
    {re:/pension|widow|old\s*age|social\s*security/,label:'CARE',emoji:'🤝',domain:'nsap.nic.in'},
    {re:/startup|business|mudra|pmegp|dpiit|entrepreneur/,label:'STARTUP',emoji:'🚀',domain:'startupindia.gov.in'},
    {re:/lawyer|advocate|judiciary|judge|legal|\bllb\b|law\s*officer/,label:'LAW',emoji:'⚖️',domain:''},
    {re:/chartered\s*accountant|\bca\b|accountant|finance|commerce|auditor|taxation/,label:'FIN',emoji:'📊',domain:''},
    {re:/software|developer|technology|\bit\b|data\s*analyst|artificial\s*intelligence|\bai\b|cyber|cloud|network/,label:'TECH',emoji:'💻',domain:''},
    {re:/research|scientist|science|\bphd\b|laboratory|biotech/,label:'SCI',emoji:'🧪',domain:''},
    {re:/hospitality|hotel|tourism|chef|culinary|travel/,label:'HOSP',emoji:'🧳',domain:''},
    {re:/media|journalis|creative|design|photograph|animation|film|content/,label:'MEDIA',emoji:'🎨',domain:''},
    {re:/teacher|tutor|trainer/,label:'TEACH',emoji:'📚',domain:''}
  ];

  function stablePalette(text) {
    let hash = 0;
    for (let i=0;i<text.length;i++) hash = ((hash<<5)-hash + text.charCodeAt(i))|0;
    return palette[Math.abs(hash)%palette.length];
  }
  function firstExternalDomain(card) {
    const links = [...card.querySelectorAll('a[href^="http"]')];
    for (const link of links) {
      try {
        const host = new URL(link.href).hostname.replace(/^www\./,'').toLowerCase();
        if (!host || /(^|\.)google\.com$|(^|\.)googleapis\.com$|(^|\.)wikipedia\.org$/.test(host)) continue;
        return host;
      } catch (_) {}
    }
    return '';
  }
  function classify(title, card) {
    const titleText = String(title||'').trim();
    const lower = titleText.toLowerCase();
    let match = brands.find(b => b.re.test(lower));
    const section = card.closest('#governmentSchemesStep') ? 'scheme' :
      card.closest('#jobsCareerStep') ? 'career' :
      card.classList.contains('institution-card') ? 'institute' :
      card.classList.contains('transition-db-card') ? 'education' : 'education';
    if (!match) {
      if (section==='scheme') match = {label:'SCHEME',emoji:'🏛️',domain:''};
      else if (section==='career') match = {label:'CAREER',emoji:'💼',domain:''};
      else if (section==='institute') match = {label:'CAMPUS',emoji:'🏫',domain:''};
      else match = {label:'LEARN',emoji:'📘',domain:''};
    }
    const domain = match.domain || firstExternalDomain(card);
    const colors = stablePalette(titleText || match.label);
    return {...match, domain, colors, section};
  }
  function makeLogo(title, card, compact=false) {
    const info = classify(title, card);
    const badge = document.createElement('span');
    badge.className = 'ofi-logo-avatar' + (compact?' compact':'');
    badge.title = info.domain ? `${info.label} · source domain: ${info.domain}` : `${info.label} · category icon`;
    badge.setAttribute('role','img');
    badge.setAttribute('aria-label', `${title || info.label} ${info.domain?'source favicon':'category'} logo`);
    badge.style.setProperty('--ofi-logo-bg', info.colors[0]);
    badge.style.setProperty('--ofi-logo-fg', info.colors[1]);
    const fallback = document.createElement('span');
    fallback.className = 'ofi-logo-fallback';
    fallback.textContent = info.emoji || '✦';
    fallback.setAttribute('aria-hidden','true');
    badge.appendChild(fallback);
    if (info.domain) {
      const img = document.createElement('img');
      img.className = 'ofi-logo-img';
      img.alt = '';
      img.setAttribute('aria-hidden','true');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(info.domain)}&sz=64`;
      img.addEventListener('load',()=>{ if(img.naturalWidth>0) badge.classList.add('has-image'); else img.remove(); },{once:true});
      img.addEventListener('error',()=>img.remove(),{once:true});
      badge.appendChild(img);
    }
    return badge;
  }
  function enhanceTitleCard(card) {
    if (!card || card.querySelector(':scope > .ofi-title-logo-row')) return;
    const heading = card.querySelector(':scope > h3, :scope > h4') || card.querySelector('h3,h4');
    if (!heading || heading.closest('.ofi-title-logo-row')) return;
    const row = document.createElement('div');
    row.className = 'ofi-title-logo-row';
    const parent = heading.parentNode;
    parent.insertBefore(row, heading);
    row.appendChild(makeLogo(heading.textContent,card,false));
    row.appendChild(heading);
  }
  function enhanceGoalSuggestion(button) {
    if (!button || button.querySelector(':scope > .ofi-logo-avatar')) return;
    const title = button.querySelector('strong')?.textContent || button.textContent;
    button.insertBefore(makeLogo(title,button,true),button.firstChild);
  }
  function enhanceRelatedGoal(button) {
    if (!button || button.querySelector(':scope > .ofi-logo-avatar')) return;
    const title = (button.textContent||'').trim();
    button.insertBefore(makeLogo(title,button,true),button.firstChild);
  }
  function enhanceCategory(card) {
    const symbol = card.querySelector('.category-symbol,.subsection-icon');
    if (!symbol) return;
    // The existing category SVG/emoji remains the icon; only its visual container gets improved styling.
    symbol.classList.add('ofi-category-logo');
    if (!symbol.getAttribute('aria-hidden')) symbol.setAttribute('aria-hidden','true');
  }
  function scan(root=document) {
    root.querySelectorAll?.('.opportunity-card,.gov-scheme-card,.institution-card,.transition-db-card,.pathway-guide-card').forEach(enhanceTitleCard);
    root.querySelectorAll?.('.career-goal-search-item').forEach(enhanceGoalSuggestion);
    root.querySelectorAll?.('.goal-related-list button').forEach(enhanceRelatedGoal);
    root.querySelectorAll?.('.category-card,.subsection-card').forEach(enhanceCategory);
    root.querySelectorAll?.('.roadmap-result-head h4').forEach(heading=>{
      if (heading.closest('.ofi-title-logo-row')) return;
      const parent=heading.parentNode;
      const row=document.createElement('div'); row.className='ofi-title-logo-row';
      parent.insertBefore(row,heading); row.appendChild(makeLogo(heading.textContent,heading.closest('.roadmap-result-head')||heading,false)); row.appendChild(heading);
    });
  }
  let pending = false;
  const observer = new MutationObserver(mutations=>{
    if (pending) return;
    pending = true;
    requestAnimationFrame(()=>{
      pending = false;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes || []) {
          if (node.nodeType!==1) continue;
          if (node.matches?.('.opportunity-card,.gov-scheme-card,.institution-card,.transition-db-card,.pathway-guide-card,.career-goal-search-item,.category-card,.subsection-card,.roadmap-result-head')) scan(node.parentElement || document);
          else scan(node);
        }
      }
    });
  });
  function boot() {
    scan(document);
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
