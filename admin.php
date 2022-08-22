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
	$connectionOptions = array("Database"=>"dashboard",
		"Uid"=>"sa", "PWD"=>"Monster1234!", "Encrypt"=>true, "TrustServerCertificate"=>false);
	$conn = sqlsrv_connect($serverName, $connectionOptions);
	if($conn == false){
		debug_to_console("Connection Failed!");
		die(FormatErrors(sqlsrv_errors()));
	}
	return $conn;
}

function ReadData($table)
{
	$results = array();

	try
	{
		$conn = OpenConnection();

		$stmt = sqlsrv_query($conn, "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'$table'");
		
		$fieldMetadata = sqlsrv_field_metadata( $stmt );
		if ($stmt == FALSE)
			die(FormatErrors(sqlsrv_errors()));

		while($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC))
		{
			$results[] = $row["COLUMN_NAME"];
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

$table = $_POST['function'];
$data = ReadData($table);

echo json_encode(array("results"=>$data));
?>