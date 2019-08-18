const coverageGenerator = (coverageArr, type) => {
    let coverageReport = {};
    let totalBytes = 0;
    let usedBytes = 0;
    const entriesArr = [];
    for (const entry of coverageArr) {
        let entryUsedSize = "";
        totalBytes += entry.text.length;
        for (const range of entry.ranges) {
            usedBytes += range.end - range.start - 1;
            entryUsedSize += entry.text.slice(range.start, range.end) + "\n"            
        }
        const singleEntryReport = {
            url: entry.url,
            wholeSize: entry.text,
            wholeSizeLength: entry.text.length,
            usedSize: entryUsedSize,            
            usedSizeLength: entryUsedSize.length,
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
    return coverageReport;
}

module.exports = {
    coverageGenerator
}