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
	public function express($p_col, $oper, $p_val, $searchArr, $replaceArr) {
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
	public function selectCols($colArr) {
		$ret_str = "";
		if( is_array($colArr) ) {
			foreach( $colArr as $col ) {
				cTYPE::join($ret_str, ", ", "$col"); 
			}
		}
		return $ret_str;
	}
	/*************** Relational Table Functions ***********************************/
	public function tree(&$table) {
		switch( $table["metadata"]["type"] ) {
			case 2: 
				$ptable = $table["metadata"]["p"];
				$stable = $table["metadata"]["s"];

				$ptable["rows"] = $this->treeNodes($table, "p", $table["rootid"]);
				foreach($ptable["rows"] as &$prow) {
					$pkeyDBCol = $ptable["colmeta"][ $ptable["keys"][0] ]["name"];
					$prow["rows"] = $this->treeNodes($table, "s", $prow[$pkeyDBCol]);
				}
				$table["rows"] = $ptable["rows"];
				break;
			case 3:
				$ptable = $table["metadata"]["p"];
				$stable = $table["metadata"]["s"];
				$mtable = $table["metadata"]["m"];

				$ptable["rows"] = $this->treeNodes($table, "p",  $table["rootid"]);
				foreach($ptable["rows"] as &$prow) {
					$pkeyDBCol = $ptable["colmeta"][ $ptable["keys"][0] ]["name"];
					$prow["rows"] = $this->treeNodes($table, "s", $prow[$pkeyDBCol]);

					foreach($prow["rows"] as &$srow) {
						$skeyDBCol = $stable["colmeta"][$stable["keys"][0]]["name"];
						$srow["rows"] = $this->treeNodes($table, "m", $srow[$skeyDBCol]);
					}
				}
				$table["rows"] = $ptable["rows"];
				break;
			case 4:
				break;
		}
	}
	
	public function treeNodes(&$table, $tableLevel, $parent_id) {
		$otable	= $table["metadata"][$tableLevel];
		// 1. select cols 
        $colstr = cACTION::buildSelect($otable, "", $table["lang"]);
	
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
		foreach($otable["filter"] as $fcol=>$fval) {
			cTYPE::join($criteria, " AND ", $otable["type"] . "." . $fcol . "=" . "'". $this->quote($fval) ."'");
		}
		cTYPE::join($criteria, " AND ", $otable["type"] . ".deleted=0");
		cTYPE::join($criteria, " AND ", $fk_criteria);
		//cTYPE::join($criteria, " AND ", $table["criteria"]);

		// 4. update navi first, and create orderby and limitation string 
		$orderByLimit = "ORDER BY orderno DESC";

		// 5.  completed  select query string 
		$query = "SELECT $colstr FROM $joinLink WHERE $criteria $orderByLimit";	
 
		//Debug Query 
		if(DEBUG) { $table["query"] = $query; $table["criteria"] = $criteria; }

		$result = $this->query($query);
		$rows 	= $this->rows($result);
		cTREE::getChecks($this, $table, $tableLevel, $rows);
		return $rows;
	}

	public function treeSave(&$table) {
		foreach( $table["rows"] as &$row ) {
			$tableLevel = $row["type"];
			$otable	= $table["metadata"][$tableLevel];
			switch($row["rowstate"]) {
				case 0:
					break;
				case 1: 
					//print_r($table);
					if( $table["rights"]["save"] ) {
						$keyCols = cTREE::getKeys($table, $row);
						//print_r($keyCols);
						if($row["error"]["errorCode"] <= 0) {
							$updCols = cTREE::getUpdateCols($table, $row);
							//print_r($updCols);
							if(	count($updCols["fields"]) >0 ) {
								$updCols["fields"] = cARRAY::arrayMerge($updCols["fields"], $otable["update"]);
								$updCols["fields"] = cARRAY::arrayMerge($updCols["fields"], array("last_updated"=>time()));
								$this->update($otable["name"], $keyCols["keys"], $updCols["fields"]);
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
							$dbCols = cTREE::getInsertCols($table, $row);
							if(	count($dbCols["fields"]) >0 ) {
								$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], $otable["insert"]);
								$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], array("created_time"=>time(), "deleted"=>0));
								$insertID = $this->insert($otable["name"], $dbCols["fields"]);
								cTREE::setKeys($table, $row, $insertID);
							}
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
						$keyCols = cTREE::getKeys($table, $row);
						if($row["error"]["errorCode"] <= 0) {
							$this->update($otable["name"], $keyCols["keys"], array("last_updated"=>time()));
							$this->detach($otable["name"], $keyCols["keys"]);
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

	public function one(&$table) {
		$ptable	= $table["metadata"]["p"];

		// 1. select cols 
        $colstr = cACTION::buildSelect($ptable, "", $table["lang"]);

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
						if($row["error"]["errorCode"] <= 0) {
							$dbCols = cACTION::getInsertCols($table, "p", $row);
							if(	count($dbCols["fields"]) >0 ) {
								$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], $ptable["insert"]);
								$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], array("created_time"=>time(), "deleted"=>0));
								$insertID = $this->insert($ptable["name"], $dbCols["fields"]);
								cACTION::setKeys($table, "p", $row, $insertID);
							}
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
		$colstr = cACTION::buildSelect($ptable, "", $table["lang"]);
		cTYPE::join( $colstr, ", ", cACTION::buildSelect($stable, "", $table["lang"]) );

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
		$pcolstr = cACTION::buildSelect($ptable, "", $table["lang"]);
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
		$colstr = cACTION::buildSelect($ptable, "", $table["lang"]);
		cTYPE::join( $colstr, ", ", cACTION::buildSelect($stable, "", $table["lang"]) );

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
		$pcolstr = cACTION::buildSelect($ptable, "", $table["lang"]);
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
		$pcolstr = cACTION::buildSelect($ptable, "", $table["lang"]);
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
        $mmcolstr = cACTION::buildSelect($ptable, "", $table["lang"]);
		cTYPE::join( $mmcolstr, ", ", cACTION::buildSelect($mtable, "mm", $table["lang"]) );
		// many to many,  s left join ( select * from p inner join m  ) c  
		$mmname = $mtable["name"] . " mm";
		$mmjoinLink = "SELECT $mmcolstr FROM $pname INNER JOIN $mmname ON ( $mmjoinOn )";

		// 2.3 s table select cols
        $scolstr = cACTION::buildSelect($stable, "", $table["lang"]);

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
		$pcolstr = cACTION::buildSelect($ptable, "", $table["lang"]);
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
		$pcolstr = cACTION::buildSelect($ptable, "", $table["lang"]);
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
				case "custom":
					break;
				default:
					$table["metadata"][$colMeta["table"]]["selectCols"][] = $colMeta["col"];
					break;
			}
		}
	}
	static public function buildSelect($otable, $otype="", $lang="") {
        $colstr = "";
		foreach($otable["selectCols"] as $oCol) {
			$dbColName 	= $otable["colmeta"][$oCol]["name"]?$otable["colmeta"][$oCol]["name"]:$oCol;
			$dbCol 		= ($otype?$otype:$otable["type"]) . "." . $oCol . " AS " . $dbColName;
			if( $otable["colmeta"][$oCol]["trans"] )  $dbCol = cLANG::col( ($otype?$otype:$otable["type"]) . "." . $oCol, $lang, $dbColName);
			cTYPE::join( $colstr, ", ", $dbCol); 
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
					$ckMeta = $table["metadata"][$tableType][$dbCol];
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
							$row[$dbColName][] = $ckRow[$ckMeta["value"]];
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
							$ckMeta 	= $table["metadata"][$tableLevel][$dbCol];
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
							unset($theCol["trans"]);
							unset($theCol["sort"]);
							unset($theCol["list"]);

							unset($theCol["targetid"]);
							unset($theCol["tooltip"]);

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
		//if(!DEBUG) unset($table["rights"]);  // need to sync rights for front-end secure, front-end right should controlled by server-side
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
						case "custom":
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
									case "custom":
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
										$theCol["errorMessage"] 		= "'" . $dispName . "' is required.";  
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
				cVALIDATE::validate($table);
				cTREE::checkUniques($db, $table);
				cTREE::saveRows($db, $table);
				break;
		}
		//cACTION::getRowArray($table);
		$table["success"] = $table["error"]["errorCode"]?0:$table["success"];
	}

	static public function getRows($db, &$table) {
		$db->tree($table);
	}
	static public function saveRows($db, &$table) {
		$db->treeSave($table);
		cTREE::saveChecks($db, $table);
	}
	static public function getKeys(&$table, &$row) {
	    $dbCols = array();
		$dbCols["keys"] = array();
		$tableLevel 	= $row["type"];
		$otable 		= $table["metadata"][$tableLevel];
		foreach( $otable["keys"] as $oidx=>$okey ) {
			$tmpIdx 	= cARRAY::arrayIndex($row["cols"], array("col"=>$okey, "table"=>$tableLevel));
			$colObj 	= $row["cols"][$tmpIdx];
			if($colObj["value"]) {
				$dbCols["keys"][$okey] = $colObj["value"];
			} else {
				$table["success"] 				= 0;
				$row["error"]["errorCode"] 		= 9;
				$row["error"]["errorMessage"] 	= "Primary Key is empty.";
			} 
		}
		return $dbCols;
	}
	static public function setKeys(&$table, &$row, $insertID) {
		$tableLevel = $row["type"];
		$otable = $table["metadata"][$tableLevel];
		//first key is auto-increase 
		$tmpIdx = cARRAY::arrayIndex($row["cols"], array("col"=>$otable["keys"][0], "table"=>$tableLevel));
		$row["cols"][$tmpIdx]["value"]=$insertID;
	}
	static public function getUpdateCols(&$table, &$row) {
	    $dbCols = array();
		$dbCols["fields"] 	= array();
		$tableLevel 		= $row["type"];
		$otable 			= $table["metadata"][$tableLevel];
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
						case "custom":
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
	static public function getInsertCols(&$table, &$row) {
	    $dbCols = array();
		$dbCols["fields"] 	= array();
		$tableLevel 		= $row["type"];
		$otable 			= $table["metadata"][$tableLevel];
		foreach( $row["cols"] as &$colObj ) {
			if($colObj["table"]==$otable["type"]) {
				$fieldName 	= $colObj["col"];
				$colVal     = trim($colObj["value"]);
				if( in_array($fieldName, $otable["cols"]) ) {
					if( !in_array($fieldName, $otable["keys"]) && !in_array($fieldName, $otable["fkeys"]) ) {
						switch( $colObj["coltype"] ) {
							case "checkbox":
							case "checkbox1":
							case "checkbox2":
							case "checkbox3":
								break;
							case "custom":
								break;
							default:
								$dbCols["fields"][$fieldName] = $colVal;
								// only return key col value , other col value set to empty to avoid trafic 
								break;
						}
					} else {
						//if composed keys,  first key is auto-increase,  the rest of keys should has fixed value;
						//if only first key set to empty,
						$first_pkey = $otable["keys"][0];
						if($first_pkey!=$fieldName)
							$dbCols["fields"][$fieldName] = $colVal;  
					}
				}
			}
		}				
		$dbCols["fields"][$otable["fkeys"][0]] = $row["parent"];
		return $dbCols;
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
					case "custom":
						break;
					default:
						$table["metadata"][$tableType]["selectCols"][] 		= $colMeta["col"];
						break;
				}
			}
		}
	}
    static public function checkUniques($db, &$table) {
		$is_unique 		= true;
		foreach($table["rows"] as &$theRow ) {
			$tableLevel 	= $theRow["type"];
			$otable 		= $table["metadata"][$tableLevel];
			$uCols 			= cARRAY::arrayFilter($otable["colmeta"], array("unique"=>1));
			//print_r($uCols);
			foreach( $uCols as $uCol ) {
				if( in_array( $uCol["col"], $otable["selectCols"] ) ) {
						$cidx = cARRAY::arrayIndex( $theRow["cols"], array("col"=>$uCol["col"], "table"=>$tableLevel) );
						$theCol = $theRow["cols"][$cidx];
						$valKV  = array( $uCol["col"]=>$theCol["value"] );
						
						$keyKV 	= array();

						$rKeys = $otable["keys"];
						foreach( $rKeys as $rkey) {
							$temp_cidx = cARRAY::arrayIndex( $theRow["cols"], array("col"=>$rkey, "table"=>$tableLevel)  );
							$rCol = $theRow["cols"][$temp_cidx];
							$keyKV[$rkey] = $rCol["value"];
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
			} // foreach
		}
		return $is_unique;
	}
	static public function getChecks($db, &$table, $tableLevel, &$rows) {
		foreach($rows as &$theRow) {
		    $otable 	= $table["metadata"][$tableLevel];
			//print_r($otable);
			foreach( $otable["checkboxCols"] as $dbCol ) {
					$ckMeta = $otable[$dbCol];
					
					if( $ckMeta["name"] ) {
						$ccc = array();
						$okey 		= $otable["keys"][0];
						$okeyDBCol  = $otable["colmeta"][$okey]["name"];

						$ccc[$ckMeta["keys"][0]] = $theRow[$okeyDBCol];
						$ccc[$ckMeta["keys"][1]] = $table["refid"];
						$fields 		= array();
						$fields[] 		= $ckMeta["value"];
						$ckResult 		= $db->select( $ckMeta["name"], $fields, $ccc );	
						$ckRows  		= $db->rows($ckResult);
						$dbColName 		= $otable["colmeta"][$dbCol]["name"]?$otable["colmeta"][$dbCol]["name"]:$dbCol;
						$theRow[$dbColName] 	= array();
						foreach( $ckRows as $ckRow ) {
							$theRow[$dbColName][] = $ckRow[$ckMeta["value"]];
						}
					} else {
						$theRow[$dbColName] = array();
					}
			}
		}
	}
	static public function saveChecks($db, &$table) {
		foreach( $table["rows"] as &$row ) {
			$tableLevel = $row["type"];
		    $otable 	= $table["metadata"][$tableLevel];
			if( ($row["rowstate"]==1 || $row["rowstate"]==2) && $row["error"]["errorCode"]==0 ) {
				foreach( $otable["checkboxCols"] as $dbCol) {
					$ckColIdx = cARRAY::arrayIndex($row["cols"], array("col"=>$dbCol, "table"=>$tableLevel) );
					$flag = true;
					if($ckColIdx>=0) {
							$ckCol 		= $row["cols"][$ckColIdx];
							$ckValue 	= $ckCol["value"];
							$ckMeta 	= $otable[$dbCol];
							
							$okey 		= $otable["keys"][0];
							$okeyIdx 	= cARRAY::arrayIndex($row["cols"], array("col"=>$okey, "table"=>$tableLevel));

							$ccc[$ckMeta["keys"][0]] = $row["cols"][$okeyIdx]["value"];
							if($ccc[$ckMeta["keys"][0]]=="") $flag=false;
							$ccc[$ckMeta["keys"][1]] = $table["refid"];
							if($ccc[$ckMeta["keys"][1]]=="") $flag=false;

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
					}
				} // foreach
			}	
		} // foreach
	}
	static public function clearRows(&$table) {
		if(!DEBUG) unset($table["cols"]);
		if(!DEBUG) unset($table["filters"]);
		if(!DEBUG) unset($table["criteria"]);
		if(!DEBUG) unset($table["criteria_prmiary"]);
		if(!DEBUG) unset($table["query"]);
		//if(!DEBUG) unset($table["rights"]);  // need to sync rights for front-end secure, front-end right should controlled by server-side
		if(!DEBUG) unset($table["listTable"]);
		if(!DEBUG) unset($table["metadata"]);
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

class cLANG {
	public static $support = array("cn", "en", "tw");
	public static function getWords($lang="") {
		global $CFG;
		global $GLang;
		$trans_lang = $lang;
		$def_lang 	= cLANG::$support[0];

		$lang 		= $lang?$lang:$GLang;
		$lang 		= $lang?$lang:$def_lang;
		$lang 		= in_array($lang, cLANG::$support)?$lang:$def_lang;
		$lang 		= $lang=="tw"?"cn":$lang;

		$other_lang = $lang==$def_lang?cLANG::$support[1]:$def_lang;

		$query_lang		= "SELECT keyword, IF($lang!='', $lang, $other_lang) AS lang  FROM web_language WHERE deleted <> 1";
		$db_lang 		= new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
		$result_lang 	= $db_lang->query($query_lang);
		$words 			= array();
		while($row_lang = $db_lang->fetch($result_lang)) {
			$words[$row_lang["keyword"]] = $row_lang["lang"]?cLANG::trans($row_lang["lang"], $trans_lang):$row_lang["keyword"];
		}
		$db_lang->close();
		return $words;
	}
	public static function replace($word, $arr) {
		foreach($arr as $akey=>$aval) {
			$word = str_replace('{{' . $akey . '}}', $aval, $word);
		}
		return $word;
	}
	public static function col($col, $lang="", $alias="") {
		global $CFG;
		global $GLang;
		$def_lang 	= cLANG::$support[0];
		$lang 		= $lang?$lang:$GLang;	
		$lang 		= $lang?$lang:$def_lang;
		$lang 		= in_array($lang, cLANG::$support)?$lang:$def_lang;
		$lang 		= $lang=="tw"?"cn":$lang;
		$other_lang = $lang==$def_lang?cLANG::$support[1]:$def_lang;
		

		$dbcol 		= $col . "_" . $lang;
		$dbother 	= $col . "_" . $other_lang;
		$dbalias 	= $alias?$alias:$col;
		$ret_col 	= "IF($dbcol!='', $dbcol, $dbother) AS $dbalias"; 
		return $ret_col;
	}
	public static function langCol($col, $lang="") {
		global $GLang;
		$def_lang 	= cLANG::$support[0];
		$lang 		= $lang?$lang:$GLang;
		$lang 		= $lang?$lang:$def_lang;
		$lang 		= in_array($lang, cLANG::$support)?$lang:$def_lang;
		$lang 		= $lang=="tw"?"cn":$lang;
		$ret_col 	= $col . "_" . $lang; 
		return $ret_col;
	}
    public static function trans($str, $lang="") {
		global $GLang;
		$lang = $lang?$lang:$GLang;
        switch($lang) {
            case "cn":
                $str = self::toCN($str);
                break;
            case "tw":
                $str = self::toTW($str);
                break;
            default:
                break;
        }
        return $str;
    }
    public static function toTW ($str) {  
            $str_t = '';  
            $len = strlen($str);  
            $a = 0;  
            while ($a < $len){  
                    if (ord($str{$a})>=224 && ord($str{$a})<=239){  
                            if (($temp = strpos( self::$utf8_cn, $str{$a} . $str{$a+1} . $str{$a+2})) !== false){  
                                    $str_t .= self::$utf8_tw{$temp} . self::$utf8_tw{$temp+1} . self::$utf8_tw{$temp+2};  
                                    $a += 3;  
                                    continue;  
                            }  
                    }  
                    $str_t .= $str{$a};  
                    $a += 1;  
            } 
            return $str_t;  
    }  
    public static function toCN($str) {  
            $str_t = '';  
            $len = strlen($str);  
            $a = 0;  
            while ($a < $len){  
                    if (ord($str{$a})>=224 && ord($str{$a})<=239){  
                            if (($temp = strpos( self::$utf8_tw, $str{$a} . $str{$a+1} . $str{$a+2})) !== false){  
                                    $str_t .= self::$utf8_cn{$temp} . self::$utf8_cn{$temp+1} . self::$utf8_cn{$temp+2};  
                                    $a += 3;  
                                    continue;  
                            }  
                    }  
                    $str_t .= $str{$a};  
                    $a += 1;  
            } 
            return $str_t;  
    } 
	static private $utf8_cn = "么万与丑专业丛东丝丢两严丧个丬丰临为丽举么义乌乐乔习乡书买乱争于亏云亘亚产亩亲亵亸亿仅从仑仓仪们价众优伙会伛伞伟传伤伥伦伧伪伫体余佣佥侠侣侥侦侧侨侩侪侬俣俦俨俩俪俭债倾偬偻偾偿傥傧储傩儿兑兖党兰关兴兹养兽冁内冈册写军农冢冯冲决况冻净凄凉凌减凑凛几凤凫凭凯击凼凿刍划刘则刚创删别刬刭刽刿剀剂剐剑剥剧劝办务劢动励劲劳势勋勐勚匀匦匮区医华协单卖卢卤卧卫却卺厂厅历厉压厌厍厕厢厣厦厨厩厮县参叆叇双发变叙叠叶号叹叽吁后吓吕吗吣吨听启吴呒呓呕呖呗员呙呛呜咏咔咙咛咝咤咴咸哌响哑哒哓哔哕哗哙哜哝哟唛唝唠唡唢唣唤唿啧啬啭啮啰啴啸喷喽喾嗫呵嗳嘘嘤嘱噜噼嚣嚯团园囱围囵国图圆圣圹场坂坏块坚坛坜坝坞坟坠垄垅垆垒垦垧垩垫垭垯垱垲垴埘埙埚埝埯堑堕塆墙壮声壳壶壸处备复够头夸夹夺奁奂奋奖奥妆妇妈妩妪妫姗姜娄娅娆娇娈娱娲娴婳婴婵婶媪嫒嫔嫱嬷孙学孪宁宝实宠审宪宫宽宾寝对寻导寿将尔尘尧尴尸尽层屃屉届属屡屦屿岁岂岖岗岘岙岚岛岭岳岽岿峃峄峡峣峤峥峦崂崃崄崭嵘嵚嵛嵝嵴巅巩巯币帅师帏帐帘帜带帧帮帱帻帼幂幞干并广庄庆庐庑库应庙庞废庼廪开异弃张弥弪弯弹强归当录彟彦彻径徕御忆忏忧忾怀态怂怃怄怅怆怜总怼怿恋恳恶恸恹恺恻恼恽悦悫悬悭悯惊惧惨惩惫惬惭惮惯愍愠愤愦愿慑慭憷懑懒懔戆戋戏戗战戬户扎扑扦执扩扪扫扬扰抚抛抟抠抡抢护报担拟拢拣拥拦拧拨择挂挚挛挜挝挞挟挠挡挢挣挤挥挦捞损捡换捣据捻掳掴掷掸掺掼揸揽揿搀搁搂搅携摄摅摆摇摈摊撄撑撵撷撸撺擞攒敌敛数斋斓斗斩断无旧时旷旸昙昼昽显晋晒晓晔晕晖暂暧札术朴机杀杂权条来杨杩杰极构枞枢枣枥枧枨枪枫枭柜柠柽栀栅标栈栉栊栋栌栎栏树栖样栾桊桠桡桢档桤桥桦桧桨桩梦梼梾检棂椁椟椠椤椭楼榄榇榈榉槚槛槟槠横樯樱橥橱橹橼檐檩欢欤欧歼殁殇残殒殓殚殡殴毁毂毕毙毡毵氇气氢氩氲汇汉污汤汹沓沟没沣沤沥沦沧沨沩沪沵泞泪泶泷泸泺泻泼泽泾洁洒洼浃浅浆浇浈浉浊测浍济浏浐浑浒浓浔浕涂涌涛涝涞涟涠涡涢涣涤润涧涨涩淀渊渌渍渎渐渑渔渖渗温游湾湿溃溅溆溇滗滚滞滟滠满滢滤滥滦滨滩滪漤潆潇潋潍潜潴澜濑濒灏灭灯灵灾灿炀炉炖炜炝点炼炽烁烂烃烛烟烦烧烨烩烫烬热焕焖焘煅煳熘爱爷牍牦牵牺犊犟状犷犸犹狈狍狝狞独狭狮狯狰狱狲猃猎猕猡猪猫猬献獭玑玙玚玛玮环现玱玺珉珏珐珑珰珲琎琏琐琼瑶瑷璇璎瓒瓮瓯电画畅畲畴疖疗疟疠疡疬疮疯疱疴痈痉痒痖痨痪痫痴瘅瘆瘗瘘瘪瘫瘾瘿癞癣癫癯皑皱皲盏盐监盖盗盘眍眦眬着睁睐睑瞒瞩矫矶矾矿砀码砖砗砚砜砺砻砾础硁硅硕硖硗硙硚确硷碍碛碜碱碹磙礼祎祢祯祷祸禀禄禅离秃秆种积称秽秾稆税稣稳穑穷窃窍窑窜窝窥窦窭竖竞笃笋笔笕笺笼笾筑筚筛筜筝筹签简箓箦箧箨箩箪箫篑篓篮篱簖籁籴类籼粜粝粤粪粮糁糇紧絷纟纠纡红纣纤纥约级纨纩纪纫纬纭纮纯纰纱纲纳纴纵纶纷纸纹纺纻纼纽纾线绀绁绂练组绅细织终绉绊绋绌绍绎经绐绑绒结绔绕绖绗绘给绚绛络绝绞统绠绡绢绣绤绥绦继绨绩绪绫绬续绮绯绰绱绲绳维绵绶绷绸绹绺绻综绽绾绿缀缁缂缃缄缅缆缇缈缉缊缋缌缍缎缏缐缑缒缓缔缕编缗缘缙缚缛缜缝缞缟缠缡缢缣缤缥缦缧缨缩缪缫缬缭缮缯缰缱缲缳缴缵罂网罗罚罢罴羁羟羡翘翙翚耢耧耸耻聂聋职聍联聩聪肃肠肤肷肾肿胀胁胆胜胧胨胪胫胶脉脍脏脐脑脓脔脚脱脶脸腊腌腘腭腻腼腽腾膑臜舆舣舰舱舻艰艳艹艺节芈芗芜芦苁苇苈苋苌苍苎苏苘苹茎茏茑茔茕茧荆荐荙荚荛荜荞荟荠荡荣荤荥荦荧荨荩荪荫荬荭荮药莅莜莱莲莳莴莶获莸莹莺莼萚萝萤营萦萧萨葱蒇蒉蒋蒌蓝蓟蓠蓣蓥蓦蔷蔹蔺蔼蕲蕴薮藁藓虏虑虚虫虬虮虽虾虿蚀蚁蚂蚕蚝蚬蛊蛎蛏蛮蛰蛱蛲蛳蛴蜕蜗蜡蝇蝈蝉蝎蝼蝾螀螨蟏衅衔补衬衮袄袅袆袜袭袯装裆裈裢裣裤裥褛褴襁襕见观觃规觅视觇览觉觊觋觌觍觎觏觐觑觞触觯詟誉誊讠计订讣认讥讦讧讨让讪讫训议讯记讱讲讳讴讵讶讷许讹论讻讼讽设访诀证诂诃评诅识诇诈诉诊诋诌词诎诏诐译诒诓诔试诖诗诘诙诚诛诜话诞诟诠诡询诣诤该详诧诨诩诪诫诬语诮误诰诱诲诳说诵诶请诸诹诺读诼诽课诿谀谁谂调谄谅谆谇谈谊谋谌谍谎谏谐谑谒谓谔谕谖谗谘谙谚谛谜谝谞谟谠谡谢谣谤谥谦谧谨谩谪谫谬谭谮谯谰谱谲谳谴谵谶谷豮贝贞负贠贡财责贤败账货质贩贪贫贬购贮贯贰贱贲贳贴贵贶贷贸费贺贻贼贽贾贿赀赁赂赃资赅赆赇赈赉赊赋赌赍赎赏赐赑赒赓赔赕赖赗赘赙赚赛赜赝赞赟赠赡赢赣赪赵赶趋趱趸跃跄跖跞践跶跷跸跹跻踊踌踪踬踯蹑蹒蹰蹿躏躜躯车轧轨轩轪轫转轭轮软轰轱轲轳轴轵轶轷轸轹轺轻轼载轾轿辀辁辂较辄辅辆辇辈辉辊辋辌辍辎辏辐辑辒输辔辕辖辗辘辙辚辞辩辫边辽达迁过迈运还这进远违连迟迩迳迹适选逊递逦逻遗遥邓邝邬邮邹邺邻郁郄郏郐郑郓郦郧郸酝酦酱酽酾酿释里鉅鉴銮錾钆钇针钉钊钋钌钍钎钏钐钑钒钓钔钕钖钗钘钙钚钛钝钞钟钠钡钢钣钤钥钦钧钨钩钪钫钬钭钮钯钰钱钲钳钴钵钶钷钸钹钺钻钼钽钾钿铀铁铂铃铄铅铆铈铉铊铋铍铎铏铐铑铒铕铗铘铙铚铛铜铝铞铟铠铡铢铣铤铥铦铧铨铪铫铬铭铮铯铰铱铲铳铴铵银铷铸铹铺铻铼铽链铿销锁锂锃锄锅锆锇锈锉锊锋锌锍锎锏锐锑锒锓锔锕锖锗错锚锜锞锟锠锡锢锣锤锥锦锨锩锫锬锭键锯锰锱锲锳锴锵锶锷锸锹锺锻锼锽锾锿镀镁镂镃镆镇镈镉镊镌镍镎镏镐镑镒镕镖镗镙镚镛镜镝镞镟镠镡镢镣镤镥镦镧镨镩镪镫镬镭镮镯镰镱镲镳镴镶长门闩闪闫闬闭问闯闰闱闲闳间闵闶闷闸闹闺闻闼闽闾闿阀阁阂阃阄阅阆阇阈阉阊阋阌阍阎阏阐阑阒阓阔阕阖阗阘阙阚阛队阳阴阵阶际陆陇陈陉陕陧陨险随隐隶隽难雏雠雳雾霁霉霭靓静靥鞑鞒鞯鞴韦韧韨韩韪韫韬韵页顶顷顸项顺须顼顽顾顿颀颁颂颃预颅领颇颈颉颊颋颌颍颎颏颐频颒颓颔颕颖颗题颙颚颛颜额颞颟颠颡颢颣颤颥颦颧风飏飐飑飒飓飔飕飖飗飘飙飚飞飨餍饤饥饦饧饨饩饪饫饬饭饮饯饰饱饲饳饴饵饶饷饸饹饺饻饼饽饾饿馀馁馂馃馄馅馆馇馈馉馊馋馌馍馎馏馐馑馒馓馔馕马驭驮驯驰驱驲驳驴驵驶驷驸驹驺驻驼驽驾驿骀骁骂骃骄骅骆骇骈骉骊骋验骍骎骏骐骑骒骓骔骕骖骗骘骙骚骛骜骝骞骟骠骡骢骣骤骥骦骧髅髋髌鬓魇魉鱼鱽鱾鱿鲀鲁鲂鲄鲅鲆鲇鲈鲉鲊鲋鲌鲍鲎鲏鲐鲑鲒鲓鲔鲕鲖鲗鲘鲙鲚鲛鲜鲝鲞鲟鲠鲡鲢鲣鲤鲥鲦鲧鲨鲩鲪鲫鲬鲭鲮鲯鲰鲱鲲鲳鲴鲵鲶鲷鲸鲹鲺鲻鲼鲽鲾鲿鳀鳁鳂鳃鳄鳅鳆鳇鳈鳉鳊鳋鳌鳍鳎鳏鳐鳑鳒鳓鳔鳕鳖鳗鳘鳙鳛鳜鳝鳞鳟鳠鳡鳢鳣鸟鸠鸡鸢鸣鸤鸥鸦鸧鸨鸩鸪鸫鸬鸭鸮鸯鸰鸱鸲鸳鸴鸵鸶鸷鸸鸹鸺鸻鸼鸽鸾鸿鹀鹁鹂鹃鹄鹅鹆鹇鹈鹉鹊鹋鹌鹍鹎鹏鹐鹑鹒鹓鹔鹕鹖鹗鹘鹚鹛鹜鹝鹞鹟鹠鹡鹢鹣鹤鹥鹦鹧鹨鹩鹪鹫鹬鹭鹯鹰鹱鹲鹳鹴鹾麦麸黄黉黡黩黪黾鼋鼌鼍鼗鼹齄齐齑齿龀龁龂龃龄龅龆龇龈龉龊龋龌龙龚龛龟志制咨只里系范松没尝尝闹面准钟别闲干尽脏拼";  
    static private $utf8_tw = "麽萬與醜專業叢東絲丟兩嚴喪個爿豐臨為麗舉麼義烏樂喬習鄉書買亂爭於虧雲亙亞產畝親褻嚲億僅從侖倉儀們價眾優夥會傴傘偉傳傷倀倫傖偽佇體餘傭僉俠侶僥偵側僑儈儕儂俁儔儼倆儷儉債傾傯僂僨償儻儐儲儺兒兌兗黨蘭關興茲養獸囅內岡冊寫軍農塚馮衝決況凍淨淒涼淩減湊凜幾鳳鳧憑凱擊氹鑿芻劃劉則剛創刪別剗剄劊劌剴劑剮劍剝劇勸辦務勱動勵勁勞勢勳猛勩勻匭匱區醫華協單賣盧鹵臥衛卻巹廠廳曆厲壓厭厙廁廂厴廈廚廄廝縣參靉靆雙發變敘疊葉號歎嘰籲後嚇呂嗎唚噸聽啟吳嘸囈嘔嚦唄員咼嗆嗚詠哢嚨嚀噝吒噅鹹呱響啞噠嘵嗶噦嘩噲嚌噥喲嘜嗊嘮啢嗩唕喚呼嘖嗇囀齧囉嘽嘯噴嘍嚳囁嗬噯噓嚶囑嚕劈囂謔團園囪圍圇國圖圓聖壙場阪壞塊堅壇壢壩塢墳墜壟壟壚壘墾坰堊墊埡墶壋塏堖塒塤堝墊垵塹墮壪牆壯聲殼壺壼處備複夠頭誇夾奪奩奐奮獎奧妝婦媽嫵嫗媯姍薑婁婭嬈嬌孌娛媧嫻嫿嬰嬋嬸媼嬡嬪嬙嬤孫學孿寧寶實寵審憲宮寬賓寢對尋導壽將爾塵堯尷屍盡層屭屜屆屬屢屨嶼歲豈嶇崗峴嶴嵐島嶺嶽崠巋嶨嶧峽嶢嶠崢巒嶗崍嶮嶄嶸嶔崳嶁脊巔鞏巰幣帥師幃帳簾幟帶幀幫幬幘幗冪襆幹並廣莊慶廬廡庫應廟龐廢廎廩開異棄張彌弳彎彈強歸當錄彠彥徹徑徠禦憶懺憂愾懷態慫憮慪悵愴憐總懟懌戀懇惡慟懨愷惻惱惲悅愨懸慳憫驚懼慘懲憊愜慚憚慣湣慍憤憒願懾憖怵懣懶懍戇戔戲戧戰戩戶紮撲扡執擴捫掃揚擾撫拋摶摳掄搶護報擔擬攏揀擁攔擰撥擇掛摯攣掗撾撻挾撓擋撟掙擠揮撏撈損撿換搗據撚擄摑擲撣摻摜摣攬撳攙擱摟攪攜攝攄擺搖擯攤攖撐攆擷擼攛擻攢敵斂數齋斕鬥斬斷無舊時曠暘曇晝曨顯晉曬曉曄暈暉暫曖劄術樸機殺雜權條來楊榪傑極構樅樞棗櫪梘棖槍楓梟櫃檸檉梔柵標棧櫛櫳棟櫨櫟欄樹棲樣欒棬椏橈楨檔榿橋樺檜槳樁夢檮棶檢欞槨櫝槧欏橢樓欖櫬櫚櫸檟檻檳櫧橫檣櫻櫫櫥櫓櫞簷檁歡歟歐殲歿殤殘殞殮殫殯毆毀轂畢斃氈毿氌氣氫氬氳匯漢汙湯洶遝溝沒灃漚瀝淪滄渢溈滬濔濘淚澩瀧瀘濼瀉潑澤涇潔灑窪浹淺漿澆湞溮濁測澮濟瀏滻渾滸濃潯濜塗湧濤澇淶漣潿渦溳渙滌潤澗漲澀澱淵淥漬瀆漸澠漁瀋滲溫遊灣濕潰濺漵漊潷滾滯灩灄滿瀅濾濫灤濱灘澦濫瀠瀟瀲濰潛瀦瀾瀨瀕灝滅燈靈災燦煬爐燉煒熗點煉熾爍爛烴燭煙煩燒燁燴燙燼熱煥燜燾煆糊溜愛爺牘犛牽犧犢強狀獷獁猶狽麅獮獰獨狹獅獪猙獄猻獫獵獼玀豬貓蝟獻獺璣璵瑒瑪瑋環現瑲璽瑉玨琺瓏璫琿璡璉瑣瓊瑤璦璿瓔瓚甕甌電畫暢佘疇癤療瘧癘瘍鬁瘡瘋皰屙癰痙癢瘂癆瘓癇癡癉瘮瘞瘺癟癱癮癭癩癬癲臒皚皺皸盞鹽監蓋盜盤瞘眥矓著睜睞瞼瞞矚矯磯礬礦碭碼磚硨硯碸礪礱礫礎硜矽碩硤磽磑礄確鹼礙磧磣堿镟滾禮禕禰禎禱禍稟祿禪離禿稈種積稱穢穠穭稅穌穩穡窮竊竅窯竄窩窺竇窶豎競篤筍筆筧箋籠籩築篳篩簹箏籌簽簡籙簀篋籜籮簞簫簣簍籃籬籪籟糴類秈糶糲粵糞糧糝餱緊縶糸糾紆紅紂纖紇約級紈纊紀紉緯紜紘純紕紗綱納紝縱綸紛紙紋紡紵紖紐紓線紺絏紱練組紳細織終縐絆紼絀紹繹經紿綁絨結絝繞絰絎繪給絢絳絡絕絞統綆綃絹繡綌綏絛繼綈績緒綾緓續綺緋綽緔緄繩維綿綬繃綢綯綹綣綜綻綰綠綴緇緙緗緘緬纜緹緲緝縕繢緦綞緞緶線緱縋緩締縷編緡緣縉縛縟縝縫縗縞纏縭縊縑繽縹縵縲纓縮繆繅纈繚繕繒韁繾繰繯繳纘罌網羅罰罷羆羈羥羨翹翽翬耮耬聳恥聶聾職聹聯聵聰肅腸膚膁腎腫脹脅膽勝朧腖臚脛膠脈膾髒臍腦膿臠腳脫腡臉臘醃膕齶膩靦膃騰臏臢輿艤艦艙艫艱豔艸藝節羋薌蕪蘆蓯葦藶莧萇蒼苧蘇檾蘋莖蘢蔦塋煢繭荊薦薘莢蕘蓽蕎薈薺蕩榮葷滎犖熒蕁藎蓀蔭蕒葒葤藥蒞蓧萊蓮蒔萵薟獲蕕瑩鶯蓴蘀蘿螢營縈蕭薩蔥蕆蕢蔣蔞藍薊蘺蕷鎣驀薔蘞藺藹蘄蘊藪槁蘚虜慮虛蟲虯蟣雖蝦蠆蝕蟻螞蠶蠔蜆蠱蠣蟶蠻蟄蛺蟯螄蠐蛻蝸蠟蠅蟈蟬蠍螻蠑螿蟎蠨釁銜補襯袞襖嫋褘襪襲襏裝襠褌褳襝褲襇褸襤繈襴見觀覎規覓視覘覽覺覬覡覿覥覦覯覲覷觴觸觶讋譽謄訁計訂訃認譏訐訌討讓訕訖訓議訊記訒講諱謳詎訝訥許訛論訩訟諷設訪訣證詁訶評詛識詗詐訴診詆謅詞詘詔詖譯詒誆誄試詿詩詰詼誠誅詵話誕詬詮詭詢詣諍該詳詫諢詡譸誡誣語誚誤誥誘誨誑說誦誒請諸諏諾讀諑誹課諉諛誰諗調諂諒諄誶談誼謀諶諜謊諫諧謔謁謂諤諭諼讒諮諳諺諦謎諞諝謨讜謖謝謠謗諡謙謐謹謾謫譾謬譚譖譙讕譜譎讞譴譫讖穀豶貝貞負貟貢財責賢敗賬貨質販貪貧貶購貯貫貳賤賁貰貼貴貺貸貿費賀貽賊贄賈賄貲賃賂贓資賅贐賕賑賚賒賦賭齎贖賞賜贔賙賡賠賧賴賵贅賻賺賽賾贗讚贇贈贍贏贛赬趙趕趨趲躉躍蹌蹠躒踐躂蹺蹕躚躋踴躊蹤躓躑躡蹣躕躥躪躦軀車軋軌軒軑軔轉軛輪軟轟軲軻轤軸軹軼軤軫轢軺輕軾載輊轎輈輇輅較輒輔輛輦輩輝輥輞輬輟輜輳輻輯轀輸轡轅轄輾轆轍轔辭辯辮邊遼達遷過邁運還這進遠違連遲邇逕跡適選遜遞邐邏遺遙鄧鄺鄔郵鄒鄴鄰鬱郤郟鄶鄭鄆酈鄖鄲醞醱醬釅釃釀釋裏钜鑒鑾鏨釓釔針釘釗釙釕釷釺釧釤鈒釩釣鍆釹鍚釵鈃鈣鈈鈦鈍鈔鍾鈉鋇鋼鈑鈐鑰欽鈞鎢鉤鈧鈁鈥鈄鈕鈀鈺錢鉦鉗鈷缽鈳鉕鈽鈸鉞鑽鉬鉭鉀鈿鈾鐵鉑鈴鑠鉛鉚鈰鉉鉈鉍鈹鐸鉶銬銠鉺銪鋏鋣鐃銍鐺銅鋁銱銦鎧鍘銖銑鋌銩銛鏵銓鉿銚鉻銘錚銫鉸銥鏟銃鐋銨銀銣鑄鐒鋪鋙錸鋱鏈鏗銷鎖鋰鋥鋤鍋鋯鋨鏽銼鋝鋒鋅鋶鐦鐧銳銻鋃鋟鋦錒錆鍺錯錨錡錁錕錩錫錮鑼錘錐錦鍁錈錇錟錠鍵鋸錳錙鍥鍈鍇鏘鍶鍔鍤鍬鍾鍛鎪鍠鍰鎄鍍鎂鏤鎡鏌鎮鎛鎘鑷鐫鎳鎿鎦鎬鎊鎰鎔鏢鏜鏍鏰鏞鏡鏑鏃鏇鏐鐔钁鐐鏷鑥鐓鑭鐠鑹鏹鐙鑊鐳鐶鐲鐮鐿鑔鑣鑞鑲長門閂閃閆閈閉問闖閏闈閑閎間閔閌悶閘鬧閨聞闥閩閭闓閥閣閡閫鬮閱閬闍閾閹閶鬩閿閽閻閼闡闌闃闠闊闋闔闐闒闕闞闤隊陽陰陣階際陸隴陳陘陝隉隕險隨隱隸雋難雛讎靂霧霽黴靄靚靜靨韃鞽韉韝韋韌韍韓韙韞韜韻頁頂頃頇項順須頊頑顧頓頎頒頌頏預顱領頗頸頡頰頲頜潁熲頦頤頻頮頹頷頴穎顆題顒顎顓顏額顳顢顛顙顥纇顫顬顰顴風颺颭颮颯颶颸颼颻飀飄飆飆飛饗饜飣饑飥餳飩餼飪飫飭飯飲餞飾飽飼飿飴餌饒餉餄餎餃餏餅餑餖餓餘餒餕餜餛餡館餷饋餶餿饞饁饃餺餾饈饉饅饊饌饢馬馭馱馴馳驅馹駁驢駔駛駟駙駒騶駐駝駑駕驛駘驍罵駰驕驊駱駭駢驫驪騁驗騂駸駿騏騎騍騅騌驌驂騙騭騤騷騖驁騮騫騸驃騾驄驏驟驥驦驤髏髖髕鬢魘魎魚魛魢魷魨魯魴魺鮁鮃鯰鱸鮋鮓鮒鮊鮑鱟鮍鮐鮭鮚鮳鮪鮞鮦鰂鮜鱠鱭鮫鮮鮺鯗鱘鯁鱺鰱鰹鯉鰣鰷鯀鯊鯇鮶鯽鯒鯖鯪鯕鯫鯡鯤鯧鯝鯢鯰鯛鯨鯵鯴鯔鱝鰈鰏鱨鯷鰮鰃鰓鱷鰍鰒鰉鰁鱂鯿鰠鼇鰭鰨鰥鰩鰟鰜鰳鰾鱈鱉鰻鰵鱅鰼鱖鱔鱗鱒鱯鱤鱧鱣鳥鳩雞鳶鳴鳲鷗鴉鶬鴇鴆鴣鶇鸕鴨鴞鴦鴒鴟鴝鴛鴬鴕鷥鷙鴯鴰鵂鴴鵃鴿鸞鴻鵐鵓鸝鵑鵠鵝鵒鷳鵜鵡鵲鶓鵪鶤鵯鵬鵮鶉鶊鵷鷫鶘鶡鶚鶻鶿鶥鶩鷊鷂鶲鶹鶺鷁鶼鶴鷖鸚鷓鷚鷯鷦鷲鷸鷺鸇鷹鸌鸏鸛鸘鹺麥麩黃黌黶黷黲黽黿鼂鼉鞀鼴齇齊齏齒齔齕齗齟齡齙齠齜齦齬齪齲齷龍龔龕龜誌製谘隻裡係範鬆冇嚐嘗鬨麵準鐘彆閒乾儘臟拚";  
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