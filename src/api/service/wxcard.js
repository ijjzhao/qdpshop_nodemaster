var createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15);
};

var createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};

var raw = function (args) {
  var keys = Object.keys(args);
  var arr = [];
  keys.forEach(function (key) {
    arr.push(args[key]);
  });

  let newArgs = arr.sort(function (a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  })

  return newArgs.join('');
};

/**
* @synopsis 签名算法 
*
* @param jsapi_ticket 用于签名的 jsapi_ticket
* @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
*
* @returns
*/
var sign = function (card_ticket, card_id) {
  var ret = {
    card_ticket: card_ticket,
    nonceStr: createNonceStr(),
    timestamp: createTimestamp(),
    card_id: card_id
  };
  var string = raw(ret);
  jsSHA = require('jssha');
  shaObj = new jsSHA(string, 'TEXT');
  ret.signature = shaObj.getHash('SHA-1', 'HEX');

  return ret;
};

module.exports = class extends think.Service {
  async sign(card_ticket, card_id) {
    return sign(card_ticket, card_id)
  }
}