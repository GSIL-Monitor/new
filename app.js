//app.js
const http = require('service/http.js');
const util = require('utils/util.js');

App({
  req:http.req,
  promise: http.promise,
  getTime: util.getTime,
  formatTime: util.formatTime,
  checkPermission: util.checkPermission,
  changeFileUrl: util.changeFileUrl
})