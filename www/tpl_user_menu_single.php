<?php 
$html = '';
$query_mm = "SELECT * FROM vw_user_menu WHERE session_id = '" . $public_user["sessid"] . "' AND menu_id = '" . $public_user["user"]["top_menuid"] . "'";
$result_mm = $db->query($query_mm);
if( $db->row_nums($result_mm) > 0 ) {
	$html .= '<ul class="lwhAccd">';
	while( $row_mm = $db->fetch($result_mm) ) {
		$html .= '<li class="selected"><div>' . LANG::trans($row_mm[LANG::langCol("menu_name",  $GLang)], $GLang) . '</div>';
		
		$query_nn 	= "SELECT * FROM vw_user_template WHERE session_id = '" . $public_user["sessid"] . "' AND parent_id = '" . $row_mm["menu_id"] . "'";
		$result_nn 	= $db->query($query_nn);
		
		if( $db->row_nums($result_nn) > 0 ) {
			$html .= '<ul>';
			while( $row_nn = $db->fetch($result_nn) ) {
				$menu_url  	= trim($row_nn["url"] . "");
				$menu_temp 	= trim($row_nn["template"] . "");
				$menu_name 	= LANG::trans($row_nn[LANG::langCol("temp_name",  $GLang)], $GLang);
				$html_url = $menu_name;

				if( $temp_name == $menu_temp )
					$html .= '<li class="selected">';
				else 
					$html .= '<li>';

				if($menu_url 	!= "") $html_url = '<a href="' . $menu_url . '" 	title="' . $menu_desc . '" target="_blank">' . $menu_name . '</a>';
				if($menu_temp 	!= "") $html_url = '<a href="' . $menu_temp . '" 	title="' . $menu_desc . '">' . $menu_name . '</a>';
				
				$html .= $html_url;
				$html .= '</li>';
			}
			$html .= '</ul>';
		}
		
		$html .= '</li>';
	}
	$html .= '</ul>';
}
echo $html;
?>
