USE `qdpshop`;
alter table `qdpshop_plan_item` add column `url` varchar(255) NOT NULL DEFAULT '';

alter table `qdpshop_coupon_main` add column `logo_url` varchar(255) NOT NULL DEFAULT '';
alter table `qdpshop_coupon_main` add column `color` varchar(10) NOT NULL DEFAULT '';
alter table `qdpshop_coupon_main` add column `title` varchar(255) NOT NULL DEFAULT '';
alter table `qdpshop_coupon_main` add column `sub_title` varchar(255) NOT NULL DEFAULT '';

alter table `qdpshop_coupon_main` modify column `coupon_id` varchar(255);