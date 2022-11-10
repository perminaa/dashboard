<?php
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="myFile.csv"');

require_once('config_server.php');

// Get table
$table = $_POST['selected_table'];
// Get the parameters ready for sanitizing
$params = array();
foreach(json_decode($_POST['parameters']) as $key => $value) {
	array_push($params, $value);
}
// Get the excluded/included values
$vals = "";
foreach(json_decode($_POST['rows']) as $value) {
	$vals .= substr($value, 1) . ", ";
}

// Get the total amount of records to chunk
$totalRecordString = "";
$query = $_POST['request'];
if (count($params) > 0) {
    foreach(json_decode($_POST['parameters']) as $key => $value) {
        $totalRecordString .= " ${key} LIKE ? AND";
    } 
    $totalRecordString = "SELECT count(*) FROM ${table}" . " WHERE" . 
    substr($totalRecordString, 0, -4);
} else {
    $totalRecordString = "SELECT count(*) FROM ${table}";
}
// Get the accurate results that the user intended
if ($_POST['selectAll'] == 'true') {
    if (!empty(json_decode($_POST['rows']))){
        if (count($params) > 0) {
            $query .= " AND " . $_POST['pk'] . " NOT IN (" . substr($vals, 0, -2) . ")";
            $totalRecordString .= " AND " . $_POST['pk'] . " NOT IN (" . substr($vals, 0, -2) . ")";
        } else {
            $query .= " WHERE " . $_POST['pk'] . " NOT IN (" . substr($vals, 0, -2) . ")";
            $totalRecordString .= " WHERE " . $_POST['pk'] . " NOT IN (" . substr($vals, 0, -2) . ")";
        }
    }
} else {
    if (!empty(json_decode($_POST['rows']))){
        if (count($params) > 0) {
            $query .= " AND " . $_POST['pk'] . " IN (" . substr($vals, 0, -2) . ")";
            $totalRecordString .= " AND " . $_POST['pk'] . " IN (" . substr($vals, 0, -2) . ")";
        } else {
            $query .= " WHERE " . $_POST['pk'] . " IN (" . substr($vals, 0, -2) . ")";
            $totalRecordString .= " WHERE " . $_POST['pk'] . " IN (" . substr($vals, 0, -2) . ")";
        }
    }
}

// Open connection
$conn = OpenConnection();
// Send query for total records
$resultQuery = sqlsrv_query($conn, $totalRecordString, $params);
$totalRecords = sqlsrv_fetch_array($resultQuery)[0];

$csvName = "php://output";
$fp = fopen($csvName , 'w');

$result = sqlsrv_query($conn, $query, $params);
foreach( sqlsrv_field_metadata($result) as $fieldMetadata)
{
    $headers[] = $fieldMetadata['Name'];
}
fputcsv($fp, array_values($headers));

for($x = 0; $x < $totalRecords; $x+=1000){
    $sqlQuery = $query . " ORDER BY (SELECT NULL) OFFSET ${x} ROWS FETCH NEXT 1000 ROWS ONLY;";
    $sqlRresult = sqlsrv_query($conn, $sqlQuery, $params);
    while ($export = sqlsrv_fetch_array($sqlRresult, SQLSRV_FETCH_ASSOC)) {
        fputcsv($fp, $export);
    }
    sqlsrv_free_stmt($sqlRresult);
}

sqlsrv_close($conn);

fclose($fp);
?>