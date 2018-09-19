USE `qdpshop`;

DROP TABLE IF EXISTS `qdpshop_plan`;
CREATE TABLE `qdpshop_plan` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `stylist_id` mediumint(5) unsigned NOT NULL,
  `name` varchar(60) NOT NULL DEFAULT '',
  `style` varchar(20) NOT NULL DEFAULT '',
  `v` smallint(5) unsigned NOT NULL DEFAULT 1,
  `fit_group` varchar(255) NOT NULL DEFAULT '',
  `fit_scene` varchar(255) NOT NULL DEFAULT '',
  `desc` varchar(255) NOT NULL DEFAULT '',
  `add_time` timestamp NOT NULL,
  `enabled` tinyint(3) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `qdpshop_plan_item`;
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

DROP TABLE IF EXISTS `qdpshop_stylist`;
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

DROP TABLE IF EXISTS `qdpshop_style_name`;
CREATE TABLE `qdpshop_style_name` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for qdpshop_user
-- ----------------------------
-- DROP TABLE IF EXISTS `qdpshop_user`;
-- CREATE TABLE `qdpshop_user` (
--   `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
--   `username` varchar(60) NOT NULL DEFAULT '',
--   `password` varchar(32) NOT NULL DEFAULT '',
--   `gender` tinyint(1) unsigned NOT NULL DEFAULT '0',
--   `birthday` int(11) unsigned NOT NULL DEFAULT '0',
--   `register_time` int(11) unsigned NOT NULL DEFAULT '0',
--   `last_login_time` int(11) unsigned NOT NULL DEFAULT '0',
--   `last_login_ip` varchar(15) NOT NULL DEFAULT '',
--   `user_level_id` tinyint(3) unsigned NOT NULL DEFAULT '0',
--   `nickname` varchar(60) NOT NULL,
--   `mobile` varchar(20) NOT NULL DEFAULT '',
--   `register_ip` varchar(45) NOT NULL DEFAULT '',
--   `avatar` varchar(255) NOT NULL DEFAULT '',
--   `weixin_openid` varchar(50) NOT NULL DEFAULT '',
--   `integral` int(11) NOT NULL DEFAULT '0' COMMENT '积分',
--   `user_all_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '用户总消费',
--   `user_recharge_monery` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '用户充值的金额',
--   `user_level` int(2) NOT NULL DEFAULT '0',
--   `user_discount` decimal(10,2) NOT NULL DEFAULT '1.00',
--   `user_level_is_fockers` int(2) NOT NULL DEFAULT '0',
--   `user_level_name` varchar(128) NOT NULL DEFAULT '0',
--   `mobile_country` varchar(64) DEFAULT NULL,
--   `mobile_country_code` varchar(64) DEFAULT NULL,
--   `mobile_code` varchar(64) DEFAULT NULL,
--   `mobile_country_e` varchar(64) DEFAULT NULL,
--   `stylist_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `user_name` (`username`)
-- ) ENGINE=MyISAM AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `qdpshop_style_name`
-- ----------------------------
BEGIN;
INSERT INTO `qdpshop_style_name` VALUES ('1', '简约'), ('2', '休闲'), ('3', '轻时尚');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;