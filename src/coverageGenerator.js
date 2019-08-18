const coverageGenerator = (coverageArr, type) => {
    let coverageReport = {};
    let totalBytes = 0;
    let usedBytes = 0;
    for (const entry of coverageArr) {
        totalBytes += entry.text.length;
        for (const range of entry.ranges)
            usedBytes += range.end - range.start - 1;
    }

    console.log(`Total Bytes of ${type.toUpperCase()}: ${totalBytes}`);
    console.log(`Used Bytes of ${type.toUpperCase()}: ${usedBytes}`);   
}

module.exports = {
    coverageGenerator
}