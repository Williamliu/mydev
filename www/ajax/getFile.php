<?php 
ini_set("display_errors", 1);
ini_set('allow_url_fopen',1);
//echo $_SERVER["document_root"];
$mimeType = "application/vnd.ms-excel";
$fullname = $_SERVER["DOCUMENT_ROOT"]. "/ajax/abbc.xlsx";
$imgbinary = fread(fopen($fullname, "r"), filesize($fullname));
//$imgbinary = file_get_contents($fullname);
$response = array();
$response["data"] = "data:" . $mimeType . ";base64," . base64_encode( $imgbinary );
echo json_encode($response);
?>