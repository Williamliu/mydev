<?php
class LWHFORM {
	public $form;
    public $result;
	public $db;
	private $dlang;
	public function __construct($db, $form, $dlang) {
		$this->form 	                        = $form;
		$this->db 		                        = $db;
		$this->dlang							= $dlang;
		$this->form["head"]["lang"] 			= $form["head"]["lang"]?$form["head"]["lang"]:$this->dlang;
		//$this->action();
	}

	public function action() {
		switch($this->form["head"]["action"]) {
			case "view":
				$this->load();
                $this->result["filter"] 				= $this->form["filter"];
                $this->result["cols"] 					= $this->form["cols"];
                $this->result["head"] 					= $this->form["head"];
				break;
			case "save":
				$this->validateAll();
				if($this->form["head"]["error"] <= 0 ) {
					foreach($this->form["filter"] as $fkey=>$fval) {
						if( trim($fval)=="" ) {
							$this->form["head"]["error"] = 1;
							$this->form["head"]["errorMessage"] =  LANG::words("navi.noresult", $lang);;
						}
					}
					if($this->form["head"]["error"] <= 0 ) $this->save();
				}
                $this->result["filter"] 				= $this->form["filter"];
                $this->result["cols"] 					= $this->form["cols"];
                $this->result["head"] 					= $this->form["head"];
				break;
			case "add":
				$this->validateAll();
				if($this->form["head"]["error"] <= 0 ) {
					$this->add();
				}
                $this->result["filter"] 				= $this->form["filter"];
                $this->result["cols"] 					= $this->form["cols"];
                $this->result["head"] 					= $this->form["head"];
				break;
			case "delete":
				$this->delete();
                $this->result["filter"] 				= $this->form["filter"];
                $this->result["head"] 					= $this->form["head"];
				break;
		}
	}

	public function load() {
		$db = $this->db;
		$this->form["head"]["error"] 			= 0;
		$this->form["head"]["errorMessage"] 	= "";

		$table = $this->form["head"]["view"]?$this->form["head"]["view"]:$this->form["head"]["base"];
		if( $table != "" ) {
			$fields = $this->getCols( $this->form["cols"]);
			$filter = $this->form["filter"];
			$filter["deleted"] = 0;
			$result = $db->select( $table, $fields, $filter);
			$rows 	= $db->rows($result);
			if( count($rows) > 0 ) {
					$row 	= $rows[0];
					foreach( $this->form["cols"] as &$colObj ) {
						$colName 				= $colObj["col"];
						
						$colObj["state"] 		= 0;
						$colObj["error"] 		= 0;
						$colObj["errorMessage"] = "";
						
						switch( strtolower($colObj["coltype"]) ) {
							case "bool":
							case "checkbutton":
								$colObj["value"] = $row[$colName]?1:0;
								break;
							case "radio":
								$colObj["value"] = $row[$colName]?$row[$colName]:0;
								break;
							case "radiolist":
								$radio_value = SEARCH::radioValue($db, $this->form["head"]["lang"], $colObj, $row[$colName]);
								$colObj["value"] 		= $radio_value["value"];
								$colObj["valuetext"] 	= $radio_value["valuetext"];
								//echo "val: " . $vals;
								break;

							case "radiotext":
								$radio_value 			= SEARCH::radioValue($db, $this->form["head"]["lang"], $colObj , $row[$colName]);
								$colObj["value"] 		= $radio_value["value"];
								$colObj["valuetext"] 	= $radio_value["valuetext"];
								break;
							
							case "checkbox":
								$ck_value = SEARCH::checkValue($db, $this->form["head"]["lang"], $colObj, $this->form["filter"]);
								$colObj["value"] 		= $ck_value["value"];
								break;
							case "checklist":
								$ck_value = SEARCH::checkValue($db, $this->form["head"]["lang"], $colObj, $this->form["filter"]);
								$colObj["value"] 		= $ck_value["value"];
								$colObj["valuetext"] 	= $ck_value["valuetext"];
								break;
							case "checktext":
								$ck_value = SEARCH::checkValue($db, $this->form["head"]["lang"], $colObj, $this->form["filter"]);
								$colObj["value"] 		= $ck_value["value"];
								$colObj["valuetext"] 	= $ck_value["valuetext"];
								break;

							case "editor":
								$colObj["value"] = $row[$colName]?$row[$colName]:"";
								break;
							case "select":
								$colObj["value"] = $row[$colName]?$row[$colName]:"";
								break;
							case "password":
								$colObj["value"] = $row[$colName]?$row[$colName]:"";
								break;
							case "password_confirm":
								$pidx = SEARCH::array_find( SEARCH::array_col($this->form["cols"],"coltype"), "password");
								$passCol = $this->form["cols"][$pidx];
								$colName = $passCol["col"];
								$colObj["value"] = $row[$colName]?$row[$colName]:"";
								break;

							case "date":
								$colObj["value"] = $row[$colName]?$row[$colName]:"";
								break;

							case "time":
								$colName = $colObj["name"];
								$colObj["value"] = $row[$colName]?$row[$colName]:"";
								break;
							case "datetime":
								$colName = $colObj["name"];
								$colObj["value"] = $row[$colName]?$row[$colName]:"";
								break;
							case "ymd":
								$colObj["value"] = $row[$colName]?$row[$colName]:"";
								break;

							default:
								$colObj["value"] = $row[$colName]?$row[$colName]:"";
								break;
						} // switch
					} // foreach
			} else {
				$this->form["head"]["error"] = 1;
				$this->form["head"]["errorMessage"] =  LANG::words("navi.noresult", $lang);;
			} // if count > 0 
		}  // if
	}

	public function save() {
		$db = $this->db;
		$table = $this->form["head"]["base"]?$this->form["head"]["base"]:$this->form["head"]["view"];
		 
		if( $table!= "" ) {
			
			$filter = $this->form["filter"];
			$filter["deleted"] = 0;
			$result = $db->select( $table, "0", $filter);
			if( $db->row_nums($result) > 0 ) {
					$fields = $this->getFields($this->form["cols"]);
					$fields["last_updated"] = time();
					$db->update($table, $this->form["filter"], $fields);
		
					/** deal with checkbox **/			
					foreach( $this->form["cols"] as &$colObj ) {
						switch( strtolower($colObj["coltype"]) ) {
							case "checkbox":
								$ck_value = SEARCH::checkSave($db, $this->form["head"]["lang"], $colObj , $this->form["filter"], $colObj["value"]);
								$colObj["value"] = $ck_value["value"]; 
								break;
							case "checklist": 
								$ck_value = SEARCH::checkSave($db, $this->form["head"]["lang"], $colObj , $this->form["filter"], $colObj["value"]);
								$colObj["value"] = $ck_value["value"]; 
								$colObj["valuetext"] = $ck_value["valuetext"]; 
								break;
						}
					}
					/** end of checkbox **/
			} else {
				$this->form["head"]["error"] = 1;
				$this->form["head"]["errorMessage"] =  LANG::words("navi.noresult", $lang);;
			} //if count > 0
		}
	}


	public function add() {
		$db = $this->db;
		$table = $this->form["head"]["base"]?$this->form["head"]["base"]:$this->form["head"]["view"];
		 
		if( $table!= "" ) {

			$fields = $this->getFields($this->form["cols"]);
			$fields["created_time"] = time();

			$fcnt = 0;
			foreach($this->form["filter"] as $fkey=>$fval) {
				$fcnt++;
			}
			if( $fcnt > 1 ) {
				foreach($this->form["filter"] as $fkey=>$fval) {
					$fields[$fkey] = $fval;
				}
				$db->insert($table,  $fields);
			} else {
				$this->form["filter"]["id"] = $db->insert($table,  $fields);
			}
			//print_r( $fields);

			/** deal with checkbox **/			
			foreach( $this->form["cols"] as &$colObj ) {
				switch( strtolower($colObj["coltype"]) ) {
					case "checkbox":
						$ck_value = SEARCH::checkSave($db, $this->form["head"]["lang"], $colObj , $this->form["filter"], $colObj["value"]);
						$colObj["value"] = $ck_value["value"]; 
						break;
					case "checklist": 
						$ck_value = SEARCH::checkSave($db, $this->form["head"]["lang"], $colObj , $this->form["filter"], $colObj["value"]);
						$colObj["value"] = $ck_value["value"]; 
						$colObj["valuetext"] = $ck_value["valuetext"]; 
						break;
				}
			}
			/** end of checkbox **/

		}
	}

	public function delete() {
		$db = $this->db;
		$table = $this->form["head"]["base"]?$this->form["head"]["base"]:$this->form["head"]["view"];
		if( $table!= "" ) {

			$filter = $this->form["filter"];
			$filter["deleted"] = 0;
			$result = $db->select( $table, "0", $filter);
			if( $db->row_nums($result) > 0 ) {
	
				$db->detach($table, $this->form["filter"]);
				
				foreach($this->form["filter"] as &$fval) {
					$fval = "";
				}
			} else {
				$this->form["head"]["error"] = 1;
				$this->form["head"]["errorMessage"] =  LANG::words("navi.noresult", $lang);;
			}

		}
	}

	public function getCols($cols) {
		$temp = array();
		foreach( $cols as $idx=>$colObj ) {
			switch( strtolower($colObj["coltype"]) ) {
				case "text":
				case "password":
					if( !preg_match("/_confirm$/", $colObj["col"]) ) $temp[] = $colObj["col"];
					break;
				case "textbox":
				case "editor":
				case "hidden":
				case "textarea":
				case "bool":
				case "checkbutton":
				case "radio":
				case "radiolist":
				case "radiotext":  // get radio value 
				case "select":
				case "password":
				case "intdate":
				case "intdatetime":
				case "date":
				case "ymd":
					$temp[] = $colObj["col"];
					break;
				case "time":
					$temp[] = $colObj["name"];
					break;
				case "datetime":
					$temp[] = $colObj["name"];
					break;
				case "checkbox":
				case "checklist":
					break;
			}
		}
		return $temp;
	}
	
	public function getFields($cols) {
		$temp = array();
		foreach( $cols as $colObj ) {
				$colObj["value"] = str_replace(array("undefined", "null"), array("",""), $colObj["value"]);
				$colObj["value"] = trim($colObj["value"]);
				switch( strtolower($colObj["coltype"]) ) {
					case "text":
						break;
					case "bool":
					case "checkbutton":
						$temp[$colObj["col"]] = $colObj["value"]?$colObj["value"]:0;
						break;
					case "radio":
					case "radiolist":
						$temp[$colObj["col"]] = $colObj["value"]?$colObj["value"]:0;
						break;
					case "checkbox":
					case "checklist":
						break;
					case "editor":
						$temp[$colObj["col"]] = LANG::trans($colObj["value"], $this->dlang);
						break;
					case "hidden":
					case "select":
					case "textarea":
					case "textbox":	
						$temp[$colObj["col"]] = LANG::trans($colObj["value"], $this->dlang);
						break;
					case "password":	
					case "date":
					case "ymd":
						$temp[$colObj["col"]] = $colObj["value"];
						break;
					case "time":
						$temp[$colObj["name"]] = $colObj["value"];
						break;
					case "datetime":
						$temp[$colObj["name"]] = $colObj["value"];
						break;
				}
		}
		return $temp;
	}
	
	public function verify() {
		$this->validateAll();
		return $this->form;
	}
	
	public function validateAll() {
		$this->form["head"]["error"] 		= 0;
		$this->form["head"]["errorMessage"] = "";
		if( is_array($this->form["cols"]) ) { 
			foreach( $this->form["cols"] as &$colObj ) {
				$this->validate( $colObj );
			}
		} else {
			$this->form["head"]["error"] 		= 0;
			$this->form["head"]["errorMessage"] =  LANG::words("no change need to save", $lang);;
		}
	}
	
	public function validate(&$colObj) {
		$lang = $this->form["head"]["lang"];
		$colObj["value"] = str_replace(array("undefined", "null"), array("",""), $colObj["value"]);
		$colObj["value"] = trim($colObj["value"]);
		$colObj["error"] 		= 0;
		$colObj["errorMessage"] = "";
		
		
		switch( strtolower($colObj["coltype"]) ) {
			case "bool":
			case "checkbutton":
				$colObj["value"] = $colObj["value"]?$colObj["value"]:0;
				break;
			case "radio":
			case "radiolist":
				$colObj["value"] = $colObj["value"]?$colObj["value"]:"";
				break;
			case "checkbox":
			case "checklist":
				$colObj["value"] = $colObj["value"]?$colObj["value"]:"";
				break;
			case "editor":
				$colObj["value"] = $colObj["value"]?$colObj["value"]:"";
				break;
			case "hidden":	
			case "select":	
			case "textarea":	
				$colObj["value"] = $colObj["value"]?$colObj["value"]:"";
				break;
			case "password":	
				$password_confirm   = SEARCH::colVal( $this->form["cols"], array("coltype"=>"password_confirm") );
				$colObj["value"] = $colObj["value"]?$colObj["value"]:"";
				if( $colObj["value"] != $password_confirm ) {
					$msg = "'" . $colObj["colname"] . "' " . LANG::words("password_not_match", $lang);
					SEARCH::writeErr($this->form["head"], $colObj, $msg);
				}
				break;

			case "password_confirm":	
				$password   = SEARCH::colVal( $this->form["cols"], array("coltype"=>"password") );
				$colObj["value"] = $colObj["value"]?$colObj["value"]:"";
				if( $colObj["value"] != $password ) {
					$msg = "'" . $colObj["colname"] . "' " . LANG::words("password_not_match", $lang);
					SEARCH::writeErr($this->form["head"], $colObj, $msg);
				}
				break;

			case "date":	
				$colObj["datatype"] = "DATE";
				$colObj["value"] 	= $colObj["value"]?$colObj["value"]:"";
				break;

			case "time":	
				$colObj["datatype"] = "TIME";
				$colObj["value"] 	= $colObj["value"]?$colObj["value"]:"";
				break;
			case "datetime":	
				$colObj["value"] = $colObj["value"] == "0000-00-00 00:00"?"":$colObj["value"];
				$colObj["datatype"] = "DATETIME";
				$colObj["value"] 	= $colObj["value"]?$colObj["value"]:"";
				break;

			case "ymd":	
				$colObj["datatype"] = "number";
				$colObj["value"] 	= $colObj["value"]?$colObj["value"]:"";
				break;

			default:	
				$colObj["value"] = $colObj["value"]?$colObj["value"]:"";
				break;
				
		}
		
		$len = mb_strlen(trim( $colObj["value"] ));
		
		if( $len <=0 && $colObj["notnull"]=="1" ) {
			$msg = "'" . $colObj["colname"] . "' " . LANG::words("required_col", $lang);
			SEARCH::writeErr($this->form["head"], $colObj, $msg);
		}
		
		if($len > 0 && $colObj["min"]!="") {
			if( floatval($colObj["value"]) < floatval($colObj["min"]) ) {
				$msg = "'" . $colObj["colname"] . "'(" . floatval($colObj["value"]) . ") " . LANG::words("out_of_range", $lang, $colObj["min"], $colObj["max"]?$colObj["max"]:"Max");
				SEARCH::writeErr($this->form["head"], $colObj, $msg);
			}
		}

		if($len > 0 && $colObj["max"]!="") {
			if( floatval($colObj["value"]) > floatval($colObj["max"]) ) {
				$msg =  "'" . $colObj["colname"] . "'(" . floatval($colObj["value"]) . ") " . LANG::words("out_of_range", $lang, $colObj["min"]?$colObj["min"]:"Min", $colObj["max"]);
				SEARCH::writeErr($this->form["head"], $colObj, $msg);
			}
		}
		
		if($len > 0 && $len > $colObj["maxlength"] && $colObj["maxlength"]>0) {
			$msg =  "'" . $colObj["colname"] . "' " . LANG::words("over_max_length", $lang, $len, $colObj["maxlength"]);
			SEARCH::writeErr($this->form["head"], $colObj, $msg);
		}

		if($len > 0 && $len < $colObj["minlength"] && $colObj["minlength"]>0) {
			$msg =  "'" . $colObj["colname"] . "' " . LANG::words("less_min_length", $lang, $len, $colObj["minlength"]);
			SEARCH::writeErr($this->form["head"], $colObj, $msg);
		}
		

		if($len > 0 && $colObj["datatype"] != "" ) {
			if( !preg_match( SEARCH::$DATATYPE[ strtoupper($colObj["datatype"]) ], $colObj["value"]) ) {
				$msg =   "'" . $colObj["colname"] . "' " . LANG::words("invalid_type", $lang, $colObj["datatype"]);
				SEARCH::writeErr($this->form["head"], $colObj, $msg);
			}        
		} 

       if( strtoupper($colObj["datatype"]) == "NUMBER" && $colObj["value"]=="") $colObj["value"]="0";
	}
	
}
?>
