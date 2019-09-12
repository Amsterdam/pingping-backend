PWD ?= pwd_unknown

THIS_FILE := $(lastword $(MAKEFILE_LIST))
CMD_ARGUMENTS ?= $(cmd)

target = latest
cid = $(docker ps -aqf name=pingping-backend_api)

help:
	@echo ''
	@echo 'Usage: make [TARGET] [EXTRA_ARGUMENTS]'
	@echo 'Targets:'
	@echo '  build    	prepare for deployment'
	@echo '  run    	run on production'
	@echo '  shell    	attach docker shell'
	@echo '  pull    	pull from git'
	@echo '  help    	this message'

build:
	@echo  'Prepare for deployment, make certificate etc'

run:
	@echo  'Running pingping'
	docker-compose up

shell:
	@echo  "Attaching shell to $cid"
	docker exec -it $cid bash

pull:
	git pull