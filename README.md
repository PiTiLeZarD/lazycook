lazycook
========

A 100% Javascript cooking app (or rather a try at it)
Using:
 * Server: NodeJS / expressJS
 * Templating: Jade  
 * CSS: Stylus / Nib
 * Visual Framework: Foundation4
 * JS Framework: AngularJS / Zepto(jQuery)
 * Testing: Karma / Jasmine / PhantomJS

Installation
============
Before:
 * OSx users should have Xcode installed before anything!
 * make sure that you have git installed (http://git-scm.com/)
 * make sure that you have nodeJS installed (http://nodejs.org/)
 * Once node is installed: npm install -g nodemon
Then the project itself:
 * git clone https://github.com/PiTiLeZarD/lazycook.git
 * cd lazycook
 * make dev 
 
This should install all necessary libs and launch the node server

Testing
=======
Before:
 * make sure that you have phantomJS installed (http://phantomjs.org/)
Then to test:
 * make tests (for unit testing, runs as a continuous testing service)
 * make e2e_tests (for end to end testing)
