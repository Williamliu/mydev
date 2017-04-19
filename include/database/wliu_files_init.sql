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
/*Table structure for table `wliu_config` */

DROP TABLE IF EXISTS `wliu_config`;

CREATE TABLE `wliu_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `scope` varchar(256) DEFAULT NULL,
  `allow_type` varchar(256) DEFAULT NULL,
  `max_length` int(11) DEFAULT '0',
  `max_size` int(11) DEFAULT '0',
  `access` int(11) DEFAULT '0',
  `key1` tinyint(11) DEFAULT '0',
  `key2` tinyint(11) DEFAULT '0',
  `key3` tinyint(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `wliu_config` */

insert  into `wliu_config`(`id`,`scope`,`allow_type`,`max_length`,`max_size`,`access`,`key1`,`key2`,`key3`) values (1,'Users','BMP,JPG,JPEG,PNG,TIF,GIF',5,0,1,1,0,0),(2,'Docs','xls, pdf, *',5,1000000,1,1,0,0);

/*Table structure for table `wliu_files` */

DROP TABLE IF EXISTS `wliu_files`;

CREATE TABLE `wliu_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `scope` varchar(256) DEFAULT NULL,
  `owner_id` int(11) DEFAULT '0',
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
  `mime_type` varchar(256) DEFAULT NULL,
  `access` tinyint(4) DEFAULT '0',
  `main` tinyint(1) DEFAULT '0',
  `orderno` int(11) DEFAULT '0',
  `data` mediumtext,
  `guid` varchar(256) DEFAULT NULL,
  `token` varchar(256) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `created_time` bigint(20) DEFAULT '0',
  `last_updated` bigint(20) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wliu_files` */

/*Table structure for table `wliu_images` */

DROP TABLE IF EXISTS `wliu_images`;

CREATE TABLE `wliu_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `scope` varchar(256) DEFAULT NULL,
  `owner_id` int(11) DEFAULT '0',
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
  `mime_type` varchar(256) DEFAULT NULL,
  `access` tinyint(4) DEFAULT '0',
  `main` tinyint(1) DEFAULT '0',
  `orderno` int(11) DEFAULT '0',
  `guid` varchar(256) DEFAULT NULL,
  `token` varchar(256) DEFAULT NULL,
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
  `size` varchar(11) DEFAULT '0',
  `ww` int(11) DEFAULT '0',
  `hh` int(11) DEFAULT '0',
  `width` int(11) DEFAULT '0',
  `height` int(11) DEFAULT '0',
  `url` varchar(1024) DEFAULT NULL,
  `data` mediumtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `wliu_images_resize` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
