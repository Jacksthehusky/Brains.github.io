<?php
header("Content-Type: application/json");

// Allow POST only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Only POST allowed"]);
    exit;
}

// Get payload
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['action'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid request"]);
    exit;
}

$questionId = intval($data['id']);
$action = $data['action']; // "like" or "dislike"

// Path to your JSON file
$jsonPath = __DIR__ . "/../data/questions.json";  // adjust if needed

if (!file_exists($jsonPath)) {
    http_response_code(500);
    echo json_encode(["error" => "Questions file not found"]);
    exit;
}

// Read JSON with locking
$fp = fopen($jsonPath, "r+");
if (flock($fp, LOCK_EX)) {

    $jsonContent = stream_get_contents($fp);
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

    // Truncate + rewrite file
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($questions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    flock($fp, LOCK_UN);
    fclose($fp);

    echo json_encode(["success" => true, "id" => $questionId, "action" => $action]);
    exit;

} else {
    fclose($fp);
    http_response_code(500);
    echo json_encode(["error" => "Could not lock file"]);
    exit;
}
