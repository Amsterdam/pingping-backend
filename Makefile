PWD ?= pwd_unknown

THIS_FILE := $(lastword $(MAKEFILE_LIST))
CMD_ARGUMENTS ?= $(cmd)

target = latest

help:
	@echo ''
	@echo 'Usage: make [TARGET] [EXTRA_ARGUMENTS]'
	@echo 'Targets:'
	@echo '  build    	prepare for deployment'
	@echo '  pull    	pull from git'
	@echo '  help    	this message'

build:
	@echo  'Prepare for deployment, make certificate etc'
	cid=$(docker ps -aqf name=pingping-backend_api)

run:
	@echo  'Running pingping'
	docker-compose up

shell:
	cid=$(docker ps -aqf name=pingping-backend_api)
	@echo  "Attaching shell to $cid"
	docker exec -it $cid bash

pull:
	git pull