const axios = require('axios');
const crypto = require('crypto');

let access_token;
let expires_at;
let card_ticket;
let ticket_expires_at;

module.exports = class extends think.Service {
  /**
   * 卡券签名
   * @param {*} card_ticket 
   * @param {*} card_id 
   */
  async sign(card_ticket, card_id) {
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
    * @param card_ticket 用于签名的 card_ticket
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
      // var jsSHA = require('jssha');
      // var shaObj = new jsSHA(string, 'TEXT');
      // ret.signature = shaObj.getHash('SHA-1', 'HEX');
      var md5sum = crypto.createHash('sha1')
      md5sum.update(string, 'utf8');
      ret.signature = md5sum.digest('hex');

      return ret;
    };

    return sign(card_ticket, card_id)
  }

  async getAccessToken() {
    if (!access_token || expires_at - new Date().getTime() < 600 * 1000) {
      let { data } = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
        params: {
          grant_type: 'client_credential',
          appid: think.config('weixin.cardAppid'),
          secret: think.config('weixin.cardSecret')
        }
      })
      access_token = data.access_token;
      think.logger.debug(`access_token get: ${access_token}`);
      expires_at = new Date().getTime() + 7200 * 1000;
    }
    return access_token;
  }

  async getCardTicket() {
    if (!card_ticket || ticket_expires_at - new Date().getTime() < 600 * 1000) {
      let access_token = await this.getAccessToken();

      let { data } = await axios.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=wx_card`)

      card_ticket = data.ticket;
      think.logger.debug(`card_ticket get: ${card_ticket}`);
      ticket_expires_at = new Date().getTime() + 7200 * 1000;
    }
    return card_ticket;
  }

  async uploadCardLogo() {
    // 表单的形式上传
    let url = 'http://mmbiz.qpic.cn/mmbiz_jpg/KwIbnIbehxmyaO9A5X7mHdWx6zM9IrapOh37ObGV41wujHxLWVWWajibefLvl5Gticib77ZDVQKCIhkup1MQicOSwA/0';
    return url
    let buffer = fs.readFileSync(__dirname + '/wxcard_logo.png');
    let access_token = await this.getAccessToken();
    let param = new FormData(); //创建form对象
    param.append('file', file, file.name);//通过append向form对象添加数据
    param.append('chunk', '0');//添加form表单中其他数据
    let { data } = await axios.post(`https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=${access_token}`, { buffer })
    console.log(access_token)
    return data;
  }

  /**
   * 创建卡券
   * card_type:
   * GROUPON 团购券
   * CASH 代金券
   * DISCOUNT 折扣券
   * GIFT 兑换券
   * GENERAL_COUPON 优惠券
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1451025056
   */
  async createCard(coupon_type, logo_url, title, color, Instructions, coupon_number, validity_type,
    validity_start, validity_end, validity_limit_day, coupon_value, coupon_limit_value) {
    let access_token = await this.getAccessToken()

    let card_type // 优惠券类型（0为指定金额 代金券，1为折扣 折扣券）
    if (coupon_type == 0) {
      card_type = "cash"
    } else {
      card_type = "discount"
    }

    let formData = {
      card: {
        card_type: card_type.toUpperCase()
      }
    }

    // 有效期类型（0为固定，1为当日，2为次日)
    let date_info = {}
    if (validity_type == 0) {
      date_info.type = 'DATE_TYPE_FIX _TIME_RANGE'
      date_info.begin_timestamp = parseInt(validity_start / 1000)
      date_info.end_timestamp = parseInt(validity_end / 1000)
    } else {
      date_info.type = 'DATE_TYPE_FIX_TERM'
      date_info.fixed_term = parseInt(validity_limit_day / 86400000)
      date_info.fixed_begin_term = validity_type == 2 ? 1 : 0
    }

    formData.card[card_type] = {
      base_info: {
        logo_url: logo_url,
        code_type: 'CODE_TYPE_QRCODE',
        brand_name: think.config('brand_name'),
        title: title,
        color: color,
        notice: '请出示二维码',
        description: Instructions,
        can_share: false,
        can_give_friend: false,
        sku: {
          quantity: coupon_number
        },
        date_info: date_info,
      }
    }

    if (card_type == 'discount') {
      formData.card[card_type].discount = (10 - coupon_value) * 10
    } else if (card_type == 'cash') {
      formData.card[card_type].least_cost = coupon_limit_value * 100,
        formData.card[card_type].reduce_cost = coupon_value * 100
    }

    console.log(formData)
    console.log(date_info)
    let { data } = await axios.post(`https://api.weixin.qq.com/card/create?access_token=${access_token}`, formData)
    return data
  }

  /**
   * 更改卡券信息接口
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1451025272
   * 
   */
  async updateCard(card_id) {

  }

  /**
   * 删除卡券接口
   * @param {*} card_id 
   */
  async deleteCard(card_id) {
    let access_token = await this.getAccessToken();
    let { data } = await axios.post(`https://api.weixin.qq.com/card/delete?access_token=${access_token}`, {
      card_id: card_id
    })
    return data;
  }

  /**
   * 开发者可调用该接口生成一张卡券二维码供用户扫码后添加卡券到卡包。
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1451025062
   */
  async createQrcode() {
    let access_token = await this.getAccessToken();
    let { data } = await axios.post(`https://api.weixin.qq.com/card/qrcode/create?access_token=${access_token}`, {
      "action_name": "QR_CARD",
      "action_info": {
        "card": {
          "card_id": card_id,
        }
      }
    })
    return data
  }

  /**
   * 批量查询卡券列表 接口
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1451025272
   * status_list：
   * CARD_STATUS_NOT_VERIFY 待审核
   * CARD_STATUS_VERIFY_FAIL 审核失败
   * CARD_STATUS_VERIFY_OK 通过审核
   * CARD_STATUS_DELETE 卡券被商户删除
   * CARD_STATUS_DISPATCH 在公众平台投放过的卡券
   */
  async getCardList(status_list = []) {
    let access_token = await this.getAccessToken();
    let { data } = await axios.post(`https://api.weixin.qq.com/card/batchget?access_token=${access_token}`, {
      offset: 0,
      count: 20,
      status_list: status_list
    })
    return data
  }

  /**
   * 查看卡券详情
   * 开发者可以调用该接口查询某个card_id的创建信息、审核状态以及库存数量。
   * @param {String} card_id 
   */
  async getCardDetail(card_id) {
    let access_token = await this.getAccessToken();
    let { data } = await axios.post(`https://api.weixin.qq.com/card/get?access_token=${access_token}`, {
      card_id: card_id
    })
    return data;
  }

  /**
   * 查询code接口可以查询当前code是否可以被核销并检查code状态。当前可以被定位的状态为正常、已核销、转赠中、已删除、已失效和无效code。
   */
  async codeGet(card_id, code) {
    // card_id : pO78F1sBphJKd7tpy9
    // code : 327212710869
    let access_token = await this.getAccessToken();
    let { data } = await axios.post(`https://api.weixin.qq.com/card/code/get?access_token=${access_token}`, {
      "card_id": card_id,
      "code": code,
      "check_consume": true
    })
    return data
  }

  /**
   * Code解码
   * code解码接口支持两种场景：
      1.商家获取choos_card_info后，将card_id和encrypt_code字段通过解码接口，获取真实code。
      2.卡券内跳转外链的签名中会对code进行加密处理，通过调用解码接口获取真实code。
   */
  async decryptCode(encrypt_code) {
    let access_token = await this.getAccessToken();
    let { data } = await axios.post(`https://api.weixin.qq.com/card/code/decrypt?access_token=${access_token}`, {
      "encrypt_code": encrypt_code
    })
    return data.errcode == 0 ? data.code : ''
  }

  /**
   * 小程序上领券动作
   * @param {*} card_id 
   */
  async getCodeForMiniProgram(card_id) {
    let card_ticket = await this.getCardTicket();
    let data = await this.sign(card_ticket, card_id)
    return data
  }

  /**
   * 查询Code接口
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1451025239
   * 我们强烈建议开发者在调用核销code接口之前调用查询code接口，并在核销之前对非法状态的code(如转赠中、已删除、已核销等)做出处理。
   * @param {String} code 
   */
  async checkCode(code) {
    let access_token = await this.getAccessToken();
    let { data } = await axios.post(`https://api.weixin.qq.com/card/code/get?access_token=${access_token}`, {
      // card_id: card_id,
      code: code,
      check_consume: false
    })
    think.logger.debug(`checkCode: ${code}, data: ${JSON.stringify(data)}`)
    return data.errcode == 0 && data.can_consume
  }

  /**
   * 核销Code接口
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1451025239
   * 消耗code接口是核销卡券的唯一接口,开发者可以调用当前接口将用户的优惠券进行核销，该过程不可逆。
   * @param {*} code 
   */
  async consumeCode(code) {
    let access_token = await this.getAccessToken();
    let { data } = await axios.post(`https://api.weixin.qq.com/card/code/consume?access_token=${access_token}`, {
      code: code
    })
    think.logger.debug(`consumeCode: ${code}, data: ${JSON.stringify(data)}`)
    return data.errcode == 0
  }
}