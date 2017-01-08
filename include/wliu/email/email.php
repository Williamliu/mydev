<?php
class cEMAIL {
	private	$boundary 		= 0;
	private $headers 		= '';
	private $headers_arr	= array();
	private $nl		 		= "\r\n";
	private $sendTo			= '';
	private $sendTo_arr		= array();
	private $subject		= '';
	private $body			= '';
	private $attachment		= '';

	private $message		= '';	
	private $embed_img		= '';
    private $mime_types = array(
            'text' 	=> 'text/plain; charset=UTF-8',
            'html' 	=> 'text/html; charset=UTF-8',
			'png' 	=> 'image/png',
			'jpg'	=> 'image/jpeg',
			'jpeg'	=> 'image/jpeg',
			'gif'	=> 'image/gif',
			'tif'	=> 'image/tiff',
			'bmp'	=> 'image/bmp'
			);
	public 	$type			= 'html';

	function __construct() {  // ( from, to, sendTo, body, attach)
		$pnum 	= func_num_args();
		$params	= func_get_args();
		
		$this->boundary	= md5(time());
		
		switch($pnum) {
			case 1:
				$this->headers_arr = $params[0];
				$this->set_headers();		
				break;
			case 2:
				$this->headers_arr 	= $params[0];
				$this->set_headers();		

				$this->setSend($params[1]);		
				break;
			case 3:
				$this->headers_arr 	= $params[0];
				$this->set_headers();		

				$this->setSend($params[1]);		
				$this->setSubject($params[2]);
				break;
			
			case 4:
				$this->headers_arr 	= $params[0];
				$this->set_headers();		

				$this->setSend($params[1]);		
				$this->setSubject($params[2]);
				$this->setBody($params[3]);			
				break;
			case 5:
				$this->headers_arr 	= $params[0];
				$this->set_headers();		

				$this->setSend($params[1]);		
				$this->setSubject($params[2]);
				$this->setBody($params[3]);			
				$this->setAttach($params[4]);				
				break;
		}
	}
	
	
	public function setFrom($arr) {
		if($arr) {
			if(is_array($arr)) {
				foreach($arr as $key=>$val) {
					$this->headers_arr[$key] = $val;
				}
			} else {
				$this->headers_arr["from"] = $arr;
			}
		} else {
			$this->headers_arr["from"] = '';
		}
		$this->set_headers();
	}
	
	public function setSend($arr) {
		if($arr) {
			if(is_array($arr)) {
			  	$this->sendTo_arr = $arr;
			} else {
				$this->sendTo_arr = array();
				$this->sendTo_arr[] = $arr;
			}
		} else {
		  	$this->sendTo_arr = array();
		}
	  	$this->set_sendTos();
	}

	public function appendSend($arr) {
		if($arr) {
			if(is_array($arr)) {
				foreach($arr as $val) {
					if($val) $this->sendTo_arr[] = $val;
				}
			} else {
				$this->sendTo_arr[] = $arr;
			}
		} 
		$this->set_sendTos();
	}

	public function setSubject($s) {
		$this->subject = $s;
	}
	
	public function setBody($b) {
		$this->body	= chunk_split(base64_encode($b));	
		$this->set_message();			
	}

	public function setAttach($b) {
		$this->attachment = '';
		$file = $b["file"];
		if( file_exists($file) ) {
			  $file_name = substr($file, strrpos($file,"/")+1);
			  $file_ext = substr($file_name, strrpos($file_name,".")+1);
			  $new_file = $file_name;
			  if($b["name"]) {
				  if( strrpos($b["name"], ".") != false ) {
					  $new_file = $b["name"];
				  } else {
					  $new_file = $b["name"] . "." . $file_ext;
				  }
			  }
			  
			  $data = chunk_split(base64_encode(file_get_contents($file)));

			  $this->attachment .= "--" . $this->boundary . $this->nl;
			  $this->attachment .= "Content-Type: application/octet-stream; name=\"" . $new_file . "\"" . $this->nl;
			  $this->attachment .= "Content-Disposition: attachment; filename=\"" . $new_file . "\"; size=" . filesize($file) . ";" . $this->nl;
			  $this->attachment .= "Content-Transfer-Encoding: base64;" . $this->nl . $this->nl;
			  $this->attachment .= $data . $this->nl . $this->nl;
			  $this->attachment .= "--" . $this->boundary . $this->nl;
		}
	}

	public function setEmbed($b) {
		$this->embed_img = '';
		$this->embed_img .= "--" . $this->boundary . $this->nl;		
		$this->embed_img .= "Content-Type: multipart/related; boundary=\"msg-embed-" . $this->boundary . "\"" . $this->nl . $this->nl;
		$file = $b["file"];
		if( file_exists($file) ) {
			  $file_name = substr($file, strrpos($file,"/")+1);
			  $file_ext = substr($file_name, strrpos($file_name,".")+1);
			  
			  $data = chunk_split(base64_encode(file_get_contents($file)));

			  $this->embed_img .= "--msg-embed-" . $this->boundary . $this->nl;
			  $this->embed_img .= "Content-Type: " . $this->mime_types[strtolower($file_ext)]  . "; name=\"" . $file_name . "\"" . $this->nl;
			  $this->embed_img .= "Content-Transfer-Encoding: base64" . $this->nl;
			  $this->embed_img .= "Content-ID: <php-cid-" . $b["id"] . ">" . $this->nl . $this->nl; 		  
			  $this->embed_img .= $data . $this->nl . $this->nl;
			  $this->embed_img .= "--msg-embed-" . $this->boundary  .  $this->nl . $this->nl;
		}
	}

	public function setRaw($b, $bname) {
			$this->attachment = '';
			$data = chunk_split(base64_encode($b));
			
			$this->attachment .= "--" . $this->boundary . $this->nl;
			$this->attachment .= "Content-Type: application/octet-stream; name=\"" . $bname . "\"" . $this->nl;
			$this->attachment .= "Content-Disposition: attachment; filename=\"" . $bname . "\";" . $this->nl;
			$this->attachment .= "Content-Transfer-Encoding: base64;" . $this->nl . $this->nl;
			$this->attachment .= $data . $this->nl . $this->nl;
			$this->attachment .= "--" . $this->boundary . $this->nl;
	}

	public function appendRaw($b, $bname) {
			$data = chunk_split(base64_encode($b));
			
			$this->attachment .= "--" . $this->boundary . $this->nl;
			$this->attachment .= "Content-Type: application/octet-stream; name=\"" . $bname . "\"" . $this->nl;
			$this->attachment .= "Content-Disposition: attachment; filename=\"" . $bname . "\";" . $this->nl;
			$this->attachment .= "Content-Transfer-Encoding: base64;" . $this->nl . $this->nl;
			$this->attachment .= $data . $this->nl . $this->nl;
			$this->attachment .= "--" . $this->boundary . $this->nl;
	}
	
	public function appendAttach($b) {
		$file = $b["file"];
		if( file_exists($file) ) {
			  $file_name = substr($file, strrpos($file,"/")+1);
			  $file_ext = substr($file_name, strrpos($file_name,".")+1);
			  $new_file = $file_name;
			  if($b["name"]) {
				  if( strrpos($b["name"], ".") != false ) {
					  $new_file = $b["name"];
				  } else {
					  $new_file = $b["name"] . "." . $file_ext;
				  }
			  }
			  
			  $fp 	= fopen($file,"r");
			  $data = fread($fp,filesize($file));
			  fclose($fp);
			  $data = chunk_split(base64_encode($data));
			  
			  $this->attachment .= "--" . $this->boundary . $this->nl;
			  $this->attachment .= "Content-Type: application/octet-stream;" . $this->nl;
			  $this->attachment .= "Content-Transfer-Encoding: base64; " . $this->nl; 
			  $this->attachment .= "Content-Disposition: attachment;\n filename=\"" . basename($new_file) . "\"; size=" . filesize($file) . "" . $this->nl . $this->nl;
			  $this->attachment .= $data . $this->nl . $this->nl;
			  $this->attachment .= "--" . $this->boundary  . $this->nl;
		}
	}
	
		public function appendEmbed($b) {
		$file = $b["file"];
		if( file_exists($file) ) {
			  $file_name = substr($file, strrpos($file,"/")+1);
			  $file_ext = substr($file_name, strrpos($file_name,".")+1);
			  
			  $data = chunk_split(base64_encode(file_get_contents($file)));

			  $this->embed_img .= "--msg-embed-" . $this->boundary . $this->nl;
			  $this->embed_img .= "Content-Type: " . $this->mime_types[strtolower($file_ext)]  . "; name=\"" . $file_name . "\"" . $this->nl;
			  $this->embed_img .= "Content-Transfer-Encoding: base64" . $this->nl;
			  $this->embed_img .= "Content-ID: <php-cid-" . $b["id"] . ">" . $this->nl . $this->nl; 		  
			  $this->embed_img .= $data . $this->nl . $this->nl;
			  $this->embed_img .= "--msg-embed-" . $this->boundary  .  $this->nl . $this->nl;
		}
	}


	public function send() {
		$msg 	= '';
		// email body part 
		$msg	.= $this->message;
		$msg	.= $this->embed_img;
		$msg	.= $this->attachment;	

		return mail($this->sendTo, $this->subject, $msg, $this->headers);
	}
	
	// internal method from here
	private function set_headers() {
		$this->headers	= "";
		$this->headers .= 'From: ' . 		$this->array_str($this->headers_arr["from"]) . $this->nl;
		$this->headers .= 'Reply-To: ' . 	$this->array_str($this->headers_arr["reply"])  . $this->nl;
		$this->headers .= 'Return-Path: ' . $this->array_str($this->headers_arr["return"])  . $this->nl;
		$this->headers .= 'Cc: ' . 			$this->array_str($this->headers_arr["cc"])  . $this->nl;
		$this->headers .= 'Bcc: ' . 		$this->array_str($this->headers_arr["bcc"])  . $this->nl;

		$this->headers .= 'Message-ID: <' . time() . 'theSystem@' . $_SERVER['SERVER_NAME'] . '>' . $this->nl;
		$this->headers .= 'X-Mailer: PHP v' . phpversion()  . $this->nl;
		$this->headers .= 'MIME-Version: 1.0' . $this->nl;

		$this->headers .= "Content-Type: multipart/mixed; boundary=\"" . $this->boundary . "\"" . $this->nl; 
		// important:  don't use  single quote ' ;   must use \"  or no quote 
	}
	
	private function set_sendTos() {
		$this->sendTo = implode(", ", $this->sendTo_arr);
	}
	
	private function set_message() {
		$this->message	= '';
		
		//body part
		$this->message .= "--" . $this->boundary . $this->nl;
		$this->message .= "Content-Type: " . $this->mime_types[$this->type] . $this->nl;
		$this->message .= "Content-Transfer-Encoding: base64" . $this->nl . $this->nl;
		$this->message .= $this->body . $this->nl . $this->nl;
		$this->message .= "--" . $this->boundary . $this->nl . $this->nl;
		//$this->message .= "--" . $this->boundary . "--" . $this->nl . $this->nl;
		
	
	}
	
	private function array_str($a) {
		return $a?(is_array($a)?implode(", ", $a):$a):"";
	}
	// end of internal method
}

/******** sample ******************/
/*

$a["from"] 		= "william@usanacity.com";
$a["reply"] 	= "service@taobaovan.com";
$a["return"] 	= "service@taobaovan.com";
$a["cc"] 	= "service@taobaovan.com";
$a["bcc"] 	= "service@taobaovan.com";

$b[0]			= "william_lwh@hotmail.com";
$b[1]			= "185290926@qq.com";

$html = '<table border="1">';
$html .= '<tr>';
$html .= '<td style="background-color:#cccccc; border-bottom: 1px solid black;">';
$html .= 'Hello';
$html .= '</td>';
$html .= '<td style="background-color:#cccccc; border-bottom: 1px solid black;">';
$html .= 'Name';
$html .= '</td>';
$html .= '</tr>';
$html .= '<tr>';
$html .= '<td style="background-color:#cccccc; border-bottom: 1px solid black;">';
$html .= 'Hello';
$html .= '</td>';
$html .= '<td style="background-color:#cccccc; border-bottom: 1px solid black;">';
$html .= 'Name';
$html .= '</td>';
$html .= '</tr>';
$html .= '<tr>';
$html .= '<td style="color:blue;">';
$html .= 'World';
$html .= '</td>';
$html .= '<td align="right" style="color:red;">';
$html .= 93434343;
$html .= '</td>';
$html .= '</tr>';
$html .= '</table><img src="cid:php-cid-111" /><br><img src="cid:php-cid-333" /><br><img src="cid:php-cid-222" />';

$e = new cEMAIL($a, $b, "Good morning", "<b>Hello World</b>", array("name"=>"my_pdf", "file"=>$CFG["web_path"] . "/ppp.pdf"));
$e->setSubject("My email class test!");

$e->setBody($html);
$e->appendAttach(array("name"=>"lwh_product.xls", "file"=>$CFG["web_path"] . "/p1.xls"));
$e->setEmbed(array("id"=>"111", "file"=>$CFG["web_path"] . "/tbv.gif"));
$e->appendEmbed(array("id"=>"222", "file"=>$CFG["web_path"] . "/hhh.JPG"));
$e->appendEmbed(array("id"=>"333", "file"=>$CFG["web_path"] . "/winter.jpg"));
$e->appendRaw($html, "hello.xls");

$e->send();
*/
?>