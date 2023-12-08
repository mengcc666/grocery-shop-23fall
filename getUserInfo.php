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
        die(json_encode(['success' => false, 'error' => 'Connection failed: ' . $conn->connect_error]));
    }

    // Check if 'username' is provided in the GET request
    if (isset($_POST['username'])) {
        $username = $_POST['username'];

        // Query to select userId based on the username
        $query = "SELECT customerId FROM users WHERE username = ?";
        $stmt = $conn->prepare($query);

        // Check if the prepare was successful
        if ($stmt === false) {
            die(json_encode(['success' => false, 'error' => $conn->error]));
        }

        $stmt->bind_param('s', $username);
        $stmt->execute();
        $stmt->bind_result($userId);

        // Check if a result is found
        if ($stmt->fetch()) {
            echo json_encode(['success' => true, 'userId' => $userId]);
        } else {
            echo json_encode(['success' => false, 'error' => 'User not found']);
        }

        // Close the database connection
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'Username not provided']);
    }

    $conn->close();
} catch (Exception $e) {
    // Handle database connection errors
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
