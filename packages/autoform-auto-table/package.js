Package.describe({
  name: 'cesarve:autoform-auto-table',
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
  api.versionsFrom('1.4.2.3');
  api.use(['ecmascript']);
  api.use(['templating'],'client');
  api.use('cesarve:auto-table');
  api.mainModule('autoform-auto-table.js','client');
});

