<?php
	$admin_menu_html 	= create_menu($db, 0);
	function create_menu($db, $parent_id) {
		global $admin_user;
		global $CFG;
		global $db;
		$query_menu 	= "SELECT * FROM vw_admin_menu_struct WHERE session_id = '" . $admin_user["sessid"]  . "' AND parent_id = '" . $parent_id . "' ORDER BY orderno DESC, created_time ASC";
		$result_menu 	=$db->query($query_menu);
		$rows 			=$db->rows($result_menu);
		$html			= '';
		if( count($rows) > 0 ) {
			if( $parent_id == 0 ) {
				$html .= '<ul class="lwhMenu">';
			} else {
				$html .= '<ul>';
			}
			foreach( $rows as $row ) {
				$menu_id  	= $row["menu_id"];
				$menu_name 	= LANG::trans($row[LANG::langCol("menu_name",  	$admin_user["lang"])], $admin_user["lang"]);
				$menu_desc 	= LANG::trans($row[LANG::langCol("menu_desc", 	$admin_user["lang"])], $admin_user["lang"]);
				$menu_url  	= trim($row["url"] . "");
				$menu_temp 	= trim($row["template"] . "");
				$menu_nodes	= $row["nodes"];
				
				//echo "url: " . $menu_temp . "  request: " .  $_SERVER['REQUEST_URI'] . "<br>";
				//echo "match: " . preg_match("/$menu_temp/i", $_SERVER['REQUEST_URI']) . "<br>";

				if( $menu_id == $admin_user["menuid"] && $admin_user["nodes"] == $menu_nodes ) {
					$html .= '<li class="selected">';
				    $admin_user["uhere"] = $menu_name;
				} else {
					$html .= '<li>';
				}
				
				$html_url = $menu_name;
				if($menu_url 	!= "") $html_url = '<a href="' . $menu_url . '" 	title="' . $menu_desc . '" target="_blank">' . $menu_name . '</a>';
				if($menu_temp 	!= "") $html_url = '<a href="' . $menu_temp . '" 	title="' . $menu_desc . '">' . $menu_name . '</a>';
					
				$html .= $html_url;

				if( $menu_nodes == 1 ) {
					$html_sub = create_menu($db, $menu_id);
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

			$html .= '</ul>';
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
  	<?php echo $admin_menu_html;?>
    </div>
</div>
<div class="submenu-header">
	<div class="frame-center">
  		<span class="uhere"><?php echo $words["you are here"]?> : </span><span class="uhere uhere-link"><?php echo  $admin_user["uhere"]?></span>
    </div>
</div>



