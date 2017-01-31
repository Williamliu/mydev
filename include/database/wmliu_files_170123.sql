/*
SQLyog 企业版 - MySQL GUI v8.14 
MySQL - 5.5.45 : Database - wliu_files
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `wliu_images` */

DROP TABLE IF EXISTS `wliu_images`;

CREATE TABLE `wliu_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `scope` varchar(256) DEFAULT NULL,
  `key1` int(11) DEFAULT '0',
  `key2` int(11) DEFAULT '0',
  `key3` int(11) DEFAULT '0',
  `title_en` varchar(256) DEFAULT NULL,
  `title_cn` varchar(256) DEFAULT NULL,
  `detail_en` varchar(1024) DEFAULT NULL,
  `detail_cn` varchar(1024) DEFAULT NULL,
  `full_name` varchar(256) DEFAULT NULL,
  `short_name` varchar(256) DEFAULT NULL,
  `ext_name` varchar(64) DEFAULT NULL,
  `mime_type` varchar(64) DEFAULT NULL,
  `access` tinyint(4) DEFAULT '0',
  `main` tinyint(1) DEFAULT '0',
  `orderno` int(11) DEFAULT '0',
  `status` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `created_time` bigint(20) DEFAULT '0',
  `last_updated` bigint(20) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wliu_images` */

/*Table structure for table `wliu_images_resize` */

DROP TABLE IF EXISTS `wliu_images_resize`;

CREATE TABLE `wliu_images_resize` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_id` int(11) DEFAULT '0',
  `resize_type` varchar(16) DEFAULT NULL,
  `name` varchar(256) DEFAULT NULL,
  `size` int(11) DEFAULT '0',
  `ww` int(11) DEFAULT '0',
  `hh` int(11) DEFAULT '0',
  `width` int(11) DEFAULT '0',
  `height` int(11) DEFAULT '0',
  `url` varchar(1024) DEFAULT NULL,
  `data` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wliu_images_resize` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;