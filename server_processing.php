<?php
require_once('config_server.php');
$params = array();
$table = $_POST['selected_table'];

$conn = OpenConnection();

foreach(json_decode($_POST['parameters']) as $key => $value) {
	array_push($params, $value);
}

$totalRecordString = "";
$searchString = "";

foreach(json_decode($_POST['fields']) as &$value) {
    if (count($params) > 0) {
        $searchString .= "${value} like '%SEARCH%' OR ";
    } else {
      $searchString .= " ${value} like '%SEARCH%' OR";  
    }
}

if (count($params) > 0) {
    $searchString = " AND (" . substr($searchString, 0, -4) . ")";

    foreach(json_decode($_POST['parameters']) as $key => $value) {
        $totalRecordString .= " ${key} LIKE ? AND";
    }
    
    $totalRecordString = "SELECT count(*) FROM ${table}" . " WHERE" . 
    substr($totalRecordString, 0, -4);
} else {
    $totalRecordString = "SELECT count(*) FROM ${table}";
    $searchString = " WHERE" . substr($searchString, 0, -3);
}

$query = sqlsrv_query($conn, $totalRecordString, $params);
$totalRecords = $totalFiltered = sqlsrv_fetch_array($query)[0];

if ($query == FALSE)
			die(var_dump(sqlsrv_errors()));
 
$length = $_POST['length'];
$start = $_POST['start'];
 
$sql = $_POST['request'];
 
if (isset($_POST['search']) && !empty($_POST['search']['value'])) {
    $search = $_POST['search']['value'];
    $sql .= str_replace("SEARCH", $search, $searchString);
    $filter =  $totalRecordString . str_replace("SEARCH", $search, $searchString);
    $fquery = sqlsrv_query($conn, $filter, $params);
    $totalFiltered = sqlsrv_fetch_array($fquery)[0];
}
 
$sql .= " ORDER BY (SELECT NULL) OFFSET $start ROWS FETCH NEXT $length ROWS ONLY;";
$query = sqlsrv_query($conn, $sql, $params);
$results = [];

$fieldMetadata = sqlsrv_field_metadata( $query );

if ($query == FALSE)
			die(var_dump(sqlsrv_errors()));


while ($row = sqlsrv_fetch_array($query, SQLSRV_FETCH_ASSOC)) {
    $result = array();

	foreach($fieldMetadata as $value) {
		$result[] = $row[$value['Name']];
	}

	$results[] = $result;
}

echo json_encode([
    'draw' => $_POST['draw'],
    'recordsTotal' => $totalRecords,
    'recordsFiltered' => $totalFiltered,
    'data' => $results,
]);