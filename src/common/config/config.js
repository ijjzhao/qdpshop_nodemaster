// default config
module.exports = {
  default_module: 'api',
  workers: 1,
  weixin: {
    appid: 'wxb2c22856549f3ab2', // 小程序 appid
    secret: '34268d31ff74199a69a7b5d017d8b450', // 小程序密钥
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
    bucketName: 'collocate'// 存储空间名
  },
  SMSClient: { //阿里云通信基础能力业务短信发送 德威商城
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey',
    SignatureName: '',
    TemplateDomesticCode: '',//国内短信code
    TemplateAbroadCode: '',//国际短信code
  },
};
