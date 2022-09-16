#!/bin/bash

docker run --rm -itv $(pwd):/app -u $(id -u):$(id -g) -w /app php-blog php ./vendor/bin/sculpin generate --env=prod
if [ $? -ne 0 ]; then echo "Could not generate the site"; exit 1; fi

yarn run deploy
if [ $? -ne 0 ]; then echo "Could not publish the site"; exit 1; fi
