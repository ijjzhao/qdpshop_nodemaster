const Base = require('./base.js');

module.exports = class extends Base {
  async getAction() {
    let user_id = this.get('user_id')
    let user_info = await this.model('user_info').where({ user_id }).find()
    this.success(user_info)
  }

  async updateAction() {
    let user_id = this.post('user_id')
    let form = this.post('form')

    let user_info = await this.model('user_info').where({ user_id }).find()
    if (!user_info.user_id) {
      await this.model('user_info').add({user_id})
    }

    console.log(form)
    let res = await this.model('user_info').where({ user_id }).update(form)
    this.success(res);
  }

}