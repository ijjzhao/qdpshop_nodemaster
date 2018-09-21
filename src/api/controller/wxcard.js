const Base = require('./base.js');

// let testAppId = 'wxe9e9aa229f9bd508';
// let testAppSecret = '148d3df2e562566e7f42009cb429318a';

let card_id = 'pO78F1jgzdYgtEoonXsScB5MbZX0';
let my_openid = 'oO78F1h89ZMjq_vu4Iev7NfgNHQU'

module.exports = class extends Base {

  async indexAction() {
    return this.success();
  }

  async cardaddAction() {
    let card = await this.model('coupon_main').where({ id: 72 }).find();
    let wxcarddata = await this.service('wxcard', 'api').createCard(card.coupon_type, card.logo_url,
      card.title, card.color, card.Instructions, card.coupon_number, card.validity_type,
      card.validity_start, card.validity_end, card.validity_limit_day, card.coupon_value, card.coupon_limit_value)
    console.log(wxcarddata);
    this.success(wxcarddata)
  }

  async carddeleteAction() {
    let card_id = this.get('card_id');
    let service = this.service('wxcard', 'api');
    this.success(await service.deleteCard(card_id));
  }

  async cardlistAction() {
    let service = this.service('wxcard', 'api');
    this.success(await service.getCardList(['CARD_STATUS_NOT_VERIFY']));
  }

  async carddetailAction() {
    let service = this.service('wxcard', 'api');
    let data = await service.getCardDetail('pO78F1uKLtDwThAJ6BdqYDVgmtMo');
    return this.success(data);
  }

  /**
   * 需要公众号的openid才行 小程序没用
   */
  async carduserlistAction() {
    let userId = think.userId;
    if (!userId) return this.fail('未登录')

    let user = await this.model('user').where({ id: userId }).find();
    let openid = user.weixin_openid

    let service = this.service('wxcard', 'api');
    this.success(await service.getUserCardList(openid));
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
    let card_id = this.post('card_id');
    const have = await this.model('coupon_user').where({ coupon_id: card_id, user_id: think.userId }).select()
    if (have.length !== 0) {
      return this.fail(217, '已存在！')
    }
    return this.success(await this.service('wxcard', 'api').getCodeForMiniProgram(card_id))
  }

  /**
   * 用户领取成功动作
   */
  async getsuccessAction() {
    let userId = think.userId;
    let cardList = this.post('cardList');
    let card = cardList[0] // 只处理一张卡券的情况

    let card_id = card.cardId;
    let code = await this.service('wxcard', 'api').decryptCode(card.code)

    let coupon_main = await this.model('coupon_main').where({ coupon_id: card_id }).find();
    // 减少库存
    await this.model('coupon_main').where({ coupon_id: card_id }).update({
      obtained_num: Number(coupon_main.obtained_num) + 1
    })

    const coupon_user_id = await this.model('coupon_user').add({
      user_id: userId,
      coupon_id: card_id,
      coupon_code: code,
      coupon_name: coupon_main.coupon_name,
      coupon_number: coupon_main.coupon_number,
      coupon_type: coupon_main.coupon_type,
      coupon_value: coupon_main.coupon_value,
      coupon_limit: coupon_main.coupon_limit,
      coupon_limit_value: coupon_main.coupon_limit_value,
      coupon_user_getnumber: coupon_main.coupon_user_getnumber,
      validity_type: coupon_main.validity_type,
      validity_create: coupon_main.validity_create,
      validity_start: new Date().getTime(),
      validity_end: parseInt(new Date().getTime()) + parseInt(coupon_main.validity_limit_day),
      point_goods: coupon_main.point_goods,
      point_user: coupon_main.point_user,
      Instructions: coupon_main.Instructions
    })

    const coupon_user = await this.model('coupon_user').where({ id: coupon_user_id }).find()
    return this.success(coupon_user)
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