USE `qdpshop`;

DROP TABLE IF EXISTS `qdpshop_plan`;
CREATE TABLE `qdpshop_plan` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `stylist_id` mediumint(5) unsigned NOT NULL,
  `name` varchar(60) NOT NULL DEFAULT '',
  `v` smallint(5) unsigned NOT NULL DEFAULT 1,
  `style` int(1) NOT NULL DEFAULT -1 COMMENT '风格', -- 0 简约 1 时尚 2 休闲 3 运动 4 商务
  `cut` int(1) NOT NULL DEFAULT -1 COMMENT '版型', -- 0 修身 1 适中 2 宽松
  `feel` varchar(255) NOT NULL DEFAULT '[]' COMMENT '体感', -- 0 舒适 1 透气 2 有型 3 正常
  `desc` varchar(255) NOT NULL DEFAULT '',
  `add_time` timestamp NOT NULL,
  `enabled` tinyint(3) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- DROP TABLE IF EXISTS `qdpshop_plan_item`;
CREATE TABLE `qdpshop_plan_item` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `plan_id` mediumint(8) unsigned NOT NULL,
  `goods_id` bigint(32) unsigned NOT NULL,
  `x` smallint(5) NOT NULL,
  `y` smallint(5) NOT NULL,
  `z` smallint(5) NOT NULL,
  `w` smallint(5) unsigned NOT NULL,
  `h` smallint(5) unsigned NOT NULL,
  `url` varchar(255) NOT NULL DEFAULT '',
  `product_id` mediumint(12) unsigned NOT NULL DEFAULT 0,
  `enabled` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- DROP TABLE IF EXISTS `qdpshop_stylist`;
CREATE TABLE `qdpshop_stylist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` mediumint(8) unsigned NOT NULL,
  `style` varchar(255) NOT NULL,
  `adoption_rate` int(11) NOT NULL DEFAULT '0',
  `goodat` varchar(255) NOT NULL,
  `experience` varchar(255) NOT NULL,
  `desc` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- DROP TABLE IF EXISTS `qdpshop_style_name`;
-- CREATE TABLE `qdpshop_style_name` (
--   `id` int(11) NOT NULL AUTO_INCREMENT,
--   `name` varchar(10) NOT NULL,
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- -- ----------------------------
-- --  Records of `qdpshop_style_name`
-- -- ----------------------------
-- BEGIN;
-- INSERT INTO `qdpshop_style_name` VALUES ('1', '简约'), ('2', '休闲'), ('3', '轻时尚');
-- COMMIT;

-- SET FOREIGN_KEY_CHECKS = 1;


-- DROP TABLE IF EXISTS `qdpshop_user_info`;
CREATE TABLE `qdpshop_user_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `height` varchar(10),
  `weight` varchar(10),
  `age` int(3),
  `detail` varchar(255),
  `color` varchar(255),
  `style` varchar(255),
  `cut` int(1),
  `size` varchar(20),
  `pics` text,
  `create_at` varchar(13) COMMENT '创建时间',
  `update_at` varchar(13) COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- DROP TABLE IF EXISTS `qdpshop_coupon_bag`;
CREATE TABLE `qdpshop_coupon_bag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `desc` varchar(255),
  `type` int(1) NOT NULL DEFAULT 0, -- 0 新用户 1 通用 
  `coupon_ids` varchar(255), -- 0 coupon_id数组
  `start_at` varchar(32) DEFAULT NULL COMMENT '有效期开始时间',
  `end_at` varchar(32) DEFAULT NULL COMMENT '有效期结束时间',
  `isabled` int(1) NOT NULL DEFAULT 1,
  `create_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `qdpshop_demand` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `scene` int(1) NOT NULL DEFAULT 0 COMMENT '穿衣场景', -- 0 日常 1 商务拜访 2 运动休闲 3约会 4 其他
  `budget` int(1) NOT NULL DEFAULT 0 COMMENT '预算', -- 0 100-300元 1 300-600元 2 600-1000元
  `desc`  int(1) NOT NULL DEFAULT 0 COMMENT '描述', -- 0 舒适就好 1 要帅 2 要有气质 3 其他
  `other` varchar(255) NOT NULL DEFAULT '' COMMENT '其他想说的话',
  `stylist_desc` varchar(255) NOT NULL DEFAULT '' COMMENT '搭配师写的描述',
  `plans` varchar(255) NOT NULL DEFAULT '[]' COMMENT '方案id',
  `plan_id` int(11) NOT NULL DEFAULT 0 COMMENT '下单的方案id',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '订单状态', -- 0 用户提交 1 搭配师选择方案完毕 2 用户下单 3 完成支付
  `isabled` int(1) NOT NULL DEFAULT 1,
  `create_at` varchar(255) NOT NULL,
  `update_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `qdpshop_user_note` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `note` varchar(255) NOT NULL DEFAULT '' COMMENT 'note',
  `stylist_user_id` int(11) NOT NULL COMMENT '搭配师用户id',
  `create_at` varchar(255) NOT NULL,
  `update_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;