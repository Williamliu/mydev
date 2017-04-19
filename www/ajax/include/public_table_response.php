<?php
	cACTION::clearRows($table);
	$response["table"] = $table;
	$db->close();
	echo json_encode($response);
?>