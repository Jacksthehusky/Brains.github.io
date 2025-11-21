<?php
header("Content-Type: application/json");

// Allow POST only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Only POST method allowed"]);
    exit;
}

// Get JSON input
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

if (!isset($data['id']) || !isset($data['action'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields: id and action"]);
    exit;
}

$questionId = intval($data['id']);
$action = $data['action']; // "like" or "dislike"

if (!in_array($action, ['like', 'dislike'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid action"]);
    exit;
}

// Path to JSON file
$jsonPath = __DIR__ . "/../data/questions.json";

if (!file_exists($jsonPath)) {
    http_response_code(500);
    echo json_encode(["error" => "Questions file not found"]);
    exit;
}

// Rate limiting check (using simple timestamp storage)
$clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitKey = "rate_{$questionId}_{$clientIP}";
$rateLimitFile = __DIR__ . "/../data/rate_limits.json";

// Check rate limiting
if (file_exists($rateLimitFile)) {
    $rateLimits = json_decode(file_get_contents($rateLimitFile), true) ?: [];
    $lastVoteTime = $rateLimits[$rateLimitKey] ?? 0;
    
    if (time() - $lastVoteTime < 3600) {
        http_response_code(429);
        echo json_encode(["error" => "Vote rate limit exceeded. Please try again later."]);
        exit;
    }
}

// Update rate limits
$rateLimits[$rateLimitKey] = time();
file_put_contents($rateLimitFile, json_encode($rateLimits, JSON_PRETTY_PRINT));

// ENHANCED LOGGING (separate file for analytics)
$voteLogFile = __DIR__ . "/../data/vote_analytics.json";
$voteLog = file_exists($voteLogFile) ? json_decode(file_get_contents($voteLogFile), true) : [];

$voteId = "vote_" . time() . "_" . uniqid();
$voteLog[$voteId] = [
    'questionId' => $questionId,
    'ip' => $clientIP,
    'action' => $action,
    'timestamp' => time(),
    'userAgent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
    'date' => date('Y-m-d H:i:s')
];

file_put_contents($voteLogFile, json_encode($voteLog, JSON_PRETTY_PRINT));

// Read and update JSON with locking
$fp = fopen($jsonPath, "r+");
if (!$fp) {
    http_response_code(500);
    echo json_encode(["error" => "Could not open questions file"]);
    exit;
}

if (flock($fp, LOCK_EX)) {
    $jsonContent = file_get_contents($jsonPath);
    $questions = json_decode($jsonContent, true);

    if ($questions === null) {
        flock($fp, LOCK_UN);
        fclose($fp);
        http_response_code(500);
        echo json_encode(["error" => "Failed to decode JSON"]);
        exit;
    }

    // Find question by ID
    $found = false;
    foreach ($questions as &$q) {
        if ($q["id"] == $questionId) {
            $found = true;

            if ($action === "like") {
                $q["helpfulCount"] = ($q["helpfulCount"] ?? 0) + 1;
            } elseif ($action === "dislike") {
                $q["unhelpfulCount"] = ($q["unhelpfulCount"] ?? 0) + 1;
            }

            // Update modification timestamp
            $q["modifiedDateTime"] = date('c');
            break;
        }
    }

    if (!$found) {
        flock($fp, LOCK_UN);
        fclose($fp);
        http_response_code(404);
        echo json_encode(["error" => "Question not found"]);
        exit;
    }

    // Write back to file with proper formatting
    ftruncate($fp, 0);
    rewind($fp);

    // Encode with pretty print and no unnecessary escaping
    $jsonString = json_encode($questions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    // Optional: Adjust formatting to match your original style
    $jsonString = str_replace('    ', '  ', $jsonString); // 2-space indentation

    // Ensure consistent LF line endings
    $jsonString = str_replace("\r\n", "\n", $jsonString);
    $jsonString = str_replace("\r", "\n", $jsonString);

    fwrite($fp, $jsonString);
    flock($fp, LOCK_UN);
    fclose($fp);

    // Update rate limiting log
    $voteLog = file_exists($rateLimitFile) ? json_decode(file_get_contents($rateLimitFile), true) : [];
    $voteLog[$rateLimitKey] = time();
    file_put_contents($rateLimitFile, json_encode($voteLog, JSON_PRETTY_PRINT));

    echo json_encode([
        "success" => true, 
        "id" => $questionId, 
        "action" => $action,
        "helpfulCount" => $questions[array_search($questionId, array_column($questions, 'id'))]["helpfulCount"] ?? 0,
        "unhelpfulCount" => $questions[array_search($questionId, array_column($questions, 'id'))]["unhelpfulCount"] ?? 0
    ]);
    exit;

} else {
    fclose($fp);
    http_response_code(500);
    echo json_encode(["error" => "Could not lock file for writing"]);
    exit;
}