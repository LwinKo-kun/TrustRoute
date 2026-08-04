<?php
return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Allow the Vite dev server and local network access
    'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://192.168.111.109:5173', 'http://0.0.0.0:5173'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Must be true to support Sanctum / cookies / tokens with credentials
    'supports_credentials' => true,

];