<?php

// Your database connection details
$host = 'localhost:3306';
$dbname = 'wplas5';
$username = 'root';
$password = '';

try {
    // Connect to the database using mysqli
    $conn = new mysqli($host, $username, $password, $dbname);

    // Check the connection
    if ($conn->connect_error) {
        die(json_encode(['status' => 'failed', 'message' => 'Connection failed: ' . $conn->connect_error]));
    }

    // Query to select customers above 20 with more than 3 transactions
    $query = "
        SELECT c.customerid, c.firstname, c.lastname, c.age, c.phonenumber, c.email, c.address, c.dateofbirth
        FROM customers c
        JOIN transactions t ON c.customerid = t.customerid
        WHERE c.age > 20
        GROUP BY c.customerid
        HAVING COUNT(t.transactionid) > 3
    ";

    $result = $conn->query($query);

    // Check if there are results
    if ($result->num_rows > 0) {
        // Fetch the results into an associative array
        $customers = $result->fetch_all(MYSQLI_ASSOC);

        // Close the database connection
        $conn->close();

        // Send the customer data as a JSON response
        echo json_encode(['status' => 'success', 'customers' => $customers]);
    } else {
        echo json_encode(['status' => 'failed', 'message' => 'No customers found.']);
    }
} catch (Exception $e) {
    // Handle database connection errors
    echo json_encode(['status' => 'failed', 'message' => $e->getMessage()]);
}
?>