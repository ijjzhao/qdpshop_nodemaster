const Base = require('./base.js');

module.exports = class extends Base {


  async indexAction (ctx, next) {
    let echostr = ctx.query.echostr
    let signature = ctx.query.signature
    let timestamp = ctx.query.timestamp
    let nonce = ctx.query.nonce
    
    let token = 'token'

    let arr = [token, timestamp, nonce]
    arr = arr.sort(function (a, b) {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    })
    let str = arr.join('');

    var md5sum = crypto.createHash('sha1')

    md5sum.update(str, 'utf8');
    str = md5sum.digest('hex');
    if (str == signature) {
      // ctx.body = echostr
    } else {
      // ctx.body = ''
    }

    this.post('')

  }

}