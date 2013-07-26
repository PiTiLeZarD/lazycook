# lazycook

A 100% Javascript cooking app (or rather a try at it)

Using:
 * Server: [nodeJS](http://nodejs.org/) / [expressJS](http://expressjs.com/)
 * Templating: [Jade](http://jade-lang.com/)  
 * CSS: [Stylus](http://learnboost.github.io/stylus/docs/js.html) / [Nib](http://visionmedia.github.io/nib/)
 * Visual Framework: [Foundation4](foundation.zurb.com)
 * JS Framework: [AngularJS](http://angularjs.org/) / [Zepto](http://zeptojs.com/)
 * Testing: [Karma](http://karma-runner.github.io/0.8/index.html) / [Jasmine](http://pivotal.github.io/jasmine/) / [PhantomJS](http://phantomjs.org/)
 * DB: [MangoDB](http://www.mongodb.org/) / [mongoose](http://mongoosejs.com/) ORM

## Installation

### Prerequisites
 * OSx users should have [Xcode](https://developer.apple.com/xcode/) installed before anything!
 * make sure that you have 
  * [git](http://git-scm.com/) installed
  * [nodeJS](http://nodejs.org/) installed
  * [MangoDB](http://www.mongodb.org/) installed
 * Once node is installed: npm install -g nodemon
 
### How to
 * `git clone https://github.com/PiTiLeZarD/lazycook.git`
 * `cd lazycook`
 * `make dev` 
 
This should install all necessary libs and launch the node server

## Testing

### Prerequisites
 * make sure that you have [PhantomJS](http://phantomjs.org/) installed

### How to
 * make tests (for unit testing, runs as a continuous testing service)
 * make e2e_tests (for end to end testing)

## Future
 * Continue digging around AngularJS until I'm sure of what I wanna do with it
 * Create a seed with all those frameworks combined and configured already
 * Get on with it with the project, I have lots of ideas, can't wait to put them in motion
 * later on: SEO with sitemap and parrallel static site generation (maybe [GruntJS](http://gruntjs.com/getting-started) and PhantomJS?)
