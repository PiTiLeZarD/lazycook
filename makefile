ifndef BASE_DIR
        BASE_DIR=$(CURDIR)/app
endif

node_modules:
	npm install ${BASE_DIR}/

tests: node_modules
	@echo ""
	@echo "Starting Karma Server (http://karma-runner.github.io)"
	@echo "-------------------------------------------------------------------"
	node_modules/karma/bin/karma start ${BASE_DIR}/config/karma.conf.js $*

dev: node_modules 
	@echo ""
	@echo "Starting server (dev)"
	@echo "-------------------------------------------------------------------"
	nodemon ${BASE_DIR}/app.js