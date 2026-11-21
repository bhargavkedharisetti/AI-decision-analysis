const examples = [
  "My team keeps missing deadlines, morale is dropping, and we just lost two senior developers this month. Project delivery is at risk and stakeholders are losing confidence.",
  "Our mobile app crashes randomly every few hours on iOS devices but works fine on Android. Users are leaving 1-star reviews and we cannot reproduce the bug in dev environment.",
  "Our monthly sales have dropped 30% over the last quarter. The market is competitive and our biggest client just hinted they might switch to a competitor.",
  "We received an alert that an unknown IP address accessed our database at 3am. Some user data files seem to have been modified. We are unsure if it was a breach.",
  "I need to learn machine learning in 2 months for a career switch. I have basic Python knowledge but no math or statistics background and very limited free time."
];

const ta = document.getElementById('problemInput');
const cc = document.getElementById('charCount');
ta.addEventListener('input', () => {
  const len = ta.value.length;
  cc.textContent = len + ' / 500';
  cc.style.color = len > 400 ? 'var(--accent3)' : 'var(--muted)';
});

function fillExample(i) { ta.value = examples[i]; ta.dispatchEvent(new Event('input')); ta.focus(); }

const DOMAINS = {
  team: { keywords:['team','deadline','developer','morale','employee','manager','staff','colleague','meeting','collaboration','burnout','resign','quit','hire','attrition'], label:'TEAM & MANAGEMENT', color:'#74b9ff', bg:'rgba(116,185,255,0.1)', icon:'🏢' },
  tech: { keywords:['app','bug','crash','code','server','error','api','database','deploy','performance','slow','memory','network','security','breach','hack','vulnerability','ios','android'], label:'TECHNICAL / ENGINEERING', color:'#4fffb0', bg:'rgba(79,255,176,0.1)', icon:'💻' },
  business: { keywords:['sales','revenue','client','customer','market','competitor','profit','growth','product','strategy','brand','pricing','churn','conversion','roi','quarter'], label:'BUSINESS & STRATEGY', color:'#ffd166', bg:'rgba(255,209,102,0.1)', icon:'📊' },
  security: { keywords:['breach','hack','access','unauthorized','attack','malware','phishing','password','firewall','ip','alert','suspicious','data','leak','ransomware'], label:'SECURITY & RISK', color:'#ff6b6b', bg:'rgba(255,107,107,0.1)', icon:'🔒' },
  learning: { keywords:['learn','skill','study','course','training','knowledge','career','switch','improve','practice','understand','master','beginner','machine learning','months'] , label:'LEARNING & GROWTH', color:'#a29bfe', bg:'rgba(162,155,254,0.1)', icon:'🧠' }
};

function detectDomain(text) {
  const t = text.toLowerCase();
  let best = { domain:'team', score:0 };
  for (const [key, val] of Object.entries(DOMAINS)) {
    const score = val.keywords.filter(k => t.includes(k)).length;
    if (score > best.score) best = { domain:key, score };
  }
  return DOMAINS[best.domain];
}

function analyzeSentiment(text) {
  const neg = ['problem','issue','fail','bad','worst','crisis','drop','loss','risk','missing','lost','crash','breach','decline','low','cannot','difficult','struggle','broken','dropping','threat','worried'];
  const t = text.toLowerCase();
  const negCount = neg.filter(w => t.includes(w)).length;
  if (negCount >= 5) return { label:'Critical', color:'var(--accent2)', score:90 };
  if (negCount >= 3) return { label:'Concerning', color:'var(--accent3)', score:70 };
  if (negCount >= 1) return { label:'Moderate', color:'var(--accent4)', score:50 };
  return { label:'Low Risk', color:'var(--accent)', score:30 };
}

function calcDifficulty(text) {
  const t = text.toLowerCase();
  let score = 0;
  if (text.length > 300) score += 2; else if (text.length > 150) score += 1;
  const multi = ['and','also','additionally','furthermore','moreover'];
  if (multi.filter(c => t.includes(c)).length > 1) score += 2;
  const hardWords = ['breach','crisis','losing','lost','crash','fail','critical','emergency','urgent','immediately','serious','dropping','threat'];
  score += hardWords.filter(w => t.includes(w)).length;
  if (t.includes('urgent')||t.includes('immediately')||t.includes('asap')||t.includes('deadline')) score += 2;
  const total = Math.min(score, 10);
  if (total >= 7) return { level:'EXPERT', num:5, color:'#ff6b6b', dots:5 };
  if (total >= 5) return { level:'HARD', num:4, color:'#ffd166', dots:4 };
  if (total >= 3) return { level:'MEDIUM', num:3, color:'#74b9ff', dots:3 };
  if (total >= 1) return { level:'EASY', num:2, color:'#4fffb0', dots:2 };
  return { level:'BASIC', num:1, color:'#a29bfe', dots:1 };
}

function generateSolutions(text, domain) {
  const t = text.toLowerCase();
  const solutions = [];

  if (domain.label.includes('TEAM')) {
    if (t.includes('deadline')||t.includes('missing')) solutions.push({ title:'Implement Sprint-based Task Tracking', desc:'Break projects into 1-week sprints with daily standups. Use tools like Linear or Jira to visualize blockers in real time. Assign each task a clear owner and due date — no ambiguity.', tag:'PROCESS', tagColor:'var(--accent4)' });
    if (t.includes('morale')||t.includes('burnout')||t.includes('resign')||t.includes('lost')) solutions.push({ title:'Conduct Anonymous Team Health Survey', desc:'Run a pulse survey immediately to identify pain points. Act on results visibly within 1 week. Schedule 30-min 1:1s with each team member — morale issues compound fast when left unaddressed.', tag:'PEOPLE', tagColor:'#a29bfe' });
    if (t.includes('developer')||t.includes('hire')||t.includes('senior')||t.includes('attrition')) solutions.push({ title:'Emergency Knowledge Transfer Protocol', desc:'Before any further attrition, document critical systems with remaining senior staff. Set up pair-programming sessions. Post job listings immediately targeting contract-to-hire for speed.', tag:'CRITICAL', tagColor:'var(--accent2)' });
    solutions.push({ title:'Escalate to Leadership with Data', desc:'Prepare a 1-page impact report showing delays, cost of attrition, and projected risk. Stakeholder alignment requires visibility — present this in the next executive meeting.', tag:'STRATEGIC', tagColor:'var(--accent3)' });
  }

  if (domain.label.includes('TECHNICAL')) {
    if (t.includes('crash')||t.includes('bug')||t.includes('error')) {
      solutions.push({ title:'Set Up Crash Analytics Immediately', desc:'Integrate Sentry or Firebase Crashlytics if not already running. Reproduce the crash on a real device — not a simulator. Add verbose logging around the suspected area and review stack traces carefully.', tag:'IMMEDIATE', tagColor:'var(--accent2)' });
      solutions.push({ title:'Binary Search the Codebase for Root Cause', desc:'Identify the last stable git commit and bisect from there. Crashes that differ between platforms (iOS vs Android) often point to platform-specific memory handling or API response parsing issues.', tag:'DEBUGGING', tagColor:'var(--accent)' });
    }
    if (t.includes('security')||t.includes('breach')||t.includes('hack')) {
      solutions.push({ title:'Isolate and Contain the Threat Now', desc:'Immediately revoke all active sessions and rotate all API keys and database passwords. Take the affected system offline if possible. Do not delete any logs — they are forensic evidence.', tag:'CRITICAL', tagColor:'var(--accent2)' });
      solutions.push({ title:'Forensic Investigation and Reporting', desc:'Preserve system snapshots. Trace the suspicious IP activity through auth logs and query logs. Document a full timeline. If user PII was accessed, legal notification may be required within 72 hours.', tag:'SECURITY', tagColor:'var(--accent3)' });
    }
    solutions.push({ title:'Increase Observability and Monitoring', desc:'Add structured logging, distributed tracing, and uptime alerting (Grafana, PagerDuty). Reactive debugging is expensive — shift to proactive monitoring so issues are caught before users report them.', tag:'LONG-TERM', tagColor:'#a29bfe' });
  }

  if (domain.label.includes('BUSINESS')) {
    if (t.includes('sales')||t.includes('revenue')||t.includes('decline')||t.includes('drop')) {
      solutions.push({ title:'Diagnose the Sales Funnel Drop-off Point', desc:'Identify exactly where prospects are leaving — awareness, consideration, or decision stage. A 30% drop is too large to be random. Pull funnel analytics and identify the specific inflection point this week.', tag:'URGENT', tagColor:'var(--accent2)' });
      solutions.push({ title:'Protect and Expand Key Accounts', desc:'Schedule executive-level calls with your top 5 accounts immediately. A churning key client needs retention outreach with visible senior presence. Offer added value, not discounts — discounts erode positioning.', tag:'RETENTION', tagColor:'var(--accent)' });
    }
    if (t.includes('competitor')||t.includes('market')) solutions.push({ title:'Competitive Intelligence Sprint', desc:'Document competitor positioning, pricing, and recent product moves. Identify your differentiation gap. A focused 2-day workshop on repositioning your value proposition can shift perception quickly.', tag:'STRATEGY', tagColor:'var(--accent3)' });
    solutions.push({ title:'Focus on Existing Revenue Before New Acquisition', desc:'Upselling to existing customers costs 5x less than acquiring new ones. Run a win-back campaign for churned customers from the last 90 days — they already know and have used your product.', tag:'TACTICAL', tagColor:'var(--accent4)' });
  }

  if (domain.label.includes('SECURITY')) {
    solutions.push({ title:'Immediate Containment — Isolate the System', desc:'Disconnect the affected system from the internet. Revoke all credentials and rotate secrets from a clean device. Do NOT wipe anything — logs are forensic evidence. Change all admin passwords immediately.', tag:'CRITICAL NOW', tagColor:'var(--accent2)' });
    solutions.push({ title:'Forensic Investigation Protocol', desc:'Preserve all logs (auth, query, system). Use log analysis to trace what the suspicious IP accessed and when. Document a precise timeline — what data was touched, modified, or exfiltrated.', tag:'FORENSICS', tagColor:'var(--accent3)' });
    solutions.push({ title:'User and Regulatory Notification', desc:'If user PII was accessed, GDPR and CCPA require breach notification within 72 hours. Consult legal immediately. Transparent disclosure is legally and reputationally better than delayed silence.', tag:'LEGAL', tagColor:'var(--accent4)' });
    solutions.push({ title:'Post-Incident Security Hardening', desc:'After containment: enforce MFA everywhere, rotate all secrets through a vault (HashiCorp Vault), enable database query auditing, and deploy anomaly detection for future access pattern alerts.', tag:'PREVENTION', tagColor:'var(--accent)' });
  }

  if (domain.label.includes('LEARNING')) {
    solutions.push({ title:'Build a Structured 8-Week Learning Path', desc:'Week 1-2: Python refresher plus NumPy and Pandas. Week 3-4: Statistics basics via Khan Academy. Week 5-6: ML concepts with fast.ai or Andrew Ng course. Week 7-8: One real project end-to-end.', tag:'ROADMAP', tagColor:'var(--accent)' });
    solutions.push({ title:'Learn by Building, Not Just Watching', desc:'After every concept, immediately build something small with it. Passive video watching has a 90% forget rate. Use Kaggle beginner datasets. Spend 60% of your time coding, 40% learning theory.', tag:'METHOD', tagColor:'var(--accent4)' });
    solutions.push({ title:'Protect Your Learning Time Ruthlessly', desc:'Block 90-minute deep work sessions in your calendar and treat them like client meetings. Four focused hours per week beats 20 hours of distracted watching. Communicate boundaries to your team.', tag:'HABIT', tagColor:'#a29bfe' });
    if (t.includes('career')||t.includes('switch')) solutions.push({ title:'Build a Public Portfolio From Day One', desc:'Start a GitHub from week one. Every project — no matter how small — gets pushed. Recruiters hiring career switchers care about evidence of learning over credentials. One strong demo outweighs a resume line.', tag:'CAREER', tagColor:'var(--accent3)' });
  }

  while (solutions.length < 3) {
    solutions.push({ title:'Decompose the Problem Into Smaller Parts', desc:'Complex issues become manageable when broken down. List every sub-problem separately, rank by impact and urgency, and tackle the highest-leverage item first before moving to the rest.', tag:'GENERAL', tagColor:'var(--muted2)' });
  }
  return solutions.slice(0, 4);
}

function getPrediction(text, domain, difficulty, sentiment) {
  if (difficulty.level === 'EXPERT' || difficulty.level === 'HARD') {
    return `This is a <strong style="color:${difficulty.color}">${difficulty.level.toLowerCase()}-level</strong> ${domain.icon} ${domain.label.toLowerCase().split('&')[0].trim()} problem. Without immediate structured intervention, the AI predicts a high probability of compounding issues within 2–4 weeks. Urgent, prioritized action across multiple fronts is required.`;
  } else if (difficulty.level === 'MEDIUM') {
    return `A <strong style="color:${difficulty.color}">medium-complexity</strong> ${domain.icon} challenge in the ${domain.label.toLowerCase().split('&')[0].trim()} space. The AI predicts a <strong style="color:var(--accent)">${100 - difficulty.num*10 + 10}% resolution probability</strong> with focused execution over 2–3 weeks. Structured solutions below will guide you step by step.`;
  }
  return `A <strong style="color:${difficulty.color}">manageable</strong> ${domain.icon} problem with clear resolution pathways. The AI predicts full resolution within <strong>1–2 weeks</strong> with the right actions applied consistently. High probability of positive outcome.`;
}

let history = [];
function addToHistory(text, domain, difficulty) {
  history.unshift({ text, domain, difficulty });
  if (history.length > 6) history.pop();
  renderHistory();
}
function renderHistory() {
  const section = document.getElementById('historySection');
  const grid = document.getElementById('historyGrid');
  if (history.length === 0) { section.style.display='none'; return; }
  section.style.display = 'block';
  document.getElementById('histCount').textContent = history.length + ' saved';
  grid.innerHTML = history.map((h,i) => `
    <div class="history-card" onclick="reloadHistory(${i})">
      <div class="hist-cat">${h.domain.icon} ${h.domain.label}</div>
      <div class="hist-text">${h.text}</div>
      <div class="hist-diff" style="color:${h.difficulty.color}">${h.difficulty.level} difficulty</div>
    </div>`).join('');
}
function reloadHistory(i) { ta.value = history[i].text; ta.dispatchEvent(new Event('input')); window.scrollTo({top:0,behavior:'smooth'}); }

async function animateSteps() {
  for (let i=1;i<=5;i++) {
    const el = document.getElementById('step'+i);
    el.classList.add('active');
    el.querySelector('.proc-icon').textContent = '●';
    await new Promise(r=>setTimeout(r,380));
    el.classList.remove('active');
    el.classList.add('done');
    el.querySelector('.proc-icon').textContent = '✓';
  }
}

async function analyzeProblem() {
  const text = ta.value.trim();
  if (text.length < 10) { ta.style.borderColor='var(--accent2)'; ta.focus(); setTimeout(()=>ta.style.borderColor='',1500); return; }
  for (let i=1;i<=5;i++) { const el=document.getElementById('step'+i); el.className='proc-step'; el.querySelector('.proc-icon').textContent='○'; }
  const btn = document.getElementById('analyzeBtn');
  btn.disabled = true;
  const pb = document.getElementById('processingBox');
  pb.style.display = 'block';
  document.getElementById('resultsContainer').style.display = 'none';
  pb.scrollIntoView({behavior:'smooth',block:'center'});
  animateSteps();
  await new Promise(r=>setTimeout(r,2200));
  const domain = detectDomain(text);
  const difficulty = calcDifficulty(text);
  const sentiment = analyzeSentiment(text);
  const solutions = generateSolutions(text, domain);
  const prediction = getPrediction(text, domain, difficulty, sentiment);
  const confidence = Math.max(72, Math.min(97, 85 + (text.length/50) - (difficulty.num*2)));
  pb.style.display = 'none';
  renderResults({ domain, difficulty, sentiment, solutions, prediction, confidence });
  addToHistory(text, domain, difficulty);
  btn.disabled = false;
}

function renderResults({domain, difficulty, sentiment, solutions, prediction, confidence}) {
  const container = document.getElementById('resultsContainer');
  container.style.display = 'block';
  const diffDots = Array.from({length:5},(_,i)=>`<div class="diff-dot" style="${i<difficulty.dots?'background:'+difficulty.color+';box-shadow:0 0 6px '+difficulty.color+'66;':''}"></div>`).join('');
  const solsHTML = solutions.map((s,i)=>`
    <div class="solution-item" style="animation-delay:${i*0.1+0.2}s">
      <div class="sol-num" style="background:rgba(79,255,176,0.08);color:var(--accent);border:1px solid rgba(79,255,176,0.2);">0${i+1}</div>
      <div class="sol-content">
        <div class="sol-title">${s.title}</div>
        <div class="sol-desc">${s.desc}</div>
        <span class="sol-tag" style="background:${s.tagColor}22;color:${s.tagColor};border:1px solid ${s.tagColor}44;">▸ ${s.tag}</span>
      </div>
    </div>`).join('');

  container.innerHTML = `
    <div class="prediction-card" style="border-color:${domain.color}33;">
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at top left,${domain.color}08,transparent 60%);pointer-events:none;border-radius:20px;"></div>
      <div class="pred-header">
        <div>
          <div class="pred-category" style="background:${domain.bg};color:${domain.color};border:1px solid ${domain.color}33;">${domain.icon} ${domain.label}</div>
          <div class="pred-title">AI Prediction &amp; Analysis</div>
        </div>
        <div class="difficulty-badge">
          <div class="diff-label">Difficulty</div>
          <div class="diff-value" style="color:${difficulty.color}">${difficulty.level}</div>
          <div class="diff-meter">${diffDots}</div>
        </div>
      </div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:18px 20px;margin-bottom:20px;font-size:15px;line-height:1.7;color:var(--muted2);">
        <span style="color:var(--accent);font-family:'DM Mono',monospace;font-size:11px;letter-spacing:2px;display:block;margin-bottom:8px;">▸ PREDICTION</span>
        ${prediction}
      </div>
      <div class="analysis-grid">
        <div class="analysis-card">
          <div class="an-label">Urgency Level</div>
          <div class="an-value" style="color:${sentiment.color}">${sentiment.label}</div>
          <div class="an-bar"><div class="an-fill" data-w="${sentiment.score}" style="background:${sentiment.color};width:0%"></div></div>
        </div>
        <div class="analysis-card">
          <div class="an-label">Problem Complexity</div>
          <div class="an-value" style="color:${difficulty.color}">${difficulty.level}</div>
          <div class="an-bar"><div class="an-fill" data-w="${difficulty.num*20}" style="background:${difficulty.color};width:0%"></div></div>
        </div>
        <div class="analysis-card">
          <div class="an-label">Resolution Chance</div>
          <div class="an-value" style="color:var(--accent)">${Math.round(100-difficulty.num*10+10)}%</div>
          <div class="an-bar"><div class="an-fill" data-w="${100-difficulty.num*10+10}" style="background:var(--accent);width:0%"></div></div>
        </div>
      </div>
      <div class="section-divider"></div>
      <div class="solutions-label">▸ RECOMMENDED SOLUTIONS (${solutions.length})</div>
      <div class="solutions-list">${solsHTML}</div>
      <div class="confidence-row">
        <span style="font-size:20px;">🎯</span>
        <div class="conf-text">AI analysis confidence based on natural language processing, domain classification, and pattern matching across similar problem types.</div>
        <div class="conf-pct">${Math.round(confidence)}%</div>
      </div>
    </div>`;

  setTimeout(()=>{
    container.querySelectorAll('.an-fill').forEach(el=>{ el.style.width=el.dataset.w+'%'; });
  }, 200);
  container.scrollIntoView({behavior:'smooth',block:'start'});
}
