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
      let create_at = new Date().getTime()
      await this.model('user_info').add({user_id, create_at})
    }
    form.update_at = new Date().getTime()

    let res = await this.model('user_info').where({ user_id }).update(form)
    this.success(res);
  }

  /**
   * 检查用户档案完整性
   * {"errno":0,"errmsg":"信息完整","data":1}
   * {"errno":0,"errmsg":"信息不完整","data":0}
   */
  async checkCompleteAction() {
    let user_id = this.get('user_id')

    let user_info = await this.model('user_info').where({ user_id }).find()
    if (!user_info.user_id) {
      this.fail('不存在该用户的档案')
    }

    if (!user_info.height || !user_info.weight || !user_info.age || !user_info.detail ||
      !user_info.color || !user_info.style || user_info.cut == undefined || !user_info.size) {
        this.success(0, '信息不完整')
    } else {
      this.success(1, '信息完整')
    }
  }
}