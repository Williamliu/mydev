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
			//echo "\nquery:" . $query . "\n";
			$this->query($query);
		} else {
			// insert case 
			$field_array = cARRAY::arrayMerge($field_array, $append_array);
			//echo "modify:\n";
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
	
	public function phone($phone_col, $phone_str ) {
		return "replace(replace(replace($phone_col,' ',''),'-',''),'.','') = '" . str_replace(array(" ","-","."), array("","",""), $phone_str ) . "'";
	}

	
	/*************** Relational Table Functions ***********************************/
	public function one(&$table) {
		$colMap 	= $table["colmap"];
		$colMeta 	= $table["colmeta"];
		
		// join tables 
		$ptable = $table["metadata"]["primary"];
		$pname  = $ptable["name"];
		$pkeys  = $ptable["keys"];
		$joinLink = "$pname a";

		// select cols 
        $colstr = "";
		$pcols = cACTION::getCols($table, "primary", "get");			
		foreach($pcols as $ff) {
			$dbName = $colMap[$ff]?$colMap[$ff]:$ff;
			cTYPE::join( $colstr, ",", "a.$dbName as $ff"); 
		}

		$pk_criteria = "";
		//$primary_criteria = "1=1";
		foreach($pkeys as $idx=>$pkey) {
			$pk = $colMap[$pkey];
			// if primary table key has defval,  only select defval record
			$pv = trim($colMeta[$pkey]["defval"]);
			if( $pv ) {
				//cTYPE::join($primary_criteria, " AND ", "a.$pk='" . $this->quote($pv) . "'");
				cTYPE::join($pk_criteria, " AND ", "a.$pk='" . $this->quote($pv) . "'");
			} else {
				// no default value, primary rows should be none
				//cTYPE::join($primary_criteria, " AND ", "1=0");
			}
		}

		/* don't need primary information
		// get primary table info  for add new record		
		$query_primary 		= "SELECT $colstr FROM $pname a WHERE $primary_criteria";
		$result_primary 	= $this->query($query_primary);
		$table["primary"] 	= $this->rows($result_primary);
		*/

		// criteria 
		$criteria = "a.deleted=0";
		cTYPE::join($criteria, " AND ", $pk_criteria);
		cTYPE::join($criteria, " AND ", $table["criteria"]);

		// update navi first 
		$query = "SELECT COUNT(1) AS CNT FROM $joinLink WHERE $criteria";
		$this->navi($query, $table);
		$navi = $table["navi"];


		// order by 
        $orderby 	= "";
		$orderCol 	= $navi["orderby"]?($colMap[$navi["orderby"]]?$colMap[$navi["orderby"]]:$navi["orderby"]):"";
		$sortBy   	= $navi["sortby"]?$navi["sortby"]:"";
		if( $orderCol!="" && in_array($navi["orderby"], $pcols) )  $orderCol = "a.$orderCol";
		
		if( $orderCol!="" && $sortBy!="" )
			$orderby = $orderCol . " " . $sortBy;
		elseif($orderCol!="") 
			$orderby = $orderCol . " ASC";

		if($orderby!="") $orderby = " ORDER BY " . $orderby;

		// Limit records 
		$limit = "";
		if( $navi["pageno"]>= 1) {
			$limit = "LIMIT " . (($navi["pageno"]-1) * $navi["pagesize"]) . ", " . $navi["pagesize"];
		} else {
		 	cTYPE::join( $criteria, " AND ", "1=0" );
		}

		$query = "SELECT $colstr FROM $joinLink WHERE $criteria $orderby $limit";	

		//Debug Query 
		if(DEBUG) { $table["query"] = $query; $table["criteria"] = $criteria; }

		$result = $this->query($query);
		$table["rows"] = $this->rows($result);
	}

	public function saveone(&$table) {
		$colMap 	= $table["colmap"];
		$colMeta 	= $table["colmeta"];
		
		// join tables 
		$ptable = $table["metadata"]["primary"];
		$pname  = $ptable["name"];
		$pkeys  = $ptable["keys"];
		$errMsg = array();
		foreach( $table["rows"] as &$row ) {
			switch( $row["rowstate"] ) {
				case 0:
					break;
				case 1: 
					if( $table["rights"]["save"] ) {
						$dbCols = cACTION::getSaveCols($table, "primary", $row);
						if(	count($dbCols["fields"]) >0 ) {
							$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], $ptable["update"]);
							$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], array("last_updated"=>time()));
							$this->update($pname, $dbCols["keys"], $dbCols["fields"]);
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
						$dbCols = cACTION::getSaveCols($table, "primary", $row);
						if(	count($dbCols["fields"]) >0 ) {
							$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], $ptable["insert"]);
							$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], array("created_time"=>time(), "deleted"=>0));
							//print_r($dbCols);
							$insertID = $this->insert($pname, $dbCols["fields"]);
							// update keys insert id
							foreach( $row["cols"] as &$colObj ) {
								if( $colObj["key"] && !$colObj["value"] ) $colObj["value"] = $insertID;
							}
							foreach( $dbCols["keys"] as &$dbCol ) {
								$dbCol = $insertID;
							}
							//print_r($row);
							// end of update insert key
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
						$dbCols = cACTION::getSaveCols($table, "primary", $row);
						$this->update($pname, $dbCols["keys"], array("last_updated"=>time()));
						$this->detach($pname, $dbCols["keys"]);
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
		$colMap  = $table["colmap"];
		$colMeta = $table["colmeta"];

		// join tables 
		$ptable = $table["metadata"]["primary"];
		$stable = $table["metadata"]["second"];
		$pname  = $ptable["name"];
		$sname  = $stable["name"];
		$pkeys  = $ptable["keys"];
		$sfkeys = $stable["fkeys"];
		$joinOn = "";
		$pk_criteria = "";  // must have deleted column 
		//$primary_criteria = "1=1";
		foreach($pkeys as $idx=>$pkey) {
			$pk = $colMap[$pkey];
			$sk = $colMap[$sfkeys[$idx]];
			cTYPE::join($joinOn, " AND ", "a.$pk=b.$sk");

			// if primary table key has defval,  only select defval record
			$pv = trim($colMeta[$pkey]["defval"]);
			if( $pv ) {
				cTYPE::join($pk_criteria, " AND ", "a.$pk='" . $this->quote($pv) . "'");
				//cTYPE::join($primary_criteria, " AND ", "a.$pk='" . $this->quote($pv) . "'");
			} else {
				// no default value, primary rows should be none
				//cTYPE::join($primary_criteria, " AND ", "1=0");
			}
		}


		cTYPE::join($joinOn, " AND ", "b.deleted=0"); // important: must have deleted column in second table
		// one to one using LEFT JOIN 
		// if try to search by primary key. important to use LEFT JOIN, because master information already there.
		// important for html one record form,  match=0,   set primary id to defval 
		if( $table["navi"]["match"]=="1" ) 
			$joinLink = "$pname a INNER JOIN $sname b ON ( $joinOn )";
		else 
			$joinLink = "$pname a LEFT JOIN $sname b ON ( $joinOn )";
		
		// select cols 
        $colstr = "";
		$pcols = cACTION::getCols($table, "primary", "get");			
		$scols = cACTION::getCols($table, "second", "get");	
		foreach($pcols as $ff) {
			$dbName = $colMap[$ff]?$colMap[$ff]:$ff;
			cTYPE::join( $colstr, ",", "a.$dbName as $ff"); 
		}

		/*  don't need to return primary information,  add new means add blank new one.		
		// get primary table info  for add new record		
		$query_primary 		= "SELECT $colstr FROM $pname a WHERE $primary_criteria";
		$result_primary 	= $this->query($query_primary);
		$table["primary"] 	= $this->rows($result_primary);
		*/

		foreach($scols as $ff) {
			$dbName = $colMap[$ff]?$colMap[$ff]:$ff;
			cTYPE::join( $colstr, ",", "b.$dbName as $ff"); 
		}

		// criteria 
		$criteria = "a.deleted=0";
		cTYPE::join($criteria, " AND ", $pk_criteria);
		cTYPE::join($criteria, " AND ", $table["criteria"]);

		//important: update navi first 
		$query = "SELECT COUNT(1) AS CNT FROM $joinLink WHERE $criteria";
		$this->navi($query, $table);
		$navi = $table["navi"];

		// order by 
        $orderby 	= "";
		$orderCol 	= $navi["orderby"]?($colMap[$navi["orderby"]]?$colMap[$navi["orderby"]]:$navi["orderby"]):"";
		$sortBy   	= $navi["sortby"]?$navi["sortby"]:"";
		if( $orderCol!="" && in_array($navi["orderby"], $scols) )  $orderCol = "b.$orderCol";
		if( $orderCol!="" && in_array($navi["orderby"], $pcols) )  $orderCol = "a.$orderCol";
		
		if( $orderCol!="" && $sortBy!="" )
			$orderby = $orderCol . " " . $sortBy;
		elseif($orderCol!="") 
			$orderby = $orderCol . " ASC";

		if($orderby!="") $orderby = " ORDER BY " . $orderby;

		// Limit records 
		$limit = "";
		if( $navi["pageno"]>= 1) {
			$limit = "LIMIT " . (($navi["pageno"]-1) * $navi["pagesize"]) . ", " . $navi["pagesize"];
		} else {
			cTYPE::join( $criteria, " AND ", "1=0" );
		}

		$query = "SELECT $colstr FROM $joinLink WHERE $criteria $orderby $limit";

		//Debug Query 
		if(DEBUG) { $table["query"] = $query; $table["criteria"] = $criteria; }

		$result = $this->query($query);
		$table["rows"] = $this->rows($result);
	}

	public function saveone2one(&$table) {
		$colMap 	= $table["colmap"];
		$colMeta 	= $table["colmeta"];
		
		// join tables 
		$ptable = $table["metadata"]["primary"];
		$pname  = $ptable["name"];
		$pkeys  = $ptable["keys"];

		$stable = $table["metadata"]["second"];
		$sname  = $stable["name"];
		$skeys  = $stable["keys"];
		$sfkeys = $stable["fkeys"];

		$errMsg = array();

		foreach( $table["rows"] as &$row ) {
			switch( $row["rowstate"] ) {
				case 0:
					break;
				case 1: 
					if( $table["rights"]["save"] ) {
						$dbCols = cACTION::getSaveCols($table, "primary", $row);
						if(	count($dbCols["fields"]) >0 ) {
							$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], $ptable["update"]);
							$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], array("last_updated"=>time()));
							$this->update($pname, $dbCols["keys"], $dbCols["fields"]);
						} 
						
						$cidx = cARRAY::arrayIndex($row["cols"], array("coltype"=>"relation"));	
						if($cidx >= 0) {
							// create second keys
							$SDBKeys = array();
							foreach( $sfkeys as $fidx=>$fkey ) {
								$SDBKeys[ $colMap[$fkey] ] = $dbCols["keys"][$colMap[$pkeys[$fidx]]];
							}


							if( $row["cols"][$cidx]["value"] ) {  // if check relation true
								$ssdbCols = cACTION::getSaveCols($table, "second", $row);
								
								if(	count($ssdbCols["fields"]) >0 ) {
									$ssdbCols["fields"] = cARRAY::arrayMerge($ssdbCols["fields"], $stable["update"]);
									$ssdbCols["fields"] = cARRAY::arrayMerge($ssdbCols["fields"], array("last_updated"=>time(),"deleted"=>0));
									$this->modify($sname, $SDBKeys, $ssdbCols["fields"]);
								} 
							} else {
								$this->update($sname, $SDBKeys, array("last_updated"=>time()));
								$this->detach($sname, $SDBKeys);
							}

							$row["cols"][$cidx]["value"] = $dbCols["keys"][ $colMap[$row["cols"][$cidx]["name"]] ];
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
						$dbCols = cACTION::getSaveCols($table, "primary", $row);
						if(	count($dbCols["fields"]) >0 ) {
							$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], $ptable["insert"]);
							$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], array("created_time"=>time()));
							$insertID = $this->insert($pname, $dbCols["fields"]);
							foreach( $row["cols"] as &$colObj ) {
								if( $colObj["key"] && !$colObj["value"]) $colObj["value"] = $insertID;
							}
							
							// update keys insert id
							foreach( $dbCols["keys"] as &$dbCol ) {
								$dbCol = $dbCol?$dbCol:$insertID;
							}
						}

						$cidx = cARRAY::arrayIndex($row["cols"], array("coltype"=>"relation"));	
						if($cidx >= 0) {
							// create second keys
							$SDBKeys = array();
							foreach( $sfkeys as $fidx=>$fkey ) {
								$SDBKeys[ $colMap[$fkey] ] = $dbCols["keys"][$colMap[$pkeys[$fidx]]];
							}


							if( $row["cols"][$cidx]["value"] ) {
								$ssdbCols = cACTION::getSaveCols($table, "second", $row);
								if(	count($ssdbCols["fields"]) >0 ) {
									$ssdbCols["fields"] = cARRAY::arrayMerge($ssdbCols["fields"], $stable["update"]);
									$ssdbCols["fields"] = cARRAY::arrayMerge($ssdbCols["fields"], array("last_updated"=>time(), "deleted"=>0));
									$this->modify($sname, $SDBKeys, $ssdbCols["fields"]);
								} 
							} else {
								$this->update($sname, $SDBKeys, array("last_updated"=>time()));
								$this->detach($sname, $SDBKeys);
							}

							$row["cols"][$cidx]["value"] = $dbCols["keys"][ $colMap[$row["cols"][$cidx]["name"]] ];
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
						$dbCols = cACTION::getSaveCols($table, "primary", $row);
						$this->update($pname, $dbCols["keys"], array("last_updated"=>time()));
						$this->detach($pname, $dbCols["keys"]);
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
		$colMap 	= $table["colmap"];
		$colMeta 	= $table["colmeta"];

		// join tables 
		$ptable = $table["metadata"]["primary"];
		$stable = $table["metadata"]["second"];
		$pname  = $ptable["name"];
		$sname  = $stable["name"];
	
		$pkeys  = $ptable["keys"];
		$skeys  = $stable["keys"];
		$sfkeys = $stable["fkeys"];
	
		$joinOn 		= "";
		$pk_criteria 	= "";
		$primary_criteria = "1=1";
		foreach($pkeys as $idx=>$pkey) {
			$pk = $colMap[$pkey];
			$sk = $colMap[$sfkeys[$idx]];
			cTYPE::join( $joinOn, " AND ", "a.$pk=b.$sk"); 

			// if primary table key has defval,  only select defval record
			$pv = trim($colMeta[$pkey]["defval"]);
			if( $pv ) {
				cTYPE::join($pk_criteria, " AND ", "a.$pk='" . $this->quote($pv) . "'");
				cTYPE::join($primary_criteria, " AND ", "a.$pk='" . $this->quote($pv) . "'");
			} else {
				//if defval is empty, rows of both primary and return should be none
				cTYPE::join($pk_criteria, " AND ", "1=0");
				cTYPE::join($primary_criteria, " AND ", "1=0");
			}
		}

		$sk_criteria = "";
		foreach($skeys as $idx=>$skey) {
			$sk = $colMap[$skey];
			$sv = trim($colMeta[$skey]["defval"]);
			if( $sv ) {
				cTYPE::join($sk_criteria, " AND ", "b.$sk='" . $this->quote($sv) . "'");
			}		
		}

		// one to many,  using inner join 
		$joinLink = "$pname a INNER JOIN $sname b ON ( $joinOn )";

		// select cols 
        $colstr = "";
		$pcols = cACTION::getCols($table, "primary", "get");			
		$scols = cACTION::getCols($table, "second", "get");	
		foreach($pcols as $ff) {
			$dbName = $colMap[$ff]?$colMap[$ff]:$ff;
			cTYPE::join($colstr, ",", "a.$dbName as $ff");
		}
		// get primary table info  for add new record		
		$query_primary 		= "SELECT $colstr FROM $pname a WHERE $primary_criteria";
		$result_primary 	= $this->query($query_primary);
		$table["primary"] 	= $this->rows($result_primary);


		foreach($scols as $ff) {
			$dbName = $colMap[$ff]?$colMap[$ff]:$ff;
			$colstr .= ($colstr==""?"":",") . "b.$dbName as $ff"; 
		}

		// criteria 
		$criteria = "a.deleted=0 AND b.deleted=0";
		cTYPE::join($criteria, " AND ", $pk_criteria);
		cTYPE::join($criteria, " AND ", $sk_criteria);
		cTYPE::join($criteria, " AND ", $table["criteria"]);

		//important: update navi first 
		$query = "SELECT COUNT(1) AS CNT FROM $joinLink WHERE $criteria";
		$this->navi($query, $table);
		$navi = $table["navi"];

		// order by 
        $orderby 	= "";
		$orderCol 	= $navi["orderby"]?($colMap[$navi["orderby"]]?$colMap[$navi["orderby"]]:$navi["orderby"]):"";
		$sortBy   	= $navi["sortby"]?$navi["sortby"]:"";
		if( $orderCol!="" && in_array($navi["orderby"], $scols) )  $orderCol = "b.$orderCol";
		if( $orderCol!="" && in_array($navi["orderby"], $pcols) )  $orderCol = "a.$orderCol";
		
		if( $orderCol!="" && $sortBy!="" )
			$orderby = $orderCol . " " . $sortBy;
		elseif($orderCol!="") 
			$orderby = $orderCol . " ASC";

		if($orderby!="") $orderby = " ORDER BY " . $orderby;

		// Limit records 
		$limit = "";
		if( $navi["pageno"]>= 1) {
			$limit = "LIMIT " . (($navi["pageno"]-1) * $navi["pagesize"]) . ", " . $navi["pagesize"];
		} else {
			cTYPE::join( $criteria, " AND ", "1=0" );
		}

		$query = "SELECT $colstr FROM $joinLink WHERE $criteria $orderby $limit";

		//Debug Query 
		if(DEBUG) { $table["query"] = $query; $table["criteria"] = $criteria; }

		$result = $this->query($query);
		$table["rows"] = $this->rows($result);
	}

	public function saveone2many(&$table) {
		$colMap 	= $table["colmap"];
		$colMeta 	= $table["colmeta"];
		
		// join tables 
		$ptable = $table["metadata"]["primary"];
		$pname  = $ptable["name"];
		$pkeys  = $ptable["keys"];

		$stable = $table["metadata"]["second"];
		$sname  = $stable["name"];
		$skeys  = $stable["keys"];
		$sfkeys = $stable["fkeys"];

		$errMsg = array();

		foreach( $table["rows"] as &$row ) {
			switch( $row["rowstate"] ) {
				case 0:
					break;
				case 1: 
					if( $table["rights"]["save"] ) {
						$dbCols = cACTION::getSaveCols($table, "primary", $row);
						if(	count($dbCols["fields"]) >0 ) {
							$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], $ptable["update"]);
							$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], array("last_updated"=>time()));
							$this->update($pname, $dbCols["keys"], $dbCols["fields"]);
						} 
						
						// create second keys
						$ssdbCols = cACTION::getSaveCols($table, "second", $row);
						if(	count($ssdbCols["fields"]) >0 ) {
							$ssdbCols["fields"] = cARRAY::arrayMerge($ssdbCols["fields"], $stable["update"]);
							$ssdbCols["fields"] = cARRAY::arrayMerge($ssdbCols["fields"], array("last_updated"=>time()));
							$this->update($sname, $ssdbCols["keys"], $ssdbCols["fields"]);
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
						$dbCols = cACTION::getSaveCols($table, "primary", $row);
						$dbCols["keys"] = array();
						foreach( $pkeys as $pkey ) {
							if($row["keys"][$pkey]) {
								$dbCols["keys"][ $colMap[$pkey] ] = $row["keys"][$pkey];
							} else {
								$row["error"]["errorCode"] 		= 3;
								$row["error"]["errorMessage"] 	= "Something wrong with primary key, please contact us.";
							}
						}

						if( !$row["error"]["errorCode"] ) {
							if(	count($dbCols["fields"]) >0 ) {
								$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], $ptable["update"]);
								$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], array("last_updated"=>time()));
								$this->update($pname, $dbCols["keys"], $dbCols["fields"]);
							} 

							// create second keys
							$SDBKeys = array();
							foreach( $sfkeys as $fidx=>$fkey ) {
								$SDBKeys[ $colMap[$fkey] ] = $dbCols["keys"][$colMap[$pkeys[$fidx]]];
							}
							$ssdbCols = cACTION::getSaveCols($table, "second", $row);
							if(	count($ssdbCols["fields"]) >0 ) {
								$ssdbCols["fields"] = cARRAY::arrayMerge($ssdbCols["fields"], $stable["insert"]);
								$ssdbCols["fields"] = cARRAY::arrayMerge($ssdbCols["fields"], $SDBKeys);
								$ssdbCols["fields"] = cARRAY::arrayMerge($ssdbCols["fields"], array("created_time"=>time(),"deleted"=>0));
								$insertid = $this->insert($sname, $ssdbCols["fields"]);

								foreach( $skeys as $skey ) {
									$cidx = cARRAY::arrayIndex($row["cols"], array("name"=>$skey));
									if($cidx>=0) {
										if( !$row["cols"][$cidx]["value"] ) $row["cols"][$cidx]["value"] = $insertid; 
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
							$table["error"]["errorCode"] 	= 1;
							cTYPE::join($table["error"]["errorMessage"],"\n", $errMsg["add"]);
						}
						$errMsg["addFlag"] = 1;
					}
					break;
				case 3:
					if( $table["rights"]["delete"] ) {
						$dbCols = cACTION::getSaveCols($table, "second", $row);
						$this->update($sname, $dbCols["keys"], array("last_updated"=>time()));
						$this->detach($sname, $dbCols["keys"]);
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

	public function many2many(&$table) {
		$colMap 	= $table["colmap"];
		$colMeta 	= $table["colmeta"];

		// join tables 
		$ptable = $table["metadata"]["primary"];
		$stable = $table["metadata"]["second"];
		$mtable = $table["metadata"]["medium"];
		$pname  = $ptable["name"];
		$sname  = $stable["name"];
		$mname  = $mtable["name"];
		
		$pkeys  = $ptable["keys"];
		$skeys 	= $stable["keys"];
		$mpkeys = $mtable["keys"];
		$mskeys = $mtable["fkeys"];


		// join on 
		$pjoinOn = "";
		$primary_criteria = "1=1";
		$pk_criteria = "";
		foreach($pkeys as $idx=>$pkey) {
			$pk = $colMap[$pkey];
			$mk = $colMap[$mpkeys[$idx]];
			cTYPE::join( $pjoinOn, " AND ", "a.$pk=m.$mk"); 
			cTYPE::join( $pjoinOn, " AND ", "m.deleted=0"); // important: medium table, must have deleted column  

			$pv = trim($colMeta[$pkey]["defval"]);
			if( $pv ) {
				cTYPE::join($pjoinOn, " AND " , "a.$pk='" . $this->quote($pv) . "'");
				cTYPE::join($primary_criteria, " AND ", "a.$pk='" . $this->quote($pv) . "'");
			} else {
				//if defval is empty, rows of both primary and return should be none
				cTYPE::join($pk_criteria, " AND " ,		"1=0");
				cTYPE::join($primary_criteria, " AND ", "1=0");
			}
		}
		// cols 
		$pcols = cACTION::getCols($table, "primary", "get");
		$mcols = cACTION::getCols($table, "medium", "get");	
        $pcolstr = "";
		foreach($pcols as $ff) {
			$dbName = $colMap[$ff]?$colMap[$ff]:$ff;
			cTYPE::join( $pcolstr, ",", "a.$dbName as $ff"); 
		}
		// get primary table info  for add new record		
		$query_primary 		= "SELECT $pcolstr FROM $pname a WHERE $primary_criteria";
		$result_primary 	= $this->query($query_primary);
		$table["primary"] 	= $this->rows($result_primary);

		//important for m2m:  if primary record not found,  return 0 rows
		if( $this->row_nums($result_primary) <= 0 )  cTYPE::join($pk_criteria, " AND ", "1=0");

		foreach($mcols as $ff) {
			$dbName = $colMap[$ff]?$colMap[$ff]:$ff;
			cTYPE::join( $pcolstr, ",", "m.$dbName as $ff"); 
		}

		// many to many,  b left join ( select * from a inner join m  ) c  
		$pjoinLink = "SELECT $pcolstr FROM $pname a INNER JOIN $mname m ON ( $pjoinOn )";

		// cols
        $scolstr = "";
		$scols = cACTION::getCols($table, "second", "get");	
		foreach($scols as $ff) {
			$dbName = $colMap[$ff]?$colMap[$ff]:$ff;
			cTYPE::join($scolstr,",", "b.$dbName as $ff"); 
		}

		// join on 
		$sjoinOn 		= "";
		$sk_criteria 	= "";
		foreach($skeys as $idx=>$skey) {
			$s1 = $colMap[$skey];
			// c.ctime  sub query keep the javascript colname 
			$m1 = $mskeys[$idx];
			$sjoinOn .= ($sjoinOn==""?"":" AND ") . "b.$s1=c.$m1"; 
		}
		foreach($skeys as $idx=>$skey) {
			$sk = $colMap[$skey];
			$sv = trim($colMeta[$skey]["defval"]);
			if( $sv ) {
				cTYPE::join($sk_criteria, " AND ", "b.$sk='" . $this->quote($sv) . "'");
			}		
		}
		// criteria 
		$criteria = "b.deleted=0";
		cTYPE::join($criteria, " AND ", $pk_criteria);
		cTYPE::join($criteria, " AND ", $sk_criteria);
		cTYPE::join($criteria, " AND ", $table["criteria"]);

		// many to many,  b left join ( select * from a inner join m  ) c  
		if( $table["navi"]["match"]=="1" ) 
			$sjoinLink = "SELECT $scolstr, c.* FROM $sname b INNER JOIN ($pjoinLink) c ON ( $sjoinOn ) WHERE $criteria";
		else 
			$sjoinLink = "SELECT $scolstr, c.* FROM $sname b LEFT JOIN ($pjoinLink) c ON ( $sjoinOn ) WHERE $criteria";

		// final query 
		$joinLink = $sjoinLink;

		//important: update navi first 
		$query = "SELECT COUNT(1) AS CNT FROM ($joinLink) t";
		//echo "query: " . $query;
		$this->navi($query, $table);
		$navi = $table["navi"];

		// order by 
        $orderby 	= "";
		// c.ctime  sub query keep the javascript colname 
		if( in_array($navi["orderby"], $mcols) )
			$orderCol 	= $navi["orderby"]?$navi["orderby"]:"";
		else 
			$orderCol 	= $navi["orderby"]?($colMap[$navi["orderby"]]?$colMap[$navi["orderby"]]:$navi["orderby"]):"";
		
		$sortBy   	= $navi["sortby"]?$navi["sortby"]:"";
		if( $orderCol!="" && in_array($navi["orderby"], $mcols) )  $orderCol = "c.$orderCol";
		if( $orderCol!="" && in_array($navi["orderby"], $scols) )  $orderCol = "b.$orderCol";
		
		if( $orderCol!="" && $sortBy!="" )
			$orderby = $orderCol . " " . $sortBy;
		elseif($orderCol!="") 
			$orderby = $orderCol . " ASC";

		if($orderby!="") $orderby = " ORDER BY " . $orderby;

		// Limit records 
		$limit = "";
		if( $navi["pageno"]>= 1) {
			$limit = "LIMIT " . (($navi["pageno"]-1) * $navi["pagesize"]) . ", " . $navi["pagesize"];
		} else {
			cTYPE::join( $criteria, " AND ", "1=0");
		}

		$query = "$joinLink $orderby $limit";

		//Debug Query 
		if(DEBUG) { $table["query"] = $query; $table["criteria"] = $criteria; }
		
		$result = $this->query($query);
		$table["rows"] = $this->rows($result);

		// add primary table info to every row. M2M ,  primary row must be one row 
		foreach( $table["primary"][0] as $pkey=>$pval) {
			foreach($table["rows"] as &$trow ) {
				$trow[$pkey] = $pval; 
			}
		}
	}

	public function savemany2many(&$table) {
		$colMap 	= $table["colmap"];
		$colMeta 	= $table["colmeta"];
		
		// join tables 
		$ptable = $table["metadata"]["primary"];
		$pname  = $ptable["name"];
		$pkeys  = $ptable["keys"];

		$stable = $table["metadata"]["second"];
		$sname  = $stable["name"];
		$skeys  = $stable["keys"];

		$mtable = $table["metadata"]["medium"];
		$mname  = $mtable["name"];
		$mpkeys = $mtable["keys"];
		$mskeys = $mtable["fkeys"];

		$errMsg = array();
		
		foreach( $table["rows"] as &$row ) {
			switch( $row["rowstate"] ) {
				case 0:
					break;
				case 1: 
					if( $table["rights"]["save"] ) {
						/* don't change primary table 
						$dbCols = cACTION::getSaveCols($table, "primary", $row);
						if(	count($dbCols["fields"]) >0 ) {
							$dbCols["fields"] = cARRAY::arrayMerge($dbCols["fields"], $ptable["update"]);
							$this->update($pname, $dbCols["keys"], $dbCols["fields"]);
						} 
						*/
						
						// create keys
						$dbCols = cACTION::getSaveCols($table, "primary", $row);
						$ssdbCols = cACTION::getSaveCols($table, "second", $row);
						if(	count($ssdbCols["fields"]) >0 ) {
							$ssdbCols["fields"] = cARRAY::arrayMerge($ssdbCols["fields"], $stable["update"]);
							$ssdbCols["fields"] = cARRAY::arrayMerge($ssdbCols["fields"], array("last_updated"=>time()));
							$this->update($sname, $ssdbCols["keys"], $ssdbCols["fields"]);
						} 

						$cidx = cARRAY::arrayIndex($row["cols"], array("coltype"=>"relation"));	
						if($cidx >= 0) {
							// create second keys
							$mmKeys = array();
							foreach( $mpkeys as $fidx=>$fkey ) {
								$mmKeys[ $colMap[$fkey] ] = $dbCols["keys"][$colMap[$pkeys[$fidx]]];
							}
							
							foreach( $mskeys as $fidx=>$fkey ) {
								$mmKeys[ $colMap[$fkey] ] = $ssdbCols["keys"][$colMap[$skeys[$fidx]]];
							}


							if( $row["cols"][$cidx]["value"] ) {  // if check relation true
								$mmdbCols = cACTION::getSaveCols($table, "medium", $row);
								if(	count($mmdbCols["fields"]) >0 ) {
									$mmdbCols["fields"] = cARRAY::arrayMerge($mmdbCols["fields"], $mtable["update"]);
									$mmdbCols["fields"] = cARRAY::arrayMerge($mmdbCols["fields"], array("last_updated"=>time(),"deleted"=>0));
									$this->modify($mname, $mmKeys, $mmdbCols["fields"]);
								} 
							} else {
								$this->detach($mname, $mmKeys);
							}

							$row["cols"][$cidx]["value"] = $mmKeys[ $colMap[$row["cols"][$cidx]["name"]] ];

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
						$dbCols["keys"] = array();
						foreach( $pkeys as $pkey ) {
							if($row["keys"][$pkey]) {
								$dbCols["keys"][ $colMap[$pkey] ] = $row["keys"][$pkey];
							} else {
								$row["error"]["errorCode"] 		= 3;
								$row["error"]["errorMessage"] 	= "Something wrong with primary key, please contact us.";
							}
						}

						if( !$row["error"]["errorCode"] ) {
							$mmCols = cACTION::getSaveCols($table, "medium", $row);
							$ssCols = cACTION::getSaveCols($table, "second", $row);
							if(	count($ssCols["fields"]) >0 ) {
								$ssCols["fields"] = cARRAY::arrayMerge($ssCols["fields"], $stable["insert"]);
								$ssCols["fields"] = cARRAY::arrayMerge($ssCols["fields"], array("created_time"=>time(), "deleted"=>0));
								$insertID = $this->insert($sname, $ssCols["fields"]);
								foreach( $row["cols"] as &$colObj ) {
									if( $colObj["key"] && !$colObj["value"]) $colObj["value"] = $insertID;
								}
								
								// update keys insert id
								foreach( $ssCols["keys"] as &$dbCol ) {
									$dbCol = $dbCol?$dbCol:$insertID;
								}
							}

						
							$mmCols["keys"] = array();
							foreach( $mpkeys as $fidx=>$fkey ) {
								$mmCols["keys"][ $colMap[$fkey] ] = $dbCols["keys"][$colMap[$pkeys[$fidx]]];
							}
							
							foreach( $mskeys as $fidx=>$fkey ) {
								$mmCols["keys"][ $colMap[$fkey] ] = $ssCols["keys"][$colMap[$skeys[$fidx]]];
							}
							$cidx = cARRAY::arrayIndex($row["cols"], array("coltype"=>"relation"));	
							if($cidx >= 0) {
								//print_r($mmCols["fields"]);
								//print_r($mmCols["keys"]);
								//print_r( $row["cols"][$cidx] );
								if( $row["cols"][$cidx]["value"] ) {  // if check relation true
									if(	count($mmCols["fields"]) >0 ) {
										$mmCols["fields"] = cARRAY::arrayMerge($mmCols["fields"], $mtable["update"]);
										$mmCols["fields"] = cARRAY::arrayMerge($mmCols["fields"], array("last_updated"=>time(), "deleted"=>0));
										//print_r($mmCols["fields"]);
										$this->modify($mname, $mmCols["keys"], $mmCols["fields"]);
									} 
								} else {
									// insert case:  uncheck relationship,  just create primary one record , second record not created, so medium table do nothing
									//$this->detach($mname, $mmKeys);
								}

								$row["cols"][$cidx]["value"] =  $mmCols["keys"][ $colMap[$row["cols"][$cidx]["name"]] ];
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
						$dbCols["keys"] = array();
						foreach( $pkeys as $pkey ) {
							if($row["keys"][$pkey]) {
								$dbCols["keys"][ $colMap[$pkey] ] = $row["keys"][$pkey];
							} else {
								$row["error"]["errorCode"] 		= 3;
								$row["error"]["errorMessage"] 	= "Something wrong with primary key, please contact us.";
							}
						}
						$ssCols = cACTION::getSaveCols($table, "second", $row);
						$mmCols["keys"] = array();
						foreach( $mpkeys as $fidx=>$fkey ) {
							$mmCols["keys"][ $colMap[$fkey] ] = $dbCols["keys"][$colMap[$pkeys[$fidx]]];
						}
						
						foreach( $mskeys as $fidx=>$fkey ) {
							$mmCols["keys"][ $colMap[$fkey] ] = $ssCols["keys"][$colMap[$skeys[$fidx]]];
						}
						$this->update($mname, $mmCols["keys"], array("last_updated"=>time()));
						$this->detach($mname, $mmCols["keys"]);
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
	/*************** end of Relational Table Functions ***********************************/
	
}

/***********************************************************************************************/
/*																							   */
/***********************************************************************************************/
class cACTION {
	static public function action($db, &$table ) {
		$table["colmap"] 	= cACTION::colMap($table);
		$table["colmeta"] 	= cACTION::colMeta($table);
		$table["success"] = 1;
		switch( $table["action"] ) {
			case "init":
				$table["rows"] = array();
				if( $table["rights"]["view"] ) {
					cLIST::getList($db, $table);
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
				cACTION::checkUniques($db, $table);
				break;
		}
		cACTION::getRowArray($table);
		$table["success"] = $table["error"]["errorCode"]?0:$table["success"];
	}

	static public function saveRows($db, &$table) {
		$tableMeta = $table["metadata"];
		switch( $tableMeta["type"] ) {
			case "one":
				$db->saveone($table);
				cACTION::saveChecks($db, $table, "primary");
				break;
			case "one2one":
				$db->saveone2one($table);
				cACTION::saveChecks($db, $table, "primary");
				cACTION::saveChecks($db, $table, "second");
				break;
			case "one2many":
				$db->saveone2many($table);
				cACTION::saveChecks($db, $table, "primary");
				cACTION::saveChecks($db, $table, "second");
				break;
			case "many2many":
				$db->savemany2many($table);
				cACTION::saveChecks($db, $table, "second");
				cACTION::saveChecks($db, $table, "medium");
				break;
		}
	}
	
	static public function getRows($db, &$table) {
		$tableMeta = $table["metadata"];
		switch( $tableMeta["type"] ) {
			case "one":
				$db->one($table);
				cACTION::getChecks($db, $table, "primary");
				break;
			case "one2one":
				$db->one2one($table);
				cACTION::getChecks($db, $table, "primary");
				cACTION::getChecks($db, $table, "second");
				break;
			case "one2many":
				$db->one2many($table);
				cACTION::getChecks($db, $table, "primary");
				cACTION::getChecks($db, $table, "second");
				break;
			case "many2many":
				$db->many2many($table);
				cACTION::getChecks($db, $table, "second");
				cACTION::getChecks($db, $table, "medium");
				break;
		}
	}

	static public function colMeta(&$table) {
		$arr = array();
		foreach($table["cols"] as $colMeta) {
			$arr[$colMeta["name"]]=$colMeta;
		}
		return $arr;
	}

	static public function colMap(&$table) {
		$arr = array();
		foreach($table["cols"] as $colMeta) {
			$arr[$colMeta["name"]]=$colMeta["col"];
		}
		return $arr;
	}

	static public function clearRows(&$table) {
		foreach($table["rows"] as &$theRow) {
				switch($table["action"]) {
					case "get":
						foreach($theRow as $colName=>$colValue) {
							if( !in_array( $table["colmap"][$colName], $table["colmap"] ) ) {
								unset($theRow[$colName]);
							} 
						}
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
		if(!DEBUG) unset($table["colmap"]);
		if(!DEBUG) unset($table["colmeta"]);
		if(!DEBUG) unset($table["filters"]);
		if(!DEBUG) unset($table["criteria"]);
		if(!DEBUG) unset($table["rights"]);
		if(!DEBUG) unset($table["listTable"]);
		if(!DEBUG) unset($table["metadata"]);
		if(!DEBUG) unset($table["rowsArray"]);
	}

	static public function getSaveCols($table, $tableLevel, &$row) {
		$colMap 	= $table["colmap"];

	    $dbCols = array();
		$dbCols["keys"] = array();
		$dbCols["fields"] = array();

		$tableMeta 	= $table["metadata"][$tableLevel];
		switch( $row["rowstate"] ) {
			case 0:
				break;
			case 1:
				foreach( $tableMeta["keys"] as $keyName ) {
					$dbCols["keys"][ $colMap[$keyName] ] = $row["keys"][$keyName];
				}
				foreach( $row["cols"] as &$colObj ) {
					if( $row["error"]["errorCode"] ) {
						// if error,  only return key col value , other col value set to empty to avoid trafic 
					} else {
						/******************************************/
						$colName 	= $colObj["name"];
						$fieldName 	= $colObj["col"];
						$colVal     = trim($colObj["value"]);
						// update case:  shouldn't update key and relation fields,  col must in the list 
						if( !$colObj["key"] && $colObj["coltype"]!="relation" && in_array($colName, $tableMeta["cols"]) ) {
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
						/******************************************/
					}
				}				
				break;
			case 2:
				// insert case:  composed cols, must find out the empty value col.  
				foreach( $tableMeta["keys"] as $keyName ) {
					if( !$row["keys"][$keyName] ) $dbCols["keys"][ $colMap[$keyName] ] = "";
					// below not support composed keys
					//$dbCols["keys"][ $colMap[$keyName] ] = "";
				}
		
				foreach( $row["cols"] as &$colObj ) {
					if( $row["error"]["errorCode"] ) {
					} else {
						/******************************************/
						$colName 	= $colObj["name"];
						$fieldName 	= $colObj["col"];
						$colVal     = trim($colObj["value"]);
						if( !$colObj["key"] && $colObj["coltype"]!="relation" && in_array($colName, $tableMeta["cols"]) ) {
							switch( $colObj["coltype"] ) {
								case "checkbox":
								case "checkbox1":
								case "checkbox2":
								case "checkbox3":
									break;
								default:
									$dbCols["fields"][$fieldName] = $colVal;
									break;
							}
						} elseif ($colObj["key"] && $colVal && in_array($colName, $tableMeta["cols"]) ) {
							// insert case: composed keys,  the key has value, must insert to table
							// comment below -  not support composed keys ,  because single edit row, mess up
							$dbCols["fields"][$fieldName] = $colVal;
						}
						/******************************************/
					}
				}				
				break;
			case 3:
				foreach( $tableMeta["keys"] as $keyName ) {
					$dbCols["keys"][ $colMap[$keyName] ] = $row["keys"][$keyName];
				}
				break;
		}
		return $dbCols;
	}

	static public function getCols($table, $tableLevel, $action) {
	    $tableMeta = $table["metadata"][$tableLevel];
		$cols = array();
		switch( $action ) {
			case "get":
				/*** get ***/
				foreach( $tableMeta["cols"] as $colName ) {
					$colMeta = $table["colmeta"][$colName];
					switch( $colMeta["coltype"] ) {
						case "checkbox":
						case "checkbox1":
						case "checkbox2":
						case "checkbox3":
							break;
						default:
							$cols[] = $colName;
							break;
					}
				}
				/***********/

				break;
			case "save":
				/*** save ***/
				/***********/
				break;
		}
		return $cols;
	}

	static public function getChecks($db, &$table, $tableLevel) {
	    $tableMeta 	= $table["metadata"][$tableLevel];
		$colMap 	= $table["colmap"];
		foreach( $table["rows"] as &$row ) {
			foreach( $tableMeta["cols"] as $colName ) {
				$colMeta = $table["colmeta"][$colName];
				switch( $colMeta["coltype"] ) {
					case "checkbox":
					case "checkbox1":
					case "checkbox2":
					case "checkbox3":
						$cktable = $table["metadata"][$colName]["name"];
						$ckfkeys =  $table["metadata"][$colName]["fkeys"];
						if( $cktable ) {
							$ccc = array();
							switch($tableLevel) {
								case "medium":
									$fidx = 0;
									foreach(  $table["metadata"]["primary"]["keys"] as $rkey ) 
									{
										$ccc[$ckfkeys[$fidx]] = $row[$rkey];
										$fidx++;
									}
									foreach( $table["metadata"]["second"]["keys"] as $rkey ) 
									{
										$ccc[$ckfkeys[$fidx]] = $row[$rkey];
										$fidx++;
									}
									break;
								default:
									foreach( $table["metadata"][$colName]["fkeys"] as $okey=>$rkey ) {
										$pkey = $tableMeta["keys"][$okey];
										$ccc[$rkey] = $row[$pkey];
									}
									break;
							}
							$fields 	= array();
							$ckValCol 	= $table["metadata"][$colName]["keys"][0];
							$fields[] 	= $ckValCol;
							$ckresult 	= $db->select( $cktable, $fields, $ccc );	
							$ckrows  	= $db->rows($ckresult);
							$row[$colName] = array();
							foreach( $ckrows as $ckrow ) {
								$row[$colName][] = intval($ckrow[$ckValCol]);
							}
						} else {
							$row[$colName] = array();
						}
						break;
					default:
						break;
				}
			}
		}
	}

	static public function saveChecks($db, &$table, $tableLevel) {
	    $tableMeta 	= $table["metadata"][$tableLevel];
		$colMap 	= $table["colmap"];
		foreach( $table["rows"] as &$row ) {
			// update case  +  insert case without error
			if( ($row["rowstate"]==1 || $row["rowstate"]==2) && $row["error"]["errorCode"]==0 ) {
				foreach( $tableMeta["cols"] as $colName ) {
					$colMeta = $table["colmeta"][$colName];
					switch( $colMeta["coltype"] ) {
						case "checkbox":
						case "checkbox1":
						case "checkbox2":
						case "checkbox3":
							$ckColIdx = cARRAY::arrayIndex($row["cols"], array("name"=>$colName) );
							if( $ckColIdx>=0) {
									$ckCol = $row["cols"][$ckColIdx];
									$ckValue = $ckCol["value"];
									$cktable = $table["metadata"][$colName]["name"];
									$ckfkeys =  $table["metadata"][$colName]["fkeys"];
									if( $cktable ) {
										$ccc = array();
										switch($tableLevel) {
											case "medium":
												$fidx = 0;
												foreach( $table["metadata"]["primary"]["keys"] as $rkey ) 
												{
													$tmpIdx = cARRAY::arrayIndex($row["cols"], array("name"=>$rkey) );
													$ccc[$ckfkeys[$fidx]] = $row["cols"][$tmpIdx]["value"];
													$fidx++;
												}
												foreach( $table["metadata"]["second"]["keys"] as $rkey ) 
												{
													$tmpIdx = cARRAY::arrayIndex($row["cols"], array("name"=>$rkey) );
													$ccc[$ckfkeys[$fidx]] = $row["cols"][$tmpIdx]["value"];
													$fidx++;
												}
												//print_r($ccc);
												break;
											default:
												foreach( $table["metadata"][$colName]["fkeys"] as $okey=>$rkey ) {
													$pkey = $tableMeta["keys"][$okey];
													//echo "key: $pkey\n";
													$tmpIdx = cARRAY::arrayIndex($row["cols"], array("name"=>$pkey) );
													$ccc[$rkey] = $row["cols"][$tmpIdx]["value"];
												}
												//print_r($ccc);
												break;
										}

										$db->delete($cktable, $ccc);
										$ckValCol 	= $table["metadata"][$colName]["keys"][0];
										//echo "value Col: $ckValCol\n";
										if( is_array($ckValue) ) {
											foreach( $ckValue as $ckVal ) {
												$ccc[$ckValCol] = $ckVal;
												//print_r($ccc);
												$db->insert($cktable, $ccc);
											}
										}

									} // if( $cktable )

							}

							break;
						default:
							break;
					}
				} // end of foreach meta cols
			}	
			// end of update case  +  insert case without error
		}
	}
    static public function checkUnique($db, &$table, $tableLevel) {
		$is_unique = true;
		$colMap 		= cACTION::colMap($table);
		$colMeta 		= cACTION::colMeta($table);
		$tableMeta 		= $table["metadata"][$tableLevel];
		$tableName 		= $tableMeta["name"];
		$tableColNames  = cACTION::getCols($table, $tableLevel, "get");
		$uCols = cARRAY::arrayFilter($table["cols"], array("unique"=>1));

		foreach( $uCols as $uCol ) {
			$uCol_name = $uCol["name"];
			if( in_array( $uCol_name, $tableColNames ) ) {
				foreach( $table["rows"] as &$theRow ) {
					$cidx = cARRAY::arrayIndex( $theRow["cols"], array("name"=>$uCol_name) );
					$theCol = $theRow["cols"][$cidx];
					$valKV  = array( $uCol["col"]=>$theCol["value"] );
					
					$keyKV 	= array();
					switch($tableLevel) {
						case "primary":
						case "second":
							$rKeys 	=$tableMeta["keys"];
							foreach( $rKeys as $rkey) {
								$key_col = $colMap[$rkey];
								$temp_cidx = cARRAY::arrayIndex( $theRow["cols"], array("name"=>$rkey)  );
								$rCol = $theRow["cols"][$temp_cidx];
								$keyKV[$key_col] = $rCol["value"];
							}
							break;
						case "medium":
							// create keys array() for database where clause
							if( $tableLevel=="medium" ) {
								foreach($tableMeta["keys"] as $fidx=>$rkey) {
									$pkey_name = $colMap[$table["metadata"]["primary"]["keys"][$fidx]];
									$temp_cidx = cARRAY::arrayIndex( $theRow["cols"], array("name"=>$pkey_name)  );
									$rCol = $theRow["cols"][$temp_cidx];
									$keyKV[$colMap[$rkey]] =  $rCol["value"];
								}

								foreach($tableMeta["fkeys"] as $fidx=>$rkey) {
									$pkey_name = $colMap[$table["metadata"]["second"]["keys"][$fidx]];
									$temp_cidx = cARRAY::arrayIndex( $theRow["cols"], array("name"=>$pkey_name)  );
									$rCol = $theRow["cols"][$temp_cidx];
									$keyKV[$colMap[$rkey]] =  $rCol["value"];
								}
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
							$is_unique = $db->checkUnique($tableName, $valKV, $keyKV);
							if(!$is_unique) {
								$table["success"] 				= 0;
								$theRow["error"]["errorCode"] 	= 1;
								$theRow["cols"][$cidx]["errorCode"] 		= 1;  
								$theRow["cols"][$cidx]["errorMessage"] 		= "'" . $uCol["colname"] . "' already in used.";  
							}
							break;
						case 2:
							$is_unique = $db->checkUnique($tableName, $valKV);
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
				cACTION::checkUnique($db, $table, "primary");
				break;
			case "one2one":
				cACTION::checkUnique($db, $table, "primary");
				cACTION::checkUnique($db, $table, "second");
				break;
			case "one2many":
				cACTION::checkUnique($db, $table, "primary");
				cACTION::checkUnique($db, $table, "second");
				break;
			case "many2many":
				cACTION::checkUnique($db, $table, "primary");
				cACTION::checkUnique($db, $table, "second");
				cACTION::checkUnique($db, $table, "medium");
				break;
		}
	}

	static public function filter(&$table, $tableCol, $val) {
		cTYPE::join($table["criteria"], " AND ", "$tableCol = '" . cTYPE::quote($val) . "'");
	}

	static public function formFilter(&$table) {
		$colMap 	= cACTION::colMap($table);
		$colMeta 	= cACTION::colMeta($table);

		// join tables 
		$ptable = $table["metadata"]["primary"];
		$pname  = $ptable["name"];
		$pkeys  = $ptable["keys"];

		//$primary_criteria = "1=1";
		foreach($pkeys as $idx=>$pkey) {
			$pk = $colMap[$pkey];
			$pv = trim($colMeta[$pkey]["defval"]);
			if( $pv ) {
				cTYPE::join($table["criteria"], " AND ", "a.$pk='" . cTYPE::quote($pv) . "'");				
			} else {
				// load data for form.
				cTYPE::join($table["criteria"], " AND ", "1=0");				
			}
		}
	}
	
	static public function getFilters(&$table) {
		$criteria = "";

		$filters = $table["filters"];
		$pcols = cACTION::getCols($table, "primary", "get");			
		$scols = cACTION::getCols($table, "second", "get");			
		$mcols = cACTION::getCols($table, "medium", "get");			

		if( is_array($filters) ) {
			foreach($filters as $filter) {
				$temp_ccc = "";
				$cols = explode(",", $filter["cols"]);
				foreach($cols as $col) {
					$tableCol 	= trim($col); 						
					$checkMeta  = array();
					$colIdx 	= cARRAY::arrayIndex($table["cols"], array("col"=>$col));
					if($colIdx>=0) {
						$colName 				= $table["cols"][$colIdx]["name"];
						$checkMeta["meta"] 		= $table["metadata"][$colName];
						$checkMeta["colmap"] 	= $table["colmap"];
						if(in_array($colName, $mcols) ) {
							$tableCol = "c.$col";
							$checkMeta["reftable"] 	= $table["metadata"]["medium"];
							$checkMeta["type"] 		= "medium";
						}
						if(in_array($colName, $scols) ) {
							$tableCol = "b.$col";
							$checkMeta["reftable"] = $table["metadata"]["second"];
							$checkMeta["type"] 		= "second";
						} 
						if(in_array($colName, $pcols) ) {
							$tableCol = "a.$col";
							$checkMeta["reftable"] = $table["metadata"]["primary"];
							$checkMeta["type"] 		= "primary";
						} 
					}
					cTYPE::join($temp_ccc, " OR " , cACTION::getCriteria($filter, $tableCol, $checkMeta));
				}
				$temp_ccc = $temp_ccc!=""?"(" . $temp_ccc . ")":$temp_ccc;
				cTYPE::join($criteria, " AND ", $temp_ccc);
			}
		}
		//echo "criteria:  $criteria";
		cTYPE::join($table["criteria"], " AND ",  $criteria);
	}

	static public function getCriteria($filter, $tableCol, $checkMeta) {
		$ret_ccc = "";
		$need = $filter["need"]?1:0;
		
		switch( $filter["coltype"] ) {
			case "textbox":
				$compare 	= $filter["compare"]?$filter["compare"]:"LIKE";

				/*** common part ***/
				$val 		= $filter["value"]?trim($filter["value"]):"";
				if($need) {
					if($val!="") 
						$ret_ccc = cACTION::getOperation($tableCol, $compare, $val);
					else 
						$ret_ccc = "1=0";
				} else {
					if($val!="") $ret_ccc = cACTION::getOperation($tableCol, $compare, $val);
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
						$ret_ccc = cACTION::getOperation($tableCol, $compare, $val);
					else 
						$ret_ccc = "1=0";
				} else {
					if($val!="") $ret_ccc = cACTION::getOperation($tableCol, $compare, $val);
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
				if($val!="") $ret_ccc = cACTION::getOperation($tableCol, $compare, $val);
				break;

			case "datetimerange":
			case "daterange":
			case "timerange":
			case "range":
				$compare 	= "";
				$fromVal 	= $filter["value"]["from"]?trim($filter["value"]["from"]):"";
				$toVal 		= $filter["value"]["to"]?trim($filter["value"]["to"]):"";
				if( $fromVal!="" )
					$ret_ccc = cACTION::getOperation($tableCol, ">=", $fromVal);
				if( $toVal!="" )
					cTYPE::join($ret_ccc, " AND ", cACTION::getOperation($tableCol, "<=", $toVal));
				
				$ret_ccc = $ret_ccc!=""? "(" . $ret_ccc . ")": $ret_ccc;   
				break;

			case "checkbox":
			case "checkbox1":
			case "checkbox2":
			case "checkbox3":
				$compare = strtoupper($filter["compare"])=="HAS"?strtoupper($filter["compare"]):"IN";
				if($need) {
					if(is_array($filter["value"]) && count($filter["value"])>0) {
						$val = array();
						foreach($filter["value"] as $fval) {
							$val[] = intval($fval);
						}
						$ret_ccc = cACTION::getOperation($tableCol, $compare, implode(",",$val), $checkMeta);
					} else {
						$ret_ccc = "1=0";
					}
				} else {
					if(is_array($filter["value"]) && count($filter["value"])>0) {
						$val = array();
						foreach($filter["value"] as $fval) {
							$val[] = intval($fval);
						}
						$ret_ccc = cACTION::getOperation($tableCol, $compare, implode(",",$val), $checkMeta);
					}					
				}
				break;
		}
		return $ret_ccc;
	}

	static public function getOperation($tableCol, $compare, $val, $checkMeta) {
		$ret_ccc = "";
		$compare = strtoupper($compare);
		switch($compare) {
			case "LIKE":
				$ret_ccc = "$tableCol $compare '%" . cTYPE::quote($val) . "%'"; 
				break;
			case "=":
			case "<":
			case "<=":
			case ">":
			case ">=":
				$ret_ccc = "$tableCol $compare '" . cTYPE::quote($val) . "'"; 
				break;
			case "IN":
				$ret_ccc = "$tableCol $compare (" . $val . ")"; 
				break;
			case "RANGE":
				$ret_ccc = "$tableCol BETWEEN '" . cTYPE::quote($val["from"]) . "' AND '" . cTYPE::quote($val["to"]) . "'"; 
				break;
			case "HAS":
				$ret_ccc = ""; 
				if( is_array($checkMeta) && count($checkMeta)>0 ) {
					$colMap  		= $checkMeta["colmap"];
					$cktable 		= $checkMeta["meta"];
					$type 			= $checkMeta["type"];
					$rftable 		= $checkMeta["reftable"];
					$cktable_name 	= $cktable["name"];
					switch( $type ) {
						case "primary":
							$ckjoinon = "";
							foreach( $cktable["fkeys"] as $cidx=>$ckey ) {
							   $rkey = $colMap[$rftable["keys"][$cidx]];
							   cTYPE::join($ckjoinon, " AND ", "$ckey=a.$rkey"); 
							}
							$vkey = $cktable["keys"][0];
							cTYPE::join( $ckjoinon, " AND ", "$vkey IN (" . $val . ")" );
							break;
						case "second":
							$ckjoinon = "";
							foreach( $cktable["fkeys"] as $cidx=>$ckey ) {
							   $rkey = $colMap[$rftable["keys"][$cidx]];
							   cTYPE::join( $ckjoinon, " AND ", "$ckey=b.$rkey"); 
							}
							$vkey = $cktable["keys"][0];
							cTYPE::join( $ckjoinon, " AND ", "$vkey IN (" . $val . ")" );
							break;
						case "medium":
							$ckjoinon = "";
							$fidx = 0;
							foreach($rftable["keys"] as $ridx=>$rkey ) 
							{
								$rkey = $colMap[$rkey]; 
								$ckey = $cktable["fkeys"][$fidx];
							    cTYPE::join( $ckjoinon, " AND ", "$ckey=c.$rkey"); 
								$fidx++;
							}
							foreach( $rftable["fkeys"] as  $ridx=>$rkey ) 
							{
								$rkey = $colMap[$rkey]; 
								$ckey = $cktable["fkeys"][$fidx];
							    cTYPE::join( $ckjoinon, " AND ", "$ckey=c.$rkey"); 
								$fidx++;
							}
							$vkey = $cktable["keys"][0];
							cTYPE::join( $ckjoinon, " AND ", "$vkey IN (" . $val . ")" );
							break;
					}
					$ret_ccc = "EXISTS (SELECT 1 FROM $cktable_name WHERE $ckjoinon)";
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

				if( $relation ) {
					$cidx = cARRAY::arrayIndex($theRow["cols"], array("coltype"=>"relation"));	
					if($cidx >= 0) {
						if( !$theRow["cols"][$cidx]["value"] ) {
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
								break;
							case "relation":
							case "bool":
								if(!$theCol["value"])  $theCol["value"]=0;
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
			return;
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
			$query 	= "SELECT id, scope, key1, key2, key3, title_en, title_cn, detail_en, detail_cn, full_name, short_name, ext_name, mime_type, main, orderno, status, rowsn, token FROM wliu_images WHERE $criteria $orderBy $limit";
			if(DEBUG) $images["query"] = $query;
			$result = $db->query($query);
			$rows   = $db->rows($result);

			if( $images["config"]["mode"]=="edit" ) {
				$imgType = "'origin','large','medium','small','tiny','thumb'";
			} else {
				$imgType = "'" . $images["config"]["thumb"] . "','" . $images["config"]["view"] . "'";
			}

			foreach( $rows as $rowsn=>&$theRow ) {
				$theRow["url"] = $GLOBALS["CFG"]["image_download_template"] . "?token=" . $theRow["token"] . "&id=" . $theRow["id"] . "&sn=" . $theRow["rowsn"];
				$query_row = "SELECT resize_type, name, ww, hh, width, height, size, data FROM wliu_images_resize WHERE ref_id='" . $theRow["id"] . "' AND resize_type in ($imgType)";
				$result_row = $db->query($query_row);
				while( $row_row = $db->fetch($result_row) ) {
					$image_type = $row_row["resize_type"];
					unset($row_row["resize_type"]);
					$theRow["resize"][$image_type] = $row_row;
				}
			}
			$images["rows"] = $rows;

			unset($images["config"]["access"]);
			unset($images["config"]["owner_id"]);
			unset($images["filter"]);
			return;
		}
	}
	static public function addImage($db, &$images ) {
		if( $images["config"]["mode"]=="edit" ) {		
			$query_config 		= "SELECT scope, max_length, max_size, access, key1, key2, key3 FROM wliu_config WHERE scope = '" . $images["config"]["scope"] . "'";
			if(!$db->exists($query_config)) {
				$images["errorCode"] 		= 1;
				$images["errorMessage"] 	= "Invalid Access Images";
				$images["rows"] = array();
				return;
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
				$fields["rowsn"] 		= $images["rowsn"];
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
				$images["url"] 	= $GLOBALS["CFG"]["image_download_template"] . "?token=" . $images["token"] . "&id=" . $images["id"] . "&sn=" . $images["rowsn"];
				unset($images["config"]);
				unset($images["filter"]);
				return;
			}
		} else {
			$images["errorCode"] 		= 1;
			$images["errorMessage"] 	= "Images are not allow to edited in list mode";
			$images["rows"] = array();
			return;
		}
	}
	static public function saveImage($db, &$images ) {
		if( $images["config"]["mode"]=="edit" ) {		
			$query_img 		= "SELECT * FROM wliu_images WHERE id = '" . $images["id"] . "'";
			$result_img 	= $db->query($query_img);
			$row_img 		= $db->fetch($result_img);
			if( $images["config"]["scope"] == $row_img["scope"] && $images["config"]["owner_id"] == $row_img["owner_id"]  )  {
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
					$ccc = array("resize_type"=>$resizType, "ref_id"=>$images["id"]);
					$db->update("wliu_images_resize", $ccc, $fields);
				}
			} else {
				$images["errorCode"] 		= 1;
				$images["errorMessage"] 	= "Invalid Access Images";
			}
			unset($images["resize"]);
			unset($images["config"]);
			return;
		} else {
			$images["errorCode"] 		= 1;
			$images["errorMessage"] 	= "Images are not allow to edited in list mode";
			unset($images["resize"]);
			unset($images["config"]);
			return;
		}
	}
	static public function saveText($db, &$images ) {
		if( $images["config"]["mode"]=="edit" ) {		
			$query_img 		= "SELECT * FROM wliu_images WHERE id = '" . $images["id"] . "'";
			if(!$db->exists($query_img)) {
				$images["errorCode"] 		= 1;
				$images["errorMessage"] 	= "Invalid Access Images";
				unset($images["config"]);
				return;
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
					$db->update("wliu_images", $images["id"], $fields);
				} else {
					$images["errorCode"] 		= 1;
					$images["errorMessage"] 	= "Invalid Access Images";
				}
				unset($images["config"]);
				return;
			}
		} else {
			$images["errorCode"] 		= 1;
			$images["errorMessage"] 	= "Images are not allow to edited in list mode";
			$images["rows"] = array();
			return;
		}
	}
	static public function deleteImage($db, &$images ) {
		if( $images["config"]["mode"]=="edit" ) {		
			$query_img 		= "SELECT * FROM wliu_images WHERE id = '" . $images["id"] . "'";
			$result_img 	= $db->query($query_img);
			$row_img 		= $db->fetch($result_img);
			if( $images["config"]["scope"] == $row_img["scope"] && $images["config"]["owner_id"] == $row_img["owner_id"]  )  {
				$db->detach("wliu_images", $images["id"]);
			} else {
				$images["errorCode"] 		= 1;
				$images["errorMessage"] 	= "Invalid Access Images";
			}
			unset($images["config"]);
			return;
		} else {
			$images["errorCode"] 		= 1;
			$images["errorMessage"] 	= "Images are not allow to edited in list mode";
			$images["rows"] = array();
			return;
		}
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
			return;
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
			$query 	= "SELECT id, scope, key1, key2, key3, title_en, title_cn, detail_en, detail_cn, full_name, short_name, ext_name, mime_type, main, orderno, status, rowsn, token FROM wliu_files WHERE $criteria $orderBy $limit";
			if(DEBUG) $files["query"] = $query;
			$result 		= $db->query($query);
			$rows   		= $db->rows($result);
			foreach( $rows as $rowsn=>&$theRow ) {
				$theRow["url"] = $GLOBALS["CFG"]["file_download_template"] . "?token=" . $theRow["token"] . "&id=" . $theRow["id"] . "&sn=" . $theRow["rowsn"];
			}
			$files["rows"] 	= $rows;
			unset($files["config"]["access"]);
			unset($files["config"]["owner_id"]);
			unset($files["filter"]);
			return;
		}
	}
	static public function addFile($db, &$files ) {
		if( $files["config"]["mode"]=="edit" ) {		
			$query_config 		= "SELECT scope, allow_type, max_length, max_size, access, key1, key2, key3 FROM wliu_config WHERE scope = '" . $files["config"]["scope"] . "'";
			if(!$db->exists($query_config)) {
				$files["errorCode"] 		= 1;
				$files["errorMessage"] 	= "Invalid Access Files";
				$files["rows"] = array();
				return;
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
				$fields["rowsn"] 		= $files["rowsn"];
				$fields["token"] 		= $files["token"];
				$fields["data"] 		= $files["data"];
				$fields["created_time"] = time();
				$fields["last_updated"] = time();
				$files["id"] = $db->insert("wliu_files", $fields);
				$files["url"] 	= $GLOBALS["CFG"]["file_download_template"] . "?token=" . $files["token"] . "&id=" . $files["id"] . "&sn=" . $files["rowsn"];
				unset($files["config"]);
				unset($files["filter"]);
				return;
			}
		} else {
			$files["errorCode"] 		= 1;
			$files["errorMessage"] 		= "Files are not allow to edited in list mode";
			$files["rows"] = array();
			return;
		}
	}
	static public function saveText($db, &$files ) {
		if( $files["config"]["mode"]=="edit" ) {		
			$query_file 		= "SELECT * FROM wliu_files WHERE id = '" . $files["id"] . "'";
			if(!$db->exists($query_file)) {
				$files["errorCode"] 		= 1;
				$files["errorMessage"] 	= "Invalid Access Files";
				unset($files["config"]);
				return;
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
					$db->update("wliu_files", $files["id"], $fields);
				} else {
					$files["errorCode"] 		= 1;
					$files["errorMessage"] 	= "Invalid Access Files";
				}
				unset($files["config"]);
				return;
			}
		} else {
			$files["errorCode"] 		= 1;
			$files["errorMessage"] 	= "Files are not allow to edited in list mode";
			$files["rows"] = array();
			return;
		}
	}
	static public function printFile($db, &$files ) {
		if( $files["config"]["mode"]=="edit" ) {		
			$query_file 		= "SELECT * FROM wliu_files WHERE id = '" . $files["id"] . "'";
			$result_file 	= $db->query($query_file);
			$row_file 		= $db->fetch($result_file);
			if( $files["config"]["scope"] == $row_file["scope"] ) {
				if($files["config"]["access"] == 1 ) {
					if( $files["config"]["owner_id"] == $row_file["owner_id"] ) {
						$result_data = $db->query("SELECT data FROM wliu_files WHERE deleted=0 AND id='". $files["id"] . "'");
						$row_data = $db->fetch($result_data);
						$files["data"] = $row_data["data"];
					} else {
						$files["errorCode"] 		= 1;
						$files["errorMessage"] 	= "Invalid Access Files";
					}
				} else {
					$result_data = $db->query("SELECT data FROM wliu_files WHERE deleted=0 AND id='". $files["id"] . "'");
					$row_data = $db->fetch($result_data);
					$files["data"] = $row_data["data"];
				}
			} else {
				$files["errorCode"] 		= 1;
				$files["errorMessage"] 	= "Invalid Access Files";
			}
			unset($files["config"]);
			return;
		} else {
			$files["errorCode"] 	= 1;
			$files["errorMessage"] 	= "Files are not allow to print";
			return;
		}
	}

	static public function deleteFile($db, &$files ) {
		if( $files["config"]["mode"]=="edit" ) {		
			$query_file 		= "SELECT * FROM wliu_files WHERE id = '" . $files["id"] . "'";
			$result_file 	= $db->query($query_file);
			$row_file 		= $db->fetch($result_file);
			if( $files["config"]["scope"] == $row_file["scope"] && $files["config"]["owner_id"] == $row_file["owner_id"]  )  {
				$db->detach("wliu_files", $files["id"]);
			} else {
				$files["errorCode"] 		= 1;
				$files["errorMessage"] 	= "Invalid Access Files";
			}
			unset($files["config"]);
			return;
		} else {
			$files["errorCode"] 		= 1;
			$files["errorMessage"] 	= "Files are not allow to edited in list mode";
			return;
		}
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
			$listObj["keys"]["rowsn"] 	= -1;
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
