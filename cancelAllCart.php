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
        $postData = json_decode(file_get_contents("php://input"), true);

        // Validate JSON data
        if (!isset($postData['transactionId']) || !isset($postData['itemRecords'])) {
            echo json_encode(['status' => 'failed', 'message' => 'Invalid input']);
            exit;
        }

        $transactionId = $postData['transactionId'];
        $itemRecords = $postData['itemRecords'];

        // Start a transaction
        $conn->begin_transaction();

        // Update inventory quantities based on item records
        foreach ($itemRecords as $itemRecord) {
            $itemId = $itemRecord['itemNumber'];
            $quantity = $itemRecord['quantity'];

            // Update inventory quantity
            $updateQuery = "UPDATE inventory SET quantityininventory = quantityininventory + ? WHERE itemnumber = ?";
            $stmt = $conn->prepare($updateQuery);
            $stmt->bind_param('is', $quantity, $itemId);
            $stmt->execute();
        }

        // Update cart status
        $updateCartQuery = "UPDATE carts SET cartstatus = 'canceled' WHERE transactionid = ?";
        $stmtCart = $conn->prepare($updateCartQuery);
        $stmtCart->bind_param('i', $transactionId);
        $stmtCart->execute();

        // Update transaction status
        $updateTransactionQuery = "UPDATE transactions SET transactionstatus = 'canceled' WHERE transactionid = ?";
        $stmtTransaction = $conn->prepare($updateTransactionQuery);
        $stmtTransaction->bind_param('i', $transactionId);
        $stmtTransaction->execute();

        // Commit the transaction
        $conn->commit();

        // Send a success response
        echo json_encode(['status' => 'success', 'message' => 'Transaction canceled successfully']);

    } catch (Exception $e) {
        // Rollback the transaction on error
        $conn->rollback();

        // Handle database connection errors
        echo json_encode(['status' => 'failed', 'message' => $e->getMessage()]);
    } finally {
        // Close the database connection
        $conn->close();
    }

} else {
    echo json_encode(['status' => 'failed', 'message' => 'Invalid request method']);
}
?>