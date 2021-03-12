<?php

$params = [
    'adminEmail' => 'mootje@gooddeals.shopping',
    'apiToken' => 'f57efaf5b8c5089db03cd2c6350d7bc2',
    'apiMarker' => '192357',
    'apiResponseLang' => 'en', // Response language : en,ru,de,es,fr,it,pl,th.
    'title' => 'Our Cheap Tickets', // Title of your app
    'baseUrl' => ''
];

// Don't change anything below this line
$localParamsPath = __DIR__ . DIRECTORY_SEPARATOR . 'params_local.php';
if (file_exists($localParamsPath))
    $params = array_merge($params, require($localParamsPath));

return $params;

