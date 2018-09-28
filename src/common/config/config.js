// default config
module.exports = {
  default_module: 'api',
  workers: 1,
  brand_name: '轻搭配',
  weixin: {
    appid: 'wx703fd25a2cfce741', // 小程序 appid
    secret: 'df6f71acbff56fddf7ad1c027786c6d1', // 小程序密钥,
    cardAppid: 'wx126f0a81ea45ed09', // 公众号 appid // wx126f0a81ea45ed09：测试
    cardSecret: 'd5aeee43b096218c102fd680a6114d1b', // 公众号密钥,
    mch_id: '', // 商户帐号ID
    partner_key: '', // 微信支付密钥
    notify_url: '' // 微信异步通知，
  },
  express: {
    // 快递物流信息查询使用的是快递鸟接口，申请地址：http://www.kdniao.com/
    appid: '', // 对应快递鸟用户后台 用户ID
    appkey: '', // 对应快递鸟用户后台 API key
    request_url: 'http://api.kdniao.cc/Ebusiness/EbusinessOrderHandle.aspx'
  },
  vaptcha: {
    vid: '',
    key: ''
  },
  qiniu: {
    accessKey: 'dKawexMpnY_7Zmek8aJ0RbtatIqTIMvyurd2xdXM', // 七牛提供的公钥
    secretKey: 'X7n14IN13ThBDF2NhMbfwEvhZ0W0RZUqeyRQfSoX', // 七牛提供的私钥
    bucketName: 'qingdapei', // 存储空间名
    xcxBucketName: 'collocate', // 小程序存储空间名
    key: 'img/planTest/'
  },
  SMSClient: { //阿里云通信基础能力业务短信发送
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey',
    SignatureName: '',
    TemplateDomesticCode: '',//国内短信code
    TemplateAbroadCode: '',//国际短信code
  },
};
