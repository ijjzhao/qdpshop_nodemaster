const Base = require('./base.js');

// let testAppId = 'wxe9e9aa229f9bd508';
// let testAppSecret = '148d3df2e562566e7f42009cb429318a';

let card_id = 'pO78F1sBphJKd7tpy9-z25crV_50';
let my_openid = 'oO78F1h89ZMjq_vu4Iev7NfgNHQU'

module.exports = class extends Base {

  async indexAction() {
    return this.success();
  }

  async testAction() {
    let service = this.service('wxcard', 'api');
    let code = '011858520668'; //await service.decryptCode('IksvsPH78QozCvH3vW9v/CKGlf0Zx8m2V/mc9VqMcqg=');
    let checked = await service.checkCode(code);
    if (checked) {
      let result = await service.consumeCode(code);
      if (result) {
        this.success('卡券核销成功');
      } else {
        this.fail('卡券核销失败');
      }
    } else {
      this.fail('卡券状态异常');
    }
  }

  /**
   * 核销卡券
   */
  async consumeAction() {
    let service = this.service('wxcard', 'api');
    let code = this.get('code');
    let crypt = this.get('crypt') || 0;
    if (crypt) {
      code = await service.decryptCode(code);
    }
    let checked = await service.checkCode(code);
    if (checked) {
      let result = await service.consumeCode(code);
      if (result) {
        this.success('卡券核销成功');
      } else {
        this.fail('卡券核销失败');
      }
    } else {
      this.fail('卡券状态异常');
    }
  }

  /**
   * 小程序领取卡券动作
   */
  async getAction() {
    console.log(`userid: ${think.userId}`);
    return this.success(await this.service('wxcard', 'api').getCodeForMiniProgram(card_id))
  }

  /**
   * 用户领取成功动作
   */
  async getsuccessAction() {
    let userId = think.userId;
    let cardList = this.post('cardList');
    console.log(cardList);
    for (let i in cardList) {
      let card = cardList[i]
      // TODO 存入数据库
      // TODO 减少库存
      console.log(card);
    }
    this.success();
  }

  // { cardId: 'pO78F1sBphJKd7tpy9-z25crV_50',
  // cardExt: '{"code":"","timestamp":"1537408194","signature":"544572cdadb67cbdb9b9361db28ba374b976cb04","nonce_str":"wdl48slj3d"}',
  // code: 'IksvsPH78QozCvH3vW9v/CKGlf0Zx8m2V/mc9VqMcqg=',
  // isSuccess: true }

  /**
   * 小程序解码code动作
   */
  async decryptAction() {
    let encrypt_code = this.post('encrypt_code');
    return this.success(await this.service('wxcard', 'api').decryptCode(encrypt_code));
  }
}