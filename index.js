
const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');
const request = require('request');
const util = require('util');
const configLogin = require('./config/login.json');

(async () => {

    const loginURL = 'https://github.com/login';
    const limit = 10;
    const opts = {
        //chromeFlags: ['--headless'],
        logLevel: 'info',
        output: 'json',
        disableDeviceEmulation: true,
        defaultViewport: {
            width: 1200,
            height: 900
        },
        chromeFlags: ['--disable-mobile-emulation']
    };

    // Launch chrome using chrome-launcher
    const chrome = await chromeLauncher.launch(opts);
    opts.port = chrome.port;

    // Connect to it using puppeteer.connect().
    const resp = await util.promisify(request)(`http://localhost:${opts.port}/json/version`);
    const { webSocketDebuggerUrl } = JSON.parse(resp.body);
    const browser = await puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl });
   
    //Puppeteer
    page = (await browser.pages())[0];
    await Promise.all([
        page.coverage.startJSCoverage(),
        page.coverage.startCSSCoverage()
    ]);
    
    await page.setViewport({ width: 1200, height: 900 });
    await page.goto(loginURL, { waitUntil: 'networkidle2' });

    await page.type(configLogin.login.inputName, configLogin.login.loginValue);
    await page.type(configLogin.password.inputName, configLogin.password.passwordValue);
    await page.click(configLogin.submit.inputName);

    let links = await page.evaluate(
        () => [...document.querySelectorAll('a')].map(elem => elem.href)
    )
    links = links.filter(link => link.includes('https://'))
    links = [...new Set(links)];
    links.length = Math.min(limit, links.length);
    console.log(page.url(), links);

    // Run Lighthouse.

    for (let link of links) {
        console.log(link)
        await page.goto(link, { waitUntil: 'networkidle2' });        
    }

    const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage(),
    ]);

    let totalBytesCSS = 0;
    let usedBytesCSS = 0;
    let totalBytesJS = 0;
    let usedBytesJS = 0;
    for (const entry of cssCoverage) {
        totalBytesCSS += entry.text.length;
        for (const range of entry.ranges)
            usedBytesCSS += range.end - range.start - 1;
    }

    console.log(`Total Bytes of CSS: ${totalBytesCSS}`);
    console.log(`Used Bytes of CSS: ${usedBytesCSS}`);

    for (const entry of jsCoverage) {
        totalBytesJS += entry.text.length;
        for (const range of entry.ranges)
            usedBytesJS += range.end - range.start - 1;
    }

    console.log(`Total Bytes of CSS: ${totalBytesJS}`);
    console.log(`Used Bytes of CSS: ${usedBytesJS}`);    

    await browser.disconnect();
    await chrome.kill();
})();
