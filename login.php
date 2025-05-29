<?php
require 'db.php';  // Include database connection
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    // Query database for the user
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    
    // Check if user exists
    if ($stmt->num_rows > 0) {
        // Bind result to variables
        $stmt->bind_result($id, $hashed_password);
        $stmt->fetch();

        // Verify the entered password against the stored hash
        if (password_verify($password, $hashed_password)) {
            // Start session and redirect to dashboard
            $_SESSION['username'] = $username;
            header("Location: dashboard.php");
            exit();
        } else {
            echo "<script>alert('Incorrect password.'); history.back();</script>";
        }
    } else {
        echo "<script>alert('Username not found.'); history.back();</script>";
    }

    $stmt->close();
}
?>
