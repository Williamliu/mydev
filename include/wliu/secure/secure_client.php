<?php
include_once($CFG["include_path"] . "/wliu/encrypt/encrypt.php");
$cert_client = array();
$cert_client["wliuHost"] 	= $_SERVER['HTTP_HOST'];
$cert_client["wliuAgent"] 	= $_SERVER['HTTP_USER_AGENT'];
$cert_client["wliuIP"] 		= $_SERVER['REMOTE_ADDR'];
$cert_client["wliuServer"] 	= $_SERVER['SERVER_NAME'];
$cert_client["wliuToken"]	= $CFG["secure_token"];

$cert_client_json = json_encode($cert_client);
$cert_client_encrypt 	= LWHENCRYPT::encrypt($cert_client_json);
$_SESSION[$_SERVER['HTTP_HOST'] . ".securetoken"] = $cert_client_encrypt;
/*
echo "<pre>";
print_r($cert_client);
echo "</pre>";
echo "JSON1: $cert_client_json<br>";
echo "Secure Token: " . $_SESSION[$_SERVER['HTTP_HOST'] . ".securetoken"] . "<br>";
*/
?>