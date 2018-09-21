#!/bin/sh

pass=true
RED='\033[1;31m'
GREEN='\033[0;32m'
NC='\033[0m'

tslint=$(npm run lint)
ret_code=$?

if [ $ret_code != 0 ]; then
	printf "\n${RED}tslint failed:${NC}"
	echo "$tslint\n"
	pass=false
    exit 1
else
	printf "${GREEN}tslint passed.${NC}\n"
    node ./node_modules/.bin/tsc
fi


