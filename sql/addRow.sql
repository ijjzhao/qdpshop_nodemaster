USE `qdpshop`;
alter table `qdpshop_user` add column `stylist_id` mediumint(8) NOT NULL DEFAULT 0;

alter table `qdpshop_plan_item` add column `url` varchar(255) NOT NULL DEFAULT '';

alter table `qdpshop_coupon_main` add column `logo_url` varchar(255) NOT NULL DEFAULT '';
alter table `qdpshop_coupon_main` add column `color` varchar(10) NOT NULL DEFAULT '';
alter table `qdpshop_coupon_main` add column `isWxcard` int(1) NOT NULL DEFAULT 0;
-- alter table `qdpshop_coupon_main` add column `title` varchar(255) NOT NULL DEFAULT '';
-- alter table `qdpshop_coupon_main` add column `sub_title` varchar(255) NOT NULL DEFAULT '';

alter table `qdpshop_coupon_main` modify column `coupon_id` varchar(255);
alter table `qdpshop_coupon_user` modify column `coupon_id` varchar(255);
alter table `qdpshop_coupon_user` add column `coupon_code` varchar(255) NOT NULL DEFAULT '';

alter table `qdpshop_user_info` add column `pics` text;
alter table `qdpshop_user_info` add column `create_at` varchar(13) COMMENT '创建时间';
alter table `qdpshop_user_info` add column `update_at` varchar(13) COMMENT '更新时间';


alter table `qdpshop_user` add column `avatarUrl` varchar(255) NOT NULL DEFAULT '';
