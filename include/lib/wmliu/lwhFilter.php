<?php
class LWHFILTER {
	public function __construct() {
	}
	static public function output(&$filter) {
		$criteria = "";
		foreach($filter as &$colObj) {
			$colObj["col"] 	= $colObj["col"]?$colObj["col"]:$colObj["name"];
			$cols 			= explode(",",$colObj["col"]);
			$coltype   		= $colObj["coltype"]?$colObj["coltype"]:"textbox";

			$colObj["value"] = str_replace(array("undefined", "null"), array("",""), $colObj["value"]);
			$colObj["value"] = trim($colObj["value"]);
			
			$val 	= $colObj["value"];		    
			$need 	= $colObj["need"]?true:false;
			if( $need || $val ) {
				$t1_ccc = "";
				$cnum = 0;
				foreach( $cols as $colName ) {
					//echo "colName:" . $colName . "\n";
					switch( strtolower($coltype) ) {
						case "hidden":
								$compare  	= $colObj["compare"]?strtoupper(trim($colObj["compare"])):"=";
								$cval = "'" . $val . "'";
								if( $compare == "LIKE" ) $cval = "'%" . $val . "%'";
								$t1_ccc .= ($t1_ccc==""?"":" OR ") . trim($colName) . " $compare " . $cval;   
								break;
						case "textbox":
								$compare  	= $colObj["compare"]?strtoupper(trim($colObj["compare"])):"LIKE";
								$cval = "'" . $val . "'";
								if( $compare == "LIKE" ) $cval = "'%" . $val . "%'";
								if( $compare == "IN" ) $cval = "(" . ($val?$val:-1) . ")";
								$t1_ccc .= ($t1_ccc==""?"":" OR ") . trim($colName) . " $compare " . $cval;   
								break;
						case "bool":
								$compare  	= $colObj["compare"]?strtoupper(trim($colObj["compare"])):"=";
								$cval 		= $val?$val:0;
								$t1_ccc .= ($t1_ccc==""?"":" OR ") . trim($colName) . " $compare " . $cval;   
								break;

						case "select":
						case "radio":
						case "radiolist":
								$compare  	= "=";
								$cval 		= $val?$val:"";
								$t1_ccc 	.= ($t1_ccc==""?"":" OR ") . trim($colName) . " $compare " . $cval;   
								break;

						case "checkbox":
						case "checklist":
								$compare  	= $colObj["compare"]?strtoupper(trim($colObj["compare"])):"IN";
								if($compare == "IN") {
									$cval = "(" . ($val?$val:-1) . ")";
									$qqq  = trim($colName) . " $compare " . $cval; 
								} else {
									$vcol 		= $colObj["name"];
									$mainCol 	= $colObj["col"];
									$rtable		= $colObj["rtable"];
									$rcol		= $colObj["rcol"];
									$cval 		= "(" . ($val?$val:"-1") . ")";
									$qqq 		= "$mainCol IN (SELECT $rcol FROM $rtable WHERE $mainCol = $rcol AND $vcol IN $cval)";
								}
															
								$t1_ccc .= ($t1_ccc==""?"":" OR ") . $qqq;   
								break;
						
						case "date":
								$compare = $colObj["compare"]?strtoupper(trim($colObj["compare"])):"=";
								if( $val ) {
									switch($compare) {
										case "=":
											$ttt_date = "(" . trim($colName) . " >= '" . $val . " 00:00:00' AND " . trim($colName) . " <= '" . $val . " 23:59:59')";  
											break;
										case ">":
											$ttt_date = trim($colName) . " $compare '" . $val . " 23:59:59'";  
											break;
										case ">=":
											$ttt_date = trim($colName) . " $compare '" . $val . " 00:00:00'";  
											break;
										case "<":
											$ttt_date = trim($colName) . " $compare '" . $val . " 00:00:00'";  
											break;
										case "<=":
											$ttt_date = trim($colName) . " $compare '" . $val . " 23:59:59'";  
											break;
									}
								} else {
									$ttt_date = trim($colName) . " = '" . $val . "'";  
								}
								$t1_ccc 	.= ($t1_ccc==""?"":" OR ") . $ttt_date;   
								break;

						// time: 	HH:<select scope="xxx" coltype="time" name="ttime"  col="ttime.hh">  
						//			MM:<select scope="xxx" coltype="time" name="ttime"  col="ttime.mm"> 
						// So,   time field name use  "name"  not "col"   

						case "daterange":
								$compare 	= $colObj["compare"]?strtoupper(trim($colObj["compare"])):"=";
								$colName	= $colObj["name"];
								$ssee 		= explode("|", $val);
								$ss			= $ssee[0];
								$ee			= $ssee[1];
								 
								if( $ss != "" && $ee != "" ) {
									$ttt_date = "(" . trim($colName) . " >= '" . $ss . " 00:00:00' AND " . trim($colName) . " <= '" . $ee . " 23:59:59')";  
								} else if( $ss != "") {
									$ttt_date = trim($colName) . " >= '" . $ss . " 00:00:00'";  
								} else if( $ee != "" ) {
									$ttt_date = trim($colName) . " <= '" . $ee . " 23:59:59'";  
								} else if( $need ) {
									$ttt_date = trim($colName) . " = ''";  
								}

								$t1_ccc 	.= ($t1_ccc==""?"":" OR ") . $ttt_date;   
								break;

						case "range":
						case "rangehide":
								$compare 	= $colObj["compare"]?strtoupper(trim($colObj["compare"])):"=";
								$colName	= $colObj["name"];
								$ssee 		= explode("|", $val);
								$ss			= $ssee[0];
								$ee			= $ssee[1];
								 
								if( $ss != "" && $ee != "" ) {
									$ttt_date = "(" . trim($colName) . " >= '" . $ss . "' AND " . trim($colName) . " <= '" . $ee . "')";  
								} else if( $ss != "") {
									$ttt_date = trim($colName) . " >= '" . $ss . "'";  
								} else if( $ee != "" ) {
									$ttt_date = trim($colName) . " <= '" . $ee . "'";  
								} else if( $need ) {
									$ttt_date = trim($colName) . " = ''";  
								}

								$t1_ccc 	.= ($t1_ccc==""?"":" OR ") . $ttt_date;   
								break;


						case "time":
								if( $val != "00:00" || $need ) {
									$colName = $colObj["name"];
									$compare = $colObj["compare"]?strtoupper(trim($colObj["compare"])):"=";
									if( $val ) {
										switch($compare) {
											case "=":
												$ttt_date = "(" . trim($colName) . " >= '" . $val . ":00' AND " . trim($colName) . " <= '" . $val . ":59')";  
												break;
											case ">":
												$ttt_date = trim($colName) . " $compare '" . $val . "'";  
												break;
											case ">=":
												$ttt_date = trim($colName) . " $compare '" . $val . "'";  
												break;
											case "<":
												$ttt_date = trim($colName) . " $compare '" . $val . "'";  
												break;
											case "<=":
												$ttt_date = trim($colName) . " $compare '" . $val . "'";  
												break;
										}
									} else {
										$ttt_date = trim($colName) . " = '" . $val . "'";  
									}
									$t1_ccc 	.= ($t1_ccc==""?"":" OR ") . $ttt_date;  
								}
								break;

						case "timerange":
								$compare 	= $colObj["compare"]?strtoupper(trim($colObj["compare"])):"=";
								$colName	= $colObj["name"];
								
								$sseehhmm 	= explode("|", $val);
								$ss		= $sseehhmm[0]?$sseehhmm[0]:"";
								$ee		= $sseehhmm[1]?$sseehhmm[1]:"";
								
								
								if( $ss != "00:00" && $ee != "00:00" ) {
									$ttt_date = "(" . trim($colName) . " >= '" . $ss . ":00' AND " . trim($colName) . " <= '" . $ee . ":59')";  
								} else if( $ss != "00:00") {
									$ttt_date = trim($colName) . " >= '" . $ss . ":00'";  
								} else if( $ee != "00:00" ) {
									$ttt_date = trim($colName) . " <= '" . $ee . ":59'";  
								} else if( $need ) {
									$ttt_date = trim($colName) . " = ''";  
								}

								$t1_ccc 	.= ($t1_ccc==""?"":" OR ") . $ttt_date;   
								break;

						case "datetime":
								if( $val != "0000-00-00 00:00" || $need ) {
									$colName = $colObj["name"];
									$compare = $colObj["compare"]?strtoupper(trim($colObj["compare"])):"=";
									$ddhhmm = explode(" ", $val);
									$hhmm 	= $ddhhmm[1];
									if( $hhmm == "00:00" ) {
										$stime  = $ddhhmm[0] . " 00:00:00";
										$etime  = $ddhhmm[0] . " 23:59:59";
									} else {
										$stime  = $val . ":00";
										$etime  = $val . ":59";
									}
									if( $val ) {
										switch($compare) {
											case "=":
												$ttt_date = "(" . trim($colName) . " >= '" . $stime . "' AND " . trim($colName) . " <= '" . $etime . "')";  
												break;
											case ">":
												$ttt_date = trim($colName) . " $compare '" . $stime . "'";  
												break;
											case ">=":
												$ttt_date = trim($colName) . " $compare '" . $stime . "'";  
												break;
											case "<":
												$ttt_date = trim($colName) . " $compare '" . $etime . "'";  
												break;
											case "<=":
												$ttt_date = trim($colName) . " $compare '" . $etime . "'";  
												break;
										}
									} else {
										$ttt_date = trim($colName) . " = '" . $val . "'";  
									}
									$t1_ccc 	.= ($t1_ccc==""?"":" OR ") . $ttt_date;  
								}
								break;


					}  // switch
					$cnum++;
				}  // foreach

				$t1_ccc = $t1_ccc==""?"":($cnum>1?" (" .$t1_ccc . ") ":$t1_ccc);
				$criteria .= ($criteria && $t1_ccc?" AND ":"") . $t1_ccc;   

			}  // if ( need || val )
		} // foreach( filter as colObj )

		return $criteria?" AND " . $criteria:"";
	}
}
?>