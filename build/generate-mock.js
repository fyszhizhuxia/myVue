const path = require('path');
const fs = require('fs');
global.mock = require('mockjs'); // 把mock添加到node 服务的全局

let mockdir = fs.readdirSync('./mock'); //读取mock目录(当前['common'])

// 构造mock 服务的路由
const generateMock = (app) => {
    mockdir.forEach((filename) => {
        let mockDatas = require(path.join(__dirname, '../mock/', filename));//require('../mock/common.js')
        for (let key in mockDatas) {
            app[mockDatas[key].type](mockDatas[key].url, function(req, res) {
                res.json(mockDatas[key].data);//这里返回你mock的数据
            });
        }
    });
};
module.exports = generateMock;
