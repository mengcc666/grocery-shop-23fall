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
        $itemNumber = isset($_POST['itemNumber']) ? intval($_POST['itemNumber']) : null;

        $unitPrice = isset($_POST['unitPrice']) ? $_POST['unitPrice'] : null;
        $quantity = isset($_POST['quantity']) ? intval($_POST['quantity']) : null;

        // Validate and sanitize input values as needed

        // Check if the itemNumber exists in the inventory table
        $queryCheckItem = "SELECT * FROM inventory WHERE itemNumber = ?";
        $stmtCheckItem = $conn->prepare($queryCheckItem);

        // Check for errors in the prepare statement
        if (!$stmtCheckItem) {
            die(json_encode(['status' => 'failed', 'message' => 'Prepare failed: ' . $conn->error]));
        }

        $stmtCheckItem->bind_param('i', $itemNumber);
        $stmtCheckItem->execute();
        $result = $stmtCheckItem->get_result();

        if ($result->num_rows > 0) {
            // The itemNumber exists, update unitPrice and QuantityinInventory
            $queryUpdateInventory = "UPDATE inventory SET unitPrice = ?, QuantityinInventory = ? WHERE itemNumber = ?";
            $stmtUpdateInventory = $conn->prepare($queryUpdateInventory);

            // Check for errors in the prepare statement
            if (!$stmtUpdateInventory) {
                die(json_encode(['status' => 'failed', 'message' => 'Prepare failed: ' . $conn->error]));
            }

            $stmtUpdateInventory->bind_param('dii', $unitPrice, $quantity, $itemNumber);
            $stmtUpdateInventory->execute();
            $stmtUpdateInventory->close();

            // Fetch the updated quantity
            $updatedQuantity = fetchUpdatedQuantity($conn, $itemNumber);

            // Close the database connection
            $stmtCheckItem->close();
            $conn->close();

            // Send a success response with the updated quantity
            echo json_encode(['status' => 'success', 'quantityInInventory' => $updatedQuantity]);
        } else {
            // Itemnumber not exists
            $stmtCheckItem->close();
            $conn->close();
            echo json_encode(['status' => 'failed', 'message' => 'Itemnumber not exists']);
        }
    } catch (Exception $e) {
        // Handle database connection errors
        echo json_encode(['status' => 'failed', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'failed', 'message' => 'Invalid request method']);
}

function fetchUpdatedQuantity($conn, $itemNumber)
{
    // Fetch the updated quantity
    $queryFetchQuantity = "SELECT QuantityinInventory FROM inventory WHERE itemNumber = ?";
    $stmtFetchQuantity = $conn->prepare($queryFetchQuantity);

    if (!$stmtFetchQuantity) {
        die(json_encode(['status' => 'failed', 'message' => 'Prepare failed: ' . $conn->error]));
    }
    $updatedQuantity=0;
    $stmtFetchQuantity->bind_param('i', $itemNumber);
    $stmtFetchQuantity->execute();
    $stmtFetchQuantity->bind_result($updatedQuantity);
    $stmtFetchQuantity->fetch();
    $stmtFetchQuantity->close();

    return $updatedQuantity;
}

?>