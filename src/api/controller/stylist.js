const Base = require('./base');

module.exports = class extends Base {
  async indexAction () {
    const model = this.model('stylist');
    const data = await model.where({}).select();

    return this.success(data);
  }

  async listAction() {
    const model = this.model('stylist');
    const data = await model.where({}).select();

    return this.success(data);
  }

  async detailAction() {
    const id = this.get('id');
    const model = this.model('stylist');
    const data = await model.where({id: id}).find();
  
    return this.success(data);
  }

  async checkAction() {
    const user_id = this.get('user_id')
    let userInfo = await this.model('user').where({id: user_id}).find();

    if (userInfo.stylist_id != 0) {
      this.success('该用户是搭配师')
    } else {
      this.fail('该用户不是搭配师')
    }
  }
}