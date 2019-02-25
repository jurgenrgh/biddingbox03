#!/usr/bin/bash

echo "Run Documentation. Output to www/docs."
documentation build ./www/js/** -f html -o ./www/js/docs -c ./www/js/documentation.yml