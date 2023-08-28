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