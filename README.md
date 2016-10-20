# lazycook framework

(This is still a work in progress framework)

A boilerplate for your nodeJS apps. You need to have a new app kicking off? Use this, and more than half of the job is done already. All bundled frameworks are preconfigured in a sleak organization.

The main [app.js](https://github.com/PiTiLeZarD/lazycook/blob/master/app/app.js), configures everything for you, but you develop modules that are sortof sub-apps... Each module can tweak pretty much everything, they use an easy and well known MVC pattern. 

List of modules:
 * [Auth](https://github.com/PiTiLeZarD/lazycook/tree/master/app/mods/auth) (WIP)
      Enables your apps to have users registering themselves, logging in and doing all the cool stuffs you want them to do.
 * [Contact](https://github.com/PiTiLeZarD/lazycook/tree/master/app/mods/contact) (WIP)
      Contact page ++ provides in-site mail system, and livechat support

Bundled frameworks:
 * Server: [nodeJS](http://nodejs.org/) / [expressJS](http://expressjs.com/)
 * Templating: [Jade](http://jade-lang.com/)  
 * CSS: [Stylus](http://learnboost.github.io/stylus/docs/js.html)
 * Responsive Front-end: [Foundation4](http://foundation.zurb.com)
 * JS Framework: [AngularJS](http://angularjs.org/) / [Zepto](http://zeptojs.com/)
 * DB: [MangoDB](http://www.mongodb.org/) / [mongoose](http://mongoosejs.com/)
 * Authentication: [PassportJS](http://passportjs.org/) / [simple-acl](https://github.com/chakrit/simple-acl)
 * Testing: [Karma](http://karma-runner.github.io) / [Jasmine](https://jasmine.github.io/) / [PhantomJS](http://phantomjs.org/) / [Mocha](http://visionmedia.github.io/mocha/) / [chai](http://chaijs.com/)
 * Other: 
  * [express-validator](https://github.com/ctavan/express-validator)
  * [Connect-Flash](https://github.com/jaredhanson/connect-flash)
  * [Nodemailer](https://github.com/andris9/Nodemailer)
  * [socket.io](http://socket.io/)
 
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
 * launch db with `make db` stop it with `make dbstop` and reset it with `make dbreset`
 * launch node with `make dev` (or `make prod` for production environment)
 
This should install all necessary libs and launch the node server

## Testing

I'm really far away from the perfect solution here, lots of different frameworks and writing style due to node testing and angular testing being quite different... if you have ideas, please fill me in!

### Prerequisites
 * make sure that you have [PhantomJS](http://phantomjs.org/) installed

### How to
 * `make tests` (For unit testing, runs as a continuous testing service)
 * `make e2e_tests (For end to end testing)`

## Future
 * finish the auth module with facebook/etc... auth and proper acl
 * [Wraith](http://responsivenews.co.uk/post/56884056177/wraith) ?
 * I18n L10n
 * clear out the test thingy
 * later on: SEO with sitemap and parrallel static site generation (maybe [GruntJS](http://gruntjs.com/getting-started) and PhantomJS?)
  * also later: use npm for mods (I didn't started this way, and I'd like to go on with functionalities first, I'll do some refactoring if it's a good idea)
