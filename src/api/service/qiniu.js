const qiniu = require('qiniu');

module.exports = class extends think.Service {
  async upload(filePath, filename, overwrite = false) {
    var config = new qiniu.conf.Config();
    let key = 'img/plan/' + filename;

    config.zone = qiniu.zone.Zone_z0; // 空间对应的机房

    /**
     *  华东	qiniu.zone.Zone_z0
     *  华北	qiniu.zone.Zone_z1
     *  华南	qiniu.zone.Zone_z2
     *  北美	qiniu.zone.Zone_na0
     */

    // var accessKey = 'qyvKYsZh5_zktu0Z1V72HFtwXg7U8n78Ms-iMDkX';
    // var secretKey = '44RfgfRCxg5kYuF9mzWBC02gN5JN2xuHRONv17F8';
    // let scopeName = 'youjianmishi';

    // 七牛提供的公钥
    const accessKey = think.config('qiniu.accessKey')
    // 七牛提供的私钥
    const secretKey = think.config('qiniu.secretKey')
    // 存储空间名
    const bucketName = think.config('qiniu.bucketName')
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

    var options = {}
    if (overwrite) {
      options.scope = `${bucketName}:${key}`;
    } else {
      options.scope = bucketName;
    }
    // var options = {
    //   scope: scopeName
    // };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);

    var formUploader = new qiniu.form_up.FormUploader(config);
    var localFile = filePath;
    var putExtra = new qiniu.form_up.PutExtra();

    // 文件上传
    return new Promise((resolve, reject) => {
      formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
        if (respErr) {
          // throw respErr;
          reject(respErr)
        }
        if (respInfo.statusCode == 200) {
          console.log(respBody);
        } else {
          console.log(respInfo.statusCode);
          console.log(respBody);
        }
        resolve(respBody);
      });
    })

  }
}