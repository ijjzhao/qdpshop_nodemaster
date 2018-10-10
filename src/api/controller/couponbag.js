const Base = require('./base')

module.exports = class extends Base {

  // type: 0 新人卡包 1 通用卡包
  async getfornewuserAction() {
    let data = await this.model('coupon_bag').where({ type: 0, isabled: 1 }).order(['id DESC']).select();
    let arr = []

    let now = new Date().getTime()
    for (let i in data) {
      let bag = data[i]
      if (bag.start_at < now && bag.end_at > now && bag.coupon_ids != '') arr.push(bag)
    }

    if (arr.length > 0) {
      let bag = arr[0]

      // 用户获取卡券
      let coupon_ids = bag.coupon_ids.split(',')
      let coupons = []
      for (let i in coupon_ids) {
        let id = coupon_ids[i]
        let coupon_main = await this.model('coupon_main').where({ id }).find()
        coupons.push(coupon_main)
        const have = await this.model('coupon_user').where({ coupon_id: coupon_main.coupon_id, user_id: think.userId }).select()
        // 该卡券没有领取过
        if (have.length == 0) {
          await this.model('coupon_main').where({ id }).update({
            obtained_num: Number(coupon_main.obtained_num) + 1
          })
          const coupon_user_id = await this.model('coupon_user').add({
            user_id: think.userId,
            coupon_id: coupon_main.coupon_id,
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
        } else {
          return this.fail('卡包内有已经领取过的卡券')
        }
      }
      // 用户获取卡券 结束
      this.success({ bag, coupons });
    } else {
      this.fail('没有可用的新人卡包')
    }
  }

}