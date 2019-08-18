
const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');
const request = require('request');
const util = require('util');
const configLogin = require('../config/login.json');
const { coverageGenerator } = require('./coverageGenerator');
const { generateAllFiles } = require('./fileGenerator');

const cli = async (loginURL, limit, opts) => {
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

    const cssCoverageReport = coverageGenerator(cssCoverage, 'css');
    const jsCoverageReport = coverageGenerator(jsCoverage, 'js');

    generateAllFiles(cssCoverageReport, 'css');
    generateAllFiles(jsCoverageReport, 'js');

    await browser.disconnect();
    await chrome.kill();
}


module.exports = {
    cli
}