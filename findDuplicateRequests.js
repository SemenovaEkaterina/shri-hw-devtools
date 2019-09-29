const fs = require("fs");
const _ = require("lodash");

const slow = process.argv.length > 2;

fs.readFile(slow ? './profiles/lifehacker.ru-slow.har' : './profiles/lifehacker.ru.har', function (err, out) {
    const data = JSON.parse(out);
    const list = data.log.entries;

    // Поиск повторяющихся значений (совпадают запрос и ответ)
    // фильрация по GET для получение ресурсов
    let result = _.filter(list, v =>
        _.filter(list, v1 => v.request.method === 'GET' && _.isEqual(v1.request, v.request) && _.isEqual(v1.response, v.response)).length > 1);

    result = _.uniqWith(result, (v, v1) => v1.request.url === v.request.url);

    console.log(result.length, result.map(item => item.request.url));
});