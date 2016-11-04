Package.describe({
  name: 'cesarve:autoform-bs-date-range-picker',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.1.1');
  api.use(['templating','aldeed:autoform','ecmascript','momentjs:moment']);
  api.addFiles('./bootstrap-daterangepicker/daterangepicker.css', 'client');
  api.mainModule('autoform-bs-date-range-picker.js','client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('cesarve:autoform-bs-rage-datepicker');
  api.mainModule('autoform-bs-rage-datepicker-tests.js');
});

Npm.depends({
  moment: '2.15.2'
});