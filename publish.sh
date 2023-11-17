#!/bin/bash

yarn encore prod
if [ $? -ne 0 ]; then echo "Could not build the assets"; exit 1; fi

docker run --rm -itv $(pwd):/app -u $(id -u):$(id -g) -w /app php-blog php ./vendor/bin/sculpin generate --env=prod
if [ $? -ne 0 ]; then echo "Could not generate the site"; exit 1; fi

docker run --rm -itv $(pwd):/app -u $(id -u):$(id -g) -w /app php-blog php thumbnails-generator.php
if [ $? -ne 0 ]; then echo "Erro ao gerar thumbs"; exit 1; fi

yarn run deploy
if [ $? -ne 0 ]; then echo "Could not publish the site"; exit 1; fi
