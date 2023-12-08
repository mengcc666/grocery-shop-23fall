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

function generateCustomerID($conn)
{
    $query = "SELECT MAX(CustomerID) AS maxID FROM Customers";
    $result = $conn->query($query);

    if ($result === FALSE || $result->num_rows == 0) {
        return 1;
    }

    $row = $result->fetch_assoc();
    $maxID = $row['maxID'];
    return $maxID + 1;
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

    $userName = mysqli_real_escape_string($conn, $data['userName']);
    $password = mysqli_real_escape_string($conn, $data['password']);
    $firstName = mysqli_real_escape_string($conn, $data['firstName']);
    $lastName = mysqli_real_escape_string($conn, $data['lastName']);
    $dob = mysqli_real_escape_string($conn, $data['dob']);
    $email = mysqli_real_escape_string($conn, $data['email']);
    $address = mysqli_real_escape_string($conn, $data['address']);
    $phone = mysqli_real_escape_string($conn, $data['phone']);

    if (!empty($dob)) {
        // Assuming dateOfBirth is in the format MM/DD/YYYY
        $dobParts = explode('/', $dob);
        if (count($dobParts) === 3) {
            $dob = $dobParts[2] . '-' . $dobParts[0] . '-' . $dobParts[1];
            $birthDate = new DateTime($dob);
            $today = new DateTime();
            $age = $today->diff($birthDate)->y;
        } else {
            $response = array("status" => "failed", "message" => "Invalid date of birth format. Please enter a valid date.");
            header("Content-Type: application/json");
            echo json_encode($response);
            exit;
        }
    } else {
        $response = array("status" => "failed", "message" => "Date of birth is required.");
        header("Content-Type: application/json");
        echo json_encode($response);
        exit;
    }

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

    if ($phoneExists) {
        $response = array("status" => "failed", "message" => "Phone number already exists.");
        header("Content-Type: application/json");
        echo json_encode($response);
        exit;
    }

    $customerID = generateCustomerID($conn);

    $insertCustomersQuery = "INSERT INTO Customers (CustomerID, FirstName, LastName, DateOfBirth, Email, Address, phoneNumber, age) VALUES ('$customerID', '$firstName', '$lastName', '$dob', '$email', '$address', '$phone', '$age')";

    if ($conn->query($insertCustomersQuery) !== TRUE) {
        $response = array("status" => "failed", "message" => "Error inserting into Customers table: " . $conn->error);
        header("Content-Type: application/json");
        echo json_encode($response);
        exit;
    }

    $insertUsersQuery = "INSERT INTO Users (CustomerID, UserName, Password, phone) VALUES ('$customerID', '$userName', '$password', '$phone')";


    if ($conn->query($insertUsersQuery) !== TRUE) {
        $response = array("status" => "failed", "message" => "Error inserting into Users table: " . $conn->error);
        header("Content-Type: application/json");
        echo json_encode($response);
        exit;
    }

    $response = array("status" => "success", "message" => "Registration successful!");
    header("Content-Type: application/json");
    echo json_encode($response);

    $conn->close();
} else {
    http_response_code(405); // Method Not Allowed
    echo "Method Not Allowed";
}

function validateDate($date, $format = 'Y-m-d H:i:s')
{
    $dateTime = DateTime::createFromFormat($format, $date);
    return $dateTime && $dateTime->format($format) == $date;
}
?>