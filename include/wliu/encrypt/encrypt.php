<?php
class LWHENCRYPT {
	private static $m_cipher = MCRYPT_RIJNDAEL_256;
	private static $m_mode = MCRYPT_MODE_ECB;
	//private static $m_cipher = "rijndael-256";
	//private static $m_mode = "ecb";
	private static $m_key = '6tgf6e57y7487y8y84h3tk=-ikhthj6j09ubfignb09ubf0pobGhj@ioh^Ia1#5v6F8n7ik4u3](7bF6e$885hg8d78t62fnhu4t546g5dus6f6gru34g7fi1281208tyvhg7gyt7vh';
	
	public static function encrypt($data) {
		$key = md5(substr(self::$m_key, 51, 32)); // to improve variance
		$td = mcrypt_module_open(self::$m_cipher, '', self::$m_mode, '');
		srand((double) microtime() * 100000); //for sake of MCRYPT_RAND
		$iv = mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
		mcrypt_generic_init($td, $key, $iv);
		$encrypted_data = bin2hex(mcrypt_generic($td, $data));
		mcrypt_generic_deinit($td);
		mcrypt_module_close($td);
		return $encrypted_data;
	}
		
	public static function decrypt($data) {
		$key = md5(substr(self::$m_key, 51, 32)); // to improve variance
		$td = mcrypt_module_open(self::$m_cipher, '', self::$m_mode, '');
		srand((double) microtime() * 1000000); //for sake of MCRYPT_RAND
		$iv = mcrypt_create_iv (mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
		mcrypt_generic_init($td, $key, $iv);
		$decrypted_data = mdecrypt_generic($td, pack('H*', $data));
		mcrypt_generic_deinit($td);
		mcrypt_module_close($td);
		return $decrypted_data;
	}
}

class LWHENCRYPT2 
{
    private static $key = "bcb04b7e103a0cd8b54763051cef08bc55abe029fdebae5e1d417e2ffb2a00a3";
    public static function encrypt($data) {
        $key1 = pack("H*", self::$key);
        $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
        $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);

        $ciphertext = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key1,  $data, MCRYPT_MODE_CBC, $iv);
        $ciphertext = $iv . $ciphertext;
        return base64_encode($ciphertext);
    }

    public static function decrypt($data) {
        $key1 = pack("H*", self::$key);
        $ciphertext_dec = base64_decode($data);
        $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
        $iv_dec = substr($ciphertext_dec, 0, $iv_size);
        $ciphertext_dec = substr($ciphertext_dec, $iv_size);
        $plaintext_dec = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $key1, $ciphertext_dec, MCRYPT_MODE_CBC, $iv_dec);
        return $plaintext_dec;
    }    
}
?>