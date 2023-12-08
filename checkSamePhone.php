<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$host = "localhost:3306";
$username = "root";
$password = "";
$database = "wplas5";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    $response = array("status" => "error", "message" => "Connection failed: " . $conn->connect_error);
    header("Content-Type: application/json");
    echo json_encode($response);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        $response = array("status" => "error", "message" => "Error decoding JSON data: " . json_last_error_msg());
        header("Content-Type: application/json");
        echo json_encode($response);
        exit;
    }

    $phone = mysqli_real_escape_string($conn, $data['phone']);

    // Check if the phone number already exists in the database
    $checkPhoneQuery = "SELECT COUNT(*) AS count FROM Customers WHERE phoneNumber = '$phone'";
    $result = $conn->query($checkPhoneQuery);

    if ($result === FALSE) {
        $response = array("status" => "error", "message" => "Error checking phone number: " . $conn->error);
        header("Content-Type: application/json");
        echo json_encode($response);
        exit;
    }

    $row = $result->fetch_assoc();
    $phoneExists = $row['count'] > 0;

    $response = array("status" => "success", "phoneExists" => $phoneExists);
    header("Content-Type: application/json");
    echo json_encode($response);
} else {
    http_response_code(405); // Method Not Allowed
    echo "Method Not Allowed";
}
?>
