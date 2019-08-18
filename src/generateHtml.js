const fs = require('fs');
const path = require('path');
const filePathCss = path.join(__dirname, './htmlFiles/cssInline.css');
const filePathJS = path.join(__dirname, './htmlFiles/jsInline.js');

let css;
let js;

fs.readFile(filePathCss, 'utf8', function(err, contents) {
    if(contents) {
        css = contents;
    }
    if(err) {
        console.log(err)
    }
});

fs.readFile(filePathJS, 'utf8', function(err, contents) {
    if(contents) {
        js = contents;
    }
    if(err) {
        console.log(err)
    }
});

const generateHtmlFileDom = (json) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    ${generateInlineCSS()}
    <body>
        ${generateBody(json)}
    </body>
    ${generateInlineJS()}
    </html>`;
}

const generateBody = (json) => {
    const { type, totalBytes, usedBytes, entries } = json;
    return `
    <h1>Report ${type.toUpperCase()} Total bytes: ${totalBytes} Used bytes: ${usedBytes}</h1>
    ${genereteAllEntriesDivs(entries)}
    `
}

const genereteAllEntriesDivs = (entries) => {
    return `
        ${entries.map(entry => {
            return `
                <div class="entry">
                    <h2>${entry.url} Total bytes: ${entry.wholeSizeLength} Used bytes: ${entry.usedSizeLength}</h2>
                    <div class="entry__container">
                        <div class="entry__container__total">
                            <code>
                                ${entry.wholeSize}
                            </code>
                        </div>
                        <div class="entry__container__used">
                            <code>
                                ${entry.usedSize}
                            </code>
                        </div> 
                    </div>                
                </div>
            `
        })}
    `
}

const generateInlineJS = () => {
    return `<script>${js}</script>`;
}

const generateInlineCSS = () => {
    return `<style>${css}</style>`
}

module.exports = {
    generateHtmlFileDom,
}