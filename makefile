ifndef BASE_DIR
	BASE_DIR=$(CURDIR)/app
endif
ifndef PORT
	PORT=4000
endif
ifndef MONGOURL
	MONGOURL='mongodb://localhost:4001/lazycook'
endif
ifndef KARMA_BIN
	KARMA_BIN='node_modules/karma/bin/karma'
endif
ifndef NODE_BIN
	NODE_BIN='node'
endif
ifndef NODEMON_BIN
	NODEMON_BIN='nodemon'
endif
ifndef MONGOD_BIN
	MONGOD_BIN='mongod'
endif
ifndef MONGO_BIN
	MONGO_BIN='mongo'
endif
ifndef MOCHA_BIN
	MOCHA_BIN='node_modules/mocha/bin/mocha'
endif

node_modules:
	npm install

karma:
	@echo ""
	@echo "Starting Karma Server (http://karma-runner.github.io)"
	@echo "-------------------------------------------------------------------"

ib_tests: node_modules karma
	@MONGOURL=${MONGOURL}_tests PORT=${PORT} ${KARMA_BIN} start ${BASE_DIR}/config/karma-unit-browser.conf.js $*

e2e_tests: node_modules karma
	@MONGOURL=${MONGOURL}_tests PORT=${PORT} ${KARMA_BIN} start ${BASE_DIR}/config/karma-e2e.conf.js $*

u_tests: node_modules
	@MONGOURL=${MONGOURL}_tests PORT=${PORT} ${MOCHA_BIN} ${BASE_DIR}/test/unit-server/

tests: u_tests ib_tests e2e_tests
	@echo "All tests done"

dev: node_modules
	@echo ""
	@echo "Starting server (dev)"
	@echo "-------------------------------------------------------------------"
	@MONGOURL=${MONGOURL} NODE_ENV=dev PORT=${PORT} ${NODEMON_BIN} ${BASE_DIR}/app.js

prod: node_modules
	@echo ""
	@echo "Starting server (prod)"
	@echo "-------------------------------------------------------------------"
	@MONGOURL=${MONGOURL} NODE_ENV=prod PORT=${PORT} ${NODE_BIN} ${BASE_DIR}/app.js

mongodb:
	@mkdir -p mongodb
	@chown `id -u` mongodb

db: mongodb
	@echo ""
	@echo "Starting database"
	@echo "-------------------------------------------------------------------"
	${MONGOD_BIN} --config ${BASE_DIR}/config/mongod.conf --dbpath ./mongodb/ --port $(shell echo ${PORT}+1 | bc)

dbstop:
	@echo "Stopping database"
	${MONGO_BIN} admin --port $(shell echo ${PORT}+1 | bc) --eval "db.shutdownServer();"

dbreset: mongodb
	@echo "Resetting DB"
	@MONGOURL=${MONGOURL} PORT=${PORT} ${NODE_BIN} ${BASE_DIR}/dbreset.js

dbconsole:
	@echo "Connecting to mongodb"
	@${MONGO_BIN} --port $(shell echo ${PORT}+1 | bc)