basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'public/js/angular.js',
  'public/js/controllers.js',
  'test/lib/angular-mocks.js',
  'test/unit/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
