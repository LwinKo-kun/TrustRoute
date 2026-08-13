<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Must be a specific origin (not '*') when withCredentials: true is used on the frontend
    'allowed_origins' => [
        'http://localhost:5173',
        'http://192.168.26.118:5173', // Network IP for local network access
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Must be true to allow cookies/Authorization headers with withCredentials: true
    'supports_credentials' => true,

];