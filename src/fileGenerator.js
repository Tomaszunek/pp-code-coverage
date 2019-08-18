const fs = require('fs');
const excelGenerator = require('node-excel-export');

const styles = {
    headerDark: {
        fill: {
            fgColor: {
                rgb: 'FF000000'
            }
        },
        font: {
            color: {
                rgb: 'FFFFFFFF'
            },
            sz: 14,
            bold: true,
            underline: true
        },
        alignment: {
            wrapText: true
        }
    },
    cellPink: {
        fill: {
            fgColor: {
                rgb: 'FFFFCCFF'
            }
        }
    },
    cellGreen: {
        fill: {
            fgColor: {
                rgb: 'FF00FF00'
            }
        }
    }
};

const generateJsonFile = (json, type) => {
    writeToFile(`coverage-${type}-report${Date.now()}.json`, JSON.stringify(json));
}

const generateHtmlFile = (json, type) => {

}

const generateExcelFile = (json, type) => {
    const excelRaports = [
        {
            name: `Coverage ${type} raports`,
            heading: [],
            merges: [],
            specification: {
                url: {
                    displayName: "URL",
                    headerStyle: styles.headerDark,
                    width: "50"
                },
                wholeSizeLength: {
                    displayName: "Whole File Length",
                    headerStyle: styles.headerDark,
                    width: 75
                },
                url: {
                    displayName: "Used File Length",
                    headerStyle: styles.headerDark,
                    width: 75
                }
            },
            data: generateDataFromEntries(json.entries)
        }
    ]
    console.log(generateDataFromEntries(json.entries));
    const reportXLSX = excelGenerator.buildExport(excelRaports);
    writeToFile(`coverage-${type}-report${Date.now()}.xlsx`, reportXLSX);
}

const generateDataFromEntries = (entries) => {
    const newEntries = [];
    for(let ind in entries) {
        const { url, wholeSizeLength, usedSizeLength } = entries[ind];
        newEntries.push({
            url,
            wholeSizeLength,
            usedSizeLength,
        })
    }
    return newEntries;
}

const generateAllFiles = (json, type) => {
    generateJsonFile(json, type);
    generateHtmlFile(json, type);
    generateExcelFile(json, type);
}

const writeToFile = (nameFile, item) => {
    fs.writeFile('./results/' + nameFile, item, (err) => {
        if (err) {
            console.error(err);
        }
    });
}

module.exports = {
    generateAllFiles
}