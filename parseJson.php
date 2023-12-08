<?php
// Check if a file is uploaded
if (isset($_FILES['file'])) {
    $file = $_FILES['file'];

    // Get the file extension
    $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);

    // Check if the file has a valid JSON extension
    if (strtolower($fileExtension) === 'json') {
        // Read the uploaded JSON file
        $jsonContent = file_get_contents($file['tmp_name']);

        // Decode the JSON content
        $items = json_decode($jsonContent, true);

        // Check if JSON decoding was successful
        if ($items !== null) {
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

                // Check if the inventory table is empty
                $result = $conn->query("SELECT COUNT(*) FROM inventory");
                $row = $result->fetch_row();
                $isInventoryEmpty = $row[0] == 0;

                // Iterate over each item in the JSON and insert into the inventory table
                foreach ($items as $item) {
                    $department = $item['department'];
                    $category = $item['category'];
                    $price = $item['price'];
                    $inventoryQuantity = $item['inventory'];
                    $picture = $item['picture'];
                    $lastSlash = strrpos((string) $picture, "/");
                    $lastDot = strrpos((string) $picture, ".");

                    // Extract the substring between "/" and "."
                    $name = substr((string) $picture, $lastSlash + 1, $lastDot - $lastSlash - 1);


                    // Select the max of itemNumber in the inventory table
                    $result = $conn->query("SELECT MAX(itemNumber) FROM inventory");
                    $row = $result->fetch_row();
                    $itemNumber = $row[0] + 1;

                    // Check if a record with the same name exists in the inventory table
                    $stmt = $conn->prepare("SELECT itemNumber, QuantityInInventory FROM inventory WHERE Name = ?");
                    $stmt->bind_param('s', $name);
                    $stmt->execute();
                    $stmt->store_result();

                    if ($stmt->num_rows > 0) {
                        // Update the existing record with the additional inventory quantity
                        $stmt->bind_result($existingItemNumber, $existingQuantity);
                        $stmt->fetch();

                        $newQuantity = $existingQuantity + $inventoryQuantity;
                        $stmtUpdate = $conn->prepare("UPDATE inventory SET QuantityInInventory = ? WHERE itemNumber = ?");
                        $stmtUpdate->bind_param('ii', $newQuantity, $existingItemNumber);
                        $stmtUpdate->execute();
                        $stmtUpdate->close();
                    } else {
                        // Insert a new record into the inventory table
                        $stmtInsert = $conn->prepare("INSERT INTO inventory (itemNumber, Name, Category, Subcategory, UnitPrice, QuantityInInventory, picture) VALUES (?, ?, ?, ?, ?, ?, ?)");
                        $stmtInsert->bind_param('isssdis', $itemNumber, $name, $department, $category, $price, $inventoryQuantity, $picture);

                        $stmtInsert->execute();
                        $stmtInsert->close();
                    }

                    // Close the prepared statement
                    $stmt->free_result();
                }

                // Return success response
                echo json_encode(['success' => true]);

                // Close the database connection
                $conn->close();
            } catch (Exception $e) {
                // Handle database connection errors
                echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Error decoding JSON file']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid file type']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'No file uploaded']);
}
?>