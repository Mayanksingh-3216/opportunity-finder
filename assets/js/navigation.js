/* Extracted from the original Opportunity Finder demo: navigation and visual refresh behavior.
   Application logic and data are kept in the same order as the original page. */

(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const nav = $('primaryNav');
  const toggle = $('mobileNavToggle');
  if (!nav || !toggle) return;
  const navButtons = [...nav.querySelectorAll('[data-main-nav]')];
  const setActive = (key) => navButtons.forEach(button => button.classList.toggle('is-active', button.dataset.mainNav === key));
  const closeNav = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation'); };
  const markProgress = (step) => document.querySelectorAll('[data-progress]').forEach(el => { const n = Number(el.dataset.progress); el.classList.toggle('active', n === step); el.classList.toggle('done', n < step); });
  const showHome = (scroll = true) => {
    document.querySelectorAll('.step-view').forEach(el => { el.hidden = el.id !== 'profileStep'; });
    if ($('governmentSchemesStep')) $('governmentSchemesStep').hidden = true;
    markProgress(1); setActive('home'); closeNav();
    if (scroll) window.scrollTo({top:0, behavior:'smooth'});
  };
  const prepareSectionRoute = () => {
    document.querySelectorAll('.step-view').forEach(el => { el.hidden = true; });
    if ($('governmentSchemesStep')) $('governmentSchemesStep').hidden = true;
    if ($('categoriesStep')) $('categoriesStep').hidden = false;
  };
  const navigate = (key) => {
    closeNav();
    if (key === 'home') { showHome(); return; }
    if (key === 'roadmap') {
      showHome(false); setActive('roadmap');
      const planner = $('goalPlannerTitle') || $('goalRoadmapForm');
      if (planner) planner.scrollIntoView({behavior:'smooth', block:'center'});
      const input = $('careerGoalInput'); if (input) input.focus({preventScroll:true});
      return;
    }
    if (key === 'education') {
      prepareSectionRoute();
      const button = $('educationCategory'); if (button) button.click();
      setActive('education'); return;
    }
    if (key === 'government' || key === 'private') {
      prepareSectionRoute();
      const button = $('jobsCareerCategory'); if (button) button.click();
      const filter = $('careerTypeFilter');
      if (filter) { filter.value = key === 'government' ? 'government_job' : 'private_job'; filter.dispatchEvent(new Event('change', {bubbles:true})); }
      setActive(key); return;
    }
    if (key === 'schemes') {
      const button = $('governmentSchemesCategory'); if (button) button.click();
      setActive('schemes'); return;
    }
  };
  navButtons.forEach(button => button.addEventListener('click', () => navigate(button.dataset.mainNav)));
  toggle.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeNav(); });
  document.addEventListener('click', event => { if (nav.classList.contains('is-open') && !nav.contains(event.target) && !toggle.contains(event.target)) closeNav(); });
  const syncActive = () => {
    const visible = [...document.querySelectorAll('.step-view')].find(el => !el.hidden);
    if (!visible) return;
    if (visible.id === 'profileStep') setActive($('careerRoadmapResult') && !$('careerRoadmapResult').hidden ? 'roadmap' : 'home');
    else if (visible.id === 'educationProfileStep' || visible.id === 'educationStep') setActive('education');
    else if (visible.id === 'jobsCareerStep') setActive($('careerTypeFilter') && $('careerTypeFilter').value === 'private_job' ? 'private' : 'government');
    else if (visible.id === 'governmentSchemesStep') setActive('schemes');
    else if (visible.id === 'categoriesStep') setActive('home');
  };
  const observer = new MutationObserver(syncActive);
  document.querySelectorAll('.step-view').forEach(el => observer.observe(el, {attributes:true, attributeFilter:['hidden']}));
  if ($('governmentSchemesStep')) observer.observe($('governmentSchemesStep'), {attributes:true, attributeFilter:['hidden']});
})();
