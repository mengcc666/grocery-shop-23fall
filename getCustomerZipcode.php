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
        $zipcode = isset($_POST['zipcode']) ? $_POST['zipcode'] : null;
        $year = isset($_POST['year']) ? intval($_POST['year']) : null;
        $month = isset($_POST['month']) ? intval($_POST['month']) : null;

        // Validate and sanitize input values as needed

        // Query to select customers with more than 2 transactions on the given month and year
        $query = "
            SELECT c.customerid, c.firstname, c.lastname, c.age, c.phonenumber, c.email, c.address, c.dateofbirth
            FROM customers c
            JOIN transactions t ON c.customerid = t.customerid
            WHERE YEAR(t.transactiondate) = ? AND MONTH(t.transactiondate) = ? AND c.address LIKE ?
            GROUP BY c.customerid
            HAVING COUNT(t.transactionid) > 2
        ";

        $stmt = $conn->prepare($query);

        // Check for errors in the prepare statement
        if (!$stmt) {
            die(json_encode(['status' => 'failed', 'message' => 'Prepare failed: ' . $conn->error]));
        }

        // Adding '%' around the zipcode for a substring match
        $zipcodeLike = '%' . $zipcode . '%';

        $stmt->bind_param('iss', $year, $month, $zipcodeLike);
        $stmt->execute();
        $result = $stmt->get_result();
        $customers = $result->fetch_all(MYSQLI_ASSOC);

        // Close the database connection
        $stmt->close();
        $conn->close();

        // Send the customer data as a JSON response
        echo json_encode(['status' => 'success', 'customers' => $customers]);

    } catch (Exception $e) {
        // Handle database connection errors
        echo json_encode(['status' => 'failed', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'failed', 'message' => 'Invalid request method']);
}
?>
