<?php
class LWHCOL {
	public $colObj;
    public $result;
	public $db;
	private $dlang;
	public function __construct($db, $col, $dlang) {
		$this->colObj 	                        = $col;
		$this->db 		                        = $db;
		$this->dlang							= $dlang;
		$this->colObj["lang"] 					= $col["lang"]?$col["lang"]:$this->dlang;
		$this->action();
	}

	public function action() {
		switch($this->colObj["action"]) {
			case "checkbox":
				$this->cklist();
                $this->result["data"] = $this->colObj["data"];
				break;
			case "radio":
				$this->cklist();
                $this->result["data"] = $this->colObj["data"];
				break;
		}
	}

	public function cklist() {
		$db = $this->db;
		/********************************/
		$stable		= $this->colObj["stable"];
		$scol		= $this->colObj["scol"];
		$stitle		= $this->colObj["stitle"];
		$sdesc		= $this->colObj["sdesc"];
		/*******************************/
		
		$fields		= $scol;
		$fields		.= ($stitle==""?"":",") . 	$stitle; 	 		
		$fields		.= ($sdesc==""?"":",") . 	$sdesc; 	 		
          
        $query     	= "SELECT $fields FROM $stable WHERE deleted <> 1 AND status = 1 ORDER BY orderno DESC, created_time ASC";
        $result    	= $db->query($query); 
        $rows 		= array();
		$cnt = 0;
		while( $row = $db->fetch($result) ) {
			$rows[$cnt]["id"] 			= $row[$scol]; LANG::trans($val, $this->form["schema"]["lang"]);
			$rows[$cnt]["title"] 		= LANG::trans( $row[$stitle]?$row[$stitle]:"", $this->colObj["lang"] );
			$rows[$cnt]["description"] 	= LANG::trans($row[$sdesc]?$row[$sdesc]:"", $this->colObj["lang"] );
			$cnt++;
		}
		$this->colObj["data"] = $rows;
	}
}
?>
