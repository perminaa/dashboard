<?php

if ( $_SERVER['REQUEST_METHOD']=='GET' && realpath(__FILE__) == realpath( $_SERVER['SCRIPT_FILENAME'] ) ) {        
	header( 'HTTP/1.0 403 Forbidden', TRUE, 403 );
	die( header( 'location: /index.html' ) );
}

function debug_to_console($data) {
    $output = $data;
    if (is_array($output))
        $output = implode(',', $output);

    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}

function OpenConnection()
{
	$serverName = "3.138.92.49,1433";
	$connectionOptions = array("Database"=>"Dashboard_MASTER",
		"Uid"=>"sa", "PWD"=>"Monster4321!", "Encrypt"=>true, "TrustServerCertificate"=>true, 'ReturnDatesAsStrings'=>true);
	$conn = sqlsrv_connect($serverName, $connectionOptions);
	if($conn == false){
		debug_to_console("Connection Failed!");
		die(var_dump(sqlsrv_errors()));
	}
	return $conn;
}

function ReadData()
{
	$results = array();
	$params = array();

	foreach(json_decode($_POST['parameters']) as $key => $value) {
		array_push($params, $value);
	}

	try
	{
		$conn = OpenConnection();

		if (count($params) > 0) {
			$stmt = sqlsrv_query($conn, $_POST['request'], $params);
		} else {
			$stmt = sqlsrv_query($conn, $_POST['request']);
		}
		$fieldMetadata = sqlsrv_field_metadata( $stmt );
		if ($stmt == FALSE)
			die(var_dump(sqlsrv_errors()));

		while($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC))
		{
			$result = array();

			foreach($fieldMetadata as $value) {
				$result[$value['Name']] = $row[$value['Name']];
			}

			$results[] = $result;
		}

		sqlsrv_free_stmt($stmt);
		sqlsrv_close($conn);
	}
	catch(Exception $e)
	{
		echo("Error!");
	}
	return $results;
}

$data = ReadData();

echo json_encode(array("results"=>$data));

?>