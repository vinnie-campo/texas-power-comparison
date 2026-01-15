import puppeteer from 'puppeteer';
import * as fs from 'fs';

async function main() {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1920, height: 1080 } });
  const page = await browser.newPage();
  
  await page.goto('https://www.powertochoose.org/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  await page.type('input[type="text"]', '77007', { delay: 100 });
  await new Promise(r => setTimeout(r, 1000));
  
  // Click VIEW RESULTS
  await page.evaluate(() => {
    const links = document.querySelectorAll('a');
    for (const link of links) {
      if (link.innerText?.toUpperCase().includes('VIEW RESULTS')) {
        link.click();
        return;
      }
    }
  });
  
  await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
  await new Promise(r => setTimeout(r, 5000));
  
  // Log all links and buttons on the page
  const elements = await page.evaluate(() => {
    const results: string[] = [];
    document.querySelectorAll('a, button, img').forEach(el => {
      const tag = el.tagName;
      const href = (el as HTMLAnchorElement).href || '';
      const title = el.getAttribute('title') || '';
      const alt = (el as HTMLImageElement).alt || '';
      const src = (el as HTMLImageElement).src || '';
      const text = (el as HTMLElement).innerText?.slice(0, 50) || '';
      if (href.includes('excel') || title.includes('xcel') || alt.includes('xcel') || 
          src.includes('xcel') || src.includes('xls') || text.includes('xcel')) {
        results.push(`${tag}: href=${href}, title=${title}, alt=${alt}, src=${src}, text=${text}`);
      }
    });
    return results;
  });
  
  console.log('Excel-related elements found:', elements);
  
  // Take screenshot
  await page.screenshot({ path: 'debug-results.png', fullPage: true });
  console.log('Screenshot saved to debug-results.png');
  
  // Keep browser open so you can inspect
  console.log('Browser staying open - inspect the page and find the Excel button');
  console.log('Press Ctrl+C when done');
  
  await new Promise(() => {}); // Keep alive
}

main().catch(console.error);
