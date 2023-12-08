<?php
// Database connection details
$host = 'localhost:3306';
$dbname = 'wplas5';
$username = 'root';
$password = '';

try {
    // Connect to the database using mysqli
    $conn = new mysqli($host, $username, $password, $dbname);

    // Check the connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Query to select all items from the inventory table
    $query = "SELECT * FROM inventory";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $items = array();

        while ($row = $result->fetch_assoc()) {
            // Create an associative array for each item
            $item = array(
                'department' => $row['Category'],
                'category' => $row['Subcategory'],
                'name' => $row['Name'],
                'picture' => $row['Picture'],
                'price' => $row['UnitPrice'],
                'inventory' => $row['QuantityInInventory'],
                'itemNumber'=> $row['ItemNumber']
            );

            // Add the item to the items array
            $items[] = $item;
        }

        // Encode the items array as JSON and echo it
        echo json_encode($items);
    } else {
        // No items found
        echo json_encode(array());
    }

    // Close the database connection
    $conn->close();
} catch (Exception $e) {
    // Handle database connection errors
    echo json_encode(['error' => $e->getMessage()]);
}
?>
