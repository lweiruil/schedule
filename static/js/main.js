/**
 * Created by liuli on 2017/10/24.
 */

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
var today = new Date();
var day = today.getDay();
day = day === 0 ? 7 : day;
var vm = new Vue({
  el: '#app',
  data: {
    title: '日程表',
    show: true,
    activeName: day,
    accordion: true,
    week: '',
    pickerOptions: {
      firstDayOfWeek: 1
    },
    form: {
      startDateTime: '',
      endDateTime: null,
      event: '',
      address: '',
      people: ''
    },
    weekData: [],
    rules: {
      startDateTime: [{required: true, message: '请选择开始时间'}],
      endDateTime: [{type: 'object', trigger: 'blur'}],
      event: [{required: true, message: '请填写事件内容'}],
      address: [{type: 'string', trigger: 'blur'}],
      people: [{type: 'string', trigger: 'blur'}]
    }
  },
  created: function () {
    var _this = this;
    // 初始化日期
    _this.week = new Date();
    var dateObj = null;
    var firstDay = _this.calcWeekFirstDay(_this.week).date;
    for(var i = 1; i < 8; i++){
      dateObj = _this.switchWeekDay(firstDay, i);
      _this.weekData.push({
        title: dateObj.text,
        date: dateObj.date,
        eventList: []
      });
    }
    _this.query();
  },
  methods: {
    query: function () {
      var _this = this;
      //查询数据
      var param = {
        startDate: _this.calcWeekFirstDay(formatDate(_this.week).date).formatFull
      };
      axios.post('/getData',param)
        .then(function (res) {
          // console.log(res.data);
          var data = res.data;
          var obj = null;
          for(var i = 0; i < data.length; i++){
            obj = formatDate(new Date(data[i].start_time));
            data[i].startDate = obj.formatFull;
            data[i].startTime = obj.full;
            if(data[i].end_time){
              data[i].endTime = formatDate(new Date(data[i].end_time)).full;
            }else {
              data[i].endTime = null;
            }
            for(var j = 0; j < _this.weekData.length; j++){
              if(_this.weekData[j].date === data[i].startDate){
                _this.weekData[j].eventList.push({
                  content: data[i].content,
                  address: data[i].address,
                  startTime: data[i].startTime,
                  endTime: data[i].endTime,
                  people: data[i].people
                });
              }
            }
          }
          console.log(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    pickerWeek: function(val){
      var _this = this;
      var dateObj = null;
      var firstDay = _this.calcWeekFirstDay(formatDate(val).date).date;
      _this.weekData = [];
      for(var i = 1; i < 8; i++){
        dateObj = _this.switchWeekDay(firstDay, i);
        _this.weekData.push({
          title: dateObj.text,
          date: dateObj.date,
          eventList: []
        });
      }
      this.activeName = 1;
      this.query();
      console.log(val);
    },
    onSubmit: function () {
      console.log(this.form);
      var _this = this;
      _this.$refs.form.validate(function(valid){
        if(valid){
          _this.submit();
        }else {
          console.log('form valid failed');
        }
      });
    },
    calcWeekFirstDay: function(dayObj) {
      var day = dayObj.getDay();
      day = day === 0 ? 7 : day;
      var dayTime = 24 * 60 * 60 * 1000;
      var firstDay = new Date(dayObj.getTime() - dayTime * (day - 1));
      return formatDate(firstDay.getTime());
    },
    switchWeekDay: function (dateObj, day) {
      var obj = {};
      var dayTime = 24 * 60 * 60 * 1000;
      switch (day){
        case 1:
          obj.text = '一';
          break;
        case 2:
          obj.text = '二';
          break;
        case 3:
          obj.text = '三';
          break;
        case 4:
          obj.text = '四';
          break;
        case 5:
          obj.text = '五';
          break;
        case 6:
          obj.text = '六';
          break;
        case 7:
          obj.text = '日';
          break;
        default:
          obj.text = '';
      }
      obj.text = '周' + obj.text;
      var date = new Date(dateObj.getTime() + dayTime * (day -1));
      obj.date = formatDate(date).formatFull;
      return obj;
    },
    resetFrom: function(){
      this.$refs.form.resetFields();
    },
    submit: function(){
      var _this = this;
      var params = {
        content: this.form.event,
        address: this.form.address,
        startTime: formatDate(this.form.startDateTime).full,
        endTime: formatDate(this.form.endDateTime).full,
        people: this.form.people
      };
      axios.post('/addEvent',params).then(function(res){
        // {"fieldCount":0,"affectedRows":1,"insertId":5,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
        if(res.status === 200 && res.data.serverStatus === 2){
          _this.$refs.form.resetFields();
          _this.query();
        }
        console.log(res);
      }).catch(function(e){
        console.log(e);
      });
    }
  }
});

function formatDate(str) {
  var date = null;
  if(typeof str === 'string' && str !== ''){
    var strArr = str.split('-');
    date = new Date(parseInt(strArr[0], 10), parseInt(strArr[1], 10) - 1, parseInt(strArr[2], 10));
  }else if(typeof str === 'number'){
    date = new Date(str);
  }else if(str instanceof Date){
    date = str;
  }else {
    return '';
  }
  function switchTwoNum(num) {
    return num > 9 ? num : '0' + num;
  }
  var y = date.getFullYear();
  var M = date.getMonth() + 1;
  M = switchTwoNum(M);
  var d = date.getDate();
  d = switchTwoNum(d);
  var h = date.getHours();
  h = switchTwoNum(h);
  var m = date.getMinutes();
  m = switchTwoNum(m);
  var s = date.getSeconds();
  s = switchTwoNum(s);
  return {
    date: date,
    time: h + ':' + m + ':' + s,
    timestamp: date.getTime(),
    format: M + '-' + d,
    formatFull: y + '-' + M + '-' + d,
    full: y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s
  };
}