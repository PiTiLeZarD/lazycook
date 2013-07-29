basePath = '../';

files = [
    JASMINE
  , JASMINE_ADAPTER

  , 'public/js/angular.js'
  , 'public/js/controllers.js'
  
  , 'test/lib/angular-mocks.js'
  , 'test/unit-browser/**/*.js'
];

autoWatch = false;
singleRun = true;

browsers = ['PhantomJS'];

junitReporter = {
    outputFile: 'unit-browser.xml'
  , suite: 'unit'
};
