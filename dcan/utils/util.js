//当前时间
function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    return [year, month, day].map(formatNumber).join('-')
}
function formateContrast(dataN, dataY){

    var year1 = Number(dataN.getFullYear())
    var year2 = Number(dataY.getFullYear())
    if (year2 < year1){
        var year = dataY.getFullYear()
        var month = dataY.getMonth() + 1
        var day = dataY.getDate()
        var ret = year+"年"+ month+"月" + day+"日"
    }else{
        var month = dataY.getMonth() + 1
        var day = dataY.getDate()
        var ret = + month + "月" + day + "日"
    }
    return ret
}


//当前时间
function formatData(date) {
    var hour = date.getHours()
    var minute = date.getMinutes()
    return hour + ":"+minute

}
function formatTimes(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formateIOS(time) {
    var myDate = new Date((time.replace(/-/g, "/")));
    return myDate;
}

function reserveTime(date,num)
{
    date.setMinutes(date.getMinutes() + Number(num))
    var minute = date.getMinutes()
    var hour = date.getHours()
    return [hour, minute].map(formatNumber).join(':')
}
function reserveTimeYear(date, num) {
    date.setMinutes(date.getMinutes() + Number(num))
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var minute = date.getMinutes()
    var hour = date.getHours()
    var second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')

}
function addMinutes(date,minutes) {
    minutes = parseInt(minutes);
    var interTimes = minutes * 60 * 1000;
    interTimes = parseInt(interTimes);
    var data=new Date(Date.parse(date) + interTimes);
    var minute = data.getMinutes()
    var hour = data.getHours()

    return [hour, minute].map(formatNumber).join(':')
}
function addDay(date, days)
{
    days = parseInt(days);
    var interTimes = days*60*24 * 60 * 1000;
    interTimes = parseInt(interTimes);
    var data= new Date(Date.parse(date) + interTimes);
    var year = data.getFullYear()
    var month = data.getMonth() + 1
    var day = data.getDate()
    return [year, month, day].map(formatNumber).join('-')

}
function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}
//本周第一天
function showWeekFirstDay() {
    var Nowdate = new Date();
    var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
    var M = Number(WeekFirstDay.getMonth()) + 1
    return WeekFirstDay.getFullYear() + "-" + M + "-" + WeekFirstDay.getDate();
}
//本周最后一天
function showWeekLastDay() {
    var Nowdate = new Date();
    var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
    var WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);
    var M = Number(WeekLastDay.getMonth()) + 1
    return WeekLastDay.getFullYear() + "-" + M + "-" + WeekLastDay.getDate();
}
//本月第一天
function showMonthFirstDay() {
    var Nowdate = new Date();
    var MonthFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth(), 1);
    var  M = Number(MonthFirstDay.getMonth()) + 1
    return MonthFirstDay.getFullYear() + "-" + M + "-" + MonthFirstDay.getDate();
}
//本月最后一天
function showMonthLastDay() {
    var Nowdate = new Date();
    var MonthNextFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth() + 1, 1);
    var MonthLastDay = new Date(MonthNextFirstDay - 86400000);
    var M = Number(MonthLastDay.getMonth()) + 1
    return MonthLastDay.getFullYear() + "-" + M + "-" + MonthLastDay.getDate();
}
//上一个月
function lastMonth()
{
    var Nowdate = new Date();
    var year = Nowdate.getFullYear()
    var month = Nowdate.getMonth()
    return [year, month].map(formatNumber).join('-')
}
//判断当前时间是否在店铺营业时间内
function timeRange(beginTime, endTime) {
    var strb = beginTime.split(":");
    if (strb.length != 2) {
        return false;
    }

    var stre = endTime.split(":");
    if (stre.length != 2) {
        return false;
    }

    var b = new Date();
    var e = new Date();
    var n = new Date();

    b.setHours(strb[0]);
    b.setMinutes(strb[1]);
    e.setHours(stre[0]);
    e.setMinutes(stre[1]);

    if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
        //console.log("当前时间是：" + n.getHours() + ":" + n.getMinutes() + "，在时间范围内！");
        return 1;
    } else {
        //  console.log("当前时间是：" + n.getHours() + ":" + n.getMinutes() + "，不在该时间范围内！");
        return 2;
    }
}
//判断身份证格式是否正确
function checkCardId(socialNo) {
    if (socialNo == "") {
        return false;
    }
    if (socialNo.length != 15 && socialNo.length != 18) {
        return false;
    }
    var area = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };

    if (area[parseInt(socialNo.substr(0, 2))] == null) {
        return false;
    }
    if (socialNo.length == 15) {
        pattern = /^\d{15}$/;
        if (pattern.exec(socialNo) == null) {
            return (false);
        }
        var birth = parseInt("19" + socialNo.substr(6, 2));
        var month = socialNo.substr(8, 2);
        var day = parseInt(socialNo.substr(10, 2));
        switch (month) {
            case '01':
            case '03':
            case '05':
            case '07':
            case '08':
            case '10':
            case '12':
                if (day > 31) {
                    return false;
                }
                break;
            case '04':
            case '06':
            case '09':
            case '11':
                if (day > 30) {
                    return false;
                }
                break;
            case '02':
                if ((birth % 4 == 0 && birth % 100 != 0) || birth % 400 == 0) {
                    if (day > 29) {
                        return false;
                    }
                } else {
                    if (day > 28) {
                        return false;
                    }
                }
                break;
            default:
                return false;
        }
        var nowYear = new Date().getYear();
        if (nowYear - parseInt(birth) < 15 || nowYear - parseInt(birth) > 100) {
            return false;
        }
        return true;
    }
    var Wi = new Array(
        7, 9, 10, 5, 8, 4, 2, 1, 6,
        3, 7, 9, 10, 5, 8, 4, 2, 1
    );
    var lSum = 0;
    var nNum = 0;
    var nCheckSum = 0;
    for (var i = 0; i < 17; ++i) {
        if (socialNo.charAt(i) < '0' || socialNo.charAt(i) > '9') {
            return false;
        }else {
            nNum = socialNo.charAt(i) - '0';
        }
        lSum += nNum * Wi[i];
    }
    if (socialNo.charAt(17) == 'X' || socialNo.charAt(17) == 'x') {
        lSum += 10 * Wi[17];
    }else if (socialNo.charAt(17) < '0' || socialNo.charAt(17) > '9') {
        return false;
    }else {
        lSum += (socialNo.charAt(17) - '0') * Wi[17];
    }
    if ((lSum % 11) == 1) {
        return true;
    }else {
        return false;
    }
}
function shijian(date,arr,s){
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    var data1=[year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    for (var i = 0; i < arr.length; i++) {
        var data2=arr[i]['time'];
        var data1 = data1.replace(/-/g, '/');
        var data2 = data2.replace(/-/g, '/');  //兼容苹果要把 - 换成 /
        var d1 = new Date(data1);
        var d2 = new Date(data2);
        var d3 = (d1-d2) / 1000;

        if(s){
            d3=d3+30
        }
        if(d3 <= 0){
            d3 = '1秒';
        } else if (d3 > 0&&d3 <=60) {
            d3=d3+'秒';
        }else if(d3>60&&d3<=3600){
            d3 = (d3 / 60).toFixed(0)+'分钟';
        }else if(d3>3600&&d3<=86400){
            d3 = (d3 / 3600).toFixed(0)+'小时';
        }else if(d3>86400){
            d3 = (d3 / 86400).toFixed(0)+'天';
        }
        arr[i]['times'] = d3;
        arr[i]['shopId'] = parseInt(arr[i]['shopId']);
    }
    return arr;
}

function subTime(data1,data2) {

    data1 = data1.replace(/-/g, '/');
    var d1 = new Date(data1);
    var d3 = Math.floor((data2 -d1 ) / 1000) ;

    return d3;
}

function aftModal(obj) {
    var that = this
    let { title, success = function (modal) { } } = obj
    wx.showModal({
        title: '提示',
        content: title,
        confirmColor: '#53beb7',
        showCancel: false,
        success: success
    })

}

//防止重复点击
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}


module.exports = {
    formatTime: formatTime,
    formatTimes: formatTimes,
    showWeekFirstDay: showWeekFirstDay,
    showWeekLastDay: showWeekLastDay,
    showMonthFirstDay: showMonthFirstDay,
    showMonthLastDay: showMonthLastDay,
    lastMonth: lastMonth,
    reserveTime: reserveTime,
    reserveTimeYear: reserveTimeYear,
    addMinutes: addMinutes,
    addDay: addDay,
    formatData: formatData,
    formateIOS: formateIOS,
    formateContrast: formateContrast,
    timeRange:timeRange,
    checkCardId: checkCardId,
    shijian: shijian,
    subTime: subTime,
    aftModal: aftModal,
  throttle: throttle
}
