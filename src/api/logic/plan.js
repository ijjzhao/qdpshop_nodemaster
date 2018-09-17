module.exports = class extends think.Logic {
  getAction() {
    let id = this.get('id');
    if (!id) return this.fail('id有误');
  }
};
