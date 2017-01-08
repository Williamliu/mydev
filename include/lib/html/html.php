<?php
/***********************************************************************************************/
/*																							   */
/***********************************************************************************************/
class HTML {
	static public function checkbox() {
		global $db;
		$pnum 	= func_num_args();
		$params	= func_get_args();
		
				
        $db    		= $params[0];   
       	$lang  		= $params[1];   
		$colObj 	= $params[2]; 
        $values     = $params[3];        

		/********************************/
		$stable		= $colObj["stable"];
		$scol		= $colObj["scol"];
		$stitle		= $colObj["stitle"];
		$sdesc		= $colObj["sdesc"];

		$scope		= $colObj["scope"];
		$name		= $colObj["name"];   // for filter :   name should be  value id
		$col		= $colObj["col"]?$colObj["col"]:$colObj["name"];  // for filger :  col should be  main id
		$colname	= $colObj["colname"];
		$rtable		= $colObj["rtable"];
		$rcol		= $colObj["rcol"];   // for both:  rcol should  ref id
		$need		= $colObj["need"]?$colObj["need"]:0;
		$notnull	= $colObj["notnull"]?$colObj["notnull"]:0;

		$align		= $colObj["align"]?$colObj["align"]:0;
		$sn			= $colObj["sn"]?$colObj["sn"]:0;
		$colnum		= $colObj["colnum"]?$colObj["notnull"]:0;
		
		/*******************************/
		
		$fields		= $scol;
		$fields		.= ($stitle==""?"":",") . $stitle; 	 		
		$fields		.= ($sdesc==""?"":",") . $sdesc; 	 		

          
        $vals = array();        
		if( $values != "" ) {
            $vals = explode(",", $values);
		}

        $query     	= "SELECT $fields FROM $stable WHERE deleted <> 1 AND status = 1 ORDER BY orderno DESC, created_time ASC";
        $result    	= $db->query($query); 
        $rows 		= $db->rows($result);

        if($align) 
			$html = '<table border="0" cellpadding="0" cellspacing="0">';
		else 
			$html = '<div>';
        $cnt=0;
		$cno=0;

		foreach( $rows as $row ) {
			$cno++;
			if($cnt <= 0) {
				if($align) $html .= '<tr>';
			}
			$cnt++;
			
			
            $hdesc  = LANG::trans($row[$sdesc], $lang);
            $htitle = LANG::trans($row[$stitle], $lang);

            if($align) $html .= '<td>';
			$html .= '<label title="' . $hdesc . '" class="' . ( in_array($row["id"], $vals)?'lwhCommon-checked':'')  . '" scope="' . $scope . '" name="' . $name . '" style="margin-left:2px;margin-right:2px;">' .
						'<input type="checkbox" class="lwhCommon-checkbox" ' . 
						'scope="' . $scope . '" ' .
						'name="' . $name . '" ' .
						'col="' . $col . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="checkbox" '.
						'rtable="' . $rtable . '" ' .
						'rcol="' . $rcol . '" ' .
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						( in_array($row["id"], $vals)?'checked="checked"':'') .  ' value="' . $row["id"] . '" />';
            $html .= 	'<span class="lwhCommon-checkbox">' .($sn?$cno . '. ':'') .  $htitle . '</span>';
			$html .= 	'</label>';
            
			if($align) $html .= '</td>';

			if($cnt >= $colnum && $colnum > 0 ) {
				$cnt = 0;
				if($align) 
                    $html .= '</tr>';
                else
                    $html .= '<br>';
			}
		}
        if($cnt > 0 && $cnt < $colnum && $colnum > 0) {
	        if($align) {
				$html .= '</tr>';
			}
		}

       if($align) 
	   		$html .= '</table>';
		else 
	   		$html .= '</div>';
		
		return $html;
	}

	static public function radio() {
		global $db;
		$pnum 	= func_num_args();
		$params	= func_get_args();
		
        $db    		= $params[0];   
       	$lang  		= $params[1];   
		$colObj 	= $params[2]; 
        $values     = $params[3];        

		/********************************/
		$stable		= $colObj["stable"];
		$scol		= $colObj["scol"];
		$stitle		= $colObj["stitle"];
		$sdesc		= $colObj["sdesc"];

		$scope		= $colObj["scope"];
		$name		= $colObj["name"];
		$col		= $colObj["col"]?$colObj["col"]:$colObj["name"];
		$colname	= $colObj["colname"];
		$need		= $colObj["need"]?$colObj["need"]:0;
		$notnull	= $colObj["notnull"]?$colObj["notnull"]:0;

		$align		= $colObj["align"]?$colObj["align"]:0;
		$sn			= $colObj["sn"]?$colObj["sn"]:0;
		$colnum		= $colObj["colnum"]?$colObj["notnull"]:0;
		
		/*******************************/
		
		$fields		= $scol;
		$fields		.= ($stitle==""?"":",") . $stitle; 	 		
		$fields		.= ($sdesc==""?"":",") . $sdesc; 	 		
          
        $val		= $values;

        $query     	= "SELECT $fields FROM $stable WHERE deleted <> 1 AND status = 1 ORDER BY orderno DESC, created_time ASC";
        $result    	= $db->query($query); 
        $rows 		= $db->rows($result);

        if($align) 
			$html = '<table border="0" cellpadding="0" cellspacing="0">';
		else 
			$html = '<div>';
        $cnt=0;
		$cno=0;

		foreach( $rows as $row ) {
			$cno++;
			if($cnt <= 0) {
				if($align) $html .= '<tr>';
			}
			$cnt++;
			
			
            $hdesc  = LANG::trans($row[$sdesc], $lang);
            $htitle = LANG::trans($row[$stitle], $lang);

            if($align) $html .= '<td>';
			
			$html .= '<label title="' . $hdesc . '" class="' . ($row["id"]==$val?'lwhCommon-checked':'')  . '" scope="' . $scope . '" name="' . $name . '" style="margin-left:2px;margin-right:2px;">'.
						'<input type="radio" class="lwhCommon-checkbox" ' . 
						'scope="' . $scope . '" ' .
						'name="' . $name . '" ' .
						'col="' . $col . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="radio" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						($row["id"]==$val?'checked="checked"':'') .  ' value="' . $row["id"] . '" />';
            $html .= 	'<span class="lwhCommon-checkbox">' . ($sn?$cno . '. ':'') .  $htitle . '</span>';
			$html .= 	'</label>';
            
			if($align) $html .= '</td>';

			if($cnt >= $colnum && $colnum > 0 ) {
				$cnt = 0;
				if($align) 
                    $html .= '</tr>';
                else
                    $html .= '<br>';
			}
		}
        if($cnt > 0 && $cnt < $colnum && $colnum > 0) {
	        if($align) {
				$html .= '</tr>';
			}
		}

       	if($align) 
			$html .= '</table>';
		else 
			$html .= '</div>';
		
		return $html;
    }

	static public function select() {
		global $db;
		$pnum 	= func_num_args();
		$params	= func_get_args();
		
        $db    		= $params[0];   
       	$lang  		= $params[1];   
		$colObj 	= $params[2]; 
        $values     = $params[3];        

		/********************************/
		$stable		= $colObj["stable"];
		$scol		= $colObj["scol"];
		$stitle		= $colObj["stitle"];
		$sdesc		= $colObj["sdesc"];

		$scope		= $colObj["scope"];
		$name		= $colObj["name"];
		$col		= $colObj["col"]?$colObj["col"]:$colObj["name"];
		$colname	= $colObj["colname"];
		$need		= $colObj["need"]?$colObj["need"]:0;
		$notnull	= $colObj["notnull"]?$colObj["notnull"]:0;
		$sn			= $colObj["sn"]?$colObj["sn"]:0;
		$width		= $colObj["width"]?$colObj["width"]:"auto";
		
		/*******************************/
		
		$fields		= $scol;
		$fields		.= ($stitle==""?"":",") . $stitle; 	 		
		$fields		.= ($sdesc==""?"":",") . $sdesc; 	 		
          
        $val = $values;

        $query     	= "SELECT $fields FROM $stable WHERE deleted <> 1 AND status = 1 ORDER BY orderno DESC, created_time ASC";
        $result    	= $db->query($query); 
        $rows 		= $db->rows($result);
        
        $html = '<select '. 
						'scope="' . $scope . '" ' .
						'name="' . $name . '" ' .
						'col="' . $col . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="select" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
				 ' style="width:' . $width . ';">';
        $html .= '<option value=""></option>';

        $cnt = 0;
		foreach( $rows as $row ) {
            $cnt++;
            $hdesc  = LANG::trans($row[$sdesc], $lang);
            $htitle = LANG::trans($row[$stitle], $lang);
            $htitle = ($sn?$cnt . '. ':'') . $htitle;
            $html .= '<option value="' . $row["id"] . '" title="' . $hdesc . '"' . ($row["id"]==$val?' selected':'') . '>' . $htitle . '</option>';
        }
        $html .= '<select>';
		return $html;
    }
	
	// time: 	HH:<select scope="xxx" coltype="time" name="ttime"  col="ttime.hh">  
	//			MM:<select scope="xxx" coltype="time" name="ttime"  col="ttime.mm"> 
	// So,   time field name use  "name"  not "col"   
	static public function time() {
		global $db;
		$pnum 	= func_num_args();
		$params	= func_get_args();
		
        $db    		= $params[0];   
       	$lang  		= $params[1];   
		$colObj 	= $params[2]; 
        $values     = $params[3];        

		/********************************/
		$scope		= $colObj["scope"];
		$name		= $colObj["name"];
		$colname	= $colObj["colname"];
		$need		= $colObj["need"]?$colObj["need"]:0;
		$notnull	= $colObj["notnull"]?$colObj["notnull"]:0;
		
		$val 	= explode(":",$values);
		$hh		= $val[0]=="00"?0:(intval($val[0])>0?intval($val[0]):-1);
		$mm		= $val[1]=="00"?0:(intval($val[1])>0?intval($val[1]):-1);
		
		/*******************************/
		
        $html = '<select '. 
						'scope="' . $scope . '" ' .
						'name="' . $name . '" ' .
						'col="' . $name . '.hh' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="time" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'datatype="time" ' .
				 'class="lwhCommon-time-hh" placeholder="HH">';
        $html .= '<option value=""></option>';

		for( $i=0; $i<=23; $i++ ) {
            $html .= '<option value="' . $i . '" ' . ($hh==$i?"selected":"") . '>' . $i . '</option>';
        }
        $html .= '<select>';
        $html .= '<b> : </b>';

        $html .= '<select '. 
						'scope="' . $scope . '" ' .
						'name="' . $name . '" ' .
						'col="' . $name . '.mm' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="time" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'datatype="time" ' .
				 'class="lwhCommon-time-mm" placeholder="MM">';
        $html .= '<option value=""></option>';

		for( $i=0; $i<=59; $i++ ) {
            $html .= '<option value="' . $i . '" ' . ($mm==$i?"selected":"") . '>' . substr("0".$i,-2) . '</option>';
        }
        $html .= '<select>';

		return $html;
    }

	static public function timerange() {
		global $db;
		$pnum 	= func_num_args();
		$params	= func_get_args();
		
        $db    		= $params[0];   
       	$lang  		= $params[1];   
		$colObj 	= $params[2]; 
        $values     = $params[3];        

		/********************************/
		$scope		= $colObj["scope"];
		$name		= $colObj["name"];
		$colname	= $colObj["colname"];
		$need		= $colObj["need"]?$colObj["need"]:0;
		$notnull	= $colObj["notnull"]?$colObj["notnull"]:0;
		
		$val 	= explode("|",$values);
		$sshhmm	= explode(":", "" . $val[0]);
		$sshh	= $sshhmm[0]=="00"?0:(intval($sshhmm[0])>0?intval($sshhmm[0]):-1);
		$ssmm	= $sshhmm[1]=="00"?0:(intval($sshhmm[1])>0?intval($sshhmm[1]):-1);

		$eehhmm	= explode(":", "" . $val[1]);
		$eehh	= $eehhmm[0]=="00"?0:(intval($eehhmm[0])>0?intval($eehhmm[0]):-1);
		$eemm	= $eehhmm[1]=="00"?0:(intval($eehhmm[1])>0?intval($eehhmm[1]):-1);
		/*******************************/
		$html =  '<span class="lwhCommon-daterange-text">' . LANG::words("from", $lang) . ": </span>";
        $html .= '<select '. 
						'scope="' . $scope . '" ' .
						'name="' . $name . '" ' .
						'col="' . $name . '.fromhh' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="timerange" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'datatype="time" ' .
				 'class="lwhCommon-time-hh" placeholder="HH">';
        $html .= '<option value=""></option>';

		for( $i=0; $i<=23; $i++ ) {
            $html .= '<option value="' . $i . '" ' . ($sshh==$i?"selected":"") . '>' . $i . '</option>';
        }
        $html .= '</select>';
        $html .= '<b> : </b>';
        $html .= '<select '. 
						'scope="' . $scope . '" ' .
						'name="' . $name . '" ' .
						'col="' . $name . '.frommm' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="timerange" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'datatype="time" ' .
				 'class="lwhCommon-time-mm" placeholder="MM">';
        $html .= '<option value=""></option>';

		for( $i=0; $i<=59; $i++ ) {
            $html .= '<option value="' . $i . '" ' . ($ssmm==$i?"selected":"") . '>' . substr("0".$i,-2) . '</option>';
        }
        $html .= '</select> ';

		$html .=  '<span class="lwhCommon-daterange-text">' . LANG::words("to", $lang) . ": </span>";

        $html .= '<select '. 
						'scope="' . $scope . '" ' .
						'name="' . $name . '" ' .
						'col="' . $name . '.tohh' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="timerange" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'datatype="time" ' .
				 'class="lwhCommon-time-hh" placeholder="HH">';
        $html .= '<option value=""></option>';

		for( $i=0; $i<=23; $i++ ) {
            $html .= '<option value="' . $i . '" ' . ($eehh==$i?"selected":"") . '>' . $i . '</option>';
        }
        $html .= '</select>';
        $html .= '<b> : </b>';
        $html .= '<select '. 
						'scope="' . $scope . '" ' .
						'name="' . $name . '" ' .
						'col="' . $name . '.tomm' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="timerange" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'datatype="time" ' .
				 'class="lwhCommon-time-mm" placeholder="MM">';
        $html .= '<option value=""></option>';

		for( $i=0; $i<=59; $i++ ) {
            $html .= '<option value="' . $i . '" ' . ($eemm==$i?"selected":"") . '>' . substr("0".$i,-2) . '</option>';
        }
        $html .= '</select>';

		return $html;
    }
	
	static public function datetime() {
		global $db;
		$pnum 	= func_num_args();
		$params	= func_get_args();
		
        $db    		= $params[0];   
       	$lang  		= $params[1];   
		$colObj 	= $params[2]; 
        $values     = $params[3];        

		/********************************/
		$scope		= $colObj["scope"];
		$name		= $colObj["name"];
		$colname	= $colObj["colname"];
		$need		= $colObj["need"]?$colObj["need"]:0;
		$notnull	= $colObj["notnull"]?$colObj["notnull"]:0;
		
		$val 	= explode(" ",$values);
		$dd 	= $val[0]?$val[0]:"";
		$hhmm 	= explode(":", ($val[1]?$val[1]:""));
		$hh		= $hhmm[0]=="00"?0:(intval($hhmm[0])>0?intval($hhmm[0]):-1);
		$mm		= $hhmm[1]=="00"?0:(intval($hhmm[1])>0?intval($hhmm[1]):-1);

		/*******************************/
		$html = '<input type="text" class="lwhCommon-date" ' .
						'scope="' . $scope . '" ' .
						'name="' . $name . '" ' .
						'col="' . $name . '.dd' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="datetime" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'maxlength="10" ' .
						'datatype="datetime" ' .
						'value="' . $dd . '" ' .
				  '/> ';
        $html .= '<select '. 
						'scope="' . $scope . '" ' .
						'name="' . $name . '" ' .
						'col="' . $name . '.hh' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="datetime" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'datatype="time" ' .
				 'class="lwhCommon-time-hh" placeholder="HH">';
        $html .= '<option value=""></option>';

		for( $i=0; $i<=23; $i++ ) {
            $html .= '<option value="' . $i . '" ' . ($hh==$i?"selected":"") . '>' . $i . '</option>';
        }
        $html .= '<select>';
        $html .= '<b> : </b>';

        $html .= '<select '. 
						'scope="' . $scope . '" ' .
						'name="' . $name . '" ' .
						'col="' . $name . '.mm' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="datetime" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'datatype="time" ' .
				 'class="lwhCommon-time-mm" placeholder="MM">';
        $html .= '<option value=""></option>';

		for( $i=0; $i<=59; $i++ ) {
            $html .= '<option value="' . $i . '" ' . ($mm==$i?"selected":"") . '>' . substr("0".$i,-2) . '</option>';
        }
        $html .= '<select>';

		return $html;
    }	

	static public function ymd() {
		global $db;
		$pnum 	= func_num_args();
		$params	= func_get_args();
		
        $db    		= $params[0];   
       	$lang  		= $params[1];   
		$colObj 	= $params[2]; 
        $values     = $params[3];        

		/********************************/
		$scope		= $colObj["scope"];
		$name		= $colObj["name"];
		$colname	= $colObj["colname"];
		$need		= $colObj["need"]?$colObj["need"]:0;
		$notnull	= $colObj["notnull"]?$colObj["notnull"]:0;

		$val 	= explode("-",$values);
		$yy 	= intval($val[0])>0?intval($val[0]):"";
		$mm 	= intval($val[1])>0?intval($val[1]):"";
		$dd 	= intval($val[2])>0?intval($val[2]):"";
		
		/*******************************/
		$html = '<input type="text" class="lwhCommon-date-year" ' .
						'scope="' . $scope . '" ' .
						'name="' . $name . '_yy" ' .
						'col="' . $name . '_yy' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="ymd" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'maxlength="4" ' .
						'datatype="number" ' .
						'placeholder="yyyy" ' .
						'value="' . $yy . '" ' .
				  '/>';
        $html .= '<b>-</b>';
        $html .= '<select '. 
						'scope="' . $scope . '" ' .
						'name="' . $name . '_mm" ' .
						'col="' . $name . '_mm' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="ymd" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'datatype="number" ' .
				 'class="lwhCommon-date-mm" placeholder="mm">';
        $html .= '<option value=""></option>';

		for( $i=1; $i<=12; $i++ ) {
            $html .= '<option value="' . $i . '" ' . ($mm==$i?"selected":"") . '>' . $i . '</option>';
        }
        $html .= '<select>';
        $html .= '<b>-</b>';
        $html .= '<select '. 
						'scope="' . $scope . '" ' .
						'name="' . $name . '_dd" ' .
						'col="' . $name . '_dd' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="ymd" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'datatype="number" ' .
				 'class="lwhCommon-date-dd" placeholder="dd">';
        $html .= '<option value=""></option>';

		for( $i=1; $i<=31; $i++ ) {
            $html .= '<option value="' . $i . '" ' . ($dd==$i?"selected":"") . '>' . $i . '</option>';
        }
        $html .= '<select>';

		return $html;
    }	


	static public function daterange() {
		global $db;
		$pnum 	= func_num_args();
		$params	= func_get_args();
		
        $db    		= $params[0];   
       	$lang  		= $params[1];   
		$colObj 	= $params[2]; 
        $values     = $params[3];        

		/********************************/
		$scope		= $colObj["scope"];
		$lang		= $colObj["lang"];
		$name		= $colObj["name"];
		$colname	= $colObj["colname"];
		$need		= $colObj["need"]?$colObj["need"]:0;
		$notnull	= $colObj["notnull"]?$colObj["notnull"]:0;
		
		$val 	= explode("|",$values);
		$ss 	= $val[0]?$val[0]:"";
		$ee 	= $val[1]?$val[1]:"";
	
		/*******************************/
		$html =  '<span class="lwhCommon-daterange-text">' . LANG::words("from", $lang) . ": </span>";
		$html .= '<input type="text" class="lwhCommon-date" ' .
						'scope="' . $scope . '" ' .
						'name="' . $name . '" ' .
						'col="' . $name . '.from' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="daterange" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'maxlength="10" ' .
						'datatype="date" ' .
						'value="' . $ss . '" ' .
				  '/> ';
		$html .=  '<span class="lwhCommon-daterange-text">' . LANG::words("to", $lang) . ": </span>";
		$html .= '<input type="text" class="lwhCommon-date" ' .
						'scope="' . $scope . '" ' .
						'name="' . $name . '" ' .
						'col="' . $name . '.to' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="daterange" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'maxlength="10" ' .
						'datatype="date" ' .
						'value="' . $ee . '" ' .
				  '/> ';

		return $html;
    }	


	static public function range() {
		global $db;
		$pnum 	= func_num_args();
		$params	= func_get_args();
		
        $db    		= $params[0];   
       	$lang  		= $params[1];   
		$colObj 	= $params[2]; 
        $values     = $params[3];        

		/********************************/
		$scope		= $colObj["scope"];
		$lang		= $colObj["lang"];
		$name		= $colObj["name"];
		$colname	= $colObj["colname"];
		$maxlength	= $colObj["maxlength"];
		$class		= $colObj["class"]?$colObj["class"]:"lwhCommon-short";
		$need		= $colObj["need"]?$colObj["need"]:0;
		$notnull	= $colObj["notnull"]?$colObj["notnull"]:0;
		$datatype	= $colObj["datatype"]?$colObj["datatype"]:0;
		
		$val 	= explode("|",$values);
		$ss 	= $val[0]?$val[0]:"";
		$ee 	= $val[1]?$val[1]:"";
	
		/*******************************/
		$html =  '<span class="lwhCommon-daterange-text">' . LANG::words("from", $lang) . ": </span>";
		$html .= '<input type="text" ' .
						'scope="' . $scope . '" ' .
						'class="' . $class . '" ' .
						'name="' . $name . '" ' .
						'col="' . $name . '.from' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="range" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'maxlength="' . $maxlength . '" ' .
						'datatype="' . $datatype . '" ' .
						'value="' . $ss . '" ' .
				  '/> ';
		$html .=  '<span class="lwhCommon-daterange-text">' . LANG::words("to", $lang) . ": </span>";
		$html .= '<input type="text" ' .
						'scope="' . $scope . '" ' .
						'class="' . $class . '" ' .
						'name="' . $name . '" ' .
						'col="' . $name . '.to' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="range" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'maxlength="' . $maxlength . '" ' .
						'datatype="' . $datatype . '" ' .
						'value="' . $ee . '" ' .
				  '/> ';

		return $html;
    }	


	static public function rangehide() {
		global $db;
		$pnum 	= func_num_args();
		$params	= func_get_args();
		
        $db    		= $params[0];   
       	$lang  		= $params[1];   
		$colObj 	= $params[2]; 
        $values     = $params[3];        

		/********************************/
		$scope		= $colObj["scope"];
		$lang		= $colObj["lang"];
		$name		= $colObj["name"];
		$colname	= $colObj["colname"];
		$maxlength	= $colObj["maxlength"];
		$need		= $colObj["need"]?$colObj["need"]:0;
		$notnull	= $colObj["notnull"]?$colObj["notnull"]:0;
		$datatype	= $colObj["datatype"]?$colObj["datatype"]:0;
		
		$val 	= explode("|",$values);
		$ss 	= $val[0]?$val[0]:"";
		$ee 	= $val[1]?$val[1]:"";
	
		/*******************************/
		$html = '<input type="hidden" ' .
						'scope="' . $scope . '" ' .
						'name="' . $name . '" ' .
						'col="' . $name . '.from' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="rangehide" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'maxlength="' . $maxlength . '" ' .
						'datatype="' . $datatype . '" ' .
						'value="' . $ss . '" ' .
				  '/> ';
		$html .= '<input type="hidden" ' .
						'scope="' . $scope . '" ' .
						'name="' . $name . '" ' .
						'col="' . $name . '.to' . '" ' .
						'colname="' . $colname . '" ' .
						'coltype="rangehide" '.
						'need="' . $need . '" ' .
						'notnull="' . $notnull . '" ' .
						'maxlength="' . $maxlength . '" ' .
						'datatype="' . $datatype . '" ' .
						'value="' . $ee . '" ' .
				  '/> ';

		return $html;
    }	

	/************** Tabber ************************************************/
	static public function tab() {
		global $db;
		$pnum 	= func_num_args();
		$params	= func_get_args();
		
        $db    		= $params[0];   
       	$lang  		= $params[1];   
		$tableObj 	= $params[2]; 
		
		$table 		= $tableObj["schema"]["table"];
		$ffObj	 	= $table["fftable"];
		$ffname 	= $ffObj["name"];
		$ffid 		= $ffObj["id"];
		$ffrid 		= $ffObj["rid"];
		$ffrval		= $ffObj["rval"];
		$ffval 		= $ffObj["val"];
	
		$mmid_text = "";
		if($ffname != "") {
			$query = "SELECT $ffid as fid, $ffrid as rid FROM $ffname WHERE $ffid = '" . $ffval . "'";
			$result_ff = $db->query($query);
			while($row_ff = $db->fetch($result_ff)) {
				$mmid_text .= ($mmid_text==""?"":",") . $row_ff["rid"];
			}
		} else {
			$mmid_text = $ffrval?$ffrval:"";
		}
		
		$mmObj 		= $table["mmtable"];
		$mmname		= $mmObj["name"];
		$mmid		= $mmObj["id"];
		$mmtitle	= $mmObj["title"];
		$mmdesc		= $mmObj["desc"];
		$mmcols		= $mmObj["cols"];
		$mmorder	= $mmObj["order"]?"ORDER BY " . $mmObj["order"]:"";
		$row_num 	= intval($tableObj["head"]["rownum"])>0?" LIMIT 0, " . intval($tableObj["head"]["rownum"]) :"";
		$mmccc 		= $mmid_text==""?"":"AND $mmid IN (" . $mmid_text . ")";


		$ssObj 		= $table["sstable"];
		$ssname		= $ssObj["name"];
		$ssid		= $ssObj["id"];
		$ssmref		= $ssObj["mref"];
		$ssfid		= $ssObj["fid"];
		$ssfval		= $ssObj["fval"];
		
		$sstitle	= $ssObj["title"];
		$ssdesc		= $ssObj["desc"];
		$sscols		= $ssObj["cols"];
		$ssorder	= $ssObj["order"]?"ORDER BY " . $ssObj["order"]:"";
		
		$ssccc		= "";
		if($ssfid!="" && $ssfval!="") $ssccc = " AND $ssfid = '" . $ssfval . "'";
		$col_num 	= intval($tableObj["head"]["colnum"])>0?" LIMIT 0, " . intval($tableObj["head"]["colnum"]) :"";
		
		
		$query_mm	= "SELECT $mmid as mid, $mmcols FROM $mmname WHERE deleted <> 1 $mmccc $mmorder $row_num";
		//echo "<br>query: " . $query_mm . "<br>";

		$result_mm 	= $db->query($query_mm);
		$mmarray = array();
		$mcnt = 0;
		while( $row_mm = $db->fetch($result_mm) ) {
			$mmarray[$mcnt]["id"] = $row_mm["mid"];
			$mcol_arr = explode(",", $mmcols);
			$mmarray[$mcnt]["text_title"] 	= $mmtitle;
			$mmarray[$mcnt]["text_desc"] 	= $mmdesc;
			foreach($mcol_arr as $mcol) {
				$mcol = trim($mcol);
				$mmarray[$mcnt][$mcol] 		= $row_mm[$mcol];
				$mmarray[$mcnt]["text_title"] 	= str_replace("{{" . $mcol . "}}", $row_mm[$mcol], $mmarray[$mcnt]["text_title"]);    
				$mmarray[$mcnt]["text_desc"] 	= str_replace("{{" . $mcol . "}}", $row_mm[$mcol], $mmarray[$mcnt]["text_desc"]);    
			}
		
			$query_ss 	= "SELECT $ssid as sid, $sscols FROM $ssname WHERE deleted <> 1 AND $ssmref = '" . $mmarray[$mcnt]["id"] . "' $ssccc $ssorder $col_num";
			//echo "<br>query: " . $query_ss . "<br>";
			$result_ss 	= $db->query($query_ss);
			$ssarray = array();
			$scnt = 0;
			while( $row_ss = $db->fetch($result_ss) ) {
				$ssarray[$scnt]["id"] = $row_ss["sid"];
				$scol_arr = explode(",", $sscols);
				$ssarray[$scnt]["text_title"] 	= $sstitle;
				$ssarray[$scnt]["text_desc"] 	= $ssdesc;
				foreach( $scol_arr as $scol ) {
					$scol = trim($scol);
					$ssarray[$scnt][$scol] 			= $row_ss[$scol];
					$ssarray[$scnt]["text_title"] 	= str_replace("{{" . $scol . "}}", $row_ss[$scol], $ssarray[$scnt]["text_title"]);    
					$ssarray[$scnt]["text_desc"] 	= str_replace("{{" . $scol . "}}", $row_ss[$scol], $ssarray[$scnt]["text_desc"]);    
				}
				$scnt++;
			}
			$mmarray[$mcnt]["data"] = $ssarray;
			$mcnt++;		
		}
		
		//echo "<pre>";
		//print_r($mmarray);
		//echo "</pre>";

		$tabType 	= $tableObj["head"]["type"];
		$tabColor   = $tableObj["head"]["color"]?" ". $tabType . "-" . $tableObj["head"]["color"]:"";
		$tabStyle   = $tableObj["head"]["style"];
		$tabMore	= $tableObj["head"]["more"];
		$tabUrl		= $tableObj["head"]["url"];
		$html = '<div class="' . $tabType . $tabColor . '" style="' . $tabStyle . '">';
		$html_head = '<ul>';
		$html_body = '';
		foreach($mmarray as $mmtab) {
			$html_head .= '<li><s></s>';
			$html_head .= $mmtab["text_title"];
			$html_head .= '</li>';
			
			$html_body .= '<div>';
			$html_body .= '<ul class="lwhTab">';
			foreach( $mmtab["data"] as $sstab ) {
				$ssurl 		= str_replace("{{id}}", $sstab["id"], $tabUrl);
				$html_body .= '<li><a href="' . $ssurl . '" target="_blank">';
				$html_body .= $sstab["text_title"];
				$html_body .= '</a></li>';
			}
			$html_body .= '</ul>';
			$html_body .= '</div>';
					
		}
		$html_head .= '<a href="'. $tabMore .'">' . LANG::words("more", $lang) . '...</a>';
		$html_head .= '</ul>';
		$html_body .= '';


		$html .= $html_head;
		$html .= $html_body;
		$html .= '</div>';
		return $html;
		//echo "mm query: " . $query_mm . "<br>";		
	}
}
?>
