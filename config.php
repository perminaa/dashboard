<?php

function debug_to_console($data) {
    $output = $data;
    if (is_array($output))
        $output = implode(',', $output);

    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}

function encrypt($key, $data) {
    $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
    $encrypted = openssl_encrypt($data, 'aes-256-cbc', $key, 0, $iv);
    return base64_encode($encrypted . '::' . $iv);
}

function decrypt($key, $garble) {
    // php mcrypt_decrypt alternative:
    list($encrypted_data, $iv) = explode('::', base64_decode($garble), 2);
    return openssl_decrypt($encrypted_data, 'aes-256-cbc', $key, 0, $iv);
}

function dataFromFile($filename) {
    $key = "ldfhahhahtdot674hs4wyhhw6yjhfd8b";
    $data = file_get_contents($filename);
    return decrypt($key, $data);
}

function dataToFile($filename, $data){
    $key = "ldfhahhahtdot674hs4wyhhw6yjhfd8b";
    $encrypted=encrypt($key, $data);

    file_put_contents($filename, $encrypted);
}

#$json = json_encode('{"INV_ASSETS" : ["CNTL_ID", "BUSINESS_UNIT", "ASSET_ID", "DEPT_ID", "TAG_NUMBER", "MODEL"]}');
#dataToFile("config/test.json", $json);

$results = dataFromFile("config/test.json");

echo json_decode($results);
?>