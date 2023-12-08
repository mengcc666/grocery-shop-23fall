<?php
// Your database connection details
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
        $transactionId = isset($_POST['transactionId']) ? $_POST['transactionId'] : null;

        // Update cart status to 'shopped'
        $query = "UPDATE carts SET CartStatus = 'shopped' WHERE TransactionID = ?";
        $stmt = $conn->prepare($query);

        // Check for errors in the prepare statement
        if (!$stmt) {
            die(json_encode(['status' => 'failed', 'message' => 'Prepare failed: ' . $conn->error]));
        }

        $stmt->bind_param('i', $transactionId);
        $stmt->execute();
        $stmt->close();

        // Close the database connection
        $conn->close();

        // Send success response
        echo json_encode(['status' => 'success', 'message' => 'Cart has been successfully shopped']);

    } catch (Exception $e) {
        // Handle database connection errors
        echo json_encode(['status' => 'failed', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'failed', 'message' => 'Invalid request method']);
}
?>
