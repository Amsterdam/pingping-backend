PWD ?= pwd_unknown
CMD_ARGUMENTS ?= $(cmd)

container_name = 'pp-api'

help:
	@echo ''
	@echo 'Usage: make [TARGET] [EXTRA_ARGUMENTS]'
	@echo 'Targets:'
	@echo '  run    	run on production'
	@echo '  dev		run in dev mode'
	@echo '  down 		shut down docker compose'
	@echo '  shell    	attach docker shell'
	@echo '  pull    	pull from git'
	@echo '  test    	run tests'
	@echo '  help    	this message'

run:
	@echo 'Running pingping'
	docker-compose up -d

dev:
	@echo 'Running pingping'
	docker-sync-stack start
	docker-compose -f docker-compose.dev.yml up -d

down:
	@echo 'Shutdown pingping'
	docker-compose down

shell:
	@echo "Attaching shell to $(container_name)"
	docker exec -it $(container_name) bash

test:
	@echo 'Running tests'
	docker exec -it $(container_name) python3 manage.py test --no-input api.tests

pull:
	git pull