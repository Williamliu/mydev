<?php
	$public_menu_html 	= create_public_menu($db, 0);
	$user_menu_html 	= create_user_menu($db, 0);
	$menu_html 			= '<ul class="lwhMenu">';
	$menu_html 			.= $public_menu_html;
	//$menu_html 			.= $user_menu_html;
	$menu_html 			.= '</ul>';
	
	function create_public_menu($db, $parent_id) {
		global $public_user;
		global $GLang;
		global $CFG;
		global $db;
		$query_menu 	= "SELECT * FROM vw_public_menu_struct WHERE  parent_id = '" . $parent_id . "' ORDER BY orderno DESC, created_time ASC";
		$result_menu 	=$db->query($query_menu);
		$rows 			=$db->rows($result_menu);
		$html			= '';
		if( count($rows) > 0 ) {
			if( $parent_id == 0 ) {
				//$html .= '<ul class="lwhMenu">';
			} else {
				$html .= '<ul>';
			}
			foreach( $rows as $row ) {
				$menu_id  	= $row["menu_id"];
				$menu_name 	= LANG::trans($row[LANG::langCol("menu_name",  	$GLang)], $GLang);
				$menu_desc 	= LANG::trans($row[LANG::langCol("menu_desc", 	$GLang)], $GLang);
				$menu_url  	= trim($row["url"] . "");
				$menu_temp 	= trim($row["template"] . "");
				$menu_nodes	= $row["nodes"];
				
				if( $menu_id == $public_user["public"]["menuid"] && $public_user["public"]["nodes"] == $menu_nodes ) {
					$html .= '<li class="selected">';
				} else {
					$html .= '<li>';
				}
				
				$html_url = $menu_name;
				if($menu_url 	!= "") $html_url = '<a href="' . $menu_url . '" 	title="' . $menu_desc . '" target="_blank">' . $menu_name . '</a>';
				if($menu_temp 	!= "") $html_url = '<a href="' . $menu_temp . '" 	title="' . $menu_desc . '">' . $menu_name . '</a>';
					
				$html .= $html_url;

				if( $menu_nodes == 1 ) {
					$html_sub = create_public_menu($db, $menu_id);
					$html .= $html_sub;
					if($html_sub !="") {
						if( $parent_id == 0 ) {
							$html .= '<s class="down"></s>';
						} else {
							$html .= '<s class="left"></s>';
						}
					}
				}
				
				$html .= '</li>';
			}

			if( $parent_id == 0 ) {
				//$html .= '</ul>';
			} else {
				$html .= '</ul>';
			}
		}
		return $html;
	}
	
	
	function create_user_menu($db, $parent_id) {
		global $public_user;
		global $GLang;
		global $CFG;
		global $db;
		$query_menu 	= "SELECT * FROM vw_user_menu_struct WHERE session_id = '" . $public_user["sessid"]  . "' AND parent_id = '" . $parent_id . "' ORDER BY orderno DESC, created_time ASC";
		$result_menu 	=$db->query($query_menu);
		$rows 			=$db->rows($result_menu);
		$html			= '';
		if( count($rows) > 0 ) {
			if( $parent_id == 0 ) {
				//$html .= '<ul class="lwhMenu">';
			} else {
				$html .= '<ul>';
			}
			foreach( $rows as $row ) {
				$menu_id  	= $row["menu_id"];
				$menu_name 	= LANG::trans($row[LANG::langCol("menu_name",  	$GLang)], $GLang);
				$menu_desc 	= LANG::trans($row[LANG::langCol("menu_desc", 	$GLang)], $GLang);
				$menu_url  	= trim($row["url"] . "");
				$menu_temp 	= trim($row["template"] . "");
				$menu_nodes	= $row["nodes"];
				
				//echo "url: " . $menu_temp . "  request: " .  $_SERVER['REQUEST_URI'] . "<br>";
				//echo "match: " . preg_match("/$menu_temp/i", $_SERVER['REQUEST_URI']) . "<br>";

				if( $menu_id == $public_user["user"]["menuid"] && $public_user["user"]["nodes"] == $menu_nodes ) {
					$html .= '<li class="selected">';
				} else {
					$html .= '<li>';
				}
				
				$html_url = $menu_name;
				if($menu_url 	!= "") $html_url = '<a href="' . $menu_url . '" 	title="' . $menu_desc . '" target="_blank">' . $menu_name . '</a>';
				if($menu_temp 	!= "") $html_url = '<a href="' . $menu_temp . '" 	title="' . $menu_desc . '">' . $menu_name . '</a>';
					
				$html .= $html_url;

				if( $menu_nodes == 1 ) {
					$html_sub = create_user_menu($db, $menu_id);
					$html .= $html_sub;
					if($html_sub !="") {
						if( $parent_id == 0 ) {
							$html .= '<s class="down"></s>';
						} else {
							$html .= '<s class="left"></s>';
						}
					}
				}
				
				$html .= '</li>';
			}

			if( $parent_id == 0 ) {
				//$html .= '</ul>';
			} else {
				$html .= '</ul>';
			}
		}
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
<div class="menu-header"> 
	<div class="frame-center">
  	<?php echo $menu_html;?>
    </div>
</div>
<div class="submenu-header">
	<div class="frame-center">
  	<?php echo $admin_uhere_html;?>
    </div>
</div>


