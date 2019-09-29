const fs = require("fs");
const _ = require("lodash");
const process = require("process");

const slow = process.argv.length > 2;

function byteCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
}

function print(str, data) {
    console.log(`${str}:`, Math.round(Object.keys(data).reduce((acc, curr) => {
        acc += data[curr];
        return acc;
    }, 0) / 1024), 'KB');
}

fs.readFile(slow ? './profiles/coverage-slow' : './profiles/coverage', function (err, out) {
    const data = JSON.parse(out);
    const resultCss = {};
    const resultJs = {};
    data.map(item => {
        let usedSum = 0;
        let end = 0;
        item.ranges.map(rangeItem => {
            usedSum += byteCount(item.text.slice(Math.max(rangeItem.start, end), rangeItem.end));
            end = rangeItem.end;
        });

        const result = byteCount(item.text) - usedSum;
        if (item.url.includes(".js")) {
            resultJs[item.url] = result;
        } else {
            resultCss[item.url] = result;
        }
    });

    print('CSS', resultCss);
    print('JS', resultJs);
});