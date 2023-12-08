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
        $itemNumber = isset($_POST['itemNumber']) ? $_POST['itemNumber'] : null;
        $itemName = isset($_POST['itemName']) ? $_POST['itemName'] : null;
        $itemAmount = isset($_POST['itemAmount']) ? $_POST['itemAmount'] : null;
        $transactionId = isset($_POST['transactionId']) ? $_POST['transactionId'] : null;
        $userIdFromFrontend = isset($_POST['userId']) ? $_POST['userId'] : null;
        $unitPrice = isset($_POST['unitPrice']) ? $_POST['unitPrice'] : null;

        // Check if quantity in inventory is sufficient
        $queryCheckInventory = "SELECT QuantityInInventory FROM inventory WHERE Name = ?";
        $stmtCheckInventory = $conn->prepare($queryCheckInventory);

        // Check for errors in the prepare statement
        if (!$stmtCheckInventory) {
            die(json_encode(['status' => 'failed', 'message' => 'Prepare failed: ' . $conn->error]));
        }

        $stmtCheckInventory->bind_param('s', $itemName);
        $stmtCheckInventory->execute();
        $stmtCheckInventory->bind_result($quantityInInventory);

        // Fetch the result
        if ($stmtCheckInventory->fetch() && $quantityInInventory >= intval($itemAmount)) {
            $stmtCheckInventory->close(); // Close this statement before preparing the next one

            // Update inventory
            $queryUpdateInventory = "UPDATE inventory SET QuantityInInventory = QuantityInInventory - ? WHERE Name = ?";
            $stmtUpdateInventory = $conn->prepare($queryUpdateInventory);

            // Check for errors in the prepare statement
            if (!$stmtUpdateInventory) {
                die(json_encode(['status' => 'failed', 'message' => 'Prepare failed: ' . $conn->error]));
            }

            $stmtUpdateInventory->bind_param('is', $itemAmount, $itemName);
            $stmtUpdateInventory->execute();
            $stmtUpdateInventory->close();

            // Check if the item is already in the cart
            $queryCheckCart = "SELECT Quantity FROM carts WHERE TransactionID = ? AND ItemNumber = ?";
            $stmtCheckCart = $conn->prepare($queryCheckCart);

            // Check for errors in the prepare statement
            if (!$stmtCheckCart) {
                die(json_encode(['status' => 'failed', 'message' => 'Prepare failed: ' . $conn->error]));
            }

            $stmtCheckCart->bind_param('ii', $transactionId, $itemNumber);
            $stmtCheckCart->execute();
            $stmtCheckCart->bind_result($quantityInCart);

            if ($stmtCheckCart->fetch()) {
                $stmtCheckCart->close(); // Close this statement before preparing the next one

                // Update cart
                $queryUpdateCart = "UPDATE carts SET Quantity = Quantity + ? WHERE TransactionID = ? AND ItemNumber = ?";
                $stmtUpdateCart = $conn->prepare($queryUpdateCart);

                // Check for errors in the prepare statement
                if (!$stmtUpdateCart) {
                    die(json_encode(['status' => 'failed', 'message' => 'Prepare failed: ' . $conn->error]));
                }

                $stmtUpdateCart->bind_param('iii', $itemAmount, $transactionId, $itemNumber);
                $stmtUpdateCart->execute();
                $stmtUpdateCart->close();
            } else {
                $stmtCheckCart->close(); // Close this statement before preparing the next one

                // Insert into cart
                $queryInsertCart = "INSERT INTO carts (CustomerID, TransactionID, ItemNumber, Quantity,unitPrice, CartStatus) VALUES (?, ?, ?, ?, ?,?)";
                $stmtInsertCart = $conn->prepare($queryInsertCart);

                // Check for errors in the prepare statement
                if (!$stmtInsertCart) {
                    die(json_encode(['status' => 'failed', 'message' => 'Prepare failed: ' . $conn->error]));
                }

                // Set the CartStatus value
                $cartStatus = 'in-cart';

                // Bind the parameters, including the CustomerID
                $stmtInsertCart->bind_param('iiiids', $userIdFromFrontend, $transactionId, $itemNumber, $itemAmount, $unitPrice, $cartStatus);
                $stmtInsertCart->execute();
                $stmtInsertCart->close();
            }
            // update transaction
            // Calculate total price by summing products of quantity and unit price
            $queryCalculateTotalPrice = "SELECT SUM(carts.Quantity * carts.UnitPrice) AS totalprice FROM carts WHERE carts.TransactionID = ?";
            $stmtCalculateTotalPrice = $conn->prepare($queryCalculateTotalPrice);

            if (!$stmtCalculateTotalPrice) {
                die("Prepare failed: " . $conn->error);
            }

            $stmtCalculateTotalPrice->bind_param('i', $transactionId);
            $stmtCalculateTotalPrice->execute();
            $stmtCalculateTotalPrice->bind_result($totalPrice);
            $stmtCalculateTotalPrice->fetch();
            $stmtCalculateTotalPrice->close();

            // Check if there is an existing record for the TransactionID in transactions table
            $queryCheckExistingRecord = "SELECT COUNT(*) AS recordCount FROM transactions WHERE TransactionID = ?";
            $stmtCheckExistingRecord = $conn->prepare($queryCheckExistingRecord);

            if (!$stmtCheckExistingRecord) {
                die("Prepare failed: " . $conn->error);
            }

            $stmtCheckExistingRecord->bind_param('i', $transactionId);
            $stmtCheckExistingRecord->execute();
            $stmtCheckExistingRecord->bind_result($recordCount);
            $stmtCheckExistingRecord->fetch();
            $stmtCheckExistingRecord->close();

            // Insert or update the transactions table based on the record count
            if ($recordCount == 0) {
                // Insert new record
                $queryInsertTransaction = "INSERT INTO transactions (TransactionID, customerid,TransactionStatus, TransactionDate, TotalPrice)
          VALUES (?, ?,'in-cart', CURRENT_DATE(), ?)";
                $stmtInsertTransaction = $conn->prepare($queryInsertTransaction);

                if (!$stmtInsertTransaction) {
                    die("Prepare failed: " . $conn->error);
                }

                $stmtInsertTransaction->bind_param('iid', $transactionId, $userIdFromFrontend,$totalPrice);
                $stmtInsertTransaction->execute();
                $stmtInsertTransaction->close();
            } else {
                // Update existing record
                $queryUpdateTransaction = "UPDATE transactions SET TotalPrice = ? WHERE TransactionID = ?";
                $stmtUpdateTransaction = $conn->prepare($queryUpdateTransaction);

                if (!$stmtUpdateTransaction) {
                    die("Prepare failed: " . $conn->error);
                }

                $stmtUpdateTransaction->bind_param('di', $totalPrice, $transactionId);
                $stmtUpdateTransaction->execute();
                $stmtUpdateTransaction->close();
            }

            echo json_encode(['status' => 'success', 'inventory' => $quantityInInventory - $itemAmount]);

        } else {
            $stmtCheckInventory->close(); // Close this statement before preparing the next one

            // Insufficient quantity in inventory
            echo json_encode(['status' => 'failed', 'message' => 'Insufficient quantity in inventory']);
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