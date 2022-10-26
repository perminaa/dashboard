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
	try
	{
		$conn = OpenConnection();

		$stmt = sqlsrv_query($conn, 'EXEC Dashboard_MASTER.dbo.pull_data;');
        echo $stmt;
		if ($stmt == FALSE) {
            die(var_dump(sqlsrv_errors()));
        }

        $rows = sqlsrv_has_rows($stmt);
        echo $rows;

        if ($rows == TRUE){
            echo 'Test';
        }

		while($row = sqlsrv_fetch_array($stmt))
		{
            echo $row[0];
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