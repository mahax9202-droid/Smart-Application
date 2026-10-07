/**
 * Smart Application — Job Match & Readiness Predictor
 * Client-Side Application Logic, Matching Engine & UI Controller
 */

// Application State
const state = {
  lang: 'en', // 'en' | 'ar'
  theme: 'dark',
  currentDegree: 'bachelor',
  currentJobId: 'ml-engineer',
  currentExp: 2.5,
  skillsState: {}, // { skillName: proficiencyLevel (0-5) }
  lastResult: null
};

// I18N Dictionaries
const TRANSLATIONS = {
  en: {
    appTitle: "Smart Application",
    appSubtitle: "LinkedIn Job Postings (2023–2024) Benchmark",
    presetsLabel: "Quick Test Presets:",
    inputsTitle: "Applicant Profile",
    inputsSubtitle: "Enter your qualifications to analyze real-world market readiness.",
    labelDegree: "Degree / Education Level",
    labelJob: "Target Job Role",
    marketSourced: "LinkedIn 23–24",
    labelExp: "Relevant Experience",
    expHelp: "Total relevant years",
    yearsUnit: "yrs",
    labelSkills: "Technical Skills & Proficiency",
    scaleHint: "0 to 5 scale",
    btnEvaluate: "Evaluate Match & Readiness",
    matchScoreLabel: "MATCH SCORE",
    growthMeterTitle: "Growth Potential Meter",
    kpiSkill: "Skill Alignment",
    kpiExp: "Experience Fit",
    kpiEdu: "Education Fit",
    alignmentTitle: "Job Alignment Breakdown",
    alignmentSubtitle: "Side-by-side comparison of target market demands vs. candidate qualifications.",
    expComparisonTitle: "Experience Comparison",
    marketRequired: "Target Market Requirement",
    applicantCurrent: "Applicant Experience",
    skillsAcquiredTitle: "Matched & Acquired Skills",
    skillsMissingTitle: "Identified Skill Gaps",
    recommendationsTitle: "Actionable Recommendations",
    recommendationsSubtitle: "Intelligent alternatives, focused skill targets, and your customized readiness improvement roadmap.",
    similarJobsHeading: "Similar Job Recommendations",
    badgeAllApplicants: "Shown to All Applicants",
    skillDevHeading: "Skill Development Recommendations",
    badgeGapApplicants: "Shown Only When Match < 70%",
    skillDevDesc: "Focus on these critical technical competencies to elevate your overall qualification above 80%:",
    readinessPlanHeading: "Readiness Improvement Plan",
    readyNow: "Ready for Interviews",
    weeksFormat: (w) => `You need about ${w} weeks of development to become ready`,
    readyNowDesc: "Your technical foundation and experience align excellently with current hiring benchmarks.",
    growthDesc: (w) => `Targeted self-study and hands-on projects of approximately ${w} weeks can close your qualification gap.`,
    statusExcellentMsg: "Excellent Match — You are highly qualified for this job.",
    statusCloseMsg: "You are close to being qualified for this job.",
    statusBelowMsg: "Unfortunately, you are not currently qualified for this job. Explore similar jobs that match your skills.",
    statusExcellentBadge: "Excellent Match",
    statusCloseBadge: "Close Match",
    statusBelowBadge: "Development Required",
    langBtn: "العربية",
    selectRole: "Switch Target Job",
    levelLabels: ["None", "Novice", "Familiar", "Intermediate", "Advanced", "Expert"]
  },
  ar: {
    appTitle: "Smart Application — التطبيق الذكي",
    appSubtitle: "مستند إلى بيانات وظائف لينكدإن (2023–2024)",
    presetsLabel: "نماذج اختبار سريعة:",
    inputsTitle: "بيانات المتقدم",
    inputsSubtitle: "أدخل مؤهلاتك وخبراتك لقياس مدى جاهزيتك التنافسية في سوق العمل.",
    labelDegree: "المؤهل العلمي / الشهادة",
    labelJob: "الوظيفة المستهدفة",
    marketSourced: "بيانات لينكدإن 23–24",
    labelExp: "سنوات الخبرة العملية",
    expHelp: "إجمالي سنوات الخبرة ذات الصلة",
    yearsUnit: "سنوات",
    labelSkills: "المهارات التقنية ومستوى الإتقان",
    scaleHint: "مقياس من 0 إلى 5",
    btnEvaluate: "تحليل الجاهزية والتطابق المهني",
    matchScoreLabel: "نسبة التطابق الإجمالية",
    growthMeterTitle: "مقياس إمكانات النمو والتطوير",
    kpiSkill: "توافق المهارات",
    kpiExp: "ملاءمة الخبرة",
    kpiEdu: "المؤهل العلمي",
    alignmentTitle: "تفصيل التوافق الوظيفي",
    alignmentSubtitle: "مقارنة مباشرة بين متطلبات السوق الفعلية ومؤهلات المتقدم الحالية.",
    expComparisonTitle: "مقارنة سنوات الخبرة",
    marketRequired: "متوسط متطلبات السوق",
    applicantCurrent: "خبرة المتقدم الحالية",
    skillsAcquiredTitle: "المهارات المكتسبة والمتوافقة",
    skillsMissingTitle: "المهارات المطلوب تطويرها (الفجوات)",
    recommendationsTitle: "التوصيات القابلة للتنفيذ",
    recommendationsSubtitle: "خيارات بديلة ذكية، مسارات تدريبية مركزة، وخطة تحسين شاملة للجاهزية.",
    similarJobsHeading: "وظائف بديلة مقترحة",
    badgeAllApplicants: "تظهر لجميع المتقدمين",
    skillDevHeading: "توصيات تطوير المهارات التقنية",
    badgeGapApplicants: "تظهر فقط عند نسبة أقل من 70%",
    skillDevDesc: "ركز على هذه المهارات الأساسية لرفع نسبة تأهلك التنافسي إلى أكثر من 80%:",
    readinessPlanHeading: "خطة تحسين الجاهزية المهنية",
    readyNow: "جاهز للمقابلات فوراً",
    weeksFormat: (w) => `تحتاج إلى حوالي ${w} أسابيع من التطوير لتصبح جاهزاً`,
    readyNowDesc: "قاعدتك التقنية وخبرتك العملية تتوافق بشكل ممتاز مع معايير التوظيف الحالية.",
    growthDesc: (w) => `خطة تطوير مكثفة ومشاريع عملية لمدة ${w} أسابيع تقريباً ستسد فجوة المتطلبات.`,
    statusExcellentMsg: "تطابق ممتاز — أنت مؤهل تماماً لهذه الوظيفة.",
    statusCloseMsg: "أنت قريب جداً من التأهل لهذه الوظيفة.",
    statusBelowMsg: "للأسف، أنت لست مؤهلاً حالياً لهذه الوظيفة. استكشف وظائف مشابهة تتناسب مع مهاراتك.",
    statusExcellentBadge: "تطابق ممتاز",
    statusCloseBadge: "قريب من التأهل",
    statusBelowBadge: "يحتاج إلى تطوير",
    langBtn: "English",
    selectRole: "اختيار كوظيفة مستهدفة",
    levelLabels: ["لا يوجد", "مبتدئ", "معرفة أساسية", "متوسط", "متقدم", "خبير"]
  }
};

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initDegreeSelect();
  initJobSelect();
  initPresetsBanner();
  initExperienceSlider();
  setupEventListeners();
  loadJobSkills(state.currentJobId);
  applyTranslations();
  
  // Initial calculation with default inputs
  evaluateApplicant();
});

/* ==========================================================================
   FORM CONTROLS & DROPDOWNS
   ========================================================================== */
function initDegreeSelect() {
  const select = document.getElementById('degree-select');
  select.innerHTML = '';
  EDUCATION_LEVELS.forEach(lvl => {
    const opt = document.createElement('option');
    opt.value = lvl.id;
    opt.textContent = state.lang === 'ar' ? lvl.nameAr : lvl.name;
    if (lvl.id === state.currentDegree) opt.selected = true;
    select.appendChild(opt);
  });
}

function initJobSelect() {
  const select = document.getElementById('job-select');
  select.innerHTML = '';
  
  // Group by categories
  const categories = {};
  JOB_MARKET_DATABASE.forEach(job => {
    const cat = state.lang === 'ar' ? job.categoryAr : job.category;
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(job);
  });

  for (const [catName, jobs] of Object.entries(categories)) {
    const optGroup = document.createElement('optgroup');
    optGroup.label = catName;
    jobs.forEach(job => {
      const opt = document.createElement('option');
      opt.value = job.id;
      opt.textContent = state.lang === 'ar' ? job.titleAr : job.title;
      if (job.id === state.currentJobId) opt.selected = true;
      optGroup.appendChild(opt);
    });
    select.appendChild(optGroup);
  }
}

function initPresetsBanner() {
  const container = document.getElementById('presets-container');
  container.innerHTML = '';
  
  CANDIDATE_PRESETS.forEach(preset => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-chip';
    btn.textContent = state.lang === 'ar' ? preset.nameAr : preset.name;
    btn.addEventListener('click', () => applyPreset(preset));
    container.appendChild(btn);
  });
}

function applyPreset(preset) {
  state.currentDegree = preset.degree;
  state.currentJobId = preset.targetJob;
  state.currentExp = preset.experience;
  
  // Update inputs
  document.getElementById('degree-select').value = preset.degree;
  document.getElementById('job-select').value = preset.targetJob;
  document.getElementById('experience-range').value = preset.experience;
  document.getElementById('exp-val-display').textContent = preset.experience;

  // Load skills
  loadJobSkills(preset.targetJob, preset.skills);
  evaluateApplicant();
}

function initExperienceSlider() {
  const range = document.getElementById('experience-range');
  const display = document.getElementById('exp-val-display');
  
  range.addEventListener('input', (e) => {
    state.currentExp = parseFloat(e.target.value);
    display.textContent = state.currentExp;
  });
}

function setupEventListeners() {
  // Job Change
  document.getElementById('job-select').addEventListener('change', (e) => {
    state.currentJobId = e.target.value;
    loadJobSkills(state.currentJobId);
  });

  // Degree Change
  document.getElementById('degree-select').addEventListener('change', (e) => {
    state.currentDegree = e.target.value;
  });

  // Language Toggle
  document.getElementById('lang-toggle-btn').addEventListener('click', () => {
    state.lang = state.lang === 'en' ? 'ar' : 'en';
    document.documentElement.setAttribute('dir', state.lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', state.lang);
    
    initDegreeSelect();
    initJobSelect();
    initPresetsBanner();
    loadJobSkills(state.currentJobId, state.skillsState);
    applyTranslations();
    evaluateApplicant();
  });

  // Theme Toggle
  document.getElementById('theme-toggle-btn').addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    const icon = document.getElementById('theme-icon');
    if (state.theme === 'light') {
      icon.className = 'fa-solid fa-sun';
    } else {
      icon.className = 'fa-solid fa-moon';
    }
  });
}

/* ==========================================================================
   SKILLS LIST & 0 TO 5 PROFICIENCY SCALE
   ========================================================================= */
function loadJobSkills(jobId, existingSkills = null) {
  const job = JOB_MARKET_DATABASE.find(j => j.id === jobId);
  if (!job) return;

  const container = document.getElementById('skills-list-container');
  container.innerHTML = '';
  state.skillsState = {};

  const t = TRANSLATIONS[state.lang];

  job.coreSkills.forEach(skill => {
    // Default proficiency or restored from existing
    let currentLevel = 0;
    if (existingSkills && existingSkills[skill.name] !== undefined) {
      currentLevel = existingSkills[skill.name];
    } else {
      // Sensible baseline: 2 or 3
      currentLevel = Math.max(1, skill.requiredLevel - 1);
    }
    state.skillsState[skill.name] = currentLevel;

    const row = document.createElement('div');
    row.className = 'skill-row';

    const skillLabel = state.lang === 'ar' ? skill.nameAr : skill.name;
    const reqTagText = `${state.lang === 'ar' ? 'المطلوب' : 'Req'}: ${skill.requiredLevel}/5`;

    row.innerHTML = `
      <div class="skill-row-top">
        <div class="skill-name">
          <span>${skillLabel}</span>
          <span class="skill-req-tag">${reqTagText}</span>
        </div>
        <div class="skill-user-level-badge" id="badge-level-${cleanId(skill.name)}">
          ${t.levelLabels[currentLevel]} (${currentLevel}/5)
        </div>
      </div>
      <div class="proficiency-scale" id="scale-group-${cleanId(skill.name)}">
        <!-- 0 to 5 buttons -->
      </div>
    `;

    const scaleGroup = row.querySelector('.proficiency-scale');
    for (let i = 0; i <= 5; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `scale-btn ${i === currentLevel ? 'active' : ''}`;
      btn.setAttribute('data-skill', skill.name);
      btn.setAttribute('data-level', i);
      btn.innerHTML = `
        <span class="scale-num">${i}</span>
        <span class="scale-desc">${t.levelLabels[i]}</span>
      `;

      btn.addEventListener('click', () => {
        // Update state
        state.skillsState[skill.name] = i;
        
        // Update active class on siblings
        scaleGroup.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update badge
        const badge = row.querySelector(`#badge-level-${cleanId(skill.name)}`);
        if (badge) {
          badge.textContent = `${t.levelLabels[i]} (${i}/5)`;
        }
      });

      scaleGroup.appendChild(btn);
    }

    container.appendChild(row);
  });
}

function cleanId(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '_');
}

/* ==========================================================================
   EVALUATION ENGINE (MATCH SCORE & READINESS CALCULATION)
   ========================================================================== */
window.evaluateApplicant = function() {
  const currentJob = JOB_MARKET_DATABASE.find(j => j.id === state.currentJobId);
  if (!currentJob) return;

  const t = TRANSLATIONS[state.lang];

  // 1. Skill Match Score (Weight: 65%)
  let totalSkillWeight = 0;
  let earnedSkillScore = 0;
  let missingSkillCount = 0;
  let totalMissingSkillUnits = 0;
  let missingSkillsDetails = [];
  let acquiredSkillsDetails = [];

  currentJob.coreSkills.forEach(skill => {
    const userLevel = state.skillsState[skill.name] ?? 0;
    const reqLevel = skill.requiredLevel;
    const weight = skill.weight || 1.0;
    totalSkillWeight += weight;

    if (userLevel >= reqLevel) {
      // Full points + subtle mastery bonus
      const bonus = userLevel > reqLevel ? 0.05 : 0;
      earnedSkillScore += (1.0 + bonus) * weight;
      acquiredSkillsDetails.push({
        skill,
        userLevel,
        reqLevel,
        surplus: userLevel - reqLevel
      });
    } else {
      const ratio = userLevel / reqLevel;
      earnedSkillScore += ratio * weight;
      const gap = reqLevel - userLevel;
      missingSkillCount++;
      totalMissingSkillUnits += gap;
      missingSkillsDetails.push({
        skill,
        userLevel,
        reqLevel,
        gap,
        learningWeeks: Math.ceil(gap * (skill.learningWeeks || 1.5))
      });
    }
  });

  const rawSkillPct = totalSkillWeight > 0 ? (earnedSkillScore / totalSkillWeight) * 100 : 0;
  const skillScore = Math.min(100, Math.max(0, rawSkillPct));

  // 2. Experience Score (Weight: 25%)
  const userExp = state.currentExp;
  const reqExp = currentJob.requiredExperience;
  let expScore = 0;
  if (userExp >= reqExp) {
    expScore = 100;
  } else {
    // Supportive non-punitive curve: base 35% + scaled progression
    const ratio = userExp / (reqExp || 1);
    expScore = Math.min(100, Math.max(30, (ratio * 70) + 30));
  }

  // 3. Education Score (Weight: 10%)
  const eduItem = EDUCATION_LEVELS.find(e => e.id === state.currentDegree);
  const eduScore = eduItem ? eduItem.scoreVal : 80;

  // Overall Balanced Match Score (0 - 100%)
  let overallScore = Math.round((0.65 * skillScore) + (0.25 * expScore) + (0.10 * eduScore));
  overallScore = Math.min(100, Math.max(10, overallScore));

  // 4. Growth Potential Meter (Estimated Weeks to Readiness)
  let estimatedWeeks = 0;
  if (overallScore >= 80) {
    estimatedWeeks = 0;
  } else if (overallScore >= 70) {
    // Close match: 2 to 4 weeks targeted development
    estimatedWeeks = Math.max(2, Math.min(4, Math.round(totalMissingSkillUnits * 1.2)));
  } else {
    // Below 70%: 5 to 10 weeks
    estimatedWeeks = Math.max(5, Math.min(12, Math.round(totalMissingSkillUnits * 1.5) + (userExp < reqExp ? 2 : 0)));
  }

  // Save result to state
  state.lastResult = {
    overallScore,
    skillScore: Math.round(skillScore),
    expScore: Math.round(expScore),
    eduScore,
    estimatedWeeks,
    acquiredSkillsDetails,
    missingSkillsDetails,
    currentJob
  };

  // Render Visual Blocks
  renderBlock1Dashboard(state.lastResult, t);
  renderBlock2Alignment(state.lastResult, t);
  renderBlock3Recommendations(state.lastResult, t);
};

/* ==========================================================================
   BLOCK 1: TOP DASHBOARD (VISUAL OVERVIEW) RENDERING
   ========================================================================== */
function renderBlock1Dashboard(res, t) {
  const { overallScore, skillScore, estimatedWeeks, currentJob } = res;

  // Animate Gauge & Percentage Counter
  animateScoreCounter(overallScore);
  updateGaugeCircle(overallScore);

  // Status Banner with STRICT Prompt Requirements:
  // 80% – 100%: "Excellent Match — You are highly qualified for this job."
  // 70% – 79%: "You are close to being qualified for this job."
  // Below 70%: "Unfortunately, you are not currently qualified for this job. Explore similar jobs that match your skills."
  const banner = document.getElementById('status-banner');
  const badgeText = document.getElementById('status-badge-text');
  const messageText = document.getElementById('status-message-text');

  banner.className = 'status-banner';

  if (overallScore >= 80) {
    banner.classList.add('match-excellent');
    badgeText.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${t.statusExcellentBadge}`;
    messageText.textContent = t.statusExcellentMsg;
  } else if (overallScore >= 70) {
    banner.classList.add('match-close');
    badgeText.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${t.statusCloseBadge}`;
    messageText.textContent = t.statusCloseMsg;
  } else {
    banner.classList.add('match-growth');
    badgeText.innerHTML = `<i class="fa-solid fa-compass"></i> ${t.statusBelowBadge}`;
    messageText.textContent = t.statusBelowMsg;
  }

  // Growth Potential Meter
  const growthBadge = document.getElementById('growth-time-badge');
  const growthTimeVal = document.getElementById('growth-time-val');
  const growthFill = document.getElementById('growth-progress-fill');
  const growthDesc = document.getElementById('growth-description-text');

  if (estimatedWeeks === 0) {
    growthTimeVal.textContent = t.readyNow;
    growthFill.style.width = '100%';
    growthFill.style.background = 'linear-gradient(90deg, #10b981, #059669)';
    growthDesc.textContent = t.readyNowDesc;
  } else {
    // Format: "You need about X weeks of development to become ready"
    const textWeeks = t.weeksFormat(estimatedWeeks);
    growthTimeVal.textContent = textWeeks;
    // Readiness percentage: closer to 100% as score is higher
    const readyPct = Math.min(95, Math.max(30, overallScore));
    growthFill.style.width = `${readyPct}%`;
    growthFill.style.background = 'linear-gradient(90deg, #6366f1, #06b6d4, #10b981)';
    growthDesc.textContent = t.growthDesc(estimatedWeeks);
  }

  // KPI Indicators
  document.getElementById('kpi-skill-val').textContent = `${skillScore}%`;
  
  const expDelta = state.currentExp - currentJob.requiredExperience;
  const expFitText = expDelta >= 0 
    ? (state.lang === 'ar' ? `مكتمل (+${expDelta} سنة)` : `Strong (+${expDelta}y)`)
    : (state.lang === 'ar' ? `قريب (${expDelta} سنة)` : `Near (${expDelta}y)`);
  document.getElementById('kpi-exp-val').textContent = expFitText;

  const eduLabel = EDUCATION_LEVELS.find(e => e.id === state.currentDegree);
  document.getElementById('kpi-edu-val').textContent = state.lang === 'ar' ? eduLabel.nameAr : eduLabel.name;
}

function animateScoreCounter(targetScore) {
  const counter = document.getElementById('score-counter');
  let current = 0;
  const duration = 1000;
  const start = performance.now();

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // Smooth ease-out quad
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    current = Math.round(easeProgress * targetScore);
    counter.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.textContent = targetScore;
    }
  }

  requestAnimationFrame(update);
}

function updateGaugeCircle(score) {
  const circle = document.getElementById('gauge-bar');
  const circumference = 2 * Math.PI * 90; // ~565.48
  const offset = circumference - (score / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

/* ==========================================================================
   BLOCK 2: JOB ALIGNMENT BREAKDOWN RENDERING
   ========================================================================== */
function renderBlock2Alignment(res, t) {
  const { currentJob, acquiredSkillsDetails, missingSkillsDetails } = res;

  // Header meta
  document.getElementById('breakdown-job-title').textContent = state.lang === 'ar' ? currentJob.titleAr : currentJob.title;
  document.getElementById('breakdown-job-category').textContent = state.lang === 'ar' ? currentJob.categoryAr : currentJob.category;
  document.getElementById('breakdown-job-salary').textContent = currentJob.avgSalary;
  document.getElementById('breakdown-job-demand').textContent = `${state.lang === 'ar' ? 'الطلب:' : 'Demand:'} ${state.lang === 'ar' ? currentJob.marketDemandAr : currentJob.marketDemand}`;
  
  const minEduName = currentJob.minDegree === 'master' 
    ? (state.lang === 'ar' ? 'ماجستير مطلوب' : "Min: Master's") 
    : (state.lang === 'ar' ? 'بكالوريوس مطلوب' : "Min: Bachelor's");
  document.getElementById('breakdown-job-degree-badge').innerHTML = `<i class="fa-solid fa-graduation-cap"></i> ${minEduName}`;

  // Experience comparison bar
  const maxScale = Math.max(8, currentJob.requiredExperience * 1.5);
  const reqPct = Math.min(100, (currentJob.requiredExperience / maxScale) * 100);
  const userPct = Math.min(100, (state.currentExp / maxScale) * 100);

  document.getElementById('exp-req-text').textContent = `${currentJob.requiredExperience} ${t.yearsUnit}`;
  document.getElementById('exp-user-text').textContent = `${state.currentExp} ${t.yearsUnit}`;
  document.getElementById('exp-req-fill').style.width = `${reqPct}%`;
  document.getElementById('exp-user-fill').style.width = `${userPct}%`;

  const deltaBadge = document.getElementById('exp-delta-badge');
  const diff = state.currentExp - currentJob.requiredExperience;
  if (diff >= 0) {
    deltaBadge.className = 'exp-delta-badge delta-surplus';
    deltaBadge.innerHTML = `<i class="fa-solid fa-check"></i> ${state.lang === 'ar' ? `يتجاوز متطلب الخبرة بمقدار +${diff} سنة` : `Surpasses experience requirement by +${diff} years`}`;
  } else {
    deltaBadge.className = 'exp-delta-badge delta-gap';
    deltaBadge.innerHTML = `<i class="fa-solid fa-clock"></i> ${state.lang === 'ar' ? `فارق خبرة بمقدار ${Math.abs(diff)} سنة (تعوضه المهارات المتقدمة)` : `Experience delta: ${Math.abs(diff)} yrs (compensable via project depth)`}`;
  }

  // Skills Breakdown: Acquired vs Missing
  const acquiredContainer = document.getElementById('acquired-skills-container');
  const missingContainer = document.getElementById('missing-skills-container');

  acquiredContainer.innerHTML = '';
  missingContainer.innerHTML = '';

  if (acquiredSkillsDetails.length === 0) {
    acquiredContainer.innerHTML = `<span style="font-size: 0.8rem; color: var(--text-dim);">${state.lang === 'ar' ? 'لم يتم استيفاء أي مهارة بعد' : 'No fully matched skills yet'}</span>`;
  } else {
    acquiredSkillsDetails.forEach(item => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag tag-acquired';
      const name = state.lang === 'ar' ? item.skill.nameAr : item.skill.name;
      tag.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <span>${name}</span>
        <span class="tag-level-indicator">${item.userLevel}/${item.reqLevel}</span>
      `;
      acquiredContainer.appendChild(tag);
    });
  }

  if (missingSkillsDetails.length === 0) {
    missingContainer.innerHTML = `<span style="font-size: 0.8rem; color: #34d399;"><i class="fa-solid fa-star"></i> ${state.lang === 'ar' ? 'تهانينا! لا توجد فجوات مهارية في هذا الدور' : 'All target core skills fully acquired!'}</span>`;
  } else {
    missingSkillsDetails.forEach(item => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag tag-missing';
      const name = state.lang === 'ar' ? item.skill.nameAr : item.skill.name;
      tag.innerHTML = `
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span>${name}</span>
        <span class="tag-level-indicator">${item.userLevel} → ${item.reqLevel} (+${item.gap})</span>
      `;
      missingContainer.appendChild(tag);
    });
  }
}

/* ==========================================================================
   BLOCK 3: ACTIONABLE RECOMMENDATIONS RENDERING
   ========================================================================== */
function renderBlock3Recommendations(res, t) {
  const { overallScore, missingSkillsDetails, currentJob } = res;

  // ------------------------------------------------------------------------
  // 3.1: Similar Job Recommendations (SHOWN TO ALL APPLICANTS)
  // ------------------------------------------------------------------------
  const similarContainer = document.getElementById('similar-jobs-container');
  similarContainer.innerHTML = '';

  // Calculate matching scores across all other jobs in the dataset
  const alternativeJobs = JOB_MARKET_DATABASE
    .filter(j => j.id !== currentJob.id)
    .map(otherJob => {
      // Calculate match against applicant's current skills
      let weightSum = 0;
      let earnedScore = 0;
      otherJob.coreSkills.forEach(s => {
        const userLevel = state.skillsState[s.name] ?? 0;
        const w = s.weight || 1.0;
        weightSum += w;
        if (userLevel >= s.requiredLevel) {
          earnedScore += 1.0 * w;
        } else {
          earnedScore += (userLevel / s.requiredLevel) * w;
        }
      });
      const skillScore = weightSum > 0 ? (earnedScore / weightSum) * 100 : 0;
      const expRatio = Math.min(1, state.currentExp / (otherJob.requiredExperience || 1));
      const expScore = (expRatio * 70) + 30;
      const simScore = Math.round((0.65 * skillScore) + (0.25 * expScore) + (0.10 * 90));

      return {
        job: otherJob,
        matchScore: Math.min(100, Math.max(15, simScore))
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3); // Top 3 similar roles

  alternativeJobs.forEach(alt => {
    const card = document.createElement('div');
    card.className = 'similar-job-card';
    const title = state.lang === 'ar' ? alt.job.titleAr : alt.job.title;
    const cat = state.lang === 'ar' ? alt.job.categoryAr : alt.job.category;

    card.innerHTML = `
      <div>
        <div class="job-card-top">
          <div class="job-card-title">${title}</div>
          <span class="job-card-score">${alt.matchScore}%</span>
        </div>
        <div class="job-card-meta" style="margin-top: 0.5rem;">
          <span>${cat}</span>
          <span>${alt.job.avgSalary}</span>
        </div>
      </div>
      <button type="button" class="job-card-select-btn">
        <i class="fa-solid fa-arrow-right"></i> ${t.selectRole}
      </button>
    `;

    card.addEventListener('click', () => {
      // Switch target job to this role and evaluate
      state.currentJobId = alt.job.id;
      document.getElementById('job-select').value = alt.job.id;
      loadJobSkills(alt.job.id, state.skillsState);
      evaluateApplicant();
      // Smooth scroll back to top of dashboard
      document.getElementById('block-dashboard').scrollIntoView({ behavior: 'smooth' });
    });

    similarContainer.appendChild(card);
  });

  // ------------------------------------------------------------------------
  // 3.2: Skill Development Recommendations (SHOWN ONLY TO APPLICANTS < 70%)
  // ------------------------------------------------------------------------
  const skillDevSection = document.getElementById('skill-dev-section');
  const skillGapCards = document.getElementById('skill-gap-cards-container');
  skillGapCards.innerHTML = '';

  if (overallScore < 70) {
    // Show section
    skillDevSection.style.display = 'flex';

    if (missingSkillsDetails.length === 0) {
      skillGapCards.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted);">${state.lang === 'ar' ? 'قم بزيادة سنوات الخبرة العملية لرفع النسبة.' : 'Focus on acquiring practical workplace experience.'}</p>`;
    } else {
      missingSkillsDetails.forEach(item => {
        const card = document.createElement('div');
        card.className = 'skill-gap-card';
        const name = state.lang === 'ar' ? item.skill.nameAr : item.skill.name;
        const priorityText = item.gap >= 2 
          ? (state.lang === 'ar' ? 'أولوية قصوى' : 'High Priority')
          : (state.lang === 'ar' ? 'أولوية متوسطة' : 'Medium Priority');

        const tipText = state.lang === 'ar'
          ? `ارفع مستواك من ${item.userLevel} إلى ${item.reqLevel} عبر إنجاز مشاريع عملية وتطبيقات واقعية.`
          : `Advance proficiency from level ${item.userLevel} to ${item.reqLevel} through hands-on benchmark projects.`;

        card.innerHTML = `
          <div class="gap-card-head">
            <span class="gap-skill-name">${name}</span>
            <span class="gap-priority-badge">${priorityText}</span>
          </div>
          <div class="gap-learning-time">
            <i class="fa-regular fa-clock"></i>
            <span>${item.learningWeeks} ${state.lang === 'ar' ? 'أسابيع مقترحة' : 'weeks estimated'}</span>
          </div>
          <p class="gap-action-tip">${tipText}</p>
        `;
        skillGapCards.appendChild(card);
      });
    }
  } else {
    // Hide section strictly as required by prompt
    skillDevSection.style.display = 'none';
  }

  // ------------------------------------------------------------------------
  // 3.3: Readiness Improvement Plan
  // ------------------------------------------------------------------------
  const timelineContainer = document.getElementById('readiness-timeline-container');
  timelineContainer.innerHTML = '';

  const tracks = currentJob.learningTracks || [
    {
      weekRange: "Weeks 1 - 2",
      weekRangeAr: "الأسابيع 1 - 2",
      focus: "Foundational Gap Closure",
      focusAr: "سد الفجوات التقنية الأساسية",
      action: "Review core frameworks, syntax, and foundational patterns."
    },
    {
      weekRange: "Weeks 3 - 4",
      weekRangeAr: "الأسابيع 3 - 4",
      focus: "Applied Project Construction",
      focusAr: "بناء مشاريع تطبيقية واقعية",
      action: "Build an end-to-end portfolio project solving actual industry use cases."
    },
    {
      weekRange: "Weeks 5+",
      weekRangeAr: "الأسابيع 5 فما فوق",
      focus: "Interview Preparation & LinkedIn Branding",
      focusAr: "الجاهزية للمقابلات وتحسين الملف الشخصي",
      action: "Refine LinkedIn profile with relevant keywords and practice technical interview simulations."
    }
  ];

  tracks.forEach(step => {
    const item = document.createElement('div');
    item.className = 'timeline-step';
    const period = state.lang === 'ar' ? step.weekRangeAr : step.weekRange;
    const title = state.lang === 'ar' ? step.focusAr : step.focus;
    const desc = step.action;

    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-header">
        <span class="timeline-period">${period}</span>
      </div>
      <div class="timeline-title">${title}</div>
      <p class="timeline-desc">${desc}</p>
    `;
    timelineContainer.appendChild(item);
  });
}

/* ==========================================================================
   BILINGUAL I18N TEXT UPDATER
   ========================================================================== */
function applyTranslations() {
  const t = TRANSLATIONS[state.lang];

  document.getElementById('i18n-app-title').textContent = t.appTitle;
  document.getElementById('i18n-app-subtitle').innerHTML = `<i class="fa-brands fa-linkedin"></i> ${t.appSubtitle}`;
  document.getElementById('i18n-presets-label').textContent = t.presetsLabel;
  document.getElementById('lang-btn-text').textContent = t.langBtn;

  document.getElementById('i18n-inputs-title').textContent = t.inputsTitle;
  document.getElementById('i18n-inputs-subtitle').textContent = t.inputsSubtitle;
  document.getElementById('i18n-label-degree').innerHTML = `<i class="fa-solid fa-graduation-cap"></i> ${t.labelDegree}`;
  document.getElementById('i18n-label-job').innerHTML = `<i class="fa-solid fa-briefcase"></i> ${t.labelJob}`;
  document.getElementById('i18n-market-sourced').textContent = t.marketSourced;
  document.getElementById('i18n-label-exp').innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> ${t.labelExp}`;
  document.getElementById('i18n-exp-help').textContent = t.expHelp;
  document.getElementById('i18n-years-unit').textContent = t.yearsUnit;
  document.getElementById('i18n-label-skills').innerHTML = `<i class="fa-solid fa-sliders"></i> ${t.labelSkills}`;
  document.getElementById('i18n-scale-hint').textContent = t.scaleHint;
  document.getElementById('i18n-btn-evaluate').textContent = t.btnEvaluate;

  document.getElementById('i18n-match-score-label').textContent = t.matchScoreLabel;
  document.getElementById('i18n-growth-meter-title').textContent = t.growthMeterTitle;
  document.getElementById('i18n-kpi-skill').textContent = t.kpiSkill;
  document.getElementById('i18n-kpi-exp').textContent = t.kpiExp;
  document.getElementById('i18n-kpi-edu').textContent = t.kpiEdu;

  document.getElementById('i18n-alignment-title').textContent = t.alignmentTitle;
  document.getElementById('i18n-alignment-subtitle').textContent = t.alignmentSubtitle;
  document.getElementById('i18n-exp-comparison-title').textContent = t.expComparisonTitle;
  document.getElementById('i18n-market-required').textContent = t.marketRequired;
  document.getElementById('i18n-applicant-current').textContent = t.applicantCurrent;
  document.getElementById('i18n-skills-acquired-title').textContent = t.skillsAcquiredTitle;
  document.getElementById('i18n-skills-missing-title').textContent = t.skillsMissingTitle;

  document.getElementById('i18n-recommendations-title').textContent = t.recommendationsTitle;
  document.getElementById('i18n-recommendations-subtitle').textContent = t.recommendationsSubtitle;
  document.getElementById('similar-jobs-heading').textContent = t.similarJobsHeading;
  document.getElementById('i18n-badge-all-applicants').textContent = t.badgeAllApplicants;
  document.getElementById('skill-dev-heading').textContent = t.skillDevHeading;
  document.getElementById('i18n-badge-gap-applicants').textContent = t.badgeGapApplicants;
  document.getElementById('i18n-skill-dev-desc').textContent = t.skillDevDesc;
  document.getElementById('readiness-plan-heading').textContent = t.readinessPlanHeading;
}
