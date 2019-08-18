const coverageGenerator = (coverageArr, type) => {
    let coverageReport = {};
    let totalBytes = 0;
    let usedBytes = 0;
    const entriesArr = [];
    for (const entry of coverageArr) {
        let entryUsedCss = "";
        totalBytes += entry.text.length;
        for (const range of entry.ranges) {
            usedBytes += range.end - range.start - 1;
            entryUsedCss += entry.text.slice(range.start, range.end) + "\n"            
        }
        const singleEntryReport = {
            url: entry.url,
            wholeCss: entry.text,
            wholeCssLength: entry.text.length,
            usedCss: entryUsedCss,            
            usedCssLength: entryUsedCss.length,
            ranges: entry.ranges,
        }
        entriesArr.push(singleEntryReport)
    }
    coverageReport = {
        entries: entriesArr,
        type,
        totalBytes,
        usedBytes,
    } 
    
    console.log(`Total Bytes of ${type.toUpperCase()}: ${totalBytes}`);
    console.log(`Used Bytes of ${type.toUpperCase()}: ${usedBytes}`);
    console.log(coverageReport);
    return coverageReport;
}

module.exports = {
    coverageGenerator
}