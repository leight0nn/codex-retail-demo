const pptxgen = require('pptxgenjs');
const {
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds,
} = require('./pptxgenjs_helpers/layout');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5
pptx.author = 'AI Deployment Manager';
pptx.company = 'Fortune 500 Retail';
pptx.subject = 'Codex local deployment enablement';
pptx.title = 'Retail Engineering Codex Enablement';
pptx.lang = 'en-US';
pptx.theme = {
  headFontFace: 'Aptos Display',
  bodyFontFace: 'Aptos',
  lang: 'en-US',
};

const C = {
  white: 'FFFFFF',
  text: '1A1A1A',
  accent: '123B73',
  muted: '5E6B7A',
  lightBlue: 'EAF1FB',
  pale: 'F7F9FC',
  border: 'D6DFEA',
};

function addBaseSlide(title) {
  const slide = pptx.addSlide();
  slide.background = { color: C.white };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.12,
    fill: { color: C.accent },
    line: { color: C.accent, transparency: 100 },
  });

  slide.addText(title, {
    x: 0.7,
    y: 0.35,
    w: 9.5,
    h: 0.55,
    fontFace: 'Aptos Display',
    fontSize: 30,
    bold: true,
    color: C.text,
    valign: 'top',
  });

  return slide;
}

function addBullets(slide, bullets, box = {}) {
  const runs = bullets.map((b) => ({
    text: b,
    options: { bullet: { indent: 14 } },
  }));

  slide.addText(runs, {
    x: box.x ?? 0.9,
    y: box.y ?? 1.15,
    w: box.w ?? 7.1,
    h: box.h ?? 5.7,
    fontFace: 'Aptos',
    fontSize: 18,
    color: C.text,
    breakLine: true,
    valign: 'top',
    paraSpaceAfterPt: 11,
    margin: 2,
  });
}

function finalizeSlide(slide) {
  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

// Slide 1
{
  const slide = addBaseSlide('Retail Engineering Codex Enablement');

  slide.addText('AI-assisted development for a Fortune 500 retail platform', {
    x: 0.72,
    y: 0.92,
    w: 9.8,
    h: 0.45,
    fontFace: 'Aptos',
    fontSize: 17,
    color: C.accent,
  });

  addBullets(slide, [
    'Improve developer velocity on a large legacy platform',
    'Maintain enterprise governance, security, and auditability',
    'Start with a low-risk workflow: AI-assisted code understanding',
    'Align productivity gains to measurable business outcomes',
  ], { y: 1.48, h: 5.1, w: 6.6 });

  const cardY = 2.0;
  const cardW = 1.6;
  const gap = 0.3;
  const startX = 7.8;
  const labels = ['Productivity', 'Governance', 'Business\nOutcomes'];

  labels.forEach((label, i) => {
    const x = startX + i * (cardW + gap);
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: cardY,
      w: cardW,
      h: 1.35,
      rectRadius: 0.08,
      fill: { color: i === 1 ? C.accent : C.lightBlue },
      line: { color: C.border, pt: 1 },
    });
    slide.addText(label, {
      x: x + 0.08,
      y: cardY + 0.42,
      w: cardW - 0.16,
      h: 0.55,
      fontSize: 12,
      align: 'center',
      bold: true,
      color: i === 1 ? C.white : C.text,
    });
  });

  finalizeSlide(slide);
}

// Slide 2
{
  const slide = addBaseSlide('Current Engineering Challenges');

  addBullets(slide, [
    'Large legacy codebase increases time-to-understand for every change',
    'Slow onboarding delays contribution from new engineers',
    'Documentation quality varies across services and teams',
    'Developers spend too much time tracing dependencies and behavior',
    'Context switching and rework drive avoidable delivery risk',
  ]);

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.15,
    y: 1.35,
    w: 4.8,
    h: 4.9,
    fill: { color: C.pale },
    line: { color: C.border, pt: 1.2 },
    rectRadius: 0.05,
  });

  slide.addText('Developer Time Breakdown', {
    x: 8.45,
    y: 1.58,
    w: 4.2,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: C.muted,
    align: 'center',
  });

  slide.addChart(pptx.ChartType.bar, [
    {
      name: 'Hours',
      labels: ['Code Understanding', 'Feature Build', 'Testing', 'Docs/Reviews'],
      values: [42, 24, 20, 14],
    },
  ], {
    x: 8.45,
    y: 1.95,
    w: 4.2,
    h: 3.95,
    barDir: 'bar',
    catAxisLabelFontSize: 10,
    valAxisLabelFontSize: 10,
    showLegend: false,
    valAxisMinVal: 0,
    valAxisMaxVal: 50,
    valAxisMajorUnit: 10,
    chartColors: [C.accent],
    showValue: true,
    valGridLine: { color: 'DDE3EC', pt: 1 },
  });

  finalizeSlide(slide);
}

// Slide 3
{
  const slide = addBaseSlide('Where Codex Fits in the Developer Workflow');

  addBullets(slide, [
    'Explains unfamiliar modules and service boundaries quickly',
    'Maps dependency paths and upstream/downstream impacts',
    'Generates first-draft technical documentation from source code',
    'Supports debugging with targeted hypotheses and trace guidance',
    'Improves consistency of onboarding and team knowledge transfer',
  ]);

  const steps = ['Read Code', 'Ask Codex', 'Validate', 'Implement'];
  const sx = 8.15;
  const sy = 2.0;
  const sw = 1.05;
  const sh = 0.9;
  const stepGap = 0.18;

  steps.forEach((step, i) => {
    const x = sx + i * (sw + stepGap);
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: sy,
      w: sw,
      h: sh,
      fill: { color: i === 1 ? C.accent : C.lightBlue },
      line: { color: C.border, pt: 1 },
      rectRadius: 0.06,
    });
    slide.addText(step, {
      x: x + 0.03,
      y: sy + 0.32,
      w: sw - 0.06,
      h: 0.3,
      align: 'center',
      fontSize: 10,
      bold: true,
      color: i === 1 ? C.white : C.text,
    });
    if (i < steps.length - 1) {
      slide.addShape(pptx.ShapeType.chevron, {
        x: x + sw + 0.03,
        y: sy + 0.32,
        w: 0.12,
        h: 0.25,
        fill: { color: C.muted },
        line: { color: C.muted, pt: 0.5 },
      });
    }
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.2,
    y: 3.35,
    w: 4.7,
    h: 2.7,
    fill: { color: C.pale },
    line: { color: C.border, pt: 1 },
    rectRadius: 0.05,
  });
  slide.addText('Codex acts as an accelerator inside the existing\ndeveloper loop, not a replacement for engineering judgment.', {
    x: 8.4,
    y: 4.15,
    w: 4.3,
    h: 1.2,
    fontSize: 12,
    color: C.muted,
    align: 'center',
    valign: 'mid',
  });

  finalizeSlide(slide);
}

// Slide 4
{
  const slide = addBaseSlide('First Workflow: Code Understanding');

  addBullets(slide, [
    'Delivers the fastest cross-team productivity lift',
    'Low risk profile: read-focused workflow with no autonomous deploys',
    'Accelerates onboarding for legacy platform ownership',
    'Improves change planning quality before implementation starts',
    'Creates a practical foundation for later AI use cases',
  ]);

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.2,
    y: 1.6,
    w: 4.7,
    h: 4.6,
    fill: { color: 'FFFFFF' },
    line: { color: C.border, pt: 1.4 },
    rectRadius: 0.03,
  });

  slide.addShape(pptx.ShapeType.line, {
    x: 10.55,
    y: 1.85,
    w: 0,
    h: 4.1,
    line: { color: 'DCE3EE', pt: 1.2 },
  });
  slide.addShape(pptx.ShapeType.line, {
    x: 8.45,
    y: 3.95,
    w: 4.2,
    h: 0,
    line: { color: 'DCE3EE', pt: 1.2 },
  });

  slide.addText('Impact', {
    x: 10.95,
    y: 1.95,
    w: 1.2,
    h: 0.25,
    fontSize: 10,
    bold: true,
    color: C.muted,
  });
  slide.addText('Risk', {
    x: 8.35,
    y: 3.55,
    w: 0.9,
    h: 0.25,
    fontSize: 10,
    bold: true,
    color: C.muted,
    angle: 270,
  });

  slide.addText('High', {
    x: 11.95,
    y: 1.75,
    w: 0.6,
    h: 0.2,
    fontSize: 9,
    color: C.muted,
  });
  slide.addText('Low', {
    x: 11.98,
    y: 5.68,
    w: 0.6,
    h: 0.2,
    fontSize: 9,
    color: C.muted,
  });

  slide.addShape(pptx.ShapeType.ellipse, {
    x: 10.85,
    y: 2.45,
    w: 0.65,
    h: 0.65,
    fill: { color: C.accent },
    line: { color: C.accent, pt: 0.8 },
  });
  slide.addText('Code\nUnderstanding', {
    x: 10.03,
    y: 3.12,
    w: 2.25,
    h: 0.55,
    fontSize: 10,
    bold: true,
    color: C.accent,
    align: 'center',
  });

  finalizeSlide(slide);
}

// Slide 5
{
  const slide = addBaseSlide('Enterprise Guardrails');

  addBullets(slide, [
    'Repository access inherits enterprise IAM and role controls',
    'Prompt filters protect secrets and restricted data patterns',
    'Telemetry captures usage, outcomes, and audit evidence',
    'Policy enforcement is centralized through the Codex harness',
    'Human review remains mandatory before production merges',
  ]);

  const layerX = 8.35;
  const layerW = 4.45;
  const layerH = 0.8;
  const layerGap = 0.22;
  const layers = [
    { name: 'Developer', color: C.lightBlue, t: C.text },
    { name: 'Codex Harness', color: C.accent, t: C.white },
    { name: 'Policy & Security Controls', color: C.pale, t: C.text },
    { name: 'Repos / CI / Service Context', color: 'FFFFFF', t: C.text },
  ];

  layers.forEach((layer, i) => {
    const y = 1.75 + i * (layerH + layerGap);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: layerX,
      y,
      w: layerW,
      h: layerH,
      fill: { color: layer.color },
      line: { color: C.border, pt: 1 },
      rectRadius: 0.05,
    });
    slide.addText(layer.name, {
      x: layerX,
      y: y + 0.23,
      w: layerW,
      h: 0.3,
      fontSize: 12,
      bold: i === 1,
      color: layer.t,
      align: 'center',
    });
    if (i < layers.length - 1) {
      slide.addShape(pptx.ShapeType.chevron, {
        x: layerX + 2.12,
        y: y + layerH + 0.03,
        w: 0.23,
        h: 0.16,
        rotate: 90,
        fill: { color: C.muted },
        line: { color: C.muted, pt: 0.8 },
      });
    }
  });

  finalizeSlide(slide);
}

// Slide 6
{
  const slide = addBaseSlide('Live Demo Example: Inventory Availability Service');

  addBullets(slide, [
    'Developer investigates inventory-availability logic before a change',
    'Prompt used: "Explain how inventory availability is calculated in this service."',
    'Codex response maps key files, flow, dependencies, and assumptions',
    'Output highlights edge cases and test paths to validate safely',
    'Result: faster root cause analysis and higher-confidence delivery',
  ]);

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.05,
    y: 1.55,
    w: 2.35,
    h: 4.7,
    fill: { color: C.pale },
    line: { color: C.border, pt: 1.2 },
    rectRadius: 0.05,
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 10.65,
    y: 1.55,
    w: 2.35,
    h: 4.7,
    fill: { color: 'FFFFFF' },
    line: { color: C.border, pt: 1.2 },
    rectRadius: 0.05,
  });

  slide.addText('Prompt', {
    x: 8.12,
    y: 1.78,
    w: 2.2,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: C.accent,
    align: 'center',
  });
  slide.addText('Codex Output', {
    x: 10.72,
    y: 1.78,
    w: 2.2,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: C.accent,
    align: 'center',
  });

  slide.addText('"Explain how inventory\navailability is\ncalculated in this\nservice."', {
    x: 8.2,
    y: 2.3,
    w: 2.05,
    h: 1.6,
    fontSize: 11,
    color: C.text,
    italic: true,
    align: 'center',
  });

  slide.addText('1. Key files and\ncalculation chain\n\n2. Inputs and\nconstraints\n\n3. Edge-case behavior\n\n4. Suggested tests', {
    x: 10.8,
    y: 2.25,
    w: 2.0,
    h: 2.5,
    fontSize: 11,
    color: C.text,
    valign: 'top',
  });

  finalizeSlide(slide);
}

// Slide 7
{
  const slide = addBaseSlide('Rollout Strategy and Business Impact');

  addBullets(slide, [
    'Pilot: 2-3 teams, baseline metrics, and guardrail validation',
    'Standardized adoption: templates, playbooks, and team enablement',
    'Enterprise scale: governance dashboards and broad rollout',
    'Outcomes: faster onboarding, higher productivity, stronger code quality',
    'KPIs: time-to-first-PR, cycle time, escaped defects, doc coverage',
  ]);

  const phases = [
    { title: 'Pilot', kpi: 'Onboarding\n-25%' },
    { title: 'Standardized\nAdoption', kpi: 'Cycle Time\n-15%' },
    { title: 'Enterprise\nScale', kpi: 'Defects\n-20%' },
  ];

  phases.forEach((p, i) => {
    const x = 8.1 + i * 1.62;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 2.15,
      w: 1.45,
      h: 1.1,
      fill: { color: i === 0 ? C.lightBlue : i === 1 ? C.pale : 'FFFFFF' },
      line: { color: C.border, pt: 1.1 },
      rectRadius: 0.06,
    });
    slide.addText(p.title, {
      x,
      y: 2.5,
      w: 1.45,
      h: 0.45,
      fontSize: 10,
      bold: true,
      align: 'center',
      color: C.text,
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 3.55,
      w: 1.45,
      h: 0.95,
      fill: { color: C.accent },
      line: { color: C.accent, pt: 0.8 },
      rectRadius: 0.05,
    });
    slide.addText(p.kpi, {
      x,
      y: 3.82,
      w: 1.45,
      h: 0.45,
      fontSize: 10,
      bold: true,
      align: 'center',
      color: C.white,
    });

    if (i < phases.length - 1) {
      slide.addShape(pptx.ShapeType.chevron, {
        x: x + 1.47,
        y: 2.58,
        w: 0.13,
        h: 0.26,
        fill: { color: C.muted },
        line: { color: C.muted, pt: 0.7 },
      });
    }
  });

  finalizeSlide(slide);
}

pptx.writeFile({ fileName: 'codex_enterprise_rollout.pptx' });
