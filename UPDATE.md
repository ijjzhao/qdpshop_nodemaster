## 卡券功能

 数据库 `coupon_main` 增加列 `logo_url`, `color`, `title`, `sub_title`
 `coupon_main` 和 `coupon_user` 中的 `coupon_id` 改为`vachar(255)`
 `coupon_user` 增加列 `coupon_code` 用于记录微信的卡券code

 目前完成情况：
 增加卡券 删除卡券 api已打通

 下一部 
 更新卡券 哪些内容要锁定，比如 卡券类型
 卡券是否转增别人 
 页面上 是否微信卡券

 使用卡券 接口
 