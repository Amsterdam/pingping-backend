PWD ?= pwd_unknown

THIS_FILE := $(lastword $(MAKEFILE_LIST))
CMD_ARGUMENTS ?= $(cmd)

target = latest
docker_login_2 := $(shell aws2 ecr get-login --region eu-central-1 --no-include-email)
docker_login := $(shell aws ecr get-login --region eu-central-1 --no-include-email)

help:		## Show this help.
	@echo "-------"
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'
	@echo "-------"

machine:	## Docker exec into api machine
	docker exec -it api bash

machine-logs:	## View logs from api machine
	docker logs api

mongo:		## Docker exec into mongo machine
	docker exec -it mongo mongo

mongo-logs:	## View logs from mongo machine
	docker logs mongo

deploy: 	## Run deployment
	@eval $$(docker_login)
	git pull
	docker-compose down
	docker-compose build
	docker-compose up -d --force-recreate