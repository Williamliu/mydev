<?php 
ini_set("display_errors", 0);
include_once("../../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/database/database.php");
try {
	$db = new cMYSQL($CFG["image"]["host"], $CFG["image"]["user"], $CFG["image"]["pwd"], $CFG["image"]["database"]);
	$token 	= $db->quote($_REQUEST["token"]);
	$guid 	= $db->quote($_REQUEST["sn"]);
	$id 	= $db->quote($_REQUEST["id"]);
	$size   = $_REQUEST["size"]?strtolower($_REQUEST["size"]):'large';

	$query = "SELECT a.full_name, a.mime_type, b.data FROM wliu_images a INNER JOIN wliu_images_resize b ON (a.id=b.ref_id) WHERE a.deleted=0 AND b.resize_type='" . $size . "' AND a.id='" . $id . "' AND a.guid='" . $guid . "' AND a.token='" . $token . "'";
	if( $db->exists($query) ) {
		$result=$db->query($query);
		$row=$db->fetch($result);
		$mine = $row["mime_type"];
		$filename = $row["full_name"];
		header("Content-type: $mine");
		header("Content-Disposition: attachment; filename=$filename");
		$data = substr( $row["data"], strpos($row["data"], "base64,") + strlen("base64,"));
		echo base64_decode($data);
	} else {
		echo '<br><span style="font-size:36px;color:red;">Invalid Access Images</span>';
	}
} catch(Exception $e ) {
	echo '<br><span style="font-size:36px;color:red;">Invalid Access Images</span>';
}
?>