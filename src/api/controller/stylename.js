const base = require('./base')

module.exports = class extends base {
  async indexAction() {
    return this.success(await this.model('style_name').select());
  }

  async getAction() {
    let id = this.get('id');

    if (id) {
      let data = await this.model('style_name').where({ id }).find();
      return this.success(data);
    } else {
      return this.fail('风格id为空');
    }
  }

  async addAction() {
    let name = this.get('name');
    if (name) {
      let id = await this.model('style_name').add({ name });
      return this.success('添加成功: ' + id);
    } else {
      return this.fail('风格名称为空');
    }
  }

  async updateAction() {
    let id = this.get('id');
    let name = this.get('name');

    if (id && name) {
      await this.model('style_name').where({ id }).update({ name });
      return this.success('修改成功');
    } else {
      return this.fail('风格id或新名称为空');
    }
  }

  async deleteAction() {
    let id = this.get('id');

    if (id) {
      await this.model('style_name').where({ id }).delete();
      return this.success('删除成功');
    } else {
      return this.fail('风格id为空');
    }
  }
}