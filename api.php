<?php
/**
 * Warung Techno - Backend API
 * Compatible with PHP 7.4 - 8.x (cPanel, Apache, Nginx)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/data.json';

// Utility helper to read data.json
function loadData($file) {
    if (!file_exists($file)) {
        return [];
    }
    $raw = file_get_contents($file);
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

// Utility helper to write data.json
function saveData($file, $data) {
    return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$action = isset($_GET['action']) ? $_GET['action'] : 'get_apps';
$method = $_SERVER['REQUEST_METHOD'];

switch ($action) {
    case 'get_apps':
        $items = loadData($dataFile);
        
        // Optional search filter
        if (!empty($_GET['q'])) {
            $q = mb_strtolower(trim($_GET['q']));
            $items = array_values(array_filter($items, function($item) use ($q) {
                return (
                    strpos(mb_strtolower($item['name']), $q) !== false ||
                    strpos(mb_strtolower($item['category']), $q) !== false ||
                    strpos(mb_strtolower($item['tagline']), $q) !== false
                );
            }));
        }

        // Optional category filter
        if (!empty($_GET['category']) && $_GET['category'] !== 'Semua') {
            $cat = trim($_GET['category']);
            $items = array_values(array_filter($items, function($item) use ($cat) {
                return $item['category'] === $cat;
            }));
        }

        // Optional single item retrieval
        if (!empty($_GET['id'])) {
            $id = trim($_GET['id']);
            foreach ($items as $item) {
                if ($item['id'] === $id) {
                    echo json_encode([
                        'status' => 'success',
                        'data' => $item
                    ]);
                    exit;
                }
            }
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Produk tidak ditemukan'
            ]);
            exit;
        }

        echo json_encode([
            'status' => 'success',
            'total' => count($items),
            'data' => $items
        ]);
        break;

    case 'create_order':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(['status' => 'error', 'message' => 'Method not allowed. Use POST.']);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            $input = $_POST;
        }

        $productName = isset($input['product_name']) ? trim($input['product_name']) : '';
        $buyerName   = isset($input['buyer_name']) ? trim($input['buyer_name']) : 'Pelanggan';
        $buyerPhone  = isset($input['buyer_phone']) ? trim($input['buyer_phone']) : '';
        $notes       = isset($input['notes']) ? trim($input['notes']) : '';

        if (empty($productName)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Nama produk wajib diisi']);
            exit;
        }

        $orderId = 'WT-' . strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));
        $adminPhone = '6281234567890'; // Ganti dengan nomor WhatsApp admin Anda

        $waMessage = "Halo Warung Techno, saya ingin order:\n"
                   . "📦 Produk: " . $productName . "\n"
                   . "👤 Nama: " . $buyerName . "\n"
                   . "🆔 Order ID: " . $orderId;
        if (!empty($notes)) {
            $waMessage .= "\n💬 Catatan: " . $notes;
        }

        $waUrl = "https://wa.me/{$adminPhone}?text=" . rawurlencode($waMessage);

        echo json_encode([
            'status' => 'success',
            'message' => 'Pesanan berhasil disiapkan',
            'order_id' => $orderId,
            'whatsapp_url' => $waUrl
        ]);
        break;

    default:
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Aksi tidak dikenal'
        ]);
        break;
}
