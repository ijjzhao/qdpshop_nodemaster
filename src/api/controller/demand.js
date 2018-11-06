const Base = require('./base.js');

let pageCount = 10;

module.exports = class extends Base {

  async getAction() {
    let id = this.get('id')
    let demand = await this.model('demand').where({ id }).find()
    let user_id = demand.user_id
    let userinfo = await this.model('user').where({ id: user_id }).field(['nickname', 'avatar']).find()
    demand.nickname = userinfo.nickname;
    demand.avatarUrl = userinfo.avatar;
    this.success({ demand })
  }

  async listAction() {
    let user_id = think.userId;
    const page = this.get('page') || 0;
    const isCustomer = this.get('isCustomer') || 0;
    let whereJson = {}
    if (isCustomer == 1) {
      whereJson.user_id = user_id
    }
    // let list = await this.model('demand').where(whereJson).order([`status`]).page(page, pageCount).select();
    let list = await this.model('demand').where(whereJson).order([`id DESC`]).page(page, pageCount).select();
    let map = {}
    for (let i in list) {
      let user_id = list[i].user_id;
      if (!map[user_id]) {
        map[user_id] = await this.model('user').where({ id: user_id }).field(['id', 'nickname', 'avatar']).find()
        let userinfo = await this.model('user_info').where({ user_id }).find();
        map[user_id].age = userinfo.age
        map[user_id].avatarUrl = map[user_id].avatar
      } else {
        if (!map[user_id].age) {
          let userinfo = await this.model('user_info').where({ user_id }).find();
          map[user_id].age = userinfo.age
        }
      }
    }

    this.success({ list, map })
  }

  async saveAction() {
    let form = this.post('form')
    let user_id = think.userId
    form.user_id = user_id
    if (!form.user_id) {
      return this.fail();
    }

    form.create_at = new Date().getTime()
    form.update_at = new Date().getTime()
    await this.model('demand').add(form)

    this.success();
  }

  async updateAction() {
    let id = this.post('id');
    if (!id) {
      this.fail('id错误')
    }
    let form = this.post('form')
    form.update_at = new Date().getTime()
    let res = await this.model('demand').where({ id }).update(form)
    this.success(res);
  }

  async allplanAction() {
    let user_id = this.post('user_id')
    let data = await this.model('demand').where({ user_id }).field(['plan_id']).select();
    let arr = []
    for (let i in data) {
      let demand = data[i]
      if (demand.plan_id != 0 && arr.indexOf(demand.plan_id) == -1) {
        arr.push(demand.plan_id)
      }
    }
    this.success(arr)
  }

}