<?php 
ini_set("display_errors", 1);

//$imgbinary = file_get_contents($fullname);
$response = array();
$response["data"] = $_REQUEST["image"];
echo json_encode($response);
?>