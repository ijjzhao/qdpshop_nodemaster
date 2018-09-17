const Base = require('./base.js');
const axios = require('axios');
const fs = require('fs');

let testAppId = 'wx126f0a81ea45ed09';
let testAppSecret = 'd5aeee43b096218c102fd680a6114d1b';
let access_token;
let expires_time;

let card_id = 'pO78F1qloONLdgqviy1QnxNkgQ3w';

module.exports = class extends Base {
  async indexAction() {
    return this.success({
      access_token: await this.getAccessToken(),
      expires_time: new Date(expires_time).toLocaleString()
    });
  }

  async testAction() {
    return this.success(await this.getQrcode());
  }

  async getAccessToken() {
    if (!access_token || expires_time - new Date().getTime() < 600 * 1000) {
      let { data } = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
        params: {
          grant_type: 'client_credential',
          appid: testAppId,
          secret: testAppSecret
        }
      })
      access_token = data.access_token;
      expires_time = new Date().getTime() + 7200 * 1000;
    }
    return access_token;
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

  async getQrcode() {
    let access_token = await this.getAccessToken();
    let {data} = await axios.post(`https://api.weixin.qq.com/card/qrcode/create?access_token=${access_token}`, {
      "action_name": "QR_CARD",
      "action_info": {
        "card": {
          "card_id": card_id,
        }
      }
    })
    return data
  }
}