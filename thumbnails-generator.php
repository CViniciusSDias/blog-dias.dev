<?php

declare(strict_types=1);

$files = glob(__DIR__ . '/source/_posts/*.md');

foreach ($files as $file) {
    $title = getTitle($file);

    $image = imagecreate(1200, 630);
    $backgroundColor = imagecolorallocate($image, 82, 193, 150);
    imagefill($image, 0, 0, $backgroundColor);
    unset($backgroundColor);

    $textColor = imagecolorallocate($image, 255, 255, 255);

    $iteration = 0;
    do {
        $currentLine = getLineFromTitle($title);
        writeLineToImage($image, $iteration++, $textColor, $currentLine);

        $remainingOfTheTitle = substr($title, offset: strlen($currentLine));
        $title = trim($remainingOfTheTitle);
    } while (!empty($title));

    imagepng($image, __DIR__ . '/source/assets/img/thumbs/' . basename($file, '.md') . '.png');

    imagedestroy($image);
}

function getTitle(string $file): mixed
{
    $filePointer = fopen($file, 'r');
    fseek($filePointer, 4, SEEK_SET);

    $titleLine = trim(fgets($filePointer));
    $title = str_replace('title: ', '', $titleLine);
    $decodedTitle = json_decode($title);

    fclose($filePointer);

    return $decodedTitle;
}

function getLineFromTitle(string $title): string
{
    if (strlen($title) <= 32) {
        return $title;
    }

    $limitedText = substr($title, 0, 32);
    $lastSpacePosition = strrpos($limitedText, ' ');

    return substr($limitedText, 0, $lastSpacePosition);
}

function writeLineToImage(GdImage $image, int $multiplier, int $textColor, string $text): void
{
    $fontSize = 58;
    $lineSpacing = 10;
    $leftStartPosition = 30;
    $topStartPosition = 330;

    imagettftext(
        $image,
        $fontSize,
        0,
        $leftStartPosition,
        $topStartPosition + $multiplier * ($fontSize + $lineSpacing),
        $textColor,
        __DIR__ . '/source/assets/fonts/Baloo2-Bold.ttf',
        $text
    );
}
