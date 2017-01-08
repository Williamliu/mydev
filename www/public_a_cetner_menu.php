<?php
	$user_menu_html 	= create_user_menu($db);
	$menu_html 			= '<div class="lwhTab9 lwhTab9-smitten" style="margin-bottom:-2px;">';
	$menu_html 			.= $user_menu_html;
	$menu_html 			.= '</div>';
	
	function create_user_menu($db) {
		global $public_user;
		global $GLang;
		global $CFG;
		global $db;
		global $words;
		
		$query_menu 	= "SELECT * FROM vw_user_menu WHERE session_id = '" . $public_user["sessid"]  . "' ORDER BY orderno DESC, created_time ASC";
		$result_menu 	=$db->query($query_menu);
		$rows 			=$db->rows($result_menu);
		$html			= '<ul>';

		$html 			.= '<li>';
		$html 			.= '<a href="index.php">' . $words["home page"] . '</a>';
		$html 			.= '<s></s></li>';

		foreach( $rows as $row ) {
			$menu_id  	= $row["menu_id"];
			$menu_name 	= LANG::trans($row[LANG::langCol("menu_name",  	$GLang)], $GLang);
			$menu_desc 	= LANG::trans($row[LANG::langCol("menu_desc", 	$GLang)], $GLang);
			$menu_url  	= trim($row["url"] . "");
			$menu_temp 	= trim($row["template"] . "");
			$menu_nodes	= $row["nodes"];

			if( $menu_id == $public_user["user"]["top_menuid"] ) {
				$html .= '<li class="selected">';
			} else {
				$html .= '<li>';
			}
			
			$html_url = $menu_name;
			if($menu_url 	!= "") $html_url = '<a href="' . $menu_url . '" 	title="' . $menu_desc . '" target="_blank">' . $menu_name . '</a>';
			if($menu_temp 	!= "") $html_url = '<a href="' . $menu_temp . '" 	title="' . $menu_desc . '">' . $menu_name . '</a>';
				
			$html .= $html_url;
			$html .= '<s></s>';

			$html .= '</li>';
		}
		$html .= '</sul>';
		return $html;
	}
	
?>
<script type="text/javascript" language="javascript">
	$(function(){
		if( $("ul.lwhMenu li").hasClass("selected") ) {
			$("ul.lwhMenu li.selected").parentsUntil("ul.lwhMenu").addClass("selected");
		}
	});
</script>
<div class="menu-header-mycenter"> 
	<div class="frame-center">
  	<?php echo $menu_html;?>
    </div>
</div>


