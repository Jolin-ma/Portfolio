const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve('index.html').replace(/\\/g, '/'), {
    waitUntil: 'networkidle0',
    timeout: 60000,
  });
  await new Promise((r) => setTimeout(r, 1500));

  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log('page height:', height, 'ratio h/w:', (height / 1440).toFixed(2));

  // section boundaries, normalised against total height, for comparison with the reference
  const marks = await page.evaluate(() => {
    const out = {};
    const H = document.documentElement.scrollHeight;
    const put = (name, el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      out[name] = [
        +((r.top + window.scrollY) / H).toFixed(4),
        +((r.bottom + window.scrollY) / H).toFixed(4),
      ];
    };
    put('nav', document.querySelector('header'));
    put('hero', document.querySelectorAll('section')[0]);
    put('about', document.querySelector('#about'));
    put('photos', document.querySelector('#about figure'));
    put('featured', document.querySelector('#work'));
    document.querySelectorAll('article').forEach((a, i) => put('card' + (i + 1), a));
    put('talk', document.querySelector('#contact'));
    put('footer', document.querySelector('footer'));
    return out;
  });
  console.log(JSON.stringify(marks, null, 1));

  await page.screenshot({ path: 'shot.png', fullPage: true });
  await browser.close();
})();
