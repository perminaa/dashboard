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
		"Uid"=>"sa", "PWD"=>"Monster1234!", "Encrypt"=>true, "TrustServerCertificate"=>true, 'ReturnDatesAsStrings'=>true);
	$conn = sqlsrv_connect($serverName, $connectionOptions);
	if($conn == false){
		debug_to_console("Connection Failed!");
		die(var_dump(sqlsrv_errors()));
	}
	return $conn;
}

function add_connection()
{
	$results = array();
	$params = array();
	array_push($params, $_POST['server']);
	array_push($params, $_POST['database']);
	array_push($params, $_POST['username']);
	array_push($params, $_POST['password']);

	try
	{
		$conn = OpenConnection();

		$stmt = sqlsrv_query($conn, "EXEC create_linked_server @input_server=?, @input_table=?, @input_username=?, @input_password=?;", $params);

		if ($stmt == FALSE) {
            die(var_dump(sqlsrv_errors()));
        }

        $fieldMetadata = sqlsrv_field_metadata( $stmt );

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

function test_connection()
{
	try
	{
		$conn = OpenConnection();

		$stmt = sqlsrv_query($conn, 'EXEC test_connections;');
		$stmt = sqlsrv_query($conn, 'SELECT * FROM TEST_CONN;');

		if ($stmt == FALSE) {
            die(var_dump(sqlsrv_errors()));
        }

        $fieldMetadata = sqlsrv_field_metadata( $stmt );

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

function valid_connection()
{
	$results = array();
	$params = array();
	array_push($params, $_POST['server']);
	array_push($params, $_POST['database']);

	try
	{
		$conn = OpenConnection();

		$stmt = sqlsrv_query($conn, "SELECT con_status FROM TEST_CONN WHERE server_name LIKE ? AND table_name LIKE ?;", $params);
		if ($stmt == FALSE) {
            die(var_dump(sqlsrv_errors()));
        }

        $fieldMetadata = sqlsrv_field_metadata( $stmt );

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

add_connection();
test_connection();
$data = valid_connection();

echo json_encode(array("results"=>$data));

?>