ifndef BASE_DIR
        BASE_DIR=$(CURDIR)/app
endif

ifndef PORT
        PORT=4000
endif

node_modules:
	npm install ${BASE_DIR}/

karma:
	@echo ""
	@echo "Starting Karma Server (http://karma-runner.github.io)"
	@echo "-------------------------------------------------------------------"

tests: node_modules karma
	node_modules/karma/bin/karma start ${BASE_DIR}/config/karma.conf.js $*

e2e_tests: node_modules karma
	node_modules/karma/bin/karma start ${BASE_DIR}/config/karma-e2e.conf.js $*

dev: node_modules 
	@echo ""
	@echo "Starting server (dev)"
	@echo "-------------------------------------------------------------------"
	@NODE_ENV=dev PORT=${PORT} nodemon ${BASE_DIR}/app.js

prod: node_modules 
	@echo ""
	@echo "Starting server (prod)"
	@echo "-------------------------------------------------------------------"
	@NODE_ENV=prod PORT=${PORT} node ${BASE_DIR}/app.js