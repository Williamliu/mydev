<?php 
ini_set("display_errors", 0);
include_once("../../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/database/database.php");
try {
	$db = new cMYSQL($CFG["image"]["host"], $CFG["image"]["user"], $CFG["image"]["pwd"], $CFG["image"]["database"]);
	$token 	= $db->quote($_REQUEST["token"]);
	$guid 	= $db->quote($_REQUEST["sn"]);
	$id 	= $db->quote($_REQUEST["id"]);

	$query = "SELECT full_name, mime_type, data FROM wliu_files WHERE deleted=0 AND id='" . $id . "' AND guid='" . $guid . "' AND token='" . $token . "'";
	if( $db->exists($query) ) {
		$result=$db->query($query);
		$row=$db->fetch($result);
		$mine = $row["mime_type"];
		$filename = str_replace(" ","",$row["full_name"]);
		header("Content-type: $mine");
		header("Content-Disposition: attachment; filename=$filename");
		$data = substr( $row["data"], strpos($row["data"], "base64,") + strlen("base64,"));
		echo base64_decode($data);
	} else {
		echo '<br><span style="font-size:36px;color:red;">Invalid Access Files</span>';
	}
} catch(Exception $e ) {
	echo '<br><span style="font-size:36px;color:red;">Invalid Access Files</span>';
}
?>