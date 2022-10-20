<?php
function encrypt($key, $data) {
    $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
    $encrypted = openssl_encrypt($data, 'aes-256-cbc', $key, 0, $iv);
    return base64_encode($encrypted . '::' . $iv);
}

function dataToFile($filename, $data){
    $key = "ldfhahhahtdot674hs4wyhhw6yjhfd8b";
    $encrypted=encrypt($key, $data);

    file_put_contents($filename, $encrypted);
}

$json = json_encode($_POST['update']);
$userfile = substr(json_encode($_POST['filename']), 1, 7);

echo $userfile;
echo $json;

dataToFile("config/{$userfile}.json", $json);
?>