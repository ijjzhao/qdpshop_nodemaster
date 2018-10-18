const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const name = this.get('name') || '';

    const model = this.model('user_info');
    // const data = await model.where({username: ['like', `%${name}%`]}).order(['id DESC']).page(page, size).countSelect();
    const data = await model.order(['id DESC']).page(page, size).countSelect();

    let userMap = {}
    let users = await this.model('user').field(['id','nickname']).select();
    for (let i in users) {
      const user = users[i]
      userMap[user.id] = user.nickname
    }
    
    return this.success( {data, userMap });
  }

  async getByIdAction() {
    const id = this.post('id')
    const data = await this.model('user_info').where({ id: id }).find()
    const user = await this.model('user').where({id: data.user_id}).field(['id', 'nickname']).find();
    data.nickname = user.nickname
    return this.success(data)
  }

}