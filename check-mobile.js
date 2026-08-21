const puppeteer = require('puppeteer');
const path = require('path');

const url = 'file://' + path.resolve('index.html').split(path.sep).join('/');

(async () => {
  const b = await puppeteer.launch({ channel: 'chrome', headless: true });
  for (const w of [390, 768, 1200]) {
    const page = await b.newPage();
    await page.setViewport({ width: w, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle0' });
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      let worst = null;
      document.querySelectorAll('*').forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.right > de.clientWidth + 1 && (!worst || b.right > worst.r))
          worst = { r: Math.round(b.right), tag: el.tagName, cls: String(el.className).slice(0, 50) };
      });
      return { scrollW: de.scrollWidth, clientW: de.clientWidth, h: de.scrollHeight, worst };
    });
    console.log(w, '=> scrollW', r.scrollW, 'clientW', r.clientW, 'height', r.h,
      r.worst ? 'OVERFLOW ' + JSON.stringify(r.worst) : 'no overflow');
    await page.close();
  }
  await b.close();
})();
