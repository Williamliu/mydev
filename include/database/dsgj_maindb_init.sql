/*
SQLyog 企业版 - MySQL GUI v8.14 
MySQL - 5.5.45 : Database - wliu_maindb
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `dsgj_contactus` */

DROP TABLE IF EXISTS `dsgj_contactus`;

CREATE TABLE `dsgj_contactus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(256) DEFAULT NULL,
  `email` varchar(256) DEFAULT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `detail` varchar(4096) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `created_time` bigint(20) DEFAULT '0',
  `last_updated` bigint(20) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `dsgj_contactus` */

/*Table structure for table `dsgj_student_homestay` */

DROP TABLE IF EXISTS `dsgj_student_homestay`;

CREATE TABLE `dsgj_student_homestay` (
  `stu_id` int(11) NOT NULL,
  `homestay_type` int(11) NOT NULL,
  PRIMARY KEY (`stu_id`,`homestay_type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*Data for the table `dsgj_student_homestay` */

insert  into `dsgj_student_homestay`(`stu_id`,`homestay_type`) values (2,1),(2,2),(2,3),(4,1),(4,2),(4,3);

/*Table structure for table `dsgj_student_service` */

DROP TABLE IF EXISTS `dsgj_student_service`;

CREATE TABLE `dsgj_student_service` (
  `stu_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  PRIMARY KEY (`stu_id`,`service_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*Data for the table `dsgj_student_service` */

insert  into `dsgj_student_service`(`stu_id`,`service_id`) values (4,400),(6,400);

/*Table structure for table `dsgj_studentform` */

DROP TABLE IF EXISTS `dsgj_studentform`;

CREATE TABLE `dsgj_studentform` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_name` varchar(128) DEFAULT NULL,
  `school_address` varchar(256) DEFAULT NULL,
  `school_copy` mediumtext,
  `rd_service` int(11) DEFAULT '0',
  `stu_fname` varchar(64) DEFAULT NULL,
  `stu_lname` varchar(64) DEFAULT NULL,
  `stu_oname` varchar(64) DEFAULT NULL,
  `passport` varchar(32) DEFAULT NULL,
  `passport_copy` mediumtext,
  `visa_copy` mediumtext,
  `en_score` varchar(128) DEFAULT NULL,
  `stu_address` varchar(128) DEFAULT NULL,
  `stu_state` varchar(128) DEFAULT NULL,
  `stu_city` varchar(128) DEFAULT NULL,
  `stu_postal` varchar(16) DEFAULT NULL,
  `stu_email` varchar(128) DEFAULT NULL,
  `stu_phone` varchar(32) DEFAULT NULL,
  `stu_wechat` varchar(32) DEFAULT NULL,
  `dad_fname` varchar(64) DEFAULT NULL,
  `dad_email` varchar(128) DEFAULT NULL,
  `dad_phone` varchar(32) DEFAULT NULL,
  `dad_wechat` varchar(32) DEFAULT NULL,
  `dad_birth` date DEFAULT NULL,
  `mom_fname` varchar(64) DEFAULT NULL,
  `mom_email` varchar(128) DEFAULT NULL,
  `mom_phone` varchar(32) DEFAULT NULL,
  `mom_wechat` varchar(32) DEFAULT NULL,
  `mom_birth` date DEFAULT NULL,
  `par_address` varchar(128) DEFAULT NULL,
  `par_state` varchar(128) DEFAULT NULL,
  `par_city` varchar(128) DEFAULT NULL,
  `par_postal` varchar(16) DEFAULT NULL,
  `airline` varchar(32) DEFAULT NULL,
  `flight` varchar(32) DEFAULT NULL,
  `pickup_datetime` datetime DEFAULT NULL,
  `destination` varchar(128) DEFAULT NULL,
  `homestay_start` date DEFAULT NULL,
  `homestay_end` date DEFAULT NULL,
  `health_medicine` varchar(256) DEFAULT NULL,
  `health_horby` varchar(256) DEFAULT NULL,
  `per_character` varchar(256) DEFAULT NULL,
  `per_horby` varchar(256) DEFAULT NULL,
  `per_sport` varchar(256) DEFAULT NULL,
  `per_music` varchar(256) DEFAULT NULL,
  `per_food` varchar(256) DEFAULT NULL,
  `per_vegit` varchar(256) DEFAULT NULL,
  `homestay_envir` int(11) DEFAULT '0',
  `homestay_other` varchar(256) DEFAULT NULL,
  `homestay_letter` varchar(1024) DEFAULT NULL,
  `homestay_concern` varchar(1024) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `created_time` bigint(20) DEFAULT '0',
  `last_updated` bigint(20) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `dsgj_studentform` */

insert  into `dsgj_studentform`(`id`,`school_name`,`school_address`,`school_copy`,`rd_service`,`stu_fname`,`stu_lname`,`stu_oname`,`passport`,`passport_copy`,`visa_copy`,`en_score`,`stu_address`,`stu_state`,`stu_city`,`stu_postal`,`stu_email`,`stu_phone`,`stu_wechat`,`dad_fname`,`dad_email`,`dad_phone`,`dad_wechat`,`dad_birth`,`mom_fname`,`mom_email`,`mom_phone`,`mom_wechat`,`mom_birth`,`par_address`,`par_state`,`par_city`,`par_postal`,`airline`,`flight`,`pickup_datetime`,`destination`,`homestay_start`,`homestay_end`,`health_medicine`,`health_horby`,`per_character`,`per_horby`,`per_sport`,`per_music`,`per_food`,`per_vegit`,`homestay_envir`,`homestay_other`,`homestay_letter`,`homestay_concern`,`status`,`deleted`,`created_time`,`last_updated`) values (1,'','','',0,'sdfsda','dfasd','','fasdf','','','','','',NULL,'','dfasd@dkd.com','','','dsfas','','','','0000-00-00','sdfasdf','','','','0000-00-00','','','','','','','0000-00-00 00:00:00','','0000-00-00','0000-00-00','','','','','','','','0',0,'','','',1,0,1492499812,0),(2,'','','',0,'sdfasdf','sdfsadf','','safdsda','','','','','',NULL,'','dfasd@kdk.com','','','dfasdf','','','','0000-00-00','dfasdf','','','','0000-00-00','','','','','','','0000-00-00 00:00:00','','0000-00-00','0000-00-00','','','','','','','','0',0,'','','',1,0,1492500084,0),(3,'','','',0,'dfasd','dfasd','','dfas','','','','','',NULL,'','dfasd@ddkd.com','','','dsf','','','','0000-00-00','sdafsa','','','','0000-00-00','','','','','','','0000-00-00 00:00:00','','0000-00-00','0000-00-00','','','','','','','','0',0,'','','',1,0,1492500144,0),(4,'','','',0,'dfasdf','sdfdsa','f','sadfasdf','','','','','',NULL,'','dfasd@kdk.com','','','dfasd','','','','0000-00-00','sdfsda','','','','0000-00-00','','','','','','','0000-00-00 00:00:00','','0000-00-00','0000-00-00','','','','','','','','0',0,'','','',1,0,1492500472,0),(5,'','','',0,'dfads','fasdf','','asdfdsa','','','','','',NULL,'','dfasd@kdkd.com','','','dfasd','','','','0000-00-00','dsfasdf','','','','0000-00-00','','','','','','','0000-00-00 00:00:00','','0000-00-00','0000-00-00','','','','','','','','0',0,'','','',1,0,1492500588,0);

/*Table structure for table `web_admin` */

DROP TABLE IF EXISTS `web_admin`;

CREATE TABLE `web_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(64) DEFAULT NULL,
  `email` varchar(256) DEFAULT NULL,
  `first_name` varchar(64) DEFAULT NULL,
  `last_name` varchar(64) DEFAULT NULL,
  `password` varchar(16) DEFAULT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `cell` varchar(64) DEFAULT NULL,
  `address` varchar(256) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `state` varchar(64) DEFAULT NULL,
  `country` int(11) DEFAULT '0',
  `postal` varchar(16) DEFAULT NULL,
  `locked` tinyint(1) DEFAULT '0',
  `status` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `orderno` int(11) DEFAULT '0',
  `created_time` bigint(20) DEFAULT '0',
  `last_updated` bigint(20) DEFAULT '0',
  `last_login` bigint(20) DEFAULT '0',
  `operator` int(11) DEFAULT '0',
  `hits` int(11) DEFAULT '0',
  `login_count` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

/*Data for the table `web_admin` */

insert  into `web_admin`(`id`,`user_name`,`email`,`first_name`,`last_name`,`password`,`phone`,`cell`,`address`,`city`,`state`,`country`,`postal`,`locked`,`status`,`deleted`,`orderno`,`created_time`,`last_updated`,`last_login`,`operator`,`hits`,`login_count`) values (1,'wliu','william_lwh@hotmail.com','William','Liu','111111','778-888-6068',NULL,NULL,NULL,NULL,3,NULL,0,1,0,0,1492389901,1492474872,1492484064,0,43,0),(17,'wliu2','william.liu@investx.com','Tom','Peter','222222','',NULL,NULL,NULL,NULL,3,NULL,0,0,0,0,1492450582,1492473955,1492450582,0,1,0),(18,'wliu3','susan@hotmail.com','Susan','Law','333333','',NULL,NULL,NULL,NULL,0,NULL,0,1,0,0,1492460483,1492478706,1492476657,0,7,0);

/*Table structure for table `web_admin_role` */

DROP TABLE IF EXISTS `web_admin_role`;

CREATE TABLE `web_admin_role` (
  `admin_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`admin_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `web_admin_role` */

insert  into `web_admin_role`(`admin_id`,`role_id`) values (1,1),(1,2),(7,1),(17,1);

/*Table structure for table `web_admin_session` */

DROP TABLE IF EXISTS `web_admin_session`;

CREATE TABLE `web_admin_session` (
  `session_id` varchar(64) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `user_agent` varchar(256) DEFAULT NULL,
  `platform` varchar(64) DEFAULT NULL,
  `browser` varchar(64) DEFAULT NULL,
  `version` varchar(64) DEFAULT NULL,
  `is_mobile` tinyint(1) DEFAULT '0',
  `ip_address` varchar(64) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `last_updated` bigint(20) DEFAULT '0',
  `created_time` bigint(20) DEFAULT '0',
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `web_admin_session` */

insert  into `web_admin_session`(`session_id`,`admin_id`,`user_agent`,`platform`,`browser`,`version`,`is_mobile`,`ip_address`,`status`,`deleted`,`last_updated`,`created_time`) values ('0506c31b892300cc8c0c79da605b79bc',1,'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36','Windows','Chrome','57.0.2987.133',0,'127.0.0.1',1,1,1492451540,1492450682),('051c8672215cb1870e52f04de2bef394',12,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492394823,1492394823),('052a677210baea55c4a3f148600159bb',13,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492395017,1492395003),('05f037a65baa0b37b27957fc037f67eb',1,'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36','Windows','Chrome','57.0.2987.133',0,'127.0.0.1',1,1,1492468254,1492468223),('0786f7c281ebc08c2c59937b3b33d7c8',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492460451,1492460259),('0bcfa031bbb32aa4e88efff2a730506e',14,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492395295,1492395197),('0fd1a070d28f0efa005e9bfedb3ce16e',18,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492460485,1492460483),('1da1c7cf8e2ee117f1891df80f49f27b',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,0,1492472563,1492472120),('1db2059e05604dc939b4c18c866f1797',15,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492395816,1492395413),('25186d27a694fb5b3401a8057483be1b',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492454703,1492452605),('2c73f5995d5873639ab12739d93ea71a',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492407236,1492407142),('30531bf120fde92eb40cacec7d49e5ff',18,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492460698,1492460697),('306563a00232b674e33480f1d6968a08',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,0,1492478671,1492478645),('314fe09bb40182aac3d95ad2822ce97c',18,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492460625,1492460624),('31febc303b28315ece4873fbab333102',18,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,0,1492476658,1492476657),('35d1e623d124ee99476a280d1ce4286f',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492460612,1492460503),('3a169916010ad5c77d043b13ea6539a8',1,'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36','Windows','Chrome','57.0.2987.133',0,'127.0.0.1',1,0,1492473830,1492472578),('3ba31ef1997fef15a73f6b7f5740d09e',1,'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36','Windows','Chrome','57.0.2987.133',0,'127.0.0.1',1,1,1492465097,1492465052),('3fdd83d9ad838d16815fe260511f9689',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492460690,1492460642),('4e0588cdc84ea046d28aa1956ccd3860',1,'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36','Windows','Chrome','57.0.2987.133',0,'127.0.0.1',1,0,1492471941,1492470788),('61ac39e177e6246aa6b912dd182946ae',18,'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36','Windows','Chrome','57.0.2987.133',0,'127.0.0.1',1,0,1492475332,1492474986),('6246dcf79328d4169c5ea17e05378b65',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492407083,1492407071),('6587f3ed3d5559743dc3146b8e0c22fa',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,0,1492478706,1492478698),('6aaf29a9e54209ab0c5ae3e72e714fd0',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492407424,1492407398),('6dd0a131cb813a87718cc7e5bdd5e016',1,'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36','Windows','Chrome','57.0.2987.133',0,'127.0.0.1',1,0,1492472569,1492471951),('704a8a27e943cf3fe44da64a3fcb9408',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492407923,1492407509),('70f7837d726924b659b1ee62fe8980ee',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,0,1492478635,1492477638),('72e2e2b25386123a6c64d0d0f52abba7',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492407359,1492407283),('7e4b92b86f6f9a54d0fd8cd518d3f2f8',4,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492396073,1492395942),('83d06efdf1c8074115f11fba19290337',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492407054,1492407017),('8b7b2da32caa18c5f39d8316ae82be33',16,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492404181,1492404173),('8ee5dde7e3772426727a7cd3f98555cd',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492404885,1492404855),('9444267d89e379d41bc74a9c3c46883d',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,0,1492476649,1492476632),('9bcc996b48fe587d5274cb865da50bcf',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492403231,1492396658),('a170c8501b2c1eb7d94975121d5c5c5b',18,'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36','Windows','Chrome','57.0.2987.133',0,'127.0.0.1',1,0,1492474817,1492474817),('a23525b89650cccb02f29764e83e7753',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,0,1492476616,1492476180),('a247b5c3bcbce1e8dc26ca646c0fcbf1',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492458503,1492458502),('a316e7a2d90ad44391255039dc9af753',1,'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36','Windows','Chrome','57.0.2987.133',0,'127.0.0.1',1,1,1492467382,1492467325),('afb2f4cebdcecb8ed1d3ab1c4636fd22',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,0,1492499258,1492484064),('b3874c6af966c0ff353096dcd80dab4b',18,'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36','Windows','Chrome','57.0.2987.133',0,'127.0.0.1',1,0,1492474836,1492474835),('b3a1d77524cbe7d57bb275aa4ec3c1ab',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492458378,1492458285),('ba70b549cb06e9dd30b84b24058057b2',1,'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36','Windows','Chrome','57.0.2987.133',0,'127.0.0.1',1,0,1492478423,1492475343),('c045858739cdfea4c8d2340ce4533263',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492406983,1492405066),('c40c4ae9ef18e2f2e38b8106fd293237',17,'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36','Windows','Chrome','57.0.2987.133',0,'127.0.0.1',1,1,1492450671,1492450582),('c951c5b232922a57453768e2d9170263',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492396610,1492396099),('cdd20e302566f65ad7340cf6b87a93e5',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492395918,1492395843),('ce53d2b3a13945e6a9b5bdc37bf694da',1,'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36','Windows','Chrome','57.0.2987.133',0,'127.0.0.1',1,0,1492474703,1492474703),('cfe45772a65707dfabc7c8b77c8e93ed',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492460248,1492460086),('d4de5d70d0c194d934d5794203bd40f7',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,0,1492477282,1492476680),('d56475104f7a1fd38664390e861131ea',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492460076,1492459670),('e22a9503b07d4f42656d7fe8a675902c',1,'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36','Windows','Chrome','57.0.2987.133',0,'127.0.0.1',1,0,1492474716,1492474715),('e69013d70814a62c9337a9561a0de078',1,'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36','Windows','Chrome','57.0.2987.133',0,'127.0.0.1',1,0,1492474978,1492474876),('ef8168f4159f1b19c8c791a3726e1a7d',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,0,1492476148,1492475872),('ff36a38b6be075c38381cec858363bc1',1,'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Windows','Firefox','52.0',0,'127.0.0.1',1,1,1492458247,1492456477);

/*Table structure for table `web_basic_info` */

DROP TABLE IF EXISTS `web_basic_info`;

CREATE TABLE `web_basic_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_id` int(11) DEFAULT '0',
  `parent_id` int(11) DEFAULT '0',
  `title_en` varchar(64) DEFAULT NULL,
  `title_cn` varchar(64) DEFAULT NULL,
  `detail_en` varchar(256) DEFAULT NULL,
  `detail_cn` varchar(256) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `created_time` bigint(20) DEFAULT '0',
  `last_updated` bigint(20) DEFAULT '0',
  `operator` int(11) DEFAULT '0',
  `orderno` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

/*Data for the table `web_basic_info` */

insert  into `web_basic_info`(`id`,`ref_id`,`parent_id`,`title_en`,`title_cn`,`detail_en`,`detail_cn`,`status`,`deleted`,`created_time`,`last_updated`,`operator`,`orderno`) values (1,1,0,'dfads','sdfsdaf','sadfdfsa','sadfds',1,0,1486105263,1486108882,0,99),(2,1,0,'dfasdf','dsfasdf','sasdfsda','fsdafsad',1,0,1486105283,1486108887,0,34),(3,1,0,'sdfas','dfasdf','sdasdfdsa','sadfsdaf',1,0,1486105310,1486108891,0,88),(4,2,0,'dfasdfdas','dsfsd','fdsa','fdsafdsa',1,0,1486107298,1486107298,0,0),(5,2,0,'klkljl','hgjhgj','kjlkjl','hfjhgj',1,1,1486107669,1486109751,0,8),(6,2,0,'jhkhkj','gfhjgj','dgfghh','xzcvzxcv',1,0,1486107683,1486107696,0,0),(7,2,0,'c','dsfasdf','sa','sdfsdf',1,0,1486109176,1486109176,0,0),(8,2,0,'c','dsfasdf','sa','sdfsdf',1,0,1486109182,1486109182,0,0),(9,2,0,'dsfsd','fsdaf','dsfs','dafasdf',1,0,1486109204,1486109204,0,0),(10,2,0,'dsf','dsfasd','fasd','fsdaf',1,0,1486109231,1486109231,0,0),(11,2,0,'dfgasf','sdf','sdf','sdfsdaf',1,0,1486109251,1486109251,0,0),(12,2,0,'dsfs','dfsdaf','dsf','dsafdsf',1,0,1486109297,1486109297,0,0),(13,2,0,'zfdsgfdag','dsfasdf','sdfsda','dsfasdf',1,0,1486109313,1486109313,0,0),(14,2,0,'tryeyrt','rtyrt','tryret','rteyrtey',1,0,1486109396,1486109396,0,0),(15,2,0,'jkhkghs','sdgwe','fhkuyouyi','dfgdsffdsdl',1,0,1486109405,1486109405,0,0),(16,2,0,'ndsfas','kgjgdfj','dfhfdghf','dghdfghdfghfgdh',1,0,1486109414,1486109414,0,0),(17,2,0,'fdgsdfg','sdfgsdf','gsdf','dfhsdfgsdfgdsfgdf',1,0,1486109423,1486109423,0,0),(18,2,0,'fdgsdfgh','dfsg','dfsgdfsg','dfsgdfsg',1,0,1486109434,1486109434,0,0),(19,2,0,'fgsdfg','fdsgdfsgdfs','gdfsgfd','sgsdfgsdf',1,0,1486109440,1486109440,0,0),(20,2,0,'fgsfdnsdfgsdf','gdfsgsdhsdhg','dfgsd','dfsgdsfgfd',1,1,1486109448,1486109665,0,0),(21,2,0,'df dfg','dsfg','fdgsdfgd','fgdfdsgfdg',1,1,1486109457,1486109665,0,0),(22,2,0,'fgsdf','gdfs','gfdsgdfsg','dfsgdsfgd',1,1,1486109463,1486109665,0,0),(23,2,0,'xfdgsdfgfd','gdfsertre','dfgdfsg','fgddsfg',1,1,1486109471,1486109714,0,0),(24,2,0,'sdfasdf','adfasdf','sadfsda','fsadfsda',1,1,1486109480,1486109714,0,0),(25,2,0,'fgfghfg','dhgfd','hfdghgfd','hfdghfdghfdg',1,1,1486109487,1486109714,0,0),(26,2,0,'dscfdasf','sadfsadf','','',1,1,1486109683,1486109714,0,0),(27,2,0,'sadfsadfsd','asdfsda','fsadf','sdafsadfsad',1,0,1486109693,1486109693,0,0),(28,2,0,'sdfasdfsadf','sadfsa','dfsadfsad','sdafsadfsad',1,1,1486109700,1486109751,0,0),(29,2,0,'sadfsad','fsadf','sadfsadfsad','fsad',1,1,1486109706,1486109751,0,0),(30,2,0,'sdfsda','fasdf','sdafsda','fsdaf',1,0,1486109730,1486109784,0,0),(31,2,0,'sdf','sadfsda','fsdaf','sdafsadf',1,1,1486109736,1486109751,0,0),(32,1,0,'dfjksadf','sdjkfjsadk','sajfksadj','sdjfklsadfds',1,0,1490330434,1490330434,0,99);

/*Table structure for table `web_basic_table` */

DROP TABLE IF EXISTS `web_basic_table`;

CREATE TABLE `web_basic_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_name` varchar(64) DEFAULT NULL,
  `title_en` varchar(64) DEFAULT NULL,
  `title_cn` varchar(64) DEFAULT NULL,
  `detail_en` varchar(256) DEFAULT NULL,
  `detail_cn` varchar(256) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `created_time` bigint(20) DEFAULT '0',
  `last_updated` bigint(20) DEFAULT '0',
  `operator` int(11) DEFAULT '0',
  `orderno` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `web_basic_table` */

insert  into `web_basic_table`(`id`,`table_name`,`title_en`,`title_cn`,`detail_en`,`detail_cn`,`status`,`deleted`,`created_time`,`last_updated`,`operator`,`orderno`) values (1,'color','Color','颜色','Color for product','产品的颜色分类',1,0,1486102704,1492467360,0,0),(2,'education','Education Background','教育背景','User\'s Education and background','用于教育程度和背景',1,0,1486102927,1486109736,0,0);

/*Table structure for table `web_country` */

DROP TABLE IF EXISTS `web_country`;

CREATE TABLE `web_country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country_en` varchar(64) DEFAULT NULL,
  `country_cn` varchar(64) DEFAULT NULL,
  `currency_en` varchar(16) DEFAULT NULL,
  `currency_cn` varchar(16) DEFAULT NULL,
  `symbol` varchar(16) DEFAULT NULL,
  `orderno` int(11) DEFAULT '0',
  `status` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `created_time` bigint(20) DEFAULT '0',
  `last_updated` bigint(20) DEFAULT '0',
  `operator` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `web_country` */

insert  into `web_country`(`id`,`country_en`,`country_cn`,`currency_en`,`currency_cn`,`symbol`,`orderno`,`status`,`deleted`,`created_time`,`last_updated`,`operator`) values (1,'USA','美国','USD','美元','$',88,1,0,0,1451114449,0),(2,'China','中国','RMB','人民币','¥',99,1,0,0,1451114449,0),(3,'Canada','加拿大','CAD','加币','$',77,1,0,1451114449,1451114570,0);

/*Table structure for table `web_language` */

DROP TABLE IF EXISTS `web_language`;

CREATE TABLE `web_language` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project` varchar(64) DEFAULT NULL,
  `filter` varchar(64) DEFAULT NULL,
  `keyword` varchar(128) DEFAULT NULL,
  `cn` varchar(2048) DEFAULT NULL,
  `en` varchar(2048) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `created_time` bigint(20) DEFAULT '0',
  `last_updated` bigint(20) DEFAULT '0',
  `operator` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

/*Data for the table `web_language` */

insert  into `web_language`(`id`,`project`,`filter`,`keyword`,`cn`,`en`,`status`,`deleted`,`created_time`,`last_updated`,`operator`) values (1,'website','field','save','保存','Save',1,0,1486013119,1486013119,0),(2,'website','field','cancel','取消','Cancel',1,0,1486014616,1488525842,0),(3,'website','field','delete','删除','Delete',1,0,1486014803,1486015012,0),(4,'website','field','update','更改','Update',1,0,1486014838,1486016541,0),(5,'website','field','detail','详细','Detail',1,0,1486016819,1486016819,0),(6,'website','field','search by','搜索条件','Search By',1,0,1491674408,1491674408,0),(7,'website','field','admin.detail','管理员信息','Admin Detail',1,0,1491674462,1491674462,0),(8,'website','field','website.admin','网站管理员','Website Admin',1,0,1491881257,1491881257,0),(9,'website','field','website.role','角色权限','Website Role',1,0,1491881384,1491881384,0),(10,'website','field','role.detail','权限设置','Role Detail',1,0,1491881408,1491881408,0),(11,'website','field','website.session.expiry','连接已经超时，请重新登录。','Session has expired, please login again.',1,0,1491886689,1491886689,0),(12,'website','field','my.account','我的账号','My Account',1,0,1492316346,1492316346,0),(13,'website','field','website.admin.menu','网站管理平台菜单','Website Administration Menu',1,0,1492386142,1492386142,0),(14,'website','field','website.menu.root','菜单根目录','Menu Root',1,0,1492386181,1492386181,0),(15,'website','field','role.menu.rights','用户角色权限','Role Menu Rights',1,0,1492387753,1492387753,0),(16,'website','field','menu.rights.setup','菜单权限设置','Menu Right Settings',1,0,1492387822,1492387822,0),(17,'website','field','login','登录','Login',1,0,1492388545,1492388545,0),(18,'website','field','register','注册','Register',1,0,1492388582,1492388582,0),(19,'website','field','click.here.back.to','点击这里回到','Click here back to',1,0,1492388687,1492388687,0),(20,'website','field','not.a.member','还不是用户','Not a member?',1,0,1492388772,1492388772,0),(21,'website','field','forget','忘记','Forget',1,0,1492388897,1492388897,0),(22,'website','field','password','密码','Password',1,0,1492388918,1492388918,0),(23,'website','field','you.do.not.have.right.to.use','你还没有权限访问菜单<br>\n&nbsp;&nbsp;我们会尽快为您设置权限.','You don\'t have right to access menus.\n<br>&nbsp;&nbsp;We will get back to you shortly.',1,0,1492395920,1492474976,0),(24,'website','field','you.are.here','正在使用','Current',1,0,1492402223,1492402223,0),(25,'website','field','logout','退出','Logout',1,0,1492405315,1492405315,0),(26,'website','field','web_myaccount.php','<i class=\"fa fa-user-circle-o\" aria-hidden=\"true\"></i> 我的账号','<i class=\"fa fa-user-circle-o\" aria-hidden=\"true\"></i> My Account',1,0,1492460156,1492460243,0),(27,'website','field','account.status','账号状态','Account Status',1,0,1492476740,1492476740,0);

/*Table structure for table `web_menu1` */

DROP TABLE IF EXISTS `web_menu1`;

CREATE TABLE `web_menu1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) DEFAULT NULL,
  `menu_key` varchar(16) DEFAULT NULL,
  `icon` varchar(256) DEFAULT NULL,
  `title_en` varchar(64) DEFAULT NULL,
  `detail_en` varchar(256) DEFAULT NULL,
  `title_cn` varchar(64) DEFAULT NULL,
  `detail_cn` varchar(256) DEFAULT NULL,
  `template` varchar(1024) DEFAULT NULL,
  `url` varchar(1024) DEFAULT NULL,
  `seo_title` varchar(256) DEFAULT NULL,
  `seo_keyword` varchar(256) DEFAULT NULL,
  `seo_description` varchar(1024) DEFAULT NULL,
  `seo_class` varchar(256) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `orderno` int(11) DEFAULT '0',
  `created_time` bigint(20) DEFAULT '0',
  `last_updated` bigint(20) DEFAULT '0',
  `operator` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `web_menu1` */

insert  into `web_menu1`(`id`,`parent_id`,`menu_key`,`icon`,`title_en`,`detail_en`,`title_cn`,`detail_cn`,`template`,`url`,`seo_title`,`seo_keyword`,`seo_description`,`seo_class`,`status`,`deleted`,`orderno`,`created_time`,`last_updated`,`operator`) values (1,0,'M1','<i class=\"fa fa-cog\" aria-hidden=\"true\"></i>','Website Controller','Website Controller','网站管理','网站管理','','',NULL,NULL,NULL,NULL,1,0,900,1492385718,1492396168,0);

/*Table structure for table `web_menu2` */

DROP TABLE IF EXISTS `web_menu2`;

CREATE TABLE `web_menu2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) DEFAULT '0',
  `menu_key` varchar(16) DEFAULT NULL,
  `icon` varchar(256) DEFAULT NULL,
  `title_en` varchar(64) DEFAULT NULL,
  `detail_en` varchar(256) DEFAULT NULL,
  `title_cn` varchar(64) DEFAULT NULL,
  `detail_cn` varchar(256) DEFAULT NULL,
  `template` varchar(1024) DEFAULT NULL,
  `url` varchar(1024) DEFAULT NULL,
  `seo_title` varchar(256) DEFAULT NULL,
  `seo_keyword` varchar(256) DEFAULT NULL,
  `seo_description` varchar(1024) DEFAULT NULL,
  `seo_class` varchar(256) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `orderno` int(11) DEFAULT '0',
  `created_time` bigint(20) DEFAULT '0',
  `last_updated` bigint(20) DEFAULT '0',
  `operator` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `web_menu2` */

insert  into `web_menu2`(`id`,`parent_id`,`menu_key`,`icon`,`title_en`,`detail_en`,`title_cn`,`detail_cn`,`template`,`url`,`seo_title`,`seo_keyword`,`seo_description`,`seo_class`,`status`,`deleted`,`orderno`,`created_time`,`last_updated`,`operator`) values (1,1,'M11','<i class=\"fa fa-bars\" aria-hidden=\"true\"></i>','Admin Website Menu','Admin Website Menu','后台菜单','后台菜单','web_menu.php','',NULL,NULL,NULL,NULL,1,0,90,1492386520,1492401937,0),(2,1,'M12','<i class=\"fa fa-users\" aria-hidden=\"true\"></i>','User Role','User Role','用户角色','用户角色','web_role.php','',NULL,NULL,NULL,NULL,1,0,80,1492386665,0,0),(3,1,'M13','<i class=\"fa fa-user\" aria-hidden=\"true\"></i>','Admin User','Admin User','用户账号','用户账号','web_admin.php','',NULL,NULL,NULL,NULL,1,0,70,1492386770,1492401959,0),(4,1,'M14','<i class=\"fa fa-language\" aria-hidden=\"true\"></i>','Word Translate','Word Translate','网站词汇','网站词汇','web_language.php','',NULL,NULL,NULL,NULL,1,0,60,1492386866,1492401965,0),(5,1,'M15','<i class=\"fa fa-newspaper-o\" aria-hidden=\"true\"></i>','Category Definition','Category Definition','属性分类','属性分类','web_table.php','',NULL,NULL,NULL,NULL,1,0,50,1492387102,1492387110,0),(6,1,'M16','<i class=\"fa fa-sticky-note\" aria-hidden=\"true\"></i>','Property Definition','Property Definition','属性定义','属性定义','web_table_info.php','',NULL,NULL,NULL,NULL,1,0,40,1492387409,1492387416,0),(7,1,'M17','<i class=\"fa fa-user-circle-o\" aria-hidden=\"true\"></i>','My Photos','My Photos','我的图片','我的图片','web_myphotos.php','',NULL,NULL,NULL,NULL,1,0,30,1492387479,1492396240,0);

/*Table structure for table `web_right` */

DROP TABLE IF EXISTS `web_right`;

CREATE TABLE `web_right` (
  `id` varchar(16) NOT NULL,
  `title_en` varchar(16) DEFAULT NULL,
  `detail_en` varchar(64) DEFAULT NULL,
  `title_cn` varchar(16) DEFAULT NULL,
  `detail_cn` varchar(64) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `orderno` int(11) DEFAULT '0',
  `created_time` bigint(20) DEFAULT '0',
  `last_updated` bigint(20) DEFAULT '0',
  `operator` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `web_right` */

insert  into `web_right`(`id`,`title_en`,`detail_en`,`title_cn`,`detail_cn`,`status`,`deleted`,`orderno`,`created_time`,`last_updated`,`operator`) values ('add','Add','Add','新增','新增',1,0,77,0,0,NULL),('delete','Delete','Delete','删除','删除',1,0,55,0,0,NULL),('detail','Detail','Detail','详细','详细',1,0,88,0,0,NULL),('output','Output','Output','输出','输出',1,0,44,0,0,NULL),('print','Print','Print','打印','打印',1,0,33,0,0,NULL),('save','Save','Save','保存','保存',1,0,66,0,0,NULL),('view','View','View','查看','查看',1,0,99,0,0,NULL);

/*Table structure for table `web_role` */

DROP TABLE IF EXISTS `web_role`;

CREATE TABLE `web_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title_en` varchar(64) DEFAULT NULL,
  `detail_en` varchar(256) DEFAULT NULL,
  `title_cn` varchar(64) DEFAULT NULL,
  `detail_cn` varchar(256) DEFAULT NULL,
  `level` int(11) DEFAULT '0',
  `orderno` int(11) DEFAULT '0',
  `status` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `created_time` bigint(20) DEFAULT '0',
  `last_updated` bigint(20) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `web_role` */

insert  into `web_role`(`id`,`title_en`,`detail_en`,`title_cn`,`detail_cn`,`level`,`orderno`,`status`,`deleted`,`created_time`,`last_updated`) values (1,'System Administrator','System Administrator','系统管理员','系统管理员',9,900,1,0,1492387563,1492387563),(2,'Super User','Super User Role','超级用户','超级用户角色',8,800,1,0,1492470861,1492470861);

/*Table structure for table `web_role_level` */

DROP TABLE IF EXISTS `web_role_level`;

CREATE TABLE `web_role_level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title_en` varchar(64) DEFAULT NULL,
  `detail_en` varchar(256) DEFAULT NULL,
  `title_cn` varchar(64) DEFAULT NULL,
  `detail_cn` varchar(256) DEFAULT NULL,
  `weight` int(11) DEFAULT '0',
  `orderno` int(11) DEFAULT '0',
  `status` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `created_time` bigint(20) DEFAULT '0',
  `last_updated` bigint(20) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

/*Data for the table `web_role_level` */

insert  into `web_role_level`(`id`,`title_en`,`detail_en`,`title_cn`,`detail_cn`,`weight`,`orderno`,`status`,`deleted`,`created_time`,`last_updated`) values (1,'Level 1 ','Level 1','等级一','等级一',100,90,1,0,0,0),(2,'Level 2','Level 2','等级二','等级二',200,80,1,0,0,0),(3,'Level 3','Level 3','等级三','等级三',300,70,1,0,1450730081,0),(4,'Level 4','Level 4','等级四','等级四',400,60,1,0,1450730041,1450730081),(5,'Level 5','Level 5','等级五','等级五',500,50,1,0,1450730017,1450730081),(6,'Level 6','Level 6','等级六','等级六',600,40,1,0,1450729986,1450730081),(7,'Level 7','Level 7','等级七','等级七',700,30,1,0,1450729880,0),(8,'Level 8','Level 8','等级八','等级八',800,20,1,0,0,0),(9,'Level 9','Level 9','等级九','等级九',900,10,1,0,0,0);

/*Table structure for table `web_role_menu1` */

DROP TABLE IF EXISTS `web_role_menu1`;

CREATE TABLE `web_role_menu1` (
  `role_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `menu_right` varchar(16) NOT NULL,
  PRIMARY KEY (`role_id`,`menu_id`,`menu_right`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `web_role_menu1` */

insert  into `web_role_menu1`(`role_id`,`menu_id`,`menu_right`) values (1,1,'view'),(2,1,'view');

/*Table structure for table `web_role_menu2` */

DROP TABLE IF EXISTS `web_role_menu2`;

CREATE TABLE `web_role_menu2` (
  `role_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `menu_right` varchar(16) NOT NULL,
  PRIMARY KEY (`role_id`,`menu_id`,`menu_right`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `web_role_menu2` */

insert  into `web_role_menu2`(`role_id`,`menu_id`,`menu_right`) values (1,1,'add'),(1,1,'delete'),(1,1,'detail'),(1,1,'output'),(1,1,'print'),(1,1,'save'),(1,1,'view'),(1,2,'add'),(1,2,'delete'),(1,2,'detail'),(1,2,'output'),(1,2,'print'),(1,2,'save'),(1,2,'view'),(1,3,'add'),(1,3,'delete'),(1,3,'detail'),(1,3,'output'),(1,3,'print'),(1,3,'save'),(1,3,'view'),(1,4,'add'),(1,4,'delete'),(1,4,'detail'),(1,4,'output'),(1,4,'print'),(1,4,'save'),(1,4,'view'),(1,5,'add'),(1,5,'delete'),(1,5,'detail'),(1,5,'output'),(1,5,'print'),(1,5,'save'),(1,5,'view'),(1,6,'add'),(1,6,'delete'),(1,6,'detail'),(1,6,'output'),(1,6,'print'),(1,6,'save'),(1,6,'view'),(1,7,'add'),(1,7,'delete'),(1,7,'detail'),(1,7,'output'),(1,7,'print'),(1,7,'save'),(1,7,'view'),(2,1,'detail'),(2,1,'view'),(2,2,'view'),(2,3,'add'),(2,3,'delete'),(2,3,'detail'),(2,3,'output'),(2,3,'print'),(2,3,'save'),(2,3,'view'),(2,4,'detail'),(2,4,'view'),(2,5,'add'),(2,5,'delete'),(2,5,'detail'),(2,5,'output'),(2,5,'print'),(2,5,'save'),(2,5,'view'),(2,6,'add'),(2,6,'delete'),(2,6,'detail'),(2,6,'output'),(2,6,'print'),(2,6,'save'),(2,6,'view');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
