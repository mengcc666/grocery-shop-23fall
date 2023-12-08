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

        // Validate and sanitize input values as needed

        // Check if the transactionId is provided
        if (!$transactionId) {
            die(json_encode(['status' => 'failed', 'message' => 'Transaction ID is required.']));
        }

        // Check if the transaction is already shopped
        $checkStatusQuery = "SELECT transactionstatus FROM transactions WHERE transactionid = ?";
        $checkStatusStmt = $conn->prepare($checkStatusQuery);
        $checkStatusStmt->bind_param('i', $transactionId);
        $checkStatusStmt->execute();
        $checkStatusResult = $checkStatusStmt->get_result();
        $statusData = $checkStatusResult->fetch_assoc();
        $checkStatusStmt->close();

        if ($statusData && $statusData['transactionstatus'] === 'shopped') {
            die(json_encode(['status' => 'failed', 'message' => 'Shopped transaction cannot be canceled.']));
        }

        // Check if the transaction is already canceled
        if ($statusData && $statusData['transactionstatus'] === 'canceled') {
            die(json_encode(['status' => 'failed', 'message' => 'This transaction is already canceled.']));
        }

        // Start a transaction
        $conn->begin_transaction();

        try {
            // Find all quantity records in carts
            $query = "SELECT itemnumber, quantity FROM carts WHERE transactionid = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('i', $transactionId);
            $stmt->execute();
            $result = $stmt->get_result();
            $cartItems = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            // Update inventory quantity for each item
            foreach ($cartItems as $cartItem) {
                $updateQuery = "UPDATE inventory SET quantityininventory = quantityininventory + ? WHERE itemnumber = ?";
                $updateStmt = $conn->prepare($updateQuery);
                $updateStmt->bind_param('ii', $cartItem['quantity'], $cartItem['itemnumber']);
                $updateStmt->execute();
                $updateStmt->close();
            }

            // Update carts and transactions tables
            $updateQuery = "UPDATE carts SET cartstatus = 'canceled' WHERE transactionid = ?";
            $updateStmt = $conn->prepare($updateQuery);
            $updateStmt->bind_param('i', $transactionId);
            $updateStmt->execute();
            $updateStmt->close();

            $updateQuery = "UPDATE transactions SET transactionstatus = 'canceled' WHERE transactionid = ?";
            $updateStmt = $conn->prepare($updateQuery);
            $updateStmt->bind_param('i', $transactionId);
            $updateStmt->execute();
            $updateStmt->close();

            // Commit the transaction
            $conn->commit();

            // Send the success response
            echo json_encode(['status' => 'success']);

        } catch (Exception $e) {
            // Rollback the transaction in case of an error
            $conn->rollback();

            // Send the error response
            echo json_encode(['status' => 'failed', 'message' => $e->getMessage()]);
        }

        // Close the database connection
        $conn->close();

    } catch (Exception $e) {
        // Handle database connection errors
        echo json_encode(['status' => 'failed', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'failed', 'message' => 'Invalid request method']);
}

?>