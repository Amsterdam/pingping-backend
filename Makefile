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
	@echo '  run-dev	run in dev mode'
	@echo '  down 		shut down docker compose'
	@echo '  shell    	attach docker shell'
	@echo '  pull    	pull from git'
	@echo '  help    	this message'

build:
	@echo  'Prepare for deployment, make certificate etc'

run:
	@echo  'Running pingping'
	docker-compose up -d

run-dev:
	@echo  'Running pingping'
	docker-compose -f docker-compose.dev.yml up -d

down:
	@echo  'Shutdown pingping'
	docker-compose down

shell:
	@echo  "Attaching shell to $(cid)"
	docker exec -it $(cid) bash

pull:
	git pull