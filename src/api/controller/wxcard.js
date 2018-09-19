const Base = require('./base.js');
const axios = require('axios');
const fs = require('fs');

let testAppId = 'wx126f0a81ea45ed09';
let testAppSecret = 'd5aeee43b096218c102fd680a6114d1b';
let access_token;
let expires_at;
let card_ticket;
let ticket_expires_at;

let card_id = 'pO78F1sBphJKd7tpy9-z25crV_50';
let my_openid = 'oO78F1h89ZMjq_vu4Iev7NfgNHQU'

module.exports = class extends Base {
  async indexAction() {
    return this.success({
      access_token: await this.getAccessToken(),
      expires_at: new Date(expires_at).toLocaleString()
    });
  }

  async testAction() {
    return this.success(await this.createQrcode(card_id));
  }

  async getAccessToken() {
    if (!access_token || expires_at - new Date().getTime() < 600 * 1000) {
      let { data } = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
        params: {
          grant_type: 'client_credential',
          appid: testAppId,
          secret: testAppSecret
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

  async createCard() {
    let access_token = await this.getAccessToken()
    let { data } = await axios.post(`https://api.weixin.qq.com/card/create?access_token=${access_token}`, {
      "card": {
        "card_type": "GENERAL_COUPON",
        "general_coupon": {
          "base_info": {
            logo_url: await this.uploadCardLogo(),
            code_type: 'CODE_TYPE_QRCODE',
            brand_name: '轻搭配',
            title: '搭配方案9折券',
            color: 'Color010',
            notice: '请出示二维码',
            description: '不可与其他优惠同享',
            "sku": {
              quantity: 1000,
            },
            date_info: {
              type: 'DATE_TYPE_FIX_TIME_RANGE',
              begin_timestamp: parseInt(new Date().getTime() / 1000),
              end_timestamp: parseInt(new Date().getTime() / 1000 + 7 * 24 * 3600)
            }
          },
          "advanced_info": {
          },
          "default_detail": "优惠券专用，填写优惠详情"
        }
      }
    })
    return data
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
   * “CARD_STATUS_NOT_VERIFY”, 待审核
   * “CARD_STATUS_VERIFY_FAIL”, 审核失败
   * “CARD_STATUS_VERIFY_OK”， 通过审核
   * “CARD_STATUS_DELETE”， 卡券被商户删除
   * “CARD_STATUS_DISPATCH”， 在公众平台投放过的卡券
   */
  async getCardList() {
    let access_token = await this.getAccessToken();
    let { data } = await axios.post(`https://api.weixin.qq.com/card/batchget?access_token=${access_token}`, {
      offset: 0,
      count: 20,
      // status_list: ['CARD_STATUS_VERIFY_OK', 'CARD_STATUS_DISPATCH']
    })
    return data
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
    return data
  }

  async getCodeForMiniProgram(card_id) {
    let card_ticket = await this.getCardTicket();

    let data = await this.service('wxcard', 'api').sign(card_ticket, card_id)

    return data
  }

  async getAction() {
    return this.success(await this.getCodeForMiniProgram(card_id))
  }

  async decryptAction() {
    let encrypt_code = this.post('encrypt_code');
    return this.success(await this.decryptCode(encrypt_code));
  }
}