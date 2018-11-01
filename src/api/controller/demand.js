const Base = require('./base.js');

let pageCount = 10;

module.exports = class extends Base {

  async getAction() {
    let id = this.get('id')
    let demand = await this.model('demand').where({id}).find()
    let user_id = demand.user_id
    let userinfo = await this.model('user').where({ id: user_id }).field(['nickname', 'avatarUrl']).find()
    demand.nickname = userinfo.nickname;
    demand.avatarUrl = userinfo.avatarUrl;
    this.success({demand})
  }

  async listAction() {
    let user_id = think.userId;
    const page = this.get('page') || 0;
    const isCustomer = this.get('isCustomer') || 0;
    let whereJson = {}
    if (isCustomer) {
      whereJson.user_id = user_id
    }
    let list = await this.model('demand').where(whereJson).order(['id DESC']).page(page, pageCount).select();
    let map = {}
    for (let i in list) {
      let user_id = list[i].user_id;
      if (!map[user_id]) {
        map[user_id] = await this.model('user').where({ id: user_id }).field(['id', 'nickname', 'avatarUrl']).find()
      } else {
        if (!map[user_id].age) {
          let userinfo = await this.model('user_info').where({user_id}).find();
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

}