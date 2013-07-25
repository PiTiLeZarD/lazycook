basePath = '../';

files = [
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,

  'test/e2e/**/*.js'
];

browsers = ['PhantomJS'];

autoWatch = false;
singleRun = true;

urlRoot = '/_karma_/';
proxies = {
  '/': 'http://localhost:4000/'
};

junitReporter = {
  outputFile: 'e2e.xml',
  suite: 'e2e'
};
