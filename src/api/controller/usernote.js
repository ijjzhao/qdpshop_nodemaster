const Base = require('./base.js');

module.exports = class extends Base {
  async getAction() {
    let id = this.get('id')
    let user_note = await this.model('user_note').where({ id }).find()
    this.success(user_note)
  }

  async listAction() {
    let user_id = this.get('user_id')
    let user_note = await this.model('user_note').where({ user_id }).order(['id DESC']).select()
    let userMap = {}
    for (let i in user_note) {
      let note = user_note[i]
      if (!userMap[note.stylist_user_id]) {
        let userinfo = await this.model('user').where({id: note.stylist_user_id}).field(['nickname']).find();
        userMap[note.stylist_user_id] = userinfo.nickname;
      }
      note.stylist_name = userMap[note.stylist_user_id]
      note.create_date = new Date(parseInt(note.create_at)).toLocaleString();
    }
    this.success(user_note)
  }

  async addAction() {
    let form = this.post('form')
    if (!form.user_id) {
      return this.fail('用户id为空')
    }
    if (!form.stylist_user_id) {
      return this.fail('搭配师用户id为空')
    }

    form.create_at = new Date().getTime()
    form.update_at = new Date().getTime()
    
    let res = await this.model('user_note').add(form)
    this.success(res);
  }

  async updateAction() {
    let id = this.post('id')
    let form = this.post('form')
    form.update_at = new Date().getTime()

    let res = await this.model('user_note').where({ id }).update(form)
    this.success(res);
  }

  async deleteAction() {
    let id = this.post('id')
    await this.model('user_note').where({ id }).delete();
    this.success();
  }
}