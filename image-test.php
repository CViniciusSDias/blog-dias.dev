<?php

declare(strict_types=1);

$files = glob(__DIR__ . '/source/_posts/*.md');

foreach ($files as $file) {
    $filePointer = fopen($file, 'r');
    fseek($filePointer, 4, SEEK_SET);
    $title = json_decode(str_replace('title: ', '', trim(fgets($filePointer))));
    fclose($filePointer);

    $image = imagecreate(1200, 630);
    $white = imagecolorallocate($image, 82, 193, 150);
    imagefill($image, 0, 0, $white);

    $black = imagecolorallocate($image, 255, 255, 255);

    $iteration = 0;
    do {
        $text = $title;

        if (strlen($text) > 35) {
            $shortened = substr($title, 0, 34);
            $lastSpace = strrpos($shortened, ' ');
            $text = substr($shortened, 0, $lastSpace);
        }
        $fontSize = 58;
        imagettftext(
            $image,
            $fontSize,
            0,
            10,
            330 + $iteration++ * ($fontSize + 10),
            $black,
            __DIR__ . '/source/assets/fonts/Baloo2-Bold.ttf',
            $text
        );

        $title = trim(substr($title, strlen($text)));
    } while ($title);

    imagepng($image, __DIR__ . '/source/assets/img/thumbs/' . basename($file, '.md') . '.png');
}
