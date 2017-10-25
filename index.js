/**
 * Created by liuli on 2017/4/26.
 */

const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'schedule'
});

app.use(express.static('static'));

app.post('/addEvent', function (req, res) {
  let param = {};
  console.log(req.body);
  for(let obj in req.body){
    param = JSON.parse(obj);
  }
  let startDate = param.startTime;
  let endDate = param.endTime || null;
  let content = param.content || '';
  let people = param.people || '';
  let address = param.address || '';
  // let insertStr = `INSERT INTO schedule(content,address,people,start_time,end_time) VALUES('${content}','${address}','${people}','${startDate}','${endDate}');`;
  let key = '';
  let vals = '';
  if(address){
    key += ',address';
    vals += `,'${address}'`;
  }
  if(people){
    key += ',people';
    vals += `,'${people}'`;
  }
  if(endDate){
    key += ',end_time';
    vals += `,'${endDate}'`;
  }
  let insertStr = `INSERT INTO schedule(content,start_time${key}) VALUES('${content}','${startDate}'${vals});`;
  connection.query(insertStr, function (error, results, fields) {
    if(error){
      console.log(error);
      res.status(500).send('database err').end();
    }else{
      res.send(results);
    }
  });
});

app.post('/getData', function (req, res) {
    // console.log(req);
    // console.log(req.body);
    let param = {};
    for(let obj in req.body){
      param = JSON.parse(obj);
    }
    let fromDate = param.startDate;
  let dayTime = 24 * 60 * 60 * 1000, tempStart = (new Date(fromDate)).getTime();
    let endDate = formatDate(tempStart + dayTime * 7).formatFull;
    let queryStr = `SELECT content, address, people, start_time, end_time FROM \`schedule\` WHERE start_time >= '${fromDate}' AND start_time <= '${endDate}' group by start_time;`;
    connection.query(queryStr, function (error, results, fields) {
        if(error){
            console.log(error);
            res.status(500).send('database err').end();
        }else{
            res.send(results);
        }
    });
});

let server = app.listen(5566, function () {
    // let host = server.address().address;
    let port = server.address().port;
    // console.log('服务已启动在：', host, port);
    console.log('service at:', port);
});

const formatDate = (str) => {
  let date = null;
  if(typeof str === 'string' && str !== ''){
    let strArr = str.split('-');
    date = new Date(parseInt(str[0], 10), parseInt(strArr[1], 10) - 1, parseInt(strArr[2], 10));
  }else if(typeof str === 'number'){
    date = new Date(str);
  }else {
    return '';
  }
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m > 9 ? m : '0' + m;
  let d = date.getDate();
  d = d > 9 ? d : '0' + d;
  return {
    date: date,
    time: date.getTime(),
    format: m + '-' + d,
    formatFull: y + '-' + m + '-' + d
  };
};
