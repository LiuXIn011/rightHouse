CREATE DATABASE `right_house_db` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `right_house_db`;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin_user
-- ----------------------------
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户名称',
  `remark` int(0) NULL DEFAULT NULL COMMENT '备注',
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '手机号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '密码',
  `status` int(0) NULL DEFAULT 1 COMMENT '状态：1：正常，2：停用，3：删除',
  `head_img` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '头像',
  `created_at` datetime(0) NULL DEFAULT NULL COMMENT '创建日期',
  `updated_at` datetime(0) NULL DEFAULT NULL COMMENT '最近更新日期',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin_user
-- ----------------------------
INSERT INTO `admin_user` VALUES (1, 'admin', NULL, 'admin', 'admin', 1, NULL, '2023-08-24 16:31:33', '2023-08-24 16:31:36');

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `landlord_id` int(0) NOT NULL COMMENT '房东id',
  `tenant_id` int(0) NOT NULL COMMENT '租客id',
  `house_id` int(0) NOT NULL COMMENT '房间id',
  `house_score` int(0) NOT NULL COMMENT '房间评分',
  `landlord_score` int(0) NOT NULL COMMENT '房东评分',
  `house_comment` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '房间评价',
  `landlord_comment` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '房东评价',
  `house_comment_img` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '房间评价图片',
  `landlord_comment_img` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '房东评价图片',
  `status` int(0) NOT NULL DEFAULT 1 COMMENT '状态：1：正常，2：停用，3：删除',
  `created_at` datetime(0) NULL DEFAULT NULL COMMENT '创建日期',
  `updated_at` datetime(0) NULL DEFAULT NULL COMMENT '最近更新日期',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `landlord_id`(`landlord_id`) USING BTREE,
  INDEX `tenant_id`(`tenant_id`) USING BTREE,
  INDEX `house_id`(`house_id`) USING BTREE,
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`landlord_id`) REFERENCES `landlord_user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tenants_user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `comment_ibfk_3` FOREIGN KEY (`house_id`) REFERENCES `house` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for house
-- ----------------------------
DROP TABLE IF EXISTS `house`;
CREATE TABLE `house`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '房子id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '房子名称',
  `user_id` int(0) NOT NULL COMMENT '房东id',
  `parent_id` int(0) NOT NULL COMMENT '上级房间id',
  `province_id` int(0) NOT NULL COMMENT '省id',
  `province_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '省名称',
  `city_id` int(0) NOT NULL COMMENT '市id',
  `city_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '市名称',
  `area_id` int(0) NOT NULL COMMENT '区id',
  `area_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '区名称',
  `addres_info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '详细地址',
  `longitude` double(20, 8) NULL DEFAULT NULL COMMENT '经度',
  `latitude` double(20, 8) NULL DEFAULT NULL COMMENT '纬度',
  `area` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '面积',
  `price` double(20, 8) NULL DEFAULT NULL COMMENT '租金',
  `fake_price` double(20, 8) NULL DEFAULT NULL COMMENT '对外租金',
  `deposit_number` int(0) NULL DEFAULT NULL COMMENT '押金月数',
  `price_number` int(0) NULL DEFAULT NULL COMMENT '每次付月数',
  `floor` int(0) NULL DEFAULT NULL COMMENT '楼层',
  `toward` int(0) NULL DEFAULT NULL COMMENT '朝向  1东  2西  3南  4北',
  `toilet` int(0) NULL DEFAULT NULL COMMENT '卫生间 0没有 1独立 2公用',
  `kitchen` int(0) NULL DEFAULT NULL COMMENT '厨房 0没有 1独立 2公用',
  `balcony` int(0) NULL DEFAULT NULL COMMENT '阳台  1有  0没有',
  `water_fee` double(20, 8) NULL DEFAULT NULL COMMENT '水费',
  `electricity_fee` double(20, 8) NULL DEFAULT NULL COMMENT '电费',
  `internet_fee` double(20, 8) NULL DEFAULT NULL COMMENT '网费',
  `fuel_fee` double(20, 8) NULL DEFAULT NULL COMMENT '燃气费',
  `note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  `head_img` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图片',
  `status` int(0) NOT NULL DEFAULT 1 COMMENT '状态  1待租 2已租 3删除',
  `created_at` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime(0) NULL DEFAULT NULL COMMENT '最近更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `house_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `landlord_user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for house_link_tenant
-- ----------------------------
DROP TABLE IF EXISTS `house_link_tenant`;
CREATE TABLE `house_link_tenant`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `status` int(0) NULL DEFAULT 1 COMMENT '状态 0取消关联  1正常关联',
  `house_id` int(0) NOT NULL COMMENT '房子id',
  `tenant_id` int(0) NOT NULL COMMENT '租客id',
  `created_at` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime(0) NULL DEFAULT NULL COMMENT '最近更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `house_link_tenant_tenantId_houseId_unique`(`house_id`, `tenant_id`) USING BTREE,
  INDEX `tenant_id`(`tenant_id`) USING BTREE,
  CONSTRAINT `house_link_tenant_ibfk_1` FOREIGN KEY (`house_id`) REFERENCES `house` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `house_link_tenant_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tenants_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for house_maintenance
-- ----------------------------
DROP TABLE IF EXISTS `house_maintenance`;
CREATE TABLE `house_maintenance`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `tenant_id` int(0) NOT NULL COMMENT '租客id',
  `house_id` int(0) NOT NULL COMMENT '房间id',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `status` int(0) NULL DEFAULT 0 COMMENT '状态  0未处理  1已处理',
  `images` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图片',
  `video` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '视频',
  `created_at` datetime(0) NULL DEFAULT NULL COMMENT '创建日期',
  `updated_at` datetime(0) NULL DEFAULT NULL COMMENT '更新日期',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `tenant_id`(`tenant_id`) USING BTREE,
  INDEX `house_id`(`house_id`) USING BTREE,
  CONSTRAINT `house_maintenance_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants_user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `house_maintenance_ibfk_2` FOREIGN KEY (`house_id`) REFERENCES `house` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for landlord_link_tenant
-- ----------------------------
DROP TABLE IF EXISTS `landlord_link_tenant`;
CREATE TABLE `landlord_link_tenant`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `status` int(0) NULL DEFAULT 1 COMMENT '状态 0取消关联  1正常关联',
  `landlord_id` int(0) NOT NULL COMMENT '房东id',
  `tenant_id` int(0) NOT NULL COMMENT '租客id',
  `created_at` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime(0) NULL DEFAULT NULL COMMENT '最近更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `landlord_link_tenant_tenantId_landlordId_unique`(`landlord_id`, `tenant_id`) USING BTREE,
  INDEX `tenant_id`(`tenant_id`) USING BTREE,
  CONSTRAINT `landlord_link_tenant_ibfk_1` FOREIGN KEY (`landlord_id`) REFERENCES `landlord_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `landlord_link_tenant_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tenants_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for landlord_user
-- ----------------------------
DROP TABLE IF EXISTS `landlord_user`;
CREATE TABLE `landlord_user`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户名称',
  `remark` int(0) NULL DEFAULT NULL COMMENT '备注',
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '手机号',
  `open_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '微信openId',
  `union_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '微信unionId',
  `session_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '微信sessionKey',
  `source_type` int(0) NULL DEFAULT NULL COMMENT '用户来源：1:微信',
  `status` int(0) NULL DEFAULT NULL COMMENT '状态：1：正常，2：停用，3：删除',
  `head_img` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '头像',
  `created_at` datetime(0) NULL DEFAULT NULL COMMENT '创建日期',
  `updated_at` datetime(0) NULL DEFAULT NULL COMMENT '最近更新日期',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for lease_application
-- ----------------------------
DROP TABLE IF EXISTS `lease_application`;
CREATE TABLE `lease_application`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `status` int(0) NULL DEFAULT 0 COMMENT '状态 0未处理  1已通过 2已驳回',
  `house_id` int(0) NOT NULL COMMENT '房屋id',
  `tenant_id` int(0) NOT NULL COMMENT '租客id',
  `landlord_id` int(0) NOT NULL COMMENT '房东id',
  `rental_market_id` int(0) NOT NULL COMMENT '房市id',
  `created_at` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime(0) NULL DEFAULT NULL COMMENT '最近更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `house_id`(`house_id`) USING BTREE,
  INDEX `tenant_id`(`tenant_id`) USING BTREE,
  INDEX `landlord_id`(`landlord_id`) USING BTREE,
  INDEX `rental_market_id`(`rental_market_id`) USING BTREE,
  CONSTRAINT `lease_application_ibfk_1` FOREIGN KEY (`house_id`) REFERENCES `house` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `lease_application_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tenants_user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `lease_application_ibfk_3` FOREIGN KEY (`landlord_id`) REFERENCES `landlord_user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `lease_application_ibfk_4` FOREIGN KEY (`rental_market_id`) REFERENCES `rental_market` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for rental_market
-- ----------------------------
DROP TABLE IF EXISTS `rental_market`;
CREATE TABLE `rental_market`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '市场主键id',
  `house_id` int(0) NOT NULL COMMENT '关联房子id',
  `user_id` int(0) NOT NULL COMMENT '房东id',
  `hot_degree` int(0) NOT NULL DEFAULT 10 COMMENT '热度',
  `status` int(0) NOT NULL DEFAULT 1 COMMENT '状态  1正常 2下架 3删除',
  `created_at` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime(0) NULL DEFAULT NULL COMMENT '最近更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `house_id`(`house_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `rental_market_ibfk_1` FOREIGN KEY (`house_id`) REFERENCES `house` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rental_market_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `landlord_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for rental_market_link_tenant
-- ----------------------------
DROP TABLE IF EXISTS `rental_market_link_tenant`;
CREATE TABLE `rental_market_link_tenant`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `status` int(0) NULL DEFAULT 1 COMMENT '状态 0取消关联  1正常关联',
  `rental_market_id` int(0) NOT NULL COMMENT '房市id',
  `tenant_id` int(0) NOT NULL COMMENT '租客id',
  `created_at` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime(0) NULL DEFAULT NULL COMMENT '最近更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `rental_market_link_tenant_tenantId_rentalMarketId_unique`(`rental_market_id`, `tenant_id`) USING BTREE,
  INDEX `tenant_id`(`tenant_id`) USING BTREE,
  CONSTRAINT `rental_market_link_tenant_ibfk_1` FOREIGN KEY (`rental_market_id`) REFERENCES `rental_market` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rental_market_link_tenant_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tenants_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tenants_user
-- ----------------------------
DROP TABLE IF EXISTS `tenants_user`;
CREATE TABLE `tenants_user`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户名称',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '手机号',
  `open_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '微信openId',
  `union_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '微信unionId',
  `session_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '微信sessionKey',
  `source_type` int(0) NULL DEFAULT NULL COMMENT '用户来源：1:微信',
  `status` int(0) NULL DEFAULT NULL COMMENT '状态：1：正常，2：停用，3：删除',
  `head_img` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '头像',
  `created_at` datetime(0) NULL DEFAULT NULL COMMENT '创建日期',
  `updated_at` datetime(0) NULL DEFAULT NULL COMMENT '最近更新日期',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
