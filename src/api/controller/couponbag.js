const Base = require('./base')

module.exports = class extends Base {
  async listAction() {
    let data = await this.model('coupon_bag').order(['id DESC']).select();
    this.success(data);
  }

  async saveAction() {
    let form = this.post('form')

    if (form.name == undefined || form.type == undefined) {
      return this.fail('信息不全')
    }

    if (form.type != 0 && form.type != 1) {
      return this.fail('卡包类型错误')
    }
    // 新人卡包是不是只限有一个

    await this.model('coupon_bag').add(form);
    this.success();
  }

  async updateAction() {
    let id = this.post('id')
    let form = this.post('form')

    let res = await this.model('coupon_bag').where({ id }).update(form)
    this.success(res);
  }
  
}