// Renders index.html and reports element geometry in "reference pixels"
// (the reference screenshot is 62 x 724, so 1 ref px = pageWidth/62).
const puppeteer = require('puppeteer');
const path = require('path');

// what the reference screenshot measures, in ref px: [top, bottom] and x-extent where known
const REF = {
  'nav divider':      [null, 9.5],
  'hero label':       [12.5, 14.5],
  'hey im':           [17.75, 20],
  'BEJAMAN':          [24, 34.5, 12, 51],
  'sublabel':         [35.75, 37.25],
  'tagline':          [43, 50.5],
  'button':           [52.5, 59.75, 22.5, 40.5],
  'hey!':             [73, 77],
  'whats up tag':     [79.5, 88, 23.5, 40],
  'about para':       [90, 108],
  'photos':           [111, 141.5],
  'skills':           [145, 166],
  'whats next':       [177, 181],
  'FEATURED':         [185, 196, 17, 46],
  'note':             [198, 208, 13, 50],
  'card1':            [212, 295],
  'card1 image':      [244, 293],
  'LETS TALK':        [564.5, 570, 4, 37],
  'talk para':        [572, 578.5],
  'blob':             [580.5, 620, 15, 50.5],
  'contact card':     [622, 712],
  'composer':         [624, 648, 5, 58],
  'CONTACT':          [661.75, 670, 17.5, 46],
  'footer':           [712, 724],
};

(async () => {
  const browser = await puppeteer.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve('index.html').replace(/\\/g, '/'), {
    waitUntil: 'networkidle0', timeout: 60000,
  });
  await new Promise((r) => setTimeout(r, 1500));

  const data = await page.evaluate(() => {
    const W = document.documentElement.scrollWidth;
    const H = document.documentElement.scrollHeight;
    const u = W / 62;                       // px per reference px
    const box = (sel, i = 0) => {
      const el = document.querySelectorAll(sel)[i];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return [
        +((r.top + scrollY) / u).toFixed(1), +((r.bottom + scrollY) / u).toFixed(1),
        +(r.left / u).toFixed(1), +(r.right / u).toFixed(1),
      ];
    };
    return {
      pageRatio: +(H / W).toFixed(2),
      m: {
        'nav divider':  box('header'),
        'hero label':   box('section p'),
        'hey im':       box('section div p'),
        'BEJAMAN':      box('h1'),
        'sublabel':     box('h1 ~ span', 4),
        'tagline':      box('section > p', 1),
        'button':       box('a[href="#contact"]', 7),
        'hey!':         box('#about > p'),
        'whats up tag': box('#about span'),
        'about para':   box('#about > p', 1),
        'photos':       box('#about figure'),
        'skills':       box('#about > div', 2),
        'whats next':   box('#work p'),
        'FEATURED':     box('#work h2'),
        'note':         box('#work > p', 2),
        'card1':        box('article'),
        'card1 image':  box('article img'),
        'LETS TALK':    box('#contact h2'),
        'talk para':    box('#contact > p'),
        'blob':         box('#contact svg'),
        'contact card': box('#contact > div', 1),
        'CONTACT':      box('#contact h3 span'),
        'composer':     box('#contact h3 ~ div'),
        'footer':       box('footer'),
      },
    };
  });

  console.log('page ratio h/w:', data.pageRatio, ' (reference 11.68)');
  console.log('element            mine [top  bot  left right]   ref [top  bot  left right]   Δtop  Δbot');
  for (const k of Object.keys(REF)) {
    const m = data.m[k], r = REF[k];
    if (!m) { console.log(k.padEnd(18), 'NOT FOUND'); continue; }
    const f = (a) => a.map((v) => String(v == null ? '-' : v).padStart(6)).join('');
    const d = (a, b) => (a == null || b == null ? '   -  ' : String(+(b - a).toFixed(1)).padStart(6));
    console.log(k.padEnd(18), f(m), '  ', f(r), ' ', d(r[0], m[0]), d(r[1], m[1]));
  }
  await browser.close();
})();
