<?php
function get_user_agent() {
	$user_agent = $_SERVER['HTTP_USER_AGENT'];
	$ua['browser']  = '';
	$ua['version']  = 0;
	if (preg_match('/(firefox|opera|applewebkit)(?: \(|\/|[^\/]*\/| )v?([0-9.]*)/i', $user_agent, $m)) {
		$ua['browser']  = strtolower($m[1]);
		$ua['version']  = $m[2];
	}	else if (preg_match('/MSIE ?([0-9.]*)/i', $user_agent, $v) && !preg_match('/(bot|(?<!mytotal)search|seeker)/i', $user_agent)) {
		$ua['browser']  = 'ie';
		$ua['version']  = $v[1];
		if( preg_match('/Trident\/?([0-9.]*)/i', $user_agent, $v) ) {
			$ua['version']  = intval($v[1]) + 4;
		}
	}
	return $ua;
}
?>
