const Base = require('./base.js');
const fs = require('fs');
const _ = require('lodash');

let pageCount = 10;

module.exports = class extends Base {
  async indexAction() {
    think.logger.debug(think.ROOT_PATH + '/www/');
    let arr = [0, 1, 2];
    arr.splice(1, 1);
    return this.success(arr);
  }

  async getAction() {
    let id = this.get('id');
    let data = await this.model('plan').getPlanAndItems(id);
    this.success(data, 'ok');
  }

  async updateAction() {
    const image = this.file('image');
    const plan_id = this.post('id')
    const name = this.post('name');
    const style = this.post('style');
    const fit_group = this.post('fit_group');
    const fit_scene = this.post('fit_scene');
    const desc = this.post('desc');
    const v = parseInt(this.post('v')) + 1;
    const goodsArr = JSON.parse(this.post('goodsArr'));

    const add_time = new Date()

    if (think.isEmpty(image)) {
      return this.fail('保存失败');
    }
    // 更新plan数据库
    await this.model('plan').where({ id: plan_id }).update({
      name, style, fit_group, fit_scene, desc, add_time, v
    });

    // 新图片上传七牛
    let qiniu = this.service('qiniu', 'api');
    await qiniu.upload(image.path, `${plan_id}.png`, true);

    // 删除plan_item旧商品
    await this.model('plan_item').where({ plan_id }).delete();

    // 添加新商品到plan_item
    for (let i = 0; i < goodsArr.length; i++) {
      const item_model = this.model('plan_item');
      const goods = goodsArr[i];
      await item_model.add({
        plan_id: plan_id,
        goods_id: goods.goods_id,
        x: goods.x,
        y: goods.y,
        z: goods.z,
        w: goods.w,
        h: goods.h,
        enabled: goods.enabled
      })
    }

    return this.success();
  }
  
  /**
   * 保存方案图片
   * @returns {Promise.<void>}
   */
  async saveAction() {
    const image = this.file('image');
    const stylist_id = this.post('stylist_id') || 1;
    const name = this.post('name');
    const style = this.post('style');
    const fit_group = this.post('fit_group');
    const fit_scene = this.post('fit_scene');
    const desc = this.post('desc');
    const goodsArr = JSON.parse(this.post('goodsArr'));

    const add_time = new Date()

    if (think.isEmpty(image)) {
      return this.fail('保存失败');
    }

    // 添加到plan数据库 获得id
    const model = this.model('plan');
    const plan_id = await model.add({
      stylist_id, name, style, fit_group, fit_scene, desc, add_time
    })

    // 上传图片到七牛 文件名为id.png
    let qiniu = this.service('qiniu', 'api');
    await qiniu.upload(image.path, `${plan_id}.png`);

    // 添加商品到plan_item
    for (let i = 0; i < goodsArr.length; i++) {
      const item_model = this.model('plan_item');
      const goods = goodsArr[i];
      await item_model.add({
        plan_id: plan_id,
        goods_id: goods.goods_id,
        x: goods.x,
        y: goods.y,
        z: goods.z,
        w: goods.w,
        h: goods.h,
        enabled: goods.enabled
      })
    }

    this.success();
  }

  /**
   * 根据搭配师和风格 显示方案
   */
  async listAction() {
    const styles = ['简约', '休闲', '轻时尚'];
    const stylist_id = this.get('stylist_id') || 1;
    const style_id = this.get('style_id') || -1;
    const page = this.get('page') || 0;
    let whereJson = { stylist_id }
    if (style_id != -1) {
      whereJson.style = styles[style_id]
    }
    let data = await this.model('plan').where(whereJson).order(['id DESC']).page(page, pageCount).select();
    this.success(data)
  }

  /**
   * 搜索搭配方案
   */
  async searchAction() {
    const stylist_id = this.get('stylist_id') || 1;
    const keyword = this.get('keyword');
    const page = this.get('page') || 0;
    const plans = await this.model('plan')
      .where({ stylist_id: stylist_id, name: ['like', `%${keyword}%`] })
      .order(['id DESC']).page(page, pageCount).select();
    this.success(plans)
  }

  async deleteAction() {
    let id = this.get('planid');
    await this.model('plan').where({ id }).delete();
    await this.model('plan_item').where({ plan_id: id }).delete();
    this.success()
  }

  async copyAction() {
    let id = this.get('planid');
    let plan = await this.model('plan').where({ id }).find();
    let items = await this.model('plan_item').where({ plan_id: id }).select();

    delete plan.id;
    plan.v = 1;
    plan.name = `复制 ${plan.name}`
    let newId = await this.model('plan').add(plan);
    for (let i in items) {
      let item = items[i];
      delete item.id;
      item.plan_id = newId;
      await this.model('plan_item').add(item);
    }

    let newplan = await this.model('plan').where({ id: newId }).find();

    this.success(newplan);
  }
};
