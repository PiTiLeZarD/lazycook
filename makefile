ifndef BASE_DIR
        BASE_DIR=$(CURDIR)
endif

node_modules:
	npm install

tests: node_modules
	@echo ""
	@echo "Starting Karma Server (http://karma-runner.github.io)"
	@echo "-------------------------------------------------------------------"
	node_modules/karma/bin/karma start ${BASE_DIR}/config/karma.conf.js $*

app: node_modules 
	@echo ""
	@echo "Starting server"
	@echo "-------------------------------------------------------------------"
	nodemon app.js