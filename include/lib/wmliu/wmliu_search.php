<?php
class WMSEARCH {
    static public function concat($aaaa, $cccc) {
         return $aaaa . ($cccc==""?"":" AND " . $cccc);   
    }

    static public function join($sp, $from, $to) {
         return $to . ( $to==""?"":($from==""?"":"$sp ") ) . $from;   
    }

    static public function filterID($table, $val) {
		$criteria = "";
        // strict search        
        if($table["name"]!="") {
            $val = trim($val);
            $criteria .= ($criteria==""?"":" AND ") . $table["name"] . "." . $table["col"] . " = '" . $val . "'"; 
        }
        return $criteria;
    }

    static public function searchID($table, $val) {
		$criteria = "";
        if($table["name"]!="") {
            $val = trim($val);
            if($val!="") {
                $criteria .= ($criteria==""?"":" AND ") . $table["name"] . "." . $table["col"] . " = '" . $val . "'"; 
            } 
        }
        return $criteria;
    }

    static public function filter($table, $vals) {
		global $CFG;
		$dlang = $CFG["lang_default"]?$CFG["lang_default"]:"cn";
		$criteria = "";
        if( $table["name"] != "" ) {
		    foreach($table["filterCols"] as $col=>$colInfo ) {
			    $colName    = trim($col);
                $colValue   = $vals[$colName];
                if( !is_array($colValue) ) {
                    $colValue = str_replace( array("undefined", "null"), array("",""), trim($colValue) );
                    $colValue   = LANG::trans($colValue, $dlang);
                    if($colValue == "") continue;
                } else {
                }

            
                $dataType   = $colInfo["datatype"]?$colInfo["datatype"]:"string";
                $compare    = $colInfo["compare"]?$colInfo["compare"]:"=";

                $colInfo["cols"] = trim($colInfo["cols"]);
                $fields = array();
                if( $colInfo["cols"] != "") {
                    $fields = explode(",", $colInfo["cols"]);
                } else {
                    $fields[0] = $colName;
                }

                $tmp_ccc = "";
                switch($colInfo["type"]) {
                    case "hidden":
                    case "choose":
                    case "select":
                    case "radio":
                        if( count($fields) > 1 ) {
                            foreach( $fields as $field ) {
                                $field = trim($field);
                                
                                $tmp_ccc_str = str_replace(array("{{colName}}","{{colVal0}}", "{{tableName}}") ,array( $field,  $colValue, $table["name"] ), self::$filterType[$dataType][$compare]); 
                                if($tmp_ccc_str != "") $tmp_ccc .= ($tmp_ccc==""?"":" OR ") . $tmp_ccc_str ;  
                            }
						    $tmp_ccc = $tmp_ccc==""?"":"(" . $tmp_ccc . ")";
                        } else {
    					    $tmp_ccc = str_replace(array("{{colName}}","{{colVal0}}", "{{tableName}}") ,array( $fields[0],  $colValue, $table["name"] ), self::$filterType[$dataType][$compare]); 
                        }
                        break;
                    case "textbox":
                        if( count($fields) > 1 ) {
                            foreach( $fields as $field ) {
                                $field = trim($field);
                                
                                $tmp_ccc_str = str_replace(array("{{colName}}","{{colVal0}}", "{{tableName}}") ,array( $field,  $colValue, $table["name"] ), self::$filterType[$dataType][$compare]); 
                                if($tmp_ccc_str != "") $tmp_ccc .= ($tmp_ccc==""?"":" OR ") . $tmp_ccc_str ;  
                            }

                            // combine 
							foreach($fields as $fields_ccc) {
								$ccc1 = $table["name"] . "." . $fields_ccc;
								$ccc2 .= ($ccc2!=""?",":"") . $ccc1;  
							}
							$ccc3 = "concat(" . $ccc2 . ")";
							$colValue1 = str_replace(array(",", " "), array("",""), $colValue);

							$tmp_ccc_str = str_replace(array("{{colName}}","{{colVal0}}") ,array( $ccc3,  $colValue1), self::$filterType["combine"][$compare]); 
							if($tmp_ccc_str != "") $tmp_ccc .= ($tmp_ccc==""?"":" OR ") . $tmp_ccc_str ;  
							
							$fields_dd = array_reverse($fields);
							foreach( $fields_dd as $fields_ddd ) {
								$ddd1 = $table["name"] . "." . $fields_ddd;
								$ddd2 .= ($ddd2!=""?",":"") . $ddd1;  
							}
							$ddd3 = "concat(" . $ddd2 . ")";
							$tmp_ccc_str = str_replace(array("{{colName}}","{{colVal0}}") ,array( $ddd3,  $colValue1), self::$filterType["combine"][$compare]); 
							if($tmp_ccc_str != "") $tmp_ccc .= ($tmp_ccc==""?"":" OR ") . $tmp_ccc_str ;  
       					
						    $tmp_ccc = $tmp_ccc==""?"":"(" . $tmp_ccc . ")";
                   		} else {
    					    $tmp_ccc = str_replace(array("{{colName}}","{{colVal0}}", "{{tableName}}") ,array( $fields[0],  $colValue, $table["name"] ), self::$filterType[$dataType][$compare]); 
                        }
                        break;
                    case "bool":
                        $dataType   = "bool";
                        $compare    = "=";
                        $colValue   = str_replace( array("true", "false"), array("1","0"), trim($vals[$colName]) );
                        if( $colValue == "1" ) {   // bool must check it,  if uncheck then search all 
                            if( count($fields) > 1 ) {
                                foreach( $fields as $field ) {
                                    $field = trim($field);
                                    $tmp_ccc_str = str_replace(array("{{colName}}","{{colVal0}}", "{{tableName}}") ,array( $field,  $colValue, $table["name"] ), self::$filterType[$dataType][$compare]); 
                                    if($tmp_ccc_str != "") $tmp_ccc .= ($tmp_ccc==""?"":" OR ") . $tmp_ccc_str ;  
                                }
						        $tmp_ccc = $tmp_ccc==""?"":"(" . $tmp_ccc . ")";
                            } else {
    					        $tmp_ccc = str_replace(array("{{colName}}","{{colVal0}}", "{{tableName}}") ,array( $fields[0],  $colValue, $table["name"] ), self::$filterType[$dataType][$compare]); 
                            }
                        }
                        break;
					case "date":
						$datestart 	= $colValue;
                        if( count($fields) > 1 ) {
                            foreach( $fields as $field ) {
                                $field = trim($field);
                                $tmp_ccc_str = str_replace(array("{{colName}}", "{{colVal0}}", "{{tableName}}") ,array( $field,  $datestart, $table["name"] ), self::$filterType[$dataType][$compare]); 
                                if($tmp_ccc_str != "") $tmp_ccc .= ($tmp_ccc==""?"":" OR ") . $tmp_ccc_str ;  
                            }
						    $tmp_ccc = $tmp_ccc==""?"":"(" . $tmp_ccc . ")";

                   		} else {
    					    $tmp_ccc = str_replace(array("{{colName}}","{{colVal0}}","{{tableName}}") ,array( $fields[0],  $datestart, $table["name"] ), self::$filterType[$dataType][$compare]); 
                        }
						break;
					case "daterange":
						$datestart 	= $colValue["from"];
						$dateend 	= $colValue["to"];
						if($datestart == "") 	$datestart 	= "1970-01-01";
						if($dateend == "") 		$dateend 	= "2030-12-31";
							
                        if( count($fields) > 1 ) {
                            foreach( $fields as $field ) {
                                $field = trim($field);
                                $tmp_ccc_str = str_replace(array("{{colName}}", "{{colVal0}}", "{{colVal1}}", "{{tableName}}") ,array( $field,  $datestart, $dateend, $table["name"] ), self::$filterType[$dataType][$compare]); 
                                if($tmp_ccc_str != "") $tmp_ccc .= ($tmp_ccc==""?"":" OR ") . $tmp_ccc_str ;  
                            }
						    $tmp_ccc = $tmp_ccc==""?"":"(" . $tmp_ccc . ")";

                   		} else {
    					    $tmp_ccc = str_replace(array("{{colName}}","{{colVal0}}","{{colVal1}}","{{tableName}}") ,array( $fields[0],  $datestart, $dateend, $table["name"] ), self::$filterType[$dataType][$compare]); 
                        }
						break;
					case "dateint":
						$datestart 	= cTYPE::datetoint($colValue . " 00:00:00");
						$dateend 	= cTYPE::datetoint($colValue . " 23:59:59");
                        if( count($fields) > 1 ) {
                            foreach( $fields as $field ) {
                                $field = trim($field);
                                $tmp_ccc_str = str_replace(array("{{colName}}", "{{colVal0}}", "{{colVal1}}", "{{tableName}}") ,array( $field,  $datestart, $dateend, $table["name"] ), self::$filterType[$dataType][$compare]); 
                                if($tmp_ccc_str != "") $tmp_ccc .= ($tmp_ccc==""?"":" OR ") . $tmp_ccc_str ;  
                            }
						    $tmp_ccc = $tmp_ccc==""?"":"(" . $tmp_ccc . ")";

                   		} else {
    					    $tmp_ccc = str_replace(array("{{colName}}","{{colVal0}}","{{colVal1}}","{{tableName}}") ,array( $fields[0],  $datestart, $dateend, $table["name"] ), self::$filterType[$dataType][$compare]); 
                        }
						break;
					case "dateintrange":
						$datestart 	= cTYPE::datetoint($colValue["from"] . " 00:00:00");
						$dateend 	= cTYPE::datetoint($colValue["to"] . " 23:59:59");
						if($dateend <= 0) $dateend = cTYPE::datetoint("2030-12-31 23:59:59");
							
                        if( count($fields) > 1 ) {
                            foreach( $fields as $field ) {
                                $field = trim($field);
                                $tmp_ccc_str = str_replace(array("{{colName}}", "{{colVal0}}", "{{colVal1}}", "{{tableName}}") ,array( $field,  $datestart, $dateend, $table["name"] ), self::$filterType[$dataType][$compare]); 
                                if($tmp_ccc_str != "") $tmp_ccc .= ($tmp_ccc==""?"":" OR ") . $tmp_ccc_str ;  
                            }
						    $tmp_ccc = $tmp_ccc==""?"":"(" . $tmp_ccc . ")";

                   		} else {
    					    $tmp_ccc = str_replace(array("{{colName}}","{{colVal0}}","{{colVal1}}","{{tableName}}") ,array( $fields[0],  $datestart, $dateend, $table["name"] ), self::$filterType[$dataType][$compare]); 
                        }
						break;
                    case "checkbox":
                        $rtable = $colInfo["rtable"];
                        $rcol   = $colInfo["rcol"];
				        $c_val 		= "";
				        foreach( $colValue as $key=>$val) {
					        if($val===true || $val=="true" || $val=="True") {
						        $c_val .= ($c_val==""?"":",") . $key; 
					        }
				        }
				        $c_val = $c_val==""? "" : "(" . $c_val . ")"; 
				        if($c_val!="") $tmp_ccc = "EXISTS ( SELECT $rtable.$colName FROM $rtable WHERE " . $table["name"] . "." . $table["col"] . " = $rtable.$rcol AND $rtable.$colName in $c_val )"; 
                        break;
                }

    		    if($tmp_ccc!="") $criteria .= ($criteria==""?"":" AND "). $tmp_ccc;
            }
		    //echo "ccc: " . $criteria;
        }
		return $criteria;
    }

    static public function checklist($db, $slang, $checklist) {
        $ret_checklist = array();
        $lang = $slang;
        if( $slang == "tw" )  $lang = "cn";
        if( $slang == "hk" )  $lang = "cn";

        foreach( $checklist as $key=>$val ) {
            $col_name   = $key;
            $table      = $val["ltable"];
            $ctable     = $val["ctable"];
                if($table !="" ) {
                    $query      = "SELECT a.id, a.title_$lang as title, a.desc_$lang as description 
                                                    FROM website_basic_info a INNER JOIN website_basic_table b ON (a.ref_id = b.id) 
                                                    WHERE a.deleted <> 1 AND a.status =1 AND b.table_name='" . $table . "' ORDER BY a.orderno DESC, title ASC;";
                    //echo "query: $query";
                    $result     = $db->query($query);
                    $list       = array();
                    $cnt        = 0;
                    while( $row = $db->fetch($result)) {
                        $list[$cnt]["key"]      = $row["id"];     
                        $list[$cnt]["title"]    = LANG::trans($row["title"],$slang);
                        $list[$cnt]["desc"]     = LANG::trans($row["description"],$slang);     
                        $cnt++;
                    } 
                    $ret_checklist[$key] = $list;
                } else  {
                    $stable     = $val["stable"];
                    $scol       = $val["scol"]; 
                    $scval      = $val["scval"];
             
                    $stitle     = $val["stitle"]; 
                    $sdesc      = $val["sdesc"]; 
                    $scref      = $val["scref"]; 
					
					$fff_str	= "";
					$s1_str 	= "";
					$s2_str 	= "";
					$s3_str 	= "";
					$s4_str 	= "";
					if($scol!="") 	$s1_str 	= "$stable.$scol as scol";
					$fff_str	= SEARCH::join(",", $s1_str ,$fff_str);
					if($stitle!="") $s2_str 	= "$stable.$stitle as title";
					$fff_str	= SEARCH::join(",", $s2_str ,$fff_str);
					if($sdesc!="") 	$s3_str 	= "$stable.$sdesc as description";
					$fff_str	= SEARCH::join(",", $s3_str ,$fff_str);
					$s4_str 	= "$stable.orderno as orderno";
					$fff_str	= SEARCH::join(",", $s4_str ,$fff_str);
					
                    $scriteria  = $scval!="" && $scref!=""?" AND $stable.$scref = '" . $scval . "' ":"";

				    if($stable != "") {
					    $query      = "SELECT $fff_str FROM $stable WHERE deleted <> 1 AND status = 1 $scriteria ORDER BY orderno DESC, title ASC;";
					    //echo "query: $query";
					    $result     = $db->query($query);
					    $list       = array();
					    $cnt        = 0;
					    while( $row = $db->fetch($result)) {
                            $list[$cnt]["key"]      = $row["scol"];     
                            $list[$cnt]["title"]    = LANG::trans($row["title"],$slang);
                            $list[$cnt]["desc"]     = LANG::trans($row["description"],$slang);     
						    $cnt++;
					    } 
					    $ret_checklist[$key] = $list;
                       //print_r($result_checklist[$key]);

				    }
		        }
        }
        return $ret_checklist;
    }

    static public function checkVlist($db, $slang, $checklist) {
        $ret_checklist = array();
        $lang = $slang;
        if( $slang == "tw" )  $lang = "cn";
        if( $slang == "hk" )  $lang = "cn";

        foreach( $checklist as $key=>$val ) {
            $col_name   = $key;
            $table      = $val["ltable"];
            $ctable     = $val["ctable"];
            //if($ctable == "") {
                if($table !="") {
                    $query      = "SELECT a.id, a.title_$lang as title, a.desc_$lang as description 
                                                    FROM website_basic_info a INNER JOIN website_basic_table b ON (a.ref_id = b.id) 
                                                    WHERE a.deleted <> 1 AND b.table_name='" . $table . "' ORDER BY a.orderno DESC, title ASC;";
                    //echo "query: $query";
                    $result     = $db->query($query);
                    $vlist      = array();
                    $cnt        = 0;
                    while( $row = $db->fetch($result)) {
                        $vlist[$row["id"]]      = LANG::trans($row["title"],$slang);     
                        $cnt++;
                    } 
                    $ret_checklist[$key] = $vlist;
                } else  {
                    $stable      = $val["stable"];
                    $scol        = $val["scol"]; 
                    $scval       = $val["scval"];
             
                    $stitle      = $val["stitle"]; 
                    $sdesc       = $val["sdesc"]; 
                    $scref       = $val["scref"]; 

					$fff_str	= "";
					$s1_str 	= "";
					$s2_str 	= "";
					$s3_str 	= "";
					$s4_str 	= "";
					if($scol!="") 	$s1_str 	= "$stable.$scol as scol";
					$fff_str	= SEARCH::join(",", $s1_str ,$fff_str);
					if($stitle!="") $s2_str 	= "$stable.$stitle as title";
					$fff_str	= SEARCH::join(",", $s2_str ,$fff_str);
					if($sdesc!="") 	$s3_str 	= "$stable.$sdesc as description";
					$fff_str	= SEARCH::join(",", $s3_str ,$fff_str);
					$s4_str 	= "$stable.orderno as orderno";
					$fff_str	= SEARCH::join(",", $s4_str ,$fff_str);

                    $scriteria  = $scval!="" && $scref!=""?" AND $stable.$scref = '" . $scval . "' ":"";
		
        		    if($stable != "") {
					    $query      = "SELECT $fff_str FROM $stable WHERE deleted <> 1 $scriteria ORDER BY orderno DESC, title ASC;";
					    //echo "query: $query";
					    $result     = $db->query($query);
                        $vlist      = array();
					    $cnt        = 0;
					    while( $row = $db->fetch($result)) {
                            $vlist[$row["scol"]]      = LANG::trans($row["title"],$slang);     
						    $cnt++;
					    } 
                        $ret_checklist[$key] = $vlist;
				    }
		        }
            //}
        }
        return $ret_checklist;
    }
   
    static public function checkClist($db, $slang, $checklist) {
        $ret_checklist = array();
        $lang = $slang;
        if( $slang == "tw" )  $lang = "cn";
        if( $slang == "hk" )  $lang = "cn";

        foreach( $checklist as $key=>$val ) {
            $col_name    = $key;
            $ctable      = $val["ctable"];
            $ccol        = $val["ccol"]; 
            $ctitle      = $val["ctitle"]; 
            $cdesc       = $val["cdesc"]; 

            $stable      = $val["stable"];
            $scol        = $val["scol"]; 
            $scval       = $val["scval"];
             
            $stitle      = $val["stitle"]; 
            $sdesc       = $val["sdesc"]; 
            $scref       = $val["scref"]; 
            
            $scriteria  = $scval!="" && $scref!=""?" AND $stable.$scref = '" . $scval . "' ":"";

            if($ctable !="" ) {
                $query      = "SELECT distinct $ctable.$ccol as ccol, $ctable.$ctitle as title, $ctable.$cdesc as description, $ctable.orderno as orderno  
                                                FROM $ctable INNER JOIN $stable ON ($ctable.$ccol = $stable.$scref) 
                                                WHERE $ctable.deleted <> 1 AND $ctable.status = 1  AND $stable.deleted <> 1 AND $stable.status = 1 $scriteria ORDER BY orderno DESC, title ASC;";

                //echo "query: $query";
                $result     = $db->query($query);
                $clist      = array();
                $cnt        = 0;
                while($row = $db->fetch($result)) {
                    $clist[$cnt]["key"]       = $row["ccol"];
                    $clist[$cnt]["title"]     = LANG::trans($row["title"],$slang);
                    $clist[$cnt]["desc"]      = LANG::trans($row["description"],$slang);

                    $clist[$cnt]["list"]      = array();
                    $query_list = "SELECT $stable.$scol as scol, $stable.$stitle as title, $stable.$sdesc as description, $stable.orderno as orderno
                                             FROM $stable WHERE $stable.deleted <> 1 AND $stable.status = 1 AND $stable.$scref = '" . $clist[$cnt]["key"] . "' $scriteria 
                                             ORDER BY orderno DESC, title ASC;";
                    $result_list = $db->query($query_list);
                    $cnt_list = 0;
                    while($row_list = $db->fetch($result_list)) {
                        $clist[$cnt]["list"][$cnt_list]["key"]    = $row_list["scol"];
                        $clist[$cnt]["list"][$cnt_list]["title"]  = LANG::trans($row_list["title"],$slang);
                        $clist[$cnt]["list"][$cnt_list]["desc"]   = LANG::trans($row_list["description"],$slang);
                        $cnt_list++;    
                    }
                        
                    $cnt++;
                }
                $ret_checklist[$key] = $clist;
            } 
        }
        return $ret_checklist;
    }

    static private $filterType = array(
			"bool"		=> 	array(
								""  => "",
								"=" => "{{tableName}}.{{colName}} = {{colVal0}}"
							), 	

			"dateint"		=> 	array(
								"in" => "( {{tableName}}.{{colName}} >= '{{colVal0}}' AND {{tableName}}.{{colName}} <= '{{colVal1}}' )",
								"=" => "( {{tableName}}.{{colName}} >= '{{colVal0}}' AND {{tableName}}.{{colName}} <= '{{colVal1}}' )",
								">=" => "{{tableName}}.{{colName}} >= '{{colVal0}}'",
								"<=" => "{{tableName}}.{{colName}} <= '{{colVal0}}'"
							), 	

			"date"		=> 	array(
								"in" => "( {{tableName}}.{{colName}} >= '{{colVal0}}' AND {{tableName}}.{{colName}} <= '{{colVal1}}' )",
								"=" => "{{tableName}}.{{colName}} = '{{colVal0}}'",
								">=" => "{{tableName}}.{{colName}} >= '{{colVal0}}'",
								"<=" => "{{tableName}}.{{colName}} <= '{{colVal0}}'"
							), 	

			"number"	=> 	array(
								"in" => "{{tableName}}.{{colName}} IN ({{colVal0}})",
								"=" => "{{tableName}}.{{colName}} = {{colVal0}}",
								"<" => "{{tableName}}.{{colName}} < {{colVal0}}",
								">" => "{{tableName}}.{{colName}} > {{colVal0}}",
								">=" => "{{tableName}}.{{colName}} >= {{colVal0}}",
								"<=" => "{{tableName}}.{{colName}} <= {{colVal0}}"
							), 	
			"string"	=> 	array(
								"%" => 	"{{tableName}}.{{colName}} like '%{{colVal0}}%'",
								"=" => 	"{{tableName}}.{{colName}} = '{{colVal0}}'",
								">" => 	"{{tableName}}.{{colName}} > '{{colVal0}}'",
								"<" => 	"{{tableName}}.{{colName}} < '{{colVal0}}'",
								">=" => "{{tableName}}.{{colName}} >= '{{colVal0}}'",
								"<=" => "{{tableName}}.{{colName}} <= '{{colVal0}}'",
								"^" => 	"{{tableName}}.{{colName}} like '{{colVal0}}%'",
								"$" => 	"{{tableName}}.{{colName}} like '%{{colVal0}}'"
							),
			"combine"	=> 	array(
								"%" => "{{colName}} like '%{{colVal0}}%'",
								"=" => "{{colName}} = '{{colVal0}}'",
								"^" => "{{colName}} like '{{colVal0}}%'",
								"$" => "{{colName}} like '%{{colVal0}}'"
							)
	);

}    
?>
