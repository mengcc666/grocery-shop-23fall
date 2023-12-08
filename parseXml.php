<?php
// Check if a file is uploaded
if (isset($_FILES['file'])) {
    $file = $_FILES['file'];

    // Get the file extension
    $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);

    // Check if the file has a valid XML extension
    if (strtolower($fileExtension) === 'xml') {
        // Load the XML file
        $xml = simplexml_load_file($file['tmp_name']);

        // Check if the XML is valid and has the expected structure
        if ($xml !== false && isset($xml->item)) {
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

                // Iterate over each item in the XML and insert into the inventory table
                foreach ($xml->item as $item) {
                    $department = (string) $item->department;
                    $category = (string) $item->category;
                    $lastSlash = strrpos((string) $item->picture, "/");
                    $lastDot = strrpos((string) $item->picture, ".");

                    // Extract the substring between "/" and "."
                    $name = substr((string) $item->picture, $lastSlash + 1, $lastDot - $lastSlash - 1);

                    $price = (float) $item->price;
                    $picture = (string) $item->picture;
                    $inventoryQuantity = (int) $item->inventory;

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
            echo json_encode(['success' => false, 'error' => 'Invalid XML structure']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid file type']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'No file uploaded']);
}
?>