<?php
// Your database connection details
$host = 'localhost:3306';
$dbname = 'wplas5';
$username = 'root';
$password = '';

try {
    // Connect to the database using mysqli
    $conn = new mysqli($host, $username, $password, $dbname);

    // Check the connection
    if ($conn->connect_error) {
        die(json_encode(['success' => false, 'error' => 'Connection failed: ' . $conn->connect_error]));
    }

    // Query to get the maximum transaction id
    $query = "SELECT MAX(TransactionID) AS maxTransactionId FROM transactions";
    $result = $conn->query($query);

    // Check if the query was successful
    if ($result !== false) {
        // Check if there are rows in the result
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if ($row['maxTransactionId'] == null) {
                $maxTransactionId = 0;
            } else {
                $maxTransactionId = $row['maxTransactionId'];
            }
            echo json_encode(['success' => true, 'maxTransactionId' => $maxTransactionId]);
        } else {
            // No transactions found
            echo json_encode(['success' => true, 'maxTransactionId' => 0]);
        }
    } else {
        // Handle query execution error
        echo json_encode(['success' => false, 'error' => 'Query execution failed: ' . $conn->error]);
    }

    // Close the database connection
    $conn->close();
} catch (Exception $e) {
    // Handle database connection errors
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>