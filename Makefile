PWD ?= pwd_unknown

THIS_FILE := $(lastword $(MAKEFILE_LIST))
CMD_ARGUMENTS ?= $(cmd)

target = latest
cid := $(shell docker ps -aqf name=api)

help:
	@echo ''
	@echo 'Usage: make [TARGET] [EXTRA_ARGUMENTS]'
	@echo 'Targets:'
	@echo '  build    	prepare for deployment'
	@echo '  run    	run on production'
	@echo '  run-dev    run in development mode'
	@echo '  shell    	attach docker shell'
	@echo '  pull    	pull from git'
	@echo '  create-superuser    	create django superuser'
	@echo '  help    	this message'

build:
	@echo  'Prepare for deployment, make certificate etc'

run:
	@echo  'Running pingping'
	docker-compose up
	docker-compose -f docker-compose.yml up

run-dev:
	@echo  'Running pingping in development mode'
	@echo  'Make sure add "127.0.0.1       api.pingping.test app.pingping.test" to your hosts file'
	DOMAIN=pingping.test docker-compose -f docker-compose.dev.yml up

shell:
	# cid:=docker ps -aqf "name=api"	
	@echo  "Attaching shell to $(cid)"
	docker ps -aqf name=pingping-backend_api
	docker exec -it $(cid) bash

create-superuser:
	@echo  "Create superuser"
	docker exec -it $(cid) python manage.py createsuperuser

pull:
	git pull