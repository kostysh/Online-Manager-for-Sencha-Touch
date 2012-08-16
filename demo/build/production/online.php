<?php
header("Pragma: no-cache");
header("Cache-Control: no-cache, must-revalidate, post-check=0, pre-check=0");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
header('Content-type: application/json; charset=utf-8');
echo '{"time":' . time() . '}';
exit();
?>
