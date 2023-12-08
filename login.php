<?php
$host = 'localhost:3306';
$dbname = 'wplas5';
$username = 'root';
$password = '';

try {
    // Check if the raw POST data is available
    $rawPostData = file_get_contents("php://input");
    $postData = json_decode($rawPostData, true);

    // Check if the required keys are present in the decoded JSON
    if (isset($postData['username']) && isset($postData['password'])) {
        // Connect to the database using mysqli
        $conn = new mysqli($host, $username, $password, $dbname);

        // Check the connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // Get the username and password from the decoded JSON
        $username = $postData['username'];
        $password = $postData['password'];

        // Initialize usertype to 'customer' by default
        $usertype = 'customer';

        // Check if the username and password match the admin credentials
        if ($username === 'admin' && $password === 'admin') {
            $usertype = 'admin';
        }

        // Prepare and execute the SQL query
        $stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
        $stmt->bind_param('ss', $username, $password);
        $stmt->execute();

        // Check if a matching record is found
        $result = $stmt->get_result()->fetch_assoc();

        // Return success with usertype if a record is found, otherwise return failure
        if ($result !== null || $usertype=='admin') {
            echo json_encode(['success' => true, 'usertype' => $usertype]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
        }

        // Close the database connection
        $conn->close();
    } else {
        // If 'username' or 'password' is not set in the JSON data
        echo json_encode(['success' => false, 'error' => 'Invalid request']);
    }
} catch (Exception $e) {
    // Handle other exceptions
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>