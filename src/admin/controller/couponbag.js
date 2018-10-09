const Base = require('./base')

module.exports = class extends Base {

  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const couponbagname = this.get('couponbagname') || '';
    const model = this.model('coupon_bag');
    const data = await model.where({ name: ['like', `%${couponbagname}%`] }).order(['id DESC']).page(page, size).countSelect();
    return this.success(data);
  }

  async findcouponbaginfoByIdAction() {
    const id = this.post('id')
    const data = await this.model('coupon_bag').where({ id: id }).find()
    return this.success(data)
  }

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

    form.create_at = new Date().toLocaleString();
    console.log(new Date().toLocaleString())

    await this.model('coupon_bag').add(form);
    this.success();
  }

  async updateAction() {
    let id = this.post('id')
    let form = this.post('form')

    let res = await this.model('coupon_bag').where({ id }).update(form)
    this.success(res);
  }

  async couponsAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 5;
    const couponname = this.get('couponname') || '';

    const model = this.model('coupon_main');
    const data = await model.where({ coupon_name: ['like', `%${couponname}%`] }).order(['id DESC']).page(page, size).countSelect();
    return this.success(data);
  }
  
  async deleteAction() {
    const id = this.post('id');
    await this.model('coupon_bag').where({ id }).limit(1).delete();
    return this.success();
  }
}