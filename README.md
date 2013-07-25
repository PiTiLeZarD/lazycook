# lazycook

A 100% Javascript cooking app (or rather a try at it)

Using:
 [*] Server: [nodeJS](http://nodejs.org/) / [expressJS](http://expressjs.com/)
 [*] Templating: [Jade](http://jade-lang.com/)  
 [*] CSS: [Stylus](http://learnboost.github.io/stylus/docs/js.html) / [Nib](http://visionmedia.github.io/nib/)
 [*] Visual Framework: [Foundation4](foundation.zurb.com)
 [*] JS Framework: [AngularJS](http://angularjs.org/) / [Zepto](http://zeptojs.com/)
 [*] Testing: [Karma](http://karma-runner.github.io/0.8/index.html) / [Jasmine](http://pivotal.github.io/jasmine/) / [PhantomJS](http://phantomjs.org/)
 [ ] [MangoDB](http://www.mongodb.org/) / [MongoJS](https://github.com/gett/mongojs)

## Installation

### Prerequisites
 * OSx users should have [Xcode](https://developer.apple.com/xcode/) installed before anything!
 * make sure that you have [git](http://git-scm.com/) installed
 * make sure that you have [nodeJS](http://nodejs.org/) installed
 * Once node is installed: npm install -g nodemon
 
### How to
 * git clone https://github.com/PiTiLeZarD/lazycook.git
 * cd lazycook
 * make dev 
 
This should install all necessary libs and launch the node server

## Testing

### Prerequisites
 * make sure that you have [PhantomJS](http://phantomjs.org/) installed

### How to
 * make tests (for unit testing, runs as a continuous testing service)
 * make e2e_tests (for end to end testing)
