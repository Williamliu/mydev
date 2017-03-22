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

	public function checkUnique() {
		$pnum 	= func_num_args();
		$params	= func_get_args();
		
		$table = $params[0];
		
		// criteria 
		$criteria = "deleted=0";
		// col[col_name] = value;
		$colVal = $params[1];
		if( is_array($colVal) ) {
			foreach($colVal as $key=>$val) {
				if(trim($val)!="") {
					cTYPE::join($criteria, " AND ", $key . " = '" . trim( $this->quote($val) ) . "'" );
				} else {
					return true;
				}
			}
        } else {
			return true;
        }

		if(is_array($params[2])) {
			foreach($params[2] as $key=>$val) {
				cTYPE::join($criteria, " AND ", $key . " <> '" . trim( $this->quote($val) ) . "'" );
			}
		} else {
			if($params[2]!="") cTYPE::join($criteria, " AND ", $params[2]);
		}

		$query = "SELECT 1 FROM $table WHERE $criteria";	
		//echo "query: $query";
		return !$this->exists($query);
	}

	// (tableName, colsArray, criteriaArray, navi(paging, orderby..) )	
	public function select() {
		$pnum 	= func_num_args();
		$params	= func_get_args();
		
		$table = $params[0];
		
		// select cols 
		$col = $params[1];
        $colstr = "";
        if(is_array($col)) {
            foreach($col as $ff) {
                cTYPE::join($colstr, ",", $ff );
            }
        } else {
            $colstr = $col;
        }

		// criteria 
		$criteria = "1=1";
		if(is_array($params[2])) {
			foreach($params[2] as $key=>$val) {
				cTYPE::join($criteria, " AND ", $key . " = '" . trim( $this->quote($val) ) . "'" );
			}
		} else {
			if($params[2]!="") cTYPE::join($criteria, " AND ", $params[2]);
		}

		// order by 
        $orderby = "";
		if( is_array($params[3]) ) {
			$orderArr = $params[3];
			$orderCol = $orderArr["orderby"]?$orderArr["orderby"]:"";
			$sortBy   = $orderArr["sortby"]?$orderArr["sortby"]:"";
			
			if( $orderCol!="" && $sortBy!="" )
				$orderby = $orderCol . " " . $sortBy;
			elseif($orderCol!="") 
				$orderby = $orderCol . " ASC";
				
		} elseif($params[3]) {
			$orderby = $params[3];
		}
		if($orderby!="") $orderby = " ORDER BY " . $orderby;
        
		// Limit records 
		$limit = "";
		if( is_array($params[3]) ) {
			$navi = $params[3];
			if( $navi["pageno"]>= 1) {
				$limit = "LIMIT " . $navi["pageno"] . ", " . $navi["pagesize"];
			} else {
				$criteria .= ($criteria==""?"":" AND ") . "1=0";
			}
		}

		$query = "SELECT $colstr FROM $table WHERE $criteria $orderby $limit";	
		//echo "query: $query";
		$result = $this->query($query);
		return $result;
	}

	// (tabel, )
	public function insert() {
		$pnum 			= func_num_args();
		$params			= func_get_args();
		$table 			= $params[0];
		$field_array 	= $params[1];
		
		$fields = "";
		$values = "";
		foreach($field_array as $key=>$val) {
			$fields .= ($fields==""?$key: ", " . $key); 
			$values .= ($values==""?"":", ") . "'" . $this->quote($val) . "'"; 
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

	public function update() {
		$pnum 	= func_num_args();
		$params	= func_get_args();

		$table 			= $params[0];
		$field_array 	= $params[2];
		
		$criteria = "";
		if(is_array($params[1])) {
			foreach($params[1] as $key=>$val) {
				cTYPE::join( $criteria, " AND ", $key . " = '" . trim( $this->quote($val) ) . "'");
			}
		} else {
			$criteria = "id = '" . trim( $this->quote($params[1]) ) . "'";
		}
		
		$fields_update = "";
		foreach($field_array as $key=>$val) {
				$val = $this->quote($val);
				cTYPE::join( $fields_update, ", ",  $key . " = '" . $val . "'" );
		}	
		$query = "UPDATE " . $table . " SET " . $fields_update . " WHERE " . $criteria . ";";
		//echo "\nquery:" . $query . "\n";
		$this->query($query);
	}

	public function modify() {   // create if not exists, update if exists, must provide id value
		$pnum 	= func_num_args();
		$params	= func_get_args();

		$table 			= $params[0];
		$field_array 	= $params[2];

		$append_array   = array();
		$criteria = "";
		if(is_array($params[1])) {
			foreach($params[1] as $key=>$val) {
				cTYPE::join( $criteria, " AND ", $key . " = '" . trim( $this->quote($val) ) . "'");
			}
			$append_array = $params[1];
		} else {
			$criteria = "id = '" . trim( $this->quote($params[1]) ) . "'";
			$append_array["id"] = $params[1];
		}
		
		$query = "SELECT 1 FROM $table WHERE $criteria";
		if( $this->exists($query) ) {
			// update case 
			$fields_update = "";
			foreach($field_array as $key=>$val) {
					$val = $this->quote($val);
					cTYPE::join( $fields_update, ", ",  $key . " = '" . $val . "'" );
			}	
			$query = "UPDATE " . $table . " SET " . $fields_update . " WHERE " . $criteria . ";";
			//print_r($params[1]);
			//echo "\nupdate query:" . $query . "\n";
			$this->query($query);
		} else {
			// insert case 
			$field_array = cARRAY::arrayMerge($field_array, $append_array);
			//echo "Insert:\n";
			//print_r($field_array);
			$this->insert($table, $field_array);
		}

	}
	
	public function delete() {
		$pnum 	= func_num_args();
		$params	= func_get_args();

		$table 			= $params[0];
		$criteria = "";
		if(is_array($params[1])) {
			foreach($params[1] as $key=>$val) {
				cTYPE::join( $criteria, " AND ", $key . " = '" . trim( $this->quote($val) ) . "'" );
			}
		} else {
			$criteria = "id = '" . trim( $this->quote($params[1]) ) . "'";
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
				cTYPE::join( $criteria, " AND ", $key . " = '" . trim( $this->quote($val) ) . "'" );
			}
		} else {
			$criteria = "id = '" . trim( $this->quote($params[1]) ) . "'";
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
	
	public function phone($phone_col, $oper, $phone_str) {
		return $this->express($phone_col, $oper, $phone_str, array(",","-","."), "");
	}
	public function express( $p_col, $oper, $p_val, $searchArr, $replaceArr) {
		$colName 	= $p_col;
		$colVal 	= $this->quote($p_val);
		$ret_str 	= $colName . " " . $oper . " '" . $colVal . "'";

		if(is_array($searchArr)) {
			$colNameLevel 	= array();
			$level 			= 0;
			$colNameLevel[$level] = $p_col;
			foreach($searchArr as $sidx=>$searchStr) {
				$level++;
				if( is_array($replaceArr) )
					$colNameLevel[$level] = "replace(" . $colNameLevel[$level-1] . ", '" . $this->quote($searchStr) . "', '"  . $this->quote($replaceArr[$sidx]) . "')";
				else 
					$colNameLevel[$level] = "replace(" . $colNameLevel[$level-1] . ", '" . $this->quote($searchStr) . "', '"  . $this->quote($replaceArr) . "')";
			}
			$colName 	= $colNameLevel[count($colNameLevel)-1];
			$colVal 	= str_replace($searchArr, $replaceArr, $p_val);
		} else {
			if( $searchArr!="" ) {
				$colName 	= "replace($p_col, '" . $this->quote($searchArr) . "','" . $this->quote($replaceArr) . "')";	
				$colVal 	= str_replace($searchArr, $replaceArr, $p_val);
			}	
		}

		switch( strtolower($oper) ) {
			case "=":
				$ret_str = $colName . " = " . "'" . $this->quote($colVal) . "'";
				break;
			case "like":
				$ret_str = $colName . " LIKE " . "'%" . $this->quote($colVal) . "%'";
				break;
		}
		return $ret_str;
	}
	/*************** Relational Table Functions ***********************************/
	public function tree(&$table) {
		switch( $table["metadata"]["type"] ) {
			case 2: 
				break;
			case 3:
				break;
			case 4:
				break;
		}
		$otable	= $table["metadata"][$tableLevel];
		// 1. select cols 
        $colstr = cACTION::buildSelect($otable);
	
		// 2. join table 
		$joinLink 		= $otable["name"] . " " . $otable["type"];
	
		$fk_criteria = "";
		foreach($otable["fkeys"] as $pk) {
			if( $parent_id ) {
				cTYPE::join($fk_criteria, " AND ",  $otable["type"] . ".$pk='" . $this->quote($parent_id) . "'");
			} else {
				cTYPE::join($fk_criteria, " AND ",  $otable["type"] . ".$pk='0'");
			}
		}

		// 3. create criteria  include  primary_key criteria
		$criteria = "";
		cTYPE::join($criteria, " AND ", $otable["type"] . ".deleted=0");
		cTYPE::join($criteria, " AND ", $fk_criteria);
		cTYPE::join($criteria, " AND ", $table["criteria"]);

		// 4. update navi first, and create orderby and limitation string 
		$orderByLimit = "ORDER BY orderno DESC";

		// 5.  completed  select query string 
		$query = "SELECT $colstr FROM $joinLink WHERE $criteria $orderByLimit";	
 
		//Debug Query 
		if(DEBUG) { $table["query"] = $query; $table["criteria"] = $criteria; }

		$result = $this->query($query);
		$table["rows"] = $this->rows($result);
	}
	
	public function treeNodes(&$table, $tableLevel, $parent_id) {
		$otable	= $table["metadata"][$tableLevel];
		// 1. select cols 
        $colstr = cACTION::buildSelect($otable);
	
		// 2. join table 
		$joinLink 		= $otable["name"] . " " . $otable["type"];
	
		$fk_criteria = "";
		foreach($otable["fkeys"] as $pk) {
			if( $parent_id ) {
				cTYPE::join($fk_criteria, " AND ",  $otable["type"] . ".$pk='" . $this->quote($parent_id) . "'");
			} else {
				cTYPE::join($fk_criteria, " AND ",  $otable["type"] . ".$pk='0'");
			}
		}

		// 3. create criteria  include  primary_key criteria
		$criteria = "";
		cTYPE::join($criteria, " AND ", $otable["type"] . ".deleted=0");
		cTYPE::join($criteria, " AND ", $fk_criteria);
		cTYPE::join($criteria, " AND ", $table["criteria"]);

		// 4. update navi first, and create orderby and limitation string 
		$orderByLimit = "ORDER BY orderno DESC";

		// 5.  completed  select query string 
		$query = "SELECT $colstr FROM $joinLink WHERE $criteria $orderByLimit";	
 
		//Debug Query 
		if(DEBUG) { $table["query"] = $query; $table["criteria"] = $criteria; }

		$result = $this->query($query);
		$table["rows"] = $this->rows($result);
	}

	public function one(&$table) {
		$ptable	= $table["metadata"]["p"];

		// 1. select cols 
        $colstr = cACTION::buildSelect($ptable);

		// 2. join table 
		$pk_criteria 	= "";
		$joinLink 		= $ptable["name"] . " " . $ptable["type"];
		foreach($ptable["keys"] as $pk) {
			$pv = trim($ptable["colmeta"][$pk]["defval"]);
			if( $pv ) {
				cTYPE::join($pk_criteria, " AND ",  $ptable["type"] . ".$pk='" . $this->quote($pv) . "'");
			} else {
				// if not select one,  then return all sets; cTYPE::join($pk_criteria, " AND ", "1=0");
			}
		}

		// 3. create criteria  include  primary_key criteria
		$criteria = "";
		cTYPE::join($criteria, " AND ", $ptable["type"] . ".deleted=0");
		cTYPE::join($criteria, " AND ", $pk_criteria);
		cTYPE::join($criteria, " AND ", $table["criteria"]);

		// 4. update navi first, and create orderby and limitation string 
		$query = "SELECT COUNT(1) AS CNT FROM $joinLink WHERE $criteria";
		$this->navi($query, $table);
		$navi = $table["navi"];
		$orderByLimit = cACTION::orderByLimit($navi);

		// 5.  completed  select query string 
		$query = "SELECT $colstr FROM $joinLink WHERE $criteria $orderByLimit";	
 
		//Debug Query 
		if(DEBUG) { $table["query"] = $query; $table["criteria"] = $criteria; }

		$result = $this->query($query);
		$table["rows"] = $this->rows($result);
	}

	public function saveone(&$table) {
		// join tables 
		$ptable 	= $table["metadata"]["p"];
		$errMsg 	= array();
		foreach( $table["rows"] as &$row ) {
			switch( $row["rowstate"] ) {
				case 0:
					break;
				case 1: 
					if( $table["rights"]["save"] ) {
						$keyCols = cACTION::getKeys($table, "p", $row);
						if($row["error"]["errorCode"] <= 0) {
							$updCols = cACTION::getUpdateCols($table, "p", $row);
							if(	count($updCols["fields"]) >0 ) {
								$updCols["fields"] = cARRAY::arrayMerge($updCols["fields"], $ptable["update"]);
								$updCols["fields"] = cARRAY::arrayMerge($updCols["fields"], array("last_updated"=>time()));
								$this->update($ptable["name"], $keyCols["keys"], $updCols["fields"]);
							} 
						} 
					} else {
						$errMsg["save"] 				= "You don't have right to change data.";
						$table["success"] 				= 0;
						$row["error"]["errorCode"] 		= 2;
						$row["error"]["errorMessage"] 	= $errMsg["save"];

						if( $errMsg["saveFlag"]!=1 ) {
							$table["error"]["errorCode"] 	= 1;
							cTYPE::join($table["error"]["errorMessage"],"\n", $errMsg["save"]);
						}
						$errMsg["saveFlag"] = 1;
					}
					break;
				case 2:
					if( $table["rights"]["add"] ) {
						$dbCols = cACTION::getInsertCols($table, "p", $row);
						if(	count($dbCols["fields"]) >0 ) {
							$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], $ptable["insert"]);
							$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], array("created_time"=>time(), "deleted"=>0));
							$insertID = $this->insert($ptable["name"], $dbCols["fields"]);
							cACTION::setKeys($table, "p", $row, $insertID);
						}
					} else {
						$errMsg["add"] 					= "You don't have right to add new record.";
						$table["success"] 				= 0;
						$row["error"]["errorCode"] 		= 2;
						$row["error"]["errorMessage"] 	= $errMsg["add"];

						if( $errMsg["addFlag"]!=1 ) {
							$table["error"]["errorCode"] 	= 1;
							cTYPE::join($table["error"]["errorMessage"],"\n", $errMsg["add"]);
						}
						$errMsg["addFlag"] = 1;
					}
					break;
				case 3:
					if( $table["rights"]["delete"] ) {
						$keyCols = cACTION::getKeys($table, "p", $row);
						if($row["error"]["errorCode"] <= 0) {
							$this->update($ptable["name"], $keyCols["keys"], array("last_updated"=>time()));
							$this->detach($ptable["name"], $keyCols["keys"]);
						}
					} else {
						$errMsg["delete"] 				= "You don't have right to delete the record.";
						$table["success"] 				= 0;
						$row["error"]["errorCode"] 		= 2;
						$row["error"]["errorMessage"] 	= $errMsg["delete"];

						if( $errMsg["deleteFlag"]!=1 ) {
							$table["error"]["errorCode"] 	= 1;
							cTYPE::join($table["error"]["errorMessage"],"\n", $errMsg["delete"]);
						}
						$errMsg["deleteFlag"] = 1;
					}
					break;
			}
		}

	}

	public function one2one(&$table) {
		$ptable = $table["metadata"]["p"];
		$stable = $table["metadata"]["s"];

		// 1. select cols
		$colstr = cACTION::buildSelect($ptable);
		cTYPE::join( $colstr, ", ", cACTION::buildSelect($stable) );

		// 2. join table
		$joinOn = "";
		$pk_criteria = "";  // must have deleted column 
		foreach($ptable["keys"] as $pidx=>$pkey) {
			$pkeyDBCol = $ptable["type"] . "." . $pkey;
			$skeyDBCol = $stable["type"] . "." . $stable["keys"][$pidx];
			cTYPE::join($joinOn, " AND ", "$pkeyDBCol=$skeyDBCol");

			//important: if primary table key has defval,  only select defval record
			$pkeyVal = trim($ptable["colmeta"][$pkey]["defval"]);
			if( $pkeyVal ) {
				cTYPE::join($pk_criteria, " AND ", "$pkeyDBCol='" . $this->quote($pkeyVal) . "'");
			} else {
				// no default value, list all primary table rows
			}
		}

		// one to one using LEFT JOIN 
		// if try to search by primary key. important to use LEFT JOIN, because master information already there.
		// important for html one record form,  match=0,   set primary id to defval 
		$pname = $ptable["name"] . " " . $ptable["type"];
		$sname = $stable["name"] . " " . $stable["type"];
		if( $table["navi"]["match"]=="1" ) 
			$joinLink = "$pname INNER JOIN $sname ON ( $joinOn )";
		else 
			$joinLink = "$pname LEFT JOIN $sname ON ( $joinOn )";
		

		// 3. create criteria 
		$criteria = "";
		cTYPE::join($criteria, " AND ", $ptable["type"] . ".deleted=0");
		cTYPE::join($criteria, " AND ", $stable["type"] . ".deleted=0");
		cTYPE::join($criteria, " AND ", $pk_criteria);
		cTYPE::join($criteria, " AND ", $table["criteria"]);


		// 4. update navi first, and create orderby and limitation string 
		$query = "SELECT COUNT(1) AS CNT FROM $joinLink WHERE $criteria";
		$this->navi($query, $table);
		$navi = $table["navi"];
		$orderByLimit = cACTION::orderByLimit($navi);

		$query = "SELECT $colstr FROM $joinLink WHERE $criteria $orderByLimit";

		//Debug Query 
		if(DEBUG) { $table["query"] = $query; $table["criteria"] = $criteria; }

		$result = $this->query($query);
		$table["rows"] = $this->rows($result);
	}

	public function saveone2one(&$table) {
		$ptable = $table["metadata"]["p"];
		$stable = $table["metadata"]["s"];
		$errMsg = array();
		foreach( $table["rows"] as &$row ) {
			switch( $row["rowstate"] ) {
				case 0:
					break;
				case 1: 
					if( $table["rights"]["save"] ) { 
						$p_keyCols = cACTION::getKeys($table, "p", $row);
						if($row["error"]["errorCode"] <= 0) {
								$p_updCols = cACTION::getUpdateCols($table, "p", $row);
								if(	count($p_updCols["fields"]) >0 ) {
									$p_updCols["fields"] = cARRAY::arrayMerge($p_updCols["fields"], $ptable["update"]);
									$p_updCols["fields"] = cARRAY::arrayMerge($p_updCols["fields"], array("last_updated"=>time()));
									$this->update($ptable["name"], $p_keyCols["keys"], $p_updCols["fields"]);
								} 
								
								$relationCol = cACTION::getRelation($row);
								if($relationCol) {
									if($relationCol["value"]) {
										cACTION::syncKeys($table, "s", $row);
										$s_keyCols = cACTION::getKeys($table, "s", $row);
										$s_updCols = cACTION::getUpdateCols($table, "s", $row);
										if(count($s_updCols)>0) {
											$s_updCols["fields"] = cARRAY::arrayMerge($s_updCols["fields"], $stable["update"]);
											$s_updCols["fields"] = cARRAY::arrayMerge($s_updCols["fields"], array("last_updated"=>time(),"deleted"=>0));
											$this->modify($stable["name"], $s_keyCols["keys"], $s_updCols["fields"]);
										}
									} else {
										//in case of update:  js will not update value if success, so relation key will not updated the value.
										cACTION::syncKeys($table, "s", $row);   
										$s_keyCols = cACTION::getKeys($table, "s", $row);
										$this->update($stable["name"], $s_keyCols["keys"], array("last_updated"=>time()));
										$this->detach($stable["name"], $s_keyCols["keys"]);
									}
								}
						}
					} else {
						$errMsg["save"] 				= "You don't have right to change data.";
						$table["success"] 				= 0;
						$row["error"]["errorCode"] 		= 2;
						$row["error"]["errorMessage"] 	= $errMsg["save"];

						if( $errMsg["saveFlag"]!=1 ) {
							$table["error"]["errorCode"] 	= 1;
							cTYPE::join($table["error"]["errorMessage"],"\n", $errMsg["save"]);
						}
						$errMsg["saveFlag"] = 1;
					}
					break;

				case 2:
					if( $table["rights"]["add"] ) {
						if($row["error"]["errorCode"] <= 0) {
							$p_insCols = cACTION::getInsertCols($table, "p", $row);
							if(	count($p_insCols["fields"]) >0 ) {
								$p_insCols["fields"] = cARRAY::arrayMerge($p_insCols["fields"], $ptable["insert"]);
								$p_insCols["fields"] = cARRAY::arrayMerge($p_insCols["fields"], array("created_time"=>time()));
								$insertID = $this->insert($ptable["name"], $p_insCols["fields"]);
								cACTION::setKeys($table, "p", $row, $insertID);
							}

							$relationCol = cACTION::getRelation($row);
							//print_r($relationCol);
							if($relationCol) {
								if($relationCol["value"]) {
									cACTION::syncKeys($table, "s", $row);
									$s_keyCols = cACTION::getKeys($table, "s", $row);
									$s_updCols = cACTION::getInsertCols($table, "s", $row);
									//print_r($s_keyCols);
									//print_r($s_updCols);
									if(count($s_updCols["fields"])>0) {
										$s_updCols["fields"] = cARRAY::arrayMerge($s_updCols["fields"], $stable["update"]);
										$s_updCols["fields"] = cARRAY::arrayMerge($s_updCols["fields"], array("last_updated"=>time(),"deleted"=>0));
										$this->modify($stable["name"], $s_keyCols["keys"], $s_updCols["fields"]);
									} 
								} else {
									// insert case of uncheck relation:  we don't syncKeys to second table, js will update value with sent value.
								}
							}
						}

					} else {
						$errMsg["add"] 					= "You don't have right to add new record.";
						$table["success"] 				= 0;
						$row["error"]["errorCode"] 		= 2;
						$row["error"]["errorMessage"] 	= $errMsg["add"];;

						if( $errMsg["addFlag"]!=1 ) {
							$table["error"]["errorCode"] 	= 1;
							cTYPE::join($table["error"]["errorMessage"],"\n", $errMsg["add"]);
						}
						$errMsg["addFlag"] = 1;
					}
					break;
				case 3:
					if( $table["rights"]["delete"] ) {
						$p_keyCols = cACTION::getKeys($table, "p", $row);
						if($row["error"]["errorCode"] <= 0) {
							$this->update($ptable["name"], $p_keyCols["keys"], array("last_updated"=>time()));
							$this->detach($ptable["name"], $p_keyCols["keys"]);
						}
					} else {
						$errMsg["delete"] 				= "You don't have right to delete the record.";
						$table["success"] 				= 0;
						$row["error"]["errorCode"] 		= 2;
						$row["error"]["errorMessage"] 	= $errMsg["delete"];

						if( $errMsg["deleteFlag"]!=1 ) {
							$table["error"]["errorCode"] 	= 1;
							cTYPE::join($table["error"]["errorMessage"],"\n", $errMsg["delete"]);
						}
						$errMsg["deleteFlag"] = 1;
					}
					break;
			}
		}

	}

	public function one2many(&$table) {
		$ptable = $table["metadata"]["p"];
		$stable = $table["metadata"]["s"];
		
		// 1. crreate primary information 
		$pcolstr = cACTION::buildSelect($ptable);
		$criteria_primary = "1=1";
		foreach($ptable["keys"] as $pkey) {
			$pkeyDBCol 	= $ptable["type"] . "." . $pkey;
			$pkeyVal 	= trim($ptable["colmeta"][$pkey]["defval"]);
			cTYPE::join($criteria_primary, " AND ", "$pkeyDBCol='" . $this->quote($pkeyVal) . "'");
		}
		$pname 				= $ptable["name"] . " " . $ptable["type"];
		$query_primary 		= "SELECT $pcolstr FROM $pname WHERE $criteria_primary";
		$result_primary 	= $this->query($query_primary);
		$table["primary"] 	= $this->rows($result_primary);
		//Debug Query 
		if(DEBUG) { $table["query_primary"] = $query_primary; $table["criteria_prmiary"] = $criteria_primary; }
		if( $this->row_nums($result_primary) <= 0 ) {
			$table["success"] 					= 0;  // flag entire success
			$table["error"]["errorCode"] 		= 1;  // flag entire table error 
			$table["error"]["errorMessage"] 	= "Primary data is missing.";
		} 

		//important for m2m:  if primary record not found,  return 0 rows
		$pk_criteria = "";
		if( $this->row_nums($result_primary) <= 0 )  cTYPE::join($pk_criteria, " AND ", "1=0");


		// 2. select cols 
		$colstr = cACTION::buildSelect($ptable);
		cTYPE::join( $colstr, ", ", cACTION::buildSelect($stable) );

		// 3. join table
		$pname 			= $ptable["name"] . " " . $ptable["type"];
		$sname 			= $stable["name"] . " " . $stable["type"];
		$joinOn 		= "";
		foreach($ptable["keys"] as $pidx=>$pkey) {
			$pkeyDBCol = $ptable["type"] . "." . $pkey;
			$skeyDBCol = $stable["type"] . "." . $stable["fkeys"][$pidx];
			cTYPE::join($joinOn, " AND ", "$pkeyDBCol=$skeyDBCol");

			//important: if primary table key has defval,  only select defval record
			$pkeyVal = trim($ptable["colmeta"][$pkey]["defval"]);
			if( $pkeyVal ) {
				cTYPE::join($pk_criteria, " AND ", "$pkeyDBCol='" . $this->quote($pkeyVal) . "'");
			} else {
				// no default value, primary rows should be none
				cTYPE::join($pk_criteria, " AND ", "1=0");
			}
		}

		$sk_criteria = "";
		foreach($stable["keys"] as $sidx=>$skey) {
			$skeyDBCol 	= $stable["type"] . "." . $skey;
			$skeyVal 	= trim($stable["colmeta"][$skey]["defval"]);
			if( $skeyVal ) {
				cTYPE::join($sk_criteria, " AND ", "$skeyDBCol='" . $this->quote($skeyVal) . "'");
			}		
		}

		// one to many,  using inner join 
		$joinLink = "$pname INNER JOIN $sname ON ( $joinOn )";

		// 4. create criteria 
		$criteria = "";
		cTYPE::join($criteria, " AND ", $ptable["type"] . ".deleted=0");
		cTYPE::join($criteria, " AND ", $stable["type"] . ".deleted=0");
		cTYPE::join($criteria, " AND ", $pk_criteria);
		cTYPE::join($criteria, " AND ", $sk_criteria);
		cTYPE::join($criteria, " AND ", $table["criteria"]);

		// 5. update navi first, and create orderby and limitation string 
		$query = "SELECT COUNT(1) AS CNT FROM $joinLink WHERE $criteria";
		$this->navi($query, $table);
		$navi = $table["navi"];
		$orderByLimit = cACTION::orderByLimit($navi);

		$query = "SELECT $colstr FROM $joinLink WHERE $criteria $orderByLimit";

		//Debug Query 
		if(DEBUG) { $table["query"] = $query; $table["criteria"] = $criteria; }

		$result = $this->query($query);
		$table["rows"] = $this->rows($result);
	}

	public function saveone2many(&$table) {
		$ptable = $table["metadata"]["p"];
		$stable = $table["metadata"]["s"];

		// 1. crreate primary information 
		$pcolstr = cACTION::buildSelect($ptable);
		$criteria_primary = "1=1";
		foreach($ptable["keys"] as $pkey) {
			$pkeyDBCol 	= $ptable["type"] . "." . $pkey;
			$pkeyVal 	= trim($ptable["colmeta"][$pkey]["defval"]);
			cTYPE::join($criteria_primary, " AND ", "$pkeyDBCol='" . $this->quote($pkeyVal) . "'");
			cTYPE::join($criteria_primary, " AND ", $ptable["type"] . ".deleted=0");
		}
		$pname 				= $ptable["name"] . " " . $ptable["type"];
		$query_primary 		= "SELECT $pcolstr FROM $pname WHERE $criteria_primary";
		$result_primary 	= $this->query($query_primary);
		$table["primary"] 	= $this->rows($result_primary);
		//Debug Query 
		if(DEBUG) { $table["query_primary"] = $query_primary; $table["criteria_prmiary"] = $criteria_primary; }

		//important for m2m:  if primary record not found,  return 0 rows
		if( $this->row_nums($result_primary) <= 0 ) {
			$table["success"] 					= 0;
			$table["error"]["errorCode"] 		= 1;
			$table["error"]["errorMessage"] 	= "Primary data is missing.";
		} 

		$errMsg = array();
		foreach( $table["rows"] as &$row ) {
			switch( $row["rowstate"] ) {
				case 0:
					break;
				case 1: 
					if( $table["rights"]["save"] ) {
						if($table["error"]["errorCode"]<=0) {
							$p_keyCols = cACTION::getKeys($table, "p", $row);
							if($row["error"]["errorCode"] <= 0) {
									$p_updCols = cACTION::getUpdateCols($table, "p", $row);
									if(	count($p_updCols["fields"]) >0 ) {
										$p_updCols["fields"] = cARRAY::arrayMerge($p_updCols["fields"], $ptable["update"]);
										$p_updCols["fields"] = cARRAY::arrayMerge($p_updCols["fields"], array("last_updated"=>time()));
										$this->update($ptable["name"], $p_keyCols["keys"], $p_updCols["fields"]);
									} 
							}

							$s_keyCols = cACTION::getKeys($table, "s", $row);
							if($row["error"]["errorCode"] <= 0) {
									cACTION::syncKeys($table, "s", $row);  // update second table fkeys, fkeys not passed from client side 
									$s_updCols = cACTION::getUpdateCols($table, "s", $row);
									if(	count($s_updCols["fields"]) >0 ) {
										$s_updCols["fields"] = cARRAY::arrayMerge($s_updCols["fields"], $stable["update"]);
										$s_updCols["fields"] = cARRAY::arrayMerge($s_updCols["fields"], array("last_updated"=>time()));
										$this->update($stable["name"], $s_keyCols["keys"], $s_updCols["fields"]);
									} 
							}
						}
					} else {
						$errMsg["save"] 				= "You don't have right to change data.";
						$table["success"] 				= 0;
						$row["error"]["errorCode"] 		= 2;
						$row["error"]["errorMessage"] 	= $errMsg["save"];

						if( $errMsg["saveFlag"]!=1 ) {
							$table["error"]["errorCode"] = 1;
							cTYPE::join($table["error"]["errorMessage"],"\n", $errMsg["save"]);
						}
						$errMsg["saveFlag"] = 1;
					}
					break;
				case 2:
					if( $table["rights"]["add"] ) {
						if($table["error"]["errorCode"]<=0) {
							$p_keyCols = cACTION::getKeys($table, "p", $row);
							if($row["error"]["errorCode"] <= 0) {
									$p_updCols = cACTION::getUpdateCols($table, "p", $row);
									if(	count($p_updCols["fields"]) >0 ) {
										$p_updCols["fields"] = cARRAY::arrayMerge($p_updCols["fields"], $ptable["update"]);
										$p_updCols["fields"] = cARRAY::arrayMerge($p_updCols["fields"], array("last_updated"=>time()));
										$this->update($ptable["name"], $p_keyCols["keys"], $p_updCols["fields"]);
									} 
							}

							if($row["error"]["errorCode"] <= 0) {
									cACTION::syncKeys($table, "s", $row); // update second table fkeys 
									$s_insCols = cACTION::getInsertCols($table, "s", $row);
									if(	count($s_insCols["fields"]) >0 ) {
										$s_insCols["fields"] = cARRAY::arrayMerge($s_insCols["fields"], $stable["insert"]);
										$s_insCols["fields"] = cARRAY::arrayMerge($s_insCols["fields"], array("created_time"=>time(),"deleted"=>0));
										$insertID = $this->insert($stable["name"], $s_insCols["fields"]);
										cACTION::setKeys($table, "s", $row, $insertID);
									} 
							}
						}
					} else {
						$errMsg["add"] 					= "You don't have right to add new record.";
						$table["success"] 				= 0;
						$row["error"]["errorCode"] 		= 2;
						$row["error"]["errorMessage"] 	= $errMsg["add"];;

						if( $errMsg["addFlag"]!=1 ) {
							$table["error"]["errorCode"] = 1;
							cTYPE::join($table["error"]["errorMessage"],"\n", $errMsg["add"]);
						}
						$errMsg["addFlag"] = 1;
					}
					break;
				case 3:
					if( $table["rights"]["delete"] ) {
						if($row["error"]["errorCode"]<=0) {
							$s_keyCols = cACTION::getKeys($table, "s", $row);
							if($row["error"]["errorCode"] <= 0) {
								$this->update($stable["name"], $s_keyCols["keys"], array("last_updated"=>time()));
								$this->detach($stable["name"], $s_keyCols["keys"]);
							}
						}
					} else {
						$errMsg["delete"] 				= "You don't have right to delete the record.";
						$table["success"] 				= 0;
						$row["error"]["errorCode"] 		= 2;
						$row["error"]["errorMessage"] 	= $errMsg["delete"];

						if( $errMsg["deleteFlag"]!=1 ) {
							$table["error"]["errorCode"] = 1;
							cTYPE::join($table["error"]["errorMessage"],"\n", $errMsg["delete"]);
						}
						$errMsg["deleteFlag"] = 1;
					}
					break;
			}
		}

	}

	public function many2many(&$table) {
		$ptable = $table["metadata"]["p"];
		$stable = $table["metadata"]["s"];
		$mtable = $table["metadata"]["m"];

		// 1. crreate primary information 
		$pcolstr = cACTION::buildSelect($ptable);
		$criteria_primary = "1=1";
		foreach($ptable["keys"] as $pkey) {
			$pkeyDBCol 	= $ptable["type"] . "." . $pkey;
			$pkeyVal 	= trim($ptable["colmeta"][$pkey]["defval"]);
			cTYPE::join($criteria_primary, " AND ", "$pkeyDBCol='" . $this->quote($pkeyVal) . "'");
			cTYPE::join($criteria_primary, " AND ", $ptable["type"] . ".deleted=0");
		}
		$pname 				= $ptable["name"] . " " . $ptable["type"];
		$query_primary 		= "SELECT $pcolstr FROM $pname WHERE $criteria_primary";
		$result_primary 	= $this->query($query_primary);
		$table["primary"] 	= $this->rows($result_primary);
		//Debug Query 
		if(DEBUG) { $table["query_primary"] = $query_primary; $table["criteria_prmiary"] = $criteria_primary; }
		if( $this->row_nums($result_primary) <= 0 ) {
			$table["success"] 					= 0;  // flag entire success
			$table["error"]["errorCode"] 		= 1;  // flag entire table error 
			$table["error"]["errorMessage"] 	= "Primary data is missing.";
		} 

		$pk_criteria = "";
		//important for m2m:  if primary record not found,  return 0 rows
		if( $this->row_nums($result_primary) <= 0 )  cTYPE::join($pk_criteria, " AND ", "1=0");

		// 2.1  handle  primary and medium table relation 
		$mmjoinOn = "";
		foreach($ptable["keys"] as $pidx=>$pkey) {
			$pkeyDBCol = $ptable["type"] . "." . $pkey;
			$mpkeyDBCol = "mm." . $mtable["keys"][$pidx];
			cTYPE::join( $mmjoinOn, " AND ", "$pkeyDBCol=$mpkeyDBCol"); 
			cTYPE::join( $mmjoinOn, " AND ", $ptable["type"] . ".deleted=0"); 	// important: primary table, must have deleted column  
			cTYPE::join( $mmjoinOn, " AND ", "mm.deleted=0"); 					// important: medium table, must have deleted column  

			$pkeyVal = trim($ptable["colmeta"][$pkey]["defval"]);
			if( $pkeyVal ) {
				cTYPE::join($mmjoinOn, " AND " , "$pkeyDBCol='" . $this->quote($pkeyVal) . "'");
			} else {
				//if defval is empty, rows of both primary and return should be none
				cTYPE::join($pk_criteria, " AND " ,		"1=0");
			}
		}

		// 2.2 p & m select cols 
        $mmcolstr = cACTION::buildSelect($ptable);
		cTYPE::join( $mmcolstr, ", ", cACTION::buildSelect($mtable, "mm") );
		// many to many,  s left join ( select * from p inner join m  ) c  
		$mmname = $mtable["name"] . " mm";
		$mmjoinLink = "SELECT $mmcolstr FROM $pname INNER JOIN $mmname ON ( $mmjoinOn )";

		// 2.3 s table select cols
        $scolstr = cACTION::buildSelect($stable);

		// 2.4 s join on 
		$sjoinOn 		= "";
		$sk_criteria 	= "";
		foreach($stable["keys"] as $sidx=>$skey) {
			$skeyDBCol 	= $stable["type"] . "." . $skey;
			$mskeyDBCol = $mtable["type"] . "." . $mtable["colmeta"][$mtable["fkeys"][$sidx]]["name"];  // very important to use  js colname 
			// c.ctime  sub query keep the javascript colname 
			cTYPE::join($sjoinOn, " AND ",  "$skeyDBCol=$mskeyDBCol"); 
			$skeyVal = trim($stable["colmeta"][$skey]["defval"]);
			if($skeyVal) {
				cTYPE::join($sk_criteria, " AND ", "$skeyDBCol='" . $this->quote($skeyVal) . "'");
			}
		}

		// 2.5 s criteria 
		$criteria = "";
		cTYPE::join($criteria, " AND ", $stable["type"] . ".deleted=0");
		cTYPE::join($criteria, " AND ", $pk_criteria);
		cTYPE::join($criteria, " AND ", $sk_criteria);
		// important:  medium table filter  must use   colObj.name  not  database column name.  because   (select dbcol as jscolname mtable mm) m ; finally convert dbCol to client side column name
		cTYPE::join($criteria, " AND ", $table["criteria"]);

		// 3.  join p, s , m  all tables 
		// many to many,  b left join ( select * from a inner join m  ) c  
		$mname = "(" . $mmjoinLink . ") " . $mtable["type"];
		$sname = $stable["name"] . " " . $stable["type"];
		if( $table["navi"]["match"]=="1" ) 
			$sjoinLink = "SELECT $scolstr, m.* FROM $sname  INNER JOIN $mname ON ( $sjoinOn ) WHERE $criteria";
		else 
			$sjoinLink = "SELECT $scolstr, m.* FROM $sname  LEFT JOIN  $mname ON ( $sjoinOn ) WHERE $criteria";


		// 4. final query 
		$joinLink = $sjoinLink;

		// 5. update navi first, and create orderby and limitation string 
		$query = "SELECT COUNT(1) AS CNT FROM ($joinLink) t";
		$this->navi($query, $table);
		$navi = $table["navi"];
		$orderByLimit = cACTION::orderByLimit($navi);

		// 6. final query
		$query = "$joinLink $orderByLimit";
		//Debug Query 
		if(DEBUG) { $table["query"] = $query; $table["criteria"] = $criteria; }
		
		$result = $this->query($query);
		$table["rows"] = $this->rows($result);

		//7. add primary table info to every row. M2M ,  primary row must be one row 
		foreach( $table["primary"][0] as $pkey=>$pval) {
			foreach($table["rows"] as &$trow ) {
				$trow[$pkey] = $pval; 
			}
		}
	}

	public function savemany2many(&$table) {
		$ptable = $table["metadata"]["p"];
		$stable = $table["metadata"]["s"];
		$mtable = $table["metadata"]["m"];

		// 1. crreate primary information 
		$pcolstr = cACTION::buildSelect($ptable);
		$criteria_primary = "1=1";
		foreach($ptable["keys"] as $pkey) {
			$pkeyDBCol 	= $ptable["type"] . "." . $pkey;
			$pkeyVal 	= trim($ptable["colmeta"][$pkey]["defval"]);
			cTYPE::join($criteria_primary, " AND ", "$pkeyDBCol='" . $this->quote($pkeyVal) . "'");
			cTYPE::join($criteria_primary, " AND ", $ptable["type"] . ".deleted=0");
		}
		$pname 				= $ptable["name"] . " " . $ptable["type"];
		$query_primary 		= "SELECT $pcolstr FROM $pname WHERE $criteria_primary";
		$result_primary 	= $this->query($query_primary);
		$table["primary"] 	= $this->rows($result_primary);
		//Debug Query 
		if(DEBUG) { $table["query_primary"] = $query_primary; $table["criteria_prmiary"] = $criteria_primary; }
		$pk_criteria = "";
		//important for m2m:  if primary record not found,  return 0 rows
		if( $this->row_nums($result_primary) <= 0 ) {
			$table["success"] 					= 0;  // flag entire success
			$table["error"]["errorCode"] 		= 1;  // flag entire table error 
			$table["error"]["errorMessage"] 	= "Primary data is missing.";
		} 


		$errMsg = array();
		foreach( $table["rows"] as &$row ) {
			switch( $row["rowstate"] ) {
				case 0:
					break;
				case 1: 
					if( $table["rights"]["save"] ) {
						if($table["error"]["errorCode"]<=0) {
							$p_keyCols = cACTION::getKeys($table, "p", $row);
							if($row["error"]["errorCode"] <= 0) {
									$p_updCols = cACTION::getUpdateCols($table, "p", $row);
									if(	count($p_updCols["fields"]) >0 ) {
										$p_updCols["fields"] = cARRAY::arrayMerge($p_updCols["fields"], $ptable["update"]);
										$p_updCols["fields"] = cARRAY::arrayMerge($p_updCols["fields"], array("last_updated"=>time()));
										$this->update($ptable["name"], $p_keyCols["keys"], $p_updCols["fields"]);
									} 
							}

							$s_keyCols = cACTION::getKeys($table, "s", $row);
							if($row["error"]["errorCode"] <= 0) {
									$s_updCols = cACTION::getUpdateCols($table, "s", $row);
									if(	count($s_updCols["fields"]) >0 ) {
										$s_updCols["fields"] = cARRAY::arrayMerge($s_updCols["fields"], $stable["update"]);
										$s_updCols["fields"] = cARRAY::arrayMerge($s_updCols["fields"], array("last_updated"=>time()));
										$this->update($stable["name"], $s_keyCols["keys"], $s_updCols["fields"]);
									} 
							}
							if($row["error"]["errorCode"] <= 0) {
								$relationCol = cACTION::getRelation($row);
								if($relationCol) {
									cACTION::syncKeys($table, "m", $row);  //ok: need or not need;  update medium table keys fkeys,  
									$m_keyCols = cACTION::getKeys($table, "m", $row);
									$m_updCols = cACTION::getUpdateCols($table, "m", $row);
									if($relationCol["value"]) {
										if(count($m_updCols["fields"])>0) {
											$m_updCols["fields"] = cARRAY::arrayMerge($m_updCols["fields"], $mtable["update"]);
											$m_updCols["fields"] = cARRAY::arrayMerge($m_updCols["fields"], array("last_updated"=>time(),"deleted"=>0));
											$this->modify($mtable["name"], $m_keyCols["keys"], $m_updCols["fields"]);
										}
									} else {
										$this->update($mtable["name"], $m_keyCols["keys"], array("last_updated"=>time()));
										$this->detach($mtable["name"], $m_keyCols["keys"]);
									}
								}
							}
						}
					} else {
						$errMsg["save"] 				= "You don't have right to change data.";
						$table["success"] 				= 0;
						$row["error"]["errorCode"] 		= 2;
						$row["error"]["errorMessage"] 	= $errMsg["save"];

						if( $errMsg["saveFlag"]!=1 ) {
							$table["error"]["errorCode"] = 1;
							cTYPE::join($table["error"]["errorMessage"],"\n", $errMsg["save"]);
						}
						$errMsg["saveFlag"] = 1;
					}
					break;
				case 2:
					if( $table["rights"]["add"] ) {
						if($table["error"]["errorCode"]<=0) {
							$p_keyCols = cACTION::getKeys($table, "p", $row);
							if($row["error"]["errorCode"] <= 0) {
									$p_updCols = cACTION::getUpdateCols($table, "p", $row);
									if(	count($p_updCols["fields"]) >0 ) {
										$p_updCols["fields"] = cARRAY::arrayMerge($p_updCols["fields"], $ptable["update"]);
										$p_updCols["fields"] = cARRAY::arrayMerge($p_updCols["fields"], array("last_updated"=>time()));
										$this->update($ptable["name"], $p_keyCols["keys"], $p_updCols["fields"]);
									} 
							}

							if($row["error"]["errorCode"] <= 0) {
									$s_insCols = cACTION::getInsertCols($table, "s", $row);
									if(	count($s_insCols["fields"]) >0 ) {
										$s_insCols["fields"] = cARRAY::arrayMerge($s_insCols["fields"], $stable["insert"]);
										$s_insCols["fields"] = cARRAY::arrayMerge($s_insCols["fields"], array("created_time"=>time(),"deleted"=>0));
										$insertID = $this->insert($stable["name"], $s_insCols["fields"]);
										cACTION::setKeys($table, "s", $row, $insertID); 
									} 
							}

							if($row["error"]["errorCode"] <= 0) {
								$relationCol = cACTION::getRelation($row);
								if($relationCol) {
									if($relationCol["value"]) {
										cACTION::syncKeys($table, "m", $row);  //ok: need or not need;  update medium table keys fkeys,  
										$m_keyCols = cACTION::getKeys($table, "m", $row); // directly take value from p & s keys 
										$m_updCols = cACTION::getUpdateCols($table, "m", $row);
										if(count($m_updCols)>0) {
											$m_updCols["fields"] = cARRAY::arrayMerge($m_updCols["fields"], $mtable["update"]);
											$m_updCols["fields"] = cARRAY::arrayMerge($m_updCols["fields"], array("last_updated"=>time(),"deleted"=>0));
											$this->modify($mtable["name"], $m_keyCols["keys"], $m_updCols["fields"]);
										}
									}
								}
							}
						}
					} else {
						$errMsg["add"] 					= "You don't have right to add new record.";
						$table["success"] 				= 0;
						$row["error"]["errorCode"] 		= 2;
						$row["error"]["errorMessage"] 	= $errMsg["add"];;

						if( $errMsg["addFlag"]!=1 ) {
							$table["error"]["errorCode"] = 1;
							cTYPE::join($table["error"]["errorMessage"],"\n", $errMsg["add"]);
						}
						$errMsg["addFlag"] = 1;
					}
					break;
				case 3:
					if( $table["rights"]["delete"] ) {
						if($table["error"]["errorCode"]<=0) {
							$m_keyCols = cACTION::getKeys($table, "m", $row);
							if($row["error"]["errorCode"] <= 0) {
								$this->update($mtable["name"], $m_keyCols["keys"], array("last_updated"=>time()));
								$this->detach($mtable["name"], $m_keyCols["keys"]);
							}
							$s_keyCols = cACTION::getKeys($table, "s", $row);
							if($row["error"]["errorCode"] <= 0) {
								$this->update($stable["name"], $s_keyCols["keys"], array("last_updated"=>time()));
								$this->detach($stable["name"], $s_keyCols["keys"]);
							}
						}
					} else {
						$errMsg["delete"] 				= "You don't have right to delete the record.";
						$table["success"] 				= 0;
						$row["error"]["errorCode"] 		= 2;
						$row["error"]["errorMessage"] 	= $errMsg["delete"];

						if( $errMsg["deleteFlag"]!=1 ) {
							$table["error"]["errorCode"] = 1;
							cTYPE::join($table["error"]["errorMessage"],"\n", $errMsg["delete"]);
						}
						$errMsg["deleteFlag"] = 1;
					}
					break;
			}
		}
	}

	// (tableName, criteriaArray, navi(paging, orderby..) )	
	public function navi($query, &$table) {
		$result = $this->query($query);
		$row 	= $this->fetch($result);
		
		$table["navi"]["recordtotal"] 	= $row["CNT"]?$row["CNT"]:0;
		$table["navi"]["pageno"] 		= intval($table["navi"]["pageno"])>0?$table["navi"]["pageno"]:1;
		$table["navi"]["pagesize"] 		= $table["navi"]["pagesize"]>0 && $table["navi"]["pagesize"]<=200?$table["navi"]["pagesize"]:20;
		$table["navi"]["pagetotal"] 	= ceil($table["navi"]["recordtotal"]/$table["navi"]["pagesize"]);

        if( $table["navi"]["pageno"] > $table["navi"]["pagetotal"] ) $table["navi"]["pageno"] = $table["navi"]["pagetotal"];
		$table["navi"]["loading"] = 0;
	}
	
	// one2many, many2many:  we must provide primary table information, if not exists, set error
	public function init4table(&$table) {
		$ptable = $table["metadata"]["p"];

		// 1. crreate primary information 
		$pcolstr = cACTION::buildSelect($ptable);
		$criteria_primary = "1=1";
		foreach($ptable["keys"] as $pkey) {
			$pkeyDBCol 	= $ptable["type"] . "." . $pkey;
			$pkeyVal 	= trim($ptable["colmeta"][$pkey]["defval"]);
			cTYPE::join($criteria_primary, " AND ", "$pkeyDBCol='" . $this->quote($pkeyVal) . "'");
		}
		$pname 				= $ptable["name"] . " " . $ptable["type"];
		$query_primary 		= "SELECT $pcolstr FROM $pname WHERE $criteria_primary";
		$result_primary 	= $this->query($query_primary);
		$table["primary"] 	= $this->rows($result_primary);
		//Debug Query 
		if(DEBUG) { $table["query_primary"] = $query_primary; $table["criteria_prmiary"] = $criteria_primary; }
		if( $this->row_nums($result_primary) <= 0 ) {
			$table["success"] 					= 0;  // flag entire success
			$table["error"]["errorCode"] 		= 1;  // flag entire table error 
			$table["error"]["errorMessage"] 	= "Primary data is missing.";
		} 
	}
	/*************** end of Relational Table Functions ***********************************/
	
}

/***********************************************************************************************/
/*																							   */
/***********************************************************************************************/
class cACTION {
	static public function action($db, &$table ) {
		cACTION::buildColMeta($table); // important
		$table["success"] 	= 1;
		switch( $table["action"] ) {
			case "init":
				$table["rows"] = array();
				if( $table["rights"]["view"] ) {
					cLIST::getList($db, $table);
					cACTION::initTable($db, $table);
				} else {
					$table["success"] = 0;
					$table["error"]["errorCode"]=1;
					$table["error"]["errorMessage"]="You don't have right to view data.";
				}
				break;
			case "get":
				$table["rows"] = array();
				if( $table["rights"]["view"] ) {
					cLIST::getList($db, $table);
					cACTION::getFilters($table);
					cACTION::getRows($db, $table);
				} else {
					$table["success"] = 0;
					$table["error"]["errorCode"]=1;
					$table["error"]["errorMessage"]="You don't have right to view data.";
				}

				break;
			case "save":
				cLIST::getList($db, $table);
				cVALIDATE::validate($table);
				cACTION::checkUniques($db, $table);
				
				cACTION::saveRows($db, $table);
				break;
			case "custom":
				cLIST::getList($db, $table);
				cVALIDATE::validate($table);
				//cACTION::checkUniques($db, $table);
				break;
		}
		cACTION::getRowArray($table);
		$table["success"] = $table["error"]["errorCode"]?0:$table["success"];
	}
	static public function buildColMeta(&$table) {
		foreach($table["cols"] as $colMeta) {
			$table["metadata"][$colMeta["table"]]["colmeta"][$colMeta["col"]]=$colMeta;
			switch($colMeta["coltype"]) {
				case "checkbox":
				case "checkbox1":
				case "checkbox2":
				case "checkbox3":
					$table["metadata"][$colMeta["table"]]["checkboxCols"][] = $colMeta["col"];
					break;
				default:
					$table["metadata"][$colMeta["table"]]["selectCols"][] = $colMeta["col"];
					break;
			}
		}
	}
	static public function buildSelect($otable, $otype="") {
        $colstr = "";
		foreach($otable["selectCols"] as $oCol) {
			$dbColName 	= $otable["colmeta"][$oCol]["name"]?$otable["colmeta"][$oCol]["name"]:$oCol;
			$dbCol 		= ($otype?$otype:$otable["type"]) . "." . $oCol;
			cTYPE::join( $colstr, ", ", "$dbCol as $dbColName"); 
		}
		return $colstr;
	}
	static public function initTable($db, &$table) {
		$tableMeta = $table["metadata"];
		switch( $tableMeta["type"] ) {
			case "one":
			case "one2one":
				break;
			case "one2many":
			case "many2many":
				$db->init4table($table);
				break;
		}
	}
	static public function getRows($db, &$table) {
		$tableMeta = $table["metadata"];
		switch( $tableMeta["type"] ) {
			case "one":
				$db->one($table);
				cACTION::getChecks($db, $table, "p");
				break;
			case "one2one":
				$db->one2one($table);
				cACTION::getChecks($db, $table, "p");
				cACTION::getChecks($db, $table, "s");
				break;
			case "one2many":
				$db->one2many($table);
				cACTION::getChecks($db, $table, "p");
				cACTION::getChecks($db, $table, "s");
				break;
			case "many2many":
				$db->many2many($table);
				cACTION::getChecks($db, $table, "s");
				cACTION::getChecks($db, $table, "m");
				break;
		}
	}
	static public function saveRows($db, &$table) {
		$tableMeta = $table["metadata"];
		switch( $tableMeta["type"] ) {
			case "one":
				$db->saveone($table);
				cACTION::saveChecks($db, $table, "p");
				break;
			case "one2one":
				$db->saveone2one($table);
				cACTION::saveChecks($db, $table, "p");
				cACTION::saveChecks($db, $table, "s");
				break;
			case "one2many":
				$db->saveone2many($table);
				cACTION::saveChecks($db, $table, "p");
				cACTION::saveChecks($db, $table, "s");
				break;
			case "many2many":
				$db->savemany2many($table);
				cACTION::saveChecks($db, $table, "s");
				cACTION::saveChecks($db, $table, "m");
				break;
		}
	}
	static public function getChecks($db, &$table, $tableType) {
		$otable = $table["metadata"][$tableType];
		foreach( $table["rows"] as &$row ) {
			foreach( $otable["checkboxCols"] as $dbCol ) {
					$ckMeta = $table["metadata"][$dbCol];
					if( $ckMeta["name"] ) {
						$ccc = array();
						switch($otable["type"]) {
							case "m":
								$fidx = 0;
								$ptable = $table["metadata"]["p"];
								foreach(  $ptable["keys"] as $pkey ) 
								{
									$pkeyDBCol = $ptable["colmeta"][$pkey]["name"]?$ptable["colmeta"][$pkey]["name"]:$pkey;
									$ccc[ $ckMeta["keys"][$fidx] ] = $row[$pkeyDBCol];
									$fidx++;
								}
								$stable = $table["metadata"]["s"];
								foreach( $stable["keys"] as $skey ) 
								{
									$skeyDBCol = $stable["colmeta"][$skey]["name"]?$stable["colmeta"][$skey]["name"]:$skey;
									$ccc[ $ckMeta["keys"][$fidx] ] = $row[$skeyDBCol];
									$fidx++;
								}
								break;
							default:
								foreach( $ckMeta["keys"] as $kidx=>$ckey ) {
									$ckeyDBCol = $otable["colmeta"][ $otable["keys"][$kidx] ]["name"]?$otable["colmeta"][ $otable["keys"][$kidx] ]["name"] : $otable["keys"][$kidx];
									$ccc[$ckey] = $row[$ckeyDBCol];
								}
								break;
						}
						$fields 		= array();
						$fields[] 		= $ckMeta["value"];
						$ckResult 		= $db->select( $ckMeta["name"], $fields, $ccc );	
						$ckRows  		= $db->rows($ckResult);
						$dbColName 		= $otable["colmeta"][$dbCol]["name"]?$otable["colmeta"][$dbCol]["name"]:$dbCol;
						$row[$dbColName] 	= array();
						foreach( $ckRows as $ckRow ) {
							$row[$dbColName][] = intval($ckRow[$ckMeta["value"]]);
						}
					} else {
						$row[$dbColName] = array();
					}
			}
		}
	}
	static public function saveChecks($db, &$table, $tableLevel) {
	    $otable 	= $table["metadata"][$tableLevel];
		foreach( $table["rows"] as &$row ) {
			// update case  +  insert case without error
			if( ($row["rowstate"]==1 || $row["rowstate"]==2) && $row["error"]["errorCode"]==0 ) {
				foreach( $otable["checkboxCols"] as $dbCol) {
					$ckColIdx = cARRAY::arrayIndex($row["cols"], array("col"=>$dbCol, "table"=>$otable["type"]) );
					$flag = true;
					if( $ckColIdx>=0) {
							$ckCol 		= $row["cols"][$ckColIdx];
							$ckValue 	= $ckCol["value"];
							$ckMeta 	= $table["metadata"][$dbCol];
							if( $ckMeta["name"] ) {
								$ccc = array();
								switch($tableLevel) {
									case "m":
										$fidx=0;
										foreach( $table["metadata"]["p"]["keys"] as $pidx=>$pkey ) 
										{
											$tmpIdx = cARRAY::arrayIndex($row["cols"], array("col"=>$pkey, "table"=>"p") );
											$ccc[$ckMeta["keys"][$fidx]] = $row["cols"][$tmpIdx]["value"];
											if($row["cols"][$tmpIdx]["value"]) {
												$ccc[$ckMeta["keys"][$fidx]] = $row["cols"][$tmpIdx]["value"];
											} else {
												$flag=false;
												//$table["success"] 						= 0; 												
												//$row["error"]["errorCode"] 				= 1;
												//$row["cols"][$ckColIdx]["errorCode"] 		= 1;
												//$row["cols"][$ckColIdx]["errorMessage"] 	= "Checkbox key is missing.";
											}
											$fidx++;
										}
										foreach( $table["metadata"]["s"]["keys"] as $sidx=>$skey ) 
										{
											$tmpIdx = cARRAY::arrayIndex($row["cols"], array("col"=>$skey, "table"=>"s") );
											if($row["cols"][$tmpIdx]["value"]) {
												$ccc[$ckMeta["keys"][$fidx]] = $row["cols"][$tmpIdx]["value"];
											} else {
												$flag=false;
												//$table["success"] 						= 0; 												
												//$row["error"]["errorCode"] 				= 1;
												//$row["cols"][$ckColIdx]["errorCode"] 		= 1;
												//$row["cols"][$ckColIdx]["errorMessage"] 	= "Checkbox key is missing.";
											}
											$fidx++;
										}
										//print_r($ccc);
										break;
									default:
										foreach( $otable["keys"] as $oIdx=>$oKey ) {
											$tmpIdx = cARRAY::arrayIndex($row["cols"], array("col"=>$oKey, "table"=>$otable["type"]) );
											$cKey 	= $ckMeta["keys"][$oIdx];
											if($row["cols"][$tmpIdx]["value"]) {
												$ccc[$cKey] = $row["cols"][$tmpIdx]["value"];
											} else {
												$flag=false;
												//$table["success"] 						= 0; 												
												//$row["error"]["errorCode"] 				= 1;
												//$row["cols"][$ckColIdx]["errorCode"] 		= 1;
												//$row["cols"][$ckColIdx]["errorMessage"] 	= "Checkbox key is missing.";
											}
											
										}
										//print_r($ccc);
										break;
								}

								if( $flag ) {
									$db->delete($ckMeta["name"], $ccc);
									$ckValCol = $ckMeta["value"];
									//echo "value Col: $ckValCol\n";
									if( is_array($ckValue) ) {
										foreach( $ckValue as $ckVal ) {
											$ccc[$ckValCol] = $ckVal;
											//print_r($ccc);
											$db->insert($ckMeta["name"], $ccc);
										}
									}
								}
							} // if( $cktable )

					}
				} // end of foreach meta cols
			}	
			// end of update case  +  insert case without error
		}
	}
	static public function orderByLimit($navi) {
		// order by 
        $orderby 	= "";
		$orderCol 	= $navi["orderby"]?$navi["orderby"]:"";
		$sortBy   	= $navi["sortby"]?$navi["sortby"]:"";
		if( $orderCol!="" && $sortBy!="" )
			$orderby = $orderCol . " " . $sortBy;
		elseif($orderCol!="") 
			$orderby = $orderCol . " ASC";

		if($orderby!="") $orderby = " ORDER BY " . $orderby;

		// Limit records 
		$limit = "";
		if( $navi["pageno"]>= 1) {
			$limit = "LIMIT " . (($navi["pageno"]-1) * $navi["pagesize"]) . ", " . $navi["pagesize"];
		} 
		return $orderby . " " . $limit;
	}
	static public function clearRows(&$table) {
		foreach($table["rows"] as &$theRow) {
				switch($table["action"]) {
					case "init":
					case "get":
						break;
					case "save":
					case "custom":
						foreach($theRow["cols"] as &$theCol) {
							if( !$theCol["key"] ) {
								unset($theCol["value"]);
							} 
							unset($theCol["scope"]);
							unset($theCol["defval"]);
							unset($theCol["colname"]);
							unset($theCol["coldesc"]);
							unset($theCol["datatype"]);
							unset($theCol["need"]);
							unset($theCol["notnull"]);
							unset($theCol["unique"]);
							unset($theCol["minlength"]);
							unset($theCol["maxlength"]);
							unset($theCol["min"]);
							unset($theCol["max"]);
							unset($theCol["sort"]);
							unset($theCol["list"]);

							unset($theCol["relation"]);
							unset($theCol["original"]);
							unset($theCol["current"]);
						}  //foreach
						break;
				} //switch
		} //foreach

		if(!DEBUG) unset($table["cols"]);
		if(!DEBUG) unset($table["filters"]);
		if(!DEBUG) unset($table["criteria"]);
		if(!DEBUG) unset($table["criteria_prmiary"]);
		if(!DEBUG) unset($table["query"]);
		if(!DEBUG) unset($table["query_primary"]);
		if(!DEBUG) unset($table["rights"]);
		if(!DEBUG) unset($table["listTable"]);
		if(!DEBUG) unset($table["metadata"]);
		if(!DEBUG) unset($table["rowsArray"]);
	}
	// for update and delete operation
	static public function getKeys(&$table, $tableLevel, &$row) {
	    $dbCols = array();
		$dbCols["keys"] = array();
		switch( $tableLevel ) {
			case "p":
				$ptable = $table["metadata"]["p"];
				foreach( $ptable["keys"] as $pidx=>$pkey ) {
					$tmpIdx 	= cARRAY::arrayIndex($row["cols"], array("col"=>$pkey, "table"=>"p"));
					$pcolObj 	= $row["cols"][$tmpIdx];
					if($pcolObj["value"]) {
						$dbCols["keys"][$pkey] = $pcolObj["value"];
					} else {
						$table["success"] 				= 0;
						$row["error"]["errorCode"] 		= 9;
						$row["error"]["errorMessage"] 	= "Primary Key is empty.";
					} 
				}
				break;
			case "s":
				$stable = $table["metadata"]["s"];
				foreach( $stable["keys"] as $skey ) {
					$tmpIdx = cARRAY::arrayIndex($row["cols"], array("col"=>$skey, "table"=>"s"));
					$scolObj = $row["cols"][$tmpIdx];
					if($scolObj["value"]) {
						$dbCols["keys"][$skey] = $scolObj["value"];
					} else {
						$table["success"] 				= 0;
						$row["error"]["errorCode"] 		= 9;
						$row["error"]["errorMessage"] 	= "Secondary Key is empty.";
					} 
				}
				break;
			case "m":
				$ptable = $table["metadata"]["p"];
				$stable = $table["metadata"]["s"];
				$mtable = $table["metadata"]["m"];
				foreach( $ptable["keys"] as $pidx=>$pkey ) {
					$tmpIdx 	= cARRAY::arrayIndex($row["cols"], array("col"=>$pkey, "table"=>"p"));
					$pcolObj 	= $row["cols"][$tmpIdx];
					$mkey 		= $mtable["keys"][$pidx];
					if($pcolObj["value"]) {
						$dbCols["keys"][$mkey] = $pcolObj["value"];
					} else {
						$table["success"] 				= 0;
						$row["error"]["errorCode"] 		= 9;
						$row["error"]["errorMessage"] 	= "Primary Key is empty.";
					}
				}
				foreach( $stable["keys"] as $sidx=>$skey ) {
					$tmpIdx 	= cARRAY::arrayIndex($row["cols"], array("col"=>$skey, "table"=>"s"));
					$scolObj 	= $row["cols"][$tmpIdx];
					$mkey 		= $mtable["fkeys"][$sidx];
					if($scolObj["value"]) {
						$dbCols["keys"][$mkey] = $scolObj["value"];
					} else {
						$table["success"] 				= 0;
						$row["error"]["errorCode"] 		= 9;
						$row["error"]["errorMessage"] 	= "Secondary Key is empty.";
					}
				}
				break;
		}
		return $dbCols;
	}
	// for update keys  after insertion
	static public function setKeys(&$table, $tableLevel, &$row, $insertID) {
		switch($tableLevel) {
			case "p":
				$ptable = $table["metadata"]["p"];
				//first key is auto-increase 
				$tmpIdx = cARRAY::arrayIndex($row["cols"], array("col"=>$ptable["keys"][0], "table"=>"p"));
				$row["cols"][$tmpIdx]["value"]=$insertID;
				break;
			case "s":
				$stable = $table["metadata"]["s"]; 
				// first key is auto-increase key
				$tmpIdx = cARRAY::arrayIndex($row["cols"], array("col"=>$stable["keys"][0], "table"=>"s"));
				$row["cols"][$tmpIdx]["value"]=$insertID;
				break;
			case "m":  // don't need to set getKeys, set keys by p, s
				break;
		}
	}
	// syncKeys : update  second and medium table foreign keys  replace with primary keys value
	static public function syncKeys(&$table, $tableLevel, &$row) {
		switch($tableLevel) {
			case "p":
				break;
			case "s":
				$ptable = $table["metadata"]["p"];
				$stable = $table["metadata"]["s"]; 
				foreach( $stable["fkeys"] as $sidx=>$skey ) {
					$scolIdx 	= cARRAY::arrayIndex($row["cols"], array("col"=>$skey, "table"=>"s"));
					$pcolIdx 	= cARRAY::arrayIndex($row["cols"], array("col"=>$ptable["colmeta"][$ptable["keys"][$sidx]]["col"], "table"=>"p"));							
					$row["cols"][$scolIdx]["value"] = $row["cols"][$pcolIdx]["value"];
				}
				break;
			case "m":
				$ptable = $table["metadata"]["p"];
				$stable = $table["metadata"]["s"]; 
				$mtable = $table["metadata"]["m"]; 
				foreach( $mtable["keys"] as $midx=>$mkey ) {
					$mcolIdx 	= cARRAY::arrayIndex($row["cols"], array("col"=>$mkey, "table"=>"m"));
					$pcolIdx 	= cARRAY::arrayIndex($row["cols"], array("col"=>$ptable["colmeta"][$ptable["keys"][$midx]]["col"], "table"=>"p"));							
					$row["cols"][$mcolIdx]["value"] = $row["cols"][$pcolIdx]["value"];
				}
				foreach( $mtable["fkeys"] as $midx=>$mkey ) {
					$mcolIdx 	= cARRAY::arrayIndex($row["cols"], array("col"=>$mkey, "table"=>"m"));
					$scolIdx 	= cARRAY::arrayIndex($row["cols"], array("col"=>$stable["colmeta"][$stable["keys"][$midx]]["col"], "table"=>"s"));							
					$row["cols"][$mcolIdx]["value"] = $row["cols"][$scolIdx]["value"];
				}
				break;
		}
	}	
	static public function getUpdateCols(&$table, $tableLevel, &$row) {
	    $dbCols = array();
		$dbCols["fields"] = array();
		$otable = $table["metadata"][$tableLevel];
		foreach( $row["cols"] as &$colObj ) {
			if($colObj["table"]==$otable["type"]) {
				$fieldName 	= $colObj["col"];
				if( in_array($fieldName, $otable["cols"]) && !in_array($fieldName, $otable["keys"]) && !in_array($fieldName, $otable["fkeys"]) ) {
					$colVal     = trim($colObj["value"]);
					switch( $colObj["coltype"] ) {
						case "checkbox":
						case "checkbox1":
						case "checkbox2":
						case "checkbox3":
							break;
						default:
							$dbCols["fields"][$fieldName] = $colVal;
							// only return key col value , other col value set to empty to avoid trafic 
							break;
					}
				}
			}
		}				
		return $dbCols;
	}
	static public function getInsertCols(&$table, $tableLevel, &$row) {
	    $dbCols = array();
		$dbCols["fields"] = array();
		switch($tableLevel) {
			case "p": // insertCols include  key with value,  not include key without value
				$ptable = $table["metadata"]["p"];
				foreach( $row["cols"] as &$colObj ) {
					if($colObj["table"]==$ptable["type"]) {
						$fieldName 	= $colObj["col"];
						$colVal     = trim($colObj["value"]);
						if( in_array($fieldName, $ptable["cols"]) ) {
							if( !in_array($fieldName, $ptable["keys"]) && !in_array($fieldName, $ptable["fkeys"]) ) {
								switch( $colObj["coltype"] ) {
									case "checkbox":
									case "checkbox1":
									case "checkbox2":
									case "checkbox3":
										break;
									default:
										$dbCols["fields"][$fieldName] = $colVal;
										// only return key col value , other col value set to empty to avoid trafic 
										break;
								}
							} else {
								//if composed keys,  first key is auto-increase,  the rest of keys should has fixed value;
								//if only first key set to empty,
								$first_pkey = $ptable["keys"][0];
								if($first_pkey!=$fieldName)
									$dbCols["fields"][$fieldName] = $colVal;  
							}
						}
					}
				}				
				break;
			case "s":
				$stable = $table["metadata"]["s"];
				// one2one, one2many stable includes keys + fkeys;   many2many stable includes keys 
				foreach( $row["cols"] as &$colObj ) {
					if($colObj["table"]==$stable["type"]) {
						$fieldName 	= $colObj["col"];
						$colVal     = trim($colObj["value"]);
						if( in_array($fieldName, $stable["cols"]) ) {
							if( !in_array($fieldName, $stable["keys"]) && !in_array($fieldName, $stable["fkeys"]) ) {
								switch( $colObj["coltype"] ) {
									case "checkbox":
									case "checkbox1":
									case "checkbox2":
									case "checkbox3":
										break;
									default:
										$dbCols["fields"][$fieldName] = $colVal;
										// only return key col value , other col value set to empty to avoid trafic 
										break;
								}
							} else {
								//if composed keys,  first key is auto-increase,  the rest of keys should has fixed value;
								//if only first key set to empty,
								//notes: includes keys + fkeys , but not includes first key: keys[0]
								$first_pkey = $stable["keys"][0];
								if($first_pkey!=$fieldName)
									$dbCols["fields"][$fieldName] = $colVal;  
							}
						}
					}
				}	
				break;
			case "m":  // insertCols include full set 
				$mtable = $table["metadata"]["m"];
				foreach( $row["cols"] as &$colObj ) {
					if($colObj["table"]==$mtable["type"]) {
						$fieldName 	= $colObj["col"];
						$colVal     = trim($colObj["value"]);
						// all cols include keys and fkeys
						if( in_array($fieldName, $mtable["cols"]) ) {
							switch( $colObj["coltype"] ) {
								case "checkbox":
								case "checkbox1":
								case "checkbox2":
								case "checkbox3":
									break;
								default:
									$dbCols["fields"][$fieldName] = $colVal;
									// only return key col value , other col value set to empty to avoid trafic 
									break;
							}
						}
					}
				}				
				break;
		}
		return $dbCols;
	}
	static public function getRelation(&$row) {
		$cidx = cARRAY::arrayIndex($row["cols"], array("coltype"=>"relation"));	
		return $row["cols"][$cidx];
	}
	
    static public function checkUnique($db, &$table, $tableLevel) {
		$is_unique 		= true;
		$otable 		= $table["metadata"][$tableLevel];
		$uCols 			= cARRAY::arrayFilter($otable["colmeta"], array("unique"=>1));
		foreach( $uCols as $uCol ) {
			if( in_array( $uCol["col"], $otable["selectCols"] ) ) {
				foreach( $table["rows"] as &$theRow ) {
					$cidx = cARRAY::arrayIndex( $theRow["cols"], array("col"=>$uCol["col"], "table"=>$otable["type"]) );
					$theCol = $theRow["cols"][$cidx];
					$valKV  = array( $uCol["col"]=>$theCol["value"] );
					
					$keyKV 	= array();
					switch($tableLevel) {
						case "p":
						case "s":
							$rKeys = $otable["keys"];
							foreach( $rKeys as $rkey) {
								$temp_cidx = cARRAY::arrayIndex( $theRow["cols"], array("col"=>$rkey, "table"=>$otable["type"])  );
								$rCol = $theRow["cols"][$temp_cidx];
								$keyKV[$rkey] = $rCol["value"];
							}
							break;
						case "m":
							// create keys array() for database where clause
							foreach($table["metadata"]["p"]["keys"] as $pidx=>$pkey) {
								$temp_cidx = cARRAY::arrayIndex( $theRow["cols"], array("col"=>$pkey, "table"=>"p"));
								$rCol = $theRow["cols"][$temp_cidx];
								$rkey = $otable["keys"][$pidx];
								$keyKV[$rkey] =  $rCol["value"];
							}

							foreach($table["metadata"]["s"]["keys"] as $sidx=>$skey) {
								$temp_cidx = cARRAY::arrayIndex( $theRow["cols"], array("col"=>$skey, "table"=>"s")  );
								$rCol = $theRow["cols"][$temp_cidx];
								$rkey = $otable["fkeys"][$sidx];
								$keyKV[$rkey] =  $rCol["value"];
							}
							break;
					}

	
					/*
					print_r($keyKV);
					echo "-------\n";
					print_r($valKV);
					echo "-------\n";
					echo "-------\n";
					*/
					switch($theRow["rowstate"]) {
						case 0:
							break;
						case 1:
							$is_unique = $db->checkUnique($otable["name"], $valKV, $keyKV);
							if(!$is_unique) {
								$table["success"] 				= 0;
								$theRow["error"]["errorCode"] 	= 1;
								$theRow["cols"][$cidx]["errorCode"] 		= 1;  
								$theRow["cols"][$cidx]["errorMessage"] 		= "'" . $uCol["colname"] . "' already in used.";  
							}
							break;
						case 2:
							$is_unique = $db->checkUnique($otable["name"], $valKV);
							if(!$is_unique) {
								$table["success"] 				= 0;
								$theRow["error"]["errorCode"] 	= 1;
								$theRow["cols"][$cidx]["errorCode"] 		= 1;  
								$theRow["cols"][$cidx]["errorMessage"] 		= "'" . $uCol["colname"] . "' already in used.";  
							}
							break;
						case 3:
							break;
					}

				}
			}
		}
		return $is_unique;
	}
	static public function checkUniques($db, &$table) {
		switch( $table["metadata"]["type"] ) {
			case "one":
				cACTION::checkUnique($db, $table, "p");
				break;
			case "one2one":
				cACTION::checkUnique($db, $table, "p");
				cACTION::checkUnique($db, $table, "s");
				break;
			case "one2many":
				cACTION::checkUnique($db, $table, "p");
				cACTION::checkUnique($db, $table, "s");
				break;
			case "many2many":
				cACTION::checkUnique($db, $table, "p");
				cACTION::checkUnique($db, $table, "s");
				cACTION::checkUnique($db, $table, "m");
				break;
		}
	}

	static public function filter(&$table, $tableCol, $val) {
		cTYPE::join($table["criteria"], " AND ", "$tableCol = '" . cTYPE::quote($val) . "'");
	}

	static public function formFilter(&$table) {
		switch($table["metadata"]["type"]) {
			case "one":
			case "one2one":
				$ptable = $table["metadata"]["p"];
				foreach($ptable["keys"] as $pidx=>$pkey) {
					$tmpIdx 	= cARRAY::arrayIndex($table["cols"], array("col"=>$pkey, "table"=>"p"));
					$pkeyVal 	= trim($table["cols"][$tmpIdx]["defval"]);
					if( $pkeyVal=="" ) {
						cTYPE::join($table["criteria"], " AND ", "1=0");	
					}
				}
				break;
			case "one2many":
			case "many2many":
				$ptable = $table["metadata"]["p"];
				foreach($ptable["keys"] as $pidx=>$pkey) {
					$tmpIdx 	= cARRAY::arrayIndex($table["cols"], array("col"=>$pkey, "table"=>"p"));
					$pkeyVal 	= trim($table["cols"][$tmpIdx]["defval"]);
					if($pkeyVal=="") {
						cTYPE::join($table["criteria"], " AND ", "1=0");	
						$table["success"] 					= 0;  // flag entire success
						$table["error"]["errorCode"] 		= 1;  // flag entire table error 
						$table["error"]["errorMessage"] 	= "Primary data is missing.";
					}		
				}
				$stable = $table["metadata"]["s"];
				foreach($stable["keys"] as $sidx=>$skey) {
					$tmpIdx 	= cARRAY::arrayIndex($table["cols"], array("col"=>$skey, "table"=>"s"));
					$skeyVal 	= trim($table["cols"][$tmpIdx]["defval"]);
					if($skeyVal=="") cTYPE::join($table["criteria"], " AND ", "1=0");				
				}
				break;
		}
		if($table["error"]["errorCode"]<=0) {
			$table["navi"]["pageno"] 	= 0;
			$table["navi"]["pagesize"] 	= 1;
		} else {
			$table["navi"]["pageno"] = 0;
		}
		
	}
	
	// important: many2many medium table filter cols  must use js colObj name.  because (SELECT dbcol AS jsColName FROM mm) m
	static public function getFilters(&$table) {
		$criteria 	= "";
		$filters 	= $table["filters"];
		if( is_array($filters) ) {
			foreach($filters as $filter) {
				$temp_ccc 	= "";
				$dbCols 	= explode(",", $filter["cols"]);
				$only 		= 0;
				foreach($dbCols as $dbCol) {
					$dbCol 	= trim($dbCol); 						
					cTYPE::join($temp_ccc, " OR " , cACTION::getCriteria($table, $filter, $dbCol));
					$only++;
				}
				if($only>1)	$temp_ccc = $temp_ccc!=""?"(" . $temp_ccc . ")":$temp_ccc;
				cTYPE::join($criteria, " AND ", $temp_ccc);
			}
		}
		//echo "criteria:  $criteria";
		cTYPE::join($table["criteria"], " AND ",  $criteria);
	}
	static public function getCriteria($table, $filter, $dbCol) {
		$ret_ccc 	= "";
		$need = $filter["need"]?1:0;
		if( strpos($dbCol, ".") === false )	$dbCol = "p.$dbCol";
		switch( $filter["coltype"] ) {
			case "textbox":
				$compare 	= $filter["compare"]?$filter["compare"]:"LIKE";
				/*** common part ***/
				$val 		= $filter["value"]?trim($filter["value"]):"";
				if($need) {
					if($val!="") 
						$ret_ccc = cACTION::getOperation($dbCol, $compare, $val);
					else 
						$ret_ccc = "1=0";
				} else {
					if($val!="") $ret_ccc = cACTION::getOperation($dbCol, $compare, $val);
				}
				/*** end of common part ***/
				break;

			case "radio":
			case "date":
			case "time":
				$compare 	= $filter["compare"]?$filter["compare"]:"=";

				/*** common part ***/
				$val 		= $filter["value"]?trim($filter["value"]):"";
				if($need) {
					if($val!="") 
						$ret_ccc = cACTION::getOperation($dbCol, $compare, $val);
					else 
						$ret_ccc = "1=0";
				} else {
					if($val!="") $ret_ccc = cACTION::getOperation($dbCol, $compare, $val);
				}
				/*** end of common part ***/
				break;
			case "bool":
				$compare = "=";
				$val = $filter["value"]?trim($filter["value"]):0;
				if($val!="" && $val!=0 && $val!="0") $ret_ccc = cACTION::getOperation($tableCol, $compare, $val);
				break;
			case "select":
				$compare = "=";
				$val = $filter["value"]?trim($filter["value"]):"";
				if($val!="") $ret_ccc = cACTION::getOperation($dbCol, $compare, $val);
				break;

			case "datetimerange":
			case "daterange":
			case "timerange":
			case "range":
				$compare 	= "";
				$fromVal 	= $filter["value"]["from"]?trim($filter["value"]["from"]):"";
				$toVal 		= $filter["value"]["to"]?trim($filter["value"]["to"]):"";
				if( $fromVal!="" )
					$ret_ccc = cACTION::getOperation($dbCol, ">=", $fromVal);
				if( $toVal!="" )
					cTYPE::join($ret_ccc, " AND ", cACTION::getOperation($dbCol, "<=", $toVal));
				
				$ret_ccc = $ret_ccc!=""? "(" . $ret_ccc . ")": $ret_ccc;   
				break;

			case "checkbox":
			case "checkbox1":
			case "checkbox2":
			case "checkbox3":
			    //Importatnt:  if checkbox using "HAS" ,   if  radio in database, but client using checkbox , using "IN"
				$compare 	= strtoupper($filter["compare"])=="HAS"?strtoupper($filter["compare"]):"IN";
				if($need) {
					if(is_array($filter["value"]) && count($filter["value"])>0) {
						$val = array();
						foreach($filter["value"] as $fval) {
							$val[] = intval($fval);
						}
						$ret_ccc = cACTION::getOperation($dbCol, $compare, implode(",",$val), $table);
					} else {
						$ret_ccc = "1=0";
					}
				} else {
					if(is_array($filter["value"]) && count($filter["value"])>0) {
						$val = array();
						foreach($filter["value"] as $fval) {
							$val[] = intval($fval);
						}
						$ret_ccc = cACTION::getOperation($dbCol, $compare, implode(",",$val), $table);
					}					
				}
				break;
		}
		return $ret_ccc;
	}
	static public function getOperation($dbCol, $compare, $val, $table) {
		$ret_ccc = "";
		if( strpos($dbCol, ".") !== false ) {
			$colPart 	= $dbCol.explode(".");
			$tableType	= strtolower($colPart[0]);
			$ssCol 		= trim($colPart[1]);
		} else {
			$tableType 	= "p";  // if not  s.colname or m.colname,  default set to primary table; p.xxxx
			$ssCol 		= $dbCol;
			$dbCol 		= "p." . $dbCol;
		} 
		
		$compare = strtoupper($compare);
		switch($compare) {
			case "LIKE":
				$ret_ccc = "$dbCol $compare '%" . cTYPE::quote($val) . "%'"; 
				break;
			case "=":
			case "<":
			case "<=":
			case ">":
			case ">=":
				$ret_ccc = "$dbCol $compare '" . cTYPE::quote($val) . "'"; 
				break;
			case "IN":
				$ret_ccc = "$dbCol $compare (" . $val . ")"; 
				break;
			case "RANGE":
				$ret_ccc = "$dbCol BETWEEN '" . cTYPE::quote($val["from"]) . "' AND '" . cTYPE::quote($val["to"]) . "'"; 
				break;
			case "HAS":
				$ret_ccc = ""; 
				$ckMeta = $table["metadata"][$ssCol];
				if( is_array($ckMeta) && count($ckMeta["keys"])>0 ) {
					switch( $tableType ) {
						case "p":
							$ptable = $table["metadata"]["p"];
							$ckjoinon = "";
							foreach( $ckMeta["keys"] as $cidx=>$ckey ) {
							   $pkey = $ptable["type"] . "." . $ptable["keys"][$cidx];
							   cTYPE::join($ckjoinon, " AND ", "$ckey=$pkey"); 
							}
							$ckValCol = $ckMeta["value"];
							cTYPE::join( $ckjoinon, " AND ", "$ckValCol IN (" . $val . ")" );
							break;
						case "s":
							$stable = $table["metadata"]["s"];
							$ckjoinon = "";
							foreach( $ckMeta["keys"] as $cidx=>$ckey ) {
							   $skey = $stable["type"] . "." . $stable["keys"][$cidx];
							   cTYPE::join( $ckjoinon, " AND ", "$ckey=$skey"); 
							}
							$ckValCol = $ckMeta["value"];
							cTYPE::join( $ckjoinon, " AND ", "$ckValCol IN (" . $val . ")" );
							break;
						case "m":
							$ptable = $table["metadata"]["p"];
							$ckjoinon = "";
							$fidx = 0;
							foreach($ptable["keys"] as $pidx=>$pkey ) 
							{
								$ckey 		= $ckMeta["keys"][$fidx];
								$pkeyDBCol 	= $ptable["type"] . "." . $pkey;
							    cTYPE::join( $ckjoinon, " AND ", "$ckey=$pkeyDBCol"); 
								$fidx++;
							}
							$stable = $table["metadata"]["s"];
							foreach( $stable["keys"] as  $sidx=>$skey ) 
							{
								$ckey 		= $ckMeta["keys"][$fidx];
								$skeyDBCol 	= $stable["type"] . "." . $skey;
							    cTYPE::join( $ckjoinon, " AND ", "$ckey=$skeyDBCol"); 
								$fidx++;
							}
							$ckValCol = $ckMeta["value"];
							cTYPE::join( $ckjoinon, " AND ", "$ckValCol IN (" . $val . ")" );
							break;
					}
					$ckTable = $ckMeta["name"];
					$ret_ccc = "EXISTS (SELECT 1 FROM $ckTable WHERE $ckjoinon)";
				}
				break;
		}
		return $ret_ccc;
	}

	static public function getRowArray(&$table) {
		// for other code logic
		$rowArr = array();
		
		switch($table["action"]) {
			case "get":
				$rowArr = $table["rows"];
				break;
			case "save":
				foreach( $table["rows"] as $ridx=>$theRow ) {
					$rowArr[$ridx] = array();
					foreach($theRow["cols"] as $cidx=>$theCol) {
						$rowArr[$ridx][$theCol["name"]] = $theCol["value"];
					}
				}
				break;
		} //switch
		$table["rowsArray"] = $rowArr;
	}
}

class cVALIDATE {
	static public function validate( &$table ) {
		foreach( $table["rows"] as &$theRow ) {
			$theRow["error"]["errorCode"] 		= 0;
			$theRow["error"]["errorMessage"] 	= "";

			foreach( $theRow["cols"] as &$theCol ) {
				$colName 	= $theCol["name"];
				$dispName   = $theCol["colname"];
				$colType 	= $theCol["coltype"];
				$tableType 	= $theCol["table"];
				$dataType 	= $theCol["datatype"];
				$key 		= $theCol["key"];
				$notNull 	= $theCol["notnull"];
				$need 		= $theCol["need"];
				$relation	= $theCol["relation"];
				$minLength 	= intval($theCol["minlength"])?intval($theCol["minlength"]):0;
				$maxLength 	= intval($theCol["maxlength"])?intval($theCol["maxlength"]):0;

				// the changed col will be validated
				$theCol["errorCode"] 		= 0;  
				$theCol["errorMessage"] 	= "";  

				$relationCol = cACTION::getRelation($theRow);
				//print_r($relationCol);
				if($relationCol) {
					if(!$relationCol["value"]) {
						if($tableType==$relationCol["table"]) {
							unset( $theCol );  // important to unset related col
							continue;
						}
					} 
				}

				switch($theRow["rowstate"]) {
					case "1":   // no break;  case: 1 + 2 
						if($key) {
							if($theCol["value"]=="") {
								//print_r($theRow);
								$table["success"] 				= 0;
								$theRow["error"]["errorCode"] 	= 1;
								$theCol["errorCode"] 			= 1;  
								$theCol["errorMessage"] 		= "Key '" . $dispName . "' is empty.";  
							}
						}
					case "2":  

						/**************************************************************/
						switch( $colType ) {
							case "passpair":
								$tmp_pass 		= trim($theCol["value"]["password"])?trim($theCol["value"]["password"]):""; 
								$tmp_confirm 	= trim($theCol["value"]["confirm"])?trim($theCol["value"]["confirm"]):""; 
								if( $tmp_pass != $tmp_confirm ) {
									$table["success"] 				= 0;
									$theRow["error"]["errorCode"] 	= 1;
									$theCol["errorCode"] 			= 1;  
									$theCol["errorMessage"] 		= "'" . $dispName . "' doesn't match confirm one.";  
								}
								$theCol["value"] = $tmp_pass;
							case "hidden":
							case "textbox":
							case "textarea":
							case "ckeditor":
							case "password":
								if( $dataType == "NUMBER" ) {
									if( is_numeric($theCol["value"]) ) {
										$theCol["value"] = is_numeric($theCol["value"])?$theCol["value"]:0;
									} else {
										$table["success"] 				= 0;
										$theRow["error"]["errorCode"] 	= 1;
										$theCol["errorCode"] 			= 1;  
										$theCol["errorMessage"] 		= "'" . $dispName . "' is invalid NUMBER type.";  
									}
								} 

								if(!$theCol["value"] && $dataType != "NUMBER") $theCol["value"]="";
								

								if($notNull) {
									if($theCol["value"]=="") {
										$table["success"] 				= 0;
										$theRow["error"]["errorCode"] 	= 1;
										$theCol["errorCode"] 			= 1;  
										$theCol["errorMessage"] 		= "'" . $dispName . "' is required.";  
									}
								}
								
									$slen = mb_strlen($theCol["value"]);
								if( $theCol["errorCode"]<=0 ) {
									if( $slen>0 && $minLength>0 && $slen<$minLength ) {
										$table["success"] 				= 0;
										$theRow["error"]["errorCode"] 	= 1;
										$theCol["errorCode"] 			= 1;  
										$theCol["errorMessage"] 		= "'" . $dispName . "'($slen chars) less than minimum chars($minLength chars).";  
									}
									if( $slen>0 && $maxLength>0 && $slen>$maxLength ) {
										$table["success"] 				= 0;
										$theRow["error"]["errorCode"] 	= 1;
										$theCol["errorCode"] 			= 1;  
										$theCol["errorMessage"] 		= "'" . $dispName . "'($slen chars) exceed maximum chars($maxLength chars).";  
									}
								}

								if( $theCol["errorCode"]<=0 ) {
									if( $slen>0 && !preg_match( cVALIDATE::$DATATYPE[$dataType], $theCol["value"]) ) {
										$table["success"] 				= 0;
										$theRow["error"]["errorCode"] 	= 1;
										$theCol["errorCode"] 			= 1;  
										$theCol["errorMessage"] 		= "'" . $dispName . "' is invalid ". ucwords($dataType) . " format.";  
										//print_r($theCol);
									}
								}

								if( $theCol["errorCode"]<=0 ) {
									if( $dataType == "NUMBER" ) {
										$min 	= is_numeric($theCol["min"])?floatval($theCol["min"]):0;
										$max 	= is_numeric($theCol["max"])?floatval($theCol["max"]):0;
										$fval 	= is_numeric($theCol["value"])?floatval($theCol["value"]):0;
										if( $theCol["value"]!=0 && $min!=0 && $fval<$min ) {
											$table["success"] 				= 0;
											$theRow["error"]["errorCode"] 	= 1;
											$theCol["errorCode"] 			= 1;  
											$theCol["errorMessage"] 		= "'" . $dispName . "' value " .  $theCol["value"] . " less than minimum value $min";  
										}
										if( $theCol["value"]!=0 && $max!=0 && $fval>$max ) {
											$table["success"] 				= 0;
											$theRow["error"]["errorCode"] 	= 1;
											$theCol["errorCode"] 			= 1;  
											$theCol["errorMessage"] 		= "'" . $dispName . "' value " .  $theCol["value"] . " large than maximum value $max";  
										}
									}
								}

								break;
							case "upload":
							case "editor":
								// important: don't do regular express for base64 string, it will crash 
								if(!$theCol["value"]) $theCol["value"]="";
								if($notNull) {
									if($theCol["value"]=="") {
										$table["success"] 				= 0;
										$theRow["error"]["errorCode"] 	= 1;
										$theCol["errorCode"] 			= 1;  
										$theCol["errorMessage"] 		= "'" . $dispName . "' is required.";  
									}
								}
								$slen = mb_strlen($theCol["value"]);
								if( $theCol["errorCode"]<=0 ) {
									if( $slen>0 && $minLength>0 && $slen<$minLength ) {
										$table["success"] 				= 0;
										$theRow["error"]["errorCode"] 	= 1;
										$theCol["errorCode"] 			= 1;  
										$theCol["errorMessage"] 		= "'" . $dispName . "'($slen chars) less than minimum chars($minLength chars).";  
									}
									if( $slen>0 && $maxLength>0 && $slen>$maxLength ) {
										$table["success"] 				= 0;
										$theRow["error"]["errorCode"] 	= 1;
										$theCol["errorCode"] 			= 1;  
										$theCol["errorMessage"] 		= "'" . $dispName . "'($slen chars) exceed maximum chars($maxLength chars).";  
									}
								}
								break;

							case "checkbox":
							case "checkbox1":
							case "checkbox2":
							case "checkbox3":
								if( !is_array($theCol["value"]) ) $theCol["value"]=array();
								if($notNull) {
									if( !is_array( $theCol["value"] ) )  {
										$table["success"] 				= 0;
										$theRow["error"]["errorCode"] 	= 1;
										$theCol["errorCode"] 			= 1;  
										$theCol["errorMessage"] 		= "'" . $dispName . "' is required.";  
									} else {
										if(count($theCol["value"])<=0) {
											$table["success"] 				= 0;
											$theRow["error"]["errorCode"] 	= 1;
											$theCol["errorCode"] 			= 1;  
											$theCol["errorMessage"] 		= "'" . $dispName . "' is required.";  
										}
									}
								}

								if( $theCol["errorCode"]<=0 ) {
									$slen = count($theCol["value"]);
									if( $slen>0 && $minLength>0 && $slen<$minLength ) {
										$table["success"] 				= 0;
										$theRow["error"]["errorCode"] 	= 1;
										$theCol["errorCode"] 			= 1;  
										$theCol["errorMessage"] 		= "'" . $dispName . "' require select at least $minLength items.";  
									}
									if( $slen>0 && $maxLength>0 && $slen>$maxLength ) {
										$table["success"] 				= 0;
										$theRow["error"]["errorCode"] 	= 1;
										$theCol["errorCode"] 			= 1;  
										$theCol["errorMessage"] 		= "'" . $dispName . "' selected items exceed maximum $maxLength items.";  
									}
								}
								
								break;

							case "date":
							case "time":
							case "datetime":
								//echo "date : " . $theCol["value"] . "\n";
								if(!$theCol["value"])  $theCol["value"]="";
								if($notNull) {
									if($theCol["value"]=="") {
										$table["success"] 				= 0;
										$theRow["error"]["errorCode"] 	= 1;
										$theCol["errorCode"] 			= 1;  
										$theCol["errorMessage"] 		= "'" . $dispName . "' is required.";  
									}
								}

								$slen = mb_strlen($theCol["value"]);
								if( $theCol["errorCode"]<=0 ) {
									if( $slen>0 && !preg_match( cVALIDATE::$DATATYPE[ strtoupper($colType) ], $theCol["value"]) ) {
										$table["success"] 				= 0;
										$theRow["error"]["errorCode"] 	= 1;
										$theCol["errorCode"] 			= 1;  
										$theCol["errorMessage"] 		= "'" . $dispName . "' is invalid ". ucwords($colType) . " format.";  
									}
								}

								if( $theCol["errorCode"]<=0 ) {
										$min 	= $theCol["min"]?cTYPE::datetoint($theCol["min"]):0;
										$max 	= $theCol["max"]?cTYPE::datetoint($theCol["max"]):0;
										if( $slen>0 && $min>0 && cTYPE::datetoint($theCol["value"])<$min ) {
											$table["success"] 				= 0;
											$theRow["error"]["errorCode"] 	= 1;
											$theCol["errorCode"] 			= 1;  
											$theCol["errorMessage"] 		= "'" . $dispName . "' value " .  $theCol["value"] . " less than minimum value " . $theCol["min"];  
										}
										if( $slen>0 && $max>0 && cTYPE::datetoint($theCol["value"])>$max ) {
											$theRow["error"]["errorCode"] 	= 1;
											$theCol["errorCode"] 			= 1;  
											$theCol["errorMessage"] 		= "'" . $dispName . "' value " .  $theCol["value"] . " large than maximum value ". $theCol["max"];  
										}
								}
								
							case "date":
								if(!$theCol["value"])  $theCol["value"]="0000-00-00";
								break;
							case "time":
								if(!$theCol["value"])  $theCol["value"]="00:00";
								break;
							case "datetime":
								if(!$theCol["value"])  $theCol["value"]="0000-00-00 00:00:00";
								break;

							case "select":
								if(!$theCol["value"])  $theCol["value"]="";
								if($notNull) {
									if( trim($theCol["value"])=="") {
										$table["success"] 				= 0;
										$theRow["error"]["errorCode"] 	= 1;
										$theCol["errorCode"] 			= 1;  
										$theCol["errorMessage"] 		= "'" . $dispName . "' is required.";  
									}
								}
								break;

							case "radio":
							case "radio1":
							case "radio2":
							case "radio3":
								$theCol["value"]=intval($theCol["value"])?intval($theCol["value"]):0;
								if($notNull) {
									if(!$theCol["value"]) {
										$table["success"] 				= 0;
										$theRow["error"]["errorCode"] 	= 1;
										$theCol["errorCode"] 			= 1;  
										$theCol["errorMessage"] 		= "'" . $dispName . "' is required.";  
									}
								}
								break;
							case "relation":
							case "bool":
								if(!$theCol["value"])  $theCol["value"]=0;
  								if($notNull) {
									if(!$theCol["value"]) {
										$table["success"] 				= 0;
										$theRow["error"]["errorCode"] 	= 1;
										$theCol["errorCode"] 			= 1;  
										$theCol["errorMessage"] 		= $theCol["coldesc"];  
									}
								}
								break;
							default:
								break;
						}
						/**************************************************************/
						break;
					case "3":
						break;
				}
				
			}
		}
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

class cTREE {
	static public function action($db, &$table ) {
		cTREE::buildColMeta($table); // important
		$table["success"] 	= 1;
		switch( $table["action"] ) {
			case "init":
				$table["rows"] = array();
				if( $table["rights"]["view"] ) {
					cLIST::getList($db, $table);
					cACTION::initTable($db, $table);
				} else {
					$table["success"] = 0;
					$table["error"]["errorCode"]=1;
					$table["error"]["errorMessage"]="You don't have right to view data.";
				}
				break;
			case "get":
				$table["rows"] = array();
				if( $table["rights"]["view"] ) {
					cLIST::getList($db, $table);
					//cACTION::getFilters($table);
					cTREE::getRows($db, $table);
				} else {
					$table["success"] = 0;
					$table["error"]["errorCode"]=1;
					$table["error"]["errorMessage"]="You don't have right to view data.";
				}

				break;
			case "save":
				cLIST::getList($db, $table);
				cVALIDATE::validate($table);
				cACTION::checkUniques($db, $table);
				
				cACTION::saveRows($db, $table);
				break;
		}
		//cACTION::getRowArray($table);
		$table["success"] = $table["error"]["errorCode"]?0:$table["success"];
	}

	static public function getRows($db, &$table) {
		$tableMeta = $table["metadata"];
		switch( $tableMeta["type"] ) {
			case "2":
				$db->treeNodes($table, "p", 0);
				break;
			case "3":
				$db->treeNodes($table, "p", 0);
				break;
			case "4":
				$db->one2many($table);
				cACTION::getChecks($db, $table, "p");
				cACTION::getChecks($db, $table, "s");
				break;
		}
	}

	static public function buildColMeta(&$table) {
		foreach($table["cols"] as $tableType=>$tableCols) {
			foreach($tableCols as $colMeta ) {
				$table["metadata"][$tableType]["colmeta"][$colMeta["col"]]=$colMeta;
				switch($colMeta["coltype"]) {
					case "checkbox":
					case "checkbox1":
					case "checkbox2":
					case "checkbox3":
						$table["metadata"][$tableType]["checkboxCols"][] 	= $colMeta["col"];
						break;
					default:
						$table["metadata"][$tableType]["selectCols"][] 		= $colMeta["col"];
						break;
				}
			}
		}
	}
	
}

class cIMAGE {
	static public function action($db, &$images ) {
		switch( $images["action"] ) {
			case "get":
				cIMAGE::getImages($db, $images);
				break;
			case "savetext":
				cIMAGE::saveText($db, $images);
				break;
			case "saveorder":
				cIMAGE::saveOrder($db, $images);
				break;
			case "delete":
				cIMAGE::deleteImage($db, $images);
				break;
			case "add":
				cIMAGE::addImage($db, $images);
				break;
			case "save":
				cIMAGE::saveImage($db, $images);
				break;
		}
	}
	static public function config(&$images, $scope="", $ownerid="", $mode="list") {
		$images["config"]["access"] 	= 1;
		$images["config"]["scope"] 		= $scope;
		$images["config"]["owner_id"] 	= $ownerid;
		$images["config"]["mode"] 		= $mode;
	}
	static public function filter(&$images, $colName, $colVal) {
		$images["filter"][$colName] = $colVal;
	}
	static public function getImages($db, &$images ) {
		$query_config 		= "SELECT scope, allow_type, max_length, max_size, access, key1, key2, key3 FROM wliu_config WHERE scope = '" . $images["config"]["scope"] . "'";
		if(!$db->exists($query_config)) {
			$images["errorCode"] 		= 1;
			$images["errorMessage"] 	= "Invalid Access Images";
			$images["rows"] 			= array();
		} else {
			$result_config 		= $db->query($query_config);
			$row_config 		= $db->fetch($result_config);
			$images["config"]["scope"]   		= $row_config["scope"];
			$images["config"]["allow_type"]   	= $row_config["allow_type"];
			$images["config"]["max_length"]   	= $row_config["max_length"]?$row_config["max_length"]:0;
			$images["config"]["max_size"]   	= $row_config["max_size"];
			$images["config"]["access"]   		= $row_config["access"];
			$images["config"]["key1"]   		= $row_config["key1"];
			$images["config"]["key2"]   		= $row_config["key2"];
			$images["config"]["key3"]   		= $row_config["key3"];

			$criteria = "deleted=0";
			if($images["config"]["access"]) {
				if( $images["config"]["owner_id"] ) {
					$ccc_owner = "owner_id='" . $images["config"]["owner_id"] . "'";
				} else {
					$ccc_owner = "1=0";
				}
				cTYPE::join($criteria, " AND ", $ccc_owner);
			} 

			if($images["config"]["key1"] ) 	cTYPE::join($criteria, " AND ", "key1='" . $images["keys"]["key1"] . "'");
			if($images["config"]["key2"] ) 	cTYPE::join($criteria, " AND ", "key2='" . $images["keys"]["key2"] . "'");
			if($images["config"]["key3"] ) 	cTYPE::join($criteria, " AND ", "key3='" . $images["keys"]["key3"] . "'");
			foreach( $images["filter"] as $colName=>$colVal ) {
				cTYPE::join($criteria, " AND ", $colName . "='" . $colVal . "'");
			}
			$orderBy = "ORDER BY orderno ASC, last_updated DESC";
			$limit = "LIMIT 0," . $images["config"]["max_length"];
			$query 	= "SELECT id, scope, key1, key2, key3, title_en, title_cn, detail_en, detail_cn, full_name, short_name, ext_name, mime_type, main, orderno, status, guid, token FROM wliu_images WHERE $criteria $orderBy $limit";
			if(DEBUG) $images["query"] = $query;
			$result = $db->query($query);
			$rows   = $db->rows($result);

			if( $images["config"]["mode"]=="edit" ) {
				$imgType = "'origin','large','medium','small','tiny','thumb'";
			} else {
				$imgType = "'" . $images["config"]["thumb"] . "','" . $images["config"]["view"] . "'";
			}

			foreach( $rows as $rowsn=>&$theRow ) {
				$theRow["url"] = $GLOBALS["CFG"]["image_download_template"] . "?token=" . $theRow["token"] . "&id=" . $theRow["id"] . "&sn=" . $theRow["guid"];
				$query_row = "SELECT resize_type, name, ww, hh, width, height, size, data FROM wliu_images_resize WHERE ref_id='" . $theRow["id"] . "' AND resize_type in ($imgType)";
				$result_row = $db->query($query_row);
				while( $row_row = $db->fetch($result_row) ) {
					$image_type = $row_row["resize_type"];
					unset($row_row["resize_type"]);
					$theRow["resize"][$image_type] = $row_row;
				}
			}
			$images["rows"] = $rows;
		}
		unset($images["config"]["access"]);
		unset($images["config"]["owner_id"]);
		unset($images["filter"]);
		return;
	}
	static public function addImage($db, &$images ) {
		if( $images["config"]["mode"]=="edit" ) {		
			$query_config 		= "SELECT scope, max_length, max_size, access, key1, key2, key3 FROM wliu_config WHERE scope = '" . $images["config"]["scope"] . "'";
			if(!$db->exists($query_config)) {
				$images["errorCode"] 		= 1;
				$images["errorMessage"] 	= "Invalid Access Images";
			} else {
				$result_config 		= $db->query($query_config);
				$row_config 		= $db->fetch($result_config);
				$images["config"]["scope"]   		= $row_config["scope"];
				$images["config"]["access"]   		= $row_config["access"];
				
				$images["scope"] 	= $images["config"]["scope"];
				$images["access"] 	= $images["config"]["access"];
			
				$fields = array();
				$fields["scope"]		= $images["scope"];
				$fields["owner_id"] 	= $images["config"]["owner_id"];
				$fields["access"] 		= $images["access"];
				$fields["key1"] 		= $images["key1"];
				$fields["key2"] 		= $images["key2"];
				$fields["key3"] 		= $images["key3"];
				$fields["full_name"] 	= $images["full_name"];
				$fields["short_name"] 	= $images["short_name"];
				$fields["ext_name"] 	= $images["ext_name"];
				$fields["mime_type"] 	= $images["mime_type"];
				$fields["orderno"] 		= $images["orderno"];
				$fields["status"] 		= $images["status"];
				$fields["guid"] 		= $images["guid"];
				$fields["token"] 		= $images["token"];
				$fields["created_time"] = time();
				$fields["last_updated"] = time();
				$images["id"] = $db->insert("wliu_images", $fields);
				foreach( $images["resize"] as $resizType=>$resizeObj ) {
					$fields = array();
					$fields["ref_id"] 		= $images["id"];
					$fields["resize_type"] 	= $resizType;
					$fields["name"] 		= $resizeObj["name"];
					$fields["size"] 		= $resizeObj["size"];
					$fields["ww"] 			= $resizeObj["ww"];
					$fields["hh"] 			= $resizeObj["hh"];
					$fields["width"]		= $resizeObj["width"];
					$fields["height"]		= $resizeObj["height"];
					$fields["data"]			= $resizeObj["data"];
					//echo "$resizType len: " . strlen($fields["data"]). "\n";
					$db->insert("wliu_images_resize", $fields);
				}
				$images["url"] 	= $GLOBALS["CFG"]["image_download_template"] . "?token=" . $images["token"] . "&id=" . $images["id"] . "&sn=" . $images["guid"];
			}
		} else {
			$images["errorCode"] 		= 1;
			$images["errorMessage"] 	= "Images are not allow to edited in list mode";
		}
		unset($images["config"]);
		unset($images["filter"]);
		return;
	}
	static public function saveImage($db, &$images ) {
		if( $images["config"]["mode"]=="edit" ) {		
			$query_img 		= "SELECT * FROM wliu_images WHERE id = '" . $images["id"] . "' AND guid = '" . $images["guid"] . "'";
			if(!$db->exists($query_img)) {
				$images["errorCode"] 		= 1;
				$images["errorMessage"] 	= "Invalid Access Images";
			} else {
				$result_img 	= $db->query($query_img);
				$row_img 		= $db->fetch($result_img);
				if($db->exists($query_img) && $images["config"]["scope"] == $row_img["scope"] && $images["config"]["owner_id"] == $row_img["owner_id"]  )  {
					foreach( $images["resize"] as $resizType=>$resizeObj ) {
						$fields = array();
						//$fields["resize_type"] 	= $resizType;
						$fields["name"] 		= $resizeObj["name"];
						$fields["size"] 		= $resizeObj["size"];
						$fields["ww"] 			= $resizeObj["ww"];
						$fields["hh"] 			= $resizeObj["hh"];
						$fields["width"]		= $resizeObj["width"];
						$fields["height"]		= $resizeObj["height"];
						$fields["data"]			= $resizeObj["data"];
						//echo "$resizType len: " . strlen($fields["data"]). "\n";
						$ccc = array("resize_type"=>$resizType, "ref_id"=>$row_img["id"]);
						$db->update("wliu_images_resize", $ccc, $fields);
					}
				} else {
					$images["errorCode"] 		= 1;
					$images["errorMessage"] 	= "Invalid Access Images";
				}
			}
		} else {
			$images["errorCode"] 		= 1;
			$images["errorMessage"] 	= "Images are not allow to edited in list mode";
		}
		unset($images["resize"]);
		unset($images["config"]);
		return;
	}
	static public function saveText($db, &$images ) {
		if( $images["config"]["mode"]=="edit" ) {		
			$query_img 		= "SELECT * FROM wliu_images WHERE id = '" . $images["id"] . "' AND guid = '" . $images["guid"] . "'";
			if(!$db->exists($query_img)) {
				$images["errorCode"] 		= 1;
				$images["errorMessage"] 	= "Invalid Access Images";
			} else {
				$result_img 	= $db->query($query_img);
				$row_img 		= $db->fetch($result_img);
				if( $images["config"]["scope"] == $row_img["scope"] && $images["config"]["owner_id"] == $row_img["owner_id"]  )  {
					$fields = array();
					$fields["title_en"] 	= $images["title_en"];
					$fields["title_cn"] 	= $images["title_cn"];
					$fields["detail_en"] 	= $images["detail_en"];
					$fields["detail_cn"] 	= $images["detail_cn"];
					$fields["orderno"] 		= $images["orderno"];
					$fields["status"] 		= $images["status"];
					$fields["last_updated"] = time();
					$db->update("wliu_images", $row_img["id"], $fields);
				} else {
					$images["errorCode"] 		= 1;
					$images["errorMessage"] 	= "Invalid Access Images";
				}
			}
		} else {
			$images["errorCode"] 		= 1;
			$images["errorMessage"] 	= "Images are not allow to edited in list mode";
		}
		unset($images["config"]);
		return;
	}
	static public function deleteImage($db, &$images ) {
		if( $images["config"]["mode"]=="edit" ) {		
			$query_img 		= "SELECT * FROM wliu_images WHERE id = '" . $images["id"] . "' AND guid='" . $images["guid"] . "'";
			if(!$db->exists($query_img)) {
				$images["errorCode"] 		= 1;
				$images["errorMessage"] 	= "Invalid Access Images";
			} else {
				$result_img 	= $db->query($query_img);
				$row_img 		= $db->fetch($result_img);
				if($images["config"]["scope"] == $row_img["scope"] && $images["config"]["owner_id"] == $row_img["owner_id"]  )  {
					$db->detach("wliu_images", $row_img["id"]);
				} else {
					$images["errorCode"] 		= 1;
					$images["errorMessage"] 	= "Invalid Access Images";
				}
			}
		} else {
			$images["errorCode"] 		= 1;
			$images["errorMessage"] 	= "Images are not allow to edited in list mode";
		}
		unset($images["config"]);
		return;
	}
	static public function saveOrder($db, &$images ) {
		foreach($images["rows"] as $imgObj) {
			$fields = array();
			$fields["orderno"] 	= $imgObj["sn"];
			$db->update("wliu_images", $imgObj["id"], $fields);
		}
		unset($images["config"]);
		return;
	}
}

class cFILE {
	static public function action($db, &$files ) {
		switch( $files["action"] ) {
			case "get":
				cFILE::getFiles($db, $files);
				break;
			case "savetext":
				cFILE::saveText($db, $files);
				break;
			case "print":
				cFILE::printFile($db, $files);
				break;
			case "delete":
				cFILE::deleteFile($db, $files);
				break;
			case "add":
				cFILE::addFile($db, $files);
				break;
		}
	}
	static public function config(&$files, $scope="", $ownerid="", $mode="list") {
		$files["config"]["access"] 	= 1;
		$files["config"]["scope"] 		= $scope;
		$files["config"]["owner_id"] 	= $ownerid;
		$files["config"]["mode"] 		= $mode;
	}
	static public function filter(&$files, $colName, $colVal) {
		$files["filter"][$colName] = $colVal;
	}
	static public function getFiles($db, &$files ) {
		$query_config 		= "SELECT scope, allow_type, max_length, max_size, access, key1, key2, key3 FROM wliu_config WHERE scope = '" . $files["config"]["scope"] . "'";
		if(!$db->exists($query_config)) {
			$files["errorCode"] 	= 1;
			$files["errorMessage"] 	= "Invalid Access Files";
			$files["rows"] 			= array();
		} else {
			$result_config 		= $db->query($query_config);
			$row_config 		= $db->fetch($result_config);
			$files["config"]["scope"]   	= $row_config["scope"];
			$files["config"]["allow_type"]  = $row_config["allow_type"];
			$files["config"]["max_length"]  = $row_config["max_length"]?$row_config["max_length"]:0;
			$files["config"]["max_size"]   	= $row_config["max_size"];
			$files["config"]["access"]   	= $row_config["access"];
			$files["config"]["key1"]   		= $row_config["key1"];
			$files["config"]["key2"]   		= $row_config["key2"];
			$files["config"]["key3"]   		= $row_config["key3"];

			$criteria = "deleted=0";
			if($files["config"]["access"]) {
				if( $files["config"]["owner_id"] ) {
					$ccc_owner = "owner_id='" . $files["config"]["owner_id"] . "'";
				} else {
					$ccc_owner = "1=0";
				}
				cTYPE::join($criteria, " AND ", $ccc_owner);
			} 

			if($files["config"]["key1"] ) 	cTYPE::join($criteria, " AND ", "key1='" . $files["keys"]["key1"] . "'");
			if($files["config"]["key2"] ) 	cTYPE::join($criteria, " AND ", "key2='" . $files["keys"]["key2"] . "'");
			if($files["config"]["key3"] ) 	cTYPE::join($criteria, " AND ", "key3='" . $files["keys"]["key3"] . "'");
			foreach( $files["filter"] as $colName=>$colVal ) {
				cTYPE::join($criteria, " AND ", $colName . "='" . $colVal . "'");
			}
			$orderBy = "ORDER BY orderno ASC, last_updated DESC";
			$limit = "LIMIT 0," . $files["config"]["max_length"];
			$query 	= "SELECT id, scope, key1, key2, key3, title_en, title_cn, detail_en, detail_cn, full_name, short_name, ext_name, mime_type, main, orderno, status, guid, token FROM wliu_files WHERE $criteria $orderBy $limit";
			if(DEBUG) $files["query"] = $query;
			$result 		= $db->query($query);
			$rows   		= $db->rows($result);
			foreach( $rows as $rowsn=>&$theRow ) {
				$theRow["url"] = $GLOBALS["CFG"]["file_download_template"] . "?token=" . $theRow["token"] . "&id=" . $theRow["id"] . "&sn=" . $theRow["guid"];
			}
			$files["rows"] 	= $rows;
		}
		unset($files["config"]["access"]);
		unset($files["config"]["owner_id"]);
		unset($files["filter"]);
		return;
	}
	static public function addFile($db, &$files ) {
		if( $files["config"]["mode"]=="edit" ) {		
			$query_config 		= "SELECT scope, allow_type, max_length, max_size, access, key1, key2, key3 FROM wliu_config WHERE scope = '" . $files["config"]["scope"] . "'";
			if(!$db->exists($query_config)) {
				$files["errorCode"] 		= 1;
				$files["errorMessage"] 	= "Invalid Access Files";
			} else {
				$result_config 		= $db->query($query_config);
				$row_config 		= $db->fetch($result_config);
				$files["config"]["scope"]   		= $row_config["scope"];
				$files["config"]["access"]   		= $row_config["access"];
				
				$files["scope"] 	= $files["config"]["scope"];
				$files["access"] 	= $files["config"]["access"];
			
				$fields = array();
				$fields["scope"]		= $files["scope"];
				$fields["owner_id"] 	= $files["config"]["owner_id"];
				$fields["access"] 		= $files["access"];
				$fields["key1"] 		= $files["key1"];
				$fields["key2"] 		= $files["key2"];
				$fields["key3"] 		= $files["key3"];
				$fields["full_name"] 	= $files["full_name"];
				$fields["short_name"] 	= $files["short_name"];
				$fields["ext_name"] 	= $files["ext_name"];
				$fields["mime_type"] 	= $files["mime_type"];
				$fields["orderno"] 		= $files["orderno"];
				$fields["status"] 		= $files["status"];
				$fields["guid"] 		= $files["guid"];
				$fields["token"] 		= $files["token"];
				$fields["data"] 		= $files["data"];
				$fields["created_time"] = time();
				$fields["last_updated"] = time();
				$files["id"] = $db->insert("wliu_files", $fields);
				$files["url"] 	= $GLOBALS["CFG"]["file_download_template"] . "?token=" . $files["token"] . "&id=" . $files["id"] . "&sn=" . $files["guid"];
			}
		} else {
			$files["errorCode"] 		= 1;
			$files["errorMessage"] 		= "Files are not allow to edited in list mode";
		}
		unset($files["config"]);
		unset($files["filter"]);
		return;
	}
	static public function saveText($db, &$files ) {
		if( $files["config"]["mode"]=="edit" ) {		
			$query_file 		= "SELECT * FROM wliu_files WHERE id = '" . $files["id"] . "' AND guid = '" . $files["guid"] . "'";
			if(!$db->exists($query_file)) {
				$files["errorCode"] 		= 1;
				$files["errorMessage"] 	= "Invalid Access Files";
			} else {
				$result_file 	= $db->query($query_file);
				$row_file 		= $db->fetch($result_file);
				if( $files["config"]["scope"] == $row_file["scope"] && $files["config"]["owner_id"] == $row_file["owner_id"]  )  {
					$fields = array();
					$fields["title_en"] 	= $files["title_en"];
					$fields["title_cn"] 	= $files["title_cn"];
					$fields["detail_en"] 	= $files["detail_en"];
					$fields["detail_cn"] 	= $files["detail_cn"];
					$fields["orderno"] 		= $files["orderno"];
					$fields["status"] 		= $files["status"];
					$fields["last_updated"] = time();
					$db->update("wliu_files", $row_file["id"], $fields);
				} else {
					$files["errorCode"] 		= 1;
					$files["errorMessage"] 	= "Invalid Access Files";
				}
			}
		} else {
			$files["errorCode"] 		= 1;
			$files["errorMessage"] 	= "Files are not allow to edited in list mode";
		}
		unset($files["config"]);
		return;
	}
	static public function printFile($db, &$files ) {
		if( $files["config"]["mode"]=="edit" ) {		
			$query_file 		= "SELECT * FROM wliu_files WHERE id = '" . $files["id"] . "' AND guid = '" . $files["guid"] . "'";
			if(!$db->exists($query_file)) {
				$files["errorCode"] 		= 1;
				$files["errorMessage"] 	= "Invalid Access Files";
			} else {
				$result_file 	= $db->query($query_file);
				$row_file 		= $db->fetch($result_file);
				if( $files["config"]["scope"] == $row_file["scope"] ) {
					if($files["config"]["access"] == 1 ) {
						if( $files["config"]["owner_id"] == $row_file["owner_id"] ) {
							$result_data = $db->query("SELECT data FROM wliu_files WHERE deleted=0 AND id='". $row_file["id"] . "'");
							$row_data = $db->fetch($result_data);
							$files["data"] = $row_data["data"];
						} else {
							$files["errorCode"] 		= 1;
							$files["errorMessage"] 	= "Invalid Access Files";
						}
					} else {
						$result_data = $db->query("SELECT data FROM wliu_files WHERE deleted=0 AND id='". $row_file["id"] . "'");
						$row_data = $db->fetch($result_data);
						$files["data"] = $row_data["data"];
					}
				} else {
					$files["errorCode"] 		= 1;
					$files["errorMessage"] 	= "Invalid Access Files";
				}
			}
		} else {
			$files["errorCode"] 	= 1;
			$files["errorMessage"] 	= "Files are not allow to print";
		}
		unset($files["config"]);
		return;
	}

	static public function deleteFile($db, &$files ) {
		if( $files["config"]["mode"]=="edit" ) {		
			$query_file 		= "SELECT * FROM wliu_files WHERE id = '" . $files["id"] . "' AND guid = '" .  $files["guid"] . "'";
			if(!$db->exists($query_file)) {
				$files["errorCode"] 		= 1;
				$files["errorMessage"] 	= "Invalid Access Files";
			} else {
				$result_file 	= $db->query($query_file);
				$row_file 		= $db->fetch($result_file);
				if( $files["config"]["scope"] == $row_file["scope"] && $files["config"]["owner_id"] == $row_file["owner_id"]  )  {
					$db->detach("wliu_files", $row_file["id"]);
				} else {
					$files["errorCode"] 		= 1;
					$files["errorMessage"] 	= "Invalid Access Files";
				}
			}
		} else {
			$files["errorCode"] 		= 1;
			$files["errorMessage"] 	= "Files are not allow to edited in list mode";
		}
		unset($files["config"]);
		return;
	}
	static public function saveOrder($db, &$files ) {
		foreach($files["rows"] as $fileObj) {
			$fields = array();
			$fields["orderno"] 	= $fileObj["sn"];
			$db->update("wliu_images", $fileObj["id"], $fields);
		}
		unset($files["config"]);
		return;
	}
}

class cLIST {
	static public function getList($db, &$table) {
		$listMeta = $table["listTable"];
		foreach( $table["lists"] as $listName=>&$listObj ) {
			$list = array();
			$colMeta = $listMeta[$listName];
		
			$table1 = $colMeta["table1"];
			$table1Name = $table1["name"];
			$key1 	= "a." . $table1["key"] . 	" as id";
			$fkey1 	= "a." . $table1["fkey"];
			$value1 = "a." . $table1["value"] . " as title";
			$desc1  = $table1["desc"]?"a." . $table1["desc"] . " as description":"";
			$cols1  = $key1 . ", " . $value1 . ($desc1?", " . $desc1: "");

			$table2 = $colMeta["table2"];
			$table2Name = $table2["name"];
			$key2 	= "a." . $table2["key"] . " as id";
			$fkey2 	= "a." . $table2["fkey"];
			$value2 = "a." . $table2["value"] . " as title";
			$desc2  = $table2["desc"]?"a." . $table2["desc"] . " as description":"";
			$cols2  = $key2 . ", " . $value2 . ($desc2?", " . $desc2: "");

			$table3 = $colMeta["table3"];
			$table3Name = $table3["name"];
			$key3 	= "a." . $table3["key"] . " as id";
			$fkey3 	= "a." . $table3["fkey"];
			$value3 = "a." . $table3["value"] . " as title";
			$desc3  = $table3["desc"]?"a." . $table3["desc"] . " as description":"";
			$cols3  = $key3 . ", " . $value3 . ($desc3?", " . $desc3: "");
		
		
			switch( $colMeta["type"] ) {
				case "list1":
					$query1 = "SELECT $cols1 FROM $table1Name a WHERE deleted <> 1 AND status = 1 ORDER BY orderno DESC, title ASC";
					$result1     = $db->query($query1);
                    $cnt1        = 0;
                    while( $row1 = $db->fetch($result1)) {
                        $list[$cnt1]["key"]      = $row1["id"];     
                        $list[$cnt1]["value"]    = $row1["title"];
                        $list[$cnt1]["desc"]     = $row1["description"];     
                        $cnt1++;
                    } 
					break;
				case "list2":
					$query1 = "SELECT $cols1 FROM $table1Name a WHERE deleted <> 1 AND status = 1 ORDER BY orderno DESC, title ASC";
					if($table1Name==$table2Name) $query1 = "SELECT $cols1 FROM $table1Name a WHERE deleted <> 1 AND status = 1 AND $fkey1 = '0' ORDER BY orderno DESC, title ASC";
					$result1     = $db->query($query1);
                    $cnt1        = 0;
                    while( $row1 = $db->fetch($result1)) {
                        $id1 					= $row1["id"];
						$list[$cnt1]["key"]     = $id1;     
                        $list[$cnt1]["value"]   = $row1["title"];
                        $list[$cnt1]["desc"]    = $row1["description"];
						$list[$cnt1]["list"] 	= array();

						$query2 = "SELECT $cols2 FROM $table2Name a WHERE deleted <> 1 AND status = 1 AND $fkey2 = '" . $id1 . "' ORDER BY orderno DESC, title ASC";
						$result2     = $db->query($query2);
						$cnt2        = 0;
						$list2  	 = array();
						while( $row2 = $db->fetch($result2)) {
							$list2[$cnt2]["key"]    = $row2["id"];     
							$list2[$cnt2]["value"]  = $row2["title"];
							$list2[$cnt2]["desc"]   = $row2["description"];
	                        $cnt2++;
						}
						$list[$cnt1]["list"] = $list2;

                        $cnt1++;
                    } 
					break;
				case "list3":
					$query1 = "SELECT $cols1 FROM $table1Name a WHERE deleted <> 1 AND status = 1 ORDER BY orderno DESC, title ASC";
					if($table1Name==$table2Name) $query1 = "SELECT $cols1 FROM $table1Name a WHERE deleted <> 1 AND status = 1 AND $fkey1 = '0' ORDER BY orderno DESC, title ASC";
					$result1     = $db->query($query1);
                    $cnt1        = 0;
                    while( $row1 = $db->fetch($result1)) {
                        $id1 					= $row1["id"];
						$list[$cnt1]["key"]     = $id1;     
                        $list[$cnt1]["value"]   = $row1["title"];
                        $list[$cnt1]["desc"]    = $row1["description"];
						$list[$cnt1]["list"] 	= array();

						$query2 = "SELECT $cols2 FROM $table2Name a WHERE deleted <> 1 AND status = 1 AND $fkey2 = '" . $id1 . "' ORDER BY orderno DESC, title ASC";
						$result2     = $db->query($query2);
						$cnt2        = 0;
						$list2  	 = array();
						while( $row2 = $db->fetch($result2)) {
							$id2 					= $row2["id"];
							$list2[$cnt2]["key"]    = $id2;     
							$list2[$cnt2]["value"]  = $row2["title"];
							$list2[$cnt2]["desc"]   = $row2["description"];
							$list2[$cnt2]["list"]   = array();
	                        

							$query3 = "SELECT $cols3 FROM $table3Name a WHERE deleted <> 1 AND status = 1 AND $fkey3 = '" . $id2 . "' ORDER BY orderno DESC, title ASC";
							$result3     = $db->query($query3);
							$cnt3        = 0;
							$list3  	 = array();
							while( $row3 = $db->fetch($result3)) {
								$list3[$cnt3]["key"]    = $row3["id"];     
								$list3[$cnt3]["value"]  = $row3["title"];
								$list3[$cnt3]["desc"]   = $row3["description"];
								$cnt3++;
							}
							$list2[$cnt2]["list"] = $list3;
							$cnt2++;
						}
						$list[$cnt1]["list"] = $list2;
                        $cnt1++;
                    } 
					break;

				case "cate1":
					$query1 = "SELECT $cols1 FROM website_basic_info a INNER JOIN website_basic_table b ON (a.ref_id = b.id) 
													WHERE a.deleted <> 1 AND a.status =1 AND b.table_name='" . $table1Name . "' ORDER BY a.orderno DESC, title ASC;";
					//echo "query1: " . $query1;
					$result1     = $db->query($query1);
                    $cnt1        = 0;
                    while( $row1 = $db->fetch($result1)) {
                        $list[$cnt1]["key"]      = $row1["id"];     
                        $list[$cnt1]["value"]    = $row1["title"];
                        $list[$cnt1]["desc"]     = $row1["description"];     
                        $cnt1++;
                    } 
					break;
				case "cate2":
					$query1 = "SELECT $cols1 FROM website_basic_info a INNER JOIN website_basic_table b ON (a.ref_id = b.id) 
													WHERE a.deleted <> 1 AND a.status =1 AND b.table_name='" . $table1Name . "' AND $fkey1 = '0' ORDER BY a.orderno DESC, title ASC;";
					//echo "query1: " . $query1;
					$result1     = $db->query($query1);
                    $cnt1        = 0;
                    while( $row1 = $db->fetch($result1)) {
						$id1 					= $row1["id"];
                        $list[$cnt1]["key"]     = $id1;     
                        $list[$cnt1]["value"]   = $row1["title"];
                        $list[$cnt1]["desc"]    = $row1["description"];     
						$list[$cnt1]["list"] 	= array();

						$query2 = "SELECT $cols2 FROM website_basic_info a INNER JOIN website_basic_table b ON (a.ref_id = b.id) 
													WHERE a.deleted <> 1 AND a.status =1 AND b.table_name='" . $table2Name . "' AND $fkey2 = '" . $id1 . "'  ORDER BY a.orderno DESC, title ASC;";
						$result2     = $db->query($query2);
						$cnt2        = 0;
						$list2  	 = array();
						while( $row2 = $db->fetch($result2)) {
							$list2[$cnt2]["key"]    = $row2["id"];     
							$list2[$cnt2]["value"]  = $row2["title"];
							$list2[$cnt2]["desc"]   = $row2["description"];
	                        $cnt2++;
						}
						$list[$cnt1]["list"] = $list2;
						$cnt1++;
                    } 
					break;
				case "cate3":
					$query1 = "SELECT $cols1 FROM website_basic_info a INNER JOIN website_basic_table b ON (a.ref_id = b.id) 
													WHERE a.deleted <> 1 AND a.status =1 AND b.table_name='" . $table1Name . "' AND $fkey1 = '0' ORDER BY a.orderno DESC, title ASC;";
					//echo "query1: " . $query1;
					$result1     = $db->query($query1);
                    $cnt1        = 0;
                    while( $row1 = $db->fetch($result1)) {
						$id1 					= $row1["id"];
                        $list[$cnt1]["key"]     = $id1;     
                        $list[$cnt1]["value"]   = $row1["title"];
                        $list[$cnt1]["desc"]    = $row1["description"];     
						$list[$cnt1]["list"] 	= array();

						$query2 = "SELECT $cols2 FROM website_basic_info a INNER JOIN website_basic_table b ON (a.ref_id = b.id) 
													WHERE a.deleted <> 1 AND a.status =1 AND b.table_name='" . $table2Name . "' AND $fkey2 = '" . $id1 . "'  ORDER BY a.orderno DESC, title ASC;";
						$result2     = $db->query($query2);
						$cnt2        = 0;
						$list2  	 = array();
						while( $row2 = $db->fetch($result2)) {
							$id2 					= $row2["id"];
							$list2[$cnt2]["key"]    = $id2;     
							$list2[$cnt2]["value"]  = $row2["title"];
							$list2[$cnt2]["desc"]   = $row2["description"];
							$list2[$cnt2]["list"]   = array();

							$query3 = "SELECT $cols3 FROM website_basic_info a INNER JOIN website_basic_table b ON (a.ref_id = b.id) 
											WHERE a.deleted <> 1 AND a.status =1 AND b.table_name='" . $table3Name . "' AND $fkey3 = '" . $id2 . "'  ORDER BY a.orderno DESC, title ASC;";
							$result3     = $db->query($query3);
							$cnt3        = 0;
							$list3  	 = array();
							while( $row3 = $db->fetch($result3)) {
								$list3[$cnt3]["key"]    = $row3["id"];     
								$list3[$cnt3]["value"]  = $row3["title"];
								$list3[$cnt3]["desc"]   = $row3["description"];
								$cnt3++;
							}
							$list2[$cnt2]["list"] = $list3;
	                        $cnt2++;
						}
						$list[$cnt1]["list"] = $list2;
						$cnt1++;
                    } 
					break;
			}
			$listObj["loaded"] 			= 1;
			$listObj["keys"] 			= array();
			$listObj["keys"]["guid"] 	= "";
			$listObj["keys"]["name"] 	= "";
			$listObj["list"] 			= $list;
		}
		//print_r($listMeta);
	}
}
/***********************************************************************************************/
/*																							   */
/***********************************************************************************************/
class cARRAY {
	static public function arrayFilter($arr, $kv) {
        $ret = array();
        foreach($arr as $ar ) {
                $match = true;
                if(is_array($kv) ) {
                    foreach($kv as $key=>$val) {
                        if( $ar[$key]!=$val ) {
                            $match=false;
                            break;
                        }
                    }
                } else {
                    $match = false;
                }
                if($match) $ret[] = $ar;
        }
        return $ret;
	}
	static public function arrayIndex($arr, $kv ) {
		$ret_idx = -1;
		$match = true;
		foreach($arr as $idx=>$obj) {
			$match = true;
			foreach( $kv as $key=>$val ) {
				if( $obj[$key] != $val ) $match = false; 
			}

			if($match) {
				$ret_idx = $idx;
				break;
			}
		}
		return $ret_idx;
	}

	static public function arrayMerge($arr1, $arr2) {
		return array_merge($arr1, $arr2);
	}
}

class cTYPE {
	static public function join(&$str1, $sp, $str2 ) {
		if( $str1!="" && $str2!="" )
			$str1 = $str1 . $sp . $str2;
		else 
			$str1 = $str1 . $str2;

		return $str1;
	}

	static public function quote( $str ) {
		//return str_replace(array("'"), array("\'"), $str);
		return $str;
	}
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
		} elseif(strpos($date_part, ":") != false) {
			$ttt = explode(":", $date_part);
			$hh_digit = intval($ttt[0]);
			$mm_digit = intval($ttt[1]);
			$ss_digit = floatval($ttt[2]);
			$mk_tt = $hh_digit * 3600 + $mm_digit * 60 + $ss_digit;
			return $mk_tt;
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
?>
