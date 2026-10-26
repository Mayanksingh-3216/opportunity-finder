/* Extracted from the original Opportunity Finder demo: career category routing repair.
   Application logic and data are kept in the same order as the original page. */

/* Jobs/Careers routing repair. Data stays in the same catalogue; its category/subcategory tags are corrected for the active Career UI. */
(function () {
  const db = window.OPPORTUNITY_DATA;
  if (!db || !Array.isArray(db.records)) return;
  const modules = {
    government_job: 'Government Jobs',
    recruitment_portal: 'Government Recruitment Portals',
    private_job: 'Private Jobs & Careers',
    startup_scheme: 'Startup & Business Schemes'
  };
  for (const record of db.records) {
    const moduleName = modules[record.opportunity_type];
    if (!moduleName) continue;
    record.category = 'jobs_careers_startups';
    record.subcategories = [moduleName];
    record.career_module = moduleName;
  }
  db.jobs_careers_record_count = db.records.filter(r => r.category === 'jobs_careers_startups').length;
  db.jobs_careers_modules = modules;
  db.catalogue_version = (db.catalogue_version || 'education-learning') + '+jobs-careers-ui-fix-2026-10-25';
})();
