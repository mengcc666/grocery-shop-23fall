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
        $userId = isset($_POST['userId']) ? $_POST['userId'] : null;
        $transactionId = isset($_POST['transactionId']) ? $_POST['transactionId'] : null;

        // Validate and sanitize input values as needed

        // Query to get cart data
        $query = "
            SELECT i.itemnumber, i.category, i.subcategory, i.name, c.quantity, c.unitprice
            FROM inventory i
            JOIN carts c ON i.itemnumber = c.itemnumber
            WHERE c.transactionid = ? AND c.customerid = ?
        ";

        $stmt = $conn->prepare($query);

        // Check for errors in the prepare statement
        if (!$stmt) {
            die(json_encode(['status' => 'failed', 'message' => 'Prepare failed: ' . $conn->error]));
        }

        $stmt->bind_param('ii', $transactionId, $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $cart = $result->fetch_all(MYSQLI_ASSOC);

        // Close the database connection
        $stmt->close();
        $conn->close();

        // Send the cart data as a JSON response
        echo json_encode(['status' => 'success', 'cart' => $cart]);

    } catch (Exception $e) {
        // Handle database connection errors
        echo json_encode(['status' => 'failed', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'failed', 'message' => 'Invalid request method']);
}
?>