module.exports = class extends think.Logic {
  async detailAction() {
    const id = this.get('id');
    if (!id) {
      return this.fail('搭配师id错误');
    }
  }
}