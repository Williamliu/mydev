<?php
include_once($CFG["include_path"] . "/wliu/encrypt/encrypt.php");
$cert_server = array();
$cert_server["wliuHost"] 	= $_SERVER['HTTP_HOST'];
$cert_server["wliuAgent"] 	= $_SERVER['HTTP_USER_AGENT'];
$cert_server["wliuIP"] 		= $_SERVER['REMOTE_ADDR'];
$cert_server["wliuServer"] 	= $_SERVER['SERVER_NAME'];
$cert_server["wliuToken"]	= $CFG["secure_token"];

$cert_server_json = json_encode($cert_server);
$cert_server_encrypt 	= LWHENCRYPT::encrypt($cert_server_json);
$cert_client_encrypt   = $_SESSION[$_SERVER['HTTP_HOST'] . ".securetoken"];
if($cert_server_encrypt!=$cert_client_encrypt) {
    $gErr->set(980, gwords("website.secure.failed"));
    throw $gErr;
} 
/*
echo "<pre>";
print_r($cert_server);
echo "</pre>";
echo "Client: $cert_client_encrypt<br>";
echo "Server: $cert_server_encrypt<br>";
*/
?>