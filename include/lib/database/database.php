<?php
/***********************************************************************************************/
/*																							   */
/***********************************************************************************************/
interface iSQL {
	public function open();
	public function select_db($db);	
	public function close();

	public function query($query);
	public function fetch($rs);			
	public function rows($rs);
	public function cols($rs);


	public function row_nums($rs);
	public function col_nums($rs);
	public function cols_info($rs);
	
	public function exists($sql);
	
	public function insert();
	public function update();
	public function delete();
	public function detach();
	
	public function quote($val);
}

/***********************************************************************************************/
/*																							   */
/***********************************************************************************************/
class cMYSQL implements iSQL {
	public 	$error 	= null;

	private $link 	= null;
	
	public function __construct() {
		// initialize error object;
		$this->error = new cERR();

		//call connection open if parameters exists
		$pnum 	= func_num_args();
		$params	= func_get_args();
		switch($pnum) {
			case 3:
				$this->__open($params[0], $params[1], $params[2]);
				break;
			case 4:
				$this->__open($params[0], $params[1], $params[2]);
				$this->select_db($params[3]);
				break;
			default:
				break;
		}
	}
	
	public function __destruct() {
		$this->close();
	}
	
	public function open() {
		$pnum 	= func_num_args();
		$params	= func_get_args();
		switch($pnum) {
			case 3:
				$this->__open($params[0], $params[1], $params[2]);
				break;
			case 4:
				$this->__open($params[0], $params[1], $params[2]);
				$this->select_db($params[3]);
				break;
			default:
				break;
		}
	}
	
	public function select_db($db) {
		if($this->link) {
			$db_selected = mysql_select_db($db, $this->link);
			if (!$db_selected) {
				  $this->error->set(3003, mysql_error());
				  throw $this->error;
			}
		} else {
			$this->error->set(3001, "connection is not available before select database");
			throw $this->error;
		}
	}

	public function close() {
		if ($this->link) {
			mysql_close($this->link);
			$this->link = null;
		}
	}
	
	public function query($query) {
		if($this->link) {
			$rs = mysql_query($query, $this->link);
			if(!$rs) {
				$err_msg = "NO:[" . mysql_errno($this->link) . "] Message:[" . mysql_error($this->link) . "] Query:[" . $query . "]";
				$this->error->set(3002, $err_msg);
				throw $this->error; 
			}
			return $rs;
		} else {
			  $this->error->set(3001, "connection is not available before excute query");
			  throw $this->error;
		}
	}
	
	public function row_nums($rs) {
		if($rs) {
			return mysql_num_rows($rs);
		} else {
			$this->error->set(3004, "rowset is not available for row_nums");
			throw $this->error;
		}
	}
	
	public function col_nums($rs) {
		if($rs) {
			return mysql_num_fields($rs);
		} else {
			$this->error->set(3004, "rowset is not available for col_nums");
			throw $this->error;
		}
	}

	public function cols_info($rs) {
		if($rs) {
			$fields = array();
			$i = 0;
			while ( $i < $this->col_nums($rs) ) {
				$finfo 			= mysql_fetch_field($rs, $i);
				$field 			= array();
				$field["name"] 	=  $finfo->name;
				$field["table"] =  $finfo->table;
				$field["length"]=  $finfo->length;
				$field["flag"] 	=  $finfo->flags;
				$field["type"] 	=  $finfo->type;
				$fields[] = $field;
				$i++;	
			}
			return $fields;
		} else {
			$this->error->set(3004, "rowset is not available for cols_info");
			throw $this->error;
		}
	}
	

		
	public function fetch($rs) {
		if($rs) {
			$row = mysql_fetch_assoc($rs);
			return $row;
		} else {
			$this->error->set(3004, "rowset is not available for fetch");
			throw $this->error;
		}
	}

    
	public function rows($rs) {
		if($rs) {
			$rows 	= array();
			$cnt 	= 0;
			$fields	= $this->cols($rs);		
			while( $row = $this->fetch($rs) ) {
				foreach( $fields as $field ) {
					$rows[$cnt][$field] = $this->unquote($row[$field]);
				}
				$cnt++;
			}
			mysql_data_seek($rs,0);
			return $rows;
		} else {
			$this->error->set(3004, "rowset is not available for rows");
			throw $this->error;
		}
	}


	public function rows_lang($rs, $lang) {
		if($rs) {
			$rows 	= array();
			$cnt 	= 0;
			$fields	= $this->cols($rs);		
			while( $row = $this->fetch($rs) ) {
				foreach( $fields as $field ) {
					$rows[$cnt][$field] = LANG::trans($this->unquote($row[$field]), $lang);
				}
				$cnt++;
			}
			mysql_data_seek($rs,0);
			return $rows;
		} else {
			$this->error->set(3004, "rowset is not available for rows");
			throw $this->error;
		}
	}
	
	public function cols($rs) {
		if($rs) {
			$fields = array();
			$i = 0;
			while ( $i < $this->col_nums($rs) ) {
				$finfo = mysql_fetch_field($rs, $i);
				$fields[] = $finfo->name;
				$i++;	
			}
			return $fields;
		} else {
			$this->error->set(3004, "rowset is not available for cols");
			throw $this->error;
		}
	}
	
	public function exists($sql) {
		$rs = $this->query($sql);
		if( $this->row_nums($rs) > 0 ) { 
			return true;
		} else { 
			return false;
		}
	}

	public function hasRow() {
		$pnum 	= func_num_args();
		$params	= func_get_args();
		
		$table = $params[0];
		$criteria = "";
		if(is_array($params[1])) {
			foreach($params[1] as $key=>$val) {
				$criteria .= ($criteria==""?"":" AND ") . $key . " = '" . trim($val) . "'";
			}
		} else {
			$criteria = "id = '" . trim($params[1]) . "'";
		}
		
		$query = "SELECT 0 FROM $table WHERE $criteria";
        //echo "query : $query";	
		return $this->exists($query);
	}

	
	public function insert() {
		$pnum 			= func_num_args();
		$params			= func_get_args();
		$table 			= $params[0];
		$field_array 	= $params[1];
		
		$fields = "";
		$values = "";
		foreach($field_array as $key=>$val) {
			$fields .= ($fields==""?$key: ", " . $key); 
			$val = $this->quote($val);
			$values .= ($values==""?"":", ") . "'" . $val . "'"; 
		}
		$query = "INSERT INTO " . $table . " (" . $fields . ") VALUES (" . $values . ")";
		//echo "\nquery:" . $query;
		$this->query($query);
		$insert_id = mysql_insert_id($this->link);
		return $insert_id;
	}

	public function insert_raw() {
		$pnum 			= func_num_args();
		$params			= func_get_args();
		$table 			= $params[0];
		$field_array 	= $params[1];
		
		$fields = "";
		$values = "";
		foreach($field_array as $key=>$val) {
			$fields .= ($fields==""?$key: ", " . $key); 
			//$val = $val;
			$values .= ($values==""?"":", ") . "'" . $val . "'"; 
		}
		$query = "INSERT INTO " . $table . " (" . $fields . ") VALUES (" . $values . ")";
		//echo "\nquery:" . $query;
		$this->query($query);
		$insert_id = mysql_insert_id($this->link);
		return $insert_id;
	}
	
	public function getID() {
		$insert_id = mysql_insert_id($this->link);
		return $insert_id;
	}

	public function getVal() {
		$pnum 	= func_num_args();
		$params	= func_get_args();
		
		$table = $params[0];
		$criteria = "";
		if(is_array($params[2])) {
			foreach($params[2] as $key=>$val) {
				$criteria .= ($criteria==""?"":" AND ") . $key . " = '" . trim($val) . "'";
			}
		} else {
			$criteria = "id = '" . trim($params[2]) . "'";
		}
		$col = $params[1];
		$query = "SELECT $col FROM $table WHERE $criteria";	
		$result = $this->query($query);
		$row = $this->fetch($result);
		return $row[$col];
	}

	public function select() {
		$pnum 	= func_num_args();
		$params	= func_get_args();
		
		$table = $params[0];
		$col = $params[1];
        $colstr = "";
        if(is_array($col)) {
            foreach($col as $ff) {
                $colstr .= ($colstr==""?"":",") . $ff; 
            }
        } else {
            $colstr = $col;
        }
        
        $orderby = $params[3]?$params[3]:"";
		if($orderby!="") $orderby = " ORDER BY " . $orderby;
        $criteria = "";
		if(is_array($params[2])) {
			foreach($params[2] as $key=>$val) {
				$criteria .= ($criteria==""?"":" AND ") . $key . " = '" . trim($val) . "'";
			}
		} else {
			$criteria = "id = '" . trim($params[2]) . "'";
		}


		$query = "SELECT $colstr FROM $table WHERE $criteria $orderby";	

		$result = $this->query($query);
		return $result;
	}


	public function update() {
		$pnum 	= func_num_args();
		$params	= func_get_args();

		$table 			= $params[0];
		$field_array 	= $params[2];
		
		$criteria = "";
		if(is_array($params[1])) {
			foreach($params[1] as $key=>$val) {
				$criteria .= ($criteria==""?"":" AND ") . $key . " = '" . trim($val) . "'";
			}
		} else {
			$criteria = "id = '" . trim($params[1]) . "'";
		}
		
		$fields_update = "";
		foreach($field_array as $key=>$val) {
				$val = $this->quote($val);
				$fields_update .= ($fields_update==""?"":", ") . $key . " = '" . $val . "'";
		}	
		$query = "UPDATE " . $table . " SET " . $fields_update . " WHERE " . $criteria . ";";
		//echo "\nquery:" . $query . "\n";
		$this->query($query);
	}
	
	public function delete() {
		$pnum 	= func_num_args();
		$params	= func_get_args();

		$table 			= $params[0];
		$criteria = "";
		if(is_array($params[1])) {
			foreach($params[1] as $key=>$val) {
				$criteria .= ($criteria==""?"":" AND ") . $key . " = '" . trim($val) . "'";
			}
		} else {
			$criteria = "id = '" . trim($params[1]) . "'";
		}
		$query = "DELETE FROM " . $table . " WHERE " . $criteria . ";";
		//echo "\nquery:" . $query . "\n";
		$this->query($query);
	}

	public function detach() {
		$pnum 	= func_num_args();
		$params	= func_get_args();

		$table 			= $params[0];
		$criteria = "";
		if(is_array($params[1])) {
			foreach($params[1] as $key=>$val) {
				$criteria .= ($criteria==""?"":" AND ") . $key . " = '" . trim($val) . "'";
			}
		} else {
			$criteria = "id = '" . trim($params[1]) . "'";
		}
		$query = "UPDATE " . $table . " SET deleted = 1 WHERE " . $criteria . ";";
		//echo "\nquery:" . $query . "\n";
		$this->query($query);
	}
	
	public function quote($val) {
		if($this->link) {
			$new_val = mysql_real_escape_string(trim($val), $this->link);
			return $new_val;
		} else {
			$this->error->set(3001, "connection is not available before excute quote");
			throw $this->error;
		}
	}
	
    public function unquote($val) {
        return str_replace(array('\"', "\'"), array('"',"'"), $val);
    }

	//private method to support
	private function __open($host, $user, $pwd) {
		$this->link = mysql_connect($host, $user, $pwd); 
		if(!$this->link)  {
			  $this->error->set(3001, mysql_error());
			  throw $this->error;
		} else {
			//mysql_query('SET NAMES utf8', $this->link);
		}
	}
	
	public function phone($phone_col, $phone_str ) {
		return "replace(replace(replace($phone_col,' ',''),'-',''),'.','') = '" . str_replace(array(" ","-","."), array("","",""), $phone_str ) . "'";
	}
}

/***********************************************************************************************/
/*																							   */
/***********************************************************************************************/
class cTYPE {
	static public function nltobr( $str ) {
		return str_replace(array("\n", "\r", " "), array("<br>", "<br>", "&nbsp;"), $str);
	}
	static public function brtonl( $str ) {
		return str_replace(array("<br>", "<br>", "&nbsp;"), array("\n", "\r", " "),  $str);
	}
	static public function datetoint($dt) {
		$dt 			= trim($dt);
		$dt_arr 		= explode(" ",$dt);
		$date_part 	= $dt_arr[0];
		$time_part	= $dt_arr[1];
		$ampm_part	= $dt_arr[2];
		
		if(strpos($date_part, "/") != false) {
			$sp = "/";
		} elseif(strpos($date_part, "-") != false) {
			$sp = "-";
		} else {
			//$sp = " ";
			return 0;
		}
		// deal with date part
		$ddd = explode($sp, $date_part);
		$yy_digit = intval($ddd[0]);
		$nn_digit = intval($ddd[1])>1?intval($ddd[1]):1;
		$dd_digit = intval($ddd[2])>1?intval($ddd[2]):1;
		// deal with time part
		$ttt = explode(":", $time_part);
		$mm_digit = intval($ttt[1]);
		$hh_digit = intval($ttt[0]);
		$ss_digit = floatval($ttt[2]);
		// deal with time AM/PM situation
		if( 
			( 
				strpos(strtoupper($ttt[0]),"PM") != false 
				|| 
				strpos(strtoupper($ttt[1]),"PM") != false 
				|| 	
				strpos(strtoupper($ttt[2]),"PM") != false 
				|| 
				strtoupper($ampm_part) == "PM"				
			) 
			&& $hh_digit <= 12 
		)  $hh_digit += 12;
		
		$mk_tt = mktime($hh_digit, $mm_digit, $ss_digit, $nn_digit, $dd_digit, $yy_digit);
		return $mk_tt;
	}
	static public function inttodate() {
		$pnum 	= func_num_args();
		$params	= func_get_args();
		if( $params[0] > 0 ) {
			$dateff = "Y-m-d H:i:s";
			if($pnum > 1) $dateff = $params[1];
			return date($dateff, $params[0]);
		} else {
			return "";
		}
	}
	
	static public function dhms() {
		global $GLang;
		$pnum 	= func_num_args();
		$params	= func_get_args();
		$t = intval($params[0]);
		if($t > 0) {
			$dd = floor($t/(3600 *24));
			$dd_str = $dd<=0?"":$dd . ($dd<2?" ". LANG::words("day", $GLang)." ":" ". LANG::words("days", $GLang)." ");
			$hh = floor( ($t % (3600 * 24)) / 3600 );
			$hh_str = $hh>0?substr("0".$hh, -2).":":"";
			$mm = floor(($t % 3600) / 60);
			$mm_str = $mm>0?substr("0".$mm, -2).":":"00:";
			$ss = $t % 60;
			$ss_str = $ss>0?substr("0".$ss, -2):"00";
			return $dd_str . $hh_str. $mm_str. $ss_str;
		} else {
			if($pnum > 1 && $params[1]) 
				return ""; 
			else  
				return "00:00";
			
		}
	}

	static public function ydhms() {
		global $GLang;
		$pnum 	= func_num_args();
		$params	= func_get_args();
		$t = intval($params[0]);
		if($t > 0) {
			$yy = floor($t/(3600 * 24 * 365));
			$yy_str = $yy<=0?"": $yy . ($yy<2?LANG::words("year", $GLang):LANG::words("years", $GLang));
			$t = $t % (360 * 24 * 365);
			$dd = floor($t/(3600 *24));
			$dd_str = $dd<=0?"":$dd . ($dd<2?LANG::words("day", $GLang):LANG::words("days", $GLang));
			$hh = floor( ($t % (3600 * 24)) / 3600 );
			$hh_str = $hh>0?substr("0".$hh, -2).":":"";
			$mm = floor(($t % 3600) / 60);
			$mm_str = $mm>0?substr("0".$mm, -2).":":"00:";
			$ss = $t % 60;
			$ss_str = $ss>0?substr("0".$ss, -2):"00";
			if($yy_str) return $yy_str . $dd_str;
			if($dd_str) return $dd_str;
			if($hh_str) return $hh_str. $mm_str. $ss_str;
		} else {
			if($pnum > 1 && $params[1]) 
				return ""; 
			else  
				return "00:00";
			
		}
	}
	
	static public function phone($str) {
		$tp = str_replace(array(" ", "-", ",", "(", ")","."), array("","","","","",""), trim($str));
		if( strlen($tp) == 10 ) {
			return substr($tp,0,3) . "-" . substr($tp,3,3) . "-" . substr($tp,6,4);
		} elseif( strlen($tp) == 11 ){
			return substr($tp,0,1) . "-" . substr($tp,1,3) . "-" . substr($tp,4,3) . "-" . substr($tp,7,4);
		} else {
		    return $str;
		}
	}
	static public function toDate($yy, $mm, $dd) {
		if( ($yy==0 && $mm==0 && $dd==0) || ($yy=="" && $mm=="" && $dd=="") ) {
			return "";
		} else {
			if( $yy=="" || $yy<=0 ) $yy = "xxxx";
			if( $mm=="" || $mm<=0 ) $mm = "xx";
			if( $dd=="" || $dd<=0 ) $dd = "xx";
			return $yy . "-" . substr( "0".$mm, -2) . "-" . substr("0".$dd, -2);	
		}
	}
}



/***********************************************************************************************/
/*																							   */
/***********************************************************************************************/
class cERR extends Exception {
	private $errMsg = array (
		3001=>"Database Connection: %s.",
		3002=>"Database Query: %s.",
		3003=>"Database Select: %s.",
		3004=>"Database Rowset: %s.",
		3005=>"Database Row: %s.",
		3006=>"Table Object: %s.",
		
		4001=>"Sorry, we are unable to process your input for the following reasons:\n\n%s",
		9001=>"Session has expired, please login again.",
		9002=>"You don't have right to access our database."
	);
	
	private $errFields = array();
	function __construct() {    // params[0] = errorCode,  params[1] = errorMessage
		$pnum 	= func_num_args();
		$params	= func_get_args();
		switch($pnum) {
			case 1:
				parent::__construct("", $params[0]);
				break;
			case 2:
				parent::__construct($params[1], $params[0]);
				break;
		}
	}
	
	// used to format error message;
	public function getMsg() {
		$msg = '';
		switch($this->getCode()) {
			case 3001:
				$msg = sprintf($this->errMsg[$this->code], $this->getMessage());
				break;
			case 3002:
				$msg = sprintf($this->errMsg[$this->code], $this->getMessage());
				break;
			case 3003:
				$msg = sprintf($this->errMsg[$this->code], $this->getMessage());
				break;
			case 3004:
				$msg = sprintf($this->errMsg[$this->code], $this->getMessage());
				break;
			case 3005:
				$msg = sprintf($this->errMsg[$this->code], $this->getMessage());
				break;
			case 3006:
				$msg = sprintf($this->errMsg[$this->code], $this->getMessage());
				break;
			case 4001:
				$msg = sprintf($this->errMsg[$this->code], $this->getMessage());
				break;
			case 9001:
				$msg = sprintf($this->errMsg[$this->code], $this->getMessage());
				break;
			case 9002:
				$msg = sprintf($this->errMsg[$this->code], $this->getMessage());
				break;
			default:
				$msg = sprintf("%s", $this->getMessage());
				break;
		}
		return $msg;
	}
	
	public function set() {
		$pnum 	= func_num_args();
		$params	= func_get_args();

		$this->code 	= $params[0];
		$this->message	= $params[1];
		
		if($params[2])  $this->errFields = $params[2];
	}
	
	public function getField() {
		return $this->errFields;
	}
	
	public function detail() {
		$msg = array();
		$msg["errorCode"] 		= $this->getCode();
		$msg["errorMessage"] 	= $this->getMsg();
		$msg["errorLine"] 		= sprintf("File[file:%s, line:%s]", $this->getFile(), $this->getLine());
		$msg["errorField"]		= $this->errFields;
		/*
		echo "<pre>";
		print_r($msg);
		echo "</pre>";
		*/
		return $msg;
	}
}


class SEARCH {
    static public function join($sp, $from, $to) {
         return $to . ( $to==""?"":($from==""?"":"$sp ") ) . $from;   
    }

    static public function concat( &$to, $sp, $from) {
         $to .= ( $to==""?"":($from==""?"":"$sp ") ) . $from;   
    }
	
	// not public use
	static public function array_col( $arr, $colName ) {
		$rarr = array();
		if( is_array($arr) ) {
			for($i = 0; $i < count($arr); $i++ ) {
				$rarr[$i] = $arr[$i][$colName];
			}
		}
		return $rarr;
	}
	
	// not public use
	static public function array_find( $arr, $colVal ) {
		$idx = -1;
		if( is_array($arr) ) {
			for($i = 0; $i < count($arr); $i++ ) {
				if( $arr[$i] == $colVal )  {
					$idx = $i;
					break;
				}
			}
		}
		return $idx;
	}

	// $arr = [{col:"first_name", val:"Will"},{col:"last_name", val:"Liu"}]
	//  SEARCH::colVal( $arr, "first_name" ); OR SEARCH::colVal( $arr, array("col"=>"first_name" ) 
	static public function colVal( $cols, $colName ) {
		$idx = -1;
		if( is_array($colName) ) {
			$colKey = key($colName);
			$colArr = SEARCH::array_col( $cols, $colKey );
			$idx = SEARCH::array_find( $colArr, $colName[$colKey] );
		} else {
			$colArr = SEARCH::array_col( $cols, "col" );
			$idx = SEARCH::array_find( $colArr, $colName );
		}
		$colVal = "";
		if( $idx >= 0 )
			$colVal = $cols[$idx]["value"];
		return $colVal;
	}

	static public function colObj( $cols, $colName ) {
		$idx = -1;
		if( is_array($colName) ) {
			$colKey = key($colName);
			$colArr = SEARCH::array_col( $cols, $colKey );
			$idx = SEARCH::array_find( $colArr, $colName[$colKey] );
		} else {
			$colArr = SEARCH::array_col( $cols, "col" );
			$idx = SEARCH::array_find( $colArr, $colName );
		}
		$colObj = array();
		if( $idx >= 0 )
			$colObj = $cols[$idx];
		return $colObj;
	}
	
    static public function checkCollect($db, $lang, $checkSchema) {
        $ret_list = array();
        $ltable     = $checkSchema["ltable"];
		$col 		= $checkSchema["col"];
		if($ltable !="" ) {
				$stitle 	= LANG::langCol("title", 	$lang);
				$sdesc 		= LANG::langCol("desc", 	$lang);
				$query      = "SELECT a.id, a.$stitle as title, a.$sdesc as description 
												FROM website_basic_info a INNER JOIN website_basic_table b ON (a.ref_id = b.id) 
												WHERE a.deleted <> 1 AND a.status =1 AND b.table_name='" . $ltable . "' ORDER BY a.orderno DESC, title ASC;";
				//echo "query: $query";
				$result     = $db->query($query);
				$cnt        = 0;
				while( $row = $db->fetch($result)) {
					$ret_list[$cnt]["key"]      = $row["id"];     
					$ret_list[$cnt]["title"]    = LANG::trans($row["title"],		$lang);
					$ret_list[$cnt]["desc"]     = LANG::trans($row["description"],	$lang);     
					$cnt++;
				} 
		} else  {
				$stable     = $checkSchema["stable"];
				$scol       = $checkSchema["scol"]; 
				$stitle     = $checkSchema["stitle"]; 
				$sdesc      = $checkSchema["sdesc"]; 

				$sref  	 	= $checkSchema["sref"];
				$sval      	= $checkSchema["sval"]; 
				
				$fff_str	= "";
				if($scol!="") 	SEARCH::concat($fff_str, ",", "$stable.$scol as scol");
				if($stitle!="") SEARCH::concat($fff_str, ",", "$stable.$stitle as title");
				if($sdesc!="") 	SEARCH::concat($fff_str, ",", "$stable.$sdesc as description");

				$scriteria  = "";
				if($sref!="" && $sval!="") $scriteria  = " AND $stable.$sref = '" . $sval . "' ";

				if($stable != "") {
					$query      = "SELECT $fff_str FROM $stable WHERE deleted <> 1 AND status = 1 $scriteria ORDER BY orderno DESC, title ASC;";
					//echo "query: $query";
					$result     = $db->query($query);
					$cnt        = 0;
					while( $row = $db->fetch($result)) {
						$ret_list[$cnt]["key"]      = $row["scol"];     
						$ret_list[$cnt]["title"]    = LANG::trans($row["title"], 		$lang);
						$ret_list[$cnt]["desc"]     = LANG::trans($row["description"],	$lang);     
						$cnt++;
					} 
				}
		}
        return $ret_list;
    }

    static public function checkValue($db, $lang, $checkSchema, $val ) {
        $ret_value 	= array();
		$ret_value["value"] 	= "";
		$ret_value["valuetext"] = "";

		$col 		= $checkSchema["col"];
		$rtable 	= $checkSchema["rtable"];
		$rcol	 	= $checkSchema["rcol"];

        $ltable      = $checkSchema["ltable"];

		$stable     = $checkSchema["stable"];
		$scol       = $checkSchema["scol"]; 
		$stitle     = $checkSchema["stitle"]; 
		$sdesc      = $checkSchema["sdesc"]; 

		$sref  	 	= $checkSchema["sref"];
		$sval      	= $checkSchema["sval"]; 

		if( is_array( $val ) ) {
			if( count( $val ) > 1 ) {
				$rval 		= $val;
				$resultvv 	= $db->select( $rtable, $col, $rval);
			} else {
				$rval 		= $val[key($val)];
				$resultvv 	= $db->select( $rtable, $col, array($rcol=>$rval));
			}
		} else {
			$rval 		= $val;
			$resultvv 	= $db->select( $rtable, $col, array($rcol=>$rval));
		}
		
		$rowsvv	= $db->rows($resultvv); 
		$ck_arr		= array();
		foreach($rowsvv as $rowvv) {
			$ck_arr[] = $rowvv[$col];
		}
		sort($ck_arr);
		$ck_val = implode(",", $ck_arr);
		
		$ret_value["value"] = $ck_val;
		
		
		if($ltable !="" ) {
				$ccc    	= $ret_value["value"]?"AND a.id IN (" . $ret_value["value"] . ")": "AND a.id IN (-1)";
				$stitle 	= LANG::langCol("title", 	$lang);
				$query      = "SELECT a.id, a.$stitle as title 
												FROM website_basic_info a INNER JOIN website_basic_table b ON (a.ref_id = b.id) 
												WHERE a.deleted <> 1 AND a.status =1 AND b.table_name='" . $table . "' $ccc ORDER BY a.orderno DESC, title ASC;";
				//echo "query: $query";
				$result     = $db->query($query);
				while( $row = $db->fetch($result)) {
					$ret_value["valuetext"] .= ($ret_value["valuetext"]?", ":"") . LANG::trans($row["title"], $lang); 
				} 

		} else  {
				$stable     = $checkSchema["stable"];
				$scol       = $checkSchema["scol"]; 
				$stitle     = $checkSchema["stitle"]; 
				$sdesc      = $checkSchema["sdesc"]; 

				$sref  	 	= $checkSchema["sref"];
				$sval      	= $checkSchema["sval"]; 
				
				$fff_str	= "";
				if($scol!="") 	SEARCH::concat($fff_str, ",", "$stable.$scol as scol");
				if($stitle!="") SEARCH::concat($fff_str, ",", "$stable.$stitle as title");

				$scriteria  = "";
				if($sref!="" && $sval!="") SEARCH::concat($scriteria, " ", " AND $stable.$sref = '" . $sval . "' ");
				$ccc    	= $ret_value["value"]?"AND $scol IN (" . $ret_value["value"] . ")": "AND $scol IN (-1)";
				SEARCH::concat($scriteria, " ", $ccc);

				if($stable != "") {
					$query      = "SELECT $fff_str FROM $stable WHERE deleted <> 1 AND status = 1 $scriteria ORDER BY orderno DESC, title ASC;";
					//echo "query: $query";
					$result     = $db->query($query);
					while( $row = $db->fetch($result)) {
						$ret_value["valuetext"] .= ($ret_value["valuetext"]?", ":"") . LANG::trans($row["title"], $lang); 
					} 
				}
			}
        return $ret_value;
    }

    static public function checkSave($db, $lang, $checkSchema, $refval, $checkval ) {
        $ret_value 	= array();
		$col 		= $checkSchema["col"];
		$rtable 	= $checkSchema["rtable"];
		$rcol	 	= $checkSchema["rcol"];

		if( $rtable != "" && $rcol != "" ) {
			if( is_array( $refval ) ) {
				if( count( $refval ) > 1 ) {
					$rval 		= $refval;
					$db->delete($rtable, $rval);
				} else {
					$rval 		= $refval[key($refval)];
					$db->delete( $rtable, array($rcol=>$rval));
				}
			} else {
				$rval 		= $refval;
				$db->delete( $rtable, array($rcol=>$rval));
			}
	
			$ck_val = $checkval?$checkval:"";
			if($ck_val != "") {
				$ck_arr = explode(",", $ck_val);
				foreach( $ck_arr as $ck ) {
					$fields = array();
					if( is_array( $refval ) ) {
						if( count( $refval ) > 1 ) {
							$rval 			= $refval;
							$fields 		= $rval;
						} else {
							$rval 			= $refval[key($refval)];
							$fields[$rcol]	= $rval;	
						}
					} else {
						$rval 				= $refval;
						$fields[$rcol]		= $rval;	
					}

					$fields[$col] = $ck;
					$db->insert($rtable, $fields);
				}
			}
		}
		
		$ret_value = SEARCH::checkValue($db, $lang, $checkSchema, $refval);
    	return $ret_value;
	}

    static public function radioValue($db, $lang, $checkSchema, $val ) {
        $ret_value 	= array();
		$ret_value["value"] 	= $val?$val:0;
		$ret_value["valuetext"] = "";

		$col 		= $checkSchema["col"];

        $ltable      = $checkSchema["ltable"];

		$stable     = $checkSchema["stable"];
		$scol       = $checkSchema["scol"]; 
		$stitle     = $checkSchema["stitle"]; 
		$sdesc      = $checkSchema["sdesc"]; 

		$sref  	 	= $checkSchema["sref"];
		$sval      	= $checkSchema["sval"]; 

		if($ltable !="" ) {
				$ccc    	= $ret_value["value"]?"AND a.id = '" . $ret_value["value"] . "'": "AND a.id = ''";
				$stitle 	= LANG::langCol("title", 	$lang);
				$query      = "SELECT a.id, a.$stitle as title 
												FROM website_basic_info a INNER JOIN website_basic_table b ON (a.ref_id = b.id) 
												WHERE a.deleted <> 1 AND a.status =1 AND b.table_name='" . $table . "' $ccc ORDER BY a.orderno DESC, title ASC;";
				//echo "query: $query";
				$result     = $db->query($query);
				while( $row = $db->fetch($result)) {
					$ret_value["valuetext"] .= ($ret_value["valuetext"]?", ":"") . LANG::trans($row["title"], $lang); 
				} 

		} else  {
				$stable     = $checkSchema["stable"];
				$scol       = $checkSchema["scol"]; 
				$stitle     = $checkSchema["stitle"]; 
				$sdesc      = $checkSchema["sdesc"]; 

				$sref  	 	= $checkSchema["sref"];
				$sval      	= $checkSchema["sval"]; 
				
				$fff_str	= "";
				if($scol!="") 	SEARCH::concat($fff_str, ",", "$stable.$scol as scol");
				if($stitle!="") SEARCH::concat($fff_str, ",", "$stable.$stitle as title");

				$scriteria  = "";
				if($sref!="" && $sval!="") SEARCH::concat($scriteria, " ", " AND $stable.$sref = '" . $sval . "' ");
				$ccc    	= $ret_value["value"]?"AND $scol = '" . $ret_value["value"] . "'": "AND $scol = ''";
				SEARCH::concat($scriteria, " ", $ccc);

				if($stable != "") {
					$query      = "SELECT $fff_str FROM $stable WHERE deleted <> 1 AND status = 1 $scriteria ORDER BY orderno DESC, title ASC;";
					//echo "query: $query";
					$result     = $db->query($query);
					while( $row = $db->fetch($result)) {
						$ret_value["valuetext"] .= ($ret_value["valuetext"]?", ":"") . LANG::trans($row["title"], $lang); 
					} 
				}
			}
        return $ret_value;
    }
	
	static public function writeErr(&$head, &$colObj, $msg) {
		$colObj["error"] 			= 1;
		$colObj["errorMessage"] 	.= ($colObj["errorMessage"]==""?"":"\n") . $msg;
		$head["error"] 				= 1;
		$head["errorMessage"] 		.= ($head["errorMessage"]==""?"":"\n") . $msg;
	}
	
	static public  $DATATYPE = array(
			"EMAIL"		=> "/^(?:\w+\.?)*\w+@(?:\w+\.)+\w+$/i", 	//Email :  abd_dkkd.dkfd-dkd@hotmail.adk-dkdk.gc.ca
			"EMAILS"	=> "/^(?:(?:\w+\.?)*\w+@(?:\w+\.)+\w+(\s*,\s*)?)+$/i",  		// a@a.com, b@b.com, c@c.com
			"ALL"		=> "/^(?:.|\s)*$/i", 						// all chars
			"CHAR"		=> "/^.*$/i", 								// all chars except \n\r 
			"LETTER"	=> "/^[a-zA-Z'\",\._ ]*$/i",
			"NUMBER"	=> "/^[+-]?[0-9]*(?:(?:\.)[0-9]+)?(,)?$/i",
			"DATE"		=> "/^(?:19|20)[0-9]{2}(?:-|\/)(?:1[0-2]|0?[1-9])(?:-|\/)(?:3[01]|[0-2]?[0-9])$/i",
			"TIME"		=> "/^((2[0-3]|[01]?[0-9])(:[0-5]?[0-9](:[0-5]?[0-9])?)?[ ]*(am|pm)?)$/i",
			"DATETIME"	=> "/^(?:19|20)[0-9]{2}(?:-|\/)(?:1[0-2]|0?[1-9])(?:-|\/)(?:3[01]|[0-2]?[0-9])[ ]+((2[0-3]|[01]?[0-9])(:[0-5][0-9](:[0-5][0-9])?)?[ ]*(am|pm)?)$/i"
	);
}
?>
