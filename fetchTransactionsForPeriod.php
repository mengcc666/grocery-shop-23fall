<?php

$host = 'localhost:3306';
$dbname = 'wplas5';
$username = 'root';
$password = '';

// Check if POST data is present
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Connect to the database using mysqli
        $conn = new mysqli($host, $username, $password, $dbname);

        // Check the connection
        if ($conn->connect_error) {
            die(json_encode(['status' => 'failed', 'message' => 'Connection failed: ' . $conn->connect_error]));
        }

        // Extract data from the POST request
        $userid = isset($_POST['userid']) ? $_POST['userid'] : null;
        $period = isset($_POST['period']) ? $_POST['period'] : null;

        // Validate and sanitize input values as needed

        // Query to select transactions based on the selected userid and period
        $query = "
            SELECT *
            FROM transactions
            WHERE customerid = ? AND DATE_FORMAT(transactiondate, '%Y-%m') = ?
        ";

        $stmt = $conn->prepare($query);

        // Check for errors in the prepare statement
        if (!$stmt) {
            die(json_encode(['status' => 'failed', 'message' => 'Prepare failed: ' . $conn->error]));
        }

        $stmt->bind_param('is', $userid, $period);
        $stmt->execute();
        $result = $stmt->get_result();
        $transactions = $result->fetch_all(MYSQLI_ASSOC);

        // Close the database connection
        $stmt->close();
        $conn->close();

        // Send the transaction data as a JSON response
        echo json_encode(['status' => 'success', 'transactions' => $transactions]);

    } catch (Exception $e) {
        // Handle database connection errors
        echo json_encode(['status' => 'failed', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'failed', 'message' => 'Invalid request method']);
}
?>