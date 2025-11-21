<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Check if user is authenticated
$authenticated = isset($_SESSION['admin_authenticated']) && $_SESSION['admin_authenticated'] === true;

// Optional: Add session timeout (e.g., 8 hours)
if ($authenticated && isset($_SESSION['login_time'])) {
    $session_duration = 8 * 60 * 60; // 8 hours
    if (time() - $_SESSION['login_time'] > $session_duration) {
        // Session expired
        session_destroy();
        $authenticated = false;
    }
}

echo json_encode([
    'authenticated' => $authenticated,
    'username' => $authenticated ? ($_SESSION['admin_username'] ?? 'Admin') : null
]);
?>