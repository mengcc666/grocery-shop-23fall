<?php
// Database connection details
$host = 'localhost:3306';
$dbname = 'wplas5';
$username = 'root';
$password = '';

// Connect to the database using mysqli
$conn = new mysqli($host, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Select all columns from the inventory table
$result = $conn->query("SELECT * FROM inventory");

// Check if there are rows in the result
if ($result->num_rows > 0) {
    $rows = array();
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    echo json_encode($rows);
} else {
    echo json_encode(['error' => 'No data found in the inventory table']);
}

// Close the database connection
$conn->close();
?>