import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const USER_DATA_DIR = './profile';
const delay = (ms) => new Promise(res => setTimeout(res, ms));

const [, , emailArg] = process.argv;
const HEADLESS_MODE = false;

if (!emailArg) {
    console.error('Usage: node wolt-login.js <email>');
    process.exit(1);
}

(async () => {
    const browser = await puppeteer.launch({
        headless: HEADLESS_MODE,
        userDataDir: USER_DATA_DIR,
        args: [
            '--start-maximized',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--no-zygote',
            '--disable-software-rasterizer',
        ],
        defaultViewport: null,
    });

    const [page] = await browser.pages();
    await page.goto('https://merchant.wolt.com/login', {
        waitUntil: 'domcontentloaded',
        timeout: 0,
    });

    try {
        await page.waitForSelector('[data-test-id="consent-banner-accept-button"]', { timeout: 5000 });
        await page.click('[data-test-id="consent-banner-accept-button"]');
        console.log('Cookie consent accepted.');
    } catch {}

    const emailInput = await page.$('#email');
    if (emailInput) {
        for (const char of emailArg) {
            await page.type('#email', char);
            await delay(100 + Math.random() * 100);
        }
        await page.keyboard.press('Enter');
        console.log('Email submitted.');
        await delay(20000);
    }

    await page.screenshot({ path: 'final.png', fullPage: true });
    await browser.close();
})();
